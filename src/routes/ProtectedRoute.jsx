import { Navigate, useLocation } from "react-router-dom";
import { useProfileQuery } from "../redux/apiSlices/authSlice";

// --- Decode JWT token ---
const parseJwt = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const allowedRoles = ["ADMIN", "SUPER_ADMIN"];

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  // Step 1 — Try reading role from JWT (no API hit)
  const tokenPayload = parseJwt();
  const tokenRole = tokenPayload?.role;

  // If token already has valid role, allow fast
  if (tokenRole && allowedRoles.includes(tokenRole)) {
    return children;
  }

  // Step 2 — Otherwise check profile from API
  const {
    data: profile,
    isLoading,
    isError,
  } = useProfileQuery(undefined, {
    skip: !localStorage.getItem("token"), // don't fetch if no token
  });

  console.log(profile)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If API failed → user not logged in
  if (isError) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If profile role matches allowed roles → allow
  if (profile?.role && allowedRoles.includes(profile.role)) {
    return children;
  }

  // Otherwise unauthorized
  return <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
