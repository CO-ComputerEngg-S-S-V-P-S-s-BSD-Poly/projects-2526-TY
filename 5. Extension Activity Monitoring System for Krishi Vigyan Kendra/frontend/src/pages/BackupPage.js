'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Calendar,
  Info,
  ArrowUpCircle,
  Play,
  FileStack,
  Trash2,
  DatabaseBackup,
  Eye,
  X,
  Key,
  EyeOff,
  Activity,
  History,
  ShieldCheck,
  TrendingUp,
  FileJson,
  LayoutGrid,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Server,
  FileText,
  Check,
  Circle,
  HelpCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import '../styles/ManageEmployee.me.css';
import '../styles/DashboardHome.css';

const BackupPage = () => {
  const { user } = useAuth();
  const [backups, setBackups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [backupStatus, setBackupStatus] = useState(null); 
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [restorePreview, setRestorePreview] = useState(null);
  const [backupPreview, setBackupPreview] = useState(null);
  const [showBackupPreviewModal, setShowBackupPreviewModal] = useState(false);
  const [showRestoreConfirmModal, setShowRestoreConfirmModal] = useState(false);
  const [showBackupConfirmModal, setShowBackupConfirmModal] = useState(false);
  const [targetActionCollection, setTargetActionCollection] = useState(null); // 'all' or specific collection name
  
  const [latestResult, setLatestResult] = useState(null);
  const [selectedExistingDb, setSelectedExistingDb] = useState('');
  const [actionDbName, setActionDbName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [backupDisplayName, setBackupDisplayName] = useState('');
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [autoBackupDbName, setAutoBackupDbName] = useState(null);
  const [isAutoBackupLoading, setIsAutoBackupLoading] = useState(false);
  const [showAutoBackupToggleModal, setShowAutoBackupToggleModal] = useState(false);
  const [autoBackupStrategy, setAutoBackupStrategy] = useState(null); // 'new' or 'existing'

  const isAdmin = user?.role === 'admin';
  const isProgramAssistant = user?.role === 'program_assistant';
  const hasFullBackupAccess = isAdmin || isProgramAssistant;

  const [globalStats, setGlobalStats] = useState({
    totalBackups: 0,
    latestBackupDate: null,
    totalStorageSizeFormatted: '0 KB',
    totalRecords: 0
  });

  const [showAutoBackupModal, setShowAutoBackupModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const [dbStatus, setDbStatus] = useState('healthy');

  // Drill-down states
  const [drilldownCollection, setDrilldownCollection] = useState(null);
  const [recordActions, setRecordActions] = useState({}); // { collectionName: { recordId: 'keep' | 'delete' | 'ignore' } }
  const [backupDrilldownCollection, setBackupDrilldownCollection] = useState(null);
  const [backupRecordActions, setBackupRecordActions] = useState({}); // { collectionName: { recordId: 'keep' | 'ignore' } }

  useEffect(() => {
    fetchBackupHistory();
    fetchAutoBackupConfig();
  }, []);

  const fetchBackupHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminAPI.getBackupHistory();
      setBackups(data.backups || []);
      setGlobalStats(data.stats || {});
      setDbStatus(data.dbStatus || 'healthy');
    } catch (err) {
      console.error('Failed to fetch backup history:', err);
      setError('Failed to load backup history. Please check your network connection or re-login.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAutoBackupConfig = async () => {
    try {
      const response = await adminAPI.getAutoBackupConfig();
      setAutoBackupEnabled(response.enabled);
      setAutoBackupDbName(response.dbName);
    } catch (err) {
      console.error('Failed to fetch auto backup config:', err);
    }
  };

  const toggleAutoBackup = async (e) => {
    if (e) e.stopPropagation();
    
    // If we are enabling, show the strategy modal first
    if (!autoBackupEnabled) {
      setShowAutoBackupToggleModal(true);
      return;
    }

    // If disabling, just do it
    setIsAutoBackupLoading(true);
    try {
      const response = await adminAPI.updateAutoBackupConfig(false);
      setAutoBackupEnabled(response.enabled);
      setAutoBackupDbName(response.dbName);
    } catch (err) {
      setError(err.message || 'Failed to update auto backup config');
    } finally {
      setIsAutoBackupLoading(false);
    }
  };

  const confirmAutoBackupToggle = async (strategy, selectedDb = null) => {
    setIsAutoBackupLoading(true);
    try {
      let finalDbName = null;
      
      if (strategy === 'new') {
        // When strategy is 'new', we don't set a dbName, the backend will create one
        finalDbName = null;
      } else if (strategy === 'existing') {
        finalDbName = selectedDb;
      }

      const response = await adminAPI.updateAutoBackupConfig(true, finalDbName);
      setAutoBackupEnabled(response.enabled);
      setAutoBackupDbName(response.dbName);
      setShowAutoBackupToggleModal(false);
      setAutoBackupStrategy(null);
      setSelectedExistingDb('');
    } catch (err) {
      setError(err.message || 'Failed to update auto backup config');
    } finally {
      setIsAutoBackupLoading(false);
    }
  };

  const handleCreateBackup = async (existingDb = null, existingName = null, recordActions = null) => {
    // Do not hide the main table while a backup is in progress
    // Only show the top-level progress bar
    setBackupStatus('in_progress');
    setError('');
    setShowOptionsModal(false);
    setShowBackupPreviewModal(false);
    setShowBackupConfirmModal(false);

    const currentDisplayName = existingName || backupDisplayName;
    setBackupDisplayName(''); // Clear input immediately

    try {
      // Use recordActions if provided, otherwise default to backupRecordActions state formatted
      let finalActions = recordActions;
      if (!finalActions) {
        finalActions = {};
        Object.keys(backupRecordActions).forEach(collName => {
          finalActions[collName] = Object.entries(backupRecordActions[collName]).map(([id, action]) => ({
            id,
            action
          }));
        });
      }

      const result = await adminAPI.createBackup(existingDb, currentDisplayName, finalActions);
      
      setBackupStatus('success');
      setLatestResult({ ...result, type: 'backup' });
      setShowSuccessModal(true);
      setBackupRecordActions({});
      setBackupDrilldownCollection(null);
      setAdminPassword('');
      await fetchBackupHistory(); // Wait for history to refresh

    } catch (err) {
      setError(err.message || 'Failed to create backup');
    } finally {
      setBackupStatus(null); // Reset status regardless of outcome
    }
  };

  const fetchBackupPreview = async (dbName) => {
    setIsActionLoading(true);
    setError('');
    setAdminPassword('');
    setActionDbName(dbName);
    try {
      const data = await adminAPI.getIncrementalBackupPreview(dbName);
      setBackupPreview(data);
      setShowBackupPreviewModal(true);
      
      // Initialize backupRecordActions ONLY if not already initialized for this DB
      if (actionDbName !== dbName || Object.keys(backupRecordActions).length === 0) {
        const initialActions = {};
        data.preview.forEach(coll => {
          initialActions[coll.collection] = {};
          coll.recordsToBackup?.forEach(record => {
            initialActions[coll.collection][record._id] = 'keep';
          });
        });
        setBackupRecordActions(initialActions);
      }
      setBackupDrilldownCollection(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch backup preview');
    } finally {
      setIsActionLoading(false);
    }
  };

  const fetchRestorePreview = async (dbName) => {
    setIsActionLoading(true);
    setError('');
    setAdminPassword('');
    setActionDbName(dbName);
    try {
      const data = await adminAPI.getBackupPreview(dbName);
      setRestorePreview(data);
      setShowPreviewModal(true);
      
      // Initialize recordActions with 'keep' for all records ONLY if not already initialized for this DB
      if (actionDbName !== dbName || Object.keys(recordActions).length === 0) {
        const initialActions = {};
        data.preview.forEach(coll => {
          initialActions[coll.collection] = {};
          coll.recordsToRestore?.forEach(record => {
            initialActions[coll.collection][record._id] = 'keep';
          });
        });
        setRecordActions(initialActions);
      }
      setDrilldownCollection(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch restore preview');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRestore = async (explicitActions = null) => {
    if (!adminPassword) return setError('Password required');
    setIsActionLoading(true);
    setError('');

    try {
      // Use explicitActions if provided, otherwise default to recordActions state formatted
      let formattedActions = explicitActions;
      if (!formattedActions) {
        formattedActions = {};
        Object.keys(recordActions).forEach(collName => {
          formattedActions[collName] = Object.entries(recordActions[collName]).map(([id, action]) => ({
            id,
            action
          }));
        });
      }

      const result = await adminAPI.restoreBackup(actionDbName, adminPassword, formattedActions);
      setLatestResult({ ...result, backupName: actionDbName, type: 'restore' });
      setShowPreviewModal(false);
      setShowRestoreConfirmModal(false);
      setShowSuccessModal(true);
      setAdminPassword('');
      setRecordActions({});
      setDrilldownCollection(null);
    } catch (err) {
      setError(err.message || 'Failed to restore backup');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!adminPassword) return setError('Password required');
    setIsActionLoading(true);
    setError('');

    try {
      await adminAPI.deleteBackup(actionDbName, adminPassword);
      setShowDeleteModal(false);
      setAdminPassword('');
      fetchBackupHistory();
    } catch (err) {
      setError(err.message || 'Failed to delete backup');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Health Status Logic
  const healthStatus = useMemo(() => {
    if (backups.length === 0) return { status: 'Critical', color: '#ef4444', text: 'No backup taken yet' };
    
    // Find the latest activity across all backups (creation OR incremental)
    let latestActivityTime = 0;
    backups.forEach(b => {
      // Check initial creation
      const creationDate = new Date(`${b.createdDate} ${b.createdTime || '00:00'}`);
      if (!isNaN(creationDate.getTime())) {
        latestActivityTime = Math.max(latestActivityTime, creationDate.getTime());
      }
      
      // Check history (incremental/auto runs)
      b.history?.forEach(h => {
        const hDate = new Date(h.timestamp);
        if (!isNaN(hDate.getTime())) {
          latestActivityTime = Math.max(latestActivityTime, hDate.getTime());
        }
      });
    });

    if (latestActivityTime === 0) return { status: 'Critical', color: '#ef4444', text: 'No backup taken yet' };

    const now = new Date();
    const latestDate = new Date(latestActivityTime);
    const diffTime = Math.abs(now - latestDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // If on the same calendar day, it's "Today"
    const isToday = now.toLocaleDateString() === latestDate.toLocaleDateString();

    if (isToday) return { status: 'Healthy', color: '#22c55e', text: 'Last activity Today' };
    if (diffDays <= 7) return { status: 'Healthy', color: '#22c55e', text: `Last activity ${diffDays} days ago` };
    if (diffDays <= 14) return { status: 'Warning', color: '#f59e0b', text: `Last activity ${diffDays} days ago` };
    return { status: 'Critical', color: '#ef4444', text: `Last activity ${diffDays} days ago` };
  }, [backups]);

  const getBackupTypeDisplay = (b) => {
    // If it's the current auto backup DB, it's definitely an auto backup
    const isAutoTarget = b.databaseName === autoBackupDbName;
    
    // Check if it has any automatic logs in timeline or history
    const hasAutoLog = b.timeline?.some(t => t.type === 'automatic') || b.type === 'automatic';
    // Check if it has any manual logs in timeline or history
    const hasManualLog = b.timeline?.some(t => t.type === 'manual') || b.type === 'manual';

    if ((hasAutoLog || isAutoTarget) && hasManualLog) return 'Manual / Auto';
    if (hasAutoLog || isAutoTarget) return 'Auto';
    return 'Manual';
  };

  return (
    <div className="me-manage-employee-container dh-container">
      <div className="dh-header">
        <div className="dh-header-left">
          <div className="dh-logo-wrapper">
            <Database className="dh-logo-icon" />
          </div>
          <div className="dh-title-wrapper">
            <h1 className="dh-title">Database Backup</h1>
            <p className="dh-subtitle">Professional & Reliable Backup Management Dashboard.</p>
          </div>
        </div>
        <div className="dh-header-right" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* Auto Backup Card in Header */}
          {hasFullBackupAccess && (
            <div 
              onClick={() => setShowAutoBackupModal(true)}
              style={{ 
                background: 'white', 
                padding: '8px 16px', 
                borderRadius: '12px', 
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Auto Backup</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Fri at 4:00 PM</div>
              </div>
              <button 
                onClick={toggleAutoBackup}
                disabled={isAutoBackupLoading}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: isAutoBackupLoading ? 'not-allowed' : 'pointer',
                  color: autoBackupEnabled ? '#22c55e' : '#94a3b8',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {isAutoBackupLoading ? (
                  <Loader2 size={24} className="dh-spinner" />
                ) : (
                  autoBackupEnabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />
                )}
              </button>
            </div>
          )}

          {/* Backup Health Indicator */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              background: 'white', 
              padding: '8px 16px', 
              borderRadius: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              border: `1px solid ${healthStatus.color}20`
            }}
          >
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: healthStatus.color }}></div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Backup Health</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: healthStatus.color }}>{healthStatus.status} — {healthStatus.text}</div>
            </div>
          </div>
        </div>
      </div>

      <main className="dh-main" style={{ padding: '24px' }}>
        {/* Disaster Recovery Banner */}
        {dbStatus !== 'healthy' && (
          <div style={{ 
            background: '#fff7ed', 
            border: '1px solid #ffedd5', 
            padding: '16px', 
            borderRadius: '12px', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ 
              background: '#fb923c', 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white'
            }}>
              <AlertCircle size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, color: '#9a3412', fontSize: '1.1rem' }}>
                {dbStatus === 'empty' ? '⚠ Main database is empty' : '⚠ Database connection error'}
              </div>
              <p style={{ color: '#c2410c', margin: 0, fontSize: '0.9rem' }}>
                System is running in Recovery Mode. You can restore your data from the available backups below.
              </p>
            </div>
            <button 
              className="me-btn me-btn-primary" 
              style={{ background: '#ea580c', border: 'none' }}
              onClick={() => fetchBackupHistory()}
            >
              <RefreshCcw size={16} style={{ marginRight: '8px' }} />
              Refresh Status
            </button>
          </div>
        )}

        {/* Backup Progress Logs *at the top of Control Panel */}
        {isLoading && backupStatus === 'in_progress' && (
          <div className="me-section" style={{ marginBottom: '24px', border: '1px solid var(--me-primary-light)' }}>
            <h3 className="me-section-title"><Activity size={18} /> Backup in Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '40px 20px' }}>
              <div className="dh-loader" style={{ position: 'static', margin: 0 }}>
                <Loader2 className="dh-spinner" size={48} />
              </div>
              <p style={{ color: '#64748b', fontWeight: 600, textAlign: 'center' }}>
                The backup is being processed on the server. <br />This may take a few moments depending on the database size.
              </p>
            </div>
          </div>
        )}

        {/* Section 1: Overview & Control Panel */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '24px' }}>
          <div className="me-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="me-section-title" style={{ margin: 0 }}><LayoutGrid size={18} /> Backup Control Panel</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className="me-btn me-btn-light" 
                    onClick={() => setShowHelpModal(true)}
                    style={{ height: '42px', borderColor: 'var(--me-primary-medium)', color: 'var(--me-primary-medium)' }}
                  >
                    <HelpCircle size={18} style={{ marginRight: '8px' }} />
                    Backup Help Guide
                  </button>
                  {hasFullBackupAccess && (
                    <button 
                      className="me-btn me-btn-primary" 
                      onClick={() => setShowOptionsModal(true)}
                      disabled={isLoading}
                      style={{ background: 'var(--me-primary-dark)', height: '42px' }}
                    >
                      <DatabaseBackup size={18} style={{ marginRight: '8px' }} />
                      Create New Backup
                    </button>
                  )}
                </div>
             </div>
             
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Total Backups</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--me-primary-dark)' }}>{globalStats.totalBackups || 0}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Latest Backup</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--me-primary-dark)' }}>{globalStats.latestBackupDate || 'N/A'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Storage Used</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--me-primary-dark)' }}>{globalStats.totalStorageSizeFormatted || '0 KB'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Total Records</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--me-primary-dark)' }}>{globalStats.totalRecords?.toLocaleString() || 0}</div>
                </div>
             </div>
          </div>
        </div>

        {/* Section 2: Backup Table */}
        <div className="me-section">
          <div className="me-section-header">
            <h3 className="me-section-title">
              <History size={20} />
              Backup History
            </h3>
            {backupStatus === 'in_progress' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--me-primary-dark)' }}>
                <Loader2 size={18} className="dh-spinner" />
                <span style={{ fontWeight: 600 }}>Backup in progress...</span>
              </div>
            )}
          </div>
          
          <div style={{ padding: '0' }}>
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '40px' }}>
                <div className="dh-loader" style={{ position: 'static', margin: 0 }}>
                  <Loader2 className="dh-spinner" size={48} />
                </div>
                <p style={{ color: '#64748b', fontWeight: 600 }}>Processing Backup Request...</p>
              </div>
            ) : (
              <div className="me-table-wrap">
                <table className="me-table">
                  <thead>
                    <tr>
                      <th>Backup Name</th>
                      <th>Created Date</th>
                      <th>Size</th>
                      <th>Collections</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backups.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                          No backups found.
                        </td>
                      </tr>
                    ) : (
                      backups.map((b) => (
                        <tr key={b.databaseName}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '8px' }}>
                                <FileJson size={18} style={{ color: '#64748b' }} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--me-primary-dark)' }}>{b.displayName}</div>
                                <code style={{ fontSize: '0.75rem', opacity: 0.7 }}>{b.databaseName}</code>
                              </div>
                            </div>
                          </td>
                          <td>{b.createdDate} <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{b.createdTime}</span></td>
                          <td><span className="me-status-badge status-active" style={{ background: '#f1f5f9', color: '#475569' }}>{b.sizeFormatted}</span></td>
                          <td>{b.collections?.length || 0} Collections</td>
                          <td>
                            <span className={`me-status-badge ${getBackupTypeDisplay(b).includes('Auto') ? 'status-active' : 'status-pending'}`} style={{ textTransform: 'capitalize' }}>
                              {getBackupTypeDisplay(b)}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="me-btn me-btn-light" onClick={() => { setSelectedBackup(b); setShowDetailsModal(true); }} title="View Details">
                                <Eye size={16} />
                              </button>
                              {hasFullBackupAccess && (
                                <>
                                  <button className="me-btn me-btn-light" style={{ color: '#3b82f6' }} onClick={() => { setError(null); setActionDbName(b.databaseName); fetchBackupPreview(b.databaseName); }} title="Continue (Incremental)">
                                    <Play size={16} />
                                  </button>
                                  <button className="me-btn me-btn-light" style={{ color: '#166534' }} onClick={() => { setError(null); setActionDbName(b.databaseName); fetchRestorePreview(b.databaseName); }} title="Restore">
                                  <ArrowUpCircle size={16} />
                                </button>
                                <button className="me-btn me-btn-light" style={{ color: '#991b1b' }} onClick={() => { setError(null); setActionDbName(b.databaseName); setShowDeleteModal(true); }} title="Delete">
                                  <Trash2 size={16} />
                                </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Details Modal */}
      {showDetailsModal && selectedBackup && (
        <div className="me-modal-overlay">
          <div className="me-modal backup-details-modal">
            <div className="me-modal-header">
              <div className="me-modal-title"><Info size={20} /> Backup Details — {selectedBackup.displayName}</div>
              <button className="me-icon-btn" onClick={() => setShowDetailsModal(false)}><X size={20} /></button>
            </div>
            <div className="me-modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, marginBottom: '12px', letterSpacing: '0.05em' }}>General Information</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: '#64748b', fontWeight: 600 }}>Display Name:</span>
                         <span style={{ fontWeight: 700, color: 'var(--me-primary-dark)' }}>{selectedBackup.displayName}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: '#64748b', fontWeight: 600 }}>System ID:</span>
                         <code style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>{selectedBackup.databaseName}</code>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: '#64748b', fontWeight: 600 }}>Backup Type:</span>
                         <span style={{ fontWeight: 700, textTransform: 'capitalize', color: getBackupTypeDisplay(selectedBackup).includes('Auto') ? '#22c55e' : 'var(--me-primary-medium)' }}>{getBackupTypeDisplay(selectedBackup)}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: '#64748b', fontWeight: 600 }}>Timestamp:</span>
                         <span style={{ fontWeight: 700 }}>{selectedBackup.createdDate} at {selectedBackup.createdTime}</span>
                       </div>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, marginBottom: '12px', letterSpacing: '0.05em' }}>Resource Stats</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: '#64748b', fontWeight: 600 }}>Disk Usage:</span>
                         <span style={{ fontWeight: 700, color: 'var(--me-primary-dark)' }}>{selectedBackup.sizeFormatted}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: '#64748b', fontWeight: 600 }}>Total Collections:</span>
                         <span style={{ fontWeight: 700 }}>{selectedBackup.collections?.length || 0}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: '#64748b', fontWeight: 600 }}>Total Records:</span>
                         <span style={{ fontWeight: 700, color: 'var(--me-primary-medium)' }}>{selectedBackup.totalRecords || 0}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: '#64748b', fontWeight: 600 }}>Last Activity:</span>
                         <span style={{ fontWeight: 700 }}>{selectedBackup.history?.length > 0 ? new Date(selectedBackup.history[selectedBackup.history.length-1].timestamp).toLocaleDateString() : 'N/A'}</span>
                       </div>
                    </div>
                  </div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--me-primary-dark)' }}>
                      <Activity size={18} /> Collection Distribution Table
                    </h4>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead style={{ background: '#f1f5f9' }}>
                          <tr>
                            <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Collection Name</th>
                            <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Record Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedBackup.collections?.map(coll => (
                            <tr key={coll.name} style={{ borderTop: '1px solid #e2e8f0' }}>
                              <td style={{ padding: '10px 16px', fontWeight: 500 }}>{coll.name}</td>
                              <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--me-primary-medium)' }}>{coll.records.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--me-primary-dark)' }}>
                      <History size={18} /> Backup Update History
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      {selectedBackup.history?.slice().reverse().map((h, i) => (
                        <div key={i} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                          <div style={{ 
                            width: '12px', 
                            height: '12px', 
                            borderRadius: '50%', 
                            background: h.type === 'initial' ? 'var(--me-primary-medium)' : '#3b82f6', 
                            marginTop: '4px',
                            zIndex: 2
                          }}></div>
                          {i !== selectedBackup.history.length - 1 && (
                            <div style={{ position: 'absolute', left: '5px', top: '16px', bottom: '-16px', width: '2px', background: '#e2e8f0', zIndex: 1 }}></div>
                          )}
                          <div style={{ fontSize: '0.85rem', flex: 1 }}>
                             <div style={{ fontWeight: 700, color: 'var(--me-primary-dark)' }}>{h.details}</div>
                             <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>{new Date(h.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
            <div className="me-modal-footer">
               <button className="me-btn me-btn-primary" style={{ minWidth: '120px' }} onClick={() => setShowDetailsModal(false)}>Close View</button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Backup Timeline Modal */}
      {showAutoBackupModal && (
        <div className="me-modal-overlay">
          <div className="me-modal me-modal-large">
            <div className="me-modal-header">
              <div className="me-modal-title">
                <History size={20} /> 
                Auto Backup Timeline 
                {autoBackupDbName && (
                  <span style={{ marginLeft: '12px', fontSize: '0.8rem', fontWeight: 500, opacity: 0.7 }}>
                    ({backups.find(b => b.databaseName === autoBackupDbName)?.displayName || autoBackupDbName})
                  </span>
                )}
              </div>
              <button className="me-icon-btn" onClick={() => setShowAutoBackupModal(false)}><X size={20} /></button>
            </div>
            <div className="me-modal-body">
               <div className="me-table-wrap" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                  <table className="me-table">
                    <thead>
                      <tr>
                        <th>Backup Name</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Size</th>
                        <th>Records</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        // Gather logs from the configured auto backup DB, OR all automatic backups if none configured
                        let logs = [];
                        if (autoBackupDbName) {
                          const targetBackup = backups.find(b => b.databaseName === autoBackupDbName);
                          if (targetBackup && targetBackup.timeline) {
                            // STRICTLY filter for 'automatic' type logs only
                            logs = targetBackup.timeline
                              .filter(log => log.type === 'automatic')
                              .map(log => ({ ...log, displayName: targetBackup.displayName }));
                          }
                        } else {
                          // Fallback: show any backups marked as type 'automatic'
                          backups.filter(b => b.type === 'automatic').forEach(b => {
                            if (b.timeline && b.timeline.length > 0) {
                              // Filter each backup's timeline for automatic logs
                              b.timeline
                                .filter(log => log.type === 'automatic')
                                .forEach(log => logs.push({ ...log, displayName: b.displayName }));
                            } else {
                              // If no timeline array but type is automatic, it's an initial auto backup
                              logs.push({
                                displayName: b.displayName,
                                date: b.createdDate,
                                time: b.createdTime,
                                size: b.sizeFormatted,
                                recordsAdded: b.totalRecords,
                                type: 'automatic'
                              });
                            }
                          });
                        }

                        if (logs.length === 0) {
                          return <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No auto backup logs found.</td></tr>;
                        }

                        return logs.sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`)).map((log, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 600 }}>{log.displayName}</td>
                            <td>{log.date}</td>
                            <td>{log.time}</td>
                            <td>{log.size}</td>
                            <td style={{ 
                              fontWeight: 700, 
                              color: log.recordsAdded > 0 ? '#16a34a' : '#64748b'
                            }}>
                              {log.recordsAdded > 0 ? `+${log.recordsAdded}` : '0'} records
                            </td>
                            <td>
                              <span className={`me-status-badge ${log.recordsAdded > 0 ? 'status-active' : 'status-pending'}`} style={{ fontSize: '0.7rem' }}>
                                {log.recordsAdded > 0 ? 'Data Added' : 'No Changes'}
                              </span>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto Backup Toggle Strategy Modal */}
      {showAutoBackupToggleModal && (
        <div className="me-modal-overlay">
          <div className="me-modal me-modal-medium">
            <div className="me-modal-header">
              <div className="me-modal-title"><RefreshCcw size={20} /> Configure Auto Backup</div>
              <button className="me-icon-btn" onClick={() => { setShowAutoBackupToggleModal(false); setAutoBackupStrategy(null); }}><X size={20} /></button>
            </div>
            <div className="me-modal-body">
               <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.95rem' }}>
                 Choose how the system should handle automatic backups every Friday.
               </p>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div 
                    onClick={() => setAutoBackupStrategy('new')}
                    style={{ 
                      padding: '16px', 
                      borderRadius: '12px', 
                      border: `2px solid ${autoBackupStrategy === 'new' ? 'var(--me-primary-medium)' : '#e2e8f0'}`,
                      background: autoBackupStrategy === 'new' ? '#eff6ff' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '50%', 
                        border: '2px solid var(--me-primary-medium)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {autoBackupStrategy === 'new' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--me-primary-medium)' }}></div>}
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--me-primary-dark)' }}>Create New Backup Database</div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '32px' }}>
                      Starts a fresh backup database for automatic weekly snapshots.
                    </p>
                  </div>

                  <div 
                    onClick={() => setAutoBackupStrategy('existing')}
                    style={{ 
                      padding: '16px', 
                      borderRadius: '12px', 
                      border: `2px solid ${autoBackupStrategy === 'existing' ? 'var(--me-primary-medium)' : '#e2e8f0'}`,
                      background: autoBackupStrategy === 'existing' ? '#eff6ff' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '50%', 
                        border: '2px solid var(--me-primary-medium)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {autoBackupStrategy === 'existing' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--me-primary-medium)' }}></div>}
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--me-primary-dark)' }}>Continue Existing Backup Database</div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '32px' }}>
                      Append weekly data to an existing backup database.
                    </p>

                    {autoBackupStrategy === 'existing' && (
                      <div style={{ marginLeft: '32px', marginTop: '12px' }}>
                        <select 
                          className="me-input" 
                          value={selectedExistingDb} 
                          onChange={(e) => setSelectedExistingDb(e.target.value)}
                          style={{ width: '100%', padding: '10px' }}
                        >
                          <option value="">Select a backup...</option>
                          {backups.map(b => (
                            <option key={b.databaseName} value={b.databaseName}>
                              {b.displayName} ({b.createdDate})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
               </div>
            </div>
            <div className="me-modal-footer">
               <button className="me-btn me-btn-light" onClick={() => { setShowAutoBackupToggleModal(false); setAutoBackupStrategy(null); }}>Cancel</button>
               <button 
                  className="me-btn me-btn-primary" 
                  disabled={!autoBackupStrategy || (autoBackupStrategy === 'existing' && !selectedExistingDb)}
                  onClick={() => confirmAutoBackupToggle(autoBackupStrategy, selectedExistingDb)}
               >
                 Confirm & Enable
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Preview Modal (Incremental) */}
      {showBackupPreviewModal && backupPreview && (
        <div className="me-modal-overlay">
          <div className="me-modal me-modal-large" style={{ maxWidth: backupDrilldownCollection ? '900px' : '850px' }}>
            <div className="me-modal-header">
              <div className="me-modal-title">
                {backupDrilldownCollection ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button className="me-icon-btn" onClick={() => setBackupDrilldownCollection(null)} title="Back to Collections">
                      <ChevronLeft size={20} />
                    </button>
                    <span>Record Control — {backupDrilldownCollection.collection}</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={20} />
                    <span>Incremental Backup Preview</span>
                  </div>
                )}
              </div>
              <button className="me-icon-btn" onClick={() => setShowBackupPreviewModal(false)}><X size={20} /></button>
            </div>
            <div className="me-modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--me-primary-dark)' }}>{backupPreview.displayName}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Continuing from {backupPreview.createdDate}</div>
                  </div>
                  {backupDrilldownCollection && (
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--me-primary-dark)', fontWeight: 800 }}>New Records in DB: {backupDrilldownCollection.recordsToBackup.length}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--me-primary-medium)' }}>
                          Selected: {Object.values(backupRecordActions[backupDrilldownCollection.collection] || {}).filter(a => a === 'keep').length} to Backup
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="me-btn me-btn-light" 
                          style={{ fontSize: '0.75rem', padding: '4px 12px', height: 'auto', background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}
                          onClick={() => {
                            const newActions = { ...backupRecordActions };
                            newActions[backupDrilldownCollection.collection] = {};
                            backupDrilldownCollection.recordsToBackup.forEach(r => {
                              newActions[backupDrilldownCollection.collection][r._id] = 'keep';
                            });
                            setBackupRecordActions(newActions);
                          }}
                        >
                          Keep All
                        </button>
                        <button 
                          className="me-btn me-btn-light" 
                          style={{ fontSize: '0.75rem', padding: '4px 12px', height: 'auto', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}
                          onClick={() => {
                            const newActions = { ...backupRecordActions };
                            newActions[backupDrilldownCollection.collection] = {};
                            backupDrilldownCollection.recordsToBackup.forEach(r => {
                              newActions[backupDrilldownCollection.collection][r._id] = 'ignore';
                            });
                            setBackupRecordActions(newActions);
                          }}
                        >
                          Ignore All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!backupDrilldownCollection ? (
                <>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px', fontWeight: 600 }}>
                    Click on a collection with <span style={{ color: 'var(--me-primary-medium)' }}>"To Backup"</span> records to review and select them.
                  </p>
                  <div className="da-table-wrap" style={{ maxHeight: '350px' }}>
                    <table className="da-table">
                      <thead>
                        <tr>
                          <th>Collection</th>
                          <th style={{ textAlign: 'center' }}>In Backup</th>
                          <th style={{ textAlign: 'center' }}>Current DB</th>
                          <th style={{ textAlign: 'center', color: 'var(--me-primary-medium)' }}>To Backup</th>
                          <th style={{ textAlign: 'center', color: '#64748b' }}>To Ignore</th>
                        </tr>
                      </thead>
                      <tbody>
                        {backupPreview.preview.map(item => {
                          const isClickable = item.toBackup > 0;
                          
                          // Calculate counts based on current backupRecordActions state
                          const actions = backupRecordActions[item.collection] || {};
                          const toBackupCount = Object.values(actions).filter(a => a === 'keep').length;
                          const toIgnoreCount = Object.values(actions).filter(a => a === 'ignore').length;
                          const isModified = toBackupCount !== item.toBackup || toIgnoreCount > 0;

                          return (
                            <tr 
                              key={item.collection} 
                              style={{ 
                                cursor: isClickable ? 'pointer' : 'default',
                                background: isClickable ? '#fff' : '#f8fafc'
                              }}
                              onClick={() => isClickable && setBackupDrilldownCollection(item)}
                            >
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {isClickable ? <ChevronRight size={14} style={{ color: '#94a3b8' }} /> : <div style={{ width: '14px' }}></div>}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontWeight: isClickable ? 700 : 400 }}>{item.collection}</span>
                                    {isModified && (
                                      <span style={{ fontSize: '0.65rem', background: '#eff6ff', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, border: '1px solid #dbeafe' }}>
                                        Modified
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td style={{ textAlign: 'center' }}>{item.backupRecords}</td>
                              <td style={{ textAlign: 'center' }}>{item.currentRecords}</td>
                              <td style={{ textAlign: 'center', fontWeight: 700, color: toBackupCount > 0 ? 'var(--me-primary-medium)' : '#94a3b8' }}>
                                {toBackupCount > 0 ? `+${toBackupCount}` : '0'}
                              </td>
                              <td style={{ textAlign: 'center', fontWeight: 700, color: toIgnoreCount > 0 ? '#64748b' : '#94a3b8' }}>
                                {toIgnoreCount > 0 ? `-${toIgnoreCount}` : '0'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="da-table-wrap" style={{ maxHeight: '450px', overflow: 'auto' }}>
                  <table className="da-table" style={{ tableLayout: 'auto' }}>
                    <thead>
                      <tr>
                        {backupDrilldownCollection.collection === 'dataentries' ? (
                          <>
                            <th>Sr. No</th>
                            <th>Event Type</th>
                            <th>Event Category</th>
                            <th>Event Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Venue</th>
                            <th>Objectives</th>
                            <th>About Event</th>
                            <th>Target Group</th>
                            <th>Post Event Details</th>
                            <th>Contact Person</th>
                            <th>Discipline</th>
                            <th>Chief Guest Name</th>
                            <th>Chief Guest Remark</th>
                            <th style={{ textAlign: 'center' }}>M</th>
                            <th style={{ textAlign: 'center' }}>F</th>
                            <th style={{ textAlign: 'center' }}>SC</th>
                            <th style={{ textAlign: 'center' }}>ST</th>
                            <th style={{ textAlign: 'center' }}>Other</th>
                            <th style={{ textAlign: 'center' }}>EF</th>
                            <th style={{ textAlign: 'center' }}>Total</th>
                            <th>Media Coverage</th>
                          </>
                        ) : (
                          <>
                            <th>Sr. No</th>
                            <th>Name</th>
                            <th>Detail</th>
                            <th>Date</th>
                          </>
                        )}
                        <th style={{ textAlign: 'center', width: '100px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backupDrilldownCollection.recordsToBackup.map((record, idx) => (
                        <tr key={record._id}>
                          {backupDrilldownCollection.collection === 'dataentries' ? (
                            <>
                              <td>{idx + 1}</td>
                              <td>{record.eventType || '-'}</td>
                              <td>{record.eventCategory || '-'}</td>
                              <td>{record.eventName || '-'}</td>
                              <td>{record.startDate ? new Date(record.startDate).toLocaleDateString() : '-'}</td>
                              <td>{record.endDate ? new Date(record.endDate).toLocaleDateString() : '-'}</td>
                              <td>
                                <div className="da-cell-content" style={{ fontSize: '0.8rem' }}>
                                  {record.venuePlace || record.venueTal || record.venueDist 
                                    ? `${record.venuePlace || ''}${record.venueTal ? `, Tal: ${record.venueTal}` : ''}${record.venueDist ? `, Dist: ${record.venueDist}` : ''}`
                                    : record.venue || '-'}
                                </div>
                              </td>
                              <td><div className="da-cell-content" style={{ fontSize: '0.8rem' }}>{record.objectives || '-'}</div></td>
                              <td><div className="da-cell-content" style={{ fontSize: '0.8rem' }}>{record.aboutEvent || '-'}</div></td>
                              <td>{record.targetGroup || '-'}</td>
                              <td><div className="da-cell-content" style={{ fontSize: '0.8rem' }}>{record.postEventDetails || '-'}</div></td>
                              <td>
                                {record.contactPerson || (record.contacts || []).map(c => c.contactPerson).filter(Boolean).join(', ') || '-'}
                              </td>
                              <td>{Array.isArray(record.discipline) ? record.discipline.join(', ') : (record.discipline || '-')}</td>
                              <td>
                                {(() => {
                                  const cg = record.chiefGuest || '-';
                                  const ib = record.inauguratedBy || '-';
                                  if (cg === '-' && ib === '-') return '-';
                                  if (cg !== '-' && ib !== '-') return `${cg} / ${ib}`;
                                  return cg !== '-' ? cg : ib;
                                })()}
                              </td>
                              <td><div className="da-cell-content" style={{ fontSize: '0.8rem' }}>{record.chiefGuestRemark || '-'}</div></td>
                              <td style={{ textAlign: 'center' }}>{record.totalMale || 0}</td>
                              <td style={{ textAlign: 'center' }}>{record.totalFemale || 0}</td>
                              <td style={{ textAlign: 'center' }}>{record.scTotal || 0}</td>
                              <td style={{ textAlign: 'center' }}>{record.stTotal || 0}</td>
                              <td style={{ textAlign: 'center' }}>{record.otherTotal || 0}</td>
                              <td style={{ textAlign: 'center' }}>{record.efTotal || 0}</td>
                              <td style={{ textAlign: 'center', fontWeight: 800 }}>{record.grandTotal || 0}</td>
                              <td>{record.mediaCoverage || '-'}</td>
                            </>
                          ) : (
                            <>
                              <td>{idx + 1}</td>
                              <td>{record.name || '-'}</td>
                              <td>{record.contact || record.email || record.code || '-'}</td>
                              <td>{record.date ? new Date(record.date).toLocaleDateString() : '-'}</td>
                            </>
                          )}
                          <td>
                            <div className="da-actions" style={{ justifyContent: 'center', gap: '6px' }}>
                              <button 
                                className={`da-btn-icon ${backupRecordActions[backupDrilldownCollection.collection]?.[record._id] === 'keep' ? 'active-keep' : ''}`}
                                onClick={() => setBackupRecordActions({
                                  ...backupRecordActions,
                                  [backupDrilldownCollection.collection]: {
                                    ...backupRecordActions[backupDrilldownCollection.collection],
                                    [record._id]: 'keep'
                                  }
                                })}
                                title="Include in backup"
                              >
                                <Check size={16} />
                              </button>
                              <button 
                                className={`da-btn-icon da-btn-edit ${backupRecordActions[backupDrilldownCollection.collection]?.[record._id] === 'ignore' ? 'active-ignore' : ''}`}
                                onClick={() => setBackupRecordActions({
                                  ...backupRecordActions,
                                  [backupDrilldownCollection.collection]: {
                                    ...backupRecordActions[backupDrilldownCollection.collection],
                                    [record._id]: 'ignore'
                                  }
                                })}
                                title="Ignore this time"
                              >
                                <Circle size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="me-modal-footer">
               {backupDrilldownCollection ? (
                 <div style={{ display: 'flex', width: '100%', gap: '12px' }}>
                   <button className="me-btn me-btn-light" style={{ flex: 1 }} onClick={() => setBackupDrilldownCollection(null)}>Back to Collections</button>
                   <button 
                    className="me-btn me-btn-primary" 
                    style={{ background: 'var(--me-primary-dark)', flex: 1 }} 
                    onClick={() => { setTargetActionCollection(backupDrilldownCollection.collection); setShowBackupConfirmModal(true); }}
                    disabled={isActionLoading}
                   >
                      Backup This Collection
                   </button>
                 </div>
               ) : (
                 <>
                   <button className="me-btn me-btn-light" style={{ minWidth: '120px' }} onClick={() => setShowBackupPreviewModal(false)}>Cancel</button>
                   <button 
                    className="me-btn me-btn-primary" 
                    style={{ background: 'var(--me-primary-dark)', minWidth: '180px' }} 
                    onClick={() => { setTargetActionCollection('all'); setShowBackupConfirmModal(true); }}
                    disabled={isActionLoading}
                   >
                      {isActionLoading ? 'Starting Backup...' : 'Confirm & Backup'}
                   </button>
                 </>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Restore Preview Modal */}
      {showPreviewModal && restorePreview && (
        <div className="me-modal-overlay">
          <div className="me-modal me-modal-large" style={{ maxWidth: drilldownCollection ? '900px' : '850px' }}>
            <div className="me-modal-header">
              <div className="me-modal-title">
                {drilldownCollection ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button className="me-icon-btn" onClick={() => setDrilldownCollection(null)} title="Back to Collections">
                      <ChevronLeft size={20} />
                    </button>
                    <span>Record Control — {drilldownCollection.collection}</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={20} />
                    <span>Restore Preview</span>
                  </div>
                )}
              </div>
              <button className="me-icon-btn" onClick={() => setShowPreviewModal(false)}><X size={20} /></button>
            </div>
            <div className="me-modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--me-primary-dark)' }}>{restorePreview.displayName}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Created on {restorePreview.createdDate}</div>
                  </div>
                  {drilldownCollection && (
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--me-primary-dark)', fontWeight: 800 }}>Total Records: {drilldownCollection.recordsToRestore.length}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--me-primary-medium)' }}>
                          Selected: {Object.values(recordActions[drilldownCollection.collection] || {}).filter(a => a === 'keep').length} Keep | {Object.values(recordActions[drilldownCollection.collection] || {}).filter(a => a === 'delete').length} Delete
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="me-btn me-btn-light" 
                          style={{ fontSize: '0.75rem', padding: '4px 12px', height: 'auto', background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}
                          onClick={() => {
                            const newActions = { ...recordActions };
                            newActions[drilldownCollection.collection] = {};
                            drilldownCollection.recordsToRestore.forEach(r => {
                              newActions[drilldownCollection.collection][r._id] = 'keep';
                            });
                            setRecordActions(newActions);
                          }}
                        >
                          Keep All
                        </button>
                        <button 
                          className="me-btn me-btn-light" 
                          style={{ fontSize: '0.75rem', padding: '4px 12px', height: 'auto', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}
                          onClick={() => {
                            const newActions = { ...recordActions };
                            newActions[drilldownCollection.collection] = {};
                            drilldownCollection.recordsToRestore.forEach(r => {
                              newActions[drilldownCollection.collection][r._id] = 'ignore';
                            });
                            setRecordActions(newActions);
                          }}
                        >
                          Ignore All
                        </button>
                        <button 
                          className="me-btn me-btn-light" 
                          style={{ fontSize: '0.75rem', padding: '4px 12px', height: 'auto', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}
                          onClick={() => {
                            const newActions = { ...recordActions };
                            newActions[drilldownCollection.collection] = {};
                            drilldownCollection.recordsToRestore.forEach(r => {
                              newActions[drilldownCollection.collection][r._id] = 'delete';
                            });
                            setRecordActions(newActions);
                          }}
                        >
                          Delete All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!drilldownCollection ? (
                <>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px', fontWeight: 600 }}>
                    Click on a collection with <span style={{ color: '#166534' }}>"To Restore"</span> records to review and control them.
                  </p>
                  <div className="da-table-wrap" style={{ maxHeight: '350px' }}>
                    <table className="da-table">
                      <thead>
                        <tr>
                          <th>Collection</th>
                          <th style={{ textAlign: 'center' }}>Backup</th>
                          <th style={{ textAlign: 'center' }}>Current</th>
                          <th style={{ textAlign: 'center', color: '#166534' }}>To Restore</th>
                          <th style={{ textAlign: 'center', color: '#991b1b' }}>To Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {restorePreview.preview.map(item => {
                          const isClickable = item.willBeRestored > 0;
                          
                          // Calculate counts based on current recordActions state
                          const actions = recordActions[item.collection] || {};
                          const toRestoreCount = Object.values(actions).filter(a => a === 'keep').length;
                          const toDeleteCount = Object.values(actions).filter(a => a === 'delete').length;
                          const isModified = toRestoreCount !== item.willBeRestored || toDeleteCount > 0;

                          return (
                            <tr 
                              key={item.collection} 
                              style={{ 
                                cursor: isClickable ? 'pointer' : 'default',
                                background: isClickable ? '#fff' : '#f8fafc'
                              }}
                              onClick={() => isClickable && setDrilldownCollection(item)}
                            >
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {isClickable ? <ChevronRight size={14} style={{ color: '#94a3b8' }} /> : <div style={{ width: '14px' }}></div>}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontWeight: isClickable ? 700 : 400 }}>{item.collection}</span>
                                    {isModified && (
                                      <span style={{ fontSize: '0.65rem', background: '#eff6ff', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, border: '1px solid #dbeafe' }}>
                                        Modified
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td style={{ textAlign: 'center' }}>{item.backupRecords}</td>
                              <td style={{ textAlign: 'center' }}>{item.currentRecords}</td>
                              <td style={{ textAlign: 'center', fontWeight: 700, color: toRestoreCount > 0 ? '#166534' : '#94a3b8' }}>
                                {toRestoreCount > 0 ? `+${toRestoreCount}` : '0'}
                              </td>
                              <td style={{ textAlign: 'center', fontWeight: 700, color: toDeleteCount > 0 ? '#991b1b' : '#94a3b8' }}>
                                {toDeleteCount > 0 ? `-${toDeleteCount}` : '0'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="da-table-wrap" style={{ maxHeight: '450px', overflow: 'auto' }}>
                  <table className="da-table" style={{ tableLayout: 'auto' }}>
                    <thead>
                      <tr>
                        {drilldownCollection.collection === 'dataentries' ? (
                          <>
                            <th>Sr. No</th>
                            <th>Event Type</th>
                            <th>Event Category</th>
                            <th>Event Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Venue</th>
                            <th>Objectives</th>
                            <th>About Event</th>
                            <th>Target Group</th>
                            <th>Post Event Details</th>
                            <th>Contact Person</th>
                            <th>Discipline</th>
                            <th>Chief Guest Name</th>
                            <th>Chief Guest Remark</th>
                            <th style={{ textAlign: 'center' }}>M</th>
                            <th style={{ textAlign: 'center' }}>F</th>
                            <th style={{ textAlign: 'center' }}>SC</th>
                            <th style={{ textAlign: 'center' }}>ST</th>
                            <th style={{ textAlign: 'center' }}>Other</th>
                            <th style={{ textAlign: 'center' }}>EF</th>
                            <th style={{ textAlign: 'center' }}>Total</th>
                            <th>Media Coverage</th>
                          </>
                        ) : (
                          <>
                            <th>Sr. No</th>
                            <th>Name</th>
                            <th>Detail</th>
                            <th>Date</th>
                          </>
                        )}
                        <th className="da-actions-sticky da-restore-actions-sticky" style={{ textAlign: 'center', width: '120px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drilldownCollection.recordsToRestore.map((record, idx) => (
                        <tr key={record._id}>
                          {drilldownCollection.collection === 'dataentries' ? (
                            <>
                              <td>{idx + 1}</td>
                              <td>{record.eventType || '-'}</td>
                              <td>{record.eventCategory || '-'}</td>
                              <td>{record.eventName || '-'}</td>
                              <td>{record.startDate ? new Date(record.startDate).toLocaleDateString() : '-'}</td>
                              <td>{record.endDate ? new Date(record.endDate).toLocaleDateString() : '-'}</td>
                              <td>
                                <div className="da-cell-content" style={{ fontSize: '0.8rem' }}>
                                  {record.venuePlace || record.venueTal || record.venueDist 
                                    ? `${record.venuePlace || ''}${record.venueTal ? `, Tal: ${record.venueTal}` : ''}${record.venueDist ? `, Dist: ${record.venueDist}` : ''}`
                                    : record.venue || '-'}
                                </div>
                              </td>
                              <td><div className="da-cell-content" style={{ fontSize: '0.8rem' }}>{record.objectives || '-'}</div></td>
                              <td><div className="da-cell-content" style={{ fontSize: '0.8rem' }}>{record.aboutEvent || '-'}</div></td>
                              <td>{record.targetGroup || '-'}</td>
                              <td><div className="da-cell-content" style={{ fontSize: '0.8rem' }}>{record.postEventDetails || '-'}</div></td>
                              <td>
                                {record.contactPerson || (record.contacts || []).map(c => c.contactPerson).filter(Boolean).join(', ') || '-'}
                              </td>
                              <td>{Array.isArray(record.discipline) ? record.discipline.join(', ') : (record.discipline || '-')}</td>
                              <td>
                                {(() => {
                                  const cg = record.chiefGuest || '-';
                                  const ib = record.inauguratedBy || '-';
                                  if (cg === '-' && ib === '-') return '-';
                                  if (cg !== '-' && ib !== '-') return `${cg} / ${ib}`;
                                  return cg !== '-' ? cg : ib;
                                })()}
                              </td>
                              <td><div className="da-cell-content" style={{ fontSize: '0.8rem' }}>{record.chiefGuestRemark || '-'}</div></td>
                              <td style={{ textAlign: 'center' }}>{record.totalMale || 0}</td>
                              <td style={{ textAlign: 'center' }}>{record.totalFemale || 0}</td>
                              <td style={{ textAlign: 'center' }}>{record.scTotal || ((parseInt(record.scMale) || 0) + (parseInt(record.scFemale) || 0))}</td>
                              <td style={{ textAlign: 'center' }}>{record.stTotal || ((parseInt(record.stMale) || 0) + (parseInt(record.stFemale) || 0))}</td>
                              <td style={{ textAlign: 'center' }}>{record.otherTotal || ((parseInt(record.otherMale) || 0) + (parseInt(record.otherFemale) || 0))}</td>
                              <td style={{ textAlign: 'center' }}>{record.efTotal || ((parseInt(record.efMale) || 0) + (parseInt(record.efFemale) || 0))}</td>
                              <td style={{ textAlign: 'center', fontWeight: 800 }}>{record.grandTotal || 0}</td>
                              <td>{record.mediaCoverage || '-'}</td>
                            </>
                          ) : (
                            <>
                              <td>{idx + 1}</td>
                              <td>{record.name || '-'}</td>
                              <td>{record.contact || record.email || record.code || '-'}</td>
                              <td>{record.date ? new Date(record.date).toLocaleDateString() : '-'}</td>
                            </>
                          )}
                          <td className="da-actions-sticky da-restore-actions-sticky">
                            <div className="da-actions" style={{ justifyContent: 'center', gap: '6px' }}>
                              <button 
                                className={`da-btn-icon ${recordActions[drilldownCollection.collection]?.[record._id] === 'keep' ? 'active-keep' : ''}`}
                                onClick={() => setRecordActions({
                                  ...recordActions,
                                  [drilldownCollection.collection]: {
                                    ...recordActions[drilldownCollection.collection],
                                    [record._id]: 'keep'
                                  }
                                })}
                                title="Keep record"
                              >
                                <Check size={16} />
                              </button>
                              <button 
                                className={`da-btn-icon da-btn-edit ${recordActions[drilldownCollection.collection]?.[record._id] === 'ignore' ? 'active-ignore' : ''}`}
                                onClick={() => setRecordActions({
                                  ...recordActions,
                                  [drilldownCollection.collection]: {
                                    ...recordActions[drilldownCollection.collection],
                                    [record._id]: 'ignore'
                                  }
                                })}
                                title="Ignore record"
                              >
                                <Circle size={14} />
                              </button>
                              <button 
                                className={`da-btn-icon da-btn-danger ${recordActions[drilldownCollection.collection]?.[record._id] === 'delete' ? 'active-delete' : ''}`}
                                onClick={() => setRecordActions({
                                  ...recordActions,
                                  [drilldownCollection.collection]: {
                                    ...recordActions[drilldownCollection.collection],
                                    [record._id]: 'delete'
                                  }
                                })}
                                title="Permanently delete from backup"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="me-modal-footer">
               {drilldownCollection ? (
                 <div style={{ display: 'flex', width: '100%', gap: '12px' }}>
                   <button className="me-btn me-btn-light" style={{ flex: 1 }} onClick={() => setDrilldownCollection(null)}>Back to Collections</button>
                   <button 
                    className="me-btn me-btn-primary" 
                    style={{ background: '#166534', flex: 1 }} 
                    onClick={() => { setTargetActionCollection(drilldownCollection.collection); setShowRestoreConfirmModal(true); }}
                    disabled={isActionLoading}
                   >
                      Restore This Collection
                   </button>
                 </div>
               ) : (
                 <>
                   <button className="me-btn me-btn-light" style={{ minWidth: '120px' }} onClick={() => setShowPreviewModal(false)}>Cancel</button>
                   <button 
                    className="me-btn me-btn-primary" 
                    style={{ background: '#166534', minWidth: '180px' }} 
                    onClick={() => { setTargetActionCollection('all'); setShowRestoreConfirmModal(true); }}
                    disabled={isActionLoading}
                   >
                      {isActionLoading ? 'Restoring...' : 'Confirm & Restore'}
                   </button>
                 </>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Restore Password Confirmation Modal */}
      {showRestoreConfirmModal && (
        <div className="me-modal-overlay">
          <div className="me-modal me-modal-small">
            <div className="me-modal-header">
              <div className="me-modal-title" style={{ color: '#166534' }}><ShieldCheck size={20} /> Confirm Restore</div>
              <button className="me-icon-btn" onClick={() => setShowRestoreConfirmModal(false)}><X size={20} /></button>
            </div>
            <div className="me-modal-body">
              <p style={{ marginBottom: '16px' }}>Please confirm your password to proceed with the database restoration.</p>
              <div className="me-form-group">
                <label className="me-label"><Key size={14} /> Admin Password / Recovery Key</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className="me-input"
                    placeholder={dbStatus !== 'healthy' ? "Enter Recovery Key" : "Enter admin password"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    autoFocus
                  />
                  <button className="me-icon-btn" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && <p className="me-inline-error">{error}</p>}
              </div>
            </div>
            <div className="me-modal-footer">
              <button className="me-btn me-btn-light" onClick={() => setShowRestoreConfirmModal(false)}>Cancel</button>
              <button className="me-btn me-btn-primary" style={{ background: '#166534' }} 
                onClick={() => {
                  const explicitActions = {};
                  if (targetActionCollection === 'all') {
                    Object.keys(recordActions).forEach(collName => {
                      explicitActions[collName] = Object.entries(recordActions[collName]).map(([id, action]) => ({ id, action }));
                    });
                  } else {
                    explicitActions[targetActionCollection] = Object.entries(recordActions[targetActionCollection] || {}).map(([id, action]) => ({ id, action }));
                  }
                  handleRestore(explicitActions);
                }} 
                disabled={isActionLoading || !adminPassword}
              >
                {isActionLoading ? 'Restoring...' : 'Confirm & Execute Restore'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Password Confirmation Modal */}
      {showBackupConfirmModal && (
        <div className="me-modal-overlay">
          <div className="me-modal me-modal-small">
            <div className="me-modal-header">
              <div className="me-modal-title" style={{ color: 'var(--me-primary-dark)' }}><DatabaseBackup size={20} /> Confirm Backup</div>
              <button className="me-icon-btn" onClick={() => setShowBackupConfirmModal(false)}><X size={20} /></button>
            </div>
            <div className="me-modal-body">
              <p style={{ marginBottom: '16px' }}>Please confirm your password to proceed with the incremental backup.</p>
              <div className="me-form-group">
                <label className="me-label"><Key size={14} /> Admin Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className="me-input"
                    placeholder="Enter admin password to confirm"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    autoFocus
                  />
                  <button className="me-icon-btn" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && <p className="me-inline-error">{error}</p>}
              </div>
            </div>
            <div className="me-modal-footer">
              <button className="me-btn me-btn-light" onClick={() => setShowBackupConfirmModal(false)}>Cancel</button>
              <button className="me-btn me-btn-primary" style={{ background: 'var(--me-primary-dark)' }} 
                onClick={() => {
                  const explicitActions = {};
                  if (targetActionCollection === 'all') {
                    Object.keys(backupRecordActions).forEach(collName => {
                      explicitActions[collName] = Object.entries(backupRecordActions[collName]).map(([id, action]) => ({ id, action }));
                    });
                  } else {
                    explicitActions[targetActionCollection] = Object.entries(backupRecordActions[targetActionCollection] || {}).map(([id, action]) => ({ id, action }));
                  }
                  handleCreateBackup(actionDbName, backupPreview.displayName, explicitActions);
                }} 
                disabled={isActionLoading || !adminPassword}
              >
                {isActionLoading ? 'Backing up...' : 'Confirm & Execute Backup'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Strategy Options Modal */}
      {showOptionsModal && (
        <div className="me-modal-overlay">
          <div className="me-modal me-modal-small">
            <div className="me-modal-header">
              <div className="me-modal-title">Create Backup</div>
              <button className="me-icon-btn" onClick={() => setShowOptionsModal(false)}><X size={20} /></button>
            </div>
            <div className="me-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="me-form-group">
                  <label className="me-label">Backup Display Name</label>
                  <input 
                    type="text" 
                    className="me-input" 
                    placeholder="e.g. KVK Dhule Backup 1" 
                    value={backupDisplayName}
                    onChange={(e) => setBackupDisplayName(e.target.value)}
                  />
                </div>

                <button 
                  className="me-btn me-btn-primary" 
                  style={{ justifyContent: 'center', padding: '12px', height: 'auto' }}
                  onClick={() => handleCreateBackup()}
                  disabled={!backupDisplayName}
                >
                  Create New Initial Backup
                </button>
                
                <div style={{ position: 'relative', textAlign: 'center', margin: '10px 0' }}>
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#e2e8f0' }}></div>
                  <span style={{ position: 'relative', background: 'white', padding: '0 10px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>OR</span>
                </div>

                <div className="me-form-group">
                  <label className="me-label">Continue Existing Backup (Incremental)</label>
                  <select 
                    className="me-input"
                    value={selectedExistingDb}
                    onChange={(e) => setSelectedExistingDb(e.target.value)}
                  >
                    <option value="">Select a backup...</option>
                    {backups.map(b => (
                      <option key={b.databaseName} value={b.databaseName}>{b.displayName}</option>
                    ))}
                  </select>
                </div>
                
                <button 
                  className="me-btn me-btn-light" 
                  disabled={!selectedExistingDb}
                  onClick={() => handleCreateBackup(selectedExistingDb)}
                  style={{ width: '100%' }}
                >
                  <Play size={16} style={{ marginRight: '8px' }} />
                  Continue Selected Backup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Password Modal */}
      {showDeleteModal && (
        <div className="me-modal-overlay">
          <div className="me-modal me-modal-small">
            <div className="me-modal-header">
              <div className="me-modal-title" style={{ color: '#991b1b' }}><Trash2 size={20} /> Delete Backup</div>
              <button className="me-icon-btn" onClick={() => setShowDeleteModal(false)}><X size={20} /></button>
            </div>
            <div className="me-modal-body">
              <p style={{ marginBottom: '16px' }}>Are you sure you want to delete this backup? This will permanently remove the files from the server.</p>
              <div className="me-form-group">
                <label className="me-label"><Key size={14} /> Admin Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className="me-input"
                    placeholder="Enter admin password to confirm"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    autoFocus
                  />
                  <button className="me-icon-btn" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && <p className="me-inline-error">{error}</p>}
              </div>
            </div>
            <div className="me-modal-footer">
              <button className="me-btn me-btn-light" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="me-btn me-btn-danger" onClick={handleDelete} disabled={isActionLoading}>
                {isActionLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Summary Modal */}
      {showSuccessModal && (
        <div className="me-modal-overlay">
          <div className="me-modal me-modal-medium">
            <div className="me-modal-header">
              <div className="me-modal-title">
                <CheckCircle2 size={20} style={{ color: '#22c55e' }} />
                {latestResult?.type === 'restore' ? 'Restore Completed' : 'Backup Completed'}
              </div>
              <button className="me-icon-btn" onClick={() => setShowSuccessModal(false)}><X size={20} /></button>
            </div>
            <div className="me-modal-body">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ background: '#f0fdf4', width: '60px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} style={{ color: '#22c55e' }} />
                </div>
                <h3 style={{ fontWeight: 700 }}>{latestResult?.message}</h3>
                <p style={{ color: '#64748b' }}>{latestResult?.displayName || latestResult?.backupName}</p>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ fontWeight: 700 }}>Collection</span>
                  <span style={{ fontWeight: 700 }}>Records {latestResult?.type === 'restore' ? 'Restored' : 'Added'}</span>
                </div>
                {Object.entries(latestResult?.stats || {}).map(([name, count]) => (
                  <div key={name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#475569' }}>{name}</span>
                    <span style={{ fontWeight: 600 }}>{count}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '8px', borderTop: '2px solid #e2e8f0' }}>
                  <span style={{ fontWeight: 800 }}>Total Records</span>
                  <span style={{ fontWeight: 800, color: 'var(--me-primary-medium)' }}>
                    {latestResult?.totalNewRecords || latestResult?.totalRestored || 0}
                  </span>
                </div>
              </div>
            </div>
            <div className="me-modal-footer">
              <button className="me-btn me-btn-primary" style={{ width: '100%' }} onClick={() => setShowSuccessModal(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
      {/* Help & Documentation Modal */}
      {showHelpModal && (
        <div className="me-modal-overlay">
          <div className="me-modal me-modal-large" style={{ maxWidth: '900px' }}>
            <div className="me-modal-header">
              <div className="me-modal-title"><HelpCircle size={20} /> Backup System Help Guide</div>
              <button className="me-icon-btn" onClick={() => setShowHelpModal(false)}><X size={20} /></button>
            </div>
            <div className="me-modal-body" style={{ maxHeight: '75vh', overflowY: 'auto', padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '32px' }}>
                
                {/* Section 1: Create Backup */}
                <section>
                  <h4 style={{ color: 'var(--me-primary-dark)', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <DatabaseBackup size={18} /> 1. Creating Backups
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                    <div>
                      <strong style={{ color: '#475569' }}>Initial Backup:</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>Creates a full snapshot of the current database. Use this for major milestones or first-time setup.</p>
                    </div>
                    <div>
                      <strong style={{ color: '#475569' }}>Incremental (Continue):</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>Scans an existing backup and adds only new records. Use <strong>"Record Control"</strong> to select specific records or use <strong>"Keep All" / "Ignore All"</strong> for bulk actions.</p>
                    </div>
                  </div>
                </section>

                {/* Section 2: Auto Backup */}
                <section>
                  <h4 style={{ color: 'var(--me-primary-dark)', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <RefreshCcw size={18} /> 2. Automatic Backups
                  </h4>
                  <ul style={{ paddingLeft: '20px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li>Runs automatically once every <strong>Friday between 9:00 AM and 5:00 PM</strong>.</li>
                    <li>When enabled, you can choose to <strong>Create a New Backup</strong> or <strong>Continue an Existing one</strong>.</li>
                    <li>Performs a full incremental backup of all new data across all disciplines.</li>
                    <li>Every execution is logged in the <strong>Auto Backup Timeline</strong> (accessible by clicking the card in the header).</li>
                  </ul>
                </section>

                {/* Section 3: Restore Process */}
                <section>
                  <h4 style={{ color: 'var(--me-primary-dark)', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ArrowUpCircle size={18} /> 3. Restoring Data
                  </h4>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <ol style={{ paddingLeft: '20px', margin: 0, color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <li>Click the <strong>Restore icon (↑)</strong> and select a collection to review.</li>
                      <li>Use <strong>Keep All / Ignore All / Delete All</strong> for quick bulk actions across the collection.</li>
                      <li>Choose <strong>Keep</strong> (restore to DB), <strong>Delete</strong> (remove from backup), or <strong>Ignore</strong> for individual records.</li>
                      <li>You can restore a <strong>single collection</strong> immediately or review multiple collections and confirm once.</li>
                      <li>Enter <strong>Admin Password</strong> in the final confirmation modal to execute.</li>
                    </ol>
                  </div>
                </section>

                {/* Section 4: Incremental Backup Flow */}
                <section>
                  <h4 style={{ color: 'var(--me-primary-dark)', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={18} /> 4. Incremental Backup
                  </h4>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <ol style={{ paddingLeft: '20px', margin: 0, color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <li>Click <strong>"Create Backup"</strong> and choose an existing backup to continue.</li>
                      <li>Review the <strong>Preview Table</strong> and select a collection to drill down.</li>
                      <li>Use <strong>Keep All / Ignore All</strong> to quickly select new records to add.</li>
                      <li>You can backup a <strong>single collection</strong> or multiple collections at once.</li>
                      <li>Enter <strong>Admin Password</strong> in the final confirmation modal to execute.</li>
                    </ol>
                  </div>
                </section>

                {/* Section 5: DISASTER RECOVERY */}
                <section style={{ gridColumn: '1 / -1', background: '#fff7ed', border: '1px solid #ffedd5', padding: '20px', borderRadius: '12px' }}>
                  <h4 style={{ color: '#9a3412', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle size={20} /> EMERGENCY: Main Database Dropped
                  </h4>
                  <p style={{ color: '#c2410c', fontSize: '0.95rem', marginBottom: '16px' }}>
                    If the <strong>Krishi_Vigyan_Kendra</strong> database is deleted, the system enters <strong>Recovery Mode</strong>. 
                    The Backup Page will still work because it reads files from the server disk.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '8px' }}>
                      <div style={{ fontWeight: 800, color: '#475569', marginBottom: '8px' }}>Step-by-Step Recovery:</div>
                      <ol style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
                        <li>Login using your existing credentials (JWT Session).</li>
                        <li>The Backup Page will show a <strong>Recovery Mode Banner</strong>.</li>
                        <li>Choose the latest backup and click <strong>Restore</strong>.</li>
                        <li>Enter the <strong>20-character Recovery Key</strong> (found in .env).</li>
                      </ol>
                    </div>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '8px' }}>
                      <div style={{ fontWeight: 800, color: '#475569', marginBottom: '8px' }}>The Recovery Key:</div>
                      <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                        Since the user database is gone, your normal password won't work. 
                        You must use the master key: <br />
                        <code style={{ background: '#f0fdf4', padding: '6px 12px', borderRadius: '6px', display: 'inline-block', marginTop: '10px', color: '#166534', fontWeight: 800, border: '1px solid #bbf7d0' }}>
                          kvk-recov-2026-auth-key
                        </code>
                      </p>
                    </div>
                  </div>
                </section>

              </div>
            </div>
            <div className="me-modal-footer">
              <button className="me-btn me-btn-primary" style={{ minWidth: '150px' }} onClick={() => setShowHelpModal(false)}>I Understand</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .backup-row-hover:hover {
          background-color: #f0fdf4 !important;
          transform: translateX(4px);
        }
        .backup-details-modal {
          width: 900px;
          max-width: 95vw;
        }
        
        /* Blue Action Column Styles */
        .da-restore-actions-sticky {
          background: #f0f9ff !important;
          border-left: 1px solid #e0f2fe !important;
        }
        
        .da-table thead th.da-restore-actions-sticky {
          background: linear-gradient(135deg, var(--me-primary-light) 0%, #A9B98F 100%) !important;
          color: var(--me-primary-dark) !important;
          border-left: 1px solid rgba(0,0,0,0.1) !important;
        }
        
        .da-table tr:hover td.da-restore-actions-sticky {
          background: #e0f2fe !important;
        }

        /* Active Action Button States (Faint/Aesthetic) */
        .da-btn-icon.active-keep {
          background: #dcfce7 !important;
          color: #166534 !important;
          border-color: #86efac !important;
          box-shadow: 0 2px 4px rgba(34, 197, 94, 0.1);
        }
        
        .da-btn-icon.active-ignore {
          background: #f1f5f9 !important;
          color: #475569 !important;
          border-color: #cbd5e1 !important;
          box-shadow: 0 2px 4px rgba(100, 116, 139, 0.1);
        }
        
        .da-btn-icon.active-delete {
          background: #fee2e2 !important;
          color: #991b1b !important;
          border-color: #fca5a5 !important;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
};

export default BackupPage;
