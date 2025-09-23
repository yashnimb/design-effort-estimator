import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const DesignEstimationResults = () => {
  const [estimationData, setEstimationData] = useState(null);
  const [error, setError] = useState('');

  // Helper function for complexity styling
  const getComplexityStyles = (complexity) => {
    switch (complexity?.toLowerCase()) {
      case 'high': 
        return { background: '#fee2e2', color: '#991b1b' };
      case 'medium': 
        return { background: '#fef3c7', color: '#92400e' };
      case 'low': 
        return { background: '#dcfce7', color: '#166534' };
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

  if (error) {
    return (
      <div style={{ 
        margin: 0, 
        padding: 0, 
        boxSizing: 'border-box', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        background: '#f8fafc',
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>📊 Design Estimation Results</h1>
            <p style={{ opacity: 0.9 }}>AI-Powered Project Analysis</p>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: '#fee2e2',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            color: '#dc2626'
          }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!estimationData) {
    return (
      <div style={{ 
        margin: 0, 
        padding: 0, 
        boxSizing: 'border-box', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        background: '#f8fafc',
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>📊 Design Estimation Results</h1>
            <p style={{ opacity: 0.9 }}>AI-Powered Project Analysis</p>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <p>⏳ Loading estimation data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      margin: 0, 
      padding: 0, 
      boxSizing: 'border-box', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}>📊 Design Estimation Results</h1>
          <p style={{ opacity: 0.9 }}>AI-Powered Project Analysis</p>
        </div>

        {/* Project Overview Section */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          animation: 'fadeIn 0.4s ease-out'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            Project Overview
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Project Name</div>
              <div style={{ color: '#334155', fontWeight: 500 }}>{merged?.projectName || "N/A"}</div>
            </div>
            <div style={{
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Team Members</div>
              <div style={{ color: '#334155', fontWeight: 500 }}>{merged?.teamMembers || "N/A"}</div>
            </div>
            <div style={{
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Working Days</div>
              <div style={{ color: '#334155', fontWeight: 500 }}>{merged?.workingDays || "N/A"}</div>
            </div>
            <div style={{
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Total Screens</div>
              <div style={{ color: '#334155', fontWeight: 500 }}>{merged?.totalScreens || "N/A"}</div>
            </div>
          </div>
        </div>

        {/* Total Effort Highlight */}
        {merged?.totalPersonDays && (
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Total Estimated Effort</h3>
            <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>{merged.totalPersonDays} Days</div>
            <p style={{ opacity: 0.9 }}>Person-days required for completion</p>
          </div>
        )}

        {/* Estimated Features */}
        {merged?.estimatedFeatures && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.4s ease-out'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1e293b',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              Estimated Features
            </h2>
            {Array.isArray(merged.estimatedFeatures) ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.5rem'
              }}>
                {merged.estimatedFeatures.map((feature, index) => (
                  <div key={index} style={{
                    background: '#f8fafc',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    color: '#334155',
                    border: '1px solid #e2e8f0'
                  }}>
                    {feature}
                  </div>
                ))}
              </div>
            ) : (
              <ul style={{ marginLeft: 24, listStyle: "disc" }}>
                {merged.estimatedFeatures.split(',').map((f, i) => (
                  <li key={i}>{f.trim()}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Timeline Justification */}
        {merged?.timelineJustification && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.4s ease-out'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1e293b',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              Timeline Justification
            </h2>
            <div style={{ color: '#334155', padding: '0 0 0.5em 0.2em', lineHeight: 1.6 }}>
              {merged.timelineJustification}
            </div>
          </div>
        )}

        {/* Screen Breakdown Table */}
        {estimationData.screenBreakdown && estimationData.screenBreakdown.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.4s ease-out'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1e293b',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              Screen Breakdown
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{
                      textAlign: 'left',
                      padding: '1rem',
                      background: '#f8fafc',
                      color: '#64748b',
                      fontWeight: 600
                    }}>Category</th>
                    <th style={{
                      textAlign: 'left',
                      padding: '1rem',
                      background: '#f8fafc',
                      color: '#64748b',
                      fontWeight: 600
                    }}>Screen Name</th>
                    <th style={{
                      textAlign: 'left',
                      padding: '1rem',
                      background: '#f8fafc',
                      color: '#64748b',
                      fontWeight: 600
                    }}>Complexity</th>
                    <th style={{
                      textAlign: 'left',
                      padding: '1rem',
                      background: '#f8fafc',
                      color: '#64748b',
                      fontWeight: 600
                    }}>Design Effort Hours</th>
                    <th style={{
                      textAlign: 'left',
                      padding: '1rem',
                      background: '#f8fafc',
                      color: '#64748b',
                      fontWeight: 600
                    }}>Variants</th>
                  </tr>
                </thead>
                <tbody>
                  {estimationData.screenBreakdown.map((screen, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem', color: '#334155' }}>
                        {screen.featureCategory}
                      </td>
                      <td style={{ padding: '1rem', color: '#334155' }}>
                        {screen.screenName}
                      </td>
                      <td style={{ padding: '1rem', color: '#334155' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          ...getComplexityStyles(screen.complexity)
                        }}>
                          {screen.complexity}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#334155' }}>
                        {screen.designEffortHours}
                      </td>
                      <td style={{ padding: '1rem', color: '#334155' }}>
                        {screen.variants}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Complexity Summary */}
        {estimationData.complexitySummary?.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.4s ease-out'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1e293b',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              Complexity Summary
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {estimationData.complexitySummary.map((c, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#64748b',
                    marginBottom: '0.5rem'
                  }}>
                    {c.level} ({c.uniqueScreens} screens)
                  </div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#334155',
                    marginBottom: '0.5rem'
                  }}>
                    {c.totalHours} hours
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    Effort: {c.effortRange}h<br />
                    Variants: {c.totalVariants}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Role Effort */}
        {estimationData.roleEffort?.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.4s ease-out'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1e293b',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              Design Role Effort
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              {estimationData.roleEffort.map((r, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>{r.role}</div>
                  <div style={{ color: '#334155', fontWeight: 500, marginBottom: '0.5rem' }}>
                    {r.totalPersonDays} days ({r.fte} FTE)
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{r.justification}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phase Allocation */}
        {estimationData.phaseAllocation?.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.4s ease-out'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1e293b',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              Phase Allocation
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {estimationData.phaseAllocation.map((p, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>{p.phase}</div>
                  <div style={{ color: '#334155', fontSize: '0.875rem', lineHeight: 1.5 }}>
                    Design PM: {p.designPM}, Lead: {p.designLead}<br />
                    Interaction Designer: {p.interactionDesigner}<br />
                    Visual Designer: {p.visualDesigner}<br />
                    <strong>Total Days: {p.totalDays}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {merged?.workingDays && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.4s ease-out'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1e293b',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              Timeline
            </h2>
            <h3 style={{ color: '#555', marginBottom: '1em' }}>
              Expected Timeline: {merged.workingDays} days
            </h3>
            <div style={{
              width: '100%',
              height: '2rem',
              background: '#e2e8f0',
              borderRadius: '1rem',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min((Number(merged.workingDays) / 52) * 100, 100)}%`,
                height: '100%',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}>
                {merged.workingDays} days
              </div>
            </div>
          </div>
        )}

        {/* Gantt Chart */}
        {estimationData.ganttChart?.roles && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.4s ease-out'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1e293b',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              Project Timeline & Gantt Chart
            </h2>
            
            {/* Timeline Legend */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              marginBottom: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>
                Timeline: {merged?.workingDays || 'N/A'} working days
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  background: '#ddd6fe',
                  color: '#7c3aed',
                  fontSize: '0.75rem',
                  borderRadius: '0.25rem',
                  fontWeight: 500
                }}>DISC - Discovery</span>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  background: '#dbeafe',
                  color: '#2563eb',
                  fontSize: '0.75rem',
                  borderRadius: '0.25rem',
                  fontWeight: 500
                }}>WIRE - Wireframing</span>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  background: '#dcfce7',
                  color: '#16a34a',
                  fontSize: '0.75rem',
                  borderRadius: '0.25rem',
                  fontWeight: 500
                }}>VIS - Visual Design</span>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  background: '#fed7aa',
                  color: '#ea580c',
                  fontSize: '0.75rem',
                  borderRadius: '0.25rem',
                  fontWeight: 500
                }}>HAND - Handoff</span>
              </div>
            </div>

            {/* Gantt Chart Rows */}
            <div style={{ gap: '1rem' }}>
              {Object.entries(estimationData.ganttChart.roles).map(([role, phases]) => (
                <div key={role} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem'
                  }}>
                    <h3 style={{ fontWeight: 600, color: '#1e293b', margin: 0 }}>{role}</h3>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {phases.length} {phases.length === 1 ? 'week' : 'weeks'}
                    </div>
                  </div>
                  
                  {/* Timeline Bars */}
                  <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
                    {phases.map((phase, index) => {
                      const getPhaseColor = (phase) => {
                        switch(phase) {
                          case 'DISC': return '#8b5cf6';
                          case 'WIRE': return '#3b82f6';
                          case 'VIS': return '#10b981';
                          case 'HAND': return '#f59e0b';
                          default: return '#6b7280';
                        }
                      };
                      
                      return (
                        <div 
                          key={index} 
                          style={{
                            height: '1.5rem',
                            flex: 1,
                            background: getPhaseColor(phase),
                            borderRadius: '0.125rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}
                          title={`Week ${index + 1}: ${phase}`}
                        >
                          {phase}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Week Numbers */}
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {phases.map((_, index) => (
                      <div key={index} style={{
                        flex: 1,
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        color: '#64748b'
                      }}>
                        W{index + 1}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Deliverables */}
        {estimationData.weeklyDeliverables?.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.4s ease-out'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1e293b',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              Weekly Deliverables
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {estimationData.weeklyDeliverables.map((week, i) => (
                <div key={i} style={{
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Week {week.week}</div>
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                    {(week.deliverables || []).map((d, j) => (
                      <li key={j} style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '0.25rem' }}>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Section */}
        {estimationData.notes && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.4s ease-out'
          }}>
            <div style={{
              background: '#fffbeb',
              borderLeft: '4px solid #f59e0b',
              padding: '1rem',
              borderRadius: '0.5rem'
            }}>
              <h3>📝 Additional Notes</h3>
              <p>{estimationData.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignEstimationResults;