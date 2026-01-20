import useCrmContext from "../context/CrmContext";
import useFilter from "../customHooks/useFilter";
import useSort from "../customHooks/useSort";
import useSearch from "../customHooks/useSearch";
import BadgePill from "../components/BadgePill";

import {
  STATUS_COLORS,
  PRIORITY_COLORS,
  SOURCE_COLORS,
} from "../utils/badgeMap";
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import useLocalFilter from "../customHooks/useLocalFilter";

const Settings = () => {
  const [page, setPage] = useState(1);
  const { leadsData, leadsError, leadsLoading, fetchLeads } = useCrmContext();
  const { agentsData, agentsError, agentsLoading, fetchAgents } =
    useCrmContext();
  console.log(agentsData);

  const { searchedLeads, setSearch, searchedAgents } = useSearch(
    leadsData?.data,
    agentsData?.data
  );
  const { filteredData, updateFilter } = useLocalFilter(searchedLeads);
  const { sortedLeads, setSortBy } = useSort(filteredData);

  const pageSize = 10;
  const totalPages = Math.ceil(leadsData?.data?.length / pageSize);

  const slicedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedLeads.slice(start, start + pageSize);
  }, [sortedLeads, page]);

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  useEffect(() => {
    setPage(1);
  }, [searchedLeads, filteredData, sortedLeads]);

  const agentStats = useMemo(() => {
    if (!leadsData?.data) return {};

    return leadsData.data.reduce((acc, lead) => {
      const name = lead.salesAgent.name;

      if (!acc[name]) {
        acc[name] = {
          total: 0,
          active: 0,
          closed: 0,
        };
      }

      acc[name].total += 1;

      if (lead.status === "Closed") {
        acc[name].closed += 1;
      } else {
        acc[name].active += 1;
      }

      return acc;
    }, {});
  }, [leadsData?.data]);

  const handleDeleteAgent = async (agentId) => {
    try {
      const response = await fetch(
        `https://crm-backend-sqw3.vercel.app/salesAgent/delete/${agentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw "Failed to delete the sales agent.";
      }

      const deletedSalesAgent = await response.json();
      console.log("Sales agent deleted successfully.");
    } catch (error) {
      console.log("Failed to delete the sales agent", error.message);
    } finally {
      fetchAgents();
    }
  };

  const handleDeleteLead = async (leadId) => {
    try {
      //   setIsSubmitting(true);
      const response = await fetch(
        `https://crm-backend-sqw3.vercel.app/leads/${leadId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw "Failed to delete the lead";
      }

      const deletedLead = await response.json();
      console.log("Lead deleted successfully.", deletedLead);
    } catch (error) {
      console.log("Error in deleting the lead.", error.message);
    } finally {
      //   setIsSubmitting(false);
      fetchLeads();
    }
  };

  if (leadsLoading || agentsLoading) return <p>Loading...</p>;
  if (leadsError || agentsError) return <p>Error loading data</p>;
  if (leadsData.count === 0) return <p>No leads found</p>;
  return (
    <div className="dashboard-wrapper">
      <h3>Settings </h3>
      <p className="text-muted">
        Manage and delete leads or sales agents directly from this CRM settings
        page.
      </p>
      <div>
        <div class="card w-100 mb-3 mt-3">
          <div class="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Sales Agent</h5>
              <Link className="btn btn-dark rounded-3 px-3" to="/addSalesAgent">
                + Add Sales Agent
              </Link>
            </div>
            <div className="d-flex justify-content-between align-items-center gap-3 mb-4 ">
              <div className="input-group ">
                <span className="input-group-text bg-light">🔍</span>
                <input
                  type="text"
                  className="form-control bg-light"
                  placeholder="Search sales agents"
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>
            <div>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Total Leads</th>
                    <th scope="col">Active Leads</th>
                    <th scope="col">Closed Leads</th>
                    <th scope="col">Conversion Rate</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {searchedAgents?.map((agent) => {
                    const stats = agentStats[agent.name] || {
                      total: 0,
                      active: 0,
                      closed: 0,
                    };

                    const conversionRate =
                      stats.total === 0
                        ? "0%"
                        : `${Math.round((stats.closed / stats.total) * 100)}%`;

                    return (
                      <tr key={agent._id}>
                        <td>{agent.name}</td>
                        <td>{stats.total}</td>
                        <td>{stats.active}</td>
                        <td>{stats.closed}</td>
                        <td>{conversionRate}</td>
                        <td>
                          <Link
                            className="btn btn-outline-dark btn-sm"
                            to={`/salesAgentDetails/${agent._id}`}
                          >
                            View Details
                          </Link>
                          <Link
                            className="btn btn-outline-dark btn-sm ms-2"
                            onClick={() => handleDeleteAgent(agent._id)}
                          >
                            Delete
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="card w-100 mb-3 mt-3">
          <div class="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Leads</h5>
              <Link className="btn btn-dark rounded-3 px-3" to="/addLead">
                + Add Lead
              </Link>
            </div>
            <div className="d-flex justify-content-between align-items-center gap-3 mb-4 ">
              <div className="input-group ">
                <span className="input-group-text bg-light">🔍</span>
                <input
                  type="text"
                  className="form-control bg-light"
                  placeholder="Search leads..."
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <select
                className="form-select bg-light "
                onChange={(event) =>
                  updateFilter({ status: event.target.value })
                }
              >
                <option value="">Filter by Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Closed">Closed</option>
              </select>

              <select
                className="form-select bg-light"
                onChange={(event) =>
                  updateFilter({ priority: event.target.value })
                }
              >
                <option value="">Filter by Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                className="form-select bg-light"
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="null">Sort by</option>
                <option value="priorityHigh">Priority - high to low</option>
                <option value="priorityLow">Priority - low to high</option>
                <option value="timeHigh">Time to close - high to low</option>
                <option value="timeLow">Time to close - low to high</option>
              </select>
            </div>
            <div>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Lead Name</th>
                    <th scope="col">Source</th>
                    <th scope="col">Agent</th>
                    <th scope="col">Status</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Time to close</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {slicedData.map((lead, index) => (
                    <>
                      <tr>
                        <td className="truncate">{lead.name.slice(0, 25)}</td>
                        <td>
                          <BadgePill
                            text={lead.source}
                            color={SOURCE_COLORS[lead.source]}
                            className="badge-soft"
                          />
                        </td>
                        <td>{lead.salesAgent.name}</td>
                        <td>
                          <BadgePill
                            text={lead.status}
                            color={STATUS_COLORS[lead?.status]}
                            className="badge-soft-lg"
                          />
                        </td>
                        <td>
                          <BadgePill
                            text={lead.priority}
                            color={PRIORITY_COLORS[lead.priority]}
                            className="badge-soft"
                          />
                        </td>
                        <td>{lead.timeToClose} Days</td>
                        <td>
                          <Link
                            className="btn btn-outline-dark btn-sm"
                            to={`/leadManagement/${lead._id}`}
                          >
                            Edit
                          </Link>
                          <button
                            className="btn btn-outline-dark btn-sm ms-2"
                            onClick={() => handleDeleteLead(lead._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            <nav aria-label="Pagination">
              <ul className="pagination pagination-sm">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => goTo(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                </li>

                {[page - 1, page, page + 1]
                  .filter((p) => p >= 1 && p <= totalPages)
                  .map((p) => (
                    <li
                      key={p}
                      className={`page-item ${p === page ? "active" : ""}`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => goTo(p)}
                        aria-current={p === page ? "page" : undefined}
                      >
                        {p}
                      </button>
                    </li>
                  ))}

                <li
                  className={`page-item ${
                    page === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => goTo(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>

            <div className="text-muted small">
              Showing {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, sortedLeads.length)} of{" "}
              {sortedLeads.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
