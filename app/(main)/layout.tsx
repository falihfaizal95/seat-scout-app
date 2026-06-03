import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
}
