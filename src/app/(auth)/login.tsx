import Button from "@/components/Button";
import { useAuth } from "@/providers/auth-provider";
import { Link, router } from "expo-router";
import { CircleAlert } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordField = useRef<TextInput>(null);

  const { login } = useAuth();

  const onSubmit = async () => {
    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await login(email, password);

      if (! result.success && result.errors) {
        setErrors(result.errors);
      } else if (result.success) {
        router.replace("/(tabs)/home");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={brandingStyles.container}>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>
          San Juan City Disaster Risk Reduction and Management Office
        </Text>
      </View>
      <View style={formStyles.container}>
        <Text style={formStyles.title}>Log in to your account</Text>

        <Text style={formStyles.label}>Email Address</Text>
        <TextInput
          style={formStyles.input}
          inputMode="email"
          placeholder="email@example.com"
          placeholderTextColor="#A9A9A9"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          value={email}
          onChangeText={(val) => {
            setErrors({});
            setEmail(val);
          }}
          onSubmitEditing={() => passwordField.current?.focus()}
          editable={! isSubmitting}
        />
        {errors.email && (
          <View style={formStyles.errorContainer}>
            <CircleAlert size={12} color="white" />
            <Text style={formStyles.errorText}>{errors.email[0]}</Text>
          </View>
        )}

        <Text style={formStyles.label}>Password</Text>
        <TextInput
          ref={passwordField}
          style={formStyles.input}
          placeholder="********"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
          value={password}
          onChangeText={(val) => {
            setErrors({});
            setPassword(val);
          }}
          autoCapitalize="none"
          onSubmitEditing={onSubmit}
          editable={!isSubmitting}
        />
        {errors.password && (
          <View style={formStyles.errorContainer}>
            <CircleAlert size={15} color="white" />
            <Text style={formStyles.errorText}>{errors.password[0]}</Text>
          </View>
        )}

        <Button
          title={isSubmitting ?  "Logging in..." : "Login"}
          onPress={onSubmit}
        />

        <Link style={formStyles.forgotPassword} href="/(auth)/forgot-password">
          <Text style={{ color: "#FFFFFF" }}>Forgot Password</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 50,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FFFFFF",
  },
});

const brandingStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 30,
  },
});

const formStyles = StyleSheet. create({
  container: {
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    color: "#FFFFFF",
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: -10,
  },
  errorText: {
    color: "#FFFFFF",
    marginLeft: 5,
    fontSize: 12,
  },
  forgotPassword: {
    marginTop: 15,
    alignSelf: "center",
  },
});