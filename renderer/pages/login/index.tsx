import Auth from "@/src/components/auth/signin";
import LoadingProvider from "@/src/components/global/LoadingProvider";

export default function AuthPage() {
  return (
    <LoadingProvider>
      <Auth />
    </LoadingProvider>
  );
}
