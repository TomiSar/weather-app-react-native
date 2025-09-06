import { TouchableOpacity, Text } from 'react-native';

type HomeCityButtonProps = {
  styles: any;
  label: string;
  variant?: 'remove' | 'update';
  opPress: () => void;
};

const HomeCityButton = ({
  styles,
  label,
  variant,
  opPress,
}: HomeCityButtonProps) => {
  const buttonStyle =
    variant === 'remove' ? styles.removeButton : styles.updateButton;

  return (
    <TouchableOpacity style={buttonStyle} onPress={opPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default HomeCityButton;
