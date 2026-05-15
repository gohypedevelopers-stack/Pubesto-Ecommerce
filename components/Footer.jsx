"use client";

import { useStore } from "./StoreContext";
import { InstagramIcon, FacebookIcon } from "./Icons";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const footerLinkGroups = [
  {
    title: "Policies",
    label: "Fine print links",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Refund Policy", href: "/refund-return-policy" },
      { label: "Shipping Policy", href: "/shipping-policy" },
    ],
  },
  {
    title: "Learn More",
    label: "Learn more links",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", panel: "faq" },
    ],
  },
];

const footerPanelContent = {
  about: {
    eyebrow: "Learn More",
    title: "About Pubesto",
    body: [
      "Pubesto curates practical home, kitchen, bottle, lunch box, and daily-use products for Indian homes.",
      "The store focuses on simple utility, dependable materials, and clear value.",
    ],
  },
  contact: {
    eyebrow: "Learn More",
    title: "Contact Us",
    body: [
      "For order help, product questions, or support, email support@pubesto.com.",
      "Customer support is available Monday to Saturday during business hours.",
    ],
  },
  faq: {
    eyebrow: "Learn More",
    title: "FAQ",
    body: [
      "Use search or category filters to find products quickly. Add items to cart and review quantities before checkout.",
      "For product availability, delivery, or return questions, contact support with your order details.",
    ],
  },
};

const footerSocialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/pubesto_in/", Icon: InstagramIcon },
  { label: "Facebook", href: "https://www.facebook.com/", Icon: FacebookIcon },
];

export default function Footer() {
  const { footerPanel, setFooterPanel } = useStore();
  const [footerEmail, setFooterEmail] = useState("");
  const [footerNotice, setFooterNotice] = useState("");

  const activeFooterPanel = footerPanel ? footerPanelContent[footerPanel] : null;

  function submitFooterForm(event) {
    event.preventDefault();
    const email = footerEmail.trim();
    setFooterNotice(
      email ? `Offers will be sent to ${email}.` : "Enter an email address to subscribe."
    );
  }

  return (
    <footer id="footer" className="site-footer">
      <div className="footer-grid">
        {footerLinkGroups.map((group) => (
          <nav className="footer-column" aria-label={group.label} key={group.title}>
            {group.title && <h2>{group.title}</h2>}
            {group.links.map((link) => (
              link.href ? (
                <Link
                  href={link.href}
                  className="footer-link-button"
                  key={link.label}
                  style={{ display: 'block', textAlign: 'left', textDecoration: 'none' }}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  className="footer-link-button"
                  type="button"
                  onClick={() => setFooterPanel(link.panel)}
                  aria-expanded={footerPanel === link.panel}
                  key={link.label}
                >
                  {link.label}
                </button>
              )
            ))}
          </nav>
        ))}

        <div className="footer-column footer-offers">

          <div className="footer-contact-info">
            <h3>Contact Us</h3>
            <p>support@pubesto.com</p>
            <p>Mon - Sat: 10AM - 7PM</p>
          </div>

          <nav className="footer-socials" aria-label="Social links">
            {footerSocialLinks.map(({ label, href, Icon }) => (
              <a href={href} target="_blank" rel="noreferrer" aria-label={label} key={label}>
                <Icon size={18} />
              </a>
            ))}
          </nav>
        </div>
      </div>

      {activeFooterPanel ? (
        <section className="footer-info-panel" aria-labelledby="footer-info-title" onClick={() => setFooterPanel(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <p className="eyebrow">{activeFooterPanel.eyebrow}</p>
            <h2 id="footer-info-title">{activeFooterPanel.title}</h2>
            {activeFooterPanel.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <button type="button" onClick={() => setFooterPanel(null)} aria-label="Close footer information">
              Close
            </button>
          </div>
        </section>
      ) : null}

      <div className="footer-brand-endcap" aria-label="Pubesto">
        <span aria-hidden="true">PUBESTO</span>
      </div>
      <div className="footer-copyright">
        &copy; 2026 PUBESTO . ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
