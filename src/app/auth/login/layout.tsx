import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - ShopKart",
  description: "Login to your ShopKart account",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
