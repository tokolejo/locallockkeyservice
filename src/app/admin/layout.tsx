import React from "react";

export const metadata = {
  title: "Admin Portal | Local Lock & Key Service",
  description: "Centralized management portal for services, portfolio gallery, hero slider, contacts, and customer reviews",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
