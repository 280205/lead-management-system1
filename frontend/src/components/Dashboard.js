import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../App';
import LeadForm from './LeadForm';
import FilterPanel from './FilterPanel';

// Actions Cell Renderer Component
const ActionsCellRenderer = (props) => {
  const handleEdit = () => {
    if (window.dashboardHandlers && window.dashboardHandlers.handleEdit) {
      window.dashboardHandlers.handleEdit(props.data);
    }
  };

  const handleDelete = () => {
    if (window.dashboardHandlers && window.dashboardHandlers.handleDelete) {
      window.dashboardHandlers.handleDelete(props.data.id);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
      <button
        onClick={handleEdit}
        style={{
          padding: '4px 8px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '500'
        }}
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        style={{
          padding: '4px 8px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '500'
        }}
      >
        Delete
      </button>
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Filters state
  const [filters, setFilters] = useState({});

  const fetchLeads = useCallback(async (page = 1, limit = 20, currentFilters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      // Add filters to params
      Object.entries(currentFilters).forEach(([field, filter]) => {
        if (filter && Object.keys(filter).length > 0) {
          params.append(`filter_${field}`, JSON.stringify(filter));
        }
      });

      console.log('Fetching leads with URL:', `/leads?${params}`);
      console.log('Filters being applied:', currentFilters);
      
      const response = await axios.get(`/leads?${params}`);
      const { data, ...paginationData } = response.data;
      
      setLeads(data);
      setPagination(paginationData);
    } catch (error) {
      console.error('Fetch leads error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch leads';
      toast.error(`Failed to fetch leads: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads(1, 20, filters);
  }, [fetchLeads, filters]);

  const handleCreateLead = async (leadData) => {
    try {
      await axios.post('/leads', leadData);
      toast.success('Lead created successfully');
      setShowForm(false);
      fetchLeads(pagination.page, pagination.limit, filters);
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create lead';
      toast.error(message);
    }
  };

  const handleUpdateLead = async (leadData) => {
    try {
      await axios.put(`/leads/${editingLead.id}`, leadData);
      toast.success('Lead updated successfully');
      setShowForm(false);
      setEditingLead(null);
      fetchLeads(pagination.page, pagination.limit, filters);
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update lead';
      toast.error(message);
    }
  };

  const handleDeleteLead = useCallback(async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    try {
      await axios.delete(`/leads/${leadId}`);
      toast.success('Lead deleted successfully');
      fetchLeads(pagination.page, pagination.limit, filters);
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to delete lead';
      toast.error(message);
    }
  }, [fetchLeads, pagination.page, pagination.limit, filters]);

  const handleEditClick = useCallback((lead) => {
    setEditingLead(lead);
    setShowForm(true);
  }, []);

  // Set up global handlers for ActionsCellRenderer
  useEffect(() => {
    window.dashboardHandlers = {
      handleEdit: handleEditClick,
      handleDelete: handleDeleteLead
    };

    return () => {
      delete window.dashboardHandlers;
    };
  }, [handleEditClick, handleDeleteLead]);

  const handlePageChange = (newPage) => {
    fetchLeads(newPage, pagination.limit, filters);
  };

  const handleLimitChange = (newLimit) => {
    fetchLeads(1, newLimit, filters);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    fetchLeads(1, pagination.limit, newFilters);
  };

  // AG Grid column definitions
  const columnDefs = useMemo(() => [
    {
      field: 'firstName',
      headerName: 'First Name',
      sortable: true,
      filter: true,
      width: 120
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      sortable: true,
      filter: true,
      width: 120
    },
    {
      field: 'email',
      headerName: 'Email',
      sortable: true,
      filter: true,
      width: 200
    },
    {
      field: 'phone',
      headerName: 'Phone',
      sortable: true,
      width: 130
    },
    {
      field: 'company',
      headerName: 'Company',
      sortable: true,
      filter: true,
      width: 150
    },
    {
      field: 'city',
      headerName: 'City',
      sortable: true,
      filter: true,
      width: 100
    },
    {
      field: 'state',
      headerName: 'State',
      sortable: true,
      width: 80
    },
    {
      field: 'source',
      headerName: 'Source',
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params) => {
        const sourceLabels = {
          'WEBSITE': 'Website',
          'FACEBOOK_ADS': 'Facebook Ads',
          'GOOGLE_ADS': 'Google Ads',
          'REFERRAL': 'Referral',
          'EVENTS': 'Events',
          'OTHER': 'Other'
        };
        return sourceLabels[params.value] || params.value;
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: true,
      filter: true,
      width: 110,
      cellRenderer: (params) => {
        const statusColors = {
          'NEW': '#f59e0b',
          'CONTACTED': '#3b82f6',
          'QUALIFIED': '#10b981',
          'LOST': '#ef4444',
          'WON': '#22c55e'
        };
        const color = statusColors[params.value] || '#6b7280';
        return React.createElement('span', {
          style: { color: color, fontWeight: '500' }
        }, params.value);
      }
    },
    {
      field: 'score',
      headerName: 'Score',
      sortable: true,
      filter: 'agNumberColumnFilter',
      width: 80,
      cellRenderer: (params) => {
        const score = params.value;
        let color = '#ef4444'; // red for low
        if (score >= 70) color = '#22c55e'; // green for high
        else if (score >= 40) color = '#f59e0b'; // yellow for medium
        return React.createElement('span', {
          style: { color: color, fontWeight: '500' }
        }, score);
      }
    },
    {
      field: 'leadValue',
      headerName: 'Lead Value',
      sortable: true,
      filter: 'agNumberColumnFilter',
      width: 120,
      cellRenderer: (params) => {
        return params.value ? `₹${Number(params.value).toLocaleString()}` : '-';
      }
    },
    {
      field: 'isQualified',
      headerName: 'Qualified',
      sortable: true,
      width: 100,
      cellRenderer: (params) => {
        return params.value ? 
          React.createElement('span', {
            style: { color: '#22c55e' }
          }, '✓ Yes') : 
          React.createElement('span', {
            style: { color: '#6b7280' }
          }, '✗ No');
      }
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      sortable: true,
      width: 110,
      cellRenderer: (params) => {
        return new Date(params.value).toLocaleDateString();
      }
    },
    {
      headerName: 'Actions',
      width: 120,
      cellRenderer: ActionsCellRenderer,
      pinned: 'right',
      sortable: false,
      filter: false
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: false
  }), []);

  const onGridReady = (params) => {
    // Grid is ready
  };

  if (loading && leads.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner" style={{ width: '32px', height: '32px' }}></div>
        <span style={{ marginLeft: '12px' }}>Loading leads...</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              Lead Management System
            </h1>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>
              Welcome back, {user?.firstName} {user?.lastName}
            </p>
          </div>
          <button onClick={logout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px' }}>
        {/* Controls */}
        <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={() => {
              setEditingLead(null);
              setShowForm(true);
            }}
            className="btn btn-primary"
          >
            + Add Lead
          </button>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Showing {leads.length} of {pagination.total} leads
            </span>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={{ marginBottom: '24px' }}>
            <FilterPanel 
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        )}

        {/* Grid Container */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={leads}
              defaultColDef={defaultColDef}
              suppressPaginationPanel={true}
              onGridReady={onGridReady}
              rowHeight={40}
              headerHeight={48}
            />
          </div>

          {/* Custom Pagination */}
          <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Rows per page:</span>
              <select 
                value={pagination.limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Form Modal */}
      {showForm && (
        <LeadForm
          lead={editingLead}
          onSubmit={editingLead ? handleUpdateLead : handleCreateLead}
          onClose={() => {
            setShowForm(false);
            setEditingLead(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
