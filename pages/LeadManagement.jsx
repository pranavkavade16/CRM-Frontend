import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import useFetch from "../customHooks/useFetch";
import useCrmContext from "../context/CrmContext";
import BadgePill from "../components/BadgePill";
import {
  STATUS_COLORS,
  PRIORITY_COLORS,
  SOURCE_COLORS,
} from "../utils/badgeMap";

const LeadManagement = () => {
  const [toggleEdit, setToggleEdit] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    priority: "",
    source: "",
    salesAgent: "",
    timeToClose: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");
  console.log(comment);

  console.log("formData", formData);

  const { leadId } = useParams();
  const {
    leadsData,
    leadsError,
    leadsLoading,
    fetchLeads,

    agentsData,
    agentsError,
    agentsLoading,

    showToast,
  } = useCrmContext();

  const activeLead = useMemo(() => {
    const data = leadsData?.data ? leadsData.data : [];
    return data.find((lead) => lead._id === leadId);
  }, [leadsData?.data, leadId]);

  const {
    data: commentData,
    loading: commentLoading,
    error: commentError,
    fetchData: fetchComments,
  } = useFetch(
    `https://crm-backend-sqw3.vercel.app/leads/${activeLead?._id}/comments`
  );
  useEffect(() => {
    if (activeLead?._id) {
      fetchComments();
    }
  }, [activeLead?._id, fetchComments]);

  const navigate = useNavigate();

  useEffect(() => {
    if (toggleEdit && activeLead) {
      setFormData({
        status: activeLead?.status || "",
        priority: activeLead?.priority || "",
        source: activeLead?.source || "",
        salesAgent: activeLead?.salesAgent?._id || "",
        timeToClose: String(activeLead?.timeToClose),
      });
    }
  }, [toggleEdit, activeLead]);

  const [newTags, setNewTags] = useState([]);
  const [tagsInput, setTagsInput] = useState("");
  console.log(tagsInput);

  const commitTags = () => {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (tags.length === 0) return;
    setNewTags((prev) =>
      Array.isArray(prev) ? [...prev, ...tags] : [...tags]
    );
    setTagsInput("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLeadEdit = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);

      const payload = {
        ...(Array.isArray(newTags) && newTags.length > 0
          ? { tags: newTags }
          : {}),
        ...formData,
      };

      const response = await fetch(
        `https://crm-backend-sqw3.vercel.app/leads/${activeLead?._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        console.log("Failed to update the lead.");
      }

      const updatedLead = await response.json();

      console.log("Lead is updated successfully", updatedLead);
      showToast("Lead is updated successfully");
    } catch (error) {
      console.log("Failed to updated the lead", error.message);
    } finally {
      setIsSubmitting(false);
      setToggleEdit(false);
      setNewTags([]);
      fetchLeads();
    }
  };

  const handleDeleteLead = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(
        `https://crm-backend-sqw3.vercel.app/leads/${activeLead?._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw "Failed to delete the lead";
      }

      const deletedLead = await response.json();
      console.log("Lead deleted successfully.", deletedLead);
      showToast("Lead deleted successfully.");

      setTimeout(() => {
        navigate("/leads");
      }, 1000);
    } catch (error) {
      console.log("Error in deleting the lead.", error.message);
    } finally {
      setIsSubmitting(false);
      fetchLeads();
    }
  };

  const handleAddComment = async () => {
    try {
      const payload = {
        lead: activeLead?._id,
        author: activeLead?.salesAgent?._id,
        commentText: comment,
      };
      const response = await fetch(
        `https://crm-backend-sqw3.vercel.app/leads/${activeLead?._id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw "Failed to add the comment";
      }

      const addedComment = await response.json();

      console.log("Comment added successfully", addedComment);

      setComment("");
      fetchComments();
    } catch (error) {
      console.log("Error adding the comment", error.message);
    }
  };
  const statusColor = STATUS_COLORS[activeLead?.status] || "secondary";
  const priorityColor = PRIORITY_COLORS[activeLead?.priority] || "secondary";
  const sourceColor = SOURCE_COLORS[activeLead?.source] || "secondary";

  const createdDate = new Date(activeLead?.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
  const updatedDate = new Date(activeLead?.updatedAt).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
  const closedDate =
    activeLead?.closedAt &&
    new Date(activeLead?.closedAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  if (leadsError || agentsError || commentError)
    return <p className="text-danger">{String(leadsError)}</p>;
  if (leadsLoading || agentsLoading || commentLoading) return <p>Loading…</p>;
  if (!leadsData?.count || agentsData?.data?.length === 0)
    return <p>No leads found</p>;
  if (!activeLead) return <p>Lead not found</p>;

  return (
    <div className="dashboard-wrapper">
      <div className="container-fluid p-0">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <div className="row">
              <div className="col">
                <h3 className="fw-bold">{activeLead?.name}</h3>
              </div>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <div className="row">
                <div className="col">
                  <BadgePill
                    text={activeLead?.status}
                    color={statusColor}
                    className="badge-soft-lg"
                  />
                </div>
                <div className="col">
                  <BadgePill
                    text={activeLead?.priority}
                    color={priorityColor}
                    className="badge-soft"
                  />
                </div>
              </div>
            </div>
            <p className="text-muted mt-3">
              <div className="d-flex align-items-start">
                <p>
                  <span>
                    <i class="bi bi-calendar"></i>
                  </span>
                  <span className="ms-2">Created</span>
                  <span className="ms-1">
                    {new Date(activeLead?.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                  <span className="ms-4">
                    <strong>
                      <i class="bi bi-person"></i>
                    </strong>
                  </span>
                  <span className="ms-2">
                    {activeLead?.salesAgent?.name || "Lead not assigned"}
                  </span>
                </p>
              </div>
            </p>
          </div>
          <div>
            {toggleEdit ? (
              <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
                <div>
                  <button
                    className="btn btn-light rounded-3 px-3"
                    onClick={() => setToggleEdit(!toggleEdit)}
                    style={{ border: "1px solid black" }}
                  >
                    <i class="bi bi-x-lg"></i> Cancel
                  </button>
                </div>
                <div>
                  <button
                    className="btn btn-dark rounded-3 px-3"
                    style={{ width: "165px" }}
                    onClick={handleLeadEdit}
                  >
                    <i class="bi bi-floppy me-1"></i>{" "}
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
                <div>
                  <button
                    className="btn btn-dark rounded-3 px-3"
                    onClick={() => setToggleEdit(!toggleEdit)}
                  >
                    <span>
                      <i class="bi bi-pencil"></i>
                    </span>
                    <span className="ms-1">Edit</span>
                  </button>
                </div>
                <div>
                  <button
                    className="btn btn-dark rounded-3 px-3"
                    onClick={handleDeleteLead}
                  >
                    <span>
                      <i class="bi bi-trash"></i>
                    </span>
                    <span className="ms-1">Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <nav>
          <div
            class="nav nav-underline flex-nowrap overflow-auto justify-content-center"
            id="nav-tab"
            role="tablist"
          >
            <button
              class="nav-link active"
              id="nav-home-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-home"
              type="button"
              role="tab"
              aria-controls="nav-home"
              aria-selected="true"
            >
              Details
            </button>
            <button
              class="nav-link"
              id="nav-profile-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-profile"
              type="button"
              role="tab"
              aria-controls="nav-profile"
              aria-selected="false"
            >
              Activity
            </button>
          </div>
        </nav>
        {/* Details tab */}
        <div class="tab-content mt-4 m-2" id="nav-tabContent">
          <div
            class="tab-pane fade show active"
            id="nav-home"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
            tabindex="0"
          >
            {toggleEdit ? (
              <div>
                <div className="row g-4">
                  <div className="col-12 col-lg-8">
                    <div class="card">
                      <div class="card-body">
                        <h5 className="fw-bold mt-2 mb-4">Lead Information</h5>
                        <div className="row">
                          <div className="col">
                            <h6>Status</h6>

                            <select
                              className="form-select bg-light "
                              name="status"
                              value={formData.status}
                              onChange={handleChange}
                            >
                              <option value="New">New</option>
                              <option value="Qualified">Qualified</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </div>
                          <div className="col">
                            <h6>Priority</h6>
                            <p>
                              <select
                                className="form-select bg-light"
                                value={formData.priority}
                                name="priority"
                                onChange={handleChange}
                              >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                              </select>
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col">
                            <h6>Source</h6>
                            <select
                              className="form-select bg-light "
                              name="source"
                              value={formData.source}
                              onChange={handleChange}
                            >
                              <option value="Website">Website</option>
                              <option value="Referral">Referral</option>
                              <option value="Cold Call">Cold Call</option>
                              <option value="Advertisement">
                                Advertisement
                              </option>
                              <option value="Email">Email</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="col">
                            <h6>Expected Close Time</h6>
                            <input
                              type="text"
                              class="form-control"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                              style={{ width: "80px" }}
                              placeholder="days"
                              name="timeToClose"
                              value={formData.timeToClose}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <hr />
                        <h6>Description</h6>
                        <p>
                          Enterprise client interested in our full suite of
                          products. Looking for annual contract with potential
                          for expansion into multiple departments.
                        </p>

                        <hr />
                        <h6>Tags</h6>
                        <div class="d-flex flex-wrap gap-2">
                          {[...activeLead?.tags, ...newTags].map((tag) => (
                            <span class="badge rounded-pill bg-light text-dark d-flex align-items-center px-3 py-2">
                              <i class="bi bi-tag me-2"></i> {tag}
                            </span>
                          ))}
                          <input
                            type="text"
                            class="form-control w-sm-auto"
                            aria-label="Sizing example input"
                            aria-describedby="inputGroup-sizing-default"
                            placeholder="Add a tag"
                            name="tags"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            onBlur={commitTags}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4">
                    <div class="card">
                      <div class="card-body">
                        <h5 className="fw-bold mt-2 mb-4">
                          Assigned Sales Agent
                        </h5>
                        <select
                          className="form-select bg-light mt-4"
                          name="salesAgent"
                          value={formData.salesAgent}
                          onChange={handleChange}
                        >
                          {agentsData?.data.map((agent) => (
                            <option key={agent?._id} value={agent?._id}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div class="card mt-4">
                      <div class="card-body">
                        <h5 className="fw-bold mb-4">Timeline</h5>

                        {/* Item 1 */}
                        <div className="d-flex align-items-start mb-4">
                          <span
                            className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                            style={{
                              width: "44px",
                              height: "44px",
                              backgroundColor: "#E8F0FF",
                            }}
                          >
                            <i
                              className="bi bi-calendar3 fs-5"
                              style={{ color: "#2563EB" }}
                            ></i>
                          </span>
                          <div>
                            <div className="fw-semibold h6 mb-1">Created</div>
                            <div className="text-secondary">{createdDate}</div>
                          </div>
                        </div>

                        {/* Item 2 */}
                        <div className="d-flex align-items-start mb-4">
                          <span
                            className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                            style={{
                              width: "44px",
                              height: "44px",
                              backgroundColor: "#F2E9FF",
                            }}
                          >
                            <i
                              className="bi bi-clock-history fs-5"
                              style={{ color: "#7C3AED" }}
                            ></i>
                          </span>
                          <div>
                            <div className="fw-semibold h6 mb-1">
                              Last Updated
                            </div>
                            <div className="text-secondary">{updatedDate}</div>
                          </div>
                        </div>

                        {/* Item 3 */}
                        <div className="d-flex align-items-start">
                          <span
                            className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                            style={{
                              width: "44px",
                              height: "44px",
                              backgroundColor: "#FFEEDF",
                            }}
                          >
                            <i
                              className="bi bi-graph-up fs-5"
                              style={{ color: "#F97316" }}
                            ></i>
                          </span>
                          <div>
                            <div className="fw-semibold h6 mb-1">
                              {activeLead?.status === "Closed"
                                ? "Closed"
                                : "Expected to close"}
                            </div>
                            <div className="text-secondary">
                              {activeLead?.status === "Closed"
                                ? `${closedDate}`
                                : `${activeLead?.timeToClose} days`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row g-4">
                <div className="col-12 col-lg-8">
                  <div class="card">
                    <div class="card-body">
                      <h5 className="fw-bold mt-2 mb-4">Lead Information</h5>
                      <div className="row">
                        <div className="col">
                          <h6>Status</h6>

                          <BadgePill
                            text={activeLead?.status}
                            color={statusColor}
                            className="badge-soft-lg"
                          />
                        </div>
                        <div className="col">
                          <h6>Priority</h6>
                          <p>
                            <BadgePill
                              text={activeLead?.priority}
                              color={priorityColor}
                              className="badge-soft"
                            />
                          </p>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col">
                          <h6>Source</h6>
                          <BadgePill
                            text={activeLead?.source}
                            color={sourceColor}
                            className="badge-soft"
                          />
                        </div>
                        <div className="col">
                          <h6>Expected Close Time</h6>
                          <p>
                            <span className="me-2">
                              <i class="bi bi-clock"></i>
                            </span>
                            {activeLead?.timeToClose} days
                          </p>
                        </div>
                      </div>

                      <hr />
                      <h6>Description</h6>
                      <p>
                        Enterprise client interested in our full suite of
                        products. Looking for annual contract with potential for
                        expansion into multiple departments.
                      </p>

                      <hr />
                      <h6>Tags</h6>
                      <div class="d-flex flex-wrap gap-2">
                        {[...activeLead?.tags, ...newTags].map((tag) => (
                          <span class="badge rounded-pill bg-light text-dark d-flex align-items-center px-3 py-2">
                            <i class="bi bi-tag me-2"></i> {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div class="card">
                    <div class="card-body">
                      <h5 className="fw-bold mt-2 mb-4">
                        Assigned Sales Agent
                      </h5>
                      <div className="d-flex flex-column flex-sm-row align-items-start gap-1">
                        <div className="">
                          <img
                            src={`https://placehold.co/60x60?text=${
                              activeLead?.salesAgent?.name.trim().split() || ""
                            }`}
                            alt=""
                            class="rounded-circle m-1 me-2"
                          />
                        </div>
                        <div className="">
                          <div className="mt-2 ms-2">
                            <h6>
                              {activeLead?.salesAgent?.name ||
                                "Lead not assigned"}
                            </h6>
                            <h6 className="text-muted">
                              {activeLead?.salesAgent?.email || ""}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card mt-4">
                    <div class="card-body">
                      <h5 className="fw-bold mt-2 mb-4">Timeline</h5>

                      {/* Item 1 */}
                      <div className="d-flex align-items-start mb-4">
                        <span
                          className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                          style={{
                            width: "44px",
                            height: "44px",
                            backgroundColor: "#E8F0FF",
                          }}
                        >
                          <i
                            className="bi bi-calendar3 fs-5"
                            style={{ color: "#2563EB" }}
                          ></i>
                        </span>
                        <div>
                          <div className="fw-semibold h6 mb-1">Created</div>
                          <div className="text-secondary">{createdDate}</div>
                        </div>
                      </div>

                      {/* Item 2 */}
                      <div className="d-flex align-items-start mb-4">
                        <span
                          className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                          style={{
                            width: "44px",
                            height: "44px",
                            backgroundColor: "#F2E9FF",
                          }}
                        >
                          <i
                            className="bi bi-clock-history fs-5"
                            style={{ color: "#7C3AED" }}
                          ></i>
                        </span>
                        <div>
                          <div className="fw-semibold h6 mb-1">
                            Last Updated
                          </div>
                          <div className="text-secondary">{updatedDate}</div>
                        </div>
                      </div>

                      {/* Item 3 */}
                      <div className="d-flex align-items-start">
                        <span
                          className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                          style={{
                            width: "44px",
                            height: "44px",
                            backgroundColor: "#FFEEDF",
                          }}
                        >
                          <i
                            className="bi bi-graph-up fs-5"
                            style={{ color: "#F97316" }}
                          ></i>
                        </span>
                        <div>
                          <div className="fw-semibold h6 mb-1">
                            {activeLead?.status === "Closed"
                              ? "Closed"
                              : "Expected to close"}
                          </div>
                          <div className="text-secondary">
                            {activeLead?.status === "Closed"
                              ? `${closedDate}`
                              : `${activeLead?.timeToClose} days`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Comment section */}
          <div
            class="tab-pane fade"
            id="nav-profile"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
            tabindex="0"
          >
            <div>
              <div class="card border col-12 col-lg-8 mx-auto rounded-4 p-2 bg-white">
                <div class="card-body m-2">
                  <h6 className="fw-bold text-dark">Add a new comment</h6>
                  <div className="row mt-4">
                    <div className="col-1">
                      <img
                        src={`https://placehold.co/24x24/000000/FFFFFF?text=${
                          activeLead?.salesAgent?.name.trim().split() || ""
                        }`}
                        alt="avatar"
                        className="rounded-circle ms-2"
                        style={{ width: 40, height: 40, objectFit: "cover" }}
                      />
                    </div>
                    <div className="col">
                      <div class="form-floating">
                        <textarea
                          class="form-control"
                          placeholder="Leave a comment here"
                          id="floatingTextarea2"
                          style={{ height: "80px", backgroundColor: "#f8f9fa" }}
                          value={comment}
                          onChange={(event) => setComment(event.target.value)}
                        ></textarea>
                        <label for="floatingTextarea2">
                          Add a comment, update, or note about this lead...
                        </label>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end align-items-center mt-3">
                      <button
                        className="btn btn-dark btn-sm rounded-3 px-3"
                        onClick={handleAddComment}
                      >
                        <i class="bi bi-send"></i>
                        <span className="ms-2">Add comment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {commentData?.map((comment) => (
                <div className="mt-3">
                  <div class="border col-12 col-lg-8 mx-auto rounded-4 p-4 bg-white">
                    <div class="d-flex flex-column flex-sm-row align-items-start gap-3">
                      <div>
                        <img
                          src={`https://placehold.co/24x24/000000/FFFFFF?text=${activeLead?.salesAgent.name
                            .trim()
                            .split()}`}
                          alt="avatar"
                          className="rounded-circle ms-2"
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                          }}
                        />
                      </div>

                      <div class="flex-grow-1">
                        <div class="d-flex flex-wrap align-items-center column-gap-2 row-gap-1">
                          <span class="fw-bold text-dark">
                            {comment.author.name}
                          </span>
                          <span class="text-secondary">Sales Agent</span>
                          <span class="text-secondary">·</span>
                          <span class="text-secondary">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        <p class="mt-2 mb-0 text-secondary lh-lg">
                          {comment.commentText}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadManagement;
