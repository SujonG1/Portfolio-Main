import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import React from "react";

export const useIntroAnimation = (scope: React.RefObject<HTMLDivElement>) => {
  useGSAP(() => {
    if (!scope.current) return;

    const tl = gsap.timeline({defaults:{ease: "power3.out"}});

    tl.from(".nav-logo", { y: -20, opacity: 0, duration: 0.7, delay: 0.5 })
      .from(".nav-link", { y: -20, opacity: 0, duration: 0.7, stagger: 0.2 }, "-=0.5")
      .from(".nav-btn", { y: -20, opacity: 0, duration: 0.7, stagger: 0.3 }, "-=0.5")
      .from(".hero-head", {y: 30, opacity: 0, duration: 0.9, stagger:0.4}, "-=0.5")
      .from(".hero-para", {y: 30, opacity: 0, duration: 0.9}, "-=0.1")
      .fromTo(".hero-btn button", 
        {y: 20, opacity: 0},
        {y: 0, duration: 0.8, opacity: 1, stagger: 0.3}, "-=0.5"
    )
      .from(".social-body", {x: 20, opacity: 0, duration: 0.9}, "-=0.5")
      .fromTo(".social-btn a", 
        {y: 20, opacity: 0},
        {y: 0, opacity: 1, duration: 0.9, stagger:0.3}, "-=0.5"
    )
  }, { scope });
};