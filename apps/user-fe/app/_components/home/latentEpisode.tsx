import { cn } from "@repo/ui/utils";
import { manrope } from "../../lib/fonts";
import { EpisodeCard } from "./episodeCard";

export function LatentEpisodes() {
  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2
          className={cn(
            "text-neutral-50 text-3xl font-bold",
            manrope.className
          )}
        >
          Latent Episodes
        </h2>
        <button className="text-neutral-50 ">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="flex overflow-x-scroll no-scrollbar">
        <div className="flex flex-nowrap gap-6">
          <div className="w-96">
            <EpisodeCard />
          </div>
          <div className="w-96">
            <EpisodeCard />
          </div>
          <div className="w-96">
            <EpisodeCard />
          </div>
          <div className="w-96">
            <EpisodeCard />
          </div>
          <div className="w-96">
            <EpisodeCard />
          </div>
        </div>
      </div>
    </div>
  );
}
