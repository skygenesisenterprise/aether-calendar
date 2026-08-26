import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda",
};

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {children}
    </div>
  );
}
