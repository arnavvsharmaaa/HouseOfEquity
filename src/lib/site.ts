// Single source of truth for brand, licensing and contact facts.
// Anything here appears in visible copy, disclosures and JSON-LD, so change it here only.

export const site = {
  name: "House of Equity",
  descriptor: "Home Equity & Mortgage Financing",
  tagline: "Good Things Start at Home.",
  url: "https://houseofequity.co",
  email: "mfardous@westcapitallending.com",
  phone: {
    display: "949-569-7945",
    href: "tel:+19495697945",
    e164: "+1-949-569-7945",
    sms: "sms:+19495697945",
  },
} as const;

export const advisor = {
  name: "Mohamad Fardous",
  shortName: "Mohamad",
  nmls: "1448893",
  title: "Independent Mortgage Broker & Equity Specialist",
  nmlsConsumerAccessUrl:
    "https://www.nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/1448893",
} as const;

export const sponsor = {
  name: "West Capital Lending, Inc.",
  shortName: "West Capital Lending",
  nmls: "1566096",
  caDre: "02022356",
  nmlsConsumerAccessUrl:
    "https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/1566096",
} as const;

export const nmlsConsumerAccessHome = "https://www.nmlsconsumeraccess.org/";

export const offices = [
  {
    id: "dearborn",
    city: "Dearborn",
    region: "MI",
    label: "Dearborn Regional Office",
    streetAddress: "22770 Arlington St",
    postalCode: "48128",
  },
  {
    id: "irvine",
    city: "Irvine",
    region: "CA",
    label: "Irvine Capital Center",
    streetAddress: "17911 Von Karman Ave, Suite 400",
    postalCode: "", // TODO: confirm ZIP (not supplied)
  },
] as const;

export const licensedStates = [
  "Alabama",
  "Arkansas",
  "Delaware",
  "Florida",
  "Idaho",
  "Iowa",
  "Kansas",
  "Maine",
  "Michigan",
  "Missouri",
  "Nebraska",
  "New Hampshire",
  "North Dakota",
  "Oklahoma",
  "Pennsylvania",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Virginia",
  "Washington",
  "Wisconsin",
  "Wyoming",
] as const;

// Marketing claims and their disclosures live in ./claims.ts.

/** PLACEHOLDERS: replace with Mohamad's real Zillow profile URL and current review count. */
export const zillow = {
  rating: "5.0",
  reviewCount: "XX",
  url: "https://www.zillow.com/profile/PLACEHOLDER-mohamad-fardous/",
} as const;

export const mainNav = [
  { href: "/home-equity-loan", label: "Home Equity" },
  { href: "/heloc", label: "HELOC" },
  { href: "/buy", label: "Buy" },
  { href: "/refinance", label: "Refinance" },
  { href: "/rate-match", label: "Rate Match" },
  { href: "/about", label: "About" },
] as const;

export const getStartedHref = "/contact";
