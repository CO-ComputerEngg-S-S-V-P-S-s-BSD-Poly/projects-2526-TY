// src/pages/DashboardHome.js
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { authAPI, disciplineAPI, yearLockAPI } from '../services/api';
import { dataEntryAPI } from '../services/dataEntryApi';
import DETable from '../components/data-entry/DETable';
import DataEntryForm from './DataEntryForm';
import ReportPrint from '../components/ReportPrint';
import '../styles/ManageEmployee.me.css';
import '../styles/DataEntry.css';
import '../styles/DashboardHome.css';
import { Filter, FileText, Loader2, Search, LayoutDashboard, Printer, ChevronDown, ChevronUp, Filter as FunnelIcon, Lock, Unlock, Eye, EyeOff, CheckCircle, AlertCircle, X, Key, Edit, Users, Info, Calendar } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const levenshtein = (a, b) => {
  const s = a || '';
  const t = b || '';
  if (s === t) return 0;
  if (!s) return t.length;
  if (!t) return s.length;
  const rows = s.length + 1;
  const cols = t.length + 1;
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[rows - 1][cols - 1];
};

const FilterDropdown = ({ value, options, placeholder, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const displayLabel = value || placeholder;

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className={`dh-filter-dropdown ${open ? 'open' : ''}`} ref={ref}>
      <button
        type="button"
        className="dh-filter-select dh-filter-select-trigger"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="dh-filter-select-text">
          {displayLabel}
        </span>
        <ChevronDown size={16} className="dh-filter-select-caret" />
      </button>
      {open && (
        <div className="dh-filter-dropdown-menu">
          <button
            type="button"
            className={`dh-filter-dropdown-option ${value === '' ? 'active' : ''}`}
            onClick={() => handleSelect('')}
          >
            {placeholder}
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`dh-filter-dropdown-option ${value === opt ? 'active' : ''}`}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const DateSearchInput = ({ value, onChange, placeholder, selectedYear }) => {
  const dateInputRef = useRef(null);

  const handleTextChange = (e) => {
    let val = e.target.value;
    const isDeleting = value && val.length < value.length;
    
    if (isDeleting) {
      // If we are deleting the character just before a slash, or the slash itself
      // we allow the default behavior but we don't want to re-trigger auto-formatting
      onChange(val);
      return;
    }

    // Only allow digits and slashes
    val = val.replace(/[^\d/]/g, '');

    // 1. Auto-add first slash after DD (length 2)
    if (val.length === 2 && !val.includes('/')) {
      val += '/';
    }
    
    // 2. Auto-add second slash and year after MM (length 5, e.g. "DD/MM")
    if (val.length === 5 && val.split('/').length === 2) {
      if (selectedYear && selectedYear !== 'all') {
        val += '/' + selectedYear;
      } else if (!val.endsWith('/')) {
        val += '/';
      }
    }

    // Limit to 10 characters (DD/MM/YYYY)
    if (val.length <= 10) {
      onChange(val);
    }
  };

  const handleDateSelect = (e) => {
    const dateVal = e.target.value; // YYYY-MM-DD
    if (!dateVal) return;
    let [y, m, d] = dateVal.split('-');
    
    // Enforce selectedYear if it's a specific year
    if (selectedYear && selectedYear !== 'all') {
      y = selectedYear.toString();
    }
    
    onChange(`${d}/${m}/${y}`);
  };

  const triggerPicker = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === 'function') {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.click();
      }
    }
  };

  // Set min/max for date picker if a specific year is selected
  const datePickerProps = {};
  if (selectedYear && selectedYear !== 'all') {
    datePickerProps.min = `${selectedYear}-01-01`;
    datePickerProps.max = `${selectedYear}-12-31`;
  }

  return (
    <div className="dh-date-search-wrapper">
      <input
        type="text"
        className="dh-date-search-input"
        placeholder={placeholder}
        value={value}
        onChange={handleTextChange}
        maxLength={10}
      />
      <div className="dh-date-picker-trigger" onClick={triggerPicker}>
        <Calendar size={18} className="dh-date-icon" />
      </div>
      <input
        type="date"
        ref={dateInputRef}
        className="dh-hidden-date-picker"
        onChange={handleDateSelect}
        {...datePickerProps}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
      />
    </div>
  );
};

const DashboardHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Initialize state from location state if available (for year persistence)
  const rf = location.state && location.state.restoreFilters;

  const [rows, setRows] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(rf?.year !== undefined ? rf.year : 'all');
  const [searchTerm, setSearchTerm] = useState(rf?.searchTerm || '');

  // Automatically update filter years when the global year selection changes
  useEffect(() => {
    if (year !== 'all') {
      setSearchFields(prev => {
        let updated = false;
        const next = { ...prev };
        
        if (next.startDate && next.startDate.length === 10) {
          const parts = next.startDate.split('/');
          if (parts[2] !== year.toString()) {
            parts[2] = year.toString();
            next.startDate = parts.join('/');
            updated = true;
          }
        }
        
        if (next.endDate && next.endDate.length === 10) {
          const parts = next.endDate.split('/');
          if (parts[2] !== year.toString()) {
            parts[2] = year.toString();
            next.endDate = parts.join('/');
            updated = true;
          }
        }
        
        return updated ? next : prev;
      });
    }
  }, [year]);
  const [showFilters, setShowFilters] = useState(rf?.showFilters || false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printRange, setPrintRange] = useState({ start: '', end: '' });
  const [selectedCols, setSelectedCols] = useState(''); // New: e.g. "5-7" or "5,6,7"

  // Year Lock State
  const [lockedYears, setLockedYears] = useState(new Set());
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockPassword, setLockPassword] = useState('');
  const [showLockPassword, setShowLockPassword] = useState(false);
  const [lockError, setLockError] = useState('');
  const [isLocking, setIsLocking] = useState(false);
  const [showRefreshAlert, setShowRefreshAlert] = useState(false);

  // Specific search fields
  const [searchFields, setSearchFields] = useState(rf?.searchFields || {
    discipline: '',
    eventType: '',
    eventCategory: '', // Merged field
    taluka: '', // New field
    targetGroup: '', // New field
    startDate: '',
    endDate: '',
    media: '',
    contact: '',
    sortByDate: 'desc' // 'asc' or 'desc'
  });

  // Extract unique options for dropdowns
  const options = useMemo(() => {
    const eventTypes = new Set();
    const eventCategories = new Set(); // Merged
    const talukas = new Set(['Dhule', 'Sakri', 'Shirpur', 'Shindkheda']); // Defaults
    const targetGroups = new Set();
    const media = new Set();
    const contacts = new Set();

    rows.forEach(r => {
      if (r.eventType) eventTypes.add(r.eventType);
      if (r.eventCategory) eventCategories.add(r.eventCategory);
      if (r.venueTal) talukas.add(r.venueTal);
      if (r.targetGroup) targetGroups.add(r.targetGroup);

      if (r.mediaCoverage) media.add(r.mediaCoverage);
      (r.contacts || []).forEach(c => {
        if (c.contactPerson) contacts.add(c.contactPerson);
      });
    });

    return {
      eventTypes: Array.from(eventTypes).sort(),
      eventCategories: Array.from(eventCategories).sort(),
      talukas: Array.from(talukas).sort(),
      targetGroups: Array.from(targetGroups).sort(),
      media: Array.from(media).sort(),
      contacts: Array.from(contacts).sort()
    };
  }, [rows]);

  const handleResetAll = () => {
    // 1. Clear search term
    setSearchTerm('');
    // 2. Reset all filter fields
    setSearchFields({
      discipline: '',
      eventType: '',
      eventCategory: '',
      taluka: '',
      targetGroup: '',
      startDate: '',
      endDate: '',
      media: '',
      contact: '',
      sortByDate: 'desc'
    });
    // 3. Show the success alert
    setShowRefreshAlert(true);
    // 4. Hide alert after 3 seconds
    setTimeout(() => {
      setShowRefreshAlert(false);
    }, 3000);
  };

  const isAdmin = (user?.role || '').toLowerCase() === 'admin';
  const isProgramAssistant = (user?.role || '').toLowerCase() === 'program assistant' || (user?.role || '').toLowerCase() === 'program_assistant';
  const hasDataEntryEnabled = !!user?.dataEntryEnabled;

  const [actionModal, setActionModal] = useState(null); // { type: 'edit' | 'delete', row: object }
  const [statusModal, setStatusModal] = useState(null); // { title, message, type }
  const [actionPassword, setActionPassword] = useState('');
  const [actionPasswordError, setActionPasswordError] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showActionPassword, setShowActionPassword] = useState(false);

  const handleViewRow = (row) => {
    if (!row?._id) return;
    navigate(`/dashboard/data-entry/${row._id}/view`, { 
      state: { 
        record: row, 
        returnToPath: location.pathname,
        restoreFilters: { year, searchTerm, showFilters, searchFields } 
      } 
    });
  };

  const handleEditRow = (row) => {
    setActionPassword('');
    setActionPasswordError('');
    setShowActionPassword(false);
    setActionModal({ type: 'edit', row });
  };

  const handleDeleteRowClick = (row) => {
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
            selectedYear: year,
            returnToPath: location.pathname,
            restoreFilters: { year, searchTerm, showFilters, searchFields } 
          } 
        });
        setActionModal(null);
      } else if (actionModal.type === 'delete') {
        // Perform delete
        await dataEntryAPI.remove(actionModal.row._id, { adminPassword: actionPassword });
        setRows(prev => prev.filter(r => r._id !== actionModal.row._id));
        setActionModal(null);
      }
    } catch (err) {
      setActionPasswordError(err.message || 'Incorrect password. Please try again.');
    } finally {
      setIsActionLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [d, r, locks] = await Promise.all([
          disciplineAPI.list({ includeDeleted: true }).catch(() => []),
          dataEntryAPI.get(year).catch(() => []),
          yearLockAPI.getAll().catch(() => [])
        ]);
        setDisciplines(d || []);
        setRows(Array.isArray(r) ? r : []);
        setLockedYears(new Set((locks || []).filter(l => l.isLocked).map(l => l.year)));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setDisciplines([]);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [year]);

  const handleLockToggle = () => {
    setLockPassword('');
    setLockError('');
    setShowLockPassword(false);
    setShowLockModal(true);
  };

  const confirmLockToggle = async () => {
    if (!lockPassword) {
      setLockError('Please enter your password to confirm.');
      return;
    }

    setIsLocking(true);
    setLockError('');
    try {
      const isCurrentlyLocked = lockedYears.has(year);
      if (isCurrentlyLocked) {
        await yearLockAPI.unlock(year, lockPassword);
        setLockedYears(prev => {
          const next = new Set(prev);
          next.delete(year);
          return next;
        });
        // Show informative modal for admin after unlocking
        setStatusModal({
          title: 'Year Unlocked Successfully',
          message: `The data for the year ${year} is now unlocked. Users can now add, edit, and delete data for this year.`,
          type: 'success'
        });
      } else {
        await yearLockAPI.lock(year, lockPassword);
        setLockedYears(prev => {
          const next = new Set(prev);
          next.add(year);
          return next;
        });
        // Show informative modal for admin after locking
        setStatusModal({
          title: 'Year Locked Successfully',
          message: `The data for the year ${year} is now locked. No user can add, edit, delete, or import data for this year.`,
          type: 'success'
        });
      }
      setShowLockModal(false);
    } catch (err) {
      setLockError(err.message || 'Incorrect password. Please try again.');
    } finally {
      setIsLocking(false);
    }
  };

  const isCurrentYearLocked = year !== 'all' && lockedYears.has(year);

  // Restore filters when returning from View/Edit
  useEffect(() => {
    const rf = location.state && location.state.restoreFilters;
    if (!rf) return;

    // Clear restore state so it doesn't re-apply if user refreshes or navigates away and back
    navigate(location.pathname, { replace: true, state: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const filteredRows = useMemo(() => {
    let result = rows;

    // 1. Global search
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      result = result.filter((r) => {
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
    }

    // 2. Specific field searches
    if (searchFields.discipline) {
      const ds = searchFields.discipline.toLowerCase();
      result = result.filter(r => {
        const codes = Array.isArray(r.discipline) ? r.discipline : [r.discipline];
        return codes.some(c => {
          const dName = disciplines.find(d => d.code === c)?.name || c;
          return dName.toLowerCase().includes(ds);
        });
      });
    }

    if (searchFields.eventType) {
      const et = searchFields.eventType.toLowerCase();
      result = result.filter(r => (r.eventType || '').toLowerCase() === et);
    }

    if (searchFields.eventCategory) {
      const cat = searchFields.eventCategory.toLowerCase();
      result = result.filter(r => (r.eventCategory || '').toLowerCase() === cat);
    }

    if (searchFields.targetGroup) {
      const tg = searchFields.targetGroup.toLowerCase();
      result = result.filter(r => (r.targetGroup || '').toLowerCase() === tg);
    }

    if (searchFields.taluka) {
      const tal = searchFields.taluka.toLowerCase();
      result = result.filter(r => {
        const venueWords = `${r.venueTal || ''} ${r.venuePlace || ''} ${r.venue || ''}`.toLowerCase().split(/\s+/).filter(Boolean);
        return venueWords.some(word => levenshtein(word, tal) <= 2);
      });
    }

    if (searchFields.startDate && !searchFields.endDate) {
      result = result.filter(r => {
        if (!r.startDate) return false;
        const d = new Date(r.startDate);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const fmt = `${day}/${month}/${year}`;
        return fmt.includes(searchFields.startDate);
      });
    } else if (!searchFields.startDate && searchFields.endDate) {
      result = result.filter(r => {
        if (!r.endDate) return false;
        const d = new Date(r.endDate);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const fmt = `${day}/${month}/${year}`;
        return fmt.includes(searchFields.endDate);
      });
    } else if (searchFields.startDate && searchFields.endDate && searchFields.startDate.length === 10 && searchFields.endDate.length === 10) {
      // Range search only when both are full dates
      const [sd, sm, sy] = searchFields.startDate.split('/').map(Number);
      const [ed, em, ey] = searchFields.endDate.split('/').map(Number);
      const startLimit = new Date(sy, sm - 1, sd);
      const endLimit = new Date(ey, em - 1, ed);
      endLimit.setHours(23, 59, 59, 999);

      result = result.filter(r => {
        if (!r.startDate) return false;
        const d = new Date(r.startDate);
        return d >= startLimit && d <= endLimit;
      });
    } else if (searchFields.startDate && searchFields.endDate) {
      // Partial search on both fields if they aren't full dates yet
      result = result.filter(r => {
        if (!r.startDate || !r.endDate) return false;
        const sd = new Date(r.startDate);
        const sfmt = `${String(sd.getDate()).padStart(2, '0')}/${String(sd.getMonth() + 1).padStart(2, '0')}/${sd.getFullYear()}`;
        
        const ed = new Date(r.endDate);
        const efmt = `${String(ed.getDate()).padStart(2, '0')}/${String(ed.getMonth() + 1).padStart(2, '0')}/${ed.getFullYear()}`;
        
        return sfmt.includes(searchFields.startDate) && efmt.includes(searchFields.endDate);
      });
    }

    if (searchFields.media) {
      const med = searchFields.media.toLowerCase();
      result = result.filter(r => (r.mediaCoverage || '').toLowerCase().includes(med));
    }

    if (searchFields.contact) {
      const con = searchFields.contact.toLowerCase();
      result = result.filter(r => {
        const contacts = r.contacts || [];
        return contacts.some(c => (c.contactPerson || '').toLowerCase().includes(con));
      });
    }

    // 3. Sorting
    if (searchFields.sortByDate) {
      result = [...result].sort((a, b) => {
        const dateA = new Date(a.startDate || 0);
        const dateB = new Date(b.startDate || 0);
        return searchFields.sortByDate === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    return result;
  }, [rows, searchTerm, searchFields, disciplines]);

  // Beneficiary Summary Logic
  const beneficiarySummary = useMemo(() => {
    const totals = {
      male: 0,
      female: 0,
      scMale: 0,
      scFemale: 0,
      scTotal: 0,
      stMale: 0,
      stFemale: 0,
      stTotal: 0,
      otherMale: 0,
      otherFemale: 0,
      otherTotal: 0,
      efMale: 0,
      efFemale: 0,
      efTotal: 0,
      grandTotal: 0
    };

    filteredRows.forEach(row => {
      const sm = parseInt(row.scMale) || 0;
      const sf = parseInt(row.scFemale) || 0;
      const tm = parseInt(row.stMale) || 0;
      const tf = parseInt(row.stFemale) || 0;
      const om = parseInt(row.otherMale) || 0;
      const of = parseInt(row.otherFemale) || 0;
      const em = parseInt(row.efMale) || 0;
      const ef = parseInt(row.efFemale) || 0;
      const gm = parseInt(row.genMale) || 0;
      const gf = parseInt(row.genFemale) || 0;

      totals.scMale += sm;
      totals.scFemale += sf;
      totals.scTotal += (parseInt(row.scTotal) || (sm + sf));

      totals.stMale += tm;
      totals.stFemale += tf;
      totals.stTotal += (parseInt(row.stTotal) || (tm + tf));

      totals.otherMale += om;
      totals.otherFemale += of;
      totals.otherTotal += (parseInt(row.otherTotal) || (om + of));

      totals.efMale += em;
      totals.efFemale += ef;
      totals.efTotal += (parseInt(row.efTotal) || (em + ef));

      const rowMale = parseInt(row.totalMale) || (sm + tm + om + em + gm);
      const rowFemale = parseInt(row.totalFemale) || (sf + tf + of + ef + gf);
      const rowTotal = parseInt(row.grandTotal) || (parseInt(row.total) || (rowMale + rowFemale));

      totals.male += rowMale;
      totals.female += rowFemale;
      totals.grandTotal += rowTotal;
    });

    return totals;
  }, [filteredRows]);

  // Print Logic: Row chunking is REQUIRED for tiling. 
  // If we show all rows in Part 1, Part 2 will be on Page 20+ for the same rows.
  const printChunks = useMemo(() => {
    if (!filteredRows.length) return [];

    // Use user-defined range or default to all filtered rows
    const startIdx = Math.max(1, printRange.start) - 1;
    const endIdx = Math.min(filteredRows.length, printRange.end);
    const rangeRows = filteredRows.slice(startIdx, endIdx);

    if (!rangeRows.length) return [];

    // Helper to parse column input like "5-7" or "5,6,7"
    const parseColumnInput = (input) => {
      if (!input.trim()) return null;
      const indices = new Set();
      const parts = input.split(/[,\s]+/).filter(Boolean);

      parts.forEach(part => {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(Number);
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
              // There are 26 columns total (1..26). SR No. is 1 (index 0).
              if (i >= 1 && i <= 26) indices.add(i - 1);
            }
          }
        } else {
          const val = Number(part);
          if (!isNaN(val) && val >= 1 && val <= 26) {
            indices.add(val - 1);
          }
        }
      });

      return Array.from(indices).sort((a, b) => a - b);
    };

    const userCols = parseColumnInput(selectedCols);

    // Optimized column distribution for "Perfection" in Landscape Printing
    // Note: Column 0 (Sr No.) is now automatically added to every page by DETable
    
    // Chunking Logic for Horizontal and Vertical Paging
    // Keep rows per printed page limited (7–8) for readability and to avoid content spill.
    // Each rowChunk is printed across all colChunks (Part 1..Part N) before moving to next records.
    const rowChunkSize = 8;
    const rowChunks = [];
    for (let i = 0; i < rangeRows.length; i += rowChunkSize) {
      rowChunks.push({
        data: rangeRows.slice(i, i + rowChunkSize),
        startIdx: startIdx + i + 1,
        endIdx: startIdx + Math.min(i + rowChunkSize, rangeRows.length)
      });
    }

    const colChunks = [
      [1, 2, 3, 4, 5, 6, 7],   // Part 1: First set of columns
      [8, 9, 10, 11, 12, 13, 14], // Part 2: Remaining columns for the same records
      [15, 16, 17, 18, 19, 20, 21], // Part 3
      // Part 4: ST (23), Other (24), EF (25), Media Coverage (26)
      // 0-based indices: 22..25
      [22, 23, 24, 25],
    ];

    return { rowChunks, colChunks };
  }, [filteredRows, printRange, selectedCols]);

  const handlePrintClick = () => {
    setPrintRange({ start: 1, end: filteredRows.length });
    setSelectedCols(''); // Reset column selection
    setShowPrintModal(true);
  };

  const executePrint = () => {
    if (!printRange.start || !printRange.end) {
      alert('Please enter both Start and End Serial Numbers.');
      return;
    }
    if (parseInt(printRange.start) > parseInt(printRange.end)) {
      alert('Start Serial Number cannot be greater than End Serial Number.');
      return;
    }

    setShowPrintModal(false);
    // Use setTimeout to ensure the modal is hidden before print dialog opens
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const isPrintRangeValid =
    printRange.start &&
    printRange.end &&
    parseInt(printRange.start) <= parseInt(printRange.end) &&
    parseInt(printRange.start) > 0 &&
    parseInt(printRange.end) <= filteredRows.length;

  const handleFieldChange = (field, value) => {
    setSearchFields(prev => ({ ...prev, [field]: value }));
  };

  return (
      <>
        <div className="dh-container">

      {/* Range Selection Modal */}
      {showPrintModal && (
        <div className="dh-modal-overlay">
          <div className="dh-modal-content">
            <h3 className="dh-modal-title">Print Range Selection</h3>
            <p className="dh-modal-desc">Enter the range of Serial Numbers (SR No.) you wish to print.</p>

            <div className="dh-modal-fields">
              <div className="dh-modal-field">
                <label>From SR No.</label>
                <input
                  type="number"
                  min="1"
                  max={filteredRows.length}
                  placeholder="e.g. 1"
                  value={printRange.start}
                  onChange={(e) => setPrintRange({ ...printRange, start: e.target.value })}
                  className={printRange.start && (parseInt(printRange.start) < 1 || parseInt(printRange.start) > filteredRows.length || (printRange.end && parseInt(printRange.start) > parseInt(printRange.end))) ? 'input-error' : ''}
                />
              </div>
              <div className="dh-modal-field">
                <label>To SR No.</label>
                <input
                  type="number"
                  min="1"
                  max={filteredRows.length}
                  placeholder={`e.g. ${filteredRows.length}`}
                  value={printRange.end}
                  onChange={(e) => setPrintRange({ ...printRange, end: e.target.value })}
                  className={printRange.end && (parseInt(printRange.end) < 1 || parseInt(printRange.end) > filteredRows.length || (printRange.start && parseInt(printRange.start) > parseInt(printRange.end))) ? 'input-error' : ''}
                />
              </div>
            </div>

            <div className="dh-modal-field" style={{ marginTop: '15px' }}>
              <label>Select Columns to Print (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 5-7 or 5,6,7 (Leave blank for all)"
                value={selectedCols}
                onChange={(e) => setSelectedCols(e.target.value)}
                className="dh-col-input"
              />
              <p className="dh-modal-desc" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                Specify column numbers (2-26) to print specific columns. SR No. (1) is always included.
              </p>
            </div>

            {printRange.start && printRange.end && parseInt(printRange.start) > parseInt(printRange.end) && (
              <p className="dh-modal-error-msg">Error: Start number cannot be greater than end number!</p>
            )}

            {((printRange.start && (parseInt(printRange.start) < 1 || parseInt(printRange.start) > filteredRows.length)) ||
              (printRange.end && (parseInt(printRange.end) < 1 || parseInt(printRange.end) > filteredRows.length))) && (
                <p className="dh-modal-error-msg">Error: Please enter a number between 1 and {filteredRows.length}.</p>
              )}

            <p className="dh-modal-info">Total filtered records available: <strong>{filteredRows.length}</strong></p>

            <div className="dh-modal-actions">
              <button className="da-btn da-btn-light" onClick={() => setShowPrintModal(false)}>Cancel</button>
              <button
                className={`da-btn da-btn-primary ${!isPrintRangeValid ? 'da-btn-disabled' : ''}`}
                onClick={executePrint}
                disabled={!isPrintRangeValid}
              >
                Generate Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Print Section */}
      <ReportPrint 
        chunks={printChunks} 
        disciplines={disciplines} 
        academicYear={year !== 'all' ? year : ""}
      />

      <header className="dh-header">
        <div className="dh-header-left">
          <div className="dh-logo-wrapper">
            <LayoutDashboard size={28} className="dh-logo-icon" />
          </div>
          <div className="dh-title-section">
            <h1 className="dh-title">Dashboard</h1>
            <p className="dh-subtitle">Overview of all discipline records and activities</p>
          </div>
        </div>

        <div className="dh-header-right">
          <div className={`dh-year-filter-container ${isAdmin && year !== 'all' ? 'admin-view' : ''}`}>
            <div className="dh-header-year-filter">
              <div className="ap-control-group">
                <FunnelIcon size={16} className="ap-control-icon" />
                <span className="ap-control-label">Select Year:</span>
                <select
                  className="dh-filter-select dh-year-select"
                  value={year}
                  onChange={(e) => setYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))}
                >
                  <option value="all">All Years</option>
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
              {/* Year Lock button (admin only, when specific year selected) */}
              {isAdmin && year !== 'all' && (
                <button
                  className={`dh-year-lock-btn ${isCurrentYearLocked ? 'locked' : 'unlocked'}`}
                  onClick={handleLockToggle}
                  title={isCurrentYearLocked ? `Year ${year} is Locked. Click to unlock.` : `Year ${year} is Unlocked. Click to lock.`}
                >
                  {isCurrentYearLocked ? <Lock size={18} /> : <Unlock size={18} />}
                </button>
              )}
              {/* Locked indicator for non-admin */}
              {!isAdmin && year !== 'all' && isCurrentYearLocked && (
                <div className="dh-year-locked-badge" title={`Year ${year} is locked by Admin. Please contact the administrator to make changes.`}>
                  <Lock size={14} />
                </div>
              )}
            </div>
          </div>

          <button
            className={`dh-filter-toggle-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              title="Toggle advanced filters"
            >
              <Filter size={20} />
              <span>Filters</span>
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <div className="dh-stat-card">
            <div className="dh-stat-icon-wrapper">
              <FileText size={20} />
            </div>
            <div className="dh-stat-info">
              <span className="dh-stat-label">Total Records</span>
              <span className="dh-stat-value">{rows.length}</span>
            </div>
          </div>
        </div>
      </header>

      <div className={`dh-filters-section ${showFilters ? 'show' : ''}`}>
        <div className="dh-filters-header" style={{ position: 'relative' }}>
          <h2 className="dh-filters-title">Advanced Search & Filtering</h2>
          
          {showRefreshAlert && (
            <div className="dh-refresh-alert dh-refresh-alert-inline">
              <CheckCircle size={18} />
              <span>Filters Refreshed Successfully</span>
            </div>
          )}

          <button
            className="dh-reset-btn"
            onClick={handleResetAll}
          >
            Reset All
          </button>
        </div>

        <div className="dh-filters-grid">
          <div className="dh-filter-item dh-search-filter-item">
            <label>Global Search</label>
            <div className="dh-search-box">
              <Search size={18} className="dh-search-icon" />
              <input
                type="text"
                className="dh-search-input"
                placeholder="Search across all fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>



          <div className="dh-filter-item">
            <label>Discipline</label>
            <FilterDropdown
              value={searchFields.discipline}
              options={disciplines.map(d => d.name)}
              placeholder="All Disciplines"
              onChange={(val) => handleFieldChange('discipline', val)}
            />
          </div>
          <div className="dh-filter-item">
            <label>Event Type</label>
            <FilterDropdown
              value={searchFields.eventType}
              options={options.eventTypes}
              placeholder="All Types"
              onChange={(val) => handleFieldChange('eventType', val)}
            />
          </div>
          <div className="dh-filter-item">
            <label>Event Category</label>
            <FilterDropdown
              value={searchFields.eventCategory}
              options={options.eventCategories}
              placeholder="All Categories"
              onChange={(val) => handleFieldChange('eventCategory', val)}
            />
          </div>
          <div className="dh-filter-item">
            <label>Taluka</label>
            <FilterDropdown
              value={searchFields.taluka}
              options={options.talukas}
              placeholder="All Talukas"
              onChange={(val) => handleFieldChange('taluka', val)}
            />
          </div>
          <div className="dh-filter-item">
            <label>Media Coverage</label>
            <FilterDropdown
              value={searchFields.media}
              options={options.media}
              placeholder="All Media"
              onChange={(val) => handleFieldChange('media', val)}
            />
          </div>
          <div className="dh-filter-item">
            <label>Start Date</label>
            <DateSearchInput
              value={searchFields.startDate}
              onChange={(val) => handleFieldChange('startDate', val)}
              placeholder="DD/MM/YYYY"
              selectedYear={year}
            />
          </div>
          <div className="dh-filter-item">
            <label>End Date</label>
            <DateSearchInput
              value={searchFields.endDate}
              onChange={(val) => handleFieldChange('endDate', val)}
              placeholder="DD/MM/YYYY"
              selectedYear={year}
            />
          </div>
          <div className="dh-filter-item">
            <label>Contact Person</label>
            <FilterDropdown
              value={searchFields.contact}
              options={options.contacts}
              placeholder="All Contacts"
              onChange={(val) => handleFieldChange('contact', val)}
            />
          </div>
          <div className="dh-filter-item">
            <label>Target Group</label>
            <FilterDropdown
              value={searchFields.targetGroup}
              options={options.targetGroups}
              placeholder="All Target Groups"
              onChange={(val) => handleFieldChange('targetGroup', val)}
            />
          </div>
          <div className="dh-filter-item">
            <label>Sort By Date</label>
            <FilterDropdown
              value={searchFields.sortByDate === 'asc' ? 'Ascending' : 'Descending'}
              options={['Ascending', 'Descending']}
              placeholder="Sort Order"
              onChange={(val) => handleFieldChange('sortByDate', val === 'Ascending' ? 'asc' : 'desc')}
            />
          </div>
        </div>
      </div>

      <main className="dh-content">
        {loading ? (
          <div className="dh-loader">
            <Loader2 className="dh-spinner" />
            <p>Loading dashboard records...</p>
          </div>
        ) : (
          <DETable
            rows={filteredRows}
            disciplines={disciplines}
            onView={handleViewRow}
            onEdit={handleEditRow}
            onDelete={handleDeleteRowClick}
            canView={true}
            canEdit={(!isAdmin) && (isProgramAssistant || hasDataEntryEnabled)}
            canDelete={(!isAdmin) && (isProgramAssistant || hasDataEntryEnabled)}
            canImport={false}
            canCreate={false}
            isProgramAssistant={isProgramAssistant}
            columnFilters={searchFields}
            onColumnFilterChange={handleFieldChange}
            filterOptions={{
              eventType: options.eventTypes,
              eventCategory: options.eventCategories,
              taluka: options.talukas,
              targetGroup: options.targetGroups,
              contact: options.contacts,
              discipline: disciplines.map(d => d.name),
              media: options.media
            }}
            extraHeaderActions={
              <button
                className="da-btn da-btn-light dh-print-btn"
                onClick={handlePrintClick}
                title="Print table"
              >
                <Printer size={18} />
                <span>Print</span>
              </button>
            }
          />
        )}

        {/* Beneficiary Summary Section */}
        {!loading && filteredRows.length > 0 && (
          <div className="dh-summary-section">
            <h3 className="dh-summary-title">
              <Users size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Beneficiaries Summary
            </h3>
            <div className="dh-summary-table-wrapper">
              <table className="dh-summary-table">
                <thead>
                  <tr className="dh-summary-group-header">
                    <th rowSpan={2}>Title</th>
                    <th colSpan={3}>Overall Participants</th>
                    <th colSpan={3}>SC</th>
                    <th colSpan={3}>ST</th>
                    <th colSpan={3}>OTHER</th>
                    <th colSpan={3}>EF</th>
                  </tr>
                  <tr className="dh-summary-sub-header">
                    {/* Overall */}
                    <th>MALE</th>
                    <th>FEMALE</th>
                    <th className="dh-summary-cat-total-header">TOTAL</th>
                    {/* SC */}
                    <th>MALE</th>
                    <th>FEMALE</th>
                    <th className="dh-summary-cat-total-header">TOTAL</th>
                    {/* ST */}
                    <th>MALE</th>
                    <th>FEMALE</th>
                    <th className="dh-summary-cat-total-header">TOTAL</th>
                    {/* OTHER */}
                    <th>MALE</th>
                    <th>FEMALE</th>
                    <th className="dh-summary-cat-total-header">TOTAL</th>
                    {/* EF */}
                    <th>MALE</th>
                    <th>FEMALE</th>
                    <th className="dh-summary-cat-total-header">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="dh-summary-label">Total Beneficiaries</td>
                    {/* Overall */}
                    <td>{beneficiarySummary.male}</td>
                    <td>{beneficiarySummary.female}</td>
                    <td className="dh-summary-grand-total-val">{beneficiarySummary.grandTotal}</td>
                    {/* SC */}
                    <td>{beneficiarySummary.scMale}</td>
                    <td>{beneficiarySummary.scFemale}</td>
                    <td className="dh-summary-cat-total">{beneficiarySummary.scTotal}</td>
                    {/* ST */}
                    <td>{beneficiarySummary.stMale}</td>
                    <td>{beneficiarySummary.stFemale}</td>
                    <td className="dh-summary-cat-total">{beneficiarySummary.stTotal}</td>
                    {/* OTHER */}
                    <td>{beneficiarySummary.otherMale}</td>
                    <td>{beneficiarySummary.otherFemale}</td>
                    <td className="dh-summary-cat-total">{beneficiarySummary.otherTotal}</td>
                    {/* EF */}
                    <td>{beneficiarySummary.efMale}</td>
                    <td>{beneficiarySummary.efFemale}</td>
                    <td className="dh-summary-cat-total">{beneficiarySummary.efTotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>
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

      {/* Year Lock Confirmation Modal */}
      {showLockModal && (
        <div className="me-modal-overlay">
          <div className="me-modal" onClick={(e) => e.stopPropagation()}>
            <div className="me-modal-header">
              <div className="me-modal-title">
                {lockedYears.has(year) ? <Unlock size={20} /> : <Lock size={20} />}
                {lockedYears.has(year) ? 'Unlock Records' : 'Lock Records'}
              </div>
              <button
                type="button"
                className="me-icon-btn"
                onClick={() => setShowLockModal(false)}
                aria-label="Close"
                disabled={isLocking}
              >
                <X size={20} />
              </button>
            </div>
            <div className="me-modal-body">
              <p className="me-modal-message">
                {lockedYears.has(year) 
                  ? `Unlock records for ${year}. Users will be able to add, edit, and delete data.` 
                  : `Lock records for ${year}. This will prevent users from adding, editing, or deleting data.`}
              </p>
              <div className="me-form-group">
                <label className="me-label">
                  <Key size={14} />
                  Confirm Admin Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showLockPassword ? 'text' : 'password'}
                    className={`me-input ${lockError ? 'me-input-error' : ''}`}
                    placeholder="Enter admin password"
                    value={lockPassword}
                    onChange={(e) => setLockPassword(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && confirmLockToggle()}
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
                    onClick={() => setShowLockPassword(!showLockPassword)}
                  >
                    {showLockPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {lockError && (
                  <p className="me-inline-error">{lockError}</p>
                )}
              </div>
            </div>
            <div className="me-modal-footer">
              <button
                type="button"
                className="me-btn me-btn-light"
                onClick={() => setShowLockModal(false)}
                disabled={isLocking}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`me-btn ${lockedYears.has(year) ? 'me-btn-primary' : 'me-btn-danger'}`}
                onClick={confirmLockToggle}
                disabled={isLocking || !lockPassword}
              >
                {isLocking ? 'Processing...' : lockedYears.has(year) ? 'Confirm Unlock' : 'Confirm Lock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {statusModal && (
        <div className="me-modal-overlay">
          <div className="me-modal" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
            <div className="me-modal-header">
              <div className="me-modal-title">
                {statusModal.type === 'success' ? (
                  <CheckCircle size={20} style={{ color: 'var(--me-success, #27ae60)' }} />
                ) : statusModal.type === 'error' ? (
                  <AlertCircle size={20} style={{ color: 'var(--me-danger, #e74c3c)' }} />
                ) : (
                  <Info size={20} style={{ color: 'var(--me-warning, #f39c12)' }} />
                )}
                {statusModal.title}
              </div>
              <button
                type="button"
                className="me-icon-btn"
                onClick={() => setStatusModal(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="me-modal-body" style={{ padding: '20px' }}>
              <p className="me-modal-message" style={{ whiteSpace: 'pre-line', fontSize: '0.95rem', color: '#444' }}>{statusModal.message}</p>
            </div>
            <div className="me-modal-footer">
              <button
                type="button"
                className={`me-btn ${statusModal.type === 'success' ? 'me-btn-primary' : 'me-btn-light'}`}
                style={{ minWidth: '100px' }}
                onClick={() => setStatusModal(null)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default DashboardHome;
