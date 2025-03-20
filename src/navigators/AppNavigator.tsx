import React, { useEffect, useContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import auth from "@react-native-firebase/auth";
import { AuthenticatedUserContext } from "../context/AuthenticatedUserContext";
import { publicRoutes, privateRoutes } from "../navigation/routes";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(async (authenticatedUser) => {
      if (authenticatedUser) {
        await authenticatedUser.reload();
        if (authenticatedUser.emailVerified) {
          setUser(authenticatedUser);
        } else {
          auth().signOut();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribeAuth;
  }, []);

  if (isLoading) return null; // Prevent rendering until auth state is checked

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user
          ? privateRoutes.map(({ name, component, options }) => (
              <Stack.Screen key={name} name={name} component={component} options={options} />
            ))
          : publicRoutes.map(({ name, component, options }) => (
              <Stack.Screen key={name} name={name} component={component} options={options} />
            ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;