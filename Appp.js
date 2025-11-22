import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  getUsers,
  saveUser,
  setCurrentUser,
  getCurrentUser,
  clearCurrentUser,
  getUserNotes,
  saveUserNotes,
} from './utils/storage';
import { wp, hp, moderateScale } from './utils/responsive';

const SortModal = ({
  showSortModal,
  setShowSortModal,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => (
    <Modal
      visible={showSortModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSortModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowSortModal(false)}
      >
        <View style={styles.sortModal}>
          <Text style={styles.modalTitle}>Sort Notes</Text>
          
          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => {
              setSortBy('lastUpdated');
              setSortOrder('desc');
              setShowSortModal(false);
            }}
          >
            <Icon name="time-outline" size={moderateScale(20)} color="#6C63FF" />
            <Text style={styles.sortOptionText}>Last Updated (Newest First)</Text>
            {sortBy === 'lastUpdated' && sortOrder === 'desc' && (
              <Icon name="checkmark" size={moderateScale(20)} color="#6C63FF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => {
              setSortBy('lastUpdated');
              setSortOrder('asc');
              setShowSortModal(false);
            }}
          >
            <Icon name="time-outline" size={moderateScale(20)} color="#6C63FF" />
            <Text style={styles.sortOptionText}>Last Updated (Oldest First)</Text>
            {sortBy === 'lastUpdated' && sortOrder === 'asc' && (
              <Icon name="checkmark" size={moderateScale(20)} color="#6C63FF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => {
              setSortBy('title');
              setSortOrder('asc');
              setShowSortModal(false);
            }}
          >
            <Icon name="text-outline" size={moderateScale(20)} color="#6C63FF" />
            <Text style={styles.sortOptionText}>Title (A → Z)</Text>
            {sortBy === 'title' && sortOrder === 'asc' && (
              <Icon name="checkmark" size={moderateScale(20)} color="#6C63FF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => {
              setSortBy('title');
              setSortOrder('desc');
              setShowSortModal(false);
            }}
          >
            <Icon name="text-outline" size={moderateScale(20)} color="#6C63FF" />
            <Text style={styles.sortOptionText}>Title (Z → A)</Text>
            {sortBy === 'title' && sortOrder === 'desc' && (
              <Icon name="checkmark" size={moderateScale(20)} color="#6C63FF" />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );


const HomeScreen = ({
  currentUser,
  handleLogout,
  searchQuery,
  setSearchQuery,
  setShowSortModal,
  filteredNotes,
  setEditingNote,
  setCurrentScreen,
  handleDeleteNote,
  showSortModal,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>My Notes</Text>
        <Text style={styles.headerSubtitle}>Hello, {currentUser}!</Text>
      </View>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Icon name="log-out-outline" size={moderateScale(24)} color="#fff" />
      </TouchableOpacity>
    </View>

    <View style={styles.searchContainer}>
      <Icon name="search" size={moderateScale(20)} color="#999" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search notes..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity onPress={() => setShowSortModal(true)}>
        <Icon name="funnel" size={moderateScale(20)} color="#6C63FF" />
      </TouchableOpacity>
    </View>

    <ScrollView style={styles.notesList} showsVerticalScrollIndicator={false}>
      {filteredNotes.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="document-text-outline" size={moderateScale(80)} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? 'Try a different search' : 'Tap + to create your first note'}
          </Text>
        </View>
      ) : (
        filteredNotes.map((note) => (
          <TouchableOpacity
            key={note.id}
            style={styles.noteCard}
            onPress={() => {
              setEditingNote(note);
              setCurrentScreen('editor');
            }}
          >
            <View style={styles.noteCardContent}>
              {note.image && (
                <Image source={{ uri: note.image }} style={styles.noteThumbnail} />
              )}
              <View style={styles.noteTextContent}>
                <Text style={styles.noteTitle} numberOfLines={1}>
                  {note.title || 'Untitled'}
                </Text>
                <Text style={styles.notePreview} numberOfLines={2}>
                  {note.body || 'No content'}
                </Text>
                <Text style={styles.noteDate}>
                  {new Date(note.updatedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteNote(note.id)}
              style={styles.deleteButton}
            >
              <Icon name="trash-outline" size={moderateScale(20)} color="#FF6B6B" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>

    <TouchableOpacity
      style={styles.fab}
      onPress={() => {
        setEditingNote(null);
        setCurrentScreen('editor');
      }}
    >
      <Icon name="add" size={moderateScale(30)} color="#fff" />
    </TouchableOpacity>

    <SortModal
      showSortModal={showSortModal}
      setShowSortModal={setShowSortModal}
      sortBy={sortBy}
      setSortBy={setSortBy}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
    />
  </View>
);

  const AuthScreen = ({ 
  isLogin, 
  setIsLogin, 
  username, 
  setUsername, 
  password, 
  setPassword, 
  handleAuth 
}) => (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
      <View style={styles.authHeader}>
        <Icon name="journal" size={moderateScale(80)} color="#fff" />
        <Text style={styles.authTitle}>My Notes</Text>
        <Text style={styles.authSubtitle}>Your personal note-taking companion</Text>
      </View>

      <View style={styles.authCard}>
        <View style={styles.authTabs}>
          <TouchableOpacity
            style={[styles.authTab, isLogin && styles.authTabActive]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.authTabText, isLogin && styles.authTabTextActive]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.authTab, !isLogin && styles.authTabActive]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.authTabText, !isLogin && styles.authTabTextActive]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Icon name="person-outline" size={moderateScale(20)} color="#6C63FF" />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={moderateScale(20)} color="#6C63FF" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
          <Text style={styles.authButtonText}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

   const EditorScreen = ({
  editingNote,
  setCurrentScreen,
  handleSaveNote,
  showImageOptions,
  setShowImageOptions,
  requestCameraPermission,
}) => {
    const [title, setTitle] = useState(editingNote?.title || '');
    const [body, setBody] = useState(editingNote?.body || '');
    const [image, setImage] = useState(editingNote?.image || null);

    const handleImagePick = async (type) => {
      setShowImageOptions(false);
      
      const options = {
        mediaType: 'photo',
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 0.8,
        includeBase64: true,
      };

      try {
        let result;
        if (type === 'camera') {
          const hasPermission = await requestCameraPermission();
          if (!hasPermission) {
            Alert.alert('Permission Denied', 'Camera permission is required');
            return;
          }
          result = await launchCamera(options);
        } else {
          result = await launchImageLibrary(options);
        }

        if (result.didCancel) return;
        if (result.errorCode) {
          Alert.alert('Error', result.errorMessage);
          return;
        }

        const asset = result.assets[0];
        setImage(`data:${asset.type};base64,${asset.base64}`);
      } catch (error) {
        Alert.alert('Error', 'Failed to pick image');
      }
    };

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
        <View style={styles.editorHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('home')}>
            <Icon name="arrow-back" size={moderateScale(24)} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.editorHeaderTitle}>
            {editingNote ? 'Edit Note' : 'New Note'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (!title.trim() && !body.trim()) {
                Alert.alert('Error', 'Please add at least a title or body');
                return;
              }
              handleSaveNote({ title, body, image });
            }}
          >
            <Icon name="checkmark" size={moderateScale(24)} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.editorContent} showsVerticalScrollIndicator={false}>
          <TextInput
            style={styles.editorTitle}
            placeholder="Note Title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />

          {image && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImage(null)}
              >
                <Icon name="close-circle" size={moderateScale(30)} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.addImageButton}
            onPress={() => setShowImageOptions(true)}
          >
            <Icon name="image-outline" size={moderateScale(20)} color="#6C63FF" />
            <Text style={styles.addImageText}>
              {image ? 'Change Image' : 'Add Image'}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.editorBody}
            placeholder="Start writing..."
            placeholderTextColor="#999"
            value={body}
            onChangeText={setBody}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>

        <Modal
          visible={showImageOptions}
          transparent
          animationType="slide"
          onRequestClose={() => setShowImageOptions(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowImageOptions(false)}
          >
            <View style={styles.imageOptionsModal}>
              <Text style={styles.modalTitle}>Add Image</Text>
              
              <TouchableOpacity
                style={styles.imageOption}
                onPress={() => handleImagePick('camera')}
              >
                <Icon name="camera" size={moderateScale(24)} color="#6C63FF" />
                <Text style={styles.imageOptionText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.imageOption}
                onPress={() => handleImagePick('gallery')}
              >
                <Icon name="images" size={moderateScale(24)} color="#6C63FF" />
                <Text style={styles.imageOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.imageOption, { borderTopWidth: 1, borderTopColor: '#eee' }]}
                onPress={() => setShowImageOptions(false)}
              >
                <Text style={[styles.imageOptionText, { color: '#FF6B6B' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

const Appp = () => {
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [currentUser, setCurrentUserState] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastUpdated');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showSortModal, setShowSortModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showImageOptions, setShowImageOptions] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (user) {
      setCurrentUserState(user);
      const userNotes = await getUserNotes(user);
      setNotes(userNotes);
      setCurrentScreen('home');
    } else {
      setCurrentScreen('auth');
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleAuth = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const users = await getUsers();
    
    if (isLogin) {
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
      if (user) {
        await setCurrentUser(username);
        setCurrentUserState(username);
        const userNotes = await getUserNotes(username);
        setNotes(userNotes);
        setCurrentScreen('home');
        setUsername('');
        setPassword('');
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } else {
      const userExists = users.find((u) => u.username === username);
      if (userExists) {
        Alert.alert('Error', 'Username already exists');
      } else {
        await saveUser({ username, password });
        Alert.alert('Success', 'Account created! Please login.');
        setIsLogin(true);
        setPassword('');
      }
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await clearCurrentUser();
            setCurrentUserState(null);
            setNotes([]);
            setUsername('');
            setPassword('');
            setCurrentScreen('auth');
          },
        },
      ],
    );
  };

const handleSaveNote = async (note) => {
  console.log('Saving note:', note);  
  
  const now = new Date().toISOString();
  let updatedNotes;

  if (editingNote?.id) {
    updatedNotes = notes.map((n) =>
      n.id === editingNote.id ? { ...n, ...note, updatedAt: now } : n
    );
  } else {
    updatedNotes = [...notes, { ...note, id: Date.now().toString(), createdAt: now, updatedAt: now }];
  }

  console.log('Updated notes:', updatedNotes);  

  setNotes(updatedNotes);
  await saveUserNotes(currentUser, updatedNotes);
  setEditingNote(null);
  setCurrentScreen('home');
};

  const handleDeleteNote = async (id) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedNotes = notes.filter((n) => n.id !== id);
            setNotes(updatedNotes);
            await saveUserNotes(currentUser, updatedNotes);
          },
        },
      ],
    );
  };

  const getFilteredAndSortedNotes = () => {
    let filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.body.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === 'lastUpdated') {
        const dateA = new Date(a.updatedAt);
        const dateB = new Date(b.updatedAt);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });
  };

  if (currentScreen === 'loading') {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (currentScreen === 'auth') {
    return (
      <AuthScreen
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleAuth={handleAuth}
      />
    );
  }
if (currentScreen === 'editor') {
  return (
    <EditorScreen
      editingNote={editingNote}
      setCurrentScreen={setCurrentScreen}
      handleSaveNote={handleSaveNote}
      showImageOptions={showImageOptions}
      setShowImageOptions={setShowImageOptions}
      requestCameraPermission={requestCameraPermission}
    />
  );
}

    return (
    <HomeScreen
      currentUser={currentUser}
      handleLogout={handleLogout}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      setShowSortModal={setShowSortModal}
      filteredNotes={getFilteredAndSortedNotes()}
      setEditingNote={setEditingNote}
      setCurrentScreen={setCurrentScreen}
      handleDeleteNote={handleDeleteNote}
      showSortModal={showSortModal}
      sortBy={sortBy}
      setSortBy={setSortBy}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
    />
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
 
  authHeader: {
    backgroundColor: '#6C63FF',
    paddingTop: hp(8),
    paddingBottom: hp(5),
    alignItems: 'center',
    borderBottomLeftRadius: moderateScale(30),
    borderBottomRightRadius: moderateScale(30),
  },
  authTitle: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: '#fff',
    marginTop: hp(2),
  },
  authSubtitle: {
    fontSize: moderateScale(14),
    color: 'rgba(255,255,255,0.8)',
    marginTop: hp(1),
  },
  authCard: {
    margin: wp(5),
    backgroundColor: '#fff',
    borderRadius: moderateScale(20),
    padding: wp(6),
    marginTop: -hp(3),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  authTabs: {
    flexDirection: 'row',
    marginBottom: hp(3),
    backgroundColor: '#F5F7FA',
    borderRadius: moderateScale(25),
    padding: moderateScale(5),
  },
  authTab: {
    flex: 1,
    paddingVertical: hp(1.5),
    alignItems: 'center',
    borderRadius: moderateScale(20),
  },
  authTabActive: {
    backgroundColor: '#6C63FF',
  },
  authTabText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#999',
  },
  authTabTextActive: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: moderateScale(15),
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
    height: hp(6.5),
  },
  input: {
    flex: 1,
    marginLeft: wp(3),
    fontSize: moderateScale(14),
    color: '#333',
  },
  authButton: {
    backgroundColor: '#6C63FF',
    borderRadius: moderateScale(15),
    paddingVertical: hp(2),
    alignItems: 'center',
    marginTop: hp(2),
  },
  authButtonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },

 
  header: {
    backgroundColor: '#6C63FF',
    paddingTop: hp(6),
    paddingBottom: hp(3),
    paddingHorizontal: wp(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: moderateScale(25),
    borderBottomRightRadius: moderateScale(25),
  },
  headerTitle: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: moderateScale(14),
    color: 'rgba(255,255,255,0.8)',
    marginTop: hp(0.5),
  },
  logoutButton: {
    padding: moderateScale(8),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: wp(5),
    paddingHorizontal: wp(4),
    borderRadius: moderateScale(15),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    height: hp(6),
  },
  searchInput: {
    flex: 1,
    marginLeft: wp(3),
    marginRight: wp(3),
    fontSize: moderateScale(14),
    color: '#333',
  },
  notesList: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(10),
  },
  emptyText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#999',
    marginTop: hp(2),
  },
  emptySubtext: {
    fontSize: moderateScale(14),
    color: '#ccc',
    marginTop: hp(1),
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(15),
    padding: wp(4),
    marginBottom: hp(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  noteCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteThumbnail: {
    width: wp(15),
    height: wp(15),
    borderRadius: moderateScale(10),
    marginRight: wp(3),
  },
  noteTextContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp(0.5),
  },
  notePreview: {
    fontSize: moderateScale(13),
    color: '#666',
    lineHeight: moderateScale(18),
  },
  noteDate: {
    fontSize: moderateScale(11),
    color: '#999',
    marginTop: hp(0.5),
  },
  deleteButton: {
    padding: moderateScale(8),
  },
  fab: {
    position: 'absolute',
    right: wp(6),
    bottom: hp(3),
    backgroundColor: '#6C63FF',
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },


  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sortModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
    padding: wp(6),
    paddingBottom: hp(4),
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(2),
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortOptionText: {
    flex: 1,
    fontSize: moderateScale(15),
    color: '#333',
    marginLeft: wp(3),
  },

 
  editorHeader: {
    backgroundColor: '#6C63FF',
    paddingTop: hp(6),
    paddingBottom: hp(2),
    paddingHorizontal: wp(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editorHeaderTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#fff',
  },
  editorContent: {
    flex: 1,
    padding: wp(5),
  },
  editorTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(2),
    paddingVertical: hp(1),
  },
  editorBody: {
    fontSize: moderateScale(16),
    color: '#333',
    lineHeight: moderateScale(24),
    minHeight: hp(40),
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: wp(4),
    borderRadius: moderateScale(12),
    marginBottom: hp(2),
  },
  addImageText: {
    marginLeft: wp(2),
    fontSize: moderateScale(14),
    color: '#6C63FF',
    fontWeight: '600',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: hp(2),
  },
  imagePreview: {
    width: '100%',
    height: hp(25),
    borderRadius: moderateScale(15),
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: moderateScale(10),
    right: moderateScale(10),
    backgroundColor: '#fff',
    borderRadius: moderateScale(15),
  },
  imageOptionsModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
    padding: wp(6),
    paddingBottom: hp(4),
  },
  imageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  imageOptionText: {
    flex: 1,
    fontSize: moderateScale(16),
    color: '#333',
    marginLeft: wp(3),
    fontWeight: '500',
  },
});

export default Appp;