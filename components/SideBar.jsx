import { NavLink } from "react-router-dom";
import { logout } from "../utils/logout";

const SideBar = ({ isOpen, onClose, user }) => {
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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

      <ul className="nav flex-column mt-3 gap-2 px-2 flex-grow-1">
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
          <a className="nav-link text-danger" onClick={logout}>
            Logout
          </a>
        </li>
      </ul>

      {/* Profile display */}
      <div className="sidebar-profile">
        <div className="sidebar-profile-avatar">{getInitials(user?.name)}</div>
        <div className="sidebar-profile-info">
          <span className="sidebar-profile-name">{user?.name || "User"}</span>
          <span className="sidebar-profile-role">{user?.role || "Admin"}</span>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
