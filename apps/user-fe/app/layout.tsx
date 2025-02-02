import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "./_common/navbar";
import { getUser } from "./lib/actions/getUser";

export const metadata = {
  title: "India's Got Latent",
  description: "A talent show for the latently talented",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUser()
  return (
    <html lang="en">
      <body className="min-h-screen">
      <Toaster position="top-right"/>  
      <Providers session={session}>
        <Navbar/>
        {children}
      </Providers>
      </body>
    </html>
  );
}
