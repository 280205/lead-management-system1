import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const LeadForm = ({ lead, onSubmit, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!lead;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: lead || {}
  });

  useEffect(() => {
    if (lead) {
      reset(lead);
    }
  }, [lead, reset]);

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Convert string values to appropriate types
      const formData = {
        ...data,
        score: data.score ? parseInt(data.score) : 0,
        leadValue: data.leadValue ? parseFloat(data.leadValue) : null,
        lastActivityAt: data.lastActivityAt || null,
        isQualified: data.isQualified === 'true' || data.isQualified === true
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
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
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        width: '100%', 
        maxWidth: '600px', 
        maxHeight: '90vh', 
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ 
          padding: '24px 24px 0 24px', 
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 1
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
              {isEditing ? 'Edit Lead' : 'Create New Lead'}
            </h2>
            <button 
              onClick={onClose}
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '24px', 
                cursor: 'pointer', 
                color: '#6b7280',
                padding: '4px'
              }}
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label" htmlFor="firstName">
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                className="form-input"
                {...register('firstName', { 
                  required: 'First name is required' 
                })}
                placeholder="Nitin"
              />
              {errors.firstName && (
                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="form-label" htmlFor="lastName">
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                className="form-input"
                {...register('lastName', { 
                  required: 'Last name is required' 
                })}
                placeholder="Pandey"
              />
              {errors.lastName && (
                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label" htmlFor="email">
              Email *
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Please enter a valid email'
                }
              })}
              placeholder="nitin@example.com"
            />
            {errors.email && (
              <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                className="form-input"
                {...register('phone')}
                placeholder="+91-9876543210"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="company">
                Company
              </label>
              <input
                id="company"
                type="text"
                className="form-input"
                {...register('company')}
                placeholder="Erino"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label" htmlFor="city">
                City
              </label>
              <input
                id="city"
                type="text"
                className="form-input"
                {...register('city')}
                placeholder="Gandhinagar"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="state">
                State
              </label>
              <input
                id="state"
                type="text"
                className="form-input"
                {...register('state')}
                placeholder="Gujarat"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label" htmlFor="source">
                Source
              </label>
              <select
                id="source"
                className="form-input"
                {...register('source')}
              >
                <option value="">Select source</option>
                {sourceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className="form-input"
                {...register('status')}
              >
                <option value="">Select status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label" htmlFor="score">
                Score (0-100)
              </label>
              <input
                id="score"
                type="number"
                min="0"
                max="100"
                className="form-input"
                {...register('score', {
                  min: { value: 0, message: 'Score must be at least 0' },
                  max: { value: 100, message: 'Score must be at most 100' }
                })}
                placeholder="50"
              />
              {errors.score && (
                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                  {errors.score.message}
                </p>
              )}
            </div>

            <div>
              <label className="form-label" htmlFor="leadValue">
                Lead Value (₹)
              </label>
              <input
                id="leadValue"
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                {...register('leadValue', {
                  min: { value: 0, message: 'Lead value must be positive' }
                })}
                placeholder="1000.00"
              />
              {errors.leadValue && (
                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                  {errors.leadValue.message}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label className="form-label" htmlFor="lastActivityAt">
                Last Activity Date
              </label>
              <input
                id="lastActivityAt"
                type="datetime-local"
                className="form-input"
                {...register('lastActivityAt')}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="isQualified">
                Qualified
              </label>
              <select
                id="isQualified"
                className="form-input"
                {...register('isQualified')}
              >
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span style={{ marginLeft: '8px' }}>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </span>
                </>
              ) : (
                isEditing ? 'Update Lead' : 'Create Lead'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
