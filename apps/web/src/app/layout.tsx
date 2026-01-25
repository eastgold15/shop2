import Footer from "@/components/layout/Footer";
import Navbar from "@/components/Navbar/Navbar";
import QueryProvider from "@/components/providers/query-provider";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white font-sans text-black antialiased">
        <QueryProvider>
          <div className="relative min-h-screen font-sans text-black selection:bg-black selection:text-white">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
