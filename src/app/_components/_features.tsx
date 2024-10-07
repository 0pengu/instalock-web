import { Button } from "@mantine/core";
import JettImg from "@/photos/landing/jett-small-display-icon.png";
import PhxImg from "@/photos/landing/pheonix-small-display-icon.png";
import ViperImg from "@/photos/landing/viper-small-display-icon.png";
import VyseImg from "@/photos/landing/vyse-small-display-icon.png";
import { Link } from "react-router-dom";

const features = [
  {
    icon: JettImg,
    title: "Track your stats",
    description:
      "Get detailed statistics on your prior games, including kills, deaths, and assists",
  },
  {
    icon: PhxImg,
    title: "Select your favorite agent",
    description:
      "Use Instalock to select your agent while you're making a sandwich or using the restroom!",
  },
  {
    icon: ViperImg,
    title: "Change your skins",
    description:
      "Browse through all the skins available in your inventory and select the one you want to use, all through Instalock.",
  },
  {
    icon: VyseImg,
    title: "More soon",
    description:
      "We're always working on new features to make Instalock the best Valorant companion app out there. Is there something you'd like to see? Let us know with the contact form on the footer!",
  },
];

export function Features() {
  const items = features.map((feature) => (
    <div key={feature.title} className="mb-6">
      <div className="w-11 h-11 rounded-md transition-all bg-gradient-to-r from-deep-red-400 to-deep-red-700 bg-size-200 bg-pos-0 hover:bg-pos-100 flex items-center justify-center">
        <img
          src={feature.icon}
          className="w-11 h-11 rounded-md"
          alt="Agent icon"
        />
        {/* <feature.icon className="w-6 h-6 text-white" /> */}
      </div>
      <p className="text-lg font-medium mt-2">{feature.title}</p>
      <p className="text-sm text-gray-500">{feature.description}</p>
    </div>
  ));

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-5">
          <h2 className="text-2xl font-bold mb-4">
            A Valorant companion app for all your needs
          </h2>
          <p className="text-gray-500 mb-6">
            Instalock is a comprehensive Valorant companion app that provides
            you with all the tools you need to improve your game. From tracking
            your stats to selecting your favorite agent, Instalock has you
            covered.
          </p>

          <Link to="/login">
            <Button className="transition-all bg-gradient-to-r from-deep-red-400 to-deep-red-700 bg-size-200 bg-pos-0 hover:bg-pos-100">
              Get started
            </Button>
          </Link>
        </div>
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">{items}</div>
        </div>
      </div>
    </div>
  );
}
