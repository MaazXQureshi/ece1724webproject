import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./routes/Home";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import LoginPage from "@/routes/LoginPage";
import RegisterEdit from "./components/RegisterEdit";
import EditUser from "@/routes/EditUser";
import EditOrganizer from "@/routes/EditOrganizer";
import CreateEvent from "@/routes/CreateEvent";
import EditEvent from "@/routes/EditEvent";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    // { path: "/profile" },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterEdit isEditing={false} /> }, // TODO: Make own route
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
