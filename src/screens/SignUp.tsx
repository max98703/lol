import React, { useState, useContext } from "react";
import auth from "@react-native-firebase/auth";
import {
  Text,
  View,
  Image,
  TextInput,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView
} from "react-native";
import LinearGradient from "react-native-linear-gradient"; // Gradient effect
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Icons
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; // Handles input shifts
import { NotificationContext } from "../context/NotificationContext";

import backImage from "../assets/app_images/background.png";

const SignUp = ({ navigation }: any) => {
  const { showToast } = useContext(NotificationContext);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const onHandleSignup = async () => {
    if (!email || !password || !username) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        await user.sendEmailVerification(); // Send verification email
        showToast("Verification email sent! Please check your inbox.", "success");
        navigation.navigate("Login"); // Navigate to Login
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Image source={backImage} style={styles.backImage} />
          <View style={styles.whiteSheet} />

          <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <SafeAreaView style={styles.form}>
              <Text style={styles.title}>Sign Up</Text>

              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Icon name="account" size={24} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter name"
                  placeholderTextColor="#aaa"
                  autoCapitalize="words"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Icon name="email" size={24} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter email"
                  placeholderTextColor="#aaa"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Icon name="lock" size={24} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  placeholderTextColor="#aaa"
                  autoCapitalize="none"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity onPress={onHandleSignup} disabled={loading} activeOpacity={0.8}>
  <LinearGradient
    colors={['#ff758c', '#ff7eb3']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.button}
  >
    {loading ? (
      <ActivityIndicator size="small" color="#fff" />
    ) : (
      <Text style={styles.buttonText}>Sign Up</Text>
    )}
  </LinearGradient>
</TouchableOpacity>

              {/* Navigate to Login */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLink}>Log In</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </KeyboardAwareScrollView>

          <StatusBar barStyle="light-content" />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backImage: {
    height: 340,
    position: "absolute",
    resizeMode: "cover",
    top: 0,
    width: "100%",
  },
  whiteSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 60,
    bottom: 0,
    height: "75%",
    position: "absolute",
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  form: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    color: "#333",
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F7FB",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 12,
    width: "100%",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: "#333",
  },
  button: {
    alignItems: 'center',
    borderRadius: 30, // More rounded corners
    height: 55,
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 10, // Better vertical padding
    paddingHorizontal: 30, // More balanced horizontal padding
    shadowColor: '#ff758c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android shadow effect
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 10, // Padding inside text
    paddingVertical: 5, // Balanced text spacing
  },
  loginContainer: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    color: "gray",
    fontWeight: "600",
    fontSize: 14,
  },
  loginLink: {
    color: "#ff758c",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default SignUp;