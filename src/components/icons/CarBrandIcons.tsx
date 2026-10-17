import React from "react";

export function CarBrandIcon({ brand, className = "w-4 h-4 shrink-0" }: { brand: string; className?: string }) {
  const norm = brand.toLowerCase().trim();

  switch (norm) {
    case "toyota":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Toyota">
          <path d="M12 2C6.48 2 2 5.58 2 10c0 4.42 4.48 8 10 8s10-3.58 10-8c0-4.42-4.48-8-10-8zm0 1.5c4.7 0 8.5 2.91 8.5 6.5s-3.8 6.5-8.5 6.5S3.5 13.59 3.5 10s3.8-6.5 8.5-6.5zm0 1.2c-2.4 0-4.3 2.37-4.3 5.3s1.9 5.3 4.3 5.3 4.3-2.37 4.3-5.3-1.9-5.3-4.3-5.3zm0 1.2c1.7 0 3.1 1.84 3.1 4.1s-1.4 4.1-3.1 4.1-3.1-1.84-3.1-4.1 1.4-4.1 3.1-4.1zm-4.7 1.8c-.8 0-1.5.3-2 .8 1.1 1.3 2.6 2.2 4.3 2.5-.7-1.9-1.5-3.3-2.3-3.3zm9.4 0c-.8 0-1.6 1.4-2.3 3.3 1.7-.3 3.2-1.2 4.3-2.5-.5-.5-1.2-.8-2-.8z" />
        </svg>
      );

    case "honda":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Honda">
          <path d="M4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1zm1.5 2.5v13h2.3v-4.8h8.4v4.8h2.3v-13h-2.3v5.8H7.8V5.5H5.5z" />
        </svg>
      );

    case "ford":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Ford">
          <path d="M12 4C5.37 4 0 7.58 0 12s5.37 8 12 8 12-3.58 12-8-5.37-8-12-8zm0 1.8c5.63 0 10.2 2.78 10.2 6.2s-4.57 6.2-10.2 6.2S1.8 15.42 1.8 12s4.57-6.2 10.2-6.2zm-2.8 3.5h-1.6v5.4h1.6v-2.1h2.2v-1.4H9.2v-1.9zm5.5 0c-1.5 0-2.5 1.1-2.5 2.7s1 2.7 2.5 2.7 2.5-1.1 2.5-2.7-1-2.7-2.5-2.7zm0 1.4c.7 0 1.1.6 1.1 1.3s-.4 1.3-1.1 1.3-1.1-.6-1.1-1.3.4-1.3 1.1-1.3z" />
        </svg>
      );

    case "chevrolet":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Chevrolet">
          <path d="M9 5h6v4h6v6h-6v4H9v-4H3V9h6V5zm1.5 1.5v3.5H4.5v3H10.5v4.5h3V13h6V10h-6V6.5h-3z" />
        </svg>
      );

    case "gmc":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="GMC">
          <path d="M2 7h6v2.5H4.5v5H8V12H6v-1.5h3.5v5.5H2V7zm8 0h4.5l1 5 1-5H21v9h-2.5v-5.5l-1 5h-2l-1-5V16H10V7z" />
        </svg>
      );

    case "dodge":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Dodge">
          <path d="M2 8h20v2H2V8zm12 4l3-6h2l-3 6h-2zm4 0l3-6h2l-3 6h-2zM2 14h20v2H2v-2z" />
        </svg>
      );

    case "jeep":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Jeep">
          <path d="M3 6h3v7c0 .6-.4 1-1 1s-1-.4-1-1V8H3v5c0 1.7 1.3 3 3 3s3-1.3 3-3V6h3v10h-3v-1H9c-.8.6-1.9 1-3 1-2.2 0-4-1.8-4-4V6h1zm10 4h5v2h-5v-2zm0 4h5v2h-5v-2zm8-8h-3v10h3c1.7 0 3-1.3 3-3V9c0-1.7-1.3-3-3-3zm1 7c0 .6-.4 1-1 1h-1V8h1c.6 0 1 .4 1 1v4z" />
        </svg>
      );

    case "ram":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="RAM">
          <path d="M12 2L4 6v6c0 5.5 3.4 10.7 8 12 4.6-1.3 8-6.5 8-12V6l-8-4zm0 2.2l6 3v5c0 4.4-2.7 8.5-6 9.6-3.3-1.1-6-5.2-6-9.6V7.2l6-3zm-3 4.8c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm6 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zM12 13c-1.7 0-3 1.3-3 3h6c0-1.7-1.3-3-3-3z" />
        </svg>
      );

    case "nissan":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Nissan">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c3.9 0 7.15 2.8 7.84 6.5H4.16C4.85 6.8 8.1 4 12 4zm-9 7h18v2H3v-2zm1.16 3h15.68c-.69 3.7-3.94 6.5-7.84 6.5s-7.15-2.8-7.84-6.5z" />
        </svg>
      );

    case "subaru":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Subaru">
          <path d="M12 3C6.48 3 2 7.03 2 12s4.48 9 10 9 10-4.03 10-9-4.48-9-10-9zm2.5 4.5l.6 1.8 1.9.1-1.5 1.2.5 1.8-1.5-1.1-1.5 1.1.5-1.8-1.5-1.2 1.9-.1.6-1.8zm-4 4l.4 1.2 1.3.1-1 .8.3 1.2-1-.7-1 .7.3-1.2-1-.8 1.3-.1.4-1.2zm6 2l.3.9 1 .1-.8.6.2.9-.7-.5-.7.5.2-.9-.8-.6 1-.1.3-.9zm-3 2l.3.9 1 .1-.8.6.2.9-.7-.5-.7.5.2-.9-.8-.6 1-.1.3-.9z" />
        </svg>
      );

    case "lexus":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Lexus">
          <path d="M12 3C6.48 3 2 7.03 2 12s4.48 9 10 9 10-4.03 10-9-4.48-9-10-9zm0 2c4.3 0 7.8 3.1 8 7.1l-9.5-6.3c.5-.5 1-.8 1.5-.8zm-6.2 3.1L15 14.5H7.5V8.1zm13.7 3.9c0 3.9-3.1 7-7 7-1.8 0-3.5-.7-4.8-1.8l9.8-6.5c1.2 1 2 2.4 2 4.3z" />
        </svg>
      );

    case "hyundai":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Hyundai">
          <path d="M12 3C5.5 3 2 6.8 2 12s3.5 9 10 9 10-3.8 10-9-3.5-9-10-9zm0 2c5 0 7.8 2.8 7.8 7s-2.8 7-7.8 7-7.8-2.8-7.8-7 2.8-7 7.8-7zm-4 3.5l1.5 7h2l.5-3.5h2l.5 3.5h2l1.5-7h-2l-.5 3.5h-2l-.5-3.5H8z" />
        </svg>
      );

    case "kia":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Kia">
          <path d="M12 3C5.5 3 2 7.03 2 12s3.5 9 10 9 10-4.03 10-9-3.5-9-10-9zm-5 5h2v4.5L11.5 8h2.3L11 11.5 14 16h-2.4L9 12.3V16H7V8zm8.5 0H18v8h-2.5V8z" />
        </svg>
      );

    case "bmw":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="BMW">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm0 2v5h-5c.4-2.6 2.4-4.6 5-5zm1 0c2.6.4 4.6 2.4 5 5h-5V6zm-6 7h5v5c-2.6-.4-4.6-2.4-5-5zm7 5v-5h5c-.4 2.6-2.4 4.6-5 5z" />
        </svg>
      );

    case "mercedes-benz":
    case "mercedes":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Mercedes-Benz">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm0 2.5l2.2 6.5 6.3 2.5-6.4 2.1-1.9 6.4-1.9-6.4-6.4-2.1 6.3-2.5L12 6.5z" />
        </svg>
      );

    case "audi":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Audi">
          <path d="M4.5 9a3 3 0 100 6 3 3 0 000-6zm0 1.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5S3 12.8 3 12s.7-1.5 1.5-1.5zm5 -1.5a3 3 0 100 6 3 3 0 000-6zm0 1.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5S8 12.8 8 12s.7-1.5 1.5-1.5zm5 -1.5a3 3 0 100 6 3 3 0 000-6zm0 1.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5S13 12.8 13 12s.7-1.5 1.5-1.5zm5 -1.5a3 3 0 100 6 3 3 0 000-6zm0 1.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5S18 12.8 18 12s.7-1.5 1.5-1.5z" />
        </svg>
      );

    case "volkswagen":
    case "vw":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Volkswagen">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm-2.8 4l2.1 6.5.7-2.5-1.4-4h-1.4zm5.6 0l-1.4 4 .7 2.5 2.1-6.5h-1.4zM12 8.5l1.2 3.5h-2.4L12 8.5zm-3 7.5h1.2l1.8-4.5 1.8 4.5H15l-3-7.5-3 7.5z" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label={brand}>
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z" />
          <circle cx="7.5" cy="14.5" r="1.5" />
          <circle cx="16.5" cy="14.5" r="1.5" />
        </svg>
      );
  }
}
