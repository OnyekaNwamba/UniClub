import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  Avatar,
  Heading
} from "native-base";
import { DIMENSION_HEIGHT, DIMENSION_WIDTH } from "../../../assets/styles/index"
import Confetti from 'react-native-confetti';
import { setDoc, doc } from "firebase/firestore";
import { Match } from "../../../models/Match";

export class MatchedPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      matchId: undefined
    }
  }

  async componentDidMount() {
    if(this._confettiView) {
      this._confettiView.startConfetti();
    }
    const user = this.props.route.params.user;
    const otherUser = this.props.route.params.other;

    const match = new Match(`${user.userId}_${otherUser.userId}`, user.userId, otherUser.userId);
    const response = await this.props.api.putMatch(match);

    if(!response.isError) {
      this.setState({
        matchId: match.matchId
      })
    } else {
      console.log(response.error);
    }

    // chatId is the same as the matchId
    const chatId = this.state.matchId;
    const docRef = doc(this.props.firebaseDb, "chats", chatId);

    try {
      await setDoc(docRef, {
        messages: [],
        user1: user.userId,
        user2: otherUser.userId
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  onMessagePressHandler = async () => {
    const user = this.props.route.params.user;
    const otherUser = this.props.route.params.other;
    this.props.navigation.navigate("TextsPage", {chatId: this.state.matchId, user: user.userId, otherUser: otherUser.userId})
  }

  render() {
   const user = this.props.route.params.user;
   const otherUser = this.props.route.params.other;

    return(
      <ImageBackground source={require("../../../assets/images/match_bg.png")} style={styles.bg}>
        <Confetti
          ref={(node) => this._confettiView = node}
          confettiCount={2000}
          size={1.5}
          bsize={10}
        />
        <SafeAreaView>
          <View style={styles.avatarGroup}>
            <Avatar.Group max={2} size={150}>
              <Avatar
                bg="green.500"
                source={{
                  uri: user.profilePicture
                }}
              >
                AJ
              </Avatar>
              <Avatar
                styles={styles.avatar}
                bg="cyan.500"
                source={{
                  uri: otherUser.profilePicture
                }}
              >
                TE
              </Avatar>
            </Avatar.Group>
          </View>
          <TouchableOpacity
            style={styles.messageButton}
            title="messageButton"
            onPress={() => this.onMessagePressHandler()}
          >
            <Heading size={"md"} color={"#92A3FD"}>Message</Heading>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => this.props.navigation.goBack()}
          >
            <Heading size={"sm"} color={"#fff"}>Go back to swiping</Heading>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: "cover",
    width: DIMENSION_WIDTH,
    height: DIMENSION_HEIGHT,
  },
  avatarGroup: {
    alignItems: 'center',
    marginTop: DIMENSION_HEIGHT / 2.75,
    justifyContent: 'center',
  },
  messageButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: DIMENSION_HEIGHT / 7,
    marginLeft: DIMENSION_WIDTH / 11,
    marginRight: DIMENSION_WIDTH / 9,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "#fff",
    width: DIMENSION_WIDTH / 1.2,
    height: DIMENSION_HEIGHT / 14
  },
  goBackButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: DIMENSION_HEIGHT / 30,
    marginLeft: DIMENSION_WIDTH / 11,
    marginRight: DIMENSION_WIDTH / 9,
    borderRadius: 99,
    borderWidth: 3,
    borderColor: "#fff",
    color: "#fff",
    width: DIMENSION_WIDTH / 1.2,
    height: DIMENSION_HEIGHT / 14
  },
})
