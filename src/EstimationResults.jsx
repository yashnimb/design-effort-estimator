import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const EstimationResults = () => {
  const location = useLocation();
  const aiOutput = location.state?.aiOutput; // passed from form.jsx
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!aiOutput) return;

    try {
      let parsed = aiOutput;

      // aiOutput is a stringified JSON from n8n
      if (typeof aiOutput === "string") {
        parsed = JSON.parse(aiOutput);
      }

      console.log("Raw aiOutput:", aiOutput);
      console.log("Parsed data:", parsed); // ✅ debugging log

      setData(parsed);
    } catch (err) {
      console.error("Failed to parse aiOutput", err, aiOutput);
    }
  }, [aiOutput]);

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading estimation results...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Project Title */}
      <h1 className="text-3xl font-bold text-gray-800">{data.projectName}</h1>

      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <OverviewCard title="Total Person-Days" value={data.overview.totalPersonDays} />
        <OverviewCard title="Team Members" value={data.overview.teamMembers} />
        <OverviewCard title="Working Days" value={data.overview.workingDays} />
        <OverviewCard title="Total Screens" value={data.overview.totalScreens} />
      </div>
      <SectionCard title="Timeline Justification">
        <p>{data.overview.timelineJustification}</p>
      </SectionCard>

      {/* Screen Breakdown */}
      <SectionTable title="Screen Breakdown" headers={["Feature Category", "Screen Name", "Complexity", "Effort (hrs)", "Variants"]}>
        {data.screenBreakdown?.map((s, i) => (
          <tr key={i} className="border-t">
            <td className="p-2">{s.featureCategory}</td>
            <td className="p-2">{s.screenName}</td>
            <td className="p-2">{s.complexity}</td>
            <td className="p-2">{s.designEffortHours}</td>
            <td className="p-2">{s.variants}</td>
          </tr>
        ))}
      </SectionTable>

      {/* Complexity Summary */}
      <SectionTable title="Complexity Summary" headers={["Level", "Unique Screens", "Effort Range", "Total Variants", "Total Hours"]}>
        {data.complexitySummary?.map((c, i) => (
          <tr key={i} className="border-t">
            <td className="p-2">{c.level}</td>
            <td className="p-2">{c.uniqueScreens}</td>
            <td className="p-2">{c.effortRange}</td>
            <td className="p-2">{c.totalVariants}</td>
            <td className="p-2">{c.totalHours}</td>
          </tr>
        ))}
      </SectionTable>

      {/* Role Effort */}
      <SectionCard title="Role Effort">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.roleEffort?.map((r, i) => (
            <div key={i} className="p-4 border rounded-xl">
              <p className="font-semibold">{r.role}</p>
              <p className="text-sm text-gray-500">
                {r.totalPersonDays} days • FTE: {r.fte}
              </p>
              <p className="text-gray-700 mt-2">{r.justification}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Phase Allocation */}
      <SectionTable title="Phase Allocation" headers={["Phase", "Design PM", "Design Lead", "Interaction Designer", "Visual Designer", "Total Days"]}>
        {data.phaseAllocation?.map((p, i) => (
          <tr key={i} className="border-t">
            <td className="p-2">{p.phase}</td>
            <td className="p-2">{p.designPM}</td>
            <td className="p-2">{p.designLead}</td>
            <td className="p-2">{p.interactionDesigner}</td>
            <td className="p-2">{p.visualDesigner}</td>
            <td className="p-2">{p.totalDays}</td>
          </tr>
        ))}
      </SectionTable>

      {/* Gantt Chart */}
      <SectionCard title="Gantt Chart">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.ganttChart?.roles || {}).map(([role, tasks], i) => (
            <div key={i} className="p-4 border rounded-xl">
              <p className="font-semibold">{role}</p>
              <ul className="list-disc list-inside text-gray-700">
                {tasks.map((t, j) => (
                  <li key={j}>{typeof t === "string" ? t : `${t.phase} (${t.weeks}) – ${t.effort}`}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Weekly Deliverables */}
      <SectionCard title="Weekly Deliverables">
        <div className="space-y-3">
          {data.weeklyDeliverables?.map((w, i) => (
            <div key={i} className="p-3 border rounded-xl">
              <p className="font-semibold">Week {w.week}</p>
              <ul className="list-disc list-inside text-gray-700">
                {w.deliverables.map((d, j) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Considerations */}
      <SectionCard title="Considerations">
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li><strong>Timeline Feasibility:</strong> {data.considerations.timelineFeasibility}</li>
          <li><strong>Resource Optimization:</strong> {data.considerations.resourceOptimization}</li>
          <li><strong>Scalability:</strong> {data.considerations.scalability}</li>
          <li><strong>Stakeholder Management:</strong> {data.considerations.stakeholderManagement}</li>
          <li><strong>Risk Mitigation:</strong> {data.considerations.riskMitigation}</li>
        </ul>
      </SectionCard>

      {/* Resource Utilization */}
      {data.resourceUtilization && (
        <SectionCard title="Resource Utilization">
          <p><strong>Avg Hours/Day:</strong> {data.resourceUtilization.avgHoursPerDay}</p>
          <p><strong>Peak Utilization:</strong> {data.resourceUtilization.peakUtilization}</p>
          <p><strong>Buffer Days:</strong> {data.resourceUtilization.bufferDays}</p>
          <p><strong>Efficiency Target:</strong> {data.resourceUtilization.overallEfficiencyTarget}</p>

          <SectionTable headers={["Week", "PM", "Lead", "Interaction Designer", "Visual Designer", "Team Utilization"]}>
            {data.resourceUtilization.weeklyLoads?.map((w, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{w.week}</td>
                <td className="p-2">{w.pm}</td>
                <td className="p-2">{w.lead}</td>
                <td className="p-2">{w.interactionDesigner}</td>
                <td className="p-2">{w.visualDesigner}</td>
                <td className="p-2">{w.teamUtilization}</td>
              </tr>
            ))}
          </SectionTable>
        </SectionCard>
      )}

      {/* Assumptions */}
      {data.assumptions?.length > 0 && (
        <SectionCard title="Assumptions">
          <ul className="list-disc list-inside text-gray-700">
            {data.assumptions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Risks */}
      {data.risks?.length > 0 && (
        <SectionCard title="Risks">
          <ul className="list-disc list-inside text-gray-700">
            {data.risks.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
};

/* ----------------- Reusable Components ----------------- */
const OverviewCard = ({ title, value }) => (
  <div className="p-4 bg-white rounded-2xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="p-4 bg-white rounded-2xl shadow">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const SectionTable = ({ title, headers, children }) => (
  <div className="p-4 bg-white rounded-2xl shadow">
    {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100 text-left">
          {headers.map((h, i) => (
            <th key={i} className="p-2">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export default EstimationResults;
