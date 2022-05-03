import React, { Component } from "react";
import {
  Button,
  Heading,
  Text,
  Center, Box,
} from 'native-base';

import {
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  View
} from 'react-native';

import styles, {DIMENSION_HEIGHT, DIMENSION_WIDTH} from '../../assets/styles';
import { BottomNavigation } from "../../commons/BottomNavigation";
import { getDocs, collection } from "firebase/firestore";
import { VoidIcon } from '../../commons/Icons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Message = ({ image, lastMessage, name }) => {
  return (
    <View style={styles.containerMessage}>
      <Image source={image} style={styles.avatar}/>
      <View style={styles.content}>
        <Text>{name}</Text>
        <Text style={styles.message}>{lastMessage}</Text>
      </View>
    </View>
  );
}

const Messages = ({ navigation, lastMessages }) => {
  return (
    <View>
      <FlatList
        data={lastMessages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("TextsPage", {user: item.user, chatId: item.chatId, otherUser: item.other})
            }}
          >
            <Message
              image={item.image}
              name={item.name}
              lastMessage={item.message}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const renderHeader = () => {
  return(
    <LinearGradient colors={["#6f61e8", "#6f61e8"]}>
      <View>
        <View style={styles.top}>
          <Heading style={{color: "white", marginHorizontal: DIMENSION_WIDTH  / 3.05}}>Messages</Heading>
        </View>
      </View>
    </LinearGradient>
  )
}

export class MessagesPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      lastMessages: []
    }
  }

  async componentDidMount() {
    await this.getMessages();
  }

  async getMessages() {
    const user = JSON.parse(await AsyncStorage.getItem("@user"));

    // Get all messages
    const snapshot = await getDocs(collection(this.props.firebaseDb, "chats"));
    let lastMessages = [];


    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(doc.id);
      const chatId = doc.id;
      let otherUser;
      if(data.user1 === user.id) {
        otherUser = data.user2
      } else {
        otherUser = data.user1
      }
      const messages = data.messages || [];
      lastMessages.push({ message: messages[messages.length - 1], user: user, other: otherUser, chatId: chatId});

    });

    lastMessages = await Promise.all(lastMessages.map(async message => {
      const userResponse = await this.props.api.getUserById(message.other);
      const userProfileResponse = await this.props.api.getUserProfile(message.other)
      if(!userResponse.isError && !userProfileResponse.isError) {
        const user = userResponse.success;
        const profilePicture = userProfileResponse.success.profilePicture
        return {
          name: `${user.firstName} ${user.lastName}`,
          image: {uri: profilePicture},
          message: message.message.text,
          user: message.user,
          other: message.other,
          chatId: message.chatId
        }
      }
    }));

    this.setState({
      lastMessages: lastMessages
    });
  }

  render() {
    if(this.state.lastMessages.length > 0) {
      return <Box style={{height: "100%", backgroundColor: "#f7f7fc"}}>
        {renderHeader(this.props.navigation.goBack)}
        <View style={style.containerMessages}>
          <Messages
            onGoBackButtonHandler={this.props.navigation.goBack}
            navigation={this.props.navigation}
            lastMessages={this.state.lastMessages}
          />
          <BottomNavigation
            selectedPage={"messages"}
            navigation={this.props.navigation}
            backgroundColor={"#f7f7fc"}
          />
        </View>
      </Box>
    } else {
      return <Box style={{height: "100%", backgroundColor: "#f7f7fc"}}>
        {renderHeader()}
        <View style={style.containerMessages}>
          <Messages
            onGoBackButtonHandler={this.props.navigation.goBack}
            navigation={this.props.navigation}
            lastMessages={this.state.lastMessages}
          />
          <Text style={style.noMessages}>
            No messages here yet
          </Text>
          <VoidIcon style={style.messagesIcon} />
          <BottomNavigation
            selectedPage={"messages"}
            navigation={this.props.navigation}
            backgroundColor={"#f7f7fc"}
          />
        </View>
      </Box>
    }
  }
}

const style = StyleSheet.create({
  containerMessages: {
    justifyContent: "space-between",
    flex: 1,
    padding: 20,
    paddingRight: 25,
    backgroundColor: "#f7f7fc"
  },
  noMessages: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#f7f7fc",
    paddingTop: 90,
    paddingLeft: 90,
    paddingRight: 90,
    textAlign: "center"
  },
  messagesIcon: {
    marginLeft: 20,
    marginBottom: 120
  }
})
