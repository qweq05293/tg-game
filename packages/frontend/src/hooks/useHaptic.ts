import WebApp from "@twa-dev/sdk";

export function useHaptic() {
  const impactLight = () => {
    try {
      WebApp.HapticFeedback.impactOccurred("light");
    } catch (e) {
      console.error("Haptic feedback error:", e);
    }
  };
  const notificationSuccess = () => {
    try {
      WebApp.HapticFeedback.notificationOccurred("success");
    } catch (e) {
      console.error("Haptic feedback error:", e);
    }
  };
  const notificationError = () => {
    try {
      WebApp.HapticFeedback.notificationOccurred("error");
    } catch (e) {
      console.error("Haptic feedback error:", e);
    }
  };

  return { impactLight, notificationSuccess, notificationError };
}
