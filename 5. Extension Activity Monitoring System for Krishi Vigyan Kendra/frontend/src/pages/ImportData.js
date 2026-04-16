'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Upload, X, FileText, ClipboardCheck, AlertCircle, Trash2, ArrowLeft, CheckCircle2, Loader2, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { useAuth } from '../context/AuthContext';
import { dataEntryAPI } from '../services/dataEntryApi';
import { disciplineAPI } from '../services/api';
import DETable from '../components/data-entry/DETable';
import '../styles/DataEntry.css';
import '../styles/ManageEmployee.me.css';

const ImportData = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [disciplines, setDisciplines] = useState([]);
  
  // Get discipline filter from URL query params (e.g. ?discipline=Plant%20Protection)
  const queryParams = new URLSearchParams(location.search);
  const disciplineFilter = queryParams.get('discipline');
  const disciplineName = queryParams.get('name') || disciplineFilter;

  const [actionLoading, setActionLoading] = useState(false);
  const [statusModal, setStatusModal] = useState(null);
  const [undoConfirmModal, setUndoConfirmModal] = useState(false);
  const [importStep, setImportProgress] = useState(null); // Step name
  const [importPercent, setImportPercent] = useState(0);
  const [importTotals, setImportTotals] = useState({ processed: 0, total: 0, inserted: 0, duplicates: 0 });
  const [importedRecords, setImportedRecords] = useState([]);
  const [sessionImportedIds, setSessionImportedIds] = useState([]);

  useEffect(() => {
    disciplineAPI.list().then(setDisciplines).catch(() => setDisciplines([]));
  }, []);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();
    
    setImportProgress('Reading file data...');
    setImportPercent(10);

    reader.onload = (evt) => {
      try {
        if (ext === 'xlsx' || ext === 'xls') {
          const createdByName = user?.name || 'Unknown user';
          const data = new Uint8Array(evt.target.result);
          const wb = XLSX.read(data, { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(ws, { raw: false, defval: '' });

          setImportProgress('Validating records...');
          setImportPercent(30);

          // Validation
          const expectedHeaders = new Set([
            'event category', 'event name/sub category', 'event name', 'start date',
            'venue', 'objectives', 'about the event', 'target group',
            'contact person', 'designation', 'email', 'mobile', 'media coverage', 'discipline'
          ]);
          const firstRow = json && json.length ? json[0] : null;
          if (!firstRow) {
            setStatusModal({ title: 'Invalid Excel Sheet', message: 'No rows found in the selected sheet.', type: 'error' });
            setImportProgress(null);
            return;
          }
          const headers = Object.keys(firstRow).map(h => String(h).trim().toLowerCase());
          const matchCount = headers.filter(h => expectedHeaders.has(h)).length;
          if (matchCount < 5) {
            setStatusModal({ title: 'Invalid Excel Sheet', message: 'This is not a valid Data Entry Excel sheet.', type: 'error' });
            setImportProgress(null);
            return;
          }

          const mapped = json.map((row) => {
            const norm = {};
            Object.keys(row).forEach((k) => { norm[String(k).trim().toLowerCase()] = row[k]; });
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
              discipline: val(pick('discipline', 'discipline code', 'discipline name')),
              sourceModule: 'import module',
              createdByName
            };
          }).filter((r) => r.eventCategory || r.eventName);

          if (mapped.length > 0) {
            const CHUNK_SIZE = 200;
            const total = mapped.length;
            let processed = 0;
            let inserted = 0;
            let duplicates = 0;
            let locked = 0;
            const allInsertedRecords = [];
            const allInsertedIds = [];
            const yearStats = {}; // { 2024: 10, 2023: 5 }

            const doImport = async () => {
              try {
                setActionLoading(true);
                setImportProgress('Checking duplicates & Importing records...');
                setImportPercent(50);
                setImportTotals({ processed: 0, total, inserted: 0, duplicates: 0 });

                for (let start = 0; start < total; start += CHUNK_SIZE) {
                  const chunk = mapped.slice(start, start + CHUNK_SIZE);
                  const res = await dataEntryAPI.bulkImport(chunk, user.token, disciplineFilter);

                  if (res && res.success) {
                    inserted += res.count || 0;
                    duplicates += res.duplicateCount || 0;
                    locked += res.lockedSkipCount || 0;
                    if (res.insertedRecords) {
                      allInsertedRecords.push(...res.insertedRecords);
                      allInsertedIds.push(...res.insertedRecords.map(r => r._id));
                      
                      // Track years for modal message
                      res.insertedRecords.forEach(rec => {
                        const y = rec.year || (rec.startDate ? new Date(rec.startDate).getFullYear() : 'Unknown');
                        yearStats[y] = (yearStats[y] || 0) + 1;
                      });
                    }
                  } else if (res) {
                    duplicates += res.duplicateCount || 0;
                    locked += res.lockedSkipCount || 0;
                  }

                  processed += chunk.length;
                  setImportTotals({ processed, total, inserted, duplicates });
                  setImportPercent(50 + Math.round((processed / total) * 50));
                }

                setImportedRecords(allInsertedRecords);
                setSessionImportedIds(prev => [...prev, ...allInsertedIds]);

                // Format year breakdown for modal
                const yearSummary = Object.entries(yearStats)
                  .map(([yr, count]) => `${count} records imported for ${yr}`)
                  .join('\n');

                let modalMsg = `${inserted} records have been imported successfully.${disciplineName ? ` for the ${disciplineName} discipline.` : ''}\n\n${yearSummary}`;
                if (duplicates > 0 || locked > 0) {
                  modalMsg += `\n\nNote: ${duplicates > 0 ? `${duplicates} duplicates skipped. ` : ''}`;
                  if (locked > 0) {
                    modalMsg += `\n\n${locked} locked records skipped. This record is locked by the admin. To import the data related to this year, please contact the admin.`;
                  }
                }

                if (inserted > 0) {
                  setStatusModal({
                    title: 'Import Completed Successfully',
                    message: modalMsg,
                    type: locked > 0 ? 'warning' : 'success'
                  });
                } else {
                  setStatusModal({
                    title: 'Import Restricted',
                    message: `No new records were added${disciplineName ? ` for the ${disciplineName} discipline` : ''}.\n\n${locked > 0 ? `This record is locked by the admin. To import the data related to this year, please contact the admin.` : ''}${duplicates > 0 ? `\n\n${duplicates} duplicate records were skipped.` : ''}`,
                    type: 'warning'
                  });
                }
              } catch (err) {
                setStatusModal({ title: 'Import Failed', message: err.message || 'Error importing records.', type: 'error' });
              } finally {
                setActionLoading(false);
                setImportProgress(null);
                setImportPercent(0);
              }
            };
            void doImport();
          }
        }
      } catch (err) {
        console.error('Import failed:', err);
        setImportProgress(null);
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUndoImport = () => {
    if (sessionImportedIds.length === 0) return;
    setUndoConfirmModal(true);
  };

  const performUndoImport = async () => {
    setUndoConfirmModal(false);
    try {
      setActionLoading(true);
      await dataEntryAPI.bulkDelete(sessionImportedIds);
      
      setStatusModal({
        title: 'Undo Successful',
        message: `Successfully removed ${sessionImportedIds.length} records.`,
        type: 'success'
      });
      setImportedRecords([]);
      setSessionImportedIds([]);
    } catch (err) {
      setStatusModal({ title: 'Undo Failed', message: err.message || 'Error undoing import.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="da-manage-employee-container">
      <div className="da-employee-header">
        <div className="da-header-content">
          <div>
            <h1 className="da-page-title">Import Data</h1>
            <p className="da-page-subtitle">Upload Excel file to import activity records</p>
          </div>
          <div className="da-header-actions">
            <button className="me-btn me-btn-light" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} /> Back
            </button>
          </div>
        </div>
      </div>

      <div className="da-import-upload-section" style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e0e7ff', marginBottom: '24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          {!importStep ? (
            <>
              <div style={{ width: '64px', height: '64px', background: '#f0f4ff', color: '#4f46e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Upload size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Upload File</h3>
              <p style={{ color: '#64748b', marginBottom: '24px' }}>Please select an Excel (.xlsx, .xls) file containing your activity records. Ensure the headers match the standard format.</p>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  className="me-btn me-btn-primary" 
                  onClick={handleImportClick} 
                  disabled={actionLoading}
                  style={{ padding: '12px 24px', fontSize: '1rem' }}
                >
                  <FileText size={20} style={{ marginRight: '8px' }} />
                  Choose File
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: '10px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', justifyContent: 'center' }}>
                <Loader2 className="da-spinner" size={24} style={{ color: '#4f46e5' }} />
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{importStep}</h3>
              </div>
              
              <div className="da-progress-bar-container" style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden', marginBottom: '16px' }}>
                <div className="da-progress-bar" style={{ width: `${importPercent}%`, height: '100%', background: 'linear-gradient(90deg, #4f46e5, #818cf8)', transition: 'width 0.3s ease' }}></div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Processed</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>{importTotals.processed} / {importTotals.total}</span>
                </div>
                <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inserted</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#15803d' }}>{importTotals.inserted}</span>
                </div>
              </div>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
      </div>

      <div className="da-imported-preview" style={{ background: 'white', borderRadius: '12px', border: '1px solid #e0e7ff', overflow: 'hidden' }}>
        <div className="da-section-header" style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="da-section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} style={{ color: '#22c55e' }} />
              Recently Imported Records (Session)
            </h3>
            <p className="da-section-subtitle" style={{ margin: '4px 0 0', color: '#64748b' }}>These records were added during this session. This preview will clear when you leave this page.</p>
          </div>
          {sessionImportedIds.length > 0 && (
            <button className="me-btn me-btn-danger" onClick={handleUndoImport} disabled={actionLoading}>
              <Trash2 size={18} /> Undo Import ({sessionImportedIds.length})
            </button>
          )}
        </div>
        <div className="da-table-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {importedRecords.length > 0 ? (
            <DETable
              rows={importedRecords}
              disciplines={disciplines}
              canView={true}
              canEdit={false}
              canDelete={false}
              canImport={false}
              canCreate={false}
              onView={(row) => navigate(`/dashboard/data-entry/${row._id}/view`, { state: { record: row } })}
            />
          ) : (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
              <div style={{ color: '#94a3b8', marginBottom: '12px' }}>
                <FileText size={48} style={{ margin: '0 auto' }} />
              </div>
              <h3 style={{ color: '#475569', fontSize: '1.1rem', fontWeight: 600 }}>No records imported yet</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Your imported data will appear here temporarily for review.</p>
            </div>
          )}
        </div>
      </div>

      {undoConfirmModal && (
        <div className="me-modal-overlay">
          <div className="me-modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="me-modal-header">
              <div className="me-modal-title" style={{ color: '#ef4444' }}>
                <Trash2 size={20} />
                Confirm Undo
              </div>
              <button type="button" className="me-icon-btn" onClick={() => setUndoConfirmModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="me-modal-body" style={{ padding: '20px' }}>
              <p style={{ margin: 0, fontSize: '1rem', color: '#334155', lineHeight: '1.5' }}>
                Are you sure you want to undo the import?
                <br /><br />
                This will delete <strong>{sessionImportedIds.length}</strong> records imported in this session. This action cannot be undone.
              </p>
            </div>
            <div className="me-modal-footer" style={{ gap: '12px' }}>
              <button type="button" className="me-btn me-btn-light" style={{ flex: 1 }} onClick={() => setUndoConfirmModal(false)}>
                Cancel
              </button>
              <button type="button" className="me-btn me-btn-danger" style={{ flex: 1 }} onClick={performUndoImport}>
                Confirm Undo
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
                  <CheckCircle2 size={20} style={{ color: 'var(--me-success, #27ae60)' }} />
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
  );
};

export default ImportData;
