import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // Clear storage and context state
      logout();
      toast.success("Logout Successful");
      navigate("/login");
    }
  };

  return handleLogout;
};