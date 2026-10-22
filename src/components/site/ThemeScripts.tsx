"use client";

import { useEffect } from "react";

// The theme's jQuery plugins, loaded once in this order (same as the original HTML)
const SCRIPTS = [
  "jquery-3.7.1.min.js",
  "bootstrap.min.js",
  "jquery.waypoints.min.js",
  "jquery.counterup.min.js",
  "jquery.magnific-popup.min.js",
  "SmoothScroll.js",
  "parallaxie.js",
  "gsap.min.js",
  "magiccursor.js",
  "SplitText.js",
  "ScrollTrigger.min.js",
  "wow.js",
  "afenet-init.js",
];

declare global {
  interface Window {
    AfenetTheme?: { init: () => void };
    __afenetScripts?: Promise<void>;
  }
}

function loadThemeScripts() {
  if (!window.__afenetScripts) {
    window.__afenetScripts = new Promise<void>((resolve, reject) => {
      SCRIPTS.forEach((file, i) => {
        const script = document.createElement("script");
        script.src = `/theme/js/${file}`;
        script.async = false; // keep execution order
        if (i === SCRIPTS.length - 1) {
          script.onload = () => resolve();
          script.onerror = reject;
        }
        document.body.appendChild(script);
      });
    });
  }
  return window.__afenetScripts;
}

// Rendered by the site template, so it re-runs the animations after every navigation
export default function ThemeScripts() {
  useEffect(() => {
    let cancelled = false;
    loadThemeScripts()
      .then(() => {
        if (!cancelled) window.AfenetTheme?.init();
      })
      .catch(() => {
        document.querySelector<HTMLElement>(".preloader")?.style.setProperty("display", "none");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
