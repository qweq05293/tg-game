import { useHaptic } from "@/hooks/useHaptic";
import { sleep } from "@/lib/sleep";
import { useAuthStore } from "@/store/useAuthStore";
import WebApp from "@twa-dev/sdk";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthControllerLogin } from "../../../api/auth/auth";

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { notificationError, notificationSuccess } = useHaptic();

  const { mutate, data, error } = useAuthControllerLogin();

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
    (async () => {
      if (data) {
        notificationSuccess();
        setAuth(data.token, data.user);
        await sleep(1500);
        navigate("/", { replace: true });
      }
    })();
  }, [data, navigate, setAuth, notificationSuccess]);

  // Authorization error
  useEffect(() => {
    if (error) {
      notificationError();
    }
  }, [error, notificationError]);

  return {
    error,
    handleLogin,
  };
}
