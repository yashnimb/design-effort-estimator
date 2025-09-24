import React, { useState, useEffect } from "react";
import "./form.css";

const DesignEstimationForm = () => {
  const WEBHOOK_URL = "https://uxlad.app.n8n.cloud/webhook/f3e58583-27ea-4654-8cf3-862b4a468b04"; 

  const [formData, setFormData] = useState({
    projectName: "",
    platform: [],
    features: "",
    estimateScreens: false,
    uniqueEasy: 0,
    uniqueMedium: 0,
    uniqueComplex: 0,
    otherEasy: 0,
    otherMedium: 0,
    otherComplex: 0,
    screenCount: 0,
    domain: "",
    industry: "",
    phases: ["Discovery", "Wireframing", "UI Design"],
    branding: "No",
    accessibility: "No",
    multilingual: "No",
    timeline: "",
    notes: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const togglePlatformDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "platform") {
      setFormData((prev) => {
        const updated = checked
          ? [...prev.platform, value]
          : prev.platform.filter((p) => p !== value);
        return { ...prev, platform: updated };
      });
    } else if (type === "checkbox" && name === "phases") {
      setFormData((prev) => {
        const updated = checked
          ? [...prev.phases, value]
          : prev.phases.filter((p) => p !== value);
        return { ...prev, phases: updated };
      });
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      const numValue = Number(value) || 0;
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    const totalScreens =
      formData.uniqueEasy +
      formData.uniqueMedium +
      formData.uniqueComplex +
      formData.otherEasy +
      formData.otherMedium +
      formData.otherComplex;
    setFormData((prev) => ({ ...prev, screenCount: totalScreens }));
  }, [
    formData.uniqueEasy,
    formData.uniqueMedium,
    formData.uniqueComplex,
    formData.otherEasy,
    formData.otherMedium,
    formData.otherComplex,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log('Sending form data:', formData);
      
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const result = await response.text(); // Get as text first
        console.log('Raw n8n response:', result);
        
        // Store the raw response and redirect immediately
        sessionStorage.setItem("estimationData", result);
        window.location.href = '/estimation'; // Fixed: Changed from '/estimations' to '/estimation'
        
      } else {
        const errorText = await response.text();
        console.error('HTTP error:', response.status, errorText);
        setMessage(`Failed to get estimation: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      setMessage(`Network error: ${error.message}. Check if n8n webhook is running.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1>Design Estimation Form</h1>
        
        <label>Project Name *</label>
        <input
          type="text"
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
          placeholder="e.g., B2C Finance Loan Platform"
          required
        />

        <label>Platform</label>
        <div className="custom-dropdown">
          <div className="dropdown-header" onClick={togglePlatformDropdown}>
            <span>
              {formData.platform.length > 0
                ? formData.platform.join(", ")
                : "Select Platform"}
            </span>
            <span className="dropdown-arrow">▼</span>
          </div>
          {dropdownOpen && (
            <div className="dropdown-content">
              {["Responsive Website", "Android App", "iOS App", "All"].map((p) => (
                <label key={p}>
                  <input
                    type="checkbox"
                    name="platform"
                    value={p}
                    checked={formData.platform.includes(p)}
                    onChange={handleChange}
                  />{" "}
                  {p}
                </label>
              ))}
            </div>
          )}
        </div>

        <label>Key Features</label>
        <textarea
          name="features"
          value={formData.features}
          onChange={handleChange}
          rows="3"
          placeholder="Describe the main features..."
        />

        <label>
          <input
            type="checkbox"
            name="estimateScreens"
            checked={formData.estimateScreens}
            onChange={handleChange}
          />
          Auto Estimate Number of Screens
        </label>

        <div
          className={`screen-section ${
            formData.estimateScreens ? "disabled-section" : ""
          }`}
        >
          <h3>Screen Estimation</h3>
          <div className="complexity-breakdown">
            <strong>Unique Screens</strong>
            <label>Low:</label>
            <input
              type="number"
              name="uniqueEasy"
              min="0"
              value={formData.uniqueEasy}
              onChange={handleChange}
              disabled={formData.estimateScreens}
            />
            <label>Medium:</label>
            <input
              type="number"
              name="uniqueMedium"
              min="0"
              value={formData.uniqueMedium}
              onChange={handleChange}
              disabled={formData.estimateScreens}
            />
            <label>High:</label>
            <input
              type="number"
              name="uniqueComplex"
              min="0"
              value={formData.uniqueComplex}
              onChange={handleChange}
              disabled={formData.estimateScreens}
            />
          </div>

          <div className="complexity-breakdown">
            <strong>Other Screens</strong>
            <label>Low:</label>
            <input
              type="number"
              name="otherEasy"
              min="0"
              value={formData.otherEasy}
              onChange={handleChange}
              disabled={formData.estimateScreens}
            />
            <label>Medium:</label>
            <input
              type="number"
              name="otherMedium"
              min="0"
              value={formData.otherMedium}
              onChange={handleChange}
              disabled={formData.estimateScreens}
            />
            <label>High:</label>
            <input
              type="number"
              name="otherComplex"
              min="0"
              value={formData.otherComplex}
              onChange={handleChange}
              disabled={formData.estimateScreens}
            />
          </div>

          <label>Total Screens</label>
          <input
            type="number"
            value={formData.screenCount}
            readOnly
            disabled={formData.estimateScreens}
          />
        </div>

        <label>Domain</label>
        <input
          type="text"
          name="domain"
          value={formData.domain}
          onChange={handleChange}
          placeholder="e.g., B2B, B2C, D2C"
        />

        <label>Industry</label>
        <input
          type="text"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="e.g., Financial Services, Technology, Healthcare"
        />

        <label>Design Phases</label>
        <div className="checkbox-group">
          {["Discovery", "Wireframing", "UI Design", "Prototyping"].map((phase) => (
            <label key={phase}>
              <input
                type="checkbox"
                name="phases"
                value={phase}
                checked={formData.phases.includes(phase)}
                onChange={handleChange}
              />{" "}
              {phase}
            </label>
          ))}
        </div>

        <label>Branding Required?</label>
        <select
          name="branding"
          value={formData.branding}
          onChange={handleChange}
        >
          <option>No</option>
          <option>Yes</option>
        </select>

        <label>Accessibility Support?</label>
        <select
          name="accessibility"
          value={formData.accessibility}
          onChange={handleChange}
        >
          <option>No</option>
          <option>Yes</option>
        </select>

        <label>Multilingual Support?</label>
        <select
          name="multilingual"
          value={formData.multilingual}
          onChange={handleChange}
        >
          <option>No</option>
          <option>Yes</option>
        </select>

        <label>Expected Timeline (weeks)</label>
        <input
          type="number"
          name="timeline"
          min="1"
          max="52"
          value={formData.timeline}
          onChange={handleChange}
          placeholder="Enter number of weeks"
        />

        <label>Client Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Any additional notes or requirements..."
        />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Generate Estimation"}
        </button>
        
        {message && (
          <div className={`message ${message.includes('error') || message.includes('Failed') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default DesignEstimationForm;