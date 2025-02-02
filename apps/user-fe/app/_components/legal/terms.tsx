import Footer from "../../_common/footer";
import { PremiumFeatures } from "../home/premiumFeature";
import TermsContent from "./termsContent";

export function TermsAndConditons() {
  return (
    <>
      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-0 py-12">
          <TermsContent />
          <PremiumFeatures />
        </div>
        <Footer />
      </main>
    </>
  );
}
