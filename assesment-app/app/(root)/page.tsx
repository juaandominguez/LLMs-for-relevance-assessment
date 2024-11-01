import PromptInfo from "./components/guidelines";
import Hero from "./components/hero";
export default function Home() {

  return (
    <section className="w-[100dvw] min-h-[100dvh] flex flex-col items-center justify-center py-[10dvh] space-y-[8dvh]">
      <Hero />
      <PromptInfo />
    </section>
  );
}
