import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/Card";
import { PriceTag } from "@/components/PriceTag";
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
    <Card elevation="sm" style={styles.card}>
      {/* Top row: category icon, title, store name, status badge */}
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

      {/* Bottom row: prices, discount badge, and submission time */}
      <View style={styles.bottomRow}>
        <PriceTag
          price={submission.price}
          oldPrice={submission.oldPrice}
          discountLabel={discountText}
          size="lg"
          tone="default"
        />

        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={styles.timeText}>{formattedTime}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
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
