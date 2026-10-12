import React from "react";

export function JsonLdSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Locksmith",
        "@id": "https://locallockservice.com/#locksmith",
        "name": "Local Lock & Key Service",
        "image": "https://locallockservice.com/gallery/hero-banner.png",
        "url": "https://locallockservice.com",
        "telephone": "+1-603-290-5554",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Elm Street",
          "addressLocality": "Manchester",
          "addressRegion": "NH",
          "postalCode": "03101",
          "addressCountry": "US",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 42.9956,
          "longitude": -71.4548,
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            "opens": "00:00",
            "closes": "23:59",
          },
        ],
        "areaServed": [
          { "@type": "City", "name": "Manchester" },
          { "@type": "City", "name": "Bedford" },
          { "@type": "City", "name": "Nashua" },
          { "@type": "City", "name": "Concord" },
          { "@type": "City", "name": "Derry" },
          { "@type": "City", "name": "Londonderry" },
          { "@type": "City", "name": "Hooksett" },
        ],
        "paymentAccepted": "Cash, Credit Card, Debit Card, Apple Pay, Google Pay",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "reviewCount": "35",
          "bestRating": "5",
          "worstRating": "1",
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Locksmith Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Car Lockout",
                "description": "Emergency vehicle unlock service with 100% damage-free air-wedge bypass techniques.",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "House Lockout",
                "description": "Fast residential lockout assistance for homes, apartments, and condos in Manchester NH.",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Lock Rekeying",
                "description": "On-site lock cylinder rekeying and master key system setup for homes and businesses.",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Smart Key Fob Programming",
                "description": "Automotive transponder key origination, laser key cutting, and smart proximity fob programming.",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Commercial Storefront Security",
                "description": "Commercial mortise cylinder replacement, crash bar panic hardware, and high-security deadbolts.",
              },
            },
          ],
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://locallockservice.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Do you guarantee 100% damage-free entry on locked cars and doors?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Our technicians use professional locksmith picks and automotive air-wedge bypass tools. We never break car windows or pry door frames.",
            },
          },
          {
            "@type": "Question",
            "name": "Why is ID and proof of ownership legally required before unlocking?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Under state regulations, professional locksmiths are required to verify photo ID and vehicle registration or property lease to protect owners from unlawful entry.",
            },
          },
          {
            "@type": "Question",
            "name": "What payment methods are accepted on-site by mobile units?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Every mobile unit carries wireless POS card terminals accepting Visa, MasterCard, Amex, Apple Pay, Google Pay, and Cash with printed receipts.",
            },
          },
          {
            "@type": "Question",
            "name": "Do you provide upfront pricing before dispatching a mobile technician?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we always provide clear upfront phone estimates based on your vehicle make, year, or lock type before dispatching. No hidden fees or surprise on-site markups.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
