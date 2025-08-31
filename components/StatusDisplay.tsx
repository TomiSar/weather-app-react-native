import { Text } from 'react-native';
type StatusDisplayProps = {
  styles: any;
  notification: string | null;
  error: string | null;
  loading: boolean;
};

export default function StatusDisplay({
  styles,
  notification,
  error,
  loading,
}: StatusDisplayProps) {
  if (notification)
    return <Text style={styles.notification}>{notification}</Text>;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (loading) return <Text>Loading...</Text>;
  return null;
}
