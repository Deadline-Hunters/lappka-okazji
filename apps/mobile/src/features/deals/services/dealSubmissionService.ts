import { supabase } from "@/lib/supabase";
import type { DealFormData } from "../validation/dealFormValidation";
import { getCalculatedExpirationDate } from "../validation/dealFormValidation";

export type SubmitDealResult = {
  dealId: string;
  imageUrl?: string;
};

/**
 * Uploads an image from a local file URI to Supabase Storage bucket 'deal-images'.
 * Returns the public URL of the uploaded image.
 */
export async function uploadDealImage(
  imageUri: string,
  userId: string,
): Promise<{ path: string; publicUrl: string }> {
  const extension = imageUri.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${extension}`;
  const filePath = `${userId}/${fileName}`;

  const response = await fetch(imageUri);
  const blob = await response.blob();

  const mimeType =
    extension === "png"
      ? "image/png"
      : extension === "webp"
        ? "image/webp"
        : "image/jpeg";

  const { error: uploadError } = await supabase.storage
    .from("deal-images")
    .upload(filePath, blob, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Błąd przesyłania zdjęcia: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("deal-images").getPublicUrl(filePath);

  return { path: filePath, publicUrl };
}

/**
 * Removes an uploaded image from Supabase Storage bucket 'deal-images'.
 * Used for cleanup if deal creation fails.
 */
export async function deleteDealImage(path: string): Promise<void> {
  try {
    await supabase.storage.from("deal-images").remove([path]);
  } catch (err) {
    console.error("[dealSubmissionService] Failed to cleanup image:", err);
  }
}

/**
 * Publishes a deal to Supabase.
 * - Handles image upload to Supabase Storage (if photo was attached)
 * - Calls 'submit_deal' RPC
 * - Cleans up uploaded photo if database insertion fails
 * - Returns the created deal's ID
 */
export async function submitDeal(
  formData: DealFormData,
  userId: string,
): Promise<SubmitDealResult> {
  let uploadedPath: string | null = null;
  let publicImageUrl: string | undefined;

  try {
    // 1. Upload photo if present
    if (formData.imageUri) {
      const uploadResult = await uploadDealImage(formData.imageUri, userId);
      uploadedPath = uploadResult.path;
      publicImageUrl = uploadResult.publicUrl;
    }

    // 2. Prepare publication payload
    const validUntilDate = getCalculatedExpirationDate(
      formData.expirationType,
      formData.customDate,
    );

    const rpcParams = {
      // validateAll() guarantees a category before submission.
      p_category_id: formData.category!,
      p_title: formData.title.trim(),
      p_valid_until: validUntilDate.toISOString(),
      p_price: formData.price ?? 0,
      p_location_id: formData.selectedStoreId || undefined,
      p_location_name: formData.storeName.trim() || undefined,
      p_location_address: formData.storeAddress.trim() || undefined,
      p_location_latitude: formData.location?.latitude,
      p_location_longitude: formData.location?.longitude,
      p_description: formData.description.trim() || undefined,
      p_image_url: publicImageUrl,
    };

    const { data: dealId, error } = await supabase.rpc(
      "submit_deal",
      rpcParams,
    );

    if (error) {
      throw new Error(`Błąd zapisu okazji: ${error.message}`);
    }

    return {
      dealId: typeof dealId === "string" ? dealId : String(dealId),
      imageUrl: publicImageUrl,
    };
  } catch (error) {
    // Clean up uploaded image on failure to prevent orphaned files
    if (uploadedPath) {
      await deleteDealImage(uploadedPath);
    }
    throw error;
  }
}
