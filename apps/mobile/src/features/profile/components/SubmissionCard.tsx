import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { formatPrice } from "@/features/deals/types";
import { colors, radius, spacing } from "@/theme";

import type { MySubmissionDto } from "../types";
import {
  calculateDiscountPercent,
  formatRelativeTime,
  getCategoryMeta,
} from "../utils/formatters";
import { SubmissionStatusBadge } from "./SubmissionStatusBadge";

interface Props {
  submission: MySubmissionDto;
}

export function SubmissionCard({ submission }: Props) {
  const categoryMeta = getCategoryMeta(submission.category, submission.title);
  const formattedTime = formatRelativeTime(submission.createdAt);
  const calculatedDiscount = calculateDiscountPercent(
    submission.price,
    submission.oldPrice,
  );
  const discountText =
    submission.discountLabel ??
    (calculatedDiscount ? `-${calculatedDiscount}%` : null);

  const locationSubtitle = submission.address
    ? `${submission.storeName} • ${submission.address}`
    : submission.storeName;

  return (
    <View style={styles.card}>
      {/* Górny wiersz: ikona kategorii, tytuł, sklep, status badge */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.categoryCircle,
            { backgroundColor: categoryMeta.backgroundColor },
          ]}
        >
          <Ionicons
            name={categoryMeta.iconName}
            size={22}
            color={categoryMeta.iconColor}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {submission.title}
          </Text>
          <Text style={styles.storeSubtitle} numberOfLines={1}>
            {locationSubtitle}
          </Text>
        </View>

        <SubmissionStatusBadge
          status={submission.status}
          confirmationsCount={submission.confirmationsCount}
        />
      </View>

      {/* Dolny wiersz: ceny, rabat oraz czas */}
      <View style={styles.bottomRow}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(submission.price)}</Text>

          {submission.oldPrice != null && (
            <Text style={styles.oldPrice}>
              {formatPrice(submission.oldPrice)}
            </Text>
          )}

          {discountText && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountText}</Text>
            </View>
          )}
        </View>

        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={styles.timeText}>{formattedTime}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: "#1E1B24",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0EDF5",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  categoryCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.2,
  },
  storeSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md + 2,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  price: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.5,
  },
  oldPrice: {
    fontSize: 14,
    color: "#8E8A96",
    textDecorationLine: "line-through",
  },
  discountBadge: {
    backgroundColor: "#E2F674",
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  discountText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#3F5600",
    letterSpacing: -0.2,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
  },
});
