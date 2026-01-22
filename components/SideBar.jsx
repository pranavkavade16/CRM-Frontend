import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <aside className="sidebar">
      <h5 className="brand">CRM Pro</h5>

      <ul className="nav flex-column mt-4 gap-2">
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
