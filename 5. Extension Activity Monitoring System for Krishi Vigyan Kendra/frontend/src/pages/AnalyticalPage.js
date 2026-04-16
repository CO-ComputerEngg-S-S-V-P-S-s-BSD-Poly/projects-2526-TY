// src/pages/AnalyticalPage.js
import React, { useState, useMemo, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Filter, Loader2, ChevronDown } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Text,
  LineChart,
  Line
} from 'recharts';
import { dataEntryAPI } from '../services/dataEntryApi';
import { disciplineAPI } from '../services/api';
import '../styles/AnalyticalPage.css';

// Custom tick component for multi-line labels
const CustomXAxisTick = ({ x, y, payload }) => {
  if (!payload || !payload.value) {
    return null;
  }

  const value = String(payload.value);
  const words = value.split(/\s+/);
  
  // If the label is long or has many words, try to split it into two lines
  let line1 = value;
  let line2 = "";

  if (words.length > 2 || value.length > 15) {
    const mid = Math.ceil(words.length / 2);
    line1 = words.slice(0, mid).join(" ");
    line2 = words.slice(mid).join(" ");
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" className="ap-xaxis-tick">
        <tspan x={0} dy="1.2em">{line1}</tspan>
        {line2 && <tspan x={0} dy="1.2em">{line2}</tspan>}
      </text>
    </g>
  );
};

const TooltipContent = ({ active, label, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const filtered = payload.filter((entry) => entry && Number(entry.value) > 0);
  if (!filtered.length) return null;
  return (
    <div className="recharts-default-tooltip">
      <p className="label">{label}</p>
      <ul className="recharts-tooltip-item-list">
        {filtered.map((entry, idx) => (
          <li key={idx} className="recharts-tooltip-item" style={{ color: entry.color }}>
            <span className="recharts-tooltip-item-name">{entry.name}</span>
            : <span className="recharts-tooltip-item-value">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CustomTrendDropdown = ({ value, options, placeholder, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const displayLabel = value || placeholder;

  return (
    <div className={`ap-custom-dropdown ${open ? 'open' : ''}`} ref={ref}>
      <button
        type="button"
        className={`ap-select ap-custom-dropdown-trigger ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        style={{ minWidth: '280px' }}
      >
        <span className="ap-custom-dropdown-text">{displayLabel}</span>
        <ChevronDown size={16} className={`ap-custom-dropdown-caret ${open ? 'rotated' : ''}`} />
      </button>
      {open && (
        <div className="ap-custom-dropdown-menu">
          <button
            type="button"
            className={`ap-custom-dropdown-option ${!value ? 'active' : ''}`}
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
          >
            {placeholder}
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`ap-custom-dropdown-option ${value === opt ? 'active' : ''}`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
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

const AnalyticalPage = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [distributionType, setDistributionType] = useState('discipline'); // 'discipline' | 'contact'
  const [activeTab, setActiveSection] = useState('extension'); // 'extension' | 'training' | 'summary'
  const [rawData, setRawData] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2017;
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i).reverse();
  }, []);
  
  // New state for line graph
  const [selectedActivity, setSelectedActivity] = useState('');
  const [lineGraphData, setLineGraphData] = useState([]);
  const [isLineGraphLoading, setIsLineGraphLoading] = useState(false);
  const [availableActivities, setAvailableActivities] = useState([]);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(false);

  // Fetch all years' data to determine available activities dynamically based on active tab
  useEffect(() => {
    const fetchAvailableActivities = async () => {
      setIsActivitiesLoading(true);
      try {
        const yearRange = [...years].reverse(); // 2017 to current
        const allYearData = await Promise.all(
          yearRange.map(y => dataEntryAPI.get(y).catch(() => []))
        );

        const activitiesSet = new Set();
        const targetEventType = activeTab === 'extension' ? 'Extension Activities' : 'Training';

        allYearData.forEach(yearRecords => {
          if (Array.isArray(yearRecords)) {
            yearRecords.forEach(r => {
              if (r.eventType === targetEventType && r.eventCategory) {
                activitiesSet.add(r.eventCategory);
              }
            });
          }
        });
        
        const sortedActivities = Array.from(activitiesSet).sort();
        setAvailableActivities(sortedActivities);
        setSelectedActivity(''); // Reset selection when tab changes
      } catch (err) {
        console.error('Failed to fetch available activities:', err);
      } finally {
        setIsActivitiesLoading(false);
      }
    };

    fetchAvailableActivities();
  }, [years, activeTab]);

  // Fetch data for line graph across all years when an activity is selected
  useEffect(() => {
    if (!selectedActivity) {
      setLineGraphData([]);
      return;
    }

    const fetchLineData = async () => {
      setIsLineGraphLoading(true);
      try {
        const yearRange = [...years].reverse(); // 2017 to current
        const allYearData = await Promise.all(
          yearRange.map(y => dataEntryAPI.get(y).catch(() => []))
        );

        const targetEventType = activeTab === 'extension' ? 'Extension Activities' : 'Training';

        const processedLineData = yearRange.map((y, idx) => {
          const yearRecords = allYearData[idx] || [];
          const count = yearRecords.filter(r => 
            r.eventType === targetEventType && 
            r.eventCategory === selectedActivity
          ).length;
          return { year: y, count };
        });

        setLineGraphData(processedLineData);
      } catch (err) {
        console.error('Failed to fetch line graph data:', err);
      } finally {
        setIsLineGraphLoading(false);
      }
    };

    fetchLineData();
  }, [selectedActivity, years, activeTab]);

  const tabs = [
    { id: 'extension', label: 'Extension Activities', icon: <BarChart3 className="ap-tab-icon" /> },
    { id: 'training', label: 'Trainings', icon: <Calendar className="ap-tab-icon" /> }
  ];

  // Fetch data
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [dList, entries] = await Promise.all([
          disciplineAPI.list({ includeDeleted: true }),
          dataEntryAPI.get(selectedYear)
        ]);
        setDisciplines(dList || []);
        setRawData(Array.isArray(entries) ? entries : []);
      } catch (err) {
        console.error('Failed to fetch analytical data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, [selectedYear]);

  // Process data for charts
  const { chartData, activeSeries } = useMemo(() => {
    if (!rawData.length) return { chartData: [], activeSeries: [] };

    // Filter by tab type if needed
    const filtered = rawData.filter(r => {
      if (activeTab === 'extension') return r.eventType === 'Extension Activities';
      if (activeTab === 'training') return r.eventType === 'Training';
      return true;
    });

    if (distributionType === 'discipline') {
      // Determine if any record uses the special all_kvk discipline
      const usesAllKvk = filtered.some(r => {
        const recordDisciplines = Array.isArray(r.discipline) ? r.discipline : [r.discipline];
        return recordDisciplines.some(code => (code || '').toLowerCase() === 'all_kvk');
      });

      let baseDisciplines = disciplines;
      if (usesAllKvk && !disciplines.some(d => d.code === 'all_kvk')) {
        baseDisciplines = [
          ...disciplines,
          {
            code: 'all_kvk',
            name: 'All disciplines of KVK',
            color: '#808080'
          }
        ];
      }

      const activeDisciplineCodes = new Set();
      const groups = {};
      filtered.forEach(r => {
        const cat = r.eventCategory || 'Uncategorized';
        if (!groups[cat]) {
          groups[cat] = { name: cat };
          baseDisciplines.forEach(d => { groups[cat][d.code] = 0; });
        }
        const recordDisciplines = Array.isArray(r.discipline) ? r.discipline : [r.discipline];
        recordDisciplines.forEach(code => {
          const normalizedCode = (code || '').toLowerCase();
          if (normalizedCode && groups[cat].hasOwnProperty(normalizedCode)) {
            groups[cat][normalizedCode] += 1;
            activeDisciplineCodes.add(normalizedCode);
          }
        });
      });

      let result = Object.values(groups).sort((a, b) => {
        const an = (a.name || '').toString().toLowerCase();
        const bn = (b.name || '').toString().toLowerCase();
        if (an === 'uncategorized') return 1;
        if (bn === 'uncategorized') return -1;
        return an.localeCompare(bn);
      });
      const filteredDisciplines = baseDisciplines.filter(d => activeDisciplineCodes.has(d.code));
      return { chartData: result, activeSeries: filteredDisciplines };
    } else {
      // Group by Contact Person
      const groups = {};
      const contactToDiscipline = {}; // Map contact name -> discipline code
      const activeContacts = new Set();
      
      filtered.forEach(r => {
        const cat = r.eventCategory || 'Uncategorized';
        if (!groups[cat]) {
          groups[cat] = { name: cat };
        }
        
        // Get contacts from the record
        let recordContacts = [];
        if (Array.isArray(r.contacts) && r.contacts.length > 0) {
          recordContacts = r.contacts.map(c => ({
            name: (c.contactPerson || '').trim(),
            discipline: c.discipline
          }));
        } else if (r.contactPerson) {
          recordContacts = [{
            name: (r.contactPerson || '').trim(),
            discipline: Array.isArray(r.discipline) ? r.discipline[0] : r.discipline
          }];
        }

        // Filter out empty names and handle counts
        recordContacts.forEach(c => {
          const name = c.name || 'Unknown';
          if (name === 'Unknown' && recordContacts.length > 1) return; // Skip unknown if others exist
          
          const contactId = name.replace(/\s+/g, '_');
          if (!groups[cat][contactId]) groups[cat][contactId] = 0;
          groups[cat][contactId] += 1;
          
          activeContacts.add(name);
          
          // Map contact to their discipline for coloring (first one found wins)
          if (!contactToDiscipline[name] && c.discipline) {
            contactToDiscipline[name] = c.discipline;
          }
        });
      });

      const result = Object.values(groups).sort((a, b) => {
        const an = (a.name || '').toString().toLowerCase();
        const bn = (b.name || '').toString().toLowerCase();
        if (an === 'uncategorized') return 1;
        if (bn === 'uncategorized') return -1;
        return an.localeCompare(bn);
      });

      const sortedContacts = Array.from(activeContacts).sort();
      
      // Define a set of diverse colors for contacts not associated with a discipline
      const fallbackColors = [
        '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', 
        '#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', 
        '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', 
        '#10b981', '#22c55e', '#84cc16', '#eab308', '#f59e0b', 
        '#f97316', '#ef4444'
      ];

      const contactSeries = sortedContacts.map((name, index) => {
        const discCode = contactToDiscipline[name];
        const disc = disciplines.find(d => d.code === discCode);
        
        // If discipline exists and has a color, use it.
        // Otherwise, use a color from the fallback set based on the index.
        const color = disc?.color || fallbackColors[index % fallbackColors.length];
        
        return {
          code: name.replace(/\s+/g, '_'),
          name: name,
          color: color
        };
      });

      return { chartData: result, activeSeries: contactSeries };
    }
  }, [rawData, activeTab, disciplines, distributionType]);

  // Process faint colors for bars
  const faintSeries = useMemo(() => {
    return activeSeries.map(s => {
      return {
        ...s,
        faintColor: s.color ? `${s.color}99` : 'rgba(86, 124, 141, 0.6)'
      };
    });
  }, [activeSeries]);

  // High-level stats
  const stats = useMemo(() => {
    const filtered = rawData.filter(r => {
      if (activeTab === 'extension') return r.eventType === 'Extension Activities';
      if (activeTab === 'training') return r.eventType === 'Training';
      return true;
    });

    const totalEvents = filtered.length;
    let totalParticipants = 0;
    let scStParticipants = 0;
    let femaleParticipants = 0;

    filtered.forEach(r => {
      const scT = parseInt(r.scTotal) || ((parseInt(r.scMale) || 0) + (parseInt(r.scFemale) || 0));
      const stT = parseInt(r.stTotal) || ((parseInt(r.stMale) || 0) + (parseInt(r.stFemale) || 0));
      const otherT = parseInt(r.otherTotal) || ((parseInt(r.otherMale) || 0) + (parseInt(r.otherFemale) || 0));
      const efT = parseInt(r.efTotal) || ((parseInt(r.efMale) || 0) + (parseInt(r.efFemale) || 0));

      const m = parseInt(r.totalMale) || ((parseInt(r.scMale) || 0) + (parseInt(r.stMale) || 0) + (parseInt(r.genMale) || 0) + (parseInt(r.otherMale) || 0) + (parseInt(r.efMale) || 0));
      const f = parseInt(r.totalFemale) || ((parseInt(r.scFemale) || 0) + (parseInt(r.stFemale) || 0) + (parseInt(r.genFemale) || 0) + (parseInt(r.otherFemale) || 0) + (parseInt(r.efFemale) || 0));
      
      const scst = scT + stT;

      totalParticipants += (parseInt(r.grandTotal) || (scT + stT + otherT + efT + (parseInt(r.genMale) || 0) + (parseInt(r.genFemale) || 0)));
      scStParticipants += scst;
      femaleParticipants += f;
    });

    return {
      totalEvents,
      totalParticipants,
      scStReach: totalParticipants ? ((scStParticipants / totalParticipants) * 100).toFixed(1) : 0,
      womenParticipation: totalParticipants ? ((femaleParticipants / totalParticipants) * 100).toFixed(1) : 0
    };
  }, [rawData, activeTab]);

  const renderChart = () => {
    if (loading) {
      return (
        <div className="ap-loader-container">
          <Loader2 className="ap-spinner" />
          <p>Loading analytics...</p>
        </div>
      );
    }

    if (!chartData.length) {
      return (
        <div className="ap-placeholder">
          <TrendingUp className="ap-placeholder-icon" />
          <h3>No Data Available</h3>
          <p>No records found for {activeTab} in {selectedYear}.</p>
        </div>
      );
    }

    // Calculate a dynamic minWidth based on the number of categories
    // Each bar + gap takes about 100px-120px minimum for good readability
    const minWidth = Math.max(800, chartData.length * 120);

    return (
      <div className="ap-chart-wrapper">
        <div style={{ minWidth: `${minWidth}px`, height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              className="ap-barchart"
              data={chartData}
              margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
              barCategoryGap="15%"
              barGap={10}
              barSize={50}
            >
            
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={<CustomXAxisTick />}
                interval={0}
                height={60} // Reduced height for single line
                padding={{ left: 0, right: 0 }}
              />
              <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft', margin: { left: 30 } }} />
              <Tooltip
                cursor={false}
                filterNull
                isAnimationActive={false} // Disable animation
                animationDuration={0} // Force zero duration
                offset={8}
                allowEscapeViewBox={{ x: false, y: false }}
                wrapperClassName="ap-tooltip"
                content={(props) => <TooltipContent {...props} />}
              />
              <Legend 
                verticalAlign="top" 
                height={50} 
                wrapperStyle={{ paddingBottom: 10 }}
                formatter={(value) => <span className="ap-legend-text">{value}</span>}
              />

              {/* Render a Bar segment for each series */}
              {faintSeries.map(s => (
                <Bar
                  key={s.code}
                  dataKey={s.code}
                  name={s.name}
                  stackId="a"
                  fill={s.faintColor}
                  radius={[4, 4, 0, 0]} // Rounded top corners
                  isAnimationActive={false} // Disable bar animations for faster feel
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="ap-container">
      {/* Navigation Tabs */}
      <div className="ap-tabs-container">
        <nav className="ap-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`ap-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveSection(tab.id)}
            >
              <span className="ap-tab-label">
                <span className="ap-tab-icon-box">{tab.icon}</span>
                <span className="ap-tab-text">{tab.label}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="ap-content">
        <div className="ap-chart-section">
          <div className="ap-chart-header ap-chart-header-row">
            <div className="ap-chart-title">
              <h3>{tabs.find(t => t.id === activeTab)?.label} - Distribution by {distributionType === 'discipline' ? 'Discipline' : 'Contact Person'}</h3>
              <p>Showing number of sessions conducted across various categories</p>
            </div>
            <div className="ap-controls ap-controls-inline">
              <div className="ap-control-group">
                <Filter className="ap-control-icon" />
                <span className="ap-control-label">Select Year:</span>
                <select
                  className="ap-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="ap-control-group" style={{ marginLeft: '16px' }}>
                <span className="ap-control-label">View Distribution:</span>
                <select
                  className="ap-select"
                  value={distributionType}
                  onChange={(e) => setDistributionType(e.target.value)}
                >
                  <option value="discipline">Discipline Wise</option>
                  <option value="contact">Contact Person Wise</option>
                </select>
              </div>
            </div>
          </div>
          {renderChart()}
        </div>

        {/* New Line Graph Section */}
        <div className="ap-chart-section" style={{ 
          marginTop: '64px', 
          borderTop: '2px dashed #e2e8f0', 
          paddingTop: '48px',
          position: 'relative'
        }}>
          {/* Section Divider Badge */}
          <div style={{
            position: 'absolute',
            top: '-14px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#f8fafc',
            padding: '4px 16px',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            fontSize: '0.8rem',
            fontWeight: '600',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Trend Analysis
          </div>

          <div className="ap-chart-header ap-chart-header-row">
            <div className="ap-chart-title">
              <h3>Yearly Trend - {activeTab === 'extension' ? 'Extension Activity' : 'Training'} Count</h3>
              <p>Dynamic {activeTab === 'extension' ? 'activity' : 'training'} frequency trend over available years (2017 - Present)</p>
            </div>
            <div className="ap-controls ap-controls-inline">
              <div className="ap-control-group">
                <Filter className="ap-control-icon" />
                <span className="ap-control-label">Select {activeTab === 'extension' ? 'Extension Activity' : 'Training'}:</span>
                <CustomTrendDropdown
                  value={selectedActivity}
                  options={availableActivities}
                  placeholder={isActivitiesLoading ? 'Loading...' : `-- Select ${activeTab === 'extension' ? 'Activity' : 'Training'} --`}
                  onChange={setSelectedActivity}
                  disabled={isActivitiesLoading}
                />
              </div>
            </div>
          </div>

          <div className="ap-chart-wrapper" style={{ height: '400px' }}>
            {isLineGraphLoading ? (
              <div className="ap-loader-container">
                <Loader2 className="ap-spinner" />
                <p>Calculating yearly trends...</p>
              </div>
            ) : selectedActivity ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineGraphData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                    }}
                    itemStyle={{ fontWeight: 700, color: '#125406' }}
                    labelStyle={{ marginBottom: '4px', fontWeight: 600, color: '#64748b' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name={activeTab === 'extension' ? 'Activities' : 'Trainings'}
                    stroke="#125406" 
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#125406', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="ap-placeholder">
                <TrendingUp className="ap-placeholder-icon" />
                <p>Select a {activeTab === 'extension' ? 'activity' : 'training'} from the dropdown above to view the yearly trend line graph.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticalPage;
