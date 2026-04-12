import FrontPage from "../pages/FrontPage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { CrmProvider } from "../context/CrmContext";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import "bootstrap-icons/font/bootstrap-icons.css";
import Leads from "../pages/Leads";
import SalesAgents from "../pages/SalesAgents";
import Status from "../pages/Status";
import NavBar from "../components/NavBar";
import AddLead from "../pages/AddLead";
import LeadManagement from "../pages/LeadManagement";
import AddSalesAgent from "../pages/AddSalesAgent";
import AgentDetails from "../pages/AgentDetails";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Toast from "../components/Toast";
import Login from "../pages/Login";
import SignUp from "../pages/Signup";
import { useState } from "react";
import {
  RequireAuth,
  RedirectIfAuthed,
  ProtectedLayout,
} from "../routes/routeGuards";

// App.jsx — move NavBar/SideBar into a layout component
function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <NavBar
        isSidebarOpen={isSidebarOpen}
        onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
      />
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Outlet /> ✅ protected page renders here
    </>
  );
}

function App() {
  return (
    <CrmProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RedirectIfAuthed />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              {" "}
              {/* ✅ layout wraps all protected routes */}
              <Route path="/" element={<FrontPage />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/salesAgents" element={<SalesAgents />} />
              <Route path="/status" element={<Status />} />
              <Route path="/addLead" element={<AddLead />} />
              <Route
                path="/leadManagement/:leadId"
                element={<LeadManagement />}
              />
              <Route path="/addSalesAgent" element={<AddSalesAgent />} />
              <Route
                path="/salesAgentDetails/:salesAgentId"
                element={<AgentDetails />}
              />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
        <Toast />
      </BrowserRouter>
    </CrmProvider>
  );
}
export default App;
