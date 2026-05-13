"use client";

import { useStore } from "./StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function LeadModal() {
  const { 
    isLeadModalOpen, setIsLeadModalOpen, 
    checkout, setUserPhone 
  } = useStore();
  
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLeadModalOpen) return null;

  const handleClose = () => {
    setIsLeadModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone) return;
    
    setIsSubmitting(true);
    // Simulate API call to save lead
    setTimeout(() => {
      setUserPhone(phone);
      checkout(true); // Bypass phone check
      setIsSubmitting(false);
      handleClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="lead-modal-overlay">
        <motion.div 
          className="lead-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />
        <motion.div 
          className="lead-modal-content"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <button className="lead-modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
          
          <div className="lead-modal-header">
            <h3>Enter your phone number to proceed to checkout</h3>
            <p className="field-label">WhatsApp Number</p>
          </div>

          <form onSubmit={handleSubmit} className="lead-modal-form">
            <div className="phone-input-container">
              <div className="flag-prefix">
                <img src="https://flagcdn.com/w40/in.png" alt="India" width="20" />
                <span>+91</span>
              </div>
              <input 
                type="tel" 
                placeholder="Phone" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoFocus
                required
              />
            </div>

            <button type="submit" className="lead-submit-button" disabled={isSubmitting}>
              <span>{isSubmitting ? "Processing..." : "PROCEED"}</span>
              <div className="button-icon">
                <ArrowRight size={18} />
              </div>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
