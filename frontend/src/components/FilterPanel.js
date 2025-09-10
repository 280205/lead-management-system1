import React, { useState } from 'react';

const FilterPanel = ({ filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const updateFilter = (field, operator, value, value2 = null) => {
    const newFilters = { ...localFilters };
    
    if (!value && !value2) {
      // Remove filter if no value
      delete newFilters[field];
    } else {
      newFilters[field] = { operator, value, ...(value2 && { value2 }) };
    }
    
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    setLocalFilters({});
    onFiltersChange({});
  };

  const sourceOptions = [
    { value: 'WEBSITE', label: 'Website' },
    { value: 'FACEBOOK_ADS', label: 'Facebook Ads' },
    { value: 'GOOGLE_ADS', label: 'Google Ads' },
    { value: 'REFERRAL', label: 'Referral' },
    { value: 'EVENTS', label: 'Events' },
    { value: 'OTHER', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'NEW', label: 'New' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'QUALIFIED', label: 'Qualified' },
    { value: 'LOST', label: 'Lost' },
    { value: 'WON', label: 'Won' }
  ];

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '24px', 
      borderRadius: '8px', 
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
          Filter Leads
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={clearFilters} className="btn btn-secondary" style={{ fontSize: '14px', padding: '6px 12px' }}>
            Clear All
          </button>
          <button onClick={applyFilters} className="btn btn-primary" style={{ fontSize: '14px', padding: '6px 12px' }}>
            Apply Filters
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Email Filter */}
        <div>
          <label className="form-label">Email</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={localFilters.email?.operator || 'contains'}
              onChange={(e) => updateFilter('email', e.target.value, localFilters.email?.value || '')}
              style={{ width: '100px', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
            >
              <option value="contains">Contains</option>
              <option value="equals">Equals</option>
            </select>
            <input
              type="text"
              value={localFilters.email?.value || ''}
              onChange={(e) => updateFilter('email', localFilters.email?.operator || 'contains', e.target.value)}
              className="form-input"
              placeholder="Enter email..."
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {/* Company Filter */}
        <div>
          <label className="form-label">Company</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={localFilters.company?.operator || 'contains'}
              onChange={(e) => updateFilter('company', e.target.value, localFilters.company?.value || '')}
              style={{ width: '100px', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
            >
              <option value="contains">Contains</option>
              <option value="equals">Equals</option>
            </select>
            <input
              type="text"
              value={localFilters.company?.value || ''}
              onChange={(e) => updateFilter('company', localFilters.company?.operator || 'contains', e.target.value)}
              className="form-input"
              placeholder="Enter company..."
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {/* City Filter */}
        <div>
          <label className="form-label">City</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={localFilters.city?.operator || 'contains'}
              onChange={(e) => updateFilter('city', e.target.value, localFilters.city?.value || '')}
              style={{ width: '100px', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
            >
              <option value="contains">Contains</option>
              <option value="equals">Equals</option>
            </select>
            <input
              type="text"
              value={localFilters.city?.value || ''}
              onChange={(e) => updateFilter('city', localFilters.city?.operator || 'contains', e.target.value)}
              className="form-input"
              placeholder="Enter city..."
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {/* Source Filter */}
        <div>
          <label className="form-label">Source</label>
          <select
            value={localFilters.source?.value || ''}
            onChange={(e) => updateFilter('source', 'equals', e.target.value)}
            className="form-input"
          >
            <option value="">All sources</option>
            {sourceOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="form-label">Status</label>
          <select
            value={localFilters.status?.value || ''}
            onChange={(e) => updateFilter('status', 'equals', e.target.value)}
            className="form-input"
          >
            <option value="">All statuses</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Score Filter */}
        <div>
          <label className="form-label">Score</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={localFilters.score?.operator || 'equals'}
              onChange={(e) => {
                const operator = e.target.value;
                const currentValue = localFilters.score?.value || '';
                const currentValue2 = localFilters.score?.value2 || '';
                updateFilter('score', operator, currentValue, operator === 'between' ? currentValue2 : null);
              }}
              style={{ width: '100px', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
            >
              <option value="equals">Equals</option>
              <option value="gt">Greater than</option>
              <option value="lt">Less than</option>
              <option value="between">Between</option>
            </select>
            <input
              type="number"
              min="0"
              max="100"
              value={localFilters.score?.value || ''}
              onChange={(e) => updateFilter('score', localFilters.score?.operator || 'equals', e.target.value, localFilters.score?.value2)}
              className="form-input"
              placeholder="Score..."
              style={{ flex: 1 }}
            />
            {localFilters.score?.operator === 'between' && (
              <input
                type="number"
                min="0"
                max="100"
                value={localFilters.score?.value2 || ''}
                onChange={(e) => updateFilter('score', 'between', localFilters.score?.value, e.target.value)}
                className="form-input"
                placeholder="To..."
                style={{ flex: 1 }}
              />
            )}
          </div>
        </div>

        {/* Lead Value Filter */}
        <div>
          <label className="form-label">Lead Value ($)</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={localFilters.leadValue?.operator || 'equals'}
              onChange={(e) => {
                const operator = e.target.value;
                const currentValue = localFilters.leadValue?.value || '';
                const currentValue2 = localFilters.leadValue?.value2 || '';
                updateFilter('leadValue', operator, currentValue, operator === 'between' ? currentValue2 : null);
              }}
              style={{ width: '100px', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
            >
              <option value="equals">Equals</option>
              <option value="gt">Greater than</option>
              <option value="lt">Less than</option>
              <option value="between">Between</option>
            </select>
            <input
              type="number"
              step="0.01"
              min="0"
              value={localFilters.leadValue?.value || ''}
              onChange={(e) => updateFilter('leadValue', localFilters.leadValue?.operator || 'equals', e.target.value, localFilters.leadValue?.value2)}
              className="form-input"
              placeholder="Amount..."
              style={{ flex: 1 }}
            />
            {localFilters.leadValue?.operator === 'between' && (
              <input
                type="number"
                step="0.01"
                min="0"
                value={localFilters.leadValue?.value2 || ''}
                onChange={(e) => updateFilter('leadValue', 'between', localFilters.leadValue?.value, e.target.value)}
                className="form-input"
                placeholder="To..."
                style={{ flex: 1 }}
              />
            )}
          </div>
        </div>

        {/* Qualified Filter */}
        <div>
          <label className="form-label">Qualified Status</label>
          <select
            value={localFilters.isQualified?.value !== undefined ? localFilters.isQualified.value.toString() : ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                updateFilter('isQualified', 'equals', null);
              } else {
                updateFilter('isQualified', 'equals', value === 'true');
              }
            }}
            className="form-input"
          >
            <option value="">All</option>
            <option value="true">Qualified</option>
            <option value="false">Not Qualified</option>
          </select>
        </div>

        {/* Created Date Filter */}
        <div>
          <label className="form-label">Created Date</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={localFilters.createdAt?.operator || 'on'}
              onChange={(e) => {
                const operator = e.target.value;
                const currentValue = localFilters.createdAt?.value || '';
                const currentValue2 = localFilters.createdAt?.value2 || '';
                updateFilter('createdAt', operator, currentValue, operator === 'between' ? currentValue2 : null);
              }}
              style={{ width: '100px', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
            >
              <option value="on">On</option>
              <option value="before">Before</option>
              <option value="after">After</option>
              <option value="between">Between</option>
            </select>
            <input
              type="date"
              value={localFilters.createdAt?.value || ''}
              onChange={(e) => updateFilter('createdAt', localFilters.createdAt?.operator || 'on', e.target.value, localFilters.createdAt?.value2)}
              className="form-input"
              style={{ flex: 1 }}
            />
            {localFilters.createdAt?.operator === 'between' && (
              <input
                type="date"
                value={localFilters.createdAt?.value2 || ''}
                onChange={(e) => updateFilter('createdAt', 'between', localFilters.createdAt?.value, e.target.value)}
                className="form-input"
                style={{ flex: 1 }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {Object.keys(localFilters).length > 0 && (
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
            Active Filters:
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.entries(localFilters).map(([field, filter]) => (
              <span 
                key={field}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  padding: '4px 8px', 
                  backgroundColor: '#dbeafe', 
                  color: '#1e40af', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  gap: '4px'
                }}
              >
                {field}: {filter.operator} {filter.value}
                {filter.value2 && ` - ${filter.value2}`}
                <button
                  onClick={() => {
                    const newFilters = { ...localFilters };
                    delete newFilters[field];
                    setLocalFilters(newFilters);
                  }}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#1e40af', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '0 2px'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
