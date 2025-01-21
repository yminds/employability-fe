import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import logoIconWithGradient from "@/assets/branding/logo_icon_with_gradient.svg?url";

interface AIProfileProps {
  frequency: number; // Normalized frequency (0 to 1)
}

const AIProfile: React.FC<AIProfileProps> = ({ frequency }) => {
  // Stability management
  const [isStable, setIsStable] = useState(false);
  const prevFrequencyRef = useRef<number>(frequency);
  const STABILITY_THRESHOLD = 0.05;
  const STABILITY_DURATION = 2000; // in milliseconds

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const isWithinThreshold =
      Math.abs(frequency - prevFrequencyRef.current) < STABILITY_THRESHOLD;

    if (isWithinThreshold) {
      timeoutId = setTimeout(() => {
        setIsStable(true);
      }, STABILITY_DURATION);
    } else {
      setIsStable(false);
      prevFrequencyRef.current = frequency;
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [frequency]);

  // Determine scale based on stability and frequency
  const sizeScale = isStable || frequency === 0 ? 0.5 : 1;
  const scaleFactor = sizeScale * (1 + frequency);
  const secondaryScaleFactor = sizeScale * (1 + frequency * 0.75);
  const rotateBase = frequency * 10 - 5;

  // Animation loop for idle state
  const { idle } = useSpring({
    from: { idle: 0 },
    to: { idle: 2 * Math.PI },
    loop: true,
    config: { duration: 4000 },
  });

  // Utility function to generate border-radius based on frequency
  const generateBorderRadius = (base: number, offsetMultiplier: number) => {
    const offset = frequency * offsetMultiplier;
    return `
      ${base + offset}% ${base - offset / 2}% 
      ${base + offset / 2}% ${base - offset}% / 
      ${base - offset}% ${base + offset}% 
      ${base - offset / 2}% ${base + offset / 2}%
    `;
  };

  // Utility function to generate background gradients based on frequency
  const generateBackground = (
    hueBase: number,
    lightnessBase: number,
    lightnessMultiplier: number,
    alphaStart: number,
    alphaEnd: number,
    saturationStart: number,
    saturationEnd: number
  ) => {
    const hue = hueBase + frequency * 20;
    const lightness = lightnessBase + frequency * lightnessMultiplier;
    const alpha1 = alphaStart + frequency * 0.3;
    const alpha2 = alphaEnd + frequency * 0.2;
    return `radial-gradient(circle at center, hsla(${hue}, ${saturationStart}%, ${lightness}%, ${alpha1}) 0%, hsla(${hue}, ${saturationEnd}%, ${lightness}%, ${alpha2}) 100%)`;
  };

  // Main Blob Styles
  const mainBlobStyles = {
    background: idle.to(() =>
      generateBackground(140, 50, 20, 0.4, 0.2, 70, 50)
    ),
    borderRadius: idle.to(() => generateBorderRadius(50, 10)),
    transform: idle.to(
      (i) =>
        `translate(-50%, -50%) translate(${Math.sin(i) * 10}px, ${
          Math.cos(i) * 5
        }px) scale(${scaleFactor}) rotate(${rotateBase}deg)`
    ),
    filter: `blur(${sizeScale * 30}px)`,
    zIndex: 2,
  };

  // Secondary Blob Styles
  const secondaryBlobStyles = {
    background: idle.to(
      () =>
        `radial-gradient(circle at center, hsla(${140 + frequency * 20}, 80%, ${
          60 + frequency * 15
        }%, ${0.15 + frequency * 0.1}) 0%, hsla(${140 + frequency * 20}, 60%, ${
          60 + frequency * 15
        }%, ${0.05 + frequency * 0.1}) 100%)`
    ),
    borderRadius: idle.to(() => {
      const base = 50;
      const offset = frequency * 8;
      return `
        ${base + offset}% ${base - offset / 3}% 
        ${base + offset / 3}% ${base - offset}% / 
        ${base - offset / 2}% ${base + offset * 1.1}% 
        ${base - offset / 3}% ${base + offset / 1.3}%
      `;
    }),
    transform: idle.to(
      (i) =>
        `translate(-50%, -50%) translate(${Math.sin(i + Math.PI / 2) * 6}px, ${
          Math.cos(i + Math.PI / 2) * 3
        }px) scale(${secondaryScaleFactor}) rotate(${-frequency * 8}deg)`
    ),
    filter: `blur(${sizeScale * 40}px)`,
    opacity: 0.7,
    zIndex: 1,
  };

  return (
    <div className="relative h-[25vh] w-full flex flex-col items-center justify-center overflow-hidden border border-[#0000001A] rounded-[6.789px] bg-white">
      {/* Secondary Blob */}
      <animated.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: `${sizeScale * 20}rem`,
          height: `${sizeScale * 10}rem`,
          ...secondaryBlobStyles,
        }}
      />

      {/* Main Blob */}
      <animated.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: `${sizeScale * 20}rem`,
          height: `${sizeScale * 10}rem`,
          ...mainBlobStyles,
        }}
      />

      {/* Logo */}
      <img
        src={logoIconWithGradient}
        className="w-24 relative z-10"
        alt="Logo"
      />
    </div>
  );
};

export default AIProfile;
