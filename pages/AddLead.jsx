import BadgePill from "../components/BadgePill";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  STATUS_COLORS,
  PRIORITY_COLORS,
  SOURCE_COLORS,
} from "../utils/badgeMap";
import useCrmContext from "../context/CRMContext";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    agentsData,
    agentsError,
    agentsLoading,
    leads,
    setLeads,
    fetchLeads,
  } = useCrmContext();
  console.log(leads);

  console.log(formData);

  const navigate = useNavigate();

  // useEffect(() => {
  //   setFormData({
  //     name: "",
  //     source: "",
  //     salesAgent: "",
  //     status: "New",
  //     tags: [],
  //     timeToClose: "",
  //     priority: "Medium",
  //   });
  // }, [toggleEdit, activeLead]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [tagsInput, setTagsInput] = useState("");
  console.log(tagsInput);

  const commitTags = () => {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleAddLead = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);

      const { name, source, salesAgent, tags, timeToClose } = formData;

      if (!name || !source || !salesAgent || !tags || !timeToClose) {
        alert("Please fill all the required fields.");
        setIsSubmitting(false);
        return;
      }

      const payload = { ...formData };

      const response = await fetch(
        "https://crm-backend-sqw3.vercel.app/leads",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        console.log("Failed to add the lead.");
      }

      const addedLead = await response.json();

      setLeads((prev) => [...prev, addedLead]);
      console.log("lead added sucessfully", addedLead);
    } catch (error) {
      console.log("Error adding the lead", error.message);
    } finally {
      setIsSubmitting(false);
      fetchLeads();
      setTimeout(() => {
        navigate("/leads");
      }, 1000);
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
  if (!agentsData) return <p>No leads found</p>;
  return (
    <div className="dashboard-wrapper">
      <h3>New lead</h3>
      <p className="text-muted">
        Add a new lead to your CRM and start tracking their progress.
      </p>
      <hr />
      <div className="m-2">
        <label htmlFor="name" className="form-label ">
          <strong>Lead Name:</strong>
        </label>
        <div class="input-group mb-3 w-50">
          <input
            type="text"
            class="form-control"
            name="name"
            placeholder="Lead Name"
            aria-label="Lead Name"
            value={formData.name}
            aria-describedby="basic-addon1"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="m-2">
        <label htmlFor="source" className="form-label ">
          <strong>Source:</strong>
        </label>
        <div role="radiogroup" aria-label="Source">
          {sourceData.map((source) => {
            const isSelected = formData.source === source;
            return (
              <label key={source} className="radio-pill">
                <input
                  type="radio"
                  name="source"
                  value={source}
                  checked={isSelected}
                  onChange={handleChange}
                />
                <BadgePill
                  text={source}
                  color={SOURCE_COLORS[source]}
                  className="badge-pill badge-soft"
                />
              </label>
            );
          })}
        </div>
      </div>
      <div className="m-2 mt-3">
        <label htmlFor="salesAgent" className="form-label ">
          <strong>Sales Agent:</strong>
        </label>
        <select
          class="form-select w-50"
          aria-label="Default select example"
          name="salesAgent"
          value={formData.salesAgent}
          onChange={handleChange}
        >
          {agentsData?.data?.map((agent) => (
            <option value={agent._id}>{agent.name}</option>
          ))}
        </select>
      </div>
      <div className="m-2">
        <label htmlFor="status" className="form-label ">
          <strong>Status:</strong>
        </label>
        <div role="radiogroup" aria-label="Status">
          {statusData.map((status) => {
            const isSelected = formData.status === status;
            return (
              <label key={status} className="radio-pill">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={isSelected}
                  onChange={handleChange}
                />
                <BadgePill
                  text={status}
                  color={STATUS_COLORS[status]}
                  className="badge-pill badge-soft"
                />
              </label>
            );
          })}
        </div>
        <div className="mt-3">
          <label htmlFor="tags" className="form-label ">
            <strong>Tags:</strong>
          </label>
          <div class="input-group w-50">
            <input
              type="text"
              class="form-control"
              placeholder="Tags"
              aria-label="Tags"
              aria-describedby="basic-addon1"
              name="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onBlur={commitTags}
            />
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor="timeToClose" className="form-label ">
            <strong>Time to close:</strong>
          </label>
          <div class="input-group mb-3 w-50">
            <input
              type="number"
              class="form-control"
              placeholder="Days"
              aria-label="Days"
              aria-describedby="basic-addon1"
              name="timeToClose"
              value={formData.timeToClose}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor="priority" className="form-label ">
            <strong>Priority:</strong>
          </label>
          <div role="radiogroup" aria-label="Priority">
            {priorityData.map((priority) => {
              const isSelected = formData.priority === priority;
              return (
                <label key={priority} className="radio-pill">
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={isSelected}
                    onChange={handleChange}
                  />
                  <BadgePill
                    text={priority}
                    color={PRIORITY_COLORS[priority]}
                    className="badge-pill badge-soft"
                  />
                </label>
              );
            })}
          </div>
        </div>
        <div className="mt-3">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            onClick={handleAddLead}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLead;
