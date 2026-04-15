import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  Loader2, 
  Filter, 
  Edit, 
  Trash2, 
  ArrowRight,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { dataEntryAPI } from '../services/dataEntryApi';
import { disciplineAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DETable from '../components/data-entry/DETable';
import '../styles/ManageEmployee.me.css';
import '../styles/DataEntry.css';
import '../styles/DashboardHome.css';

const DisciplinePage = () => {
  const { disciplineCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState(null); // No tab active by default
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [year, setYear] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Action verification modal state
  const [actionModal, setActionModal] = useState(null); // { type: 'edit'|'delete', row }
  const [actionPassword, setActionPassword] = useState('');
  const [actionPasswordError, setActionPasswordError] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showActionPassword, setShowActionPassword] = useState(false);

  // Fetch discipline name and year locks if needed (similar to DashboardHome)
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [dList, allRecords] = await Promise.all([
          disciplineAPI.list().catch(() => []),
          dataEntryAPI.get(year).catch(() => [])
        ]);
        setDisciplines(dList);
        setRecords(allRecords);
      } catch (err) {
        console.error('Failed to load discipline data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [year]);

  const currentDiscipline = useMemo(() => {
    return disciplines.find(d => d.code === disciplineCode) || { name: disciplineCode, code: disciplineCode };
  }, [disciplines, disciplineCode]);

  const { canView, canEdit, canDelete } = useMemo(() => {
    const isAdmin = user?.role === 'admin';
    const userPerms = user?.permissions || {};
    const p = userPerms[disciplineCode] || [];
    
    return {
      canView: isAdmin || p.includes('view') || p.includes('edit') || p.includes('update') || p.includes('delete'),
      canEdit: isAdmin || p.includes('edit') || p.includes('update'),
      canDelete: isAdmin || p.includes('delete')
    };
  }, [user, disciplineCode]);

  const filteredRecords = useMemo(() => {
    // Filter by discipline
    let filtered = records.filter(r => {
      const discList = Array.isArray(r.discipline) ? r.discipline : [r.discipline];
      return discList.includes(disciplineCode);
    });

    // Filter by tab
    if (activeTab === 'ongoing') {
      filtered = filtered.filter(r => !r.endDate || r.endDate === '');
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(r => r.endDate && r.endDate !== '');
    }

    // Filter by search term
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        (r.eventName || '').toLowerCase().includes(s) ||
        (r.eventCategory || '').toLowerCase().includes(s) ||
        (r.contactPerson || '').toLowerCase().includes(s)
      );
    }

    // Default sorting: Latest date first
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.startDate || 0);
      const dateB = new Date(b.startDate || 0);
      return dateB - dateA;
    });
  }, [records, disciplineCode, activeTab, searchTerm]);

  const handleEditRow = (row) => {
    if (!canEdit) return;
    setActionPassword('');
    setActionPasswordError('');
    setShowActionPassword(false);
    setActionModal({ type: 'edit', row });
  };

  const handleViewRow = (row) => {
    navigate(`/dashboard/data-entry/${row._id}/view`, {
      state: { 
        record: row,
        returnToPath: location.pathname
      }
    });
  };

  const handleDeleteRowClick = (row) => {
    if (!canDelete) return;
    setActionPassword('');
    setActionPasswordError('');
    setShowActionPassword(false);
    setActionModal({ type: 'delete', row });
  };

  const confirmAction = async () => {
    if (!actionPassword) {
      setActionPasswordError('Please enter your password to confirm.');
      return;
    }

    setIsActionLoading(true);
    setActionPasswordError('');
    try {
      // 1. Verify password using login API
      await authAPI.login(user.email, actionPassword);
      
      if (actionModal.type === 'edit') {
        // Navigate to edit page instead of modal
        navigate(`/dashboard/data-entry/${actionModal.row._id}/edit`, { 
          state: { 
            record: actionModal.row,
            returnToPath: location.pathname
          } 
        });
        setActionModal(null);
      } else if (actionModal.type === 'delete') {
        // Perform delete
        await dataEntryAPI.remove(actionModal.row._id, { adminPassword: actionPassword });
        setRecords(prev => prev.filter(r => r._id !== actionModal.row._id));
        setActionModal(null);
      }
    } catch (err) {
      setActionPasswordError(err.message || 'Incorrect password. Please try again.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2017;
    const yearsArr = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i).reverse();
    return yearsArr;
  }, []);

  const tabs = useMemo(() => [
    { 
      id: 'all', 
      label: 'All Records', 
      icon: <ClipboardList size={18} />,
      subtitle: 'View all records of your assigned discipline and perform permitted actions such as editing or deleting records.'
    },
    { 
      id: 'ongoing', 
      label: 'Ongoing Events', 
      icon: <Clock size={18} />,
      subtitle: 'View events that have started but are not yet completed. These records do not have an End Date.'
    },
    { 
      id: 'completed', 
      label: 'Completed Events', 
      icon: <CheckCircle2 size={18} />,
      subtitle: 'View events that have been completed and have an End Date recorded in the system.'
    }
  ], []);

  if (!canView) {
    return (
      <div className="dh-container">
        <div className="dh-header">
          <div className="dh-header-left">
            <div className="dh-logo-wrapper">
              <AlertCircle className="dh-logo-icon" />
            </div>
            <div className="dh-title-section">
              <h1 className="dh-title">Access Denied</h1>
              <p className="dh-subtitle">You do not have permission to view records for {currentDiscipline.name}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dh-container">
      {/* Header */}
      <header className="dh-header">
        <div className="dh-header-left">
          <div className="dh-logo-wrapper">
            <FileText className="dh-logo-icon" />
          </div>
          <div className="dh-title-section">
            <h1 className="dh-title">{currentDiscipline.name}</h1>
            <p className="dh-subtitle">Manage and track activities for your discipline</p>
          </div>
        </div>

        <div className="dh-header-right">
          <div className="dh-header-year-filter">
            <Calendar size={18} style={{ color: 'var(--me-primary-medium)' }} />
            <select 
              className="dh-year-select ap-select" 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="all">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </header>

      {/* Tabs - Following Admin Style */}
      <div className="manage-container" style={{ padding: 0, minHeight: 'auto' }}>
        <div className="navigation-tabs" style={{ marginBottom: 0 }}>
          <div className="tabs-container">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="tab-icon">{tab.icon}</div>
                <div className="tab-content">
                  <span className="tab-label">{tab.label}</span>
                  <span className="tab-description" style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '2px', display: 'block' }}>
                    {tab.subtitle}
                  </span>
                </div>
                {activeTab === tab.id && (
                  <div className="tab-indicator">
                    <ArrowRight size={16} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="dh-content">
        <div className="dh-search-bar" style={{ marginBottom: '20px' }}>
          {/* <div className="dh-search-wrapper">
            <Filter size={18} className="dh-search-icon" />
            <input 
              type="text" 
              placeholder="Search by event name, category or contact..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dh-search-input"
            />
          </div> */}
        </div>

        {loading ? (
          <div className="dh-loader">
            <Loader2 className="dh-spinner" />
            <p>Loading records...</p>
          </div>
        ) : activeTab ? (
          <DETable
            rows={filteredRecords}
            disciplines={disciplines}
            onView={handleViewRow}
            onEdit={activeTab !== 'completed' ? handleEditRow : undefined}
            onDelete={activeTab === 'all' ? handleDeleteRowClick : undefined}
            canView={true}
            canEdit={canEdit && activeTab !== 'completed'}
            canDelete={canDelete && activeTab === 'all'}
            canImport={false}
            canCreate={false}
            hasDataEntryEnabled={true}
            isProgramAssistant={true} // Enables sticky action column
          />
        ) : (
          <div className="ap-placeholder" style={{ marginTop: '40px' }}>
            <ClipboardList className="ap-placeholder-icon" />
            <p>Select a tab above to view the records for this discipline.</p>
          </div>
        )}
      </main>

      {/* Action Verification Modal (Edit/Delete) */}
      {actionModal && (
        <div className="me-modal-overlay">
          <div className="me-modal" onClick={(e) => e.stopPropagation()}>
            <div className="me-modal-header">
              <div className="me-modal-title">
                {actionModal.type === 'delete' ? <AlertCircle size={20} /> : <Edit size={20} />}
                {actionModal.type === 'delete' ? 'Confirm Deletion' : 'Confirm Edit'}
              </div>
              <button
                type="button"
                className="me-icon-btn"
                onClick={() => setActionModal(null)}
                aria-label="Close"
                disabled={isActionLoading}
              >
                <X size={20} />
              </button>
            </div>
            <div className="me-modal-body">
              <p className="me-modal-message">
                {actionModal.type === 'delete' 
                  ? `Are you sure you want to delete this record? This action cannot be undone.` 
                  : `Please verify your password to edit this record.`}
              </p>
              <div className="me-form-group">
                <label className="me-label">
                  <Key size={14} />
                  Enter Your Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showActionPassword ? 'text' : 'password'}
                    className={`me-input ${actionPasswordError ? 'me-input-error' : ''}`}
                    placeholder="Confirm your password"
                    value={actionPassword}
                    onChange={(e) => setActionPassword(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && confirmAction()}
                  />
                  <button
                    type="button"
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    onClick={() => setShowActionPassword(!showActionPassword)}
                  >
                    {showActionPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {actionPasswordError && (
                  <p className="me-inline-error">{actionPasswordError}</p>
                )}
              </div>
            </div>
            <div className="me-modal-footer">
              <button
                type="button"
                className="me-btn me-btn-light"
                onClick={() => setActionModal(null)}
                disabled={isActionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`me-btn ${actionModal.type === 'delete' ? 'me-btn-danger' : 'me-btn-primary'}`}
                onClick={confirmAction}
                disabled={isActionLoading || !actionPassword}
              >
                {isActionLoading ? 'Verifying...' : actionModal.type === 'delete' ? 'Confirm Delete' : 'Confirm Edit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisciplinePage;
