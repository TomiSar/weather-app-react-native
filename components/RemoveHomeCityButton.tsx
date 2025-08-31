import { TouchableOpacity, Text } from 'react-native';

type Props = {
  styles: any;
  onRemove: () => void;
};

export default function RemoveHomeCityButton({ styles, onRemove }: Props) {
  return (
    <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
      <Text style={styles.buttonText}>Remove home city</Text>
    </TouchableOpacity>
  );
}
