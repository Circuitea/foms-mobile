import Button from "@/components/Button";
import api from "@/lib/api";
import { router } from "expo-router";
import { ArrowLeft, CircleAlert, CircleCheck } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async () => {
    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await api.post("/forgot-password", { email });

      if (response.data.errors) {
        setErrors(response.data.errors);
        return;
      }

      setIsSuccess(true);
    } catch (error) {
      setErrors({ email: ["Something went wrong. Please try again."] });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <CircleCheck size={64} color="#10B981" />
          <Text style={styles.successTitle}>Check your email</Text>
          <Text style={styles.successText}>
            We've sent a password reset link to {email}
          </Text>
          <Button
            title="Back to Login"
            onPress={() => router. replace("/(auth)/login")}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={formStyles.container}>
        <Text style={formStyles.title}>Reset Password</Text>
        <Text style={formStyles. subtitle}>
          Enter your email address and we'll send you a link to reset your
          password. 
        </Text>

        <Text style={formStyles.label}>Email Address</Text>
        <TextInput
          style={formStyles.input}
          inputMode="email"
          placeholder="email@example.com"
          placeholderTextColor="#A9A9A9"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="send"
          value={email}
          onChangeText={(val) => {
            setErrors({});
            setEmail(val);
          }}
          onSubmitEditing={onSubmit}
          editable={!isSubmitting}
        />
        {errors.email && (
          <View style={formStyles.errorContainer}>
            <CircleAlert size={12} color="white" />
            <Text style={formStyles.errorText}>{errors.email[0]}</Text>
          </View>
        )}

        <Button
          title={isSubmitting ?  "Sending..." : "Send Reset Link"}
          onPress={onSubmit}
        />

        <TouchableOpacity
          style={formStyles.backToLogin}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={formStyles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
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
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  successContainer: {
    alignItems: "center",
    padding: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
  },
});

const formStyles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
    opacity: 0.8,
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
  backToLogin: {
    marginTop: 20,
    alignSelf: "center",
  },
  backToLoginText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});