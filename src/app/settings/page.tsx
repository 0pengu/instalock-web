import Navbar from "@/app/dashboard/_components/_navbar";
import JwtSection from "@/app/settings/_components/_jwt-section/_jwt-section";

export default function SettingPage() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col space-y-8">
        <JwtSection />
      </div>
    </>
  );
}
