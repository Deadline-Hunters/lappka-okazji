import type { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";

import type { Coupon } from "../types";

type Brand = Database["public"]["Tables"]["brands"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

type CouponRow = Database["public"]["Tables"]["coupons"]["Row"] & {
  brands: Pick<Brand, "name" | "logo_url" | "logo_background">;
  categories: Pick<Category, "emoji" | "label">;
};

const COUPON_SELECT = `
  id,
  title,
  description,
  price,
  old_price,
  discount_label,
  valid_until,
  code,
  qr_code,
  brands!coupons_brand_id_fkey ( name, logo_url, logo_background ),
  categories!coupons_category_id_fkey ( emoji, label )
`;

/**
 * Fetches affiliate coupons from Supabase.
 *
 * Expired coupons are skipped, and the offer ending soonest is listed first.
 */
export async function fetchCoupons(): Promise<Coupon[]> {
  const { data, error } = await supabase
    .from("coupons")
    .select(COUPON_SELECT)
    .or(`valid_until.is.null,valid_until.gt.${new Date().toISOString()}`)
    .order("valid_until", { ascending: true, nullsFirst: false })
    // Both embeds are many-to-one foreign keys, so PostgREST returns a single
    // object per coupon. The generated types cannot infer that shape.
    .overrideTypes<CouponRow[], { merge: false }>();

  if (error) {
    throw new Error(`Failed to fetch coupons: ${error.message}`);
  }

  return (data ?? []).map((row): Coupon => ({
    id: row.id,
    brandName: row.brands.name,
    brandLogoUrl: row.brands.logo_url || undefined,
    brandLogoBackground: row.brands.logo_background ?? undefined,
    categoryLabel: `${row.categories.emoji} ${row.categories.label}`,
    title: row.title,
    description: row.description ?? undefined,
    price: row.price ?? undefined,
    oldPrice: row.old_price ?? undefined,
    discountLabel: row.discount_label ?? undefined,
    validUntil: row.valid_until ?? undefined,
    code: row.code ?? undefined,
    qrCode: row.qr_code ?? undefined,
  }));
}
