import { useEffect } from "react";
import * as bootstrap from "bootstrap";
import useCrmContext from "../context/CrmContext";

const Toast = () => {
  const { toastMessage, hideToast } = useCrmContext();
  useEffect(() => {
    if (!toastMessage.visible) return;

    const el = document.getElementById("liveToast");
    const instance = bootstrap.Toast.getOrCreateInstance(el);

    const handleHidden = () => {
      hideToast();
    };

    el.addEventListener("hidden.bs.toast", handleHidden);
    instance.show();

    return () => {
      el.removeEventListener("hidden.bs.toast", handleHidden);
    };
  }, [toastMessage.visible, hideToast]);

  if (!toastMessage.message) return null;

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="liveToast" className="toast">
        <div className="toast-header">
          <strong className="me-auto">{toastMessage.title}</strong>
          <button type="button" className="btn-close" data-bs-dismiss="toast" />
        </div>
        <div className="toast-body">{toastMessage.message}</div>
      </div>
    </div>
  );
};

export default Toast;
