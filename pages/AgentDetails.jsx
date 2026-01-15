import { useParams } from "react-router-dom";
import useCrmContext from "../context/CrmContext";
import LeadsComponent from "../components/LeadsComponent";
const AgentDetails = () => {
  const { salesAgentId } = useParams();

  const {
    agentsData,
    agentsError,
    agentsLoading,

    leadsData,
    leadsError,
    leadsLoading,
  } = useCrmContext();

  console.log(leadsData);

  const salesAgent = agentsData?.data?.find(
    (agent) => agent._id === salesAgentId
  );

  const leadsByAgent = leadsData?.data?.filter(
    (lead) => lead.salesAgent._id === salesAgentId
  );
  console.log(leadsByAgent);

  if (agentsLoading) return <p>Loading...</p>;
  if (agentsError) return <p>Error loading data</p>;
  if (agentsData?.data?.length === 0) return <p>No leads found</p>;

  return (
    <div className="dashboard-wrapper">
      <h3>Sales Agent Details</h3>
      <p className="text-muted">
        View performance insights, active leads, and recent activity for this
        sales agent.
      </p>
      <hr />
      <h4 className="mt-4 mb-4">
        Sales Agent - <span className="text-danger">{salesAgent?.name}</span>
      </h4>
      <p>Total leads: {leadsByAgent?.length}</p>
      <p>
        Active leads:{" "}
        {leadsByAgent?.filter((lead) => lead.status != "Closed").length}
      </p>
      <p>
        Closed leads:{" "}
        {leadsByAgent?.filter((lead) => lead.status === "Closed").length}
      </p>
      <p>Conversion Rate: </p>
      <LeadsComponent leads={leadsByAgent} />
    </div>
  );
};
export default AgentDetails;
