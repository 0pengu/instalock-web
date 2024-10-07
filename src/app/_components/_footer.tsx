import { ActionIcon } from "@mantine/core";
import { FaGithub } from "react-icons/fa6";
import { Link } from "react-router-dom";

const links = [{ link: "/privacy", label: "Privacy" }];

export function Footer() {
  const items = links.map((link) => (
    <Link
      key={link.label}
      to={link.link}
      className="text-gray-400 hover:underline text-sm"
    >
      {link.label}
    </Link>
  ));

  return (
    <div className="mt-28 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center py-4 px-4 md:px-6 lg:px-8">
        {/* <img src="/logo.png" alt="logo" className="w-12 h-12" /> */}
        <div className="text-2xl">Instalock</div>
        <div className="flex space-x-4">{items}</div>
        <div className="flex space-x-2 justify-end">
          <Link to="https://github.com/0pengu/instalock-web">
            <ActionIcon size="lg" variant="default" radius="xl">
              <FaGithub className="w-4.5 h-4.5" />
            </ActionIcon>
          </Link>
        </div>
      </div>
    </div>
  );
}
