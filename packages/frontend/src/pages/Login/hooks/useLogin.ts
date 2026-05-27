import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { useAuthControllerLogin } from "../../../api/auth/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useHaptic } from "@/hooks/useHaptic";

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { notificationError, notificationSuccess } = useHaptic();

  const { mutate, data, isPending, error } = useAuthControllerLogin();

  // Wrap handleLogin in useCallback to maintain a stable reference
  const handleLogin = useCallback(() => {
    WebApp.ready();
    WebApp.expand();
    const initData = WebApp.initData;
    if (initData) {
      mutate({ data: { initData } });
    }
  }, [mutate]);

  // Automatic login on mount - handleLogin is now a safe dependency
  useEffect(() => {
    handleLogin();
  }, [handleLogin]);

  // Successful authorization
  useEffect(() => {
    if (data?.data) {
      notificationSuccess();
      setAuth(data.data.token, data.data.user);
      navigate("/", { replace: true });
    }
  }, [data, navigate, setAuth, notificationSuccess]);

  // Authorization error
  useEffect(() => {
    if (error) {
      notificationError();
    }
  }, [error, notificationError]);

  return {
    isPending,
    error,
    handleLogin,
  };
}
