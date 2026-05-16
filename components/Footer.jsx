"use client";

import { useStore } from "./StoreContext";
import { motion } from "framer-motion";
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
      "For order help, product questions, or support, email support@pubesto.com or call us at +91 7056063693.",
      "Customer support is available Monday to Saturday: 10AM - 7PM.",
      "Office: D-6/1, Okhla Phase 2, New Delhi-110020"
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
      <div className="footer-bg-glow" />
      <div className="footer-container">
        <motion.div 
          className="footer-grid"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {footerLinkGroups.map((group, idx) => (
            <div className="footer-column-wrapper" key={group.title}>
              <nav className="footer-column" aria-label={group.label}>
                {group.title && <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 + idx * 0.1 }}>{group.title}</motion.h2>}
                <div className="footer-links-list">
                  {group.links.map((link, lIdx) => (
                    <motion.div 
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 + lIdx * 0.05 }}
                    >
                      {link.href ? (
                        <Link
                          href={link.href}
                          className="footer-link-button"
                          style={{ textDecoration: 'none' }}
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <button
                          className="footer-link-button"
                          type="button"
                          onClick={() => setFooterPanel(link.panel)}
                          aria-expanded={footerPanel === link.panel}
                        >
                          {link.label}
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </nav>
              {idx < footerLinkGroups.length && <div className="footer-v-divider" />}
            </div>
          ))}

          <div className="footer-column-wrapper">
            <div className="footer-column footer-contact-col">
              <motion.div 
                className="footer-contact-info"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h2>Contact Us</h2>
                <p className="footer-contact-item">support@pubesto.com</p>
                <p className="footer-contact-item">+91 7056063693</p>
                <p className="footer-contact-item">Mon - Sat: 10AM - 7PM</p>
              </motion.div>

              <div className="footer-social-section">
                <motion.p 
                  className="footer-social-label"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Follow Us
                </motion.p>
                <nav className="footer-socials" aria-label="Social links">
                  {footerSocialLinks.map(({ label, href, Icon }, sIdx) => (
                    <motion.a 
                      href={href} 
                      target="_blank" 
                      rel="noreferrer" 
                      aria-label={label} 
                      key={label}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.2, rotate: 8 }}
                      transition={{ delay: 0.8 + sIdx * 0.1, type: "spring", stiffness: 300 }}
                    >
                      <Icon size={24} />
                    </motion.a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </motion.div>
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
