import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import useCrmContext from "../context/CrmContext";

ChartJS.register(Tooltip, Legend, ArcElement);

const PieChartComponent = () => {
  const { leadsData, leadsError, leadsLoading } = useCrmContext();

  if (leadsLoading) return <p>Loading chart...</p>;
  if (leadsError) return <p>Failed to load leads.</p>;

  const leads = leadsData?.data ?? [];

  const closedLeads = leads.filter((lead) => lead.status === "Closed").length;
  const openLeads = leads.filter((lead) => lead.status !== "Closed").length;

  const pieChartData = {
    labels: ["Closed", "In Pipeline"],
    datasets: [
      {
        label: "CRM Data",
        data: [closedLeads, openLeads],
        backgroundColor: ["#22C55E", "#F59E0B"],
        borderColor: ["#16A34A", "#D97706"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { enabled: true },
    },
  };

  return (
    <div style={{ width: "320px", height: "320px" }}>
      <Pie options={options} data={pieChartData} />
    </div>
  );
};

export default PieChartComponent;
