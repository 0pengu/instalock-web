import { DownArrow } from "@/app/_components/down-arrow";
import { Features } from "@/app/_components/features";
import GradientTitle from "@/app/_components/gradient-title";
import InitialLandingPage from "@/app/_components/initial-landing";
import { Button } from "@mantine/core";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <>
      <DownArrow />
      <div className="flex flex-row min-h-screen justify-center items-center rounded-md">
        <InitialLandingPage>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="sm:text-4xl text-2xl font-bold text-white text-center"
          >
            Welcome to <GradientTitle />, the comprehensive Valorant companion.
          </motion.h1>
          <div className="flex flex-row justify-center items-center space-x-4">
            <Button className="my-4 transition-all bg-gradient-to-r from-deep-red-400 to-deep-red-700 bg-size-200 bg-pos-0 hover:bg-pos-100">
              Get Started
            </Button>
            <Link to="https://github.com/0pengu/instalock-web">
              <Button className="my-4 transition-all bg-gray-600 hover:bg-gray-700">
                GitHub
              </Button>
            </Link>
          </div>
        </InitialLandingPage>
      </div>
      <div className="flex flex-row min-h-screen justify-center items-center rounded-md">
        <Features />
      </div>
    </>
  );
}
