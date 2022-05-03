import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Box,
  Text,
  StatusBar,
  Center,
  HStack,
  Pressable
} from 'native-base';
import { Home as HomeIcon, Heart as HeartIcon, Message as MessageIcon, User as  UserIcon } from 'react-native-iconly'

export const BottomNavigation = ({selectedPage, navigation, backgroundColor}) => {

  const [selected, setSelected] = React.useState(1);

  return <Box backgroundColor={backgroundColor || "#f6f6f6"}>
    <HStack backgroundColor={backgroundColor || "#f6f6f6"} alignItems="center" safeAreaBottom>
      <Pressable
        cursor="pointer"
        // opacity={selected === 0 ? 1 : 0.5}
        opacity={selectedPage === "home" ? 1 : 0.5}
        py="3"
        flex={1}
        // onPress={() => setSelected(0)}
        onPress={ async () => {await navigation.navigate("ExplorePage")}}
      >
        <Center>
          <HomeIcon
            set="curved"
            primaryColor={"#6f61e8"}
            secondaryColor={"#6f61e8"}
            stroke="bold"
            size="medium"
            filled={true}
          />
        </Center>
      </Pressable>
      <Pressable
        cursor="pointer"
        // opacity={selected === 1 ? 1 : 0.5}
        opacity={selectedPage === "matches" ? 1 : 0.5}
        py="2"
        flex={1}
        onPress={ async () => {await navigation.navigate("MatchesPage")}}
      >
        <Center>
          <HeartIcon
            set="curved"
            primaryColor={"#6f61e8"}
            secondaryColor={"#6f61e8"}
            stroke="bold"
            size="medium"
            filled={true}
          />
        </Center>
      </Pressable>
      <Pressable
        cursor="pointer"jj
        // opacity={selected === 2 ? 1 : 0.6}
        opacity={selectedPage === "messages" ? 1 : 0.5}
        py="2"
        flex={1}
        onPress={ async () => {await navigation.navigate("MessagesPage")}}
      >
        <Center>
          <MessageIcon
            set="curved"
            primaryColor={"#6f61e8"}
            secondaryColor={"#6f61e8"}
            stroke="bold"
            size="medium"
            filled={true}
          />
        </Center>
      </Pressable>
      <Pressable
        cursor="pointer"
        // opacity={selected === 3 ? 1 : 0.5}
        opacity={selectedPage === "profile" ? 1 : 0.5}
        py="2"
        flex={1}
        // onPress={() => setSelected(3)}
        onPress={ async () => {await navigation.navigate("ProfilePage")}}
      >
        <Center>
          <UserIcon
            set="curved"
            primaryColor={"#6f61e8"}
            secondaryColor={"#6f61e8"}
            stroke="bold"
            size="medium"
            filled={true}
          />
        </Center>
      </Pressable>
    </HStack>
  </Box>
}
