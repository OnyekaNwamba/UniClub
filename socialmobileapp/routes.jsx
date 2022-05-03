import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Main } from "./src/pages/landing/main/main";
import { Api } from "./src/commons/api";
import { SignUpPage } from "./src/pages/signup/main/main";
import { LoginPage } from "./src/pages/login/main/main";
import { CompleteProfilePage } from "./src/pages/completeProfile/main/main";
import { ProfilePage } from "./src/pages/profile/main/main";
import { ExplorePage } from "./src/pages/explore/main/main";
import { Authenticator } from "./src/commons/authenticator";
import { MessagesPage } from "./src/pages/messages/main";
import TextsPage from "./src/pages/messages/texts";
import { MatchesPage } from "./src/pages/matches/main";
import { MatchedPage } from "./src/pages/explore/main/matched";

// Singletons
const api = new Api();
const Stack = createNativeStackNavigator();
const authenticator = new Authenticator();

// Create Firebase App
/** Credentials here have been removed for security
 * How to get your own Google Cloud credentials is specified in README file
 */
initializeApp({
  apiKey: "API_KEY",
  authDomain: "AUTH_DOMAIN",
  projectId: "PROJECT_ID",
  storageBucket: "STORAGE_BUCKET",
  messagingSenderId: "MESSAGING_SENDER_ID",
  appId: "APP+ID",
  measurementId: "MEASUREMENT_ID"
});
const firebaseDb = getFirestore();

// Router
// ----------------------------------------------------------------------------

export const screens = [
  {
    screenName: 'MainPage',
    content: (props) => <Main {...props} />
  },
  {
    screenName: 'SignUpPage',
    content: (props) => <SignUpPage {...props} />
  },
  {
    screenName: 'LogInPage',
    content: (props) => <LoginPage {...props} />
  },
  {
    screenName: 'CompleteProfilePage',
    content: (props) => <CompleteProfilePage {...props} />
  },
  {
    screenName: 'ProfilePage',
    content: (props) => <ProfilePage {...props} />
  },
  {
    screenName: 'ExplorePage',
    content: (props) => <ExplorePage {...props} />
  },
  {
    screenName: 'MatchesPage',
    content: (props) => <MatchesPage {...props} />
  },
  {
    screenName: 'MessagesPage',
    content: (props) => <MessagesPage {...props} />
  },
  {
    screenName: 'TextsPage',
    content: (props) => <TextsPage props={props} />
  },
  {
    screenName: 'MatchedPage',
    content: (props) => <MatchedPage {...props} />
  },
];

export const RouterBuilder = (screens) => {

  if (screens.some(s => s.screenName === undefined)) {
    throw new Error("screenName is required field");
  }



  return (
    <Stack.Navigator screenOptions={{ headerShown: false}}>
        {screens.map((screen, index) => (
          <Stack.Screen
            key={index}
            name={screen.screenName}
          >
            {props => screen.content({...props, api, authenticator, firebaseDb})}
          </Stack.Screen>
        ))}
    </Stack.Navigator>
  );
};

const Router = () => RouterBuilder(screens);
export default Router;

