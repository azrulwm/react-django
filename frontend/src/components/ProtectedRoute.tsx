import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constant";
import { ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      auth();
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  }, []);

  const refreshToken = async () => {
    const refreshToken = Cookies.get(REFRESH_TOKEN);
    try {
      const response = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });

      const expirationTime = new Date(new Date().getTime() + 30 * 60 * 1000);

      if (response.status === 200) {
        Cookies.set(ACCESS_TOKEN, response.data.access, {
          expires: expirationTime,
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = Cookies.get(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration && tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
