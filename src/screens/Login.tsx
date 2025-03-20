import React, { useState, useEffect, useContext } from 'react';
import auth from '@react-native-firebase/auth';
import { Dimensions } from 'react-native';
import {
  Text,
  View,
  Image,
  TextInput,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NotificationContext } from '../context/NotificationContext';
import writeData from "../utils/writeData";

const { height, width } = Dimensions.get('window');

const Login = ({ navigation }:any) => {
  const { showToast } = useContext(NotificationContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function configureGoogleSignIn() {
      try {
        await GoogleSignin.configure({
          webClientId: '764159896157-50nu1umedvkccgubppeqonj4slu3rd3f.apps.googleusercontent.com',
        });
        console.log('Google Sign-In configured successfully!');
      } catch (error) {
        console.error('Google Sign-In configuration error:', error);
      }
    }
    
    configureGoogleSignIn();
  }, []);

  const onHandleLogin = async () => {
    if (email !== '' && password !== '') {
      setLoading(true);
      try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
  
        if (user.emailVerified) {
          console.log(user);
          await writeData('users',{email :user?.email, name: user?.displayName  , uid:user?.uid  ,photoURL : user?.photoURL, phoneNumber: user?.phoneNumber} )
          // showToast('Login successful', 'success');
        } else {
          await user.sendEmailVerification();
          showToast('Please verify your email. A verification link has been sent again.', 'error');
        } 
      } catch (error) {
        showToast(error.message, 'error');
      } finally {
        setLoading(false);
      }
    } else {
      showToast('Please fill in all fields.', 'error');
    }
  };

  const onGoogleLogin = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign-In Success:', userInfo);
      showToast('Google Sign-In successful', 'success');
    } catch (error) {
      showToast('Google Sign-In failed', 'error');
    }
  };

  return (
    <LinearGradient colors={['#3a1c71', '#d76d77', '#ffaf7b']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Image source={require('../assets/app_images/background.png')} style={styles.backImage} />

      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        
        <Text style={styles.title}>Welcome Back</Text>
        
        <View style={styles.inputContainer}>
          <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#888"
            autoCapitalize="none"
            secureTextEntry
            textContentType="password"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && { backgroundColor: '#aaa' }]} 
          onPress={onHandleLogin} 
          disabled={loading}
        >
          <LinearGradient
            colors={['#3a1c71', '#d76d77']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.fullWidthButton,loading && { opacity: 0.7 }]}
          >
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Sign-Up Navigation */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpButton}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Google Sign-In Button */}
        <TouchableOpacity style={styles.fullWidthButtonGoogle} onPress={onGoogleLogin} activeOpacity={0.8}>
          {/* <Image source={require('../assets/google-icon.png')} style={styles.googleIcon} /> */}
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backImage: {
    height: 320,
    position: 'absolute',
    resizeMode: 'cover',
    top: 0,
    width: '100%',
  },
  whiteSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    position: 'absolute',
    bottom: 0,
    height: '70%',
    width: '100%',
  },
  fullWidthButton: {
    alignItems: 'center',
    height: height * 0.07,
    justifyContent: 'center',
    width: '100%', // Full width like Google Sign-In
    borderRadius: 12,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3a1c71',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7FB',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: '100%',
    height: height * 0.07,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: '#3a1c71',
    borderRadius: 12,
    width: '100%',
    height: height * 0.07,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,

  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  signUpText: {
    color: 'gray',
    fontSize: 14,
  },
  signUpButton: {
    color: '#3a1c71',
    fontWeight: '600',
    fontSize: 14,
  },
  fullWidthButtonGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a1c71', // Matching the app gradient color
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    justifyContent: 'center',
    width:'100%',
    shadowColor: '#3a1c71',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
});