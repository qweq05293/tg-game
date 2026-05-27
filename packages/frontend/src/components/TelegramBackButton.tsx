import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import WebApp from "@twa-dev/sdk";

export function TelegramBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/login") {
      WebApp.BackButton.show();
    } else {
      WebApp.BackButton.hide();
    }
  }, [location]);

  useEffect(() => {
    const handleBackClick = () => navigate(-1);
    WebApp.BackButton.onClick(handleBackClick);
    return () => {
      WebApp.BackButton.offClick(handleBackClick);
    };
  }, [navigate]);

  return null;
}
