import React from 'react';
import '../styles/ReportPrint.css';

const fmt = (v) => (v === undefined || v === null || v === '' || v === '—' ? '-' : v);

const fmtDate = (v) => {
  if (!v) return '-';
  try {
    const d = new Date(v);
    if (isNaN(d.getTime())) return v;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return v;
  }
};

const ReportPrint = ({ 
  chunks, 
  disciplines = [], 
  reportTitle = "Extension Activity and Training Records",
  kvkName = "Krishi Vigyan Kendra, Dhule",
  academicYear = ""
}) => {
  if (!chunks || !chunks.rowChunks) return null;

  const printDate = new Date().toLocaleDateString('en-GB');

  const getDisciplineName = (code) => {
    if (!code || code === 'all') return '-';
    if (code === 'all_kvk') return 'All disciplines of KVK';
    if (Array.isArray(code)) {
      if (code.includes('all_kvk')) return 'All disciplines of KVK';
      return code.map(c => disciplines.find(d => d.code === c)?.name || c).join(', ');
    }
    const found = disciplines.find(d => d.code === code);
    return found ? found.name : code;
  };

  const allColumns = [
    { label: 'Sr No.', key: 'sr', width: '45px' },
    { label: 'Event Type', key: 'eventType', width: '120px' },
    { label: 'Event Category', key: 'eventCategory', width: '130px' },
    { label: 'Event Name/Sub Category', key: 'eventName', width: '160px' },
    { label: 'Start Date', key: 'startDate', width: '90px' },
    { label: 'End Date', key: 'endDate', width: '90px' },
    { label: 'Venue Details', key: 'venue', width: '130px' },
    { label: 'Objectives', key: 'objectives', width: '160px' },
    { label: 'About the Event', key: 'about', width: '160px' },
    { label: 'Target Group', key: 'targetGroup', width: '110px' },
    { label: 'Post Event Details', key: 'postEvent', width: '130px' },
    { label: 'Contact Person', key: 'contactPerson', width: '130px' },
    { label: 'Discipline', key: 'discipline', width: '130px' },
    { label: 'Designation', key: 'designation', width: '110px' },
    { label: 'Email', key: 'email', width: '160px' },
    { label: 'Mobile', key: 'mobile', width: '110px' },
    { label: 'Landline No.', key: 'landline', width: '110px' },
    { label: 'Chief Guest/Inaugurated by', key: 'cgName', width: '140px' },
    { label: 'Chief Guest Remark', key: 'cgRemark', width: '140px' },
    { label: 'Male', key: 'male', width: '55px' },
    { label: 'Female', key: 'female', width: '55px' },
    { label: 'SC', key: 'sc', isCat: true, width: '100px' },
    { label: 'ST', key: 'st', isCat: true, width: '100px' },
    { label: 'Other', key: 'other', isCat: true, width: '100px' },
    { label: 'EF', key: 'ef', isCat: true, width: '100px' },
    { label: 'Media Coverage', key: 'media', width: '110px' },
  ];

  return (
    <div className="rp-print-container">
      {chunks.rowChunks.map((rowChunk, rIdx) => (
        chunks.colChunks.map((colRange, cIdx) => {
          const visibleCols = allColumns.filter((col, idx) => idx === 0 || colRange.includes(idx));
          const pageNumber = rIdx * chunks.colChunks.length + cIdx + 1;
          
          return (
            <div key={`${rIdx}-${cIdx}`} className="rp-page">
              <div className="rp-table-wrapper">
                <table className="rp-table">
                  <thead>
                    {/* Professional Header - Moved inside thead to repeat on every page */}
                    <tr className="rp-table-header-row">
                      <th colSpan={visibleCols.length} className="rp-main-header-cell">
                        <div className="rp-header">
                          <div className="rp-header-top">
                            <div className="rp-kvk-info">
                              <h1 className="rp-kvk-name">{kvkName}</h1>
                              <h2 className="rp-report-title">{reportTitle}</h2>
                            </div>
                            {academicYear && (
                              <div className="rp-academic-year">
                                <span>Year: {academicYear}</span>
                              </div>
                            )}
                          </div>
                          <div className="rp-header-bottom">
                            <span>Part {cIdx + 1} | Records {rowChunk.startIdx}–{rowChunk.endIdx}</span>
                            <span>Printed on: {printDate}</span>
                          </div>
                        </div>
                      </th>
                    </tr>
                    <tr className="rp-column-labels-row">
                      {visibleCols.map((col, idx) => {
                        const colIdx = allColumns.findIndex(c => c.key === col.key);
                        return (
                          <th 
                            key={idx} 
                            style={{ width: col.width }}
                            className={col.isCat ? 'rp-cat-header' : ''}
                          >
                            <div className="rp-header-cell-content">
                              {col.isCat ? (
                                <div className="rp-cat-header-content">
                                  <div className="rp-cat-title">{col.label}</div>
                                  <div className="rp-cat-sub">
                                    <span>M</span>
                                    <span>F</span>
                                    <span>T</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="rp-col-label">{col.label}</div>
                              )}
                              <div className="rp-col-number">({colIdx + 1})</div>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {rowChunk.data.map((r, rowIdx) => {
                      const scM = parseInt(r.scMale) || 0;
                      const scF = parseInt(r.scFemale) || 0;
                      const stM = parseInt(r.stMale) || 0;
                      const stF = parseInt(r.stFemale) || 0;
                      const otM = parseInt(r.otherMale) || 0;
                      const otF = parseInt(r.otherFemale) || 0;
                      const efM = parseInt(r.efMale) || 0;
                      const efF = parseInt(r.efFemale) || 0;

                      return (
                        <tr key={r._id || rowIdx} className="rp-data-row">
                          {visibleCols.map((col, colIdx) => {
                            let content = '';
                            if (col.key === 'sr') content = rowChunk.startIdx + rowIdx;
                            else if (col.key === 'eventType') content = fmt(r.eventType);
                            else if (col.key === 'eventCategory') content = fmt(r.eventCategory);
                            else if (col.key === 'eventName') content = fmt(r.eventName);
                            else if (col.key === 'startDate') content = fmtDate(r.startDate);
                            else if (col.key === 'endDate') content = fmtDate(r.endDate);
                            else if (col.key === 'venue') {
                              const parts = [r.venuePlace, r.venueTal, r.venueDist].filter(Boolean);
                              content = parts.length > 0 ? parts.join(', ') : fmt(r.venue);
                            }
                            else if (col.key === 'objectives') content = fmt(r.objectives);
                            else if (col.key === 'about') content = fmt(r.aboutEvent);
                            else if (col.key === 'targetGroup') content = fmt(r.targetGroup);
                            else if (col.key === 'postEvent') content = fmt(r.postEventDetails);
                            else if (col.key === 'contactPerson') content = fmt((r.contacts || []).map(c => c.contactPerson).filter(Boolean).join(', '));
                            else if (col.key === 'discipline') content = getDisciplineName(r.discipline);
                            else if (col.key === 'designation') content = fmt((r.contacts || []).map(c => c.designation).filter(Boolean).join(', '));
                            else if (col.key === 'email') content = fmt((r.contacts || []).map(c => c.email).filter(Boolean).join(', '));
                            else if (col.key === 'mobile') content = fmt((r.contacts || []).map(c => c.mobile).filter(Boolean).join(', '));
                            else if (col.key === 'landline') content = fmt((r.contacts || []).map(c => c.landline).filter(Boolean).join(', '));
                            else if (col.key === 'cgName') content = fmt(r.chiefGuest || r.inauguratedBy);
                            else if (col.key === 'cgRemark') content = fmt(r.chiefGuestRemark);
                            else if (col.key === 'male') content = fmt(r.totalMale || ((parseInt(r.genMale)||0) + scM + stM + otM + efM));
                            else if (col.key === 'female') content = fmt(r.totalFemale || ((parseInt(r.genFemale)||0) + scF + stF + otF + efF));
                            else if (col.key === 'sc') return (
                              <td key={colIdx} className="rp-cat-cell">
                                <span>{scM || '-'}</span>
                                <span>{scF || '-'}</span>
                                <span>{r.scTotal || (scM+scF) || '-'}</span>
                              </td>
                            );
                            else if (col.key === 'st') return (
                              <td key={colIdx} className="rp-cat-cell">
                                <span>{stM || '-'}</span>
                                <span>{stF || '-'}</span>
                                <span>{r.stTotal || (stM+stF) || '-'}</span>
                              </td>
                            );
                            else if (col.key === 'other') return (
                              <td key={colIdx} className="rp-cat-cell">
                                <span>{otM || '-'}</span>
                                <span>{otF || '-'}</span>
                                <span>{r.otherTotal || (otM+otF) || '-'}</span>
                              </td>
                            );
                            else if (col.key === 'ef') return (
                              <td key={colIdx} className="rp-cat-cell">
                                <span>{efM || '-'}</span>
                                <span>{efF || '-'}</span>
                                <span>{r.efTotal || (efM+efF) || '-'}</span>
                              </td>
                            );
                            else if (col.key === 'media') content = fmt(r.mediaCoverage);

                            return <td key={colIdx}>{content}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      ))}
    </div>
  );
};

export default ReportPrint;
