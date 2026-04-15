'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/ManageEmployee.me.css';
import '../styles/DataEntry.css';
import * as XLSX from 'xlsx';
import { Search, ChevronDown, AlertCircle, Key, X, FileText, ClipboardCheck, LayoutDashboard, Users, Target, Filter, Edit, Eye, EyeOff } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { disciplineAPI, yearLockAPI, authAPI } from '../services/api';
import { dataEntryAPI } from '../services/dataEntryApi';
import DEHeader from '../components/data-entry/DEHeader';
import DETable from '../components/data-entry/DETable';
import DataEntryForm from './DataEntryForm';

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

  // Initialize state from location state if available (for year persistence)
  const rf = location.state && location.state.restoreFilters;
  const initialYear = rf?.year !== undefined
    ? (rf.year === 'all' ? 'all' : parseInt(rf.year, 10))
    : new Date().getFullYear();

  const [searchTerm, setSearchTerm] = useState(rf?.searchTerm || '');
  const fileInputRef = useRef(null);
  const [disciplines, setDisciplines] = useState([]);
  const [filterDiscipline, setFilterDiscipline] = useState(rf?.filterDiscipline || disciplineCode || 'all');
  const [year, setYear] = useState(initialYear);
  const showActions = !disciplineCode;

  // Demo data (replace with API later)
  const [rows, setRows] = useState([]);
  const [actionModal, setActionModal] = useState(null); // { type: 'edit' | 'delete', row: object }
  const [actionPassword, setActionPassword] = useState('');
  const [actionPasswordError, setActionPasswordError] = useState('');
  const [showActionPassword, setShowActionPassword] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusModal, setStatusModal] = useState(null); // { title, message, type: 'success' | 'warning' | 'error' }
  const [importProgress, setImportProgress] = useState(null); // 0–100 or null when idle
  const [importTotals, setImportTotals] = useState({ processed: 0, total: 0, inserted: 0, duplicates: 0 });
  const [lockedYears, setLockedYears] = useState(new Set());

  useEffect(() => {
    const loadData = async () => {
      try {
        const [d, r, locks] = await Promise.all([
          disciplineAPI.list().catch(() => []),
          dataEntryAPI.get(year).catch(() => []),
          yearLockAPI.getAll().catch(() => [])
        ]);
        setDisciplines(d || []);
        setRows(r || []);
        setLockedYears(new Set((locks || []).filter(l => l.isLocked).map(l => l.year)));
      } catch {
        setDisciplines([]);
        setRows([]);
      }
    };
    loadData();
  }, [year]);

  const isAdmin = (user?.role || '').toLowerCase() === 'admin';
  const isYearLocked = !isAdmin && (year !== 'all' && lockedYears.has(Number(year)));

  // Restore filters when returning from View/Edit
  useEffect(() => {
    const rf = location.state && location.state.restoreFilters;
    if (!rf) return;

    // Clear restore state so it doesn't re-apply if user refreshes or navigates away and back
    navigate(location.pathname, { replace: true, state: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);
  useEffect(() => {
    setFilterDiscipline(disciplineCode || 'all');
  }, [disciplineCode]);

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return rows.filter((r) => {
      if (filterDiscipline !== 'all') {
        const codes = Array.isArray(r.discipline) ? r.discipline : [r.discipline];
        const normalized = codes.map(c => (c || '').toLowerCase());
        // Show records that belong to the selected discipline OR to all_kvk
        if (!normalized.includes(filterDiscipline) && !normalized.includes('all_kvk')) {
          return false;
        }
      }
      if (!q) return true;
      const fields = [
        r.eventCategory, r.eventName, r.venue, r.objectives, r.aboutEvent,
        r.targetGroup, r.contactPerson, r.designation, r.email, r.mediaCoverage
      ].map(v => (v || '').toString().toLowerCase());
      return fields.some(f => f.includes(q));
    });
  }, [rows, searchTerm, filterDiscipline]);

  const summaryStats = useMemo(() => {
    const stats = {
      disciplines: new Set(),
      extensionActivities: 0,
      trainings: 0,
      targetGroups: {},
      participants: {
        genMale: 0, genFemale: 0,
        scMale: 0, scFemale: 0,
        stMale: 0, stFemale: 0,
        otherMale: 0, otherFemale: 0,
        efMale: 0, efFemale: 0,
        totalMale: 0, totalFemale: 0,
        grandTotal: 0
      }
    };

    filteredRows.forEach(row => {
      // Disciplines
      const codes = Array.isArray(row.discipline) ? row.discipline : [row.discipline];
      codes.forEach(c => {
        if (c && c !== '-' && c !== 'all_kvk') stats.disciplines.add(c);
        if (c === 'all_kvk') stats.disciplines.add('All KVK');
      });

      // Event Type
      if (row.eventType === 'Extension Activity') stats.extensionActivities++;
      else if (row.eventType === 'Training') stats.trainings++;

      // Target Group
      const tg = row.targetGroup || 'Unknown';
      stats.targetGroups[tg] = (stats.targetGroups[tg] || 0) + 1;

      // Participants
      const n = (v) => parseInt(v || 0, 10);
      stats.participants.genMale += n(row.genMale);
      stats.participants.genFemale += n(row.genFemale);
      stats.participants.scMale += n(row.scMale);
      stats.participants.scFemale += n(row.scFemale);
      stats.participants.stMale += n(row.stMale);
      stats.participants.stFemale += n(row.stFemale);
      stats.participants.otherMale += n(row.otherMale);
      stats.participants.otherFemale += n(row.otherFemale);
      stats.participants.efMale += n(row.efMale);
      stats.participants.efFemale += n(row.efFemale);
    });

    stats.participants.totalMale =
      stats.participants.genMale + stats.participants.scMale +
      stats.participants.stMale + stats.participants.otherMale + stats.participants.efMale;

    stats.participants.totalFemale =
      stats.participants.genFemale + stats.participants.scFemale +
      stats.participants.stFemale + stats.participants.otherFemale + stats.participants.efFemale;

    stats.participants.grandTotal = stats.participants.totalMale + stats.participants.totalFemale;

    return stats;
  }, [filteredRows]);

  const currentDisciplineCode = disciplineCode || (filterDiscipline !== 'all' ? filterDiscipline : null);
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
    if (!disciplineCode) return rows.length;
    return rows.filter((r) => {
      const codes = Array.isArray(r.discipline) ? r.discipline : [r.discipline];
      const normalized = codes.map(c => (c || '').toLowerCase());
      return normalized.includes(disciplineCode) || normalized.includes('all_kvk');
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
      state: {
        record: row,
        returnToPath: location.pathname,
        restoreFilters: {
          year,
          searchTerm,
          filterDiscipline
        },
      },
    });
  };

  const handleEditRow = (row) => {
    if (!row?._id || !canUpdate) return;
    const rowYear = parseInt(row.year, 10);
    if (!isAdmin && !isNaN(rowYear) && lockedYears.has(rowYear)) {
      setStatusModal({
        title: 'Action Blocked',
        message: `This record is locked by the admin. To import the data related to this year, please contact the admin.`,
        type: 'error'
      });
      return;
    }
    
    setActionPassword('');
    setActionPasswordError('');
    setShowActionPassword(false);
    setActionModal({
      type: 'edit',
      row,
      title: 'Confirm Edit',
      message: 'Please verify your account password to edit this record.'
    });
  };

  const handleDeleteRow = (row) => {
    if (!row?._id || !canDelete) return;
    // Block delete if the record's year is locked (non-admin)
    const rowYear = parseInt(row.year, 10);
    if (!isAdmin && !isNaN(rowYear) && lockedYears.has(rowYear)) {
      setStatusModal({
        title: 'Action Blocked',
        message: `This record is locked by the admin. To import the data related to this year, please contact the admin.`,
        type: 'error'
      });
      return;
    }
    
    setActionPassword('');
    setActionPasswordError('');
    setShowActionPassword(false);
    setActionModal({
      type: 'delete',
      row,
      title: 'Delete Record',
      message: 'Are you sure you want to delete this data entry record? This action cannot be undone.',
    });
  };

  const confirmAction = async (password) => {
    if (!actionModal?.row?._id || !password) {
      setActionPasswordError('Please enter your account password.');
      return;
    }

    // Final check for year lock
    if (!isAdmin && actionModal.row.year && lockedYears.has(actionModal.row.year)) {
      setStatusModal({
        title: 'Year Locked',
        message: 'This record is locked by the admin. To import the data related to this year, please contact the admin.',
        type: 'error'
      });
      setActionModal(null);
      return;
    }

    try {
      setActionLoading(true);
      setActionPasswordError('');
      
      // Verify password
      await authAPI.login(user.email, password);

      if (actionModal.type === 'edit') {
        // Navigate to edit page instead of modal
        navigate(`/dashboard/data-entry/${actionModal.row._id}/edit`, {
          state: {
            record: actionModal.row,
            selectedYear: year,
            returnToPath: location.pathname,
            restoreFilters: {
              year,
              searchTerm,
              filterDiscipline
            },
          },
        });
        setActionModal(null);
      } else {
        await dataEntryAPI.remove(actionModal.row._id, { adminPassword: password });
        setRows((prev) => prev.filter((r) => r._id !== actionModal.row._id));
        setActionModal(null);
      }
    } catch (err) {
      setActionPasswordError(err.message || 'Verification failed. Please check your password.');
    } finally {
      setActionLoading(false);
    }
  };

  const openManual = () => {
    if (!canCreate) return;
    // Block manual entry if year is locked (non-admin)
    if (isYearLocked) {
      setStatusModal({
        title: 'Action Blocked',
        message: `This record is locked by the admin. To import the data related to this year, please contact the admin.`,
        type: 'error'
      });
      return;
    }
    if (filterDiscipline && filterDiscipline !== 'all') {
      navigate(`/dashboard/data-entry/${filterDiscipline}/new`, { state: { selectedYear: year } });
    } else {
      navigate('/dashboard/data-entry/new', { state: { selectedYear: year } });
    }
  };

  const handleImport = () => {
    if (!canImport) return;
    // Block import if year is locked (non-admin)
    if (isYearLocked) {
      setStatusModal({
        title: 'Action Blocked',
        message: `This record is locked by the admin. To import the data related to this year, please contact the admin.`,
        type: 'error'
      });
      return;
    }
    fileInputRef.current?.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        if (ext === 'xlsx' || ext === 'xls') {
          // Determine source module for this import (from which sidebar page)
          const inferSourceModule = () => {
            if (disciplineCode && disciplineCode !== 'all') {
              const d = disciplines.find((x) => x.code === disciplineCode);
              return `${(d && d.name) ? d.name : disciplineCode} discipline module`;
            }
            return 'data entry module';
          };
          const sourceModule = inferSourceModule();
          // Get current user name from AuthContext
          const createdByName = user?.name || 'Unknown user';

          const data = new Uint8Array(evt.target.result);
          const wb = XLSX.read(data, { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];

          // Use raw: false to get formatted text from cells (WYSIWYG)
          const json = XLSX.utils.sheet_to_json(ws, { raw: false, defval: '' });

          // Validate sheet: require at least 5 known headers
          const expectedHeaders = new Set([
            'event category',
            'event name/sub category',
            'event name',
            'start date',
            'venue',
            'objectives',
            'about the event',
            'target group',
            'contact person',
            'designation',
            'email',
            'mobile',
            'media coverage',
            'discipline'
          ]);
          const firstRow = json && json.length ? json[0] : null;
          if (!firstRow) {
            setStatusModal({
              title: 'Invalid Excel Sheet',
              message: 'No rows found in the selected sheet. Please check the file and try again.',
              type: 'error'
            });
            return;
          }
          const headers = Object.keys(firstRow).map(h => String(h).trim().toLowerCase());
          const matchCount = headers.filter(h => expectedHeaders.has(h)).length;
          if (matchCount < 5) {
            setStatusModal({
              title: 'Invalid Excel Sheet',
              message: 'This is not a valid Data Entry Excel sheet. Please check the headers and try again.',
              type: 'error'
            });
            return;
          }

          const mapped = json.map((row) => {
            const norm = {};
            Object.keys(row).forEach((k) => {
              const nk = String(k).trim().toLowerCase();
              norm[nk] = row[k];
            });
            const pick = (...keys) => {
              const foundKey = keys.find((k) => norm[k] !== undefined && norm[k] !== '');
              return foundKey ? norm[foundKey] : '';
            };
            const val = (v) => v === undefined || v === null ? '' : v;

            return {
              eventCategory: val(pick('event category', 'category')),
              eventName: val(pick('event name/sub category', 'event name', 'sub category', 'event name / sub category', 'title', 'name')),
              startDate: val(pick('start date')),
              endDate: val(pick('end date')),
              venue: val(pick('venue', 'location', 'venue details')),
              objectives: val(pick('objectives', 'objective')),
              aboutEvent: val(pick('about the event', 'about event')),
              targetGroup: val(pick('target group')),
              contactPerson: val(pick('contact person', 'contact')),
              designation: val(pick('designation')),
              email: val(pick('email', 'e-mail')),
              mobile: val(pick('mobile', 'mobile no.', 'mobile no', 'phone')),
              landline: val(pick('landline no.', 'landline no', 'landline number', 'landline')),
              chiefGuestCategory: val(pick('chief guest category', 'guest category', 'category of guest')),
              chiefGuest: val(pick('chief guest name', 'chief guest', 'guest name', 'name of chief guest', 'name of guest', 'chief guest name/inaugurated by')),
              inauguratedBy: val(pick('inaugurated by', 'inugrated by', 'guest inaugurated by', 'guest inugrated by', 'chief guest name/inaugurated by')),
              chiefGuestRemark: val(pick('chief guest remark', 'chief guest remarks', 'guest remark', 'guest remarks', 'remarks', 'remark', 'cheif guest remark')),
              postEventDetails: val(pick('post event details', 'post event summary', 'summary')),
              male: val(pick('male', 'total male', 'gen male')),
              female: val(pick('female', 'total female', 'gen female')),
              sc: val(pick('sc', 'sc male')),
              scFemale: val(pick('sc female')),
              scTotal: val(pick('sc total', 'total sc')),
              st: val(pick('st', 'st male')),
              stFemale: val(pick('st female')),
              stTotal: val(pick('st total', 'total st')),
              mediaCoverage: val(pick('media coverage')),
              discipline: val(pick('discipline', 'discipline code', 'discipline name')) || (filterDiscipline !== 'all' ? filterDiscipline : ''),
              sourceModule,
              createdByName
            };
          }).filter((r) => r.eventCategory || r.eventName);

          // If importing from a specific discipline module, only keep rows where the
          // current user's name OR "All KVK Staff" appears in the Contact Person cell.
          // This ensures staff can only import rows that belong to them or are marked
          // as all_kvk events.
          const clean = (s) => (s || '').toString().toLowerCase().replace(/[^a-z]/g, '');
          const isAllKvkStaffName = (name) => {
            const s = clean(name);
            if (!s) return false;
            if (s.includes('allkvkstaff')) return true;
            if (s.includes('allstaffofkvkdhule')) return true;
            if (s.includes('allstaffkvkdhule')) return true;
            if (s === 'allstaffkvk' || s === 'allkvk') return true;
            return false;
          };
          let finalMapped = mapped;
          if (disciplineCode && user?.name) {
            const userNameNorm = clean(user.name);
            if (userNameNorm) {
              finalMapped = mapped.filter((r) => {
                const cpNorm = clean(r.contactPerson);
                return cpNorm.includes(userNameNorm) || isAllKvkStaffName(r.contactPerson);
              });
            }
          }

          if (finalMapped.length > 0) {
            // Bulk import in chunks with progress indicator so large files (e.g. 1000+)
            // can be processed reliably without timing out the request.
            const CHUNK_SIZE = 200;
            const total = finalMapped.length;
            let processed = 0;
            let inserted = 0;
            let duplicates = 0;
            let locked = 0;
            const insertedByYear = {};
            const duplicatesByYear = {};
            const lockedByYear = {};

            const mergeBreakdown = (target, src) => {
              if (!src) return;
              Object.entries(src).forEach(([y, n]) => {
                target[y] = (target[y] || 0) + (Number(n) || 0);
              });
            };

            const doImport = async () => {
              try {
                setActionLoading(true);
                setImportProgress(0);
                setImportTotals({ processed: 0, total, inserted: 0, duplicates: 0 });

                for (let start = 0; start < total; start += CHUNK_SIZE) {
                  const chunk = finalMapped.slice(start, start + CHUNK_SIZE);
                  const res = await dataEntryAPI.bulkImport(chunk, user.token);

                  if (res && res.success) {
                    inserted += res.count || 0;
                    duplicates += res.duplicateCount || 0;
                    locked += res.lockedSkipCount || 0;
                    mergeBreakdown(insertedByYear, res.yearBreakdown && res.yearBreakdown.inserted);
                    mergeBreakdown(duplicatesByYear, res.yearBreakdown && res.yearBreakdown.duplicates);
                    mergeBreakdown(lockedByYear, res.yearBreakdown && res.yearBreakdown.locked);
                  } else if (res && (typeof res.duplicateCount === 'number' || typeof res.lockedSkipCount === 'number')) {
                    duplicates += res.duplicateCount || 0;
                    locked += res.lockedSkipCount || 0;
                    mergeBreakdown(duplicatesByYear, res.yearBreakdown && res.yearBreakdown.duplicates);
                    mergeBreakdown(lockedByYear, res.yearBreakdown && res.yearBreakdown.locked);
                  }

                  processed += chunk.length;
                  setImportTotals({ processed, total, inserted, duplicates });
                  setImportProgress(Math.round((processed / total) * 100));
                }

                // Refresh rows from DB once at the end
                const refreshed = await dataEntryAPI.get(year).catch(() => []);
                setRows(refreshed || []);

                const fmtYearCounts = (obj) => {
                  const entries = Object.entries(obj || {}).filter(([, n]) => Number(n) > 0);
                  if (!entries.length) return '';
                  return entries
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([y, n]) => `${y}: ${n}`)
                    .join(', ');
                };

                const insertedYearMsg = fmtYearCounts(insertedByYear);
                const dupYearMsg = fmtYearCounts(duplicatesByYear);
                const lockedYearMsg = fmtYearCounts(lockedByYear);

                if (inserted === 0 && locked > 0) {
                  setStatusModal({
                    title: 'Import Restricted',
                    message: `No new records were added. ${locked} locked records skipped${lockedYearMsg ? ` (${lockedYearMsg})` : ''}. This record is locked by the admin. To import the data related to this year, please contact the admin.`,
                    type: 'error'
                  });
                } else if (inserted === 0 && duplicates > 0) {
                  setStatusModal({
                    title: 'No New Records Added',
                    message: `All ${duplicates} records in your file were already present in the database. Duplicates skipped${dupYearMsg ? ` (${dupYearMsg})` : ''}.`,
                    type: 'warning'
                  });
                } else if (inserted > 0) {
                  let msg = `Successfully added ${inserted} new records${insertedYearMsg ? ` (${insertedYearMsg})` : ''}.`;
                  if (duplicates > 0) msg += ` ${duplicates} duplicates were skipped${dupYearMsg ? ` (${dupYearMsg})` : ''}.`;
                  if (locked > 0) msg += ` ${locked} locked records skipped${lockedYearMsg ? ` (${lockedYearMsg})` : ''}. This record is locked by the admin. To import the data related to this year, please contact the admin.`;
                  
                  setStatusModal({
                    title: 'Import Completed',
                    message: msg,
                    type: locked > 0 ? 'warning' : 'success'
                  });
                } else {
                  setStatusModal({
                    title: 'Import Completed',
                    message: 'Import finished, but no records were added.',
                    type: 'warning'
                  });
                }
              } catch (err) {
                console.error('Import API error:', err);
                setStatusModal({
                  title: 'Import Failed',
                  message: err.message || 'An error occurred while importing your records. Please try again.',
                  type: 'error'
                });
              } finally {
                setActionLoading(false);
                setImportProgress(null);
              }
            };

            // Fire and forget; progress UI will update via state
            void doImport();
          }
        }
      } catch (err) {
        console.error('Import failed:', err);
      } finally {
        e.target.value = '';
      }
    };
    if (ext === 'xlsx' || ext === 'xls') {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleExport = () => {
    const header = 'Name,Category,CreatedAt\n';
    const csv = rows.map(r => `${JSON.stringify(r.name).replace(/^"|"$/g, '')},${r.category},${r.createdAt}`).join('\n');
    const blob = new Blob([header + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-entry-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="da-manage-employee-container">
      {showActions ? (
        <>
          <DEHeader
            onImportClick={canImport ? handleImport : undefined}
            onExportClick={handleExport}
            onManualClick={canCreate ? openManual : undefined}
            selectedYear={year}
            onYearChange={setYear}
          />
        </>
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
              <div className="dh-header-year-filter">
                <div className="ap-control-group">
                  <Filter className="ap-control-icon" size={16} />
                  <span className="ap-control-label">Select Year:</span>
                  <select
                    className="dh-filter-select dh-year-select"
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

      {/* Hidden file input used for both main Data Entry and discipline modules */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

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

      {actionModal && (
        <div className="me-modal-overlay">
          <div className="me-modal" onClick={(e) => e.stopPropagation()}>
            <div className="me-modal-header">
              <div className="me-modal-title">
                {actionModal.type === 'delete' ? <AlertCircle size={20} /> : <Edit size={20} />}
                {actionModal.title}
              </div>
              <button
                type="button"
                className="me-icon-btn"
                onClick={() => setActionModal(null)}
                aria-label="Close"
                disabled={actionLoading}
              >
                <X size={20} />
              </button>
            </div>
            <div className="me-modal-body">
              <p className="me-modal-message">{actionModal.message}</p>
              <div className="me-form-group">
                <label className="me-label">
                  <Key size={14} />
                  Account Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="dataEntryActionPassword"
                    type={showActionPassword ? 'text' : 'password'}
                    className={`me-input ${actionPasswordError ? 'me-input-error' : ''}`}
                    placeholder="Enter your account password to confirm"
                    value={actionPassword}
                    onChange={(e) => {
                      setActionPassword(e.target.value);
                      setActionPasswordError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && confirmAction(actionPassword)}
                    autoFocus
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
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`me-btn ${actionModal.type === 'delete' ? 'me-btn-danger' : 'me-btn-primary'}`}
                onClick={() => confirmAction(actionPassword)}
                disabled={actionLoading || !actionPassword}
              >
                {actionLoading ? 'Verifying...' : actionModal.type === 'delete' ? 'Delete Record' : 'Confirm Edit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {statusModal && (
        <div className="me-modal-overlay">
          <div className="me-modal" onClick={(e) => e.stopPropagation()}>
            <div className="me-modal-header">
              <div className="me-modal-title">
                {statusModal.type === 'success' ? (
                  <ClipboardCheck size={20} style={{ color: 'var(--me-success, #27ae60)' }} />
                ) : statusModal.type === 'error' ? (
                  <X size={20} style={{ color: 'var(--me-danger, #e74c3c)' }} />
                ) : (
                  <AlertCircle size={20} style={{ color: 'var(--me-warning, #f39c12)' }} />
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
            <div className="me-modal-body">
              <p className="me-modal-message">{statusModal.message}</p>
            </div>
            <div className="me-modal-footer">
              <button
                type="button"
                className={`me-btn ${statusModal.type === 'success' ? 'me-btn-primary' : 'me-btn-light'}`}
                onClick={() => setStatusModal(null)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataEntry;
