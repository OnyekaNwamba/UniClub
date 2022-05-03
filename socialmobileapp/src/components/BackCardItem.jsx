import React from 'react';
import styles, { BLACK, WHITE } from '../assets/styles';

import {View, Dimensions, TouchableOpacity, StyleSheet} from 'react-native';
import {Text, Divider, Box, Badge, HStack} from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { RedHeartIcon } from "../commons/Icons";
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const BackCardItem = ({
                    actions,
                    aboutMe,
                    onPressLeft,
                    onPressRight,
                    variant,
                    likes
                  }) => {
  // Custom styling
  const fullWidth = Dimensions.get('window').width;
  const imageStyle = [
    {
      borderRadius: 8,
      width: variant ? fullWidth / 2 - 30 : fullWidth - 80,
      height: variant ? 170 : 350,
      margin: variant ? 0 : 20,
      marginBottom: 0,
      padding: 30
    }
  ];

  return (
    <View style={style.containerCardItem}>
      <Text style={imageStyle}>{aboutMe}</Text>
      {likes.length > 0 ?
        <Box>
          <Text>
            Likes and Hobbies
          </Text>
          <HStack space={4}>
            {likes.map((like, index) => <Badge mt={1} key={index} bg={"#6f61e8"} variant={"solid"} borderRadius={15}>{like}</Badge>)}
          </HStack>
        </Box> :
        <Box />
      }

      {/* ACTIONS */}
      {actions && (
        <View style={styles.actionsCardItem}>

          <TouchableOpacity style={styles.button} onPress={onPressRight}>
            <Text style={styles.like}>
              <RedHeartIcon />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={onPressLeft}
          >
            <Text style={styles.dislike}>
              <FontAwesomeIcon icon={faTimes} size={20} />
            </Text>
          </TouchableOpacity>

        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  // COMPONENT - CARD ITEM
  containerCardItem: {
    padding: 30,
    backgroundColor: WHITE,
    borderRadius: 8,
    alignItems: "center",
    margin: 10,
    elevation: 1,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: BLACK,
    shadowOffset: {height: 0, width: 0},
    textAlign: "justify"
  }
});

export default BackCardItem;
