import useFetch from "../customHooks/useFetch";
import { createContext, useContext, useEffect, useState } from "react";

const CrmContext = createContext();

const useCrmContext = () => useContext(CrmContext);

export default useCrmContext;

export function CrmProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [toastMessage, setToastMessage] = useState({
    visible: false,
    message: "",
    title: "Notification",
    id: 0,
  });

  const {
    data: leadsData,
    loading: leadsLoading,
    error: leadsError,
    fetchData: fetchLeads,
  } = useFetch("https://crm-backend-sqw3.vercel.app/leads");

  const {
    data: agentsData,
    loading: agentsLoading,
    error: agentsError,
    fetchData: fetchAgents,
  } = useFetch("https://crm-backend-sqw3.vercel.app/agents");

  const {
    data: commentData,
    loading: commentLoading,
    error: commentError,
    fetchData: fetchComments,
  } = useFetch("https://crm-backend-sqw3.vercel.app/agents/:leadId/comments");

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const showToast = (message, title = "Notification") => {
    setToastMessage({ visible: true, message, title, id: Date.now() });
  };

  const hideToast = () => {
    setToastMessage((prev) => ({ ...prev, visible: false }));
  };

  return (
    <CrmContext.Provider
      value={{
        leadsData,
        leadsError,
        leadsLoading,
        fetchLeads,

        leads,
        setLeads,

        agentsData,
        agentsError,
        agentsLoading,
        fetchAgents,

        commentData,
        commentError,
        commentLoading,
        fetchComments,

        toastMessage,
        setToastMessage,
        hideToast,
        showToast,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
}
