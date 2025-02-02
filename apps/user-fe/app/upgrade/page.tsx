import { cn } from "@repo/ui/utils";
import { manrope } from "../lib/fonts";
import { UpgradeCard } from "../_components/upgrades/upgradeCard";

export default function UpgradesPage() {
    return  <div className={cn(manrope.className)}>
        <div className="flex justify-center pb-5">
            <span className="text-4xl text-transparent bg-gradient-to-r from-[#AA823D] via-[#EFE288] to-[#D1B85A] bg-clip-text">Latent+ Subscriptions</span>
        </div>
            <div className="flex justify-center">
                <UpgradeCard/>
            </div>
    </div>
}