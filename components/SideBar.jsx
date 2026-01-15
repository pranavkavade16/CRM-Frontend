const SideBar = () => {
  return (
    <div>
      <aside className="sidebar">
        <h5 className="brand">CRM Pro</h5>

        <ul className="nav flex-column mt-4 gap-2">
          <li className="nav-item">
            <a className="nav-link active" href="/">
              Dashboard
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/leads">
              Leads
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/status">
              Status
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/salesAgents">
              Sales Agents
            </a>
          </li>

          <li className="nav-item mt-auto">
            <a className="nav-link" href="/reports">
              Reports
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/settings">
              Settings
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link text-danger" href="#">
              Logout
            </a>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default SideBar;
