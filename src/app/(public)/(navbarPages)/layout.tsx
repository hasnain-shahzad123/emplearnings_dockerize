import Footer from "@/components/publicPages/footer/Footer";
import Navbar from "@/components/publicPages/navbar/Navbar";
export default function NavBarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
