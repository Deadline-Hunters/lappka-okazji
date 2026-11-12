import type { ProfileDto } from "../types";

const now = new Date();

function getTodayAt(hours: number, minutes: number): string {
  const d = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
  );
  return d.toISOString();
}

function getDaysAgo(days: number, hours = 12, minutes = 0): string {
  const d = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - days,
    hours,
    minutes,
  );
  return d.toISOString();
}

export const MOCK_PROFILE: ProfileDto = {
  user: {
    id: "usr_kasia_kowalska_42",
    firstName: "Kasia",
    lastName: "Kowalska",
    username: "Kasia_UJ",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    isVerified: true,
    createdAt: "2025-01-15T10:00:00.000Z",
  },
  stats: {
    submissionsCount: 42,
    confirmationsCount: 186,
    lappsyBalance: 150,
  },
  submissions: [
    {
      id: "sub-1",
      title: "Kawa 2 za 1",
      storeName: "Żabka",
      address: "Rynek Główny",
      category: "kawa",
      price: 6.0,
      oldPrice: 12.0,
      discountLabel: "-50%",
      createdAt: getTodayAt(14, 20),
      validUntil: getDaysAgo(-1, 23, 59),
      status: "active",
      confirmationsCount: 14,
    },
    {
      id: "sub-2",
      title: "Pizza z pieca -40% po 20:00",
      storeName: "Pizzeria Trattoria",
      address: null,
      category: "jedzenie",
      price: 14.99,
      oldPrice: 24.99,
      discountLabel: null,
      createdAt: getDaysAgo(1, 19, 30),
      validUntil: getDaysAgo(1, 23, 0),
      status: "expired",
      confirmationsCount: 28,
    },
    {
      id: "sub-3",
      title: "Lody Marletto 2+1 GRATIS",
      storeName: "Biedronka Floriańska",
      address: null,
      category: "jedzenie",
      price: 9.99,
      oldPrice: null,
      discountLabel: "2+1 GRATIS",
      createdAt: getDaysAgo(2, 11, 15),
      validUntil: getDaysAgo(-2, 21, 0),
      status: "active",
      confirmationsCount: 9,
    },
    {
      id: "sub-4",
      title: "Croissant maślany -50%",
      storeName: "Awiteks",
      address: "Grodzka 12",
      category: "jedzenie",
      price: 2.5,
      oldPrice: 5.0,
      discountLabel: "-50%",
      createdAt: getDaysAgo(4, 8, 45),
      validUntil: getDaysAgo(3, 18, 0),
      status: "expired",
      confirmationsCount: 19,
    },
  ],
};
