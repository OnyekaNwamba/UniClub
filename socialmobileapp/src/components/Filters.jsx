import React from 'react';
import styles from '../assets/styles';

import { Text, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons'

const Filters = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.filters} onPress={onPress}>
      <Text style={styles.filtersText}>
        <FontAwesomeIcon icon={faFilter} size={10 }/> Filters
      </Text>
    </TouchableOpacity>
  );
};

export default Filters;
