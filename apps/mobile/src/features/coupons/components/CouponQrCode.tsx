import { StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { colors } from "@/theme";

type Props = {
  value: string;
  size?: number;
};

export function CouponQrCode({ value, size = 176 }: Props) {
  return (
    <View
      style={[styles.tile, { width: size, height: size }]}
      accessibilityRole="image"
      accessibilityLabel="Kod QR kuponu"
    >
      <QRCode
        value={value}
        size={size - 28}
        color={colors.couponQrModule}
        backgroundColor={colors.couponQrTile}
        ecl="M"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.couponQrTile,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
