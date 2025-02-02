import Footer from "../../_common/footer";
import { PremiumFeatures } from "../home/premiumFeature";
import PrivacyPolicyContent from "./policyContent";

export function PrivacyPolicy() {
  return (
    <>
      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-0 py-12">
          <PrivacyPolicyContent />
          <PremiumFeatures />
        </div>
        <Footer />
      </main>
    </>
  );
}
