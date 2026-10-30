import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { supabase } from "./src/lib/supabase";

export default function App() {
  const [message, setMessage] = useState("Sprawdzanie połączenia...");

  useEffect(() => {
    async function checkConnection() {
      const { error } = await supabase.auth.getSession();

      if (error) {
        setMessage(`Błąd Supabase: ${error.message}`);
        return;
      }

      setMessage("Połączenie z Supabase działa");
    }

    void checkConnection();
  }, []);

  return (
    <View>
      <Text>{message}</Text>
    </View>
  );
}
