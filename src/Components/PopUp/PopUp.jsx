import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Popup = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{zIndex:"1042"}} className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center ">
          {/* Background Blur Layer */}
          <motion.div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Popup Box */}
          <motion.div
            className="bg-white p-4 rounded shadow-lg position-relative"
            style={{ width: "90%", maxWidth: "400px", zIndex: 5 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {title && <h2 className="h5 fw-bold mb-3">{title}</h2>}
            <button
              onClick={onClose}
              className="btn-close position-absolute border-0 top-0 end-0 m-3"
            />
            {/* Close Button */}
            
            {/* Dynamic Content */}
            <div className="mb-3">{children}</div>

           
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
