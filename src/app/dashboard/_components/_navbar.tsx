import { Button } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Settings", path: "/settings" },
];

export default function Navbar() {
  const pathname = useLocation().pathname;
  return (
    <div className="flex flex-row justify-between items-center p-4 border-b-[1px] border-gray-700">
      <Link to="/">
        <img src="/logo.png" alt="Instalock" className="h-8" />
      </Link>
      <div className="flex flex-row space-x-4">
        {links.map((link) => (
          <Link to={link.path} key={link.path}>
            <div
              className={`${
                pathname === link.path
                  ? "text-white font-bold"
                  : "text-gray-400"
              } hover:text-white transition-all delay-75`}
            >
              {link.name}
            </div>
          </Link>
        ))}
      </div>
      <Link to="/logout">
        <Button variant="gradient" gradient={{ from: "red", to: "purple" }}>
          Logout
        </Button>
      </Link>
    </div>
  );
}
