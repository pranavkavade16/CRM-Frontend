import useCrmContext from "../context/CrmContext";

import { Link } from "react-router-dom";
const SalesAgents = () => {
  const { agentsData, agentsError, agentsLoading } = useCrmContext();
  const { leadsData, leadsError, leadsLoading } = useCrmContext();

  if (leadsLoading || agentsLoading)
    return (
      <div className="dashboard-wrapper">
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <div className="spinner-border text-dark mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-dark fs-5">Loading...</p>
        </div>
      </div>
    );
  if (leadsError || agentsError)
    return (
      <div className="dashboard-wrapper">
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <p className="text-dark fs-5">Error: {leadsError || agentsError}</p>
        </div>
      </div>
    );
  if (leadsData.count === 0 || !agentsData)
    return (
      <div className="dashboard-wrapper">
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <p className="text-dark fs-5">No Data Available.</p>
        </div>
      </div>
    );

  return (
    <div className="dashboard-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3>Sales Agents</h3>
          <p className="text-muted">
            Manage your sales team and track performance.
          </p>
        </div>
        <Link className="btn btn-dark" to="/addSalesAgent">
          + Add Agent
        </Link>
      </div>
      <div>
        <div className="row g-4">
          {agentsData?.data?.map((agent, index) => (
            <div className="col-xl-4 col-lg-4 col-md-8">
              <div class="card">
                <div class="card-body">
                  <div className="d-flex">
                    <img
                      src={`https://placehold.co/50x50/000000/FFFFFF?text=${agent.name
                        .trim()
                        .split(" ")
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}`}
                      alt="agentName"
                      class="rounded-circle m-1 me-2"
                    />
                    <div className="mt-3 m-1 ">
                      <h5 class="card-title">{agent.name}</h5>
                    </div>
                  </div>
                  <div class="card-subtitle m-2 text-body-secondary">
                    <p>
                      <span className="me-2">
                        <i class="bi bi-envelope"></i>
                      </span>

                      {agent.email}
                    </p>
                    <p>
                      <span className="me-2">
                        <i class="bi bi-telephone"></i>
                      </span>
                      +1 (555) 111-2222
                    </p>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <p>Active Leads:</p>
                    <span
                      className="badge rounded-pill bg-secondary badge-soft mb-0"
                      style={{ padding: "0.5rem" }}
                    >
                      {
                        leadsData?.data?.filter(
                          (lead) =>
                            lead.salesAgent._id === agent._id &&
                            lead.status != "Closed"
                        ).length
                      }
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <p>Closed Leads:</p>
                    <span
                      className="badge rounded-pill bg-secondary badge-soft mb-0"
                      style={{ padding: "0.5rem" }}
                    >
                      {
                        leadsData?.data?.filter(
                          (lead) =>
                            lead.salesAgent._id === agent._id &&
                            lead.status === "Closed"
                        ).length
                      }
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <p>Conversion Rate:</p>
                    <span
                      className="badge rounded-pill bg-success mb-0"
                      style={{ padding: "0.5rem" }}
                    >
                      {Math.round(
                        (leadsData?.data?.filter(
                          (lead) =>
                            lead.salesAgent._id === agent._id &&
                            lead.status === "Closed"
                        ).length /
                          leadsData?.data?.filter(
                            (lead) => lead.salesAgent._id === agent._id
                          ).length) *
                          100
                      )}{" "}
                      %
                    </span>
                  </div>
                </div>
                <Link
                  className="btn btn-dark rounded-3 px-3 m-3"
                  to={`/salesAgentDetails/${agent._id}`}
                >
                  <i class="bi bi-file-earmark-text"></i> View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SalesAgents;
