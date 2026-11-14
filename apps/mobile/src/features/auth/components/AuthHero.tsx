import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { colors } from "@/theme";
import { authStyles } from "../authStyles";

export function AuthHero() {
  return (
    <View style={authStyles.hero}>
      <View style={authStyles.mascot}>
        <Ionicons name="paw" size={54} color={colors.primary} />
      </View>
      <View style={authStyles.brandBadge}>
        <Ionicons name="paw" size={17} color={colors.primary} />
        <Text style={authStyles.brandText}>Łappka Okazji</Text>
        <View style={authStyles.dot} />
        <Text style={authStyles.studentsText}>15k+ studentów</Text>
      </View>
      <Text style={authStyles.heroTitle}>
        Łap najlepsze okazje w Twojej okolicy!
      </Text>
      <Text style={authStyles.heroSubtitle}>
        Dołącz do społeczności łowców promocji. Oszczędzaj na kawie, jedzeniu i
        zakupach każdego dnia.
      </Text>
    </View>
  );
}
