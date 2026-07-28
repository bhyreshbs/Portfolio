"use client";

import { useEffect } from "react";

export default function ScrollRestorer() {
  useEffect(() => {
    // Attempt to restore scroll position if we are returning from another page like Contact
    const returnScroll = sessionStorage.getItem("returnScroll");
    if (returnScroll) {
      sessionStorage.removeItem("returnScroll"); // Clear it so it only fires once
      
      // Delay slightly to ensure GSAP ScrollTrigger and DOM elements have fully mounted
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(returnScroll, 10),
          behavior: "instant"
        });
      }, 50);
    }
  }, []);

  return null;
}
