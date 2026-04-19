'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/ManageEmployee.me.css';
import '../styles/DataEntry.css';
import * as XLSX from 'xlsx';
import { Search, ChevronDown, AlertCircle, Key, X, FileText } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { disciplineAPI } from '../services/api';
import { dataEntryAPI } from '../services/dataEntryApi';
import { importAPI } from '../services/importApi';
import DEHeader from '../components/data-entry/DEHeader';
import DETable from '../components/data-entry/DETable';

const CustomDropdown = ({ value, options, onSelect, placeholder, required, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    
    if (!isOpen) {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const menuHeight = 250;
        setOpenUp(spaceBelow < menuHeight);
      }
    }
    setIsOpen(!isOpen);
  };

  const displayLabel = useMemo(() => {
    const found = options.find(o => (typeof o === 'object' ? o.value : o) === value);
    return found ? (typeof found === 'object' ? found.label : found) : (value || placeholder);
  }, [value, options, placeholder]);

  return (
    <div className={`da-custom-dropdown-container ${isOpen ? 'is-open' : ''}`} ref={dropdownRef}>
      <div 
        className={`da-input da-custom-dropdown-trigger ${disabled ? 'disabled' : ''}`}
        onClick={handleToggle}
        onKeyDown={(e) => e.key === 'Enter' && handleToggle()}
        tabIndex={disabled ? -1 : 0}
        style={{ minWidth: '160px' }}
      >
        <span>{displayLabel}</span>
        <ChevronDown size={16} style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s'
        }} />
      </div>
      
      {isOpen && (
        <div className={`da-custom-dropdown-menu ${openUp ? 'open-up' : ''}`}>
          {options.map((opt, i) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <button
                key={i}
                type="button"
                className={`da-custom-dropdown-item ${value === optVal ? 'active' : ''}`}
                onClick={() => {
                  onSelect(optVal);
                  setIsOpen(false);
                }}
              >
                {optLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const DataEntry = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const { disciplineCode } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);
  const [disciplines, setDisciplines] = useState([]);
  const [filterDiscipline, setFilterDiscipline] = useState(disciplineCode || 'all');
  const [year, setYear] = useState(new Date().getFullYear());
  const showActions = !disciplineCode;

  // Demo data (replace with API later)
  const [rows, setRows] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deletePasswordError, setDeletePasswordError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [d, r] = await Promise.all([
          disciplineAPI.list().catch(() => []),
          dataEntryAPI.get(year).catch(() => [])
        ]);
        setDisciplines(d || []);
        setRows(Array.isArray(r) ? r : []);
      } catch (err) {
        console.error('Failed to load data:', err);
        setDisciplines([]);
        setRows([]);
      }
    };
    loadData();
  }, [year]);

  useEffect(() => {
    setFilterDiscipline(disciplineCode || 'all');
  }, [disciplineCode]);

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const filterCode = (filterDiscipline || 'all').toLowerCase();

    return rows.filter((r) => {
      // 1. Filter by discipline (case-insensitive)
      if (filterCode !== 'all') {
        const codes = (Array.isArray(r.discipline) ? r.discipline : [r.discipline])
          .map(c => String(c).toLowerCase());
        if (!codes.includes(filterCode)) return false;
      }

      // 2. Filter by search term (search in all relevant fields)
      if (!q) return true;

      const venueStr = `${r.venuePlace || ''} ${r.venueTal || ''} ${r.venueDist || ''} ${r.venue || ''}`.toLowerCase();
      const contactsStr = (r.contacts || []).map(c => 
        `${c.contactPerson || ''} ${c.designation || ''} ${c.email || ''} ${c.mobile || ''}`
      ).join(' ').toLowerCase();

      const fields = [
        r.eventCategory, 
        r.eventName, 
        venueStr, 
        r.objectives, 
        r.aboutEvent,
        r.targetGroup, 
        contactsStr, 
        r.mediaCoverage,
        r.chiefGuest,
        r.chiefGuestCategory,
        r.postEventDetails,
        r.startDate,
        r.endDate
      ].map(v => (v || '').toString().toLowerCase());

      return fields.some(f => f.includes(q));
    });
  }, [rows, searchTerm, filterDiscipline]);

  const currentDisciplineCode = disciplineCode || (filterDiscipline !== 'all' ? filterDiscipline : null);
  const isAdmin = (user?.role || '').toLowerCase() === 'admin';
  const userPermissions = user?.permissions || {};

  // Check if user has data_entry enabled (globally or in any discipline)
  const hasDataEntryEnabled = useMemo(() => {
    if (user?.dataEntryEnabled) return true;
    return Object.values(userPermissions).some(
      (arr) => Array.isArray(arr) && arr.includes('data_entry')
    );
  }, [user?.dataEntryEnabled, userPermissions]);

  const getPermissionsForDiscipline = (code) => {
    if (!code) return [];
    const raw = userPermissions[code];
    return Array.isArray(raw) ? raw : [];
  };

  const currentPerms = useMemo(
    () => (isAdmin ? ['create', 'view', 'update', 'delete', 'import'] : getPermissionsForDiscipline(currentDisciplineCode)),
    [isAdmin, currentDisciplineCode, userPermissions]
  );

  // If data_entry is enabled, user gets full access to all operations regardless of individual permission toggles
  const hasPermission = (perm) => isAdmin || hasDataEntryEnabled || currentPerms.includes(perm);

  const canCreate = hasPermission('create');
  const canView = hasPermission('view');
  const canUpdate = hasPermission('update');
  const canDelete = hasPermission('delete');
  const canImport = hasPermission('import');

  const totalEntriesForDiscipline = useMemo(() => {
    const dCode = (disciplineCode || 'all').toLowerCase();
    if (dCode === 'all') return rows.length;
    return rows.filter((r) => {
      const codes = (Array.isArray(r.discipline) ? r.discipline : [r.discipline])
        .map(c => String(c).toLowerCase());
      return codes.includes(dCode);
    }).length;
  }, [rows, disciplineCode]);

  const getDisciplineName = (code) => {
    if (!code) return '';
    const found = disciplines.find((d) => d.code === code);
    return found ? found.name : code;
  };

  const handleViewRow = (row) => {
    if (!row || !canView) return;
    navigate(`/dashboard/data-entry/${row._id || 'preview'}/view`, {
      state: { record: row },
    });
  };

  const handleEditRow = (row) => {
    if (!row || !canUpdate) return;
    navigate(`/dashboard/data-entry/${row._id || 'preview'}/edit`, {
      state: { record: row, selectedYear: year },
    });
  };

  const handleDeleteRow = (row) => {
    if (!row?._id || !canDelete) return;
    setDeletePasswordError('');
    setDeleteModal({
      row,
      title: 'Delete Record',
      message: 'Are you sure you want to delete this data entry record? This action cannot be undone.',
    });
  };

  const confirmDelete = async (adminPassword) => {
    if (!deleteModal?.row?._id || !adminPassword) {
      setDeletePasswordError('Please enter your account password.');
      return;
    }
    try {
      setActionLoading(true);
      setDeletePasswordError('');
      await dataEntryAPI.remove(deleteModal.row._id, { adminPassword });
      setRows((prev) => prev.filter((r) => r._id !== deleteModal.row._id));
      setDeleteModal(null);
    } catch (err) {
      setDeletePasswordError(err.message || 'Failed to delete record. Please check your password and try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const openManual = () => {
    if (!canCreate) return;
    if (filterDiscipline && filterDiscipline !== 'all') {
      navigate(`/dashboard/data-entry/${filterDiscipline}/new`, { state: { selectedYear: year } });
    } else {
      navigate('/dashboard/data-entry/new', { state: { selectedYear: year } });
    }
  };

  const handleImport = () => {
    if (!canImport) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        if (ext === 'xlsx' || ext === 'xls') {
          setActionLoading(true);
          
          const inferSourceModule = () => {
            if (disciplineCode && disciplineCode !== 'all') {
              const d = disciplines.find((x) => x.code === disciplineCode);
              return `${(d && d.name) ? d.name : disciplineCode} discipline module`;
            }
            return 'data entry module';
          };
          const sourceModule = inferSourceModule();
          const createdByName = user?.name || 'Unknown user';

          const data = new Uint8Array(evt.target.result);
          // Don't use cellDates: true; we want the formatted text from Excel
          const wb = XLSX.read(data, { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          // Use raw: false to get strings exactly as they appear in the cells (e.g. "01-01-2024")
          const json = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });

          const mapped = json.map((row) => {
            const norm = {};
            const clean = (s) => String(s).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            
            Object.keys(row).forEach((k) => {
              const nk = clean(k);
              norm[nk] = row[k];
            });

            const pick = (...keys) => {
              for (const k of keys) {
                const ck = clean(k);
                if (norm[ck] !== undefined && norm[ck] !== '') {
                  return norm[ck];
                }
              }
              return '';
            };

            const val = (v) => (v === undefined || v === null ? '' : v);
            const num = (v) => {
              const parsed = parseInt(String(v).replace(/[^0-9]/g, ''));
              return isNaN(parsed) ? 0 : parsed;
            };

            // Aggressive date parser for Excel strings
            const parseDate = (v) => {
              if (v === undefined || v === null || v === '') return undefined;
              
              // If it's a JS Date (though we use raw: false, it's a safety check)
              if (v instanceof Date) {
                if (isNaN(v.getTime())) return undefined;
                return v;
              }
              
              const s = String(v).trim();
              if (!s || /^\d{4}$/.test(s)) return undefined; // Skip simple years

              // Try parsing DD-MM-YYYY, DD/MM/YYYY, or DD.MM.YYYY
              const parts = s.split(/[\/\-\.]/);
              if (parts.length === 3) {
                let d, m, y;
                // Check if it's YYYY-MM-DD (4 digit year first)
                if (parts[0].length === 4) {
                  y = parseInt(parts[0]);
                  m = parseInt(parts[1]);
                  d = parseInt(parts[2]);
                } else {
                  // Assume DD-MM-YYYY (most common in India)
                  d = parseInt(parts[0]);
                  m = parseInt(parts[1]);
                  y = parseInt(parts[2]);
                  
                  // Handle 2-digit years (e.g. 1/1/24)
                  if (y < 100) y += 2000;
                }

                if (y > 1900 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
                  // Use local time for Date object creation
                  const dateObj = new Date(y, m - 1, d);
                  if (!isNaN(dateObj.getTime())) return dateObj;
                }
              }

              // Fallback to native Date parsing
              const fallback = new Date(s);
              // Avoid Jan 1, 1970
              if (isNaN(fallback.getTime()) || fallback.getTime() < 31536000000) return undefined;
              return fallback;
            };

            const formatDateToDDMMYYYY = (d) => {
              if (!d || isNaN(d.getTime())) return undefined;
              const day = String(d.getDate()).padStart(2, '0');
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const year = d.getFullYear();
              return `${day}/${month}/${year}`;
            };

            const startDateObj = parseDate(pick('start date', 'event start date', 'date', 'event date', 'date of event', 'from date', 'starting date'));
            const recordYear = startDateObj ? startDateObj.getFullYear() : (num(pick('year')) || year);

            const startDateStr = formatDateToDDMMYYYY(startDateObj) || `01/01/${recordYear}`;
            const endDateStr = formatDateToDDMMYYYY(parseDate(pick('end date', 'event end date', 'date of completion', 'closing date', 'end', 'to date', 'completion date', 'event end'))) || startDateStr;

            // Construct contact person object
            const contact = {
              contactPerson: val(pick('contact person', 'contact', 'coordinator', 'scientist name', 'scientist')),
              designation: val(pick('designation', 'post', 'designation of scientist')),
              discipline: val(pick('contact discipline', 'dept', 'department', 'discipline name')),
              email: val(pick('email', 'e-mail', 'email id')),
              mobile: val(pick('mobile', 'mobile no.', 'phone', 'contact no', 'mobile number')),
              landline: val(pick('landline no.', 'landline', 'land line', 'tel no', 'office no', 'landline number', 'telephone', 'phone no', 'office phone', 'contact number', 'tel', 'phone'))
            };

            // Only add contact if name is present
            const contacts = contact.contactPerson ? [contact] : [];

            // Handle discipline as array
            let disciplineRaw = val(pick('discipline', 'discipline code', 'discipline name'));
            let disciplineArr = [];
            if (disciplineRaw) {
              disciplineArr = disciplineRaw.split(',').map(d => d.trim().toLowerCase()).filter(Boolean);
            }
            
            // If in a specific discipline module, ensure that discipline is in the array
            if (disciplineCode && disciplineCode !== 'all') {
              const dCodeLower = disciplineCode.toLowerCase();
              if (!disciplineArr.includes(dCodeLower)) {
                disciplineArr.push(dCodeLower);
              }
            } else if (disciplineArr.length === 0) {
              disciplineArr = ['general']; // Fallback
            }

            return {
              year: recordYear,
              eventType: val(pick('event type', 'type', 'activity type')) || 'Extension Activities',
              eventCategory: val(pick('event category', 'category', 'event category name')),
              eventName: val(pick('event name/sub category', 'event name', 'sub category', 'title', 'name', 'activity name')),
              startDate: startDateStr,
              endDate: endDateStr,
              venuePlace: val(pick('venue', 'location', 'place', 'venue details', 'venue place')),
              venueTal: val(pick('taluka', 'tal', 'block')),
              venueDist: val(pick('district', 'dist')),
              objectives: val(pick('objectives', 'objective', 'aim')),
              aboutEvent: val(pick('about the event', 'about event', 'description', 'event details')),
              targetGroup: val(pick('target group', 'group', 'audience')) || 'Farmers',
              contacts: contacts,
              chiefGuestCategory: val(pick('chief guest category', 'guest category', 'type of guest', 'category of guest', 'guest type', 'guest designation', 'chief guest designation', 'category of chief guest')),
              chiefGuest: val(pick('chief guest', 'cheif guest', 'guest', 'guest name', 'chief guest name', 'inaugurated by', 'inaugurated name', 'guest name', 'chief guest name/inaugurated by', 'inaugurated by name')),
              chiefGuestRemark: val(pick('chief guest remark', 'cheif guest remark', 'guest remark', 'remark', 'remarks', 'feedback', 'chief guest remarks')),
              postEventDetails: val(pick('post event details', 'post event remark', 'after event')),
              genMale: num(pick('gen male', 'general male', 'male', 'gen m', 'general m')),
              genFemale: num(pick('gen female', 'general female', 'female', 'gen f', 'general f')),
              scMale: num(pick('sc male', 'sc m', 'sc(m)', 'sc male count')),
              scFemale: num(pick('sc female', 'sc f', 'sc(f)', 'sc female count')),
              stMale: num(pick('st male', 'st m', 'st(m)', 'st male count')),
              stFemale: num(pick('st female', 'st f', 'st(f)', 'st female count')),
              otherMale: num(pick('other male', 'others m', 'other m', 'other(m)', 'others male')),
              otherFemale: num(pick('other female', 'others f', 'other f', 'other(f)', 'others female')),
              efMale: num(pick('ef male', 'ef m', 'ef(m)', 'ef male count')),
              efFemale: num(pick('ef female', 'ef f', 'ef(f)', 'ef female count')),
              mediaCoverage: val(pick('media coverage', 'media', 'coverage', 'covered by')) || 'Not Covered',
              discipline: disciplineArr,
              sourceModule,
              createdByName
            };
          }).filter((r) => r.eventCategory || r.eventName);

          if (mapped.length === 0) {
            alert('No valid data found in Excel sheet.');
            return;
          }

          // Track years found in the imported data
          const yearsInImport = Array.from(new Set(mapped.map(r => r.year)));

          // Chunk the data for large imports (e.g., 500 records per request)
          const chunkSize = 500;
          let insertedCount = 0;
          
          for (let i = 0; i < mapped.length; i += chunkSize) {
            const chunk = mapped.slice(i, i + chunkSize);
            const response = await importAPI.bulkDataEntry(chunk);
            insertedCount += (response.count || response.insertedCount || 0);
          }

          if (yearsInImport.length > 1 || !yearsInImport.includes(year)) {
            alert(`Successfully imported ${insertedCount} records! Some records belong to years other than ${year}. Please switch the year to see them.`);
          } else {
            alert(`Successfully imported ${insertedCount} records!`);
          }
          
          // Refresh the data for the current year
          const updatedRows = await dataEntryAPI.get(year);
          setRows(updatedRows || []);
        }
      } catch (err) {
        console.error('Import failed:', err);
        alert(`Import failed: ${err.message}`);
      } finally {
        setActionLoading(false);
        e.target.value = '';
      }
    };

    if (ext === 'xlsx' || ext === 'xls') {
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please select a valid Excel file (.xlsx or .xls)');
    }
  };

  const handleExport = () => {
    if (!rows.length) return;
    
    // Convert data for Excel export
    const exportData = rows.map((r, idx) => ({
      'Sr No.': idx + 1,
      'Year': r.year,
      'Event Type': r.eventType,
      'Event Category': r.eventCategory,
      'Event Name': r.eventName,
      'Start Date': r.startDate, // Already stored as DD/MM/YYYY
      'End Date': r.endDate || '—',
      'Venue': `${r.venuePlace || ''}${r.venueTal ? `, Tal: ${r.venueTal}` : ''}${r.venueDist ? `, Dist: ${r.venueDist}` : ''}`,
      'Objectives': r.objectives,
      'About Event': r.aboutEvent,
      'Target Group': r.targetGroup,
      'Contact Persons': (r.contacts || []).map(c => c.contactPerson).join(', '),
      'Designations': (r.contacts || []).map(c => c.designation).join(', '),
      'Emails': (r.contacts || []).map(c => c.email).join(', '),
      'Mobiles': (r.contacts || []).map(c => c.mobile).join(', '),
      'Landline No.': (r.contacts || []).map(c => c.landline).join(', '),
      'Chief Guest Category': r.chiefGuestCategory,
      'Chief Guest Name': r.chiefGuest,
      'Chief Guest Remark': r.chiefGuestRemark,
      'Post Event Details': r.postEventDetails,
      'SC Male': r.scMale || 0,
      'SC Female': r.scFemale || 0,
      'ST Male': r.stMale || 0,
      'ST Female': r.stFemale || 0,
      'General Male': r.genMale || 0,
      'General Female': r.genFemale || 0,
      'Other Male': r.otherMale || 0,
      'Other Female': r.otherFemale || 0,
      'EF Male': r.efMale || 0,
      'EF Female': r.efFemale || 0,
      'Media Coverage': r.mediaCoverage,
      'Discipline': Array.isArray(r.discipline) ? r.discipline.join(', ') : r.discipline
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DataEntryExport');
    XLSX.writeFile(wb, `DataEntry_Export_${year}.xlsx`);
  };

  return (
    <div className="da-manage-employee-container">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {showActions ? (
        <DEHeader
          onImportClick={canImport ? handleImport : undefined}
          onExportClick={handleExport}
          onManualClick={canCreate ? openManual : undefined}
          selectedYear={year}
          onYearChange={setYear}
        />
      ) : (
        <div className="da-employee-header">
          <div className="da-header-content">
            <div>
              <h1 className="da-page-title">
                {getDisciplineName(disciplineCode) || 'Discipline Data Entry'}
              </h1>
              <p className="da-page-subtitle">
                Create, view, update, delete and import data for your discipline.
              </p>
            </div>
            <div className="da-header-actions">
              <div className="da-filter" style={{ minWidth: '150px' }}>
                <span style={{ fontWeight: 700, color: 'var(--me-primary-medium)' }}>Year</span>
                <select
                  className="da-select"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value, 10))}
                >
                  {Array.from(
                    { length: new Date().getFullYear() - 2017 + 1 },
                    (_, i) => 2017 + i
                  )
                    .reverse()
                    .map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                </select>
              </div>

              <div className="da-stat-card">
                <div className="da-stat-icon-wrapper">
                  <FileText size={24} />
                </div>
                <div className="da-stat-content">
                  <span className="da-stat-label">
                    {getDisciplineName(disciplineCode) || 'Discipline'} Entries ({year})
                  </span>
                  <div className="da-stat-value">
                    {totalEntriesForDiscipline}
                    <span className="da-stat-unit">records</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DETable
        rows={filteredRows}
        disciplines={disciplines}
        onView={canView ? handleViewRow : undefined}
        onEdit={canUpdate ? handleEditRow : undefined}
        onDelete={canDelete ? handleDeleteRow : undefined}
        onImport={canImport ? handleImport : undefined}
        onManual={canCreate ? openManual : undefined}
        canView={canView}
        canEdit={canUpdate}
        canDelete={canDelete}
        canImport={canImport}
        canCreate={canCreate}
        isDisciplineModule={!!disciplineCode}
      />

      {deleteModal && (
        <div className="me-modal-overlay">
          <div className="me-modal" onClick={(e) => e.stopPropagation()}>
            <div className="me-modal-header">
              <div className="me-modal-title">
                <AlertCircle size={20} />
                {deleteModal.title}
              </div>
              <button
                type="button"
                className="me-icon-btn"
                onClick={() => setDeleteModal(null)}
                aria-label="Close"
                disabled={actionLoading}
              >
                <X size={20} />
              </button>
            </div>
            <div className="me-modal-body">
              <p className="me-modal-message">{deleteModal.message}</p>
              <div className="me-form-group">
                <label className="me-label">
                  <Key size={14} />
                  Account Password *
                </label>
                <input
                  id="dataEntryDeletePassword"
                  type="password"
                  className={`me-input ${deletePasswordError ? 'me-input-error' : ''}`}
                  placeholder="Enter your account password to confirm"
                  onChange={() => setDeletePasswordError('')}
                  autoFocus
                />
                {deletePasswordError && (
                  <p className="me-inline-error">{deletePasswordError}</p>
                )}
              </div>
            </div>
            <div className="me-modal-footer">
              <button
                type="button"
                className="me-btn me-btn-light"
                onClick={() => setDeleteModal(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="me-btn me-btn-danger"
                onClick={() => {
                  const passwordInput = document.getElementById('dataEntryDeletePassword');
                  const adminPassword = passwordInput?.value?.trim();
                  confirmDelete(adminPassword);
                }}
                disabled={actionLoading}
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataEntry;
