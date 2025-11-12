import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carte Patrimoniale de Limoges",
  description: "Découvrez l'évolution de Limoges à travers une comparaison interactive entre archives historiques et vues actuelles.",
  keywords: ["Limoges", "patrimoine", "histoire", "archives", "carte interactive"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
