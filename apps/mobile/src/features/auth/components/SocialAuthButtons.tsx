import { Text, View } from "react-native";

import { Button } from "@/components/Button";

import { authStyles } from "../authStyles";

export function SocialAuthButtons() {
  return (
    <>
      <View style={authStyles.divider}>
        <View style={authStyles.dividerLine} />
        <Text style={authStyles.dividerText}>SSO WKRÓTCE</Text>
        <View style={authStyles.dividerLine} />
      </View>
      <View style={authStyles.socialRow}>
        <Button
          label="Google"
          icon="logo-google"
          variant="surface"
          disabled
          style={authStyles.socialButton}
        />
        <Button
          label="Apple"
          icon="logo-apple"
          variant="dark"
          disabled
          style={authStyles.socialButton}
        />
      </View>
    </>
  );
}
