import { Text } from "react-native";

import { authStyles } from "../authStyles";

export function AuthTerms() {
  return (
    <Text style={authStyles.terms}>
      Kontynuując, akceptujesz{" "}
      <Text style={authStyles.underlined}>Regulamin</Text> oraz{" "}
      <Text style={authStyles.underlined}>Politykę prywatności</Text> Łappki
      Okazji.
    </Text>
  );
}
