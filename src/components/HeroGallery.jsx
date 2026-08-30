"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const CARD_STYLES = [
  {
    transform: "translate(0px, 0px) rotate(0deg) scale(1)",
    zIndex: 30,
    opacity: 1,
  },
  {
    transform: "translate(28px, 18px) rotate(7deg) scale(0.94)",
    zIndex: 20,
    opacity: 0.9,
  },
  {
    transform: "translate(48px, 34px) rotate(-6deg) scale(0.88)",
    zIndex: 10,
    opacity: 0.75,
  },
];

const slides = [
  {
    src: "/hero-dashboard.jpg",
    alt: "Gestão de bar e restaurante com painéis de dados e IA",
  },
  {
    src: "/hero-sapore.jpg",
    alt: "Dono de restaurante e equipe consultando o dashboard OPR num tablet",
  },
  {
    src: "/hero-harvest.jpg",
    alt: "Tablet com dashboard operacional sobre bancada de cozinha profissional",
  },
];

export default function HeroGallery() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative aspect-[4/3] w-full">
      {slides.map((slide, i) => {
        const offset = (i - active + slides.length) % slides.length;
        const style = CARD_STYLES[offset];

        return (
          <div
            key={i}
            className="absolute inset-0 overflow-hidden rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/60 transition-all duration-700 ease-out"
            style={style}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        );
      })}
    </div>
  );
}
