// src/components/Sidebar.js - Desktop/Laptop Only
import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';
import { disciplineAPI, adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard,
  Sprout,
  Trees,
  Droplets,
  Leaf,
  Beef,
  Tractor,
  Activity,
  ClipboardCheck,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCog,
  Pencil,
  Upload,
  ChevronDown,
  Plus,
  Database
} from 'lucide-react';
import {
  GiFactory,
  GiWheat,
  GiCow,
  GiFruitTree,
  GiShield,
  GiGroundSprout,
  GiPlantRoots,
  GiFarmTractor,
  GiCorn,
  GiChicken,
  GiBee,
  GiWaterDrop,
  GiBarn,
  GiGardeningShears,
  GiTreeGrowth,
  GiFruitBowl,
  GiSunflower,
  GiFarmer,
  GiMilkCarton
} from 'react-icons/gi';

const Sidebar = ({ userRole, onLogout, isSidebarCollapsed = false, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [expandedSections, setExpandedSections] = useState({
    disciplines: true,
    mainMenu: true
  });
  const [availableDisciplines, setAvailableDisciplines] = useState([]);
  const [expandedDisciplines, setExpandedDisciplines] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showBackupBadge, setShowBackupBadge] = useState(false);

  // Check for Friday backup reminder
  useEffect(() => {
    const checkBackupReminder = async () => {
      if (userRole !== 'admin' && userRole !== 'program_assistant') return;
      
      const today = new Date();
      const isFriday = today.getDay() === 5; // Friday
      
      if (isFriday) {
        try {
          const data = await adminAPI.getBackupHistory();
          const backups = data.backups || [];
          const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
          
          // Check if any backup was created today
          const backupDoneToday = backups.some(b => {
            // Backup date format from getBackupHistory is YYYY-MM-DD
            return b.createdDate === todayStr;
          });
          
          setShowBackupBadge(!backupDoneToday);
        } catch (err) {
          console.error('Failed to check backup reminder:', err);
          setShowBackupBadge(true); // Default to showing if error
        }
      } else {
        setShowBackupBadge(false);
      }
    };
    
    checkBackupReminder();
    // Re-check every hour
    const timer = setInterval(checkBackupReminder, 3600000);
    return () => clearInterval(timer);
  }, [userRole, location.pathname]); // Re-check when navigation happens to update badge after backup

  // Auto-expand discipline dropdown if we're on a related sub-page
  useEffect(() => {
    const path = location.pathname;
    const search = location.search;
    const params = new URLSearchParams(search);
    const discParam = params.get('discipline');

    availableDisciplines.forEach(disc => {
      // Check if current path belongs to this discipline
      const isDisciplinePage = path.includes(`/dashboard/discipline/${disc.code}`);
      const isDataEntryPage = path.includes(`/dashboard/data-entry/${disc.code}`);
      const isImportPage = path.startsWith('/dashboard/import-data') && discParam === disc.code;

      if (isDisciplinePage || isDataEntryPage || isImportPage) {
        setExpandedDisciplines(prev => ({ ...prev, [disc.code]: true }));
      }
    });
  }, [location.pathname, location.search, availableDisciplines]);

  const toggleDiscipline = (e, code) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedDisciplines(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const getInitials = (name) => {
    const parts = String(name || '').trim().split(' ').filter(Boolean);
    const initials = parts.slice(0, 2).map((n) => n[0]).join('');
    return (initials || 'U').toUpperCase();
  };

  const formatRole = (role) => {
    if (!role) return 'User';
    if (role === 'admin') return 'Program Coordinator';
    if (role === 'scientist') return 'Scientist / Staff';
    if (role === 'program_assistant') return 'Program Assistant';
    return role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, ' ');
  };

  // Dashboard item
  const dashboardItem = { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: <LayoutDashboard size={24} />,
    path: '/dashboard'
  };

  // Admin panel item (only for admin)
  const adminPanelItem = {
    id: 'admin-panel',
    label: 'Admin Panel',
    icon: <UserCog size={24} />,
    path: '/dashboard/admin-panel'
  };

  // Discipline icon pool (used for random assignment without repeats)
  const ICON_POOL = [
    <GiFactory size={24} />,       // Agril. Process Engg (Agril Engineering)
    <GiWheat size={24} />,         // Agronomy
    <GiCow size={24} />,           // Animal Husbandry
    <GiFruitTree size={24} />,     // Horticulture
    <GiShield size={24} />,        // Plant Protection
    <GiGroundSprout size={24} />,  // Soil Science & Agril Chemistry
    <GiPlantRoots size={24} />,
    <GiFarmTractor size={24} />,
    <GiCorn size={24} />,
    <GiChicken size={24} />,
    <GiBee size={24} />,
    <GiWaterDrop size={24} />,
    <GiBarn size={24} />,
    <GiGardeningShears size={24} />,
    <GiTreeGrowth size={24} />,
    <GiFruitBowl size={24} />,
    <GiSunflower size={24} />,
    <GiFarmer size={24} />,
    <GiMilkCarton size={24} />
  ];

  // Fuzzy matching to assign specific icon by name
  const normalize = (s = '') =>
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const pickSpecificIcon = (name) => {
    const n = normalize(name);
    const has = (k) => n.includes(k);
    // Agril. Process Engg -> GiFactory
    if ((has('agri') || has('agril')) && (has('eng') || has('engineer') || has('process'))) {
      return <GiFactory size={24} />;
    }
    // Agronomy -> GiWheat
    if (has('agron')) return <GiWheat size={24} />;
    // Animal Husbandry -> GiCow
    if (has('animal') && (has('husband') || has('livestock') || has('cow'))) return <GiCow size={24} />;
    // Horticulture -> GiFruitTree
    if (has('horti') || has('hort')) return <GiFruitTree size={24} />;
    // Plant Protection -> GiShield
    if (has('plant') && (has('protect') || has('pest') || has('ipm'))) return <GiShield size={24} />;
    // Soil Science & Agril Chemistry -> GiGroundSprout
    if (has('soil') && (has('chem') || has('science'))) return <GiGroundSprout size={24} />;
    return null;
  };

  const pickIconForDiscipline = (name, used) => {
    const specific = pickSpecificIcon(name);
    if (specific) return specific;
    // Fall back to random unique icon from pool
    for (let i = 0; i < ICON_POOL.length; i++) {
      const key = `pool_${i}`;
      if (!used.has(key)) {
        used.add(key);
        return ICON_POOL[i];
      }
    }
    // If exhausted, reuse first safely
    return ICON_POOL[0];
  };

  // Fetch disciplines and filter based on user role
  useEffect(() => {
    const loadDisciplines = async () => {
      try {
        const allDisciplines = await disciplineAPI.list();
        if (userRole === 'admin') {
          setAvailableDisciplines([]);
        } else {
          // Other users see only their assigned disciplines
          const assignedCodes = user?.assignedDisciplines || [];
          const filtered = (allDisciplines || []).filter((d) =>
            assignedCodes.includes(d.code)
          );
          setAvailableDisciplines(filtered);
        }
      } catch (error) {
        console.error('Failed to load disciplines:', error);
        setAvailableDisciplines([]);
      }
    };
    loadDisciplines();
  }, [userRole, user?.assignedDisciplines]);

  // Map disciplines to sidebar items
  const disciplinesItems = (() => {
    const used = new Set();
    const perms = user?.permissions || {};

    return availableDisciplines.map((disc) => {
      const discPerms = perms[disc.code] || [];
      const subItems = [];
      
      if (discPerms.includes('create')) {
        subItems.push({
          id: `${disc.code}-entry`,
          label: 'Data Entry',
          icon: <ClipboardCheck size={18} />,
          path: `/dashboard/data-entry/${disc.code}/new`
        });
      }
      
      if (discPerms.includes('import')) {
        subItems.push({
          id: `${disc.code}-import`,
          label: 'Import',
          icon: <Upload size={18} />,
          path: `/dashboard/import-data?discipline=${encodeURIComponent(disc.code)}&name=${encodeURIComponent(disc.name)}`
        });
      }

      return {
        id: disc.code,
        label: disc.name,
        icon: pickIconForDiscipline(disc.name, used),
        path: `/dashboard/discipline/${disc.code}`,
        subItems
      };
    });
  })();

  // Compute if current user has Data Entry globally or in any discipline
  const hasDataEntry = useMemo(() => {
    if (user?.role === 'admin') return false;
    if (user?.dataEntryEnabled) return true;
    const perms = user?.permissions || {};
    return Object.values(perms).some((arr) => Array.isArray(arr) && arr.includes('data_entry'));
  }, [user?.permissions, user?.dataEntryEnabled]);

  // Main menu items (conditionally include Data Entry and Import Data)
  const mainMenuItems = useMemo(() => {
    const items = [];
    if (hasDataEntry) {
      items.push({ id: 'data-entry', label: 'Data Entry', icon: <ClipboardCheck size={24} />, path: '/dashboard/data-entry/new' });
      items.push({ id: 'import-data', label: 'Import Data', icon: <Upload size={24} />, path: '/dashboard/import-data' });
    }
    items.push({ id: 'analytics', label: 'Analytics', icon: <BarChart3 size={24} />, path: '/dashboard/analytics' });
    return items;
  }, [hasDataEntry]);

  const toggleSidebar = () => {
    if (onToggleCollapse) onToggleCollapse(!isSidebarCollapsed);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  const sidebarClasses = `kvk-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`;

  return (
    <>
      <aside className={sidebarClasses}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-profile">
            <div
              className="sidebar-profile-display"
              onClick={() => navigate('/profile')}
              title="User Profile"
            >
              <div className="sidebar-avatar">
                <span className="sidebar-avatar-initials">
                  {getInitials(user?.name)}
                </span>
                <Pencil size={12} className="sidebar-avatar-pencil" aria-hidden />
              </div>
              {!isSidebarCollapsed && (
                <div className="sidebar-profile-info">
                  <span className="sidebar-user-name">
                    {user?.name || 'User'}
                  </span>
                  <span className="sidebar-user-title">
                    {formatRole(user?.role)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="sidebar-content">
          {/* Dashboard + Admin Panel (top) */}
          <div className="sidebar-section">
            {!isSidebarCollapsed && (
              <div className="sidebar-section-header">
                <h3 className="sidebar-section-title">Dashboard</h3>
              </div>
            )}
            <nav className="sidebar-nav">
              {/* Dashboard link */}
              <NavLink
                to={dashboardItem.path}
                className={({ isActive }) => 
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
                title={isSidebarCollapsed ? dashboardItem.label : ''}
                data-tooltip={isSidebarCollapsed ? dashboardItem.label : ''}
                end
              >
                <span className="nav-item-icon">{dashboardItem.icon}</span>
                {!isSidebarCollapsed && (
                  <span className="nav-item-label">{dashboardItem.label}</span>
                )}
              </NavLink>

              {/* Admin Panel link - only for admin */}
              {userRole === 'admin' && (
                <NavLink
                  to={adminPanelItem.path}
                  className={({ isActive }) => 
                    `sidebar-nav-item ${isActive ? 'active' : ''}`
                  }
                  title={isSidebarCollapsed ? adminPanelItem.label : ''}
                  data-tooltip={isSidebarCollapsed ? adminPanelItem.label : ''}
                  end
                >
                  <span className="nav-item-icon">{adminPanelItem.icon}</span>
                  {!isSidebarCollapsed && (
                    <span className="nav-item-label">{adminPanelItem.label}</span>
                  )}
                </NavLink>
              )}
            </nav>
          </div>

          {/* Disciplines */}
          {disciplinesItems.length > 0 && (
          <div className="sidebar-section">
            {!isSidebarCollapsed && (
              <div 
                className="sidebar-section-header collapsible"
                onClick={() => toggleSection('disciplines')}
              >
                <h3 className="sidebar-section-title">
                  Disciplines
                  <span className="collapse-icon">
                    {expandedSections.disciplines ? '▼' : '▶'}
                  </span>
                </h3>
              </div>
            )}
            {(expandedSections.disciplines || isSidebarCollapsed) && (
              <nav className="sidebar-nav">
                {disciplinesItems.map((item) => {
                  const isDiscActive = location.pathname.includes(`/dashboard/discipline/${item.id}`);
                  return (
                    <React.Fragment key={item.id}>
                      <NavLink
                        to={item.path}
                        className={`sidebar-nav-item ${isDiscActive ? 'active' : ''} ${item.subItems?.length ? 'has-subitems' : ''}`}
                        title={isSidebarCollapsed ? item.label : ''}
                        data-tooltip={isSidebarCollapsed ? item.label : ''}
                      >
                        <span className="nav-item-icon">{item.icon}</span>
                        {!isSidebarCollapsed && (
                          <>
                            <span className="nav-item-label">{item.label}</span>
                            {item.subItems?.length > 0 && (
                              <button 
                                className={`subitem-toggle ${expandedDisciplines[item.id] ? 'expanded' : ''}`}
                                onClick={(e) => toggleDiscipline(e, item.id)}
                              >
                                <ChevronDown size={16} />
                              </button>
                            )}
                          </>
                        )}
                      </NavLink>
                      {!isSidebarCollapsed && item.subItems?.length > 0 && expandedDisciplines[item.id] && (
                        <div className="sidebar-sub-nav">
                          {item.subItems.map(sub => {
                            // Enhanced active check for discipline-specific subitems
                            const isSubItemActive = () => {
                              const path = location.pathname;
                              const search = location.search;
                              
                              if (sub.id.endsWith('-entry')) {
                                // Match /dashboard/data-entry/{disciplineCode}/new
                                // The path is exactly sub.path
                                return path === sub.path;
                              }
                              
                              if (sub.id.endsWith('-import')) {
                                // Match /dashboard/import-data?discipline={disciplineCode}
                                const params = new URLSearchParams(search);
                                const discParam = params.get('discipline');
                                return path.startsWith('/dashboard/import-data') && discParam === item.id;
                              }
                              
                              return false;
                            };

                            return (
                              <NavLink
                                key={sub.id}
                                to={sub.path}
                                className={() => `sidebar-sub-item ${isSubItemActive() ? 'active' : ''}`}
                              >
                                <span className="sub-item-icon">{sub.icon}</span>
                                <span className="sub-item-label">{sub.label}</span>
                              </NavLink>
                            );
                          })}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </nav>
            )}
          </div>
          )}

          {/* Main Menu */}
          <div className="sidebar-section">
            {!isSidebarCollapsed && (
              <div 
                className="sidebar-section-header collapsible"
                onClick={() => toggleSection('mainMenu')}
              >
                <h3 className="sidebar-section-title">
                  Main Menu
                  <span className="collapse-icon">
                    {expandedSections.mainMenu ? '▼' : '▶'}
                  </span>
                </h3>
              </div>
            )}
            {(expandedSections.mainMenu || isSidebarCollapsed) && (
              <nav className="sidebar-nav">
                {mainMenuItems.map((item) => {
                  const isMainItemActive = () => {
                    const path = location.pathname;
                    const search = location.search;

                    if (item.id === 'import-data') {
                      // Import Data in Main Menu is only active if NO discipline query param is present
                      const params = new URLSearchParams(search);
                      return path.startsWith('/dashboard/import-data') && !params.get('discipline');
                    }
                    
                    if (item.id === 'data-entry') {
                      // Data Entry in Main Menu is only active for /dashboard/data-entry/new (not /dashboard/data-entry/{discipline}/new)
                      return path === '/dashboard/data-entry/new';
                    }

                    return path.startsWith(item.path);
                  };

                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      className={() => `sidebar-nav-item ${isMainItemActive() ? 'active' : ''}`}
                      title={isSidebarCollapsed ? item.label : ''}
                      data-tooltip={isSidebarCollapsed ? item.label : ''}
                    >
                      <span className="nav-item-icon">{item.icon}</span>
                      {!isSidebarCollapsed && (
                        <span className="nav-item-label">{item.label}</span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          {(userRole === 'admin' || userRole === 'program_assistant') && (
            <button 
              className={`sidebar-footer-btn backup ${location.pathname === '/dashboard/backup' ? 'active' : ''}`}
              onClick={() => navigate('/dashboard/backup')}
              title={isSidebarCollapsed ? "Database Backup" : ''}
              data-tooltip={isSidebarCollapsed ? "Database Backup" : ''}
              style={{ marginBottom: '8px', position: 'relative' }}
            >
              <Database size={20} />
              {!isSidebarCollapsed && (
                <>
                  <span>Backup</span>
                  {showBackupBadge && (
                    <span className="backup-reminder-badge" title="Weekly Backup Recommended">🔔</span>
                  )}
                </>
              )}
              {isSidebarCollapsed && showBackupBadge && (
                <span className="backup-reminder-dot" title="Weekly Backup Recommended"></span>
              )}
            </button>
          )}
          <button 
            className="sidebar-footer-btn logout" 
            onClick={handleLogoutClick}
            title={isSidebarCollapsed ? "Logout" : ''}
            data-tooltip={isSidebarCollapsed ? "Logout" : ''}
          >
            <LogOut size={20} />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
        
        {/* Sidebar Toggle Button */}
        <button 
          className={`sidebar-toggle-btn ${isSidebarCollapsed ? 'collapsed' : ''}`}
          onClick={toggleSidebar}
        >
          {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="me-modal-overlay">
          <div className="me-modal" onClick={(e) => e.stopPropagation()}>
            <div className="me-modal-header">
              <div className="me-modal-title">
                <LogOut size={20} />
                Confirm Logout
              </div>
              <button
                type="button"
                className="me-icon-btn"
                onClick={() => setShowLogoutModal(false)}
                aria-label="Close"
              >
                <Plus size={20} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>
            <div className="me-modal-body">
              <p className="me-modal-message">Are you sure you want to logout from the system?</p>
            </div>
            <div className="me-modal-footer">
              <button
                type="button"
                className="me-btn me-btn-light"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="me-btn me-btn-danger"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
