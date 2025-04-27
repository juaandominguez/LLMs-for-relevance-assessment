import Navbar from "@/components/navbar/navbar";

export default function LoggedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <section className="h-full w-full flex flex-col items-center justify-center pb-[10dvh]">
        {children}
      </section>
    </>
  );
}
