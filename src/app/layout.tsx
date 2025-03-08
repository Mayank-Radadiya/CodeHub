import type { Metadata } from "next";
import "./globals.css";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "CodeHub",
  description: "Focused on collaboration and sharing of code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
        <Toaster />
        <div className="flex-1 flex flex-col pt-2">
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </div>
      </body>
    </html>
  );
}
