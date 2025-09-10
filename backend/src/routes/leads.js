const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// All routes are protected
router.use(authenticate);

// Validation rules
const createLeadValidation = [
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('city').optional().trim(),
  body('state').optional().trim(),
  body('source').optional().isIn(['WEBSITE', 'FACEBOOK_ADS', 'GOOGLE_ADS', 'REFERRAL', 'EVENTS', 'OTHER']),
  body('status').optional().isIn(['NEW', 'CONTACTED', 'QUALIFIED', 'LOST', 'WON']),
  body('score').optional().isInt({ min: 0, max: 100 }),
  body('leadValue').optional().isNumeric(),
  body('lastActivityAt').optional().isISO8601(),
  body('isQualified').optional().isBoolean()
];

const updateLeadValidation = [
  body('firstName').optional().trim().isLength({ min: 1 }),
  body('lastName').optional().trim().isLength({ min: 1 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('city').optional().trim(),
  body('state').optional().trim(),
  body('source').optional().isIn(['WEBSITE', 'FACEBOOK_ADS', 'GOOGLE_ADS', 'REFERRAL', 'EVENTS', 'OTHER']),
  body('status').optional().isIn(['NEW', 'CONTACTED', 'QUALIFIED', 'LOST', 'WON']),
  body('score').optional().isInt({ min: 0, max: 100 }),
  body('leadValue').optional().isNumeric(),
  body('lastActivityAt').optional().isISO8601(),
  body('isQualified').optional().isBoolean()
];

// Helper function to build where clause for filtering
const buildWhereClause = (filters, userId) => {
  const where = { userId };

  Object.entries(filters).forEach(([field, filter]) => {
    if (!filter || typeof filter !== 'object') return;
    
    console.log(`Processing filter for field: ${field}`, filter);

    const { operator, value, value2 } = filter;

    switch (field) {
      case 'email':
      case 'company':
      case 'city':
        if (operator === 'equals' && value) {
          where[field] = { equals: value };
        } else if (operator === 'contains' && value) {
          where[field] = { contains: value, mode: 'insensitive' };
        }
        break;

      case 'source':
      case 'status':
        if (operator === 'equals' && value) {
          where[field] = { equals: value.toUpperCase() };
        } else if (operator === 'in' && Array.isArray(value)) {
          where[field] = { in: value.map(v => v.toUpperCase()) };
        }
        break;

      case 'score':
      case 'leadValue':
        const numValue = parseFloat(value);
        const numValue2 = parseFloat(value2);
        
        if (operator === 'equals' && !isNaN(numValue)) {
          where[field] = { equals: numValue };
        } else if (operator === 'gt' && !isNaN(numValue)) {
          where[field] = { gt: numValue };
        } else if (operator === 'lt' && !isNaN(numValue)) {
          where[field] = { lt: numValue };
        } else if (operator === 'between' && !isNaN(numValue) && !isNaN(numValue2)) {
          where[field] = { gte: numValue, lte: numValue2 };
        }
        break;

      case 'createdAt':
      case 'lastActivityAt':
        const date1 = new Date(value);
        const date2 = new Date(value2);
        
        if (operator === 'on' && !isNaN(date1)) {
          const startOfDay = new Date(date1.setHours(0, 0, 0, 0));
          const endOfDay = new Date(date1.setHours(23, 59, 59, 999));
          where[field] = { gte: startOfDay, lte: endOfDay };
        } else if (operator === 'before' && !isNaN(date1)) {
          where[field] = { lt: date1 };
        } else if (operator === 'after' && !isNaN(date1)) {
          where[field] = { gt: date1 };
        } else if (operator === 'between' && !isNaN(date1) && !isNaN(date2)) {
          where[field] = { gte: date1, lte: date2 };
        }
        break;

      case 'isQualified':
        if (operator === 'equals' && typeof value === 'boolean') {
          where[field] = { equals: value };
        }
        break;
    }
  });

  return where;
};

// @route   POST /api/leads
// @desc    Create a new lead
// @access  Private
router.post('/', createLeadValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const leadData = {
      ...req.body,
      userId: req.user.id
    };

    // Convert lastActivityAt to Date if provided
    if (leadData.lastActivityAt) {
      leadData.lastActivityAt = new Date(leadData.lastActivityAt);
    }

    const lead = await prisma.lead.create({
      data: leadData
    });

    res.status(201).json({
      message: 'Lead created successfully',
      lead
    });
  } catch (error) {
    console.error('Create lead error:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: 'A lead with this email already exists' 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error while creating lead' 
    });
  }
});

// @route   GET /api/leads
// @desc    Get leads with pagination and filtering
// @access  Private
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    // Parse filters
    const filters = {};
    Object.keys(req.query).forEach(key => {
      if (key.startsWith('filter_')) {
        const fieldName = key.replace('filter_', '');
        try {
          filters[fieldName] = JSON.parse(req.query[key]);
        } catch (e) {
          // Ignore invalid JSON filters
          console.log('Invalid filter JSON for', key, ':', req.query[key]);
        }
      }
    });

    console.log('Parsed filters:', filters);
    const where = buildWhereClause(filters, req.user.id);
    console.log('Generated where clause:', JSON.stringify(where, null, 2));

    // Get total count and leads
    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: leads,
      page,
      limit,
      total,
      totalPages
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching leads' 
    });
  }
});

// @route   GET /api/leads/:id
// @desc    Get a single lead
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const lead = await prisma.lead.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!lead) {
      return res.status(404).json({ 
        error: 'Lead not found' 
      });
    }

    res.status(200).json({ lead });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching lead' 
    });
  }
});

// @route   PUT /api/leads/:id
// @desc    Update a lead
// @access  Private
router.put('/:id', updateLeadValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Check if lead exists and belongs to user
    const existingLead = await prisma.lead.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!existingLead) {
      return res.status(404).json({ 
        error: 'Lead not found' 
      });
    }

    const updateData = { ...req.body };
    
    // Convert lastActivityAt to Date if provided
    if (updateData.lastActivityAt) {
      updateData.lastActivityAt = new Date(updateData.lastActivityAt);
    }

    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.status(200).json({
      message: 'Lead updated successfully',
      lead
    });
  } catch (error) {
    console.error('Update lead error:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: 'A lead with this email already exists' 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error while updating lead' 
    });
  }
});

// @route   DELETE /api/leads/:id
// @desc    Delete a lead
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    // Check if lead exists and belongs to user
    const existingLead = await prisma.lead.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!existingLead) {
      return res.status(404).json({ 
        error: 'Lead not found' 
      });
    }

    await prisma.lead.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ 
      error: 'Internal server error while deleting lead' 
    });
  }
});

module.exports = router;
