import React from "react";

export type LogoOption = 1 | 2 | 3;

interface AALogoProps {
  className?: string;
  size?: number;
  option?: LogoOption;
  invert?: boolean;
  showSubtitle?: boolean;
}

/**
 * A.A LOCKSMITH Brand Vector Logo
 * Option 1 (Classic Refined Vector) is the permanent official brand logo:
 * Clean transparent geometric 'LOCK' + circular loop padlock with 'S' + 'MITH' with no background circle.
 */
export function AALogo({
  className = "",
  size = 40,
  option = 1,
  invert = false,
  showSubtitle = true,
}: AALogoProps) {
  const textColor = invert ? "#FFFFFF" : "#18181B"; // Deep rich slate/black

  // OPTION 1: Classic Minimalist Arch Padlock (Default)
  const renderOption1 = () => (
    <svg
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 select-none overflow-visible"
    >
      {/* Arch Shackle */}
      <path
        d="M15 22V13C15 8.02944 19.0294 4 24 4C28.9706 4 33 8.02944 33 13V22"
        stroke={textColor}
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Solid/Smooth Body */}
      <rect
        x="9"
        y="21"
        width="30"
        height="23"
        rx="5.5"
        stroke={textColor}
        strokeWidth="3.4"
        fill={invert ? "#09090b" : "#ffffff"}
      />
      {/* Center Keyhole */}
      <circle cx="24" cy="30.5" r="2.5" fill={textColor} />
      <path
        d="M23 31.5L22.2 37.5H25.8L25 31.5H23Z"
        fill={textColor}
      />
    </svg>
  );

  // OPTION 2: Modern Geometric Shield Padlock with Keyhole
  const renderOption2 = () => (
    <svg
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 select-none overflow-visible"
    >
      {/* Shackle */}
      <path
        d="M16 21V12.5C16 8.08 19.58 4.5 24 4.5C28.42 4.5 32 8.08 32 12.5V21"
        stroke={textColor}
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      {/* Hex/Shield Styled Body */}
      <path
        d="M10 21H38C39.6569 21 41 22.3431 41 24V34C41 39.5228 33.5 43.5 24 44.5C14.5 43.5 7 39.5228 7 34V24C7 22.3431 8.34315 21 10 21Z"
        stroke={textColor}
        strokeWidth="3.2"
        fill={invert ? "#09090b" : "#ffffff"}
      />
      {/* Modern Keyhole */}
      <circle cx="24" cy="29.5" r="2.8" fill={textColor} />
      <path d="M22.8 30.5L22 36.5H26L25.2 30.5H22.8Z" fill={textColor} />
    </svg>
  );

  // OPTION 3: Circular Vault Loop Padlock with Styled Lock Dial
  const renderOption3 = () => (
    <svg
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 select-none overflow-visible"
    >
      {/* Rounded Arch Shackle */}
      <path
        d="M16 21V13C16 8.58172 19.5817 5 24 5C28.4183 5 32 8.58172 32 13V21"
        stroke={textColor}
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      {/* Circular Body */}
      <circle
        cx="24"
        cy="31.5"
        r="13.5"
        stroke={textColor}
        strokeWidth="3.4"
        fill={invert ? "#09090b" : "#ffffff"}
      />
      {/* Inner Accent Core */}
      <circle cx="24" cy="31.5" r="5" stroke={textColor} strokeWidth="2.2" />
      <circle cx="24" cy="31.5" r="2" fill={textColor} />
    </svg>
  );

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {option === 1 && renderOption1()}
      {option === 2 && renderOption2()}
      {option === 3 && renderOption3()}
    </div>
  );
}
