import useFilter from "../customHooks/useFilter";
import useSort from "../customHooks/useSort";
import useSearch from "../customHooks/useSearch";
import BadgePill from "./BadgePill";
import { Link } from "react-router-dom";
import {
  STATUS_COLORS,
  PRIORITY_COLORS,
  SOURCE_COLORS,
} from "../utils/badgeMap";
import { useState, useMemo, useEffect } from "react";

const LeadsComponent = ({ leads, pageSize = 10 }) => {
  //   const [page, setPage] = useState(1);
  //   const { searchedLeads, setSearch } = useSearch(leads);
  const { updateFilter, filteredData, filteredError, filteredLoading } =
    useFilter();
  // const { setFilter, filteredLeads } = useFilter(searchedLeads);
  // const { sortedLeads, setSortBy } = useSort(filteredLeads);

  //   const totalPages = Math.ceil(leads?.length / pageSize);

  // const slicedData = useMemo(() => {
  //   const start = (page - 1) * pageSize;
  //   return sortedLeads.slice(start, start + pageSize);
  // }, [sortedLeads, page]);

  // const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  // useEffect(() => {
  //   setPage(1);
  // }, [searchedLeads, filteredLeads, sortedLeads]);

  if (filteredError) <p>{filteredError}</p>;
  if (filteredLoading) <p>Loading....</p>;
  if (!filteredData) return <p>No leads found</p>;

  return (
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
              onChange={(event) => updateFilter("status", event.target.value)}
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
              onChange={(event) => updateFilter("priority", event.target.value)}
            >
              <option value="">Filter by Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              className="form-select bg-light"
              onChange={(event) => {
                const value = event.target.value;

                const [sort, order] = value.split(":");
                updateFilter("sort", sort);
                updateFilter("order", order);
                console.log(sort);
                console.log(order);
              }}
            >
              <option value="">Sort by</option>
              <option value="priority:desc">Priority - high to low</option>
              <option value="priority:asc">Priority - low to high</option>
              <option value="timeToClose:desc">
                Time to close - high to low
              </option>
              <option value="timeToClose:asc">
                Time to close - low to high
              </option>
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
                {filteredData?.data?.map((lead, index) => (
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
                          className="btn btn-dark btn-sm"
                          to={`/leadManagement/${lead._id}`}
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* <nav aria-label="Pagination">
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
                className={`page-item ${page === totalPages ? "disabled" : ""}`}
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LeadsComponent;
