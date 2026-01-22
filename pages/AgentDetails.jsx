import { useParams } from "react-router-dom";
import useCrmContext from "../context/CrmContext";
import LeadsTable from "../components/LeadsTable";

const AgentDetails = () => {
  const { salesAgentId } = useParams();

  const { agentsData, agentsError, agentsLoading, leadsData } = useCrmContext();

  const salesAgent = agentsData?.data?.find(
    (agent) => agent._id === salesAgentId
  );

  const leadsByAgent = leadsData?.data?.filter(
    (lead) => lead.salesAgent._id === salesAgentId
  );

  const activeLeads = leadsByAgent?.filter(
    (lead) => lead.status !== "Closed"
  ).length;

  const closedLeads = leadsByAgent?.filter(
    (lead) => lead.status === "Closed"
  ).length;

  const totalLeads = activeLeads + closedLeads;
  const conversionRate = totalLeads
    ? Math.round((closedLeads / totalLeads) * 100)
    : 0;

  if (agentsLoading)
    return (
      <div className="dashboard-wrapper d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-dark" />
      </div>
    );

  if (agentsError)
    return (
      <div className="dashboard-wrapper text-center">
        <p>Error: {agentsError}</p>
      </div>
    );

  if (!agentsData)
    return (
      <div className="dashboard-wrapper text-center">
        <p>No Data Available.</p>
      </div>
    );

  return (
    <div className="dashboard-wrapper">
      <h3>Sales Agent Details</h3>
      <p className="text-muted">
        View performance insights, active leads, and recent activity for this
        sales agent.
      </p>
      <hr />

      <h4 className="mt-4 mb-4">
        Sales Agent – <span className="text-danger">{salesAgent?.name}</span>
      </h4>

      {/* Stats (responsive wrapper) */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        <h6 className="mb-0">
          Total leads:
          <span
            className="badge rounded-pill bg-secondary ms-2"
            style={{ padding: "0.5rem" }}
          >
            {totalLeads}
          </span>
        </h6>

        <h6 className="mb-0">
          Active leads:
          <span
            className="badge rounded-pill bg-secondary ms-2"
            style={{ padding: "0.5rem" }}
          >
            {activeLeads}
          </span>
        </h6>

        <h6 className="mb-0">
          Closed leads:
          <span
            className="badge rounded-pill bg-secondary ms-2"
            style={{ padding: "0.5rem" }}
          >
            {closedLeads}
          </span>
        </h6>

        <h6 className="mb-0">
          Conversion Rate:
          <span
            className="badge rounded-pill bg-success ms-2"
            style={{ padding: "0.5rem" }}
          >
            {conversionRate} %
          </span>
        </h6>
      </div>

      {/* Leads table (already responsive) */}
      <LeadsTable leads={leadsByAgent} />
    </div>
  );
};

export default AgentDetails;
