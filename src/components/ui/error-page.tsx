import { Button } from "@mantine/core";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="flex flex-col justify-center items-center py-20">
      <div className="text-gray-500 text-center font-black text-7xl mb-10">
        404
      </div>
      <h1 className="text-center font-black text-7xl md:text-6xl">
        Womp Womp.
      </h1>
      <p className="text-center text-gray-400 text-lg max-w-xl mt-6 mb-10">
        Unfortunately, this is only a 404 page. You may have mistyped the
        address, or the page has been moved to another URL.
      </p>
      <div className="flex justify-center">
        <Link to="/">
          <Button className="text-md" variant="subtle">
            Take me back to home page
          </Button>
        </Link>
      </div>
    </div>
  );
}
