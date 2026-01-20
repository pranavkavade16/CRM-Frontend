import useCrmContext from '../context/CrmContext';

export const useLeadsData = () => {
  const { leadsData, leadsError, leadsLoading } = useCrmContext();

  const leads = leadsData?.data ?? [];

  const closedCountByAgent = leads
    .filter((lead) => lead.status === 'Closed')
    .reduce((acc, lead) => {
      const agentId = lead.salesAgent?._id;
      const agentName = lead.salesAgent?.name;

      if (!acc[agentId]) {
        acc[agentId] = { agentId, agentName, closedCount: 0 };
      }

      acc[agentId].closedCount += 1;
      return acc;
    }, {});

  const labels = Object.values(closedCountByAgent).map(
    (item) => item.agentName
  );
  const values = Object.values(closedCountByAgent).map(
    (item) => item.closedCount
  );

  const leadsByStatus = leads.reduce((acc, lead) => {
    const leadStatus = lead.status;

    if (!acc[leadStatus]) {
      acc[leadStatus] = { leadStatus, statusCount: 0 };
    }

    acc[leadStatus].statusCount += 1;
    return acc;
  }, {});

  console.log('leads by status', leadsByStatus);

  const labelsOfLeadsData = Object.values(leadsByStatus).map(
    (item) => item.leadStatus
  );

  const valesOfLeadsData = Object.values(leadsByStatus).map(
    (item) => item.statusCount
  );

  const closedLeadsPerSalesAgent = {
    labels,
    datasets: [
      {
        label: 'Closed Leads',
        data: values,
        backgroundColor: '#22C55E',
        borderColor: '#16A34A',
        borderWidth: 1,
      },
    ],
  };

  const colour = {
    contacted: '#0dcaf0',
    qualified: '#198754',
    'Proposal Sent': '#ffc107',
    closed: '#6c757d',
    new: '#0d6efd',
  };

  const leadsDataByStatus = {
    labels: labelsOfLeadsData,
    datasets: [
      {
        label: 'Lead Status Distribution',
        data: valesOfLeadsData,
        backgroundColor: '#0047AB',
      },
    ],
  };

  return { closedLeadsPerSalesAgent, leadsDataByStatus };
};

export default useLeadsData;
