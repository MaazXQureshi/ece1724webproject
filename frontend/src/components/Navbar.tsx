import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";

export const Navbar = () => {
  return (

    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link to={ "/" }>
            <h1 className="text-4xl tracking-tight">
              <span className="text-zinc-700">Volunteer</span>
              <span className="relative">
                  <span className="text-zinc-900">Connect</span>
                  <span className="absolute inset-x-0 bottom-0 h-1.5 bg-violet-300/30 -translate-y-1"></span>
                  <span className="absolute inset-x-0 bottom-0 h-1.5 bg-blue-300/30 -translate-y-1"></span>
                </span>
            </h1>
          </Link>
          {/*<nav className="flex items-center space-x-4 lg:space-x-6 mx-6">*/ }
          {/*  <Link to="/" className="text-base text-black font-medium  hover:text-primary">Events</Link>*/ }
          {/*  <Link to="/profile" className="text-base text-black font-medium  hover:text-primary">Profile</Link>*/ }
          {/*</nav>*/ }
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant={ "secondary" }>Log in</Button>
          <Button>Register</Button>
        </div>
      </div>
    </header>
  )
}
