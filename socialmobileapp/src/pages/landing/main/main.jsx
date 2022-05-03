import React, {Component, useEffect, useState} from 'react';
import { StyleSheet } from 'react-native';
import {
  Box,
  Text,
  Button,
  VStack,
  Heading,
  Center,
  Image,
  View,
  Progress
} from 'native-base';
import { Illustration } from "./assets/Illustration";
import SafeAreaView from 'react-native/Libraries/Components/SafeAreaView/SafeAreaView';
import {DIMENSION_HEIGHT, DIMENSION_WIDTH} from '../../../assets/styles';

let interval = undefined;

const Content = () => {
  const [running, setRunning] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (running) {
      interval = setInterval(() => {
        setProgress((prev) => prev + 10);
      }, 1);
    } else {
      clearInterval(interval);
    }
  }, [running]);

  useEffect(() => {
    if (progress === 90) {
      setRunning(false);
      clearInterval(interval);
    }
  }, [progress]);

  return (<View style={{backgroundColor: "#6f61e8", height: "100%", width: "100%"}}>
      <View bg="#6f61e8">
        <Center>
          <VStack space={2}>
            <Image
              source={require("./assets/logo-bg.jpg")}
              styles={styles.mainImage}
              maxW={450}
              maxH={450}
              mt={DIMENSION_HEIGHT / 7}
              alt={"Logo"}
            />
            <Progress
              size="md"
              ml={DIMENSION_WIDTH / 5.6}
              mr={4}
              value={progress}
              maxW={DIMENSION_WIDTH - 120}
              justifyItems={"center"}
              colorScheme="white"
              _filledTrack={{
                bg: "white"
              }}
            />
          </VStack>
        </Center>
      </View>
    </View>
  );

}

export class Main extends Component {

  constructor() {
    super();
  }

  async componentDidMount() {
    const loggedIn = await this.props.authenticator.isLoggedIn();
    if(loggedIn) {
      this.props.navigation.navigate("ExplorePage");
    } else {
      this.props.navigation.navigate("LogInPage");
    }
  }

  render() {
    return <Content />
  }
}

const styles = StyleSheet.create({
  mainImage: {
    marginTop: DIMENSION_HEIGHT / 2
  },

  buttonGroup: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 50
  },

  signUpButton: {
    borderRadius: 50,
    width: "100%",
    backgroundColor: "#0e7490"
  },

  loginButton: {
    borderRadius: 50,
    width: "100%",
    borderColor: "#0e7490"
  },

  createAccountButton: {
    justifyContent: "center",
    alignItems: "center",
  }
})
