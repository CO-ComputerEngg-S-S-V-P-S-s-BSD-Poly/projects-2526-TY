// src/pages/AnalyticalPage.js
import React, { useState, useMemo, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Filter, Loader2 } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Text
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
  const maxCharsPerLine = 25;
  const words = value.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach((word) => {
    if (currentLine.length > 0 && (currentLine + ' ' + word).length > maxCharsPerLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine.length > 0 ? currentLine + ' ' + word : word;
    }
  });
  if (currentLine) {
    lines.push(currentLine);
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={10} textAnchor="middle" className="ap-xaxis-tick">
        {lines.map((line, index) => (
          <tspan x={0} dy={`${index * 1.2}em`} key={index} className='x-title'>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};

const AnalyticalPage = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveSection] = useState('extension'); // 'extension' | 'training' | 'summary'
  const [rawData, setRawData] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2017;
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i).reverse();
  }, []);

  const tabs = [
    { id: 'summary', label: 'Overview Summary', icon: <TrendingUp size={18} /> },
    { id: 'extension', label: 'Extension Activities', icon: <BarChart3 size={18} /> },
    { id: 'training', label: 'Trainings & Courses', icon: <Calendar size={18} /> }
  ];

  // Fetch data
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [dList, entries] = await Promise.all([
          disciplineAPI.list(),
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
  const chartData = useMemo(() => {
    if (!rawData.length) return [];

    // Filter by tab type if needed
    const filtered = rawData.filter(r => {
      if (activeTab === 'extension') return r.eventType === 'Extension Activities';
      if (activeTab === 'training') return r.eventType === 'Training';
      return true;
    });

    // Group by category (X-axis)
    const groups = {};
    filtered.forEach(r => {
      const cat = r.eventCategory || 'Uncategorized';
      if (!groups[cat]) {
        groups[cat] = { name: cat };
        // Initialize counts for each discipline
        disciplines.forEach(d => {
          groups[cat][d.code] = 0;
        });
      }

      // Increment counts for each discipline associated with this record
      const recordDisciplines = Array.isArray(r.discipline) ? r.discipline : [r.discipline];
      recordDisciplines.forEach(code => {
        if (code && groups[cat].hasOwnProperty(code.toLowerCase())) {
          groups[cat][code.toLowerCase()] += 1;
        }
      });
    });

    return Object.values(groups).sort((a, b) => {
      const an = (a.name || '').toString().toLowerCase();
      const bn = (b.name || '').toString().toLowerCase();
      if (an === 'uncategorized') return 1;
      if (bn === 'uncategorized') return -1;
      return an.localeCompare(bn);
    });
  }, [rawData, activeTab, disciplines]);

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
      const m = (parseInt(r.scMale) || 0) + (parseInt(r.stMale) || 0) + (parseInt(r.genMale) || 0) + (parseInt(r.otherMale) || 0) + (parseInt(r.efMale) || 0);
      const f = (parseInt(r.scFemale) || 0) + (parseInt(r.stFemale) || 0) + (parseInt(r.genFemale) || 0) + (parseInt(r.otherFemale) || 0) + (parseInt(r.efFemale) || 0);
      const scst = (parseInt(r.scMale) || 0) + (parseInt(r.scFemale) || 0) + (parseInt(r.stMale) || 0) + (parseInt(r.stFemale) || 0);
      
      totalParticipants += (m + f);
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
          <Loader2 className="ap-spinner" size={40} />
          <p>Loading analytics...</p>
        </div>
      );
    }

    if (!chartData.length) {
      return (
        <div className="ap-placeholder">
          <TrendingUp size={48} />
          <h3>No Data Available</h3>
          <p>No records found for {activeTab === 'summary' ? 'any activities' : activeTab} in {selectedYear}.</p>
        </div>
      );
    }

    return (
      <div className="ap-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 0, bottom: 100 }}
            barCategoryGap="0%"
            barGap={0}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={<CustomXAxisTick />}
              interval={0} 
              height={100}
              padding={{ left: -80, right: (chartData && chartData.length <= 1) ? 800 : 0 }}
            />
            <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend verticalAlign="top" height={36}/>
            
            {/* Render a Bar segment for each discipline */}
            {disciplines.map(d => (
              <Bar 
                key={d.code} 
                dataKey={d.code} 
                name={d.name} 
                stackId="a" 
                fill={d.color || '#567C8D'} 
                radius={[4, 4, 0, 0]} // Rounded top corners
                maxBarSize={80} // Max width for bars
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="ap-container">
      {/* Page Header */}
      <header className="ap-header">
        <div className="ap-title-section">
          <h1>Analytical Dashboard</h1>
          <p>Visualize and analyze KVK activity data and trends for {selectedYear}</p>
        </div>

        <div className="ap-controls">
          <div className="ap-control-group">
            <Filter size={16} className="ap-control-icon" />
            <span className="ap-control-label">Fiscal Year:</span>
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
        </div>
      </header>

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
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="ap-content">
        <div className="ap-stats-grid">
          <div className="ap-stat-card">
            <span className="ap-stat-label">Total Events</span>
            <span className="ap-stat-value">{stats.totalEvents}</span>
          </div>
          <div className="ap-stat-card">
            <span className="ap-stat-label">Total Participants</span>
            <span className="ap-stat-value">{stats.totalParticipants.toLocaleString()}</span>
          </div>
          <div className="ap-stat-card">
            <span className="ap-stat-label">SC/ST Reach</span>
            <span className="ap-stat-value">{stats.scStReach}%</span>
          </div>
          <div className="ap-stat-card">
            <span className="ap-stat-label">Women Participation</span>
            <span className="ap-stat-value">{stats.womenParticipation}%</span>
          </div>
        </div>

        <div className="ap-chart-section">
          <div className="ap-chart-header">
            <h3>{tabs.find(t => t.id === activeTab)?.label} - Distribution by Discipline</h3>
            <p>Showing number of sessions conducted across various categories</p>
          </div>
          {renderChart()}
        </div>
      </main>
    </div>
  );
};

export default AnalyticalPage;
