import React from 'react';
import styles from '../assets/styles';

import { TouchableOpacity } from 'react-native';
import {
  Text
} from "native-base";
import Icon from './Icon';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapPin } from '@fortawesome/free-solid-svg-icons'

const University = ({university}) => {
  return (
    <TouchableOpacity style={styles.city}>
      <Text style={styles.cityText} isTruncated>
        <FontAwesomeIcon icon={faMapPin} size={10} /> {university}
      </Text>
    </TouchableOpacity>
  );
};

export default University;
