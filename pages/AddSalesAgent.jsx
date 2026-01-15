import { useState } from "react";
const AddSalesAgent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(formData);

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

      const payload = { ...formData };

      const response = await fetch(
        "https://crm-backend-sqw3.vercel.app/agents",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        console.log("Failed to add sales agent.");
      }

      const addedSalesAgent = await response.json();

      console.log("Sales Agent added successfully", addedSalesAgent);
    } catch (error) {
      console.log("Error in adding the sales agent.", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="dashboard-wrapper">
      <h3>New Sales Aegnt</h3>
      <p className="text-muted">
        Create a new sales agent profile to start managing leads effectively.
      </p>
      <hr />
      <div>
        <label htmlFor="name" className="form-label ">
          <strong>Sales Agent Name:</strong>
        </label>
        <div class="input-group mb-3 w-50">
          <input
            type="text"
            class="form-control"
            name="name"
            placeholder="Sales Agent Name"
            aria-label="Sales Agent Name"
            value={formData.name}
            aria-describedby="basic-addon1"
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <label htmlFor="name" className="form-label ">
          <strong>Email:</strong>
        </label>
        <div class="input-group mb-3 w-50">
          <input
            type="text"
            class="form-control"
            name="email"
            placeholder="Email"
            aria-label="Email"
            value={formData.email}
            aria-describedby="basic-addon1"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mt-3">
        <button
          type="submit"
          className="btn btn-primary"
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
