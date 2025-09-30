import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const FoodyardEstimationResults = () => {
  const [estimationData, setEstimationData] = useState(null);
  const [error, setError] = useState('');

  // Color schemes based on project type
  const colorSchemes = {
    red: { primary: 'from-red-400 to-orange-500', secondary: 'from-red-500 to-orange-600', accent: 'from-orange-500 to-red-600', card: 'from-red-400 to-orange-500', light: 'red-400' },
    blue: { primary: 'from-blue-400 to-cyan-500', secondary: 'from-blue-500 to-cyan-600', accent: 'from-cyan-500 to-blue-600', card: 'from-blue-400 to-cyan-500', light: 'blue-400' },
    green: { primary: 'from-green-400 to-teal-500', secondary: 'from-green-500 to-teal-600', accent: 'from-teal-500 to-green-600', card: 'from-green-400 to-teal-500', light: 'green-400' },
    purple: { primary: 'from-purple-400 to-pink-500', secondary: 'from-purple-500 to-pink-600', accent: 'from-pink-500 to-purple-600', card: 'from-purple-400 to-pink-500', light: 'purple-400' },
    orange: { primary: 'from-orange-400 to-yellow-500', secondary: 'from-orange-500 to-yellow-600', accent: 'from-yellow-500 to-orange-600', card: 'from-orange-400 to-yellow-500', light: 'orange-400' },
    teal: { primary: 'from-teal-400 to-cyan-500', secondary: 'from-teal-500 to-cyan-600', accent: 'from-cyan-500 to-teal-600', card: 'from-teal-400 to-cyan-500', light: 'teal-400' }
  };

  const getComplexityStyles = (complexity) => {
    const c = complexity?.toLowerCase();
    if (c === 'high') return { background: '#e74c3c', color: 'white' };
    if (c === 'med' || c === 'medium') return { background: '#f39c12', color: 'white' };
    if (c === 'low') return { background: '#27ae60', color: 'white' };
    return { background: '#f3f4f6', color: '#374151' };
  };

  const getPriorityStyles = (priority) => {
    const p = priority?.toLowerCase();
    if (p === 'high') return 'bg-red-100 text-red-800 border-red-300';
    if (p === 'med' || p === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (p === 'low') return 'bg-green-100 text-green-800 border-green-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const safeParse = (str, fallback = {}) => {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("estimationData");
      if (!stored) {
        setError("No estimation data found. Please submit the form first.");
        return;
      }
      
      let parsed = safeParse(stored);
      if (Array.isArray(parsed) && parsed[0]?.output) {
        parsed = safeParse(parsed[0].output);
      } else if (parsed?.output) {
        parsed = safeParse(parsed.output);
      }
      
      setEstimationData(typeof parsed === "string" ? safeParse(parsed) : parsed);
    } catch (err) {
      setError("Error loading estimation data: " + err.message);
    }
  }, []);

  const merged = estimationData ? { ...estimationData.overview, ...estimationData } : null;
  
  const getColorScheme = () => {
    const projectType = merged?.projectType?.toLowerCase() || '';
    const colorScheme = merged?.colorScheme;
    
    if (Array.isArray(colorScheme) && colorScheme.length > 0) {
      const mainColor = colorScheme[0].toLowerCase();
      if (mainColor.includes('blue')) return 'blue';
      if (mainColor.includes('green')) return 'green';
      if (mainColor.includes('red')) return 'red';
      if (mainColor.includes('purple')) return 'purple';
      if (mainColor.includes('orange')) return 'orange';
      if (mainColor.includes('teal')) return 'teal';
    }
    
    if (projectType.includes('food') || projectType.includes('automotive')) return 'red';
    if (projectType.includes('tech') || projectType.includes('b2b')) return 'blue';
    if (projectType.includes('health') || projectType.includes('finance')) return 'green';
    if (projectType.includes('creative')) return 'purple';
    if (projectType.includes('commerce') || projectType.includes('retail')) return 'orange';
    if (projectType.includes('education')) return 'teal';
    
    return 'blue';
  };

  const colorScheme = colorSchemes[getColorScheme()];

  if (error) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colorScheme.primary} p-5`}>
        <div className="max-w-7xl mx-auto bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl p-10 shadow-2xl">
          <h1 className={`text-center text-gray-800 mb-10 text-4xl font-bold bg-gradient-to-r ${colorScheme.primary} bg-clip-text text-transparent`}>
            Design Project Plan
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
            Design Project Plan
          </h1>
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
            <p>Loading estimation data...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalPersonDays = merged?.totalPersonDays || estimationData.teamComposition?.reduce((sum, member) => sum + (parseInt(member.totalDays) || 0), 0) || 420;
  const teamMembers = merged?.teamMembers || estimationData.teamComposition?.length || 8;
  const workingDays = merged?.workingDays || 80;
  const totalScreens = merged?.totalScreens || estimationData.screenBreakdown?.length || 35;
  const totalHours = estimationData.complexitySummary?.reduce((sum, c) => sum + (parseInt(c.totalHours) || 0), 0) || 270;
  const projectName = merged?.projectName || 'Design Project';
  const projectIcon = merged?.projectType?.toLowerCase().includes('automotive') ? '🚗' :
                     merged?.projectType?.toLowerCase().includes('food') ? '🍽️' : 
                     merged?.projectType?.toLowerCase().includes('tech') ? '💻' :
                     merged?.projectType?.toLowerCase().includes('health') ? '🏥' :
                     merged?.projectType?.toLowerCase().includes('finance') ? '💰' : '🎯';

  const timelineWeeks = Math.ceil(workingDays / 5);

  // Generate Gantt Chart data
  const generateGanttData = () => {
    if (!estimationData.weeklyRoadmap) return [];
    
    const roles = ['Design Director', 'Senior UX Designer', 'UI Designer', 'UX Researcher', 'Content Writer', 'Graphic Designer', 'Accessibility Specialist', 'Design PM'];
    const phaseColors = {
      'Discovery': { bg: 'bg-red-500', label: 'DISC' },
      'Strategy': { bg: 'bg-purple-500', label: 'WIRE' },
      'Design': { bg: 'bg-teal-500', label: 'VIS' },
      'Prototype': { bg: 'bg-orange-500', label: 'REF' },
      'Finalization': { bg: 'bg-pink-500', label: 'HAND' }
    };

    return roles.map(role => ({
      role,
      weeks: estimationData.weeklyRoadmap.map(week => ({
        week: week.week,
        phase: week.phase,
        ...phaseColors[week.phase]
      }))
    }));
  };

  const ganttData = generateGanttData();

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
              <div className="text-sm opacity-90">Working Days ({timelineWeeks} weeks)</div>
            </div>
            <div className={`bg-gradient-to-br ${colorScheme.card} text-white p-5 rounded-2xl text-center shadow-lg`}>
              <div className="text-3xl font-bold mb-1">{merged?.estimatedFeatures?.length || '12'}</div>
              <div className="text-sm opacity-90">Core Features</div>
            </div>
            <div className={`bg-gradient-to-br ${colorScheme.card} text-white p-5 rounded-2xl text-center shadow-lg`}>
              <div className="text-3xl font-bold mb-1">{totalScreens}</div>
              <div className="text-sm opacity-90">Total Screens</div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-500 rounded-lg p-4 my-5 text-green-800">
            <strong>Project Scope:</strong> {merged?.projectType || 'Multi-platform application'} with comprehensive design system, user research, and cross-platform consistency.
          </div>
        </div>

        {/* Estimated Features */}
        {merged?.estimatedFeatures && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              🎯 Estimated Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {merged.estimatedFeatures.map((feature, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700">
                  ✓ {feature}
                </div>
              ))}
            </div>
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

        {/* Team Composition */}
        {estimationData.teamComposition && estimationData.teamComposition.length > 0 && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              👥 Team Composition & Effort
            </h2>
            
            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Role</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>FTE</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Total Days</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Specialization</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Justification</th>
                  </tr>
                </thead>
                <tbody>
                  {estimationData.teamComposition.map((member, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="p-3 align-top"><strong>{member.role}</strong></td>
                      <td className="p-3 align-top">{member.fte}</td>
                      <td className="p-3 align-top">{member.totalDays}</td>
                      <td className="p-3 align-top">{member.specialization}</td>
                      <td className="p-3 align-top">{member.justification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Screen Breakdown */}
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
                <div className="text-sm opacity-90">Design Variants</div>
              </div>
              <div className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white p-5 rounded-2xl text-center shadow-lg">
                <div className="text-3xl font-bold mb-1">{totalHours}</div>
                <div className="text-sm opacity-90">Total Design Hours</div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Category</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Screen Name</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Complexity</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Design Hours</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Variants</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {estimationData.screenBreakdown.map((screen, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="p-3 align-top"><strong>{screen.featureCategory}</strong></td>
                      <td className="p-3 align-top">{screen.screenName}</td>
                      <td className="p-3 align-top">
                        <span className="px-2 py-1 rounded-full text-xs font-bold" style={getComplexityStyles(screen.complexity)}>
                          {screen.complexity?.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 align-top">{screen.designEffortHours}h</td>
                      <td className="p-3 align-top">{screen.variants}</td>
                      <td className="p-3 align-top">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityStyles(screen.priority)}`}>
                          {screen.priority?.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Complexity Summary */}
        {estimationData.complexitySummary && estimationData.complexitySummary.length > 0 && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              📈 Complexity & Effort Summary
            </h2>
            
            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Complexity</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Screens</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Avg Effort/Screen</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Total Variants</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Total Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {estimationData.complexitySummary.map((c, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="p-3 align-top">
                        <span className="px-3 py-1 rounded-full text-xs font-bold" style={getComplexityStyles(c.complexity)}>
                          {c.complexity?.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 align-top"><strong>{c.uniqueScreens}</strong></td>
                      <td className="p-3 align-top">{c.avgEffortPerScreen}h</td>
                      <td className="p-3 align-top">{c.totalVariants}</td>
                      <td className="p-3 align-top"><strong>{c.totalHours}h</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Role Effort Distribution */}
        {estimationData.roleEffortDistribution && estimationData.roleEffortDistribution.length > 0 && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              👨‍💼 Role Effort Distribution by Phase
            </h2>
            
            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Role</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Discovery Hours</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Wireframe Hours</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Design Hours</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Prototype Hours</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Total Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {estimationData.roleEffortDistribution.map((role, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="p-3 align-top"><strong>{role.role}</strong></td>
                      <td className="p-3 align-top">{role.discoveryHours}h</td>
                      <td className="p-3 align-top">{role.wireframeHours}h</td>
                      <td className="p-3 align-top">{role.designHours}h</td>
                      <td className="p-3 align-top">{role.prototypeHours}h</td>
                      <td className="p-3 align-top"><strong>{role.totalHours}h</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Phase Allocation */}
        {estimationData.phaseAllocation && estimationData.phaseAllocation.length > 0 && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              📊 Phase-wise Allocation ({timelineWeeks} Weeks)
            </h2>
            
            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Phase</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Duration</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Team Allocation</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Key Deliverables</th>
                    <th className={`bg-gradient-to-r ${colorScheme.primary} text-white p-4 text-left font-semibold text-xs uppercase tracking-wider`}>Total Effort</th>
                  </tr>
                </thead>
                <tbody>
                  {estimationData.phaseAllocation.map((phase, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="p-3 align-top"><strong>{phase.phase}</strong></td>
                      <td className="p-3 align-top">{phase.durationWeeks} weeks</td>
                      <td className="p-3 align-top">{phase.teamAllocation}</td>
                      <td className="p-3 align-top">
                        <ul className="text-sm">
                          {phase.keyDeliverables?.map((deliverable, i) => (
                            <li key={i}>• {deliverable}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-3 align-top"><strong>{phase.totalEffort}h</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resource Plan */}
        {estimationData.resourcePlan && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              🎯 Resource Planning Strategy
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3">Core Team</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  {estimationData.resourcePlan.coreTeam?.map((member, i) => (
                    <li key={i}>• {member}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-3">Specialist Team</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  {estimationData.resourcePlan.specialistTeam?.map((member, i) => (
                    <li key={i}>• {member}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-3">Team Scaling</h3>
                <p className="text-sm text-purple-700">{estimationData.resourcePlan.teamScaling}</p>
              </div>
            </div>
          </div>
        )}

        {/* Gantt Chart - Weekly Timeline Visualization */}
        {ganttData.length > 0 && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              📅 Project Gantt Chart - Weekly Timeline
            </h2>
            
            {/* Phase Legend */}
            <div className="flex items-center gap-4 mb-6 flex-wrap bg-slate-700 p-4 rounded-lg">
              <span className="text-white font-semibold text-sm mr-4">Phase Legend:</span>
              <span className="px-3 py-1 bg-red-500 text-white text-xs rounded-full font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                Discovery
              </span>
              <span className="px-3 py-1 bg-purple-500 text-white text-xs rounded-full font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                Wireframing
              </span>
              <span className="px-3 py-1 bg-teal-500 text-white text-xs rounded-full font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                Visual Design
              </span>
              <span className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                Refinement
              </span>
              <span className="px-3 py-1 bg-pink-500 text-white text-xs rounded-full font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                Handoff
              </span>
            </div>

            {/* Gantt Chart Table */}
            <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
              <table className="w-full border-collapse bg-white" style={{ minWidth: '1200px' }}>
                <thead>
                  <tr className="bg-slate-700 text-white">
                    <th className="p-3 text-left font-semibold border-r border-slate-600 sticky left-0 bg-slate-700 z-10" style={{ minWidth: '150px' }}>
                      Role
                    </th>
                    {ganttData[0]?.weeks.map((week, idx) => (
                      <th key={idx} className="p-3 text-center font-semibold border-r border-slate-600 text-xs" style={{ minWidth: '80px' }}>
                        W{week.week}-1
                      </th>
                    ))}
                    {ganttData[0]?.weeks.map((week, idx) => (
                      <th key={`w2-${idx}`} className="p-3 text-center font-semibold border-r border-slate-600 text-xs" style={{ minWidth: '80px' }}>
                        W{week.week}-2
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ganttData.map((roleData, roleIdx) => (
                    <tr key={roleIdx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 font-semibold text-gray-800 border-r border-gray-300 sticky left-0 bg-white z-10">
                        {roleData.role}
                      </td>
                      {roleData.weeks.map((week, weekIdx) => (
                        <React.Fragment key={weekIdx}>
                          <td className="p-2 text-center border-r border-gray-200">
                            <div className={`${week.bg} text-white px-2 py-1 rounded text-xs font-bold mx-auto`} style={{ maxWidth: '60px' }}>
                              {week.label}
                            </div>
                          </td>
                          <td className="p-2 text-center border-r border-gray-200">
                            <div className={`${week.bg} text-white px-2 py-1 rounded text-xs font-bold mx-auto`} style={{ maxWidth: '60px' }}>
                              {week.label}
                            </div>
                          </td>
                        </React.Fragment>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Weekly Roadmap */}
        {estimationData.weeklyRoadmap && estimationData.weeklyRoadmap.length > 0 && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              🗓️ Weekly Roadmap & Deliverables
            </h2>
            
            <div className="grid gap-4">
              {estimationData.weeklyRoadmap.map((week, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 bg-gradient-to-r ${colorScheme.primary} text-white text-sm font-semibold rounded-lg`}>
                        Week {week.week}
                      </div>
                      <div className="text-sm font-medium text-gray-600">
                        Phase: <span className="text-gray-800">{week.phase}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Focus: {week.teamFocus}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Key Activities:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {week.keyActivities?.map((activity, i) => (
                          <li key={i}>• {activity}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Deliverables:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {week.deliverables?.map((deliverable, i) => (
                          <li key={i} className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quality Assurance */}
        {estimationData.qualityAssurance && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              🔍 Quality Assurance & Testing
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3">Review Points</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  {estimationData.qualityAssurance.reviewPoints?.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-0.5">🔍</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-3">Client Checkpoints</h3>
                <ul className="text-sm text-green-700 space-y-2">
                  {estimationData.qualityAssurance.clientCheckpoints?.map((checkpoint, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      {checkpoint}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-3">Testing Strategy</h3>
                <p className="text-sm text-purple-700">{estimationData.qualityAssurance.testingStrategy}</p>
              </div>
            </div>
          </div>
        )}

        {/* Risk Assessment */}
        {estimationData.riskAssessment && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              ⚠️ Risk Assessment & Mitigation
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-red-500">🚨</span> Timeline Risks
                </h3>
                <ul className="text-sm text-gray-700 space-y-2 bg-red-50 p-4 rounded-lg border border-red-200">
                  {estimationData.riskAssessment.timelineRisks?.map((risk, i) => (
                    <li key={i}>• {risk}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-orange-500">⚡</span> Complexity Risks
                </h3>
                <ul className="text-sm text-gray-700 space-y-2 bg-orange-50 p-4 rounded-lg border border-orange-200">
                  {estimationData.riskAssessment.complexityRisks?.map((risk, i) => (
                    <li key={i}>• {risk}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-yellow-500">👥</span> Resource Risks
                </h3>
                <ul className="text-sm text-gray-700 space-y-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  {estimationData.riskAssessment.resourceRisks?.map((risk, i) => (
                    <li key={i}>• {risk}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-green-500">🛡️</span> Mitigation Strategies
                </h3>
                <ul className="text-sm text-gray-700 space-y-2 bg-green-50 p-4 rounded-lg border border-green-200">
                  {estimationData.riskAssessment.mitigation?.map((strategy, i) => (
                    <li key={i}>• {strategy}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Success Metrics */}
        {estimationData.successMetrics && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className={`text-gray-700 text-3xl font-semibold mb-5 border-b-4 border-${colorScheme.light} pb-3`}>
              🎯 Success Metrics & KPIs
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3">Design KPIs</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  {estimationData.successMetrics.designKPIs?.map((kpi, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-0.5">📊</span>
                      {kpi}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-3">Project KPIs</h3>
                <ul className="text-sm text-green-700 space-y-2">
                  {estimationData.successMetrics.projectKPIs?.map((kpi, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      {kpi}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-3">Client Satisfaction</h3>
                <ul className="text-sm text-purple-700 space-y-2">
                  {estimationData.successMetrics.clientSatisfaction?.map((factor, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-purple-500 mr-2 mt-0.5">⭐</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Project Summary Footer */}
        <div className={`bg-gradient-to-br ${colorScheme.primary} p-8 rounded-2xl text-white text-center`}>
          <h3 className="text-2xl font-bold mb-4">Project Estimation Complete</h3>
          <p className="text-lg opacity-90 mb-2">
            Total Effort: <strong>{totalPersonDays} Person-Days</strong> | Timeline: <strong>{timelineWeeks} Weeks</strong>
          </p>
          <p className="text-sm opacity-80">
            This comprehensive plan provides a detailed roadmap for successful project delivery with quality assurance, risk mitigation, and clear success metrics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodyardEstimationResults;