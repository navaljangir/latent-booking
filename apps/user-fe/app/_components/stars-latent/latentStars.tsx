import Footer from "../../_common/footer";
import { PremiumFeatures } from "../home/premiumFeature";
import { StarsOfLatent } from "./starsOfLatent";

export function LatentStars() {
  return (
    <>
      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-0 py-12">
          <StarsOfLatent />
          <PremiumFeatures />
        </div>
        <Footer />
      </main>
    </>
  );
}
