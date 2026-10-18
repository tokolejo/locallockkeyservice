import React from "react";
import { NH_SERVICE_AREAS_DATA } from "@/lib/data/coverage-areas";

export function JsonLdSchema() {
  const siteUrl = "https://www.locallockkeyservice.com";

  // Flatten all 63 coverage towns and ZIP codes from NH_SERVICE_AREAS_DATA
  const coverageCities = NH_SERVICE_AREAS_DATA.flatMap((group) =>
    group.locations.map((loc) => ({
      "@type": "City" as const,
      name: loc.city,
      address: {
        "@type": "PostalAddress" as const,
        addressLocality: loc.city,
        addressRegion: "NH",
        postalCode: loc.zip,
        addressCountry: "US",
      },
    }))
  );

  const coverageCounties = [
    { "@type": "AdministrativeArea" as const, name: "Hillsborough County, NH" },
    { "@type": "AdministrativeArea" as const, name: "Merrimack County, NH" },
    { "@type": "AdministrativeArea" as const, name: "Rockingham County, NH" },
    { "@type": "AdministrativeArea" as const, name: "Belknap County, NH" },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Locksmith", "LocalBusiness", "EmergencyService"],
        "@id": `${siteUrl}/#locksmith`,
        name: "Local Lock & Key Service",
        alternateName: [
          "Local Lock and Key Service",
          "Local Locksmith Manchester NH",
          "Local Lock & Key",
        ],
        description:
          "24/7 mobile emergency locksmith service in Manchester NH & 63+ Southern New Hampshire communities. Fast 15-20 minute dispatch for car lockouts, house lockouts, commercial locks, deadbolt rekeying, smart key fob programming, and safe opening.",
        image: [
          `${siteUrl}/og-image.jpg`,
          `${siteUrl}/gallery/hero-banner.png`,
          `${siteUrl}/gallery/van-work.jpg`,
        ],
        url: siteUrl,
        telephone: "+1-603-290-5554",
        priceRange: "$$",
        currenciesAccepted: "USD",
        paymentAccepted: "Cash, Credit Card, Debit Card, Apple Pay, Google Pay",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Elm Street",
          addressLocality: "Manchester",
          addressRegion: "NH",
          postalCode: "03101",
          addressCountry: "US",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 42.9956,
          longitude: -71.4548,
        },
        hasMap: "https://maps.app.goo.gl/j9Zvw9xhNKP5Rgk29",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "00:00",
            closes: "23:59",
          },
        ],
        areaServed: [...coverageCities, ...coverageCounties],
        knowsAbout: [
          "Emergency Vehicle Lockout",
          "Automotive Key Replacement",
          "Transponder Key Programming",
          "Push-to-Start Smart Key Fobs",
          "Ford Locksmith Service",
          "Chevrolet Locksmith Service",
          "GMC Keys & Lockout",
          "Toyota Car Keys",
          "Honda Key Fob Programming",
          "Jeep Lockout Service",
          "BMW Smart Keys",
          "Mercedes-Benz Keys",
          "Audi Keys",
          "Subaru Keys",
          "Nissan Key Replacement",
          "RAM Truck Keys",
          "Volkswagen Keys",
          "Lexus Keys",
          "Hyundai Keys",
          "Kia Keys",
          "Residential Deadbolt Rekeying",
          "Commercial Storefront Lock Repair",
          "Safe & Vault Locksmith",
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "35",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Steve Plante" },
            datePublished: "2026-09-09",
            reviewBody:
              "I stupidly locked my car with the keys and my dog inside. I was kind of stressed. They came within 15 minutes and unlocked. Luckily for me it was a cool day. Fabulous service.. Highly recommend.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Aiden Tejada" },
            datePublished: "2026-08-16",
            reviewBody: "Guy helped me out, Middle of nowhere, good price",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Davien Pearson" },
            datePublished: "2026-08-16",
            reviewBody: "Great company they came fast and gave me a great price for my car key.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Shawn Savage" },
            datePublished: "2026-08-12",
            reviewBody: "Great and awesome job!",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Bannon Lynott" },
            datePublished: "2026-08-11",
            reviewBody:
              "He came and fixed a frustrating problem for us. His prices are very reasonable and we will use this company again in the future!",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
          },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Locksmith Service Categories",
          itemListElement: [
            {
              "@type": "OfferCatalog",
              name: "Residential Locksmith Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "House & Apartment Lockout Rescue",
                    description:
                      "24/7 non-destructive residential lockout assistance for houses, apartments, and condominiums in Manchester and Southern NH.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Residential Lock Rekeying (Keyed Alike)",
                    description:
                      "Precision pin tumbler cylinder rekeying for Schlage, Kwikset, Yale, and Baldwin locks so one single key opens all doors.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Lock Replacement & Deadbolt Installation",
                    description:
                      "Fresh Grade 1 and Grade 2 deadbolt installation, high-security lock upgrades, and door prep alignment.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Broken Key Removal & Door Strike Alignment",
                    description:
                      "Extraction of sheared or jammed keys from residential lock cylinders and heavy-duty frame strike reinforcement.",
                  },
                },
              ],
            },
            {
              "@type": "OfferCatalog",
              name: "Automotive Locksmith Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Car Door & Trunk Lockout Rescue",
                    description:
                      "Rapid vehicle unlock service using specialized air-wedge bypass and precision reach tools.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Smart Key Fob & Proximity Remote Programming",
                    description:
                      "On-site OBD-II diagnostic pairing for push-to-start smart fobs, transponder keys, and keyless remotes.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "All Keys Lost Origination & Laser Key Cutting",
                    description:
                      "Roadside CNC high-security sidewinder laser key cutting and ECU immobilizer programming without dealership towing.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Broken Key Extraction & Ignition Cylinder Repair",
                    description:
                      "On-site ignition switch rebuilding, wafer tumbler replacement, and broken key extraction from auto locks.",
                  },
                },
              ],
            },
            {
              "@type": "OfferCatalog",
              name: "Commercial Locksmith Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Commercial Storefront & Office Lockout Bypass",
                    description:
                      "Fast commercial door opening for offices, retail stores, warehouses, and industrial facilities in Manchester NH.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Panic Crash Bar & Exit Hardware Installation",
                    description:
                      "Commercial fire-code and ADA compliant emergency exit panic hardware, crash bars, and exterior lever trim.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Master Key System Design & Key Control",
                    description:
                      "Tiered multi-level master key hierarchies for commercial landlords, property managers, and business complexes.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "High-Security Mortise Cylinders & Hardware",
                    description:
                      "Commercial mortise lock replacement, heavy-duty deadlatches, and electric strike frame retrofits.",
                  },
                },
              ],
            },
            {
              "@type": "OfferCatalog",
              name: "Emergency Locksmith Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "24/7 Mobile Priority Lockout Dispatch",
                    description:
                      "Rapid response 24/7 mobile locksmith fleet for urgent lockouts across Manchester and Southern NH.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Emergency Lock Replacement After Break-in",
                    description:
                      "Immediate on-site lock rekeying and heavy-duty deadbolt installation after burglaries, theft, or compromised security.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Storage Unit & Padlock Removal",
                    description:
                      "Specialized commercial padlock bypass and storage facility lock cutting and replacement.",
                  },
                },
              ],
            },
            {
              "@type": "OfferCatalog",
              name: "Safe & Vault Locksmith Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Safe Opening & Lockout Bypass",
                    description:
                      "Professional safe opening for gun safes, commercial cash drops, and home security safes.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Electronic Keypad Reset & Override",
                    description:
                      "Safe keypad diagnostic reset, dead-battery jump, and emergency bypass lock decoding.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Mechanical Dial Combination Changes",
                    description:
                      "Safe dial combination resetting, relocker maintenance, and wheel pack realignment.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Safe Lock Repair & Boltwork Servicing",
                    description:
                      "Safe boltwork lubrication, handle spindle alignment, and mechanical bolt lock servicing.",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Local Lock & Key Service",
        description:
          "24/7 Mobile Locksmith Service in Manchester, NH and 63+ Southern New Hampshire Communities.",
        publisher: {
          "@id": `${siteUrl}/#locksmith`,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: "24/7 Locksmith Manchester NH | Local Lock & Key Service",
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#locksmith`,
        },
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
