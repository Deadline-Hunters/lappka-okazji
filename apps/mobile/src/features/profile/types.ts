import type { DealCategory } from "@/features/deals/types";

/**
 * User submission status.
 */
export type SubmissionStatus = "active" | "expired";

/**
 * User profile data transfer object (DTO).
 */
export interface UserProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  isVerified: boolean;
  createdAt?: string;
}

/**
 * User activity statistics (DTO).
 */
export interface ProfileStatsDto {
  submissionsCount: number;
  confirmationsCount: number;
  lappsyBalance: number | null;
}

/**
 * Single user submission data transfer object (DTO).
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
 * Top-level DTO aggregating all profile view data.
 */
export interface ProfileDto {
  user: UserProfileDto;
  stats: ProfileStatsDto;
  submissions: MySubmissionDto[];
}

/**
 * Profile screen tab keys.
 */
export type ProfileTab = "submissions" | "radar";
