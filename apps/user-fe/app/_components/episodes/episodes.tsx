import Footer from "../../_common/footer";
import EpisodesLatent from "./latentEpisodes";
import { EpisodesLatentPlus } from "./latentPlusEpisodes";

export function EpisodesPage() {
  return (
    <>
      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-0 py-12">
          <EpisodesLatent />
          <EpisodesLatentPlus />
        </div>
        <Footer />
      </main>
    </>
  );
}
