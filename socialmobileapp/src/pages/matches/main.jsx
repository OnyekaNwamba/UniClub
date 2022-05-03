import React, { Component } from 'react';
import styles, {DARK_GRAY, DIMENSION_HEIGHT, DIMENSION_WIDTH} from '../../assets/styles';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  SafeAreaView
} from 'react-native';

import {
  Heading,
  Center,
  Spinner, Box,
} from 'native-base';

import { BottomNavigation } from "../../commons/BottomNavigation";
import {VoidIcon} from '../../commons/Icons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Matches = ({ matches, navigation }) => {

  matches = matches.map((match) => {
    return {
      matchId:  match.matchId,
      id: match.profile.userId,
      name: `${match.profile.user.firstName} ${match.profile.user.lastName}`,
      image: match.profile.profilePicture,
      otherUser: match.other
    }
  });

  if(matches.length === 0) {
    return(
      <View style={styles.containerMatches}>
        <Text style={style.noMatches}> No matches yet</Text>
        <VoidIcon style={style.voidIcon} />
      </View>
    )
  }


  return (
      <View style={styles.containerMatches}>
          <FlatList
            numColumns={2}
            data={matches}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate("TextsPage", {user: item, chatId: item.matchId, otherUser: item.id})}
              >
                <CardItem
                  image={item.image}
                  name={item.name}
                  variant
                />
              </TouchableOpacity>
            )}
          />
      </View>
  );
};

const renderHeader = () => {
  return(
    <LinearGradient colors={["#6f61e8", "#6f61e8"]}>
      <View>
        <View style={styles.top}>
          <Heading style={{color: "#f7f7fc", marginHorizontal: DIMENSION_WIDTH  / 2.90}}>Matches</Heading>
        </View>
      </View>
    </LinearGradient>
  )
}

const CardItem = ({
                    image,
                    name,
                    variant
                  }) => {

  // Custom styling
  const fullWidth = Dimensions.get('window').width;
  const imageStyle = [
    {
      borderRadius: 8,
      width: variant ? fullWidth / 2 - 30 : fullWidth - 80,
      height: variant ? 170 : 350,
      margin: variant ? 0 : 20
    }
  ];

  const nameStyle = [
    {
      paddingTop: variant ? 15 : 15,
      paddingBottom: variant ? 10 : 7,
      color: '#363636',
      fontSize: variant ? 15 : 30
    }
  ];

  return (
    <View style={styles.containerCardItem}>
      <Image source={{uri: image}} style={imageStyle} />

      <Text style={nameStyle}>{name}</Text>
      <View
        style={{
          margin: 8
        }}
      />
    </View>
  );
};

export default Matches;

export class MatchesPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: undefined,
      matches: [],
      isMatchesLoading: true
    }
  }

  async componentDidMount() {
    let user;

    const loggedIn = await this.props.authenticator.isLoggedIn();
    if(loggedIn) {
      try {
        user = JSON.parse(await AsyncStorage.getItem("@user"))
      } catch(e) {
        console.log(e);
      }

      const matchesResponse = await this.props.api.getMatches(user.id);

      if(!matchesResponse.isError) {
        let matches = await Promise.all(matchesResponse.success
          .map(match => {
            return match.user1 === user.id ?
              { matchId: match.matchId, user: match.user2, otherUser: match.user1 } :
              { matchId: match.matchId, user: match.user1, otherUser: match.user2 }
          })
          .map(async userMatch => {
            const userResponse = await this.props.api.getUserById(userMatch.user);
            const userProfileResponse = await this.props.api.getUserProfile(userMatch.user);
            const otherUserResponse = await this.props.api.getUserById(userMatch.otherUser);
            if (!userResponse.isError && !otherUserResponse.isError && !userProfileResponse.isError) {
              const profile = userProfileResponse.success;
              profile.user = userResponse.success;
              const otherUser = otherUserResponse.success
              return { matchId: userMatch.matchId, profile: profile, otherUser: otherUser };
            }
          })
        );

        this.setState({
          user: user,
          matches: matches,
          isMatchesLoading: false
        });

      }
    }
  }

  render() {

    if(this.state.user || this.state.isMatchesLoading) {
      return <Box style={{height: "100%", backgroundColor: "#f7f7fc"}}>
        {renderHeader()}
        <View style={style.bg}>
          <Matches matches={this.state.matches} navigation={this.props.navigation} />
          <BottomNavigation
            selectedPage={"matches"}
            navigation={this.props.navigation}
            style={style.navigation}
            backgroundColor={"#f7f7fc"}
          />
        </View>
      </Box>

    } else {
      return <SafeAreaView>
        <Center>
          <Spinner size="lg" />
        </Center>
      </SafeAreaView>
    }
  }
}

const style = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "f7f7fc"
  },
  navigation: {
    backgroundColor: "white"
  },
  title: {
    paddingBottom: 15,
    color: DARK_GRAY,
    textAlign: "center",
    marginHorizontal: DIMENSION_WIDTH / 2
  },
  noMatches: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#f7f7fc",
    paddingTop: 90,
    paddingLeft: 90,
    paddingRight: 90,
    textAlign: "center"
  },
  voidIcon: {
    marginLeft: 20,
    marginBottom: 120
  }
})
