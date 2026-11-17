import type { Coupon } from "./types";

// Test data until affiliate coupons are connected to the backend (KAN-15).
const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};

const createMockCoupons = (): Coupon[] => [
  {
    id: "coupon-costa",
    brandName: "Costa Coffee",
    brandLogoBackground: "#F3EDE3",
    categoryLabel: "Kawiarnie stacjonarne",
    discountLabel: "-60%",
    price: 6,
    oldPrice: 15,
    title: "Drugi napój na hasło studenckie",
    description:
      "Kup dowolną kawę lub herbatę w rozmiarze M/L, a drugi napój tej samej lub mniejszej pojemności zgarniesz z mega rabatem!",
    validUntil: daysFromNow(4),
    qrCode: "LAPPKA-STUDENT24",
    code: "LAPPKA-STUDENT24",
  },
  {
    id: "coupon-pizza-hut",
    brandName: "Pizza Hut",
    brandLogoBackground: "#F6E2D8",
    categoryLabel: "Pizzerie • Dostawa i na miejscu",
    discountLabel: "-30%",
    price: 29,
    oldPrice: 41,
    title: "Duża pizza dla studenta",
    description:
      "Wybierz dowolną dużą pizzę z klasycznego menu i zapłać studencką cenę.",
    validUntil: daysFromNow(12),
    code: "PIZZA-STUDENT30",
    qrCode: "PIZZA-STUDENT30",
  },
  {
    id: "coupon-kfc",
    brandName: "KFC",
    brandLogoBackground: "#F6E8DE",
    categoryLabel: "Fast Food • Na miejscu i z odbiorem",
    discountLabel: "-38%",
    price: 19.99,
    oldPrice: 32,
    title: "Kubetek Student Box",
    validUntil: daysFromNow(3),
    qrCode: "KFC-STUDENT-BOX",
  },
  {
    id: "coupon-bubble-tea",
    brandName: "Bubble Tea Kraków",
    brandLogoBackground: "#F3E3EC",
    categoryLabel: "Herbaciarnie • Na wynos",
    discountLabel: "2 za 1",
    price: 17.9,
    oldPrice: 35.8,
    title: "Dwa bubble tea w cenie jednego",
    description:
      "Wybierz dwa dowolne napoje z menu i zapłać tylko za jeden. Oferta dostępna na miejscu i na wynos.",
    validUntil: daysFromNow(9),
    code: "BUBBLE-2ZA1",
    qrCode: "BUBBLE-2ZA1",
  },
  {
    id: "coupon-cinema-city",
    brandName: "Cinema City",
    brandLogoBackground: "#EDE6F3",
    categoryLabel: "Kina wielosalowe • 2D & 3D",
    title: "Bilet do kina w środy",
    description:
      "Obowiązuje na wszystkie seanse 2D z ważną legitymacją studencką.",
    validUntil: daysFromNow(30),
    price: 18,
  },
];

// Stands in for the affiliate coupons API until it is connected (KAN-15).
export async function fetchCoupons(): Promise<Coupon[]> {
  return createMockCoupons();
}
