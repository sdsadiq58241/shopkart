import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Shield,
  Truck,
  RotateCcw,
  CreditCard,
} from "lucide-react";
import { CATEGORIES } from "@/lib/utils";

const footerLinks = {
  about: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "ShopKart Stories", href: "/stories" },
    { label: "Corporate Information", href: "/corporate" },
  ],
  help: [
    { label: "Payments", href: "/help/payments" },
    { label: "Shipping", href: "/help/shipping" },
    { label: "Returns & Cancellations", href: "/help/returns" },
    { label: "FAQ", href: "/help/faq" },
    { label: "Report Infringement", href: "/help/infringement" },
  ],
  policy: [
    { label: "Return Policy", href: "/policy/returns" },
    { label: "Terms of Use", href: "/policy/terms" },
    { label: "Security", href: "/policy/security" },
    { label: "Privacy", href: "/policy/privacy" },
    { label: "Sitemap", href: "/sitemap" },
  ],
  social: [
    { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
    { label: "Twitter", href: "https://twitter.com", Icon: Twitter },
    { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
    { label: "YouTube", href: "https://youtube.com", Icon: Youtube },
  ],
};

const features = [
  {
    Icon: Truck,
    title: "Free Delivery",
    desc: "On orders above ₹499",
    color: "#2874F0",
  },
  {
    Icon: Shield,
    title: "Secure Payment",
    desc: "100% secure transactions",
    color: "#388E3C",
  },
  {
    Icon: RotateCcw,
    title: "Easy Returns",
    desc: "7-day return policy",
    color: "#FF9F00",
  },
  {
    Icon: CreditCard,
    title: "EMI Options",
    desc: "No cost EMI available",
    color: "#9C27B0",
  },
];

export function Footer() {
  return (
    <footer className="mt-auto">
      {/* Features Banner */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map(({ Icon, title, desc, color }) => (
              <div
                key={title}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div style={{ backgroundColor: "#172337" }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-1 mb-4">
                <div className="bg-white rounded px-2 py-0.5">
                  <span className="font-black text-xl text-blue-600">Shop</span>
                  <span className="font-black text-xl text-amber-500">Kart</span>
                </div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                ShopKart is India&apos;s leading e-commerce platform offering millions
                of products across categories. Shop with confidence with our
                buyer protection guarantee.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-blue-400 flex-shrink-0" />
                  <span>123 Commerce Street, Bengaluru, Karnataka 560001</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-blue-400 flex-shrink-0" />
                  <span>1800-202-9898 (Toll Free)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-blue-400 flex-shrink-0" />
                  <span>support@shopkart.com</span>
                </div>
              </div>
              {/* Social */}
              <div className="flex items-center gap-3 mt-5">
                {footerLinks.social.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">
                About
              </h3>
              <ul className="space-y-2">
                {footerLinks.about.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">
                Help
              </h3>
              <ul className="space-y-2">
                {footerLinks.help.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories + Policy */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">
                Categories
              </h3>
              <ul className="space-y-2 mb-6">
                {CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/products?category=${cat.name}`}
                      className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs text-center sm:text-left">
              © {new Date().getFullYear()} ShopKart Technologies Pvt. Ltd. All
              rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {footerLinks.policy.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
