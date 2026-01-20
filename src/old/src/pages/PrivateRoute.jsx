import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  const { isLoading } = useUser(token); // 只為了 loading 狀態
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white text-18px">
        <div>Loading...</div>
      </main>
    );
  }

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/account/login" replace state={{ from: location }} />
  );
};

export default PrivateRoute;
