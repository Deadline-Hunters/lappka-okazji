import type { DealCategory } from "../types";
import { hasProfanity, PROFANITY_ERROR_MESSAGE } from "./profanity";
import type { LatLng } from "../../../lib/geo";

export type ExpirationType = "today" | "tomorrow" | "custom";

export type DealFormData = {
  // Step 1: Szczegóły okazji
  title: string;
  category: DealCategory | null;
  imageUri: string | null;
  price?: number;

  // Step 2: Lokalizacja okazji
  location: LatLng | null;
  selectedStoreId: string | null;
  storeName: string;
  storeAddress: string;

  // Step 3: Publikacja okazji
  expirationType: ExpirationType;
  customDate: Date | null;
  description: string;
};

export type DealFormErrors = {
  title?: string;
  category?: string;
  price?: string;
  location?: string;
  storeName?: string;
  validUntil?: string;
  description?: string;
};

export const INITIAL_FORM_DATA: DealFormData = {
  title: "",
  category: null,
  imageUri: null,
  price: undefined,

  location: null,
  selectedStoreId: null,
  storeName: "",
  storeAddress: "",

  expirationType: "today",
  customDate: null,
  description: "",
};

export function getCalculatedExpirationDate(
  type: ExpirationType,
  customDate: Date | null,
): Date {
  const date = new Date();

  if (type === "today") {
    // End of today: 23:59:59
    date.setHours(23, 59, 59, 999);
    return date;
  }

  if (type === "tomorrow") {
    // End of tomorrow: 23:59:59
    date.setDate(date.getDate() + 1);
    date.setHours(23, 59, 59, 999);
    return date;
  }

  if (customDate) {
    return customDate instanceof Date ? customDate : new Date(customDate);
  }

  // Fallback: 3 days ahead
  date.setDate(date.getDate() + 3);
  date.setHours(23, 59, 59, 999);
  return date;
}

export function validateStep1(data: Partial<DealFormData>): {
  isValid: boolean;
  errors: DealFormErrors;
} {
  const errors: DealFormErrors = {};
  const trimmedTitle = (data.title ?? "").trim();

  if (!trimmedTitle) {
    errors.title = "Wprowadź tytuł okazji";
  } else if (trimmedTitle.length < 3) {
    errors.title = "Tytuł musi mieć co najmniej 3 znaki";
  } else if (trimmedTitle.length > 120) {
    errors.title = "Tytuł może mieć maksymalnie 120 znaków";
  } else if (hasProfanity(trimmedTitle)) {
    errors.title = PROFANITY_ERROR_MESSAGE;
  }

  if (!data.category) {
    errors.category = "Wybierz kategorię okazji";
  }

  if (data.price != null && (isNaN(data.price) || data.price < 0)) {
    errors.price = "Cena nie może być ujemna";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStep2(data: Partial<DealFormData>): {
  isValid: boolean;
  errors: DealFormErrors;
} {
  const errors: DealFormErrors = {};

  if (!data.location) {
    errors.location = "Wybierz lokalizację okazji na mapie";
  }

  const trimmedStore = (data.storeName ?? "").trim();
  if (!trimmedStore) {
    errors.storeName = "Wybierz sklep z listy lub wskaż miejsce na mapie";
  } else if (trimmedStore.length > 120) {
    errors.storeName = "Nazwa miejsca może mieć maksymalnie 120 znaków";
  } else if (hasProfanity(trimmedStore)) {
    errors.storeName = PROFANITY_ERROR_MESSAGE;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStep3(data: Partial<DealFormData>): {
  isValid: boolean;
  errors: DealFormErrors;
} {
  const errors: DealFormErrors = {};

  const expDate = getCalculatedExpirationDate(
    data.expirationType ?? "today",
    data.customDate ?? null,
  );

  if (expDate.getTime() <= Date.now()) {
    errors.validUntil = "Termin ważności nie może być w przeszłości";
  }

  const trimmedDesc = (data.description ?? "").trim();
  if (trimmedDesc) {
    if (trimmedDesc.length > 1000) {
      errors.description = "Wskazówka może mieć maksymalnie 1000 znaków";
    } else if (hasProfanity(trimmedDesc)) {
      errors.description = PROFANITY_ERROR_MESSAGE;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateAll(data: DealFormData): {
  isValid: boolean;
  errors: DealFormErrors;
} {
  const s1 = validateStep1(data);
  const s2 = validateStep2(data);
  const s3 = validateStep3(data);

  const errors: DealFormErrors = {
    ...s1.errors,
    ...s2.errors,
    ...s3.errors,
  };

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
