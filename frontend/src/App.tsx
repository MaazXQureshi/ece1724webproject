import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './routes/Home';
import { Toaster } from "@/components/ui/sonner"
import './App.css'

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Home/> },
    { path: "/profile" }
  ]);

  return (
    <>

      <div className="flex min-h-screen min-w-screen flex-col">
        <RouterProvider router={ router }/>
        <Toaster/>
      </div>
    </>
  );
}

export default App;