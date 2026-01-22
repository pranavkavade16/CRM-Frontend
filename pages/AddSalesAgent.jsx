import { useState } from "react";
import useCrmContext from "../context/CrmContext";

const AddSalesAgent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useCrmContext;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSalesAgent = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const { name, email } = formData;

      if (!name || !email) {
        alert("Please fill all the required fields.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(
        "https://crm-backend-sqw3.vercel.app/agents",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const addedSalesAgent = await response.json();
      console.log("Sales agent added successfully.", addedSalesAgent);
      showToast("Sales agent added successfully");
    } catch (error) {
      console.log("Error in adding the sales agent.", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <h3>New Sales Agent</h3>
      <p className="text-muted">
        Create a new sales agent profile to start managing leads effectively.
      </p>
      <hr />

      {/* Name */}
      <div>
        <label className="form-label">
          <strong>Sales Agent Name:</strong>
        </label>
        <div className="input-group mb-3 w-50 w-mobile-100">
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Sales Agent Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="form-label">
          <strong>Email:</strong>
        </label>
        <div className="input-group mb-3 w-50 w-mobile-100">
          <input
            type="text"
            className="form-control"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="mt-3">
        <button
          type="submit"
          className="btn btn-dark"
          disabled={isSubmitting}
          onClick={handleAddSalesAgent}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default AddSalesAgent;
