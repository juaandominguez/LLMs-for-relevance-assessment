import Navbar from "@/components/navbar";

export default function LoggedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <section className="min-w-[95dvw] min-h-[93dvh] h-full flex flex-col items-center justify-center pb-[10dvh] space-y-[8dvh]">
        {children}
      </section>
    </>
  );
}
