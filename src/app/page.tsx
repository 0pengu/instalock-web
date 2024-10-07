import { DownArrow } from "@/components/ui/down-arrow";
import { Features } from "@/app/_components/_features";
import { Footer } from "@/app/_components/_footer";
import GradientTitle from "@/app/_components/_gradient-title";
import InitialLandingPage from "@/app/_components/_initial-landing";
import { motion } from "framer-motion";
import GetStartedButton from "@/components/ui/get-started-button";
import GithubButton from "@/components/ui/github-button";

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
            className="sm:text-5xl text-2xl font-bold text-white text-center"
          >
            Welcome to <GradientTitle />, the comprehensive Valorant companion.
          </motion.h1>
          <div className="flex flex-row justify-center items-center space-x-4">
            <GetStartedButton to="/login" />
            {/* {data && !isLoading && !isError ? (
              <Link to="/dashboard">
                <Button
                  size="xl"
                  variant="gradient"
                  gradient={{ from: "purple", to: "red" }}
                  className="my-4"
                >
                  Welcome back, {data.username}
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  size="xl"
                  variant="gradient"
                  gradient={{ from: "purple", to: "red" }}
                  className="my-4"
                >
                  Get Started
                </Button>
              </Link>
            )} */}
            <GithubButton to="https://github.com/0pengu/instalock-web" />
          </div>
        </InitialLandingPage>
      </div>
      <div className="flex flex-row min-h-screen justify-center items-center rounded-md">
        <Features />
      </div>
      <Footer />
    </>
  );
}
