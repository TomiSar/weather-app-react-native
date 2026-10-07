export const formatToLocalTime = (localtimeStr: string): string => {
  if (!localtimeStr) return '';

  try {
    const [datePart, localTime] = localtimeStr.split(' ');
    const [year, month, day] = datePart.split('-');

    return `${day}/${month}/${year} ${localTime}`;
  } catch (error) {
    return localtimeStr;
  }
};

export const constructWeatherIconUrl = (iconPath: string): string | null => {
  return iconPath ? `https:${iconPath}` : null;
};
