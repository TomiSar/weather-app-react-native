import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type SearchBarProps = {
  styles: any;
  city: string;
  inputError: string | null;
  onCityChange: (text: string) => void;
  onSearchCity: () => void;
};

export default function SearchBar({
  styles,
  city,
  inputError,
  onCityChange,
  onSearchCity,
}: SearchBarProps) {
  return (
    <View>
      <Text style={styles.searchTitle}>Search weather in city</Text>
      <TextInput
        style={[styles.input, inputError ? styles.inputError : {}]}
        value={city}
        onChangeText={onCityChange}
        placeholder='Enter City...'
      />
      {inputError && <Text style={styles.inputErrorMessage}>{inputError}</Text>}
      <TouchableOpacity style={styles.searchButton} onPress={onSearchCity}>
        <Text style={styles.buttonText}>Search weather</Text>
      </TouchableOpacity>
    </View>
  );
}
