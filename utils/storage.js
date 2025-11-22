import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'NOTES_APP_USERS';
const CURRENT_USER_KEY = 'CURRENT_USER';

export const getUsers = async () => {
  try {
    const users = await AsyncStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

export const saveUser = async (user) => {
  try {
    const users = await getUsers();
    users.push(user);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

export const setCurrentUser = async (username) => {
  try {
    await AsyncStorage.setItem(CURRENT_USER_KEY, username);
  } catch (error) {
    console.error('Error setting current user:', error);
  }
};

export const getCurrentUser = async () => {
  try {
    return await AsyncStorage.getItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const clearCurrentUser = async () => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Error clearing current user:', error);
  }
};

export const getUserNotes = async (username) => {
  try {
    const notes = await AsyncStorage.getItem(`NOTES_${username}`);
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
};

export const saveUserNotes = async (username, notes) => {
  try {
    await AsyncStorage.setItem(`NOTES_${username}`, JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('Error saving notes:', error);
    return false;
  }
};