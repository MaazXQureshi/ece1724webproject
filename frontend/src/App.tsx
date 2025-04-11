import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./routes/Home";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import LoginPage from "@/routes/LoginPage";
import EditUser from "@/routes/EditUser";
import EditOrganizer from "@/routes/EditOrganizer";
import CreateEvent from "@/routes/CreateEvent";
import EditEvent from "@/routes/EditEvent";
import UserRegistrations from "@/routes/UserRegistrations";
import RegisterUser from "@/routes/RegisterUser";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    // { path: "/profile" },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterUser /> },
    {
      path: "/user/edit/:id",
      element: <EditUser />,
    },
    {
      path: "/organizer/edit/:id",
      element: <EditOrganizer />,
    },
    {
      path: "/event/create",
      element: <CreateEvent />,
    },
    {
      path: "/event/edit/:id",
      element: <EditEvent />,
    },
    {
      path: "/user/:id/registrations/",
      element: <UserRegistrations />,
    },
  ]);

  return (
    <>
      <div className="flex min-h-screen min-w-screen flex-col">
        <RouterProvider router={router} />
        <Toaster />
      </div>
    </>
  );
}

export default App;
