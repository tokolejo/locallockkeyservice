import React from "react";

const BRAND_IMAGE_MAP: Record<string, string> = {
  ford: "/brands/ford.png",
  chevrolet: "/brands/chevrolet.png",
  chevy: "/brands/chevrolet.png",
  gmc: "/brands/gmc.png",
  dodge: "/brands/dodge.png",
  jeep: "/brands/jeep.png",
  ram: "/brands/ram.png",
  toyota: "/brands/toyota.png",
  honda: "/brands/honda.png",
  nissan: "/brands/nissan.png",
  subaru: "/brands/subaru.png",
  lexus: "/brands/lexus.png",
  hyundai: "/brands/hyundai.png",
  kia: "/brands/kia.png",
  bmw: "/brands/bmw.png",
  "mercedes-benz": "/brands/mercedes-benz.png",
  mercedes: "/brands/mercedes-benz.png",
  audi: "/brands/audi.png",
  volkswagen: "/brands/volkswagen.png",
  vw: "/brands/volkswagen.png",
};

export function CarBrandIcon({
  brand,
  className = "h-8 sm:h-9 w-auto max-w-[72px] shrink-0",
}: {
  brand: string;
  className?: string;
}) {
  const norm = brand.toLowerCase().trim();
  const imgSrc = BRAND_IMAGE_MAP[norm];

  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={`${brand} official logo`}
        className={`${className} object-contain`}
        loading="lazy"
        draggable={false}
      />
    );
  }

  // Fallback for unlisted brands
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label={brand}>
      <circle cx="12" cy="12" r="10" fill="#E2E8F0" />
      <text
        x="12"
        y="15"
        fontFamily="sans-serif"
        fontWeight="bold"
        fontSize="9"
        fill="#334155"
        textAnchor="middle"
      >
        {brand.charAt(0)}
      </text>
    </svg>
  );
}
