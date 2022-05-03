import React from 'react';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {IconlyProvider} from 'react-native-iconly';
import {SSRProvider} from '@react-aria/ssr';

//Application
import Router from './routes';

export default () => (
  <NativeBaseProvider>
    <ActionSheetProvider>
      <NavigationContainer>
        <IconlyProvider>
          <SSRProvider>
            <Router />
          </SSRProvider>
        </IconlyProvider>
      </NavigationContainer>
    </ActionSheetProvider>
  </NativeBaseProvider>
);
