import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

import { User } from "@/models/user.model.ts";
import { Organizer } from "@/models/organizer.model.ts";
import { Tag } from "@/models/tag.model.ts";

interface AuthContextType {
  user: User | null;
  loading: Boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  registerUser: (
    email: string,
    username: string,
    password: string,
    isAdmin: boolean,
    organizerData?: Organizer | undefined,
    tagIds?: number[]
  ) => Promise<{ success: boolean; message: string }>;
  updateUserAndOrganizer: (
    userData: User,
    organizerData?: Organizer,
    tagIds?: number[]
  ) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   axios
  //     .get("/api/user/profile", { withCredentials: true })
  //     .then((response) => setUser(response.data.user))
  //     .catch(() => setUser(null));
  // }, []);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        console.log("Attempting to get profile");
        const response = await axios.get("/api/user/profile", {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        setUser(response.data); // If authenticated, set user data
        console.log("Authenticated user info:");
        console.log(response.data);
      } catch (error) {
        console.log("User is not authenticated");
        setUser(null); // If not authenticated, set user to null
      } finally {
        setLoading(false);
      }
    };

    checkUserAuthentication();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await axios.post(
        "/api/user/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.status !== 200) {
        throw new Error("Login failed");
      }
      console.log("Successfully logged in");
      console.log(res.data);
      setUser(res.data.user);
      return { success: true };
    } catch (error: any) {
      console.log("AuthContext login failure");
      console.error(error);
      if (error.response) {
        return {
          success: false,
          message: error.response.data.error || "Login failed",
        };
      }
      return {
        success: false,
        message: "An error occurred during login.",
      };
    }
  };

  const logout = async () => {
    await axios.post("/api/user/logout", { withCredentials: true });
    setUser(null);
  };

  const registerUser = async (
    email: string,
    username: string,
    password: string,
    isAdmin: boolean,
    organizerData?: Organizer,
    tagIds?: number[]
  ) => {
    try {
      const res = await axios.post("/api/user/register", {
        email,
        username,
        password,
        admin: isAdmin,
        organizerData,
        tagIds,
      });

      if (res.status !== 200) {
        throw new Error("Registration failed");
      }

      return { success: true, message: "Registration successful!" };
    } catch (error: any) {
      console.log("AuthContext registration failure");
      console.error(error);
      if (error.response) {
        return {
          success: false,
          message: error.response.data.error || "Registration failed",
        };
      }
      return {
        success: false,
        message: "An error occurred during registration.",
      };
    }
  };

  const updateUserAndOrganizer = async (
    userData: User,
    organizerData?: Organizer,
    tagIds?: number[]
  ) => {
    try {
      // First, update the user
      const userResponse = await axios.put(
        `/api/user/${userData.id}`,
        userData,
        { withCredentials: true }
      );

      if (userResponse.status !== 200) {
        throw new Error("User update failed");
      }

      // If user is an admin and organizer data is provided, update the organizer
      if (userData.admin && organizerData) {
        console.log("User is admin - updating organizer form");
        console.log("organizer data", organizerData);
        console.log("tag ids", tagIds);
        const organizerResponse = await axios.put(
          `/api/organizers/${organizerData.id}`,
          { ...organizerData, tagIds },
          { withCredentials: true }
        );

        if (organizerResponse.status !== 200) {
          throw new Error("Organizer update failed");
        }
      }

      console.log("User and Admin updated successfully");

      setUser(userResponse.data); // Update user state
      return {
        success: true,
        message: "User details updated successfully",
      };
    } catch (error: any) {
      if (error.response) {
        console.log("In updateUserOrganizer catch error");
        console.log(error.response);
        return {
          success: false,
          message: error.response.data.error || "Failed to update.",
        };
      }
      return { success: false, message: "An error occurred while updating." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        registerUser,
        updateUserAndOrganizer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
