import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const FoodyardEstimationResults = () => {
  const [estimationData, setEstimationData] = useState(null);
  const [error, setError] = useState('');

  // Color schemes based on project type
  const colorSchemes = {
    red: {
      primary: 'from-red-400 to-orange-500',
      secondary: 'from-red-500 to-orange-600',
      accent: 'from-orange-500 to-red-600',
      card: 'from-red-400 to-orange-500',
      light: 'red-400',
      border: 'red-400'
    },
    blue: {
      primary: 'from-blue-400 to-cyan-500',
      secondary: 'from-blue-500 to-cyan-600',
      accent: 'from-cyan-500 to-blue-600',
      card: 'from-blue-400 to-cyan-500',
      light: 'blue-400',
      border: 'blue-400'
    },
    green: {
      primary: 'from-green-400 to-teal-500',
      secondary: 'from-green-500 to-teal-600',
      accent: 'from-teal-500 to-green-600',
      card: 'from-green-400 to-teal-500',
      light: 'green-400',
      border: 'green-400'
    },
    purple: {
      primary: 'from-purple-400 to-pink-500',
      secondary: 'from-purple-500 to-pink-600',
      accent: 'from-pink-500 to-purple-600',
      card: 'from-purple-400 to-pink-500',
      light: 'purple-400',
      border: 'purple-400'
    },
    orange: {
      primary: 'from-orange-400 to-yellow-500',
      secondary: 'from-orange-500 to-yellow-600',
      accent: 'from-yellow-500 to-orange-600',
      card: 'from-orange-400 to-yellow-500',
      light: 'orange-400',
      border: 'orange-400'
    },
    teal: {
      primary: 'from-teal-400 to-cyan-500',
      secondary: 'from-teal-500 to-cyan-600',
      accent: 'from-cyan-500 to-teal-600',
      card: 'from-teal-400 to-cyan-500',
      light: 'teal-400',
      border: 'teal-400'
    }
  };

  // Helper function for complexity styling
  const getComplexityStyles = (complexity) => {
    switch (complexity?.toLowerCase()) {
      case 'high': 
        return { background: '#e74c3c', color: 'white' };
      case 'medium': 
        return { background: '#f39c12', color: 'white' };
      case 'low': 
        return { background: '#27ae60', color: 'white' };
      default: 
        return { background: '#f3f4f6', color: '#374151' };
    }
  };

  // Utility to safely parse JSON or fallback
  const safeParse = (str, fallback = {}) => {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  };

  // Load data from sessionStorage on component mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("estimationData");
      if (!stored) {
        setError("No estimation data found. Please submit the form first.");
        return;
      }
      
      // If n8n returns an array, take the first object
      let parsed = safeParse(stored);
      if (Array.isArray(parsed) && parsed[0]?.output) {
        parsed = parsed[0].output;
      } else if (parsed?.output) {
        parsed = parsed.output;
      }
      
      setEstimationData(typeof parsed === "string" ? safeParse(parsed) : parsed);
    } catch (err) {
      setError("Error loading estimation data: " + err.message);
    }
  }, []);

  // Merge output's root and overview to support both new and old fields
  const merged = estimationData ? { ...estimationData.overview, ...estimationData } : null;
  
  // Get color scheme
  const colorScheme = colorSchemes[merged?.colorScheme || 'red'];

  if (error) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colorScheme.primary} p-5`}>
        <div className="max-w-7xl mx-auto bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl p-10 shadow-2xl">
          <h1 className={`text-center text-gray-800 mb-10 text-4xl font-bold bg-gradient-to-r ${colorScheme.primary} bg-clip-text text-transparent`}>
             {merged?.projectName || 'Project'}<br />Design Project Plan
          </h1>
          <div className="text-center p-8 bg-red-100 rounded-2xl shadow-sm text-red-800">
            <AlertCircle size={48} className="mx-auto mb-4" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!estimationData) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colorScheme.primary} p-5`}>
        <div className="max-w-7xl mx-auto bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl p-10 shadow-2xl">
          <h1 className={`text-center text-gray-800 mb-10 text-4xl font-bold bg-gradient-to-r ${colorScheme.primary} bg-clip-text text-transparent`}>
            🍽️ Project<br />Design Project Plan
          </h1>
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
            <p>⏳ Loading estimation data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals for overview section with fallbacks
  const totalPersonDays = merged?.totalPersonDays || (estimationData.roleEffort?.reduce((sum, role) => sum + (parseInt(role.totalPersonDays) || 0), 0)) || 145;
  const teamMembers = merged?.teamMembers || estimationData.roleEffort?.length || 4;
  const workingDays = merged?.workingDays || parseInt(merged?.totalPersonDays || 50);
  const totalScreens = merged?.totalScreens || estimationData.screenBreakdown?.length || 50;
  const totalHours = estimationData.complexitySummary?.reduce((sum, c) => sum + (parseInt(c.totalHours) || 0), 0) || 420;
  const projectName = merged?.projectName || 'Design Project';
  const projectIcon = merged?.projectType?.toLowerCase().includes('food') ? '🍽️' : 
                     merged?.projectType?.toLowerCase().includes('tech') ? '💻' :
                     merged?.projectType?.toLowerCase().includes('health') ? '🏥' :
                     merged?.projectType?.toLowerCase().includes('finance') ? '💰' : '📱';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colorScheme.primary} p-5 font-sans`}>
      <div className="max-w-7xl mx-auto bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl p-10 shadow-2xl">
        <h1 className={`text-center text-gray-800 mb-10 text-4xl font-bold bg-gradient-to-r ${colorScheme.primary} bg-clip-text text-transparent`}>
          {projectIcon} {projectName}<br />Design Project Plan
        </h1>

        {/* Project Overview */}
        <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
            📊 Project Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 my-5">
            <div className={`bg-gradient-to-br ${colorScheme.card} text-white p-5 rounded-2xl text-center shadow-lg`}>
              <div className="text-3xl font-bold mb-1">{totalPersonDays}</div>
              <div className="text-sm opacity-90">Total Person-Days</div>
            </div>
            
            <div className={`bg-gradient-to-br ${colorScheme.card} text-white p-5 rounded-2xl text-center shadow-lg`}>
              <div className="text-3xl font-bold mb-1">{teamMembers}</div>
              <div className="text-sm opacity-90">Team Members</div>
            </div>
            
            <div className={`bg-gradient-to-br ${colorScheme.card} text-white p-5 rounded-2xl text-center shadow-lg`}>
              <div className="text-3xl font-bold mb-1">{workingDays}</div>
              <div className="text-sm opacity-90">Working Days ({Math.ceil(workingDays/5)} weeks)</div>
            </div>
            
            <div className={`bg-gradient-to-br ${colorScheme.card} text-white p-5 rounded-2xl text-center shadow-lg`}>
              <div className="text-3xl font-bold mb-1">{merged?.estimatedFeatures?.length || '7+'}</div>
              <div className="text-sm opacity-90">Core Features</div>
            </div>
            
            <div className={`bg-gradient-to-br ${colorScheme.card} text-white p-5 rounded-2xl text-center shadow-lg`}>
              <div className="text-3xl font-bold mb-1">{totalScreens}</div>
              <div className="text-sm opacity-90">Total Screens</div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-500 rounded-lg p-4 my-5 text-green-800">
            <strong>Project Scope:</strong> {merged?.projectName || 'Multi-platform application'} with responsive web, Android, and iOS versions. Includes complete branding, design system, and cross-platform consistency.
          </div>
        </div>

        {/* Estimated Features */}
        {merged?.estimatedFeatures && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              🎯 Estimated Features
            </h2>
            {Array.isArray(merged.estimatedFeatures) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {merged.estimatedFeatures.map((feature, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700">
                    ✓ {feature}
                  </div>
                ))}
              </div>
            ) : (
              <ul className="list-disc ml-6 space-y-2">
                {merged.estimatedFeatures.split(',').map((f, i) => (
                  <li key={i} className="text-gray-700">{f.trim()}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Timeline Justification */}
        {merged?.timelineJustification && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              📝 Timeline Justification
            </h2>
            <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
              {merged.timelineJustification}
            </div>
          </div>
        )}

        {/* Screen Breakdown & Complexity Analysis */}
        {estimationData.screenBreakdown && estimationData.screenBreakdown.length > 0 && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              🖼️ Screen Breakdown & Complexity Analysis
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className={`bg-gradient-to-br ${colorScheme.accent} text-white p-5 rounded-2xl text-center shadow-lg`}>
                <div className="text-3xl font-bold mb-1">{estimationData.screenBreakdown.length}</div>
                <div className="text-sm opacity-90">Unique Screens</div>
              </div>
              
              <div className={`bg-gradient-to-br ${colorScheme.secondary} text-white p-5 rounded-2xl text-center shadow-lg`}>
                <div className="text-3xl font-bold mb-1">
                  {estimationData.screenBreakdown.reduce((sum, screen) => sum + (parseInt(screen.variants) || 1), 0)}
                </div>
                <div className="text-sm opacity-90">Responsive Variants</div>
              </div>
              
              <div className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white p-5 rounded-2xl text-center shadow-lg">
                <div className="text-3xl font-bold mb-1">{totalHours}</div>
                <div className="text-sm opacity-90">Total Design Hours</div>
              </div>
            </div>

            <h3 className="text-gray-800 mb-4 text-xl font-semibold">Feature-wise Screen Breakdown</h3>
            
            <div className="overflow-x-auto rounded-2xl shadow-lg mb-8">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>
                      Feature Category
                    </th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>
                      Screen Name
                    </th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>
                      Complexity
                    </th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>
                      Design Effort (Hours)
                    </th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>
                      Variants
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {estimationData.screenBreakdown.map((screen, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="p-3 align-top">
                        <strong>{screen.featureCategory}</strong>
                      </td>
                      <td className="p-3 align-top">{screen.screenName}</td>
                      <td className="p-3 align-top">
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-bold"
                          style={getComplexityStyles(screen.complexity)}
                        >
                          {screen.complexity?.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 align-top">{screen.designEffortHours}</td>
                      <td className="p-3 align-top">{screen.variants} (Mobile/Desktop)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Complexity Summary */}
            {estimationData.complexitySummary && estimationData.complexitySummary.length > 0 && (
              <div>
                <h3 className="text-gray-800 mb-4 text-xl font-semibold">Complexity & Effort Summary</h3>
                <div className="overflow-x-auto rounded-2xl shadow-lg">
                  <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                    <thead>
                      <tr>
                        <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Complexity Level</th>
                        <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Unique Screens Count</th>
                        <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Effort Range (Hours)</th>
                        <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Total Variants</th>
                        <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Estimated Total Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estimationData.complexitySummary.map((c, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 border-b border-gray-100">
                          <td className="p-3 align-top">
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-bold"
                              style={getComplexityStyles(c.level)}
                            >
                              {c.level?.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 align-top"><strong>{c.uniqueScreens}</strong></td>
                          <td className="p-3 align-top">{c.effortRange} hrs</td>
                          <td className="p-3 align-top">{c.totalVariants}</td>
                          <td className="p-3 align-top"><strong>{c.totalHours}-{parseInt(c.totalHours) + 50} hrs</strong></td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-bold border-t-2 border-gray-300">
                        <td className="p-3"><strong>SUBTOTAL</strong></td>
                        <td className="p-3"><strong>{estimationData.complexitySummary.reduce((sum, c) => sum + parseInt(c.uniqueScreens || 0), 0)}</strong></td>
                        <td className="p-3">-</td>
                        <td className="p-3"><strong>{estimationData.complexitySummary.reduce((sum, c) => sum + parseInt(c.totalVariants || 0), 0)}</strong></td>
                        <td className="p-3"><strong>{totalHours}-{totalHours + 50} hrs</strong></td>
                      </tr>
                      <tr className="bg-yellow-50">
                        <td className="p-3"><strong>+ Buffer & PM</strong></td>
                        <td className="p-3">-</td>
                        <td className="p-3">-</td>
                        <td className="p-3">-</td>
                        <td className="p-3"><strong>70 hrs</strong></td>
                      </tr>
                      <tr className="bg-gray-100 font-bold border-t-2 border-gray-400">
                        <td className="p-3"><strong>TOTAL</strong></td>
                        <td className="p-3"><strong>{estimationData.complexitySummary.reduce((sum, c) => sum + parseInt(c.uniqueScreens || 0), 0)}</strong></td>
                        <td className="p-3">-</td>
                        <td className="p-3"><strong>{estimationData.complexitySummary.reduce((sum, c) => sum + parseInt(c.totalVariants || 0), 0)}</strong></td>
                        <td className="p-3"><strong>{totalHours + 70}-{totalHours + 120} hrs</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Role-wise Effort & FTEs */}
        {estimationData.roleEffort && estimationData.roleEffort.length > 0 && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              👥 Role-wise Effort & FTEs
            </h2>
            
            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Role</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Total Person-Days</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>FTEs Required</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Utilization %</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Justification</th>
                  </tr>
                </thead>
                <tbody>
                  {estimationData.roleEffort.map((role, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="p-3 align-top"><strong>{role.role}</strong></td>
                      <td className="p-3 align-top">{role.totalPersonDays}</td>
                      <td className="p-3 align-top">{role.fte}</td>
                      <td className="p-3 align-top">{role.utilization || Math.round(parseFloat(role.fte) * 100) + '%'}</td>
                      <td className="p-3 align-top">{role.justification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-50 border border-yellow-500 rounded-lg p-4 my-5 text-yellow-800">
              <strong>Resource Planning:</strong> FTE allocation optimized for {Math.ceil(workingDays/5)}-week timeline with sustainable workload. Peak utilization during wireframing and visual design phases.
            </div>
          </div>
        )}

        {/* Phase-wise Allocation */}
        {estimationData.phaseAllocation && estimationData.phaseAllocation.length > 0 && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              📈 Phase-wise Allocation ({Math.ceil(workingDays/5)} Weeks)
            </h2>
            
            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Phase</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Duration</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Design PM</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Design Lead</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Interaction Designer</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Visual Designer</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Total Days</th>
                  </tr>
                </thead>
                <tbody>
                  {estimationData.phaseAllocation.map((phase, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="p-3 align-top"><strong>{phase.phase}</strong></td>
                      <td className="p-3 align-top">{phase.duration}</td>
                      <td className="p-3 align-top">{phase.designPM}</td>
                      <td className="p-3 align-top">{phase.designLead}</td>
                      <td className="p-3 align-top">{phase.interactionDesigner}</td>
                      <td className="p-3 align-top">{phase.visualDesigner}</td>
                      <td className="p-3 align-top"><strong>{phase.totalDays}</strong></td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold border-t-2 border-gray-300">
                    <td className="p-3"><strong>TOTAL</strong></td>
                    <td className="p-3">-</td>
                    <td className="p-3"><strong>{estimationData.phaseAllocation.reduce((sum, phase) => sum + parseInt(phase.designPM || 0), 0)}</strong></td>
                    <td className="p-3"><strong>{estimationData.phaseAllocation.reduce((sum, phase) => sum + parseInt(phase.designLead || 0), 0)}</strong></td>
                    <td className="p-3"><strong>{estimationData.phaseAllocation.reduce((sum, phase) => sum + parseInt(phase.interactionDesigner || 0), 0)}</strong></td>
                    <td className="p-3"><strong>{estimationData.phaseAllocation.reduce((sum, phase) => sum + parseInt(phase.visualDesigner || 0), 0)}</strong></td>
                    <td className="p-3"><strong>{estimationData.phaseAllocation.reduce((sum, phase) => sum + parseInt(phase.totalDays || 0), 0)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Gantt Chart */}
        {estimationData.ganttChart?.roles && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              📅 Sprint-wise Gantt Chart ({Math.ceil(workingDays/5)} Weeks)
            </h2>
            
            {/* Phase Legend */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <div className="text-sm font-medium text-gray-600">
                Timeline: {merged?.workingDays || 'N/A'} working days
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded font-medium">
                  DISC - Discovery
                </span>
                <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded font-medium">
                  WIRE - Wireframing
                </span>
                <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded font-medium">
                  VIS - Visual Design
                </span>
                <span className="px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded font-medium">
                  REF - Refinement
                </span>
                <span className="px-2 py-1 bg-pink-200 text-pink-800 text-xs rounded font-medium">
                  HAND - Handoff
                </span>
              </div>
            </div>

            {/* Gantt Chart Rows */}
            <div className="space-y-4">
              {Object.entries(estimationData.ganttChart.roles).map(([role, phases]) => (
                <div key={role} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">{role}</h3>
                    <div className="text-sm text-gray-600">
                      {phases.length} {phases.length === 1 ? 'week' : 'weeks'}
                    </div>
                  </div>
                  
                  {/* Timeline Bars */}
                  <div className="flex gap-1 mb-2">
                    {phases.map((phase, index) => {
                      const getPhaseColor = (phase) => {
                        switch(phase) {
                          case 'DISC': return 'bg-purple-500';
                          case 'WIRE': return 'bg-blue-500';
                          case 'VIS': return 'bg-green-500';
                          case 'REF': return 'bg-orange-500';
                          case 'HAND': return 'bg-pink-500';
                          default: return 'bg-gray-500';
                        }
                      };
                      
                      return (
                        <div 
                          key={index} 
                          className={`h-6 flex-1 ${getPhaseColor(phase)} rounded flex items-center justify-center text-white text-xs font-medium`}
                          title={`Week ${index + 1}: ${phase}`}
                        >
                          {phase}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Week Numbers */}
                  <div className="flex gap-1">
                    {phases.map((_, index) => (
                      <div key={index} className="flex-1 text-center text-xs text-gray-600">
                        W{index + 1}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resource Utilization Analysis */}
        {estimationData.resourceUtilization && estimationData.resourceUtilization.length > 0 && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              📈 Resource Utilization Analysis
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              <div className={`bg-gradient-to-br from-purple-400 to-indigo-500 text-white p-5 rounded-2xl text-center shadow-lg`}>
                <div className="text-3xl font-bold mb-1">6.8</div>
                <div className="text-sm opacity-90">Avg Hours/Day per Designer</div>
              </div>
              <div className={`bg-gradient-to-br from-pink-400 to-rose-500 text-white p-5 rounded-2xl text-center shadow-lg`}>
                <div className="text-3xl font-bold mb-1">90%</div>
                <div className="text-sm opacity-90">Peak Utilization</div>
              </div>
              <div className={`bg-gradient-to-br ${colorScheme.secondary} text-white p-5 rounded-2xl text-center shadow-lg`}>
                <div className="text-3xl font-bold mb-1">8</div>
                <div className="text-sm opacity-90">Buffer Days Built-in</div>
              </div>
              <div className="bg-gradient-to-br from-teal-400 to-cyan-500 text-white p-5 rounded-2xl text-center shadow-lg">
                <div className="text-3xl font-bold mb-1">75%</div>
                <div className="text-sm opacity-90">Overall Efficiency Target</div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Week Range</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Design PM Load</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Design Lead Load</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Interaction Designer Load</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Visual Designer Load</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Team Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {estimationData.resourceUtilization.map((util, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="p-3 align-top"><strong>{util.weekRange}</strong></td>
                      <td className="p-3 align-top">{util.designPMLoad}</td>
                      <td className="p-3 align-top">{util.designLeadLoad}</td>
                      <td className="p-3 align-top">{util.interactionDesignerLoad}</td>
                      <td className="p-3 align-top">{util.visualDesignerLoad}</td>
                      <td className="p-3 align-top"><strong>{util.teamUtilization}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Weekly Deliverables */}
        {estimationData.weeklyDeliverables && estimationData.weeklyDeliverables.length > 0 && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              📋 Weekly Deliverables
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {estimationData.weeklyDeliverables.map((week, i) => (
                <div key={i} className={`bg-white p-6 rounded-2xl border border-gray-200 shadow-lg`}>
                  <div className={`inline-block px-4 py-2 bg-gradient-to-r ${colorScheme.primary} text-white text-sm font-semibold rounded-lg mb-4`}>
                    Week {week.week}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border-l-5 border-red-400">
                    <h4 className="text-gray-800 font-semibold mb-3">Key Deliverables:</h4>
                    <ul className="space-y-2">
                      {(week.deliverables || []).map((d, j) => (
                        <li key={j} className="text-sm text-gray-700 leading-relaxed flex items-start">
                          <span className="text-green-500 font-bold mr-2">✓</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk & Considerations */}
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-8 rounded-2xl mb-6">
          <h3 className="text-gray-800 text-2xl font-semibold mb-6">🎯 Key Considerations & Risk Management</h3>
          <ol className="list-decimal ml-6 space-y-4 text-gray-700">
            <li><strong>Timeline Feasibility:</strong> {Math.ceil(workingDays/5)}-week timeline is realistic for {merged?.projectName || 'this platform'} with proper resource allocation and parallel workstreams</li>
            <li><strong>Cross-platform Consistency:</strong> Design system approach ensures unified experience across responsive web, Android, and iOS</li>
            <li><strong>Industry Complexity:</strong> Real-time features, dynamic content, and multi-user coordination require specialized UX considerations</li>
            <li><strong>Integration Requirements:</strong> Multiple third-party integrations and compliance requirements factored into design timeline</li>
            <li><strong>Scalability Planning:</strong> Design system built for future feature expansion and user growth</li>
            <li><strong>Performance Optimization:</strong> Mobile-first approach with optimized loading states and responsive design patterns</li>
          </ol>
        </div>

        {/* Risk Considerations */}
        {estimationData.riskConsiderations && (
          <div className="mb-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl">
              <h3 className="text-red-800 text-xl font-semibold mb-4">⚠️ Risks & Assumptions</h3>
              {estimationData.riskConsiderations.assumptions && (
                <div className="mb-4">
                  <p className="font-semibold text-red-700 mb-2">Assumptions:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    {estimationData.riskConsiderations.assumptions.map((assumption, idx) => (
                      <li key={idx} className="text-red-700 text-sm">{assumption}</li>
                    ))}
                  </ul>
                </div>
              )}
              {estimationData.riskConsiderations.risks && (
                <div>
                  <p className="font-semibold text-red-700 mb-2">Key Risks:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    {estimationData.riskConsiderations.risks.map((risk, idx) => (
                      <li key={idx} className="text-red-700 text-sm">{risk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes Section */}
        {estimationData.notes && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
            <h3 className="text-yellow-800 font-semibold mb-2">📝 Additional Notes</h3>
            <p className="text-yellow-700">{estimationData.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodyardEstimationResults;