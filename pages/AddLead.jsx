import BadgePill from "../components/BadgePill";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  STATUS_COLORS,
  PRIORITY_COLORS,
  SOURCE_COLORS,
} from "../utils/badgeMap";
import useCrmContext from "../context/CrmContext";

const AddLead = () => {
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "New",
    tags: [],
    timeToClose: "",
    priority: "Medium",
  });

  const [tagsInput, setTagsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    agentsData,
    agentsError,
    agentsLoading,
    setLeads,
    fetchLeads,
    showToast,
    toastMessage,
  } = useCrmContext();

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const commitTags = () => {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleAddLead = async () => {
    if (isSubmitting) return;

    const { name, source, salesAgent, tags, timeToClose } = formData;
    if (!name || !source || !salesAgent || !tags || !timeToClose) {
      showToast("Please fill all the required fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        "https://crm-backend-sqw3.vercel.app/leads",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const addedLead = await response.json();
      setLeads((prev) => [...prev, addedLead]);
      showToast("Lead added successfully");
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
      fetchLeads();
      navigate("/leads");
    }
  };

  const sourceData = [
    "Website",
    "Referral",
    "Cold Call",
    "Advertisement",
    "Email",
    "Other",
  ];
  const statusData = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Closed",
  ];
  const priorityData = ["High", "Medium", "Low"];

  if (agentsLoading) return <p>Loading...</p>;
  if (agentsError) return <p>Error loading data</p>;

  return (
    <div className="dashboard-wrapper">
      <h3>New lead</h3>
      <p className="text-muted">
        Add a new lead to your CRM and start tracking their progress.
      </p>
      <hr />

      {/* Lead Name */}
      <div className="m-2">
        <label className="form-label">
          <strong>Lead Name:</strong>
        </label>
        <div className="input-group mb-3 w-50 w-mobile-100">
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Lead Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Source */}
      <div className="m-2">
        <label className="form-label">
          <strong>Source:</strong>
        </label>
        <div role="radiogroup" className="pill-wrap">
          {sourceData.map((source) => (
            <label key={source} className="radio-pill">
              <input
                type="radio"
                name="source"
                value={source}
                checked={formData.source === source}
                onChange={handleChange}
              />
              <BadgePill
                text={source}
                color={SOURCE_COLORS[source]}
                className="badge-pill badge-soft"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Sales Agent */}
      <div className="m-2 mt-3">
        <label className="form-label">
          <strong>Sales Agent:</strong>
        </label>
        <select
          className="form-select w-50 w-mobile-100"
          name="salesAgent"
          value={formData.salesAgent}
          onChange={handleChange}
        >
          <option value="">Select Agent</option>
          {agentsData?.data?.map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div className="m-2">
        <label className="form-label">
          <strong>Status:</strong>
        </label>
        <div role="radiogroup" className="pill-wrap">
          {statusData.map((status) => (
            <label key={status} className="radio-pill">
              <input
                type="radio"
                name="status"
                value={status}
                checked={formData.status === status}
                onChange={handleChange}
              />
              <BadgePill
                text={status}
                color={STATUS_COLORS[status]}
                className="badge-pill badge-soft"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="m-2 mt-3">
        <label className="form-label">
          <strong>Tags:</strong>
        </label>
        <div className="input-group w-50 w-mobile-100">
          <input
            type="text"
            className="form-control"
            placeholder="Tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onBlur={commitTags}
          />
        </div>
      </div>

      {/* Time to close */}
      <div className="m-2 mt-3">
        <label className="form-label">
          <strong>Time to close:</strong>
        </label>
        <div className="input-group w-50 w-mobile-100">
          <input
            type="number"
            className="form-control"
            name="timeToClose"
            value={formData.timeToClose}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Priority */}
      <div className="m-2 mt-3">
        <label className="form-label">
          <strong>Priority:</strong>
        </label>
        <div role="radiogroup" className="pill-wrap">
          {priorityData.map((priority) => (
            <label key={priority} className="radio-pill">
              <input
                type="radio"
                name="priority"
                value={priority}
                checked={formData.priority === priority}
                onChange={handleChange}
              />
              <BadgePill
                text={priority}
                color={PRIORITY_COLORS[priority]}
                className="badge-pill badge-soft"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="m-2 mt-4">
        <button
          className="btn btn-primary"
          disabled={isSubmitting}
          onClick={handleAddLead}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default AddLead;
