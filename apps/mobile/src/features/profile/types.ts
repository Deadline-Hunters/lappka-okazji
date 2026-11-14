import type { DealCategory } from "@/features/deals/types";

/**
 * Status zgłoszenia użytkownika.
 */
export type SubmissionStatus = "active" | "expired";

/**
 * Dane profilowe użytkownika (DTO).
 */
export interface UserProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string | null;
  isVerified: boolean;
  createdAt?: string;
}

/**
 * Statystyki aktywności użytkownika (DTO).
 */
export interface ProfileStatsDto {
  submissionsCount: number;
  confirmationsCount: number;
  lappsyBalance: number | null;
}

/**
 * Dane pojedynczego zgłoszenia użytkownika (DTO).
 */
export interface MySubmissionDto {
  id: string;
  title: string;
  storeName: string;
  address?: string | null;
  category: DealCategory | string;
  price: number;
  oldPrice?: number | null;
  discountLabel?: string | null;
  createdAt: string;
  validUntil: string;
  status: SubmissionStatus;
  confirmationsCount: number;
}

/**
 * Nadrzędne DTO agregujące wszystkie dane widoku profilu.
 */
export interface ProfileDto {
  user: UserProfileDto;
  stats: ProfileStatsDto;
  submissions: MySubmissionDto[];
}

/**
 * Zakładki ekranu profilu.
 */
export type ProfileTab = "submissions" | "radar";
