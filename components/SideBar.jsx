import { NavLink } from "react-router-dom";

const SideBar = ({ isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Header row inside sidebar */}
      <div className="d-flex align-items-center justify-content-between px-3 py-3">
        <h5 className="brand mb-0">CRM Pro</h5>

        {/* Close button (mobile only) */}
        <button
          className="btn p-0 border-0 bg-transparent d-md-none"
          onClick={onClose}
          aria-label="Close menu"
        >
          <i className="bi bi-x-lg fs-4 text-light"></i>
        </button>
      </div>

      <ul className="nav flex-column mt-3 gap-2 px-2">
        <li className="nav-item">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/leads"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Leads
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/status"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Status
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/salesAgents"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Sales Agents
          </NavLink>
        </li>

        <li className="nav-item mt-auto">
          <NavLink
            to="/reports"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Reports
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Settings
          </NavLink>
        </li>

        <li className="nav-item">
          <a className="nav-link text-danger" href="#">
            Logout
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default SideBar;
