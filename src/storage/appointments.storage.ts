import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@appointments';

export async function saveAppointments(
  data: any[]
) {
  await AsyncStorage.setItem(
    KEY,
    JSON.stringify(data)
  );
}

export async function loadAppointments() {
  const response =
    await AsyncStorage.getItem(KEY);

  if (!response) {
    return [];
  }

  return JSON.parse(response);
}