import PromptInfo from "./components/guidelines";
import Hero from "./components/hero";
export default function Home() {

  return (
    <article className="w-full min-h-[82dvh] flex flex-col items-center justify-center ">
      <Hero />
      <PromptInfo />
    </article>
  );
}
