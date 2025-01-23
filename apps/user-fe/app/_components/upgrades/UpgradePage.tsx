import { cn } from "@repo/ui/utils";
import { manrope } from "../../lib/fonts";
import { UpgradeCard } from "./upgradeCard";

export function UpgradesPage() {
    return <div className={cn("flex flex-col pt-10 h-screen md:mx-40" , manrope.className)}>
        <div className="flex justify-center pb-10">
            <span className="text-4xl text-transparent bg-gradient-to-r from-[#AA823D] via-[#EFE288] to-[#D1B85A] bg-clip-text">Latent+ Subscriptions</span>
        </div>
            <div className="flex justify-center h-full">
                <UpgradeCard/>
            </div>
    </div>
}