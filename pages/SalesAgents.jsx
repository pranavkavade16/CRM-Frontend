import useCrmContext from "../context/CrmContext";
import useUrl from "../customHooks/useUrl";
import { Link } from "react-router-dom";
const SalesAgents = () => {
  const { agentsData, agentsError, agentsLoading } = useCrmContext();
  const { leadsData, leadsError, leadsLoading } = useCrmContext();
  const { data, error, loading, fetchData, updateFilter } = useUrl(
    window.location.href
  );
  console.log("useUrl data", data);

  console.log("Agents", agentsData);

  if (leadsLoading || agentsLoading) return <p>Loading...</p>;
  if (leadsError || agentsError) return <p>Error loading data</p>;
  if (leadsData.count === 0) return <p>No leads found</p>;

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
                        .split()}`}
                      alt=""
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

                  <p>
                    Active Leads:{" "}
                    {
                      leadsData.data.filter(
                        (lead) => lead.salesAgent == agent._id
                      ).length
                    }
                  </p>
                  <p>
                    Closed Leads:
                    {/* {
                      leadsData?.data?.filter(
                        (lead) =>
                          lead.salesAgent._id === agent._id &&
                          lead.status === "Closed"
                      ).length
                    } */}
                  </p>
                  <p>Conversion Rate: </p>
                </div>
                <Link
                  className="btn btn-dark rounded-3 px-3 m-3"
                  to={`/salesAgentDetails/${agent._id}`}
                  onClick={() => updateFilter("salesAgent", agent._id)}
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
