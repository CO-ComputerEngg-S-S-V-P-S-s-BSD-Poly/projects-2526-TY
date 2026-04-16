import React, { useMemo, useState } from 'react';
import '../../styles/ManageEmployee.me.css';
import { Eye, Edit, Trash2, Info } from 'lucide-react';

const fmt = (v) => (v === undefined || v === null || v === '' ? '—' : v);
const fmtDate = (v) => {
  if (!v || v === '—') return '—';
  
  let dateObj;
  // If it's a DD/MM/YYYY string, parse it into a Date object
  if (typeof v === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
    const [day, month, year] = v.split('/');
    dateObj = new Date(year, month - 1, day);
  } else {
    // Try standard Date parsing
    dateObj = new Date(v);
  }

  // If conversion to Date type fails, return the raw value
  if (isNaN(dateObj.getTime())) return fmt(v);
  
  // Format the Date object back to a user-friendly string (DD/MM/YYYY)
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper to convert DD/MM/YYYY string to Date for sorting
const parseDateForSort = (v) => {
  if (!v) return 0;
  if (typeof v === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
    const [day, month, year] = v.split('/');
    return new Date(year, month - 1, day).getTime();
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? 0 : d.getTime();
};

const chunkText = (v, size = 50) => {
  const s = v == null ? '' : String(v);
  if (!s) return '—';
  if (s.length <= size) return s;
  const parts = s.match(new RegExp(`.{1,${size}}`, 'g')) || [s];
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {p}
        </span>
      ))}
    </>
  );
};

const uniqueBy = (arr, norm) => {
  const seen = new Set();
  const out = [];
  for (const v of arr) {
    const n = norm ? norm(v) : v;
    if (!n && n !== 0) continue;
    if (!seen.has(n)) {
      seen.add(n);
      out.push(v);
    }
  }
  return out;
};

const CatHeader = ({ label }) => (
  <div className="da-cat-cell">
    <div className="da-cat-title">{label}</div>
    <div className="da-cat-sub"><span>Male</span><span>Female</span></div>
  </div>
);

const CatCell = ({ m, f }) => (
  <div className="da-cat-cell">
    <div className="da-cat-title"></div>
    <div className="da-cat-sub"><span>{m}</span><span>{f}</span></div>
  </div>
);

const getEntryMeta = (row, disciplines = []) => {
  const userName =
    row.createdByName ||
    row.createdBy ||
    row.userName ||
    row.createdUser ||
    'Unknown user';

  let moduleLabel =
    row.sourceModule ||
    row.moduleName ||
    row.module ||
    row.disciplineModule ||
    '';

  if (!moduleLabel) {
    if (row.discipline) {
      const codes = Array.isArray(row.discipline) ? row.discipline : [row.discipline];
      const names = codes
        .map((code) => disciplines.find((x) => x.code === code)?.name)
        .filter(Boolean);
      if (names.length) {
        moduleLabel = `${names.join(', ')} discipline module`;
      }
    }
  }

  if (!moduleLabel) {
    moduleLabel = 'data entry module';
  }

  // Normalize label casing/suffix for consistency
  const normalizeModuleLabel = (label) => {
    const l = (label || '').trim();
    if (!l) return '';
    const lower = l.toLowerCase();
    if (lower === 'data entry module') return 'data entry module';
    if (lower.endsWith('discipline module')) {
      const idx = lower.lastIndexOf('discipline module');
      const prefix = l.slice(0, idx).trim();
      return `${prefix} discipline module`;
    }
    return l;
  };

  return {
    userName,
    moduleLabel: normalizeModuleLabel(moduleLabel),
  };
};

const DETable = ({
  rows,
  disciplines = [],
  onView,
  onEdit,
  onDelete,
  onImport,
  onManual,
  canView = true,
  canEdit = true,
  canDelete = true,
  canImport = true,
  canCreate = true,
  isDisciplineModule = false,
}) => {
  const [sortKey, setSortKey] = useState('created'); // 'discipline' | 'created'
  const [asc, setAsc] = useState(false);

  const getDisciplineName = (code) => {
    if (!code || code === 'all') return '—';
    if (Array.isArray(code)) {
      return code.map(c => disciplines.find(d => d.code === c)?.name || c).join(', ');
    }
    const found = disciplines.find(d => d.code === code);
    return found ? found.name : code;
  };

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    if (sortKey === 'discipline') {
      copy.sort((a, b) => {
        const getVal = (r) => Array.isArray(r.discipline) ? r.discipline.join(',') : (r.discipline || '');
        const av = getVal(a).localeCompare(getVal(b));
        return asc ? av : -av;
      });
    } else if (sortKey === 'startDate') {
      copy.sort((a, b) => {
        const tA = parseDateForSort(a.startDate);
        const tB = parseDateForSort(b.startDate);
        return asc ? tA - tB : tB - tA;
      });
    } else {
      // keep insertion order by default (newest first)
      if (asc) copy.reverse();
    }
    return copy;
  }, [rows, sortKey, asc]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setAsc(!asc);
    } else {
      setSortKey(key);
      setAsc(key === 'discipline' || key === 'startDate'); // default asc
    }
  };

  return (
    <div className="da-section">
      <div className="da-section-header">
        <h3 className="da-section-title">Existing Records ({rows.length})</h3>
        {isDisciplineModule && (
          <div className="da-header-actions">
            {onImport && canImport && (
              <button
                type="button"
                className="da-btn da-btn-light"
                onClick={onImport}
              >
                Import
              </button>
            )}
            {onManual && canCreate && (
              <button
                type="button"
                className="da-btn da-btn-primary"
                onClick={onManual}
              >
                Data Entry
              </button>
            )}
          </div>
        )}
      </div>
      {rows.length === 0 ? (
        <div className="da-empty">
          <p>No records for the current selection</p>
        </div>
      ) : (
        <div className="da-table-wrap">
          <table className="da-table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th onClick={() => toggleSort('discipline')} title="Sort by discipline" style={{ cursor: 'pointer' }}>
                  Discipline {sortKey === 'discipline' ? (asc ? '▲' : '▼') : ''}
                </th>
                <th>Event Type</th>
                <th>Event Category</th>
                <th>Event Name/Sub Category</th>
                <th onClick={() => toggleSort('startDate')} title="Sort by Start Date" style={{ cursor: 'pointer' }}>
                  Start Date {sortKey === 'startDate' ? (asc ? '▲' : '▼') : ''}
                </th>
                <th>End Date</th>
                <th>Venue Details</th>
                <th>Objectives</th>
                <th>About the Event</th>
                <th>Target Group</th>
                <th>Contact Person</th>
                <th>Designation</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Landline No.</th>
                <th>Chief Guest Category</th>
                <th>Chief Guest Name/Inaugurated by</th>
                <th>Chief Guest Remark</th>
                <th>Post Event Details</th>
                <th><CatHeader label="SC" /></th>
                <th><CatHeader label="ST" /></th>
                <th><CatHeader label="General" /></th>
                <th><CatHeader label="Other" /></th>
                <th><CatHeader label="EF" /></th>
                <th>Media Coverage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((r, idx) => {
                const scM = parseInt(r.scMale) || 0;
                const scF = parseInt(r.scFemale) || 0;
                const stM = parseInt(r.stMale) || 0;
                const stF = parseInt(r.stFemale) || 0;
                const gnM = parseInt(r.genMale) || 0;
                const gnF = parseInt(r.genFemale) || 0;
                const otM = parseInt(r.otherMale) || 0;
                const otF = parseInt(r.otherFemale) || 0;
                const efM = parseInt(r.efMale) || 0;
                const efF = parseInt(r.efFemale) || 0;

                return (
                  <tr key={r._id || `${r.eventName}-${idx}`}>
                    <td>{idx + 1}</td>
                    <td>{getDisciplineName(r.discipline)}</td>
                    <td>{fmt(r.eventType)}</td>
                    <td>{fmt(r.eventCategory)}</td>
                    <td>{chunkText(r.eventName, 50)}</td>
                    <td>{fmtDate(r.startDate)}</td>
                    <td>{fmtDate(r.endDate)}</td>
                    <td>
                      {r.venuePlace || r.venueTal || r.venueDist 
                        ? `${fmt(r.venuePlace)}${r.venueTal ? `, Tal: ${fmt(r.venueTal)}` : ''}${r.venueDist ? `, Dist: ${fmt(r.venueDist)}` : ''}`
                        : fmt(r.venue)}
                    </td>
                    <td>{chunkText(r.objectives, 50)}</td>
                    <td>{chunkText(r.aboutEvent, 50)}</td>
                    <td>{fmt(r.targetGroup)}</td>
                    <td>{(r.contacts || []).map(c => c.contactPerson).filter(Boolean).join(', ')}</td>
                    <td>{(r.contacts || []).map(c => c.designation).filter(Boolean).join(', ')}</td>
                    <td>{
                      uniqueBy((r.contacts || []).map(c => c.email).filter(Boolean), v => String(v).trim().toLowerCase())
                        .join(', ')
                    }</td>
                    <td>{
                      uniqueBy((r.contacts || []).map(c => c.mobile).filter(Boolean), v => String(v).replace(/\s|-/g, ''))
                        .join(', ')
                    }</td>
                    <td>{
                      uniqueBy((r.contacts || []).map(c => c.landline).filter(Boolean), v => String(v).replace(/\s|-/g, ''))
                        .join(', ')
                    }</td>
                    <td>{fmt(r.chiefGuestCategory)}</td>
                    <td>{fmt(r.chiefGuest)}</td>
                    <td>{fmt(r.chiefGuestRemark)}</td>
                    <td>{fmt(r.postEventDetails)}</td>
                    <td><CatCell m={scM} f={scF} /></td>
                    <td><CatCell m={stM} f={stF} /></td>
                    <td><CatCell m={gnM} f={gnF} /></td>
                    <td><CatCell m={otM} f={otF} /></td>
                    <td><CatCell m={efM} f={efF} /></td>
                    <td>{fmt(r.mediaCoverage)}</td>
                    <td>
                      <div className="da-actions">
                        <div className="da-info-icon-wrapper" title="">
                          <Info size={16} className="da-info-icon" />
                          {(() => {
                            const meta = getEntryMeta(r, disciplines);
                            return (
                              <div className="da-tooltip">
                                {`Data entry is done by ${meta.userName} from ${meta.moduleLabel}`}
                              </div>
                            );
                          })()}
                        </div>
                        {onView && canView && (
                          <button
                            type="button"
                            className="da-btn-icon"
                            title="View"
                            onClick={() => onView && onView(r)}
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        {onEdit && canEdit && (
                          <button
                            type="button"
                            className="da-btn-icon da-btn-edit"
                            title="Edit"
                            onClick={() => onEdit && onEdit(r)}
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {onDelete && canDelete && (
                          <button
                            type="button"
                            className="da-btn-icon da-btn-danger"
                            title="Delete"
                            onClick={() => onDelete && onDelete(r)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DETable;
