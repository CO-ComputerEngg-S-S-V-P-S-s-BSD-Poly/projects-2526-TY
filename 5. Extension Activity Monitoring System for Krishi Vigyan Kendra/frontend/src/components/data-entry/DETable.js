import React, { useMemo, useState } from 'react';
import '../../styles/ManageEmployee.me.css';
import { Eye, Edit, Trash2, Info, ChevronDown } from 'lucide-react';
import { Upload, Plus, Printer } from 'lucide-react';

const fmt = (v) => (v === undefined || v === null || v === '' ? '—' : v);

const renderCell = (v) => {
  const s = v == null ? '' : String(v);
  if (!s) return '—';
  return <div className="da-cell-content">{s}</div>;
};

const fmtDate = (v) => {
  if (!v) return '—';
  try {
    const d = new Date(v);
    if (isNaN(d.getTime())) return renderCell(v);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return renderCell(v);
  }
};

const uniqueBy = (arr, norm) => {
  const seen = new Set();
  const out = [];
  for (const v of arr) {
    const n = norm(v);
    if (!n) continue;
    if (!seen.has(n)) {
      seen.add(n);
      out.push(v);
    }
  }
  return out;
};

const CatHeader = ({ label }) => (
  <div className="da-cat-cell">
    <div className="da-cat-title"><HeaderWithWrap label={label} /></div>
    <div className="da-cat-sub"><span>Male</span><span>Female</span><span>Total</span></div>
  </div>
);

const CatCell = ({ m, f, t }) => (
  <div className="da-cat-cell">
    <div className="da-cat-title"></div>
    <div className="da-cat-sub"><span>{m}</span><span>{f}</span><span>{t}</span></div>
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

const HeaderWithWrap = ({ label }) => {
  if (!label) return null;
  // If label contains a slash, split it
  if (label.includes('/')) {
    const parts = label.split('/');
    return (
      <div className="da-header-wrap">
        <span>{parts[0]}/</span>
        <span>{parts[1]}</span>
      </div>
    );
  }
  // If label contains "Sub Category", split it
  if (label.includes('Sub Category')) {
    const parts = label.split('Sub Category');
    return (
      <div className="da-header-wrap">
        <span>{parts[0]}</span>
        <span>Sub Category {parts[1]}</span>
      </div>
    );
  }
  // If label is very long (e.g. more than 15 chars), split at space if possible
  if (label.length > 15 && label.includes(' ')) {
    const mid = Math.floor(label.length / 2);
    const spaceIdx = label.indexOf(' ', mid) !== -1 ? label.indexOf(' ', mid) : label.lastIndexOf(' ', mid);
    if (spaceIdx !== -1) {
      return (
        <div className="da-header-wrap">
          <span>{label.slice(0, spaceIdx)}</span>
          <span>{label.slice(spaceIdx + 1)}</span>
        </div>
      );
    }
  }
  return <span>{label}</span>;
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
  extraHeaderActions = null,
  columnIndices = null, // array of indices to show
  srStart = 1, // Start number for SR column
  columnFilters = {}, // New: { columnKey: value }
  onColumnFilterChange = () => {}, // New: callback
  filterOptions = {}, // New: { columnKey: [options] }
  isProgramAssistant = false, // New: prop to handle sticky actions
}) => {
  const [sortKey, setSortKey] = useState('created'); // 'discipline' | 'created'
  const [asc, setAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [openFilter, setOpenFilter] = useState(null); // New state for header dropdowns
  const pageSize = 100;

  const getDisciplineName = (code) => {
    if (!code || code === 'all') return '—';
    if (code === 'all_kvk') return 'All disciplines of KVK';
    if (Array.isArray(code)) {
      if (code.includes('all_kvk')) return 'All disciplines of KVK';
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
    } else {
      // Default: sort by startDate (latest first)
      copy.sort((a, b) => {
        const dateA = new Date(a.startDate || 0);
        const dateB = new Date(b.startDate || 0);
        return asc ? dateA - dateB : dateB - dateA;
      });
    }
    return copy;
  }, [rows, sortKey, asc]);

  // Reset to first page when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [rows, sortKey, asc]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));

  const paginatedRows = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return sortedRows.slice(startIdx, startIdx + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setAsc(!asc);
    } else {
      setSortKey(key);
      setAsc(key === 'discipline'); // default asc for discipline alpha
    }
  };

  const allColumns = [
    { label: 'Sr No. (1)', key: 'sr' },
    { label: 'Event Type (2)', key: 'eventType' },
    { label: 'Event Category (3)', key: 'eventCategory' },
    { label: 'Event Name/Sub Category (4)', key: 'eventName' },
    { label: 'Start Date (5)', key: 'startDate' },
    { label: 'End Date (6)', key: 'endDate' },
    { label: 'Venue Details (7)', key: 'venue' },
    { label: 'Objectives (8)', key: 'objectives' },
    { label: 'About the Event (9)', key: 'about' },
    { label: 'Target Group (10)', key: 'targetGroup' },
    { label: 'Post Event Details (11)', key: 'postEvent' },
    { label: 'Contact Person (12)', key: 'contactPerson' },
    { label: 'Discipline (13)', key: 'discipline', sortable: true },
    { label: 'Designation (14)', key: 'designation' },
    { label: 'Email (15)', key: 'email' },
    { label: 'Mobile (16)', key: 'mobile' },
    { label: 'Landline No. (17)', key: 'landline' },
    { label: 'Chief Guest Name/Inaugurated by (18)', key: 'cgName' },
    { label: 'Chief Guest Remark (19)', key: 'cgRemark' },
    { label: 'Male (20)', key: 'male' },
    { label: 'Female (21)', key: 'female' },
    { label: 'SC (22)', key: 'sc', isCat: true },
    { label: 'ST (23)', key: 'st', isCat: true },
    { label: 'Other (24)', key: 'other', isCat: true },
    { label: 'EF (25)', key: 'ef', isCat: true },
    { label: 'Media Coverage (26)', key: 'media' },
    { label: 'Actions (27)', key: 'actions', hideOnPrint: true },
  ];

  const visibleColumns = useMemo(() => {
    if (!columnIndices) return allColumns;
    // Always include index 0 (SR No.) on every page for easy identification
    // columnIndices is an array of 0-based indices
    return allColumns.filter((_, idx) => idx === 0 || columnIndices.includes(idx));
  }, [columnIndices]);

  const isVisible = (key) => visibleColumns.some(c => c.key === key);

  // Click outside listener for column filters
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (openFilter && !e.target.closest('.da-th-filter-wrapper')) {
        setOpenFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openFilter]);

  const ColumnFilter = ({ columnKey, placeholder }) => {
    const options = filterOptions[columnKey] || [];
    if (options.length === 0) return null;

    const isOpen = openFilter === columnKey;
    const currentValue = columnFilters[columnKey] || '';

    return (
      <div className="da-th-filter-wrapper">
        <button
          className={`da-th-filter-btn ${currentValue ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setOpenFilter(isOpen ? null : columnKey);
          }}
          title={placeholder}
        >
          <ChevronDown size={14} />
        </button>
        {isOpen && (
          <div 
            className="da-th-filter-menu" 
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                onColumnFilterChange(columnKey, '');
                setOpenFilter(null);
              }}
              className={!currentValue ? 'active' : ''}
            >
              All
            </button>
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => {
                  onColumnFilterChange(columnKey, opt);
                  setOpenFilter(null);
                }}
                className={currentValue === opt ? 'active' : ''}
                title={opt}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="da-section">
      <div className="da-section-header">
        <h3 className="da-section-title">Existing Records ({rows.length})</h3>
        <div className="da-header-actions">
          {extraHeaderActions}
          {isDisciplineModule && (
            <>
              {onImport && canImport && (
                <button
                  type="button"
                  className="da-btn da-btn-light"
                  onClick={onImport}
                >
                  <Upload size={16} />
                  Import
                </button>
              )}
              {onManual && canCreate && (
                <button
                  type="button"
                  className="da-btn da-btn-primary"
                  onClick={onManual}
                >
                  <Plus size={16} />
                  Manual Entry
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {rows.length === 0 ? (
        <div className="da-empty">
          <p>No records for the current selection</p>
        </div>
      ) : (
        <>
          <div className="da-table-wrap">
            <table className="da-table">
              <thead>
                <tr>
                {isVisible('sr') && <th><HeaderWithWrap label="Sr No. (1)" /></th>}
                {isVisible('eventType') && (
                  <th className="da-th-with-filter">
                    <div className="da-th-content">
                      <HeaderWithWrap label="Event Type (2)" />
                      <ColumnFilter columnKey="eventType" placeholder="Filter by type" />
                    </div>
                  </th>
                )}
                {isVisible('eventCategory') && (
                  <th className="da-th-with-filter">
                    <div className="da-th-content">
                      <HeaderWithWrap label="Event Category (3)" />
                      <ColumnFilter columnKey="eventCategory" placeholder="Filter by category" />
                    </div>
                  </th>
                )}
                {isVisible('eventName') && <th><HeaderWithWrap label="Event Name/Sub Category (4)" /></th>}
                {isVisible('startDate') && <th><HeaderWithWrap label="Start Date (5)" /></th>}
                {isVisible('endDate') && <th><HeaderWithWrap label="End Date (6)" /></th>}
                {isVisible('venue') && (
                  <th className="da-th-with-filter">
                    <div className="da-th-content">
                      <HeaderWithWrap label="Venue Details (7)" />
                      <ColumnFilter columnKey="taluka" placeholder="Filter by taluka" />
                    </div>
                  </th>
                )}
                {isVisible('objectives') && <th><HeaderWithWrap label="Objectives (8)" /></th>}
                {isVisible('about') && <th><HeaderWithWrap label="About the Event (9)" /></th>}
                {isVisible('targetGroup') && (
                  <th className="da-th-with-filter">
                    <div className="da-th-content">
                      <HeaderWithWrap label="Target Group (10)" />
                      <ColumnFilter columnKey="targetGroup" placeholder="Filter by group" />
                    </div>
                  </th>
                )}
                {isVisible('postEvent') && <th><HeaderWithWrap label="Post Event Details (11)" /></th>}
                {isVisible('contactPerson') && (
                  <th className="da-th-with-filter">
                    <div className="da-th-content">
                      <HeaderWithWrap label="Contact Person (12)" />
                      <ColumnFilter columnKey="contact" placeholder="Filter by contact" />
                    </div>
                  </th>
                )}
                {isVisible('discipline') && (
                  <th 
                    onClick={() => toggleSort('discipline')} 
                    title="Sort by discipline" 
                    style={{ cursor: 'pointer' }}
                    className="da-th-with-filter"
                  >
                    <div className="da-th-content">
                      <HeaderWithWrap label={`Discipline (13) ${sortKey === 'discipline' ? (asc ? '▲' : '▼') : ''}`} />
                      <ColumnFilter columnKey="discipline" placeholder="Filter by discipline" />
                    </div>
                  </th>
                )}
                {isVisible('designation') && <th><HeaderWithWrap label="Designation (14)" /></th>}
                {isVisible('email') && <th><HeaderWithWrap label="Email (15)" /></th>}
                {isVisible('mobile') && <th><HeaderWithWrap label="Mobile (16)" /></th>}
                {isVisible('landline') && <th><HeaderWithWrap label="Landline No. (17)" /></th>}
                {isVisible('cgName') && <th><HeaderWithWrap label="Chief Guest Name/Inaugurated by (18)" /></th>}
                {isVisible('cgRemark') && <th><HeaderWithWrap label="Chief Guest Remark (19)" /></th>}
                {isVisible('male') && <th className="da-total-mf"><HeaderWithWrap label="Male (20)" /></th>}
                {isVisible('female') && <th className="da-total-mf"><HeaderWithWrap label="Female (21)" /></th>}
                {isVisible('sc') && <th className="da-cat-th da-cat-scst"><CatHeader label="SC (22)" /></th>}
                {isVisible('st') && <th className="da-cat-th da-cat-scst"><CatHeader label="ST (23)" /></th>}
                {isVisible('other') && <th className="da-cat-th da-cat-others"><CatHeader label="Other (24)" /></th>}
                {isVisible('ef') && <th className="da-cat-th da-cat-others"><CatHeader label="EF (25)" /></th>}
                {isVisible('media') && (
                  <th className="da-th-with-filter">
                    <div className="da-th-content">
                      <HeaderWithWrap label="Media Coverage (26)" />
                      <ColumnFilter columnKey="media" placeholder="Filter by media" />
                    </div>
                  </th>
                )}
                {isVisible('actions') && (
                  <th className={`hide-on-print ${isProgramAssistant ? 'da-actions-sticky' : ''}`}>
                    <HeaderWithWrap label="Actions (27)" />
                  </th>
                )}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((r, idx) => {
                const genM = parseInt(r.genMale) || 0;
                const genF = parseInt(r.genFemale) || 0;
                const scM = parseInt(r.scMale) || 0;
                const scF = parseInt(r.scFemale) || 0;
                const stM = parseInt(r.stMale) || 0;
                const stF = parseInt(r.stFemale) || 0;
                const otM = parseInt(r.otherMale) || 0;
                const otF = parseInt(r.otherFemale) || 0;
                const efM = parseInt(r.efMale) || 0;
                const efF = parseInt(r.efFemale) || 0;

                const totalM = genM + scM + stM + otM + efM;
                const totalF = genF + scF + stF + otF + efF;

                return (
                  <tr 
                    key={r._id || `${r.eventName}-${(currentPage - 1) * pageSize + idx}`}
                    onClick={() => setSelectedRowId(prev => prev === r._id ? null : r._id)}
                    className={selectedRowId === r._id ? 'da-table-row-selected' : ''}
                  >
                    {isVisible('sr') && <td>{srStart + (currentPage - 1) * pageSize + idx}</td>}
                    {isVisible('eventType') && <td>{renderCell(fmt(r.eventType))}</td>}
                    {isVisible('eventCategory') && <td>{renderCell(fmt(r.eventCategory))}</td>}
                    {isVisible('eventName') && <td>{renderCell(r.eventName)}</td>}
                    {isVisible('startDate') && <td>{fmtDate(r.startDate)}</td>}
                    {isVisible('endDate') && <td>{fmtDate(r.endDate)}</td>}
                    {isVisible('venue') && (
                      <td>
                        {renderCell(
                          r.venuePlace || r.venueTal || r.venueDist 
                            ? `${fmt(r.venuePlace)}${r.venueTal ? `, Tal: ${fmt(r.venueTal)}` : ''}${r.venueDist ? `, Dist: ${fmt(r.venueDist)}` : ''}`
                            : fmt(r.venue)
                        )}
                      </td>
                    )}
                    {isVisible('objectives') && <td>{renderCell(r.objectives)}</td>}
                    {isVisible('about') && <td>{renderCell(r.aboutEvent)}</td>}
                    {isVisible('targetGroup') && <td>{renderCell(fmt(r.targetGroup))}</td>}
                    {isVisible('postEvent') && <td>{renderCell(fmt(r.postEventDetails))}</td>}
                    {isVisible('contactPerson') && (
                      <td>{renderCell((r.contacts || []).map(c => c.contactPerson).filter(Boolean).join(', '))}</td>
                    )}
                    {isVisible('discipline') && <td>{renderCell(getDisciplineName(r.discipline))}</td>}
                    {isVisible('designation') && (
                      <td>{renderCell((r.contacts || []).map(c => c.designation).filter(Boolean).join(', '))}</td>
                    )}
                    {isVisible('email') && (
                      <td>{
                        renderCell(
                          uniqueBy((r.contacts || []).map(c => c.email).filter(Boolean), v => String(v).trim().toLowerCase())
                            .join(', ')
                        )
                      }</td>
                    )}
                    {isVisible('mobile') && (
                      <td>{
                        renderCell(
                          uniqueBy((r.contacts || []).map(c => c.mobile).filter(Boolean), v => String(v).replace(/\s|-/g, ''))
                            .join(', ')
                        )
                      }</td>
                    )}
                    {isVisible('landline') && (
                      <td>{
                        renderCell(
                          uniqueBy((r.contacts || []).map(c => c.landline).filter(Boolean), v => String(v).replace(/\s|-/g, ''))
                            .join(', ')
                        )
                      }</td>
                    )}
                    {isVisible('cgName') && (
                      <td>{renderCell((() => {
                        const cg = fmt(r.chiefGuest);
                        const ib = fmt(r.inauguratedBy);
                        if (cg === '—' && ib === '—') return '—';
                        if (cg !== '—' && ib !== '—') return `${cg} / ${ib}`;
                        return cg !== '—' ? cg : ib;
                      })())}</td>
                    )}
                    {isVisible('cgRemark') && <td>{renderCell(fmt(r.chiefGuestRemark))}</td>}
                    {isVisible('male') && <td className="da-total-mf">{r.totalMale || totalM}</td>}
                    {isVisible('female') && <td className="da-total-mf">{r.totalFemale || totalF}</td>}
                    {isVisible('sc') && <td className="da-cat-td da-cat-scst"><CatCell m={scM} f={scF} t={r.scTotal || (scM + scF)} /></td>}
                    {isVisible('st') && <td className="da-cat-td da-cat-scst"><CatCell m={stM} f={stF} t={r.stTotal || (stM + stF)} /></td>}
                    {isVisible('other') && <td className="da-cat-td da-cat-others"><CatCell m={otM} f={otF} t={r.otherTotal || (otM + otF)} /></td>}
                    {isVisible('ef') && <td className="da-cat-td da-cat-others"><CatCell m={efM} f={efF} t={r.efTotal || (efM + efF)} /></td>}
                    {isVisible('media') && <td>{renderCell(fmt(r.mediaCoverage))}</td>}
                    {isVisible('actions') && (
                      <td className={`hide-on-print ${isProgramAssistant ? 'da-actions-sticky' : ''}`}>
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
                    )}
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>
          {rows.length > pageSize && (
            <div className="da-table-pagination">
              <div className="da-table-pagination-info">
                Showing { (currentPage - 1) * pageSize + 1 }–
                { Math.min(currentPage * pageSize, rows.length) } of {rows.length}
              </div>
              <div className="da-table-pagination-controls">
                <button
                  type="button"
                  className="da-page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  // Simple window: always show first, last, current, and neighbours
                  const isEdge = page === 1 || page === totalPages;
                  const isNear = Math.abs(page - currentPage) <= 1;
                  if (!isEdge && !isNear) {
                    if (page === 2 && currentPage > 3) {
                      return <span key={page} className="da-page-ellipsis">…</span>;
                    }
                    if (page === totalPages - 1 && currentPage < totalPages - 2) {
                      return <span key={page} className="da-page-ellipsis">…</span>;
                    }
                    return null;
                  }
                  return (
                    <button
                      key={page}
                      type="button"
                      className={`da-page-btn ${page === currentPage ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="da-page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DETable;
