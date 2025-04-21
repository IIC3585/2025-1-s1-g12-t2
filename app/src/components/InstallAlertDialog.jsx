import AlertDialogSlide from "./AlertDialogSlide";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

function InstallAlertDialog({ open, onClose }) {
  const title = "Do you want to install this app?";
  const contentText =
    "This app is a PWA and can be installed on your device for offline use.";
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        // Reload page
        window.location.reload();
      }
      setDeferredPrompt(null);
    }
    if (onClose) onClose();
  };
  const handleMaybeLater = () => {
    if (onClose) onClose();
  };
  let installButton = (
    <Button id="installButton" variant="contained" onClick={handleInstallClick}>
      Install
    </Button>
  );
  let maybeLaterButton = (
    <Button id="maybeLaterButton" variant="outlined" onClick={handleMaybeLater}>
      Maybe later
    </Button>
  );
  return (
    <AlertDialogSlide
      title={title}
      contentText={contentText}
      buttons={[maybeLaterButton, installButton]}
      open={open}
      onClose={onClose}
    />
  );
}
export default InstallAlertDialog;
