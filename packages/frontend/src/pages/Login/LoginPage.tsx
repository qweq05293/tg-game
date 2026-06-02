import { LoginError } from "./components/LoginError";
import { LoginLoading } from "./components/LoginLoading";
import { useLogin } from "./hooks/useLogin";

export default function LoginPage() {
  const { error, handleLogin } = useLogin();

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-6 antialiased">
      {/* Content Container */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center text-center">
        {!error && <LoginLoading />}
        {!!error && <LoginError onRetry={handleLogin} />}
      </div>
    </div>
  );
}
