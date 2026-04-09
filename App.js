import React, { createContext, useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ==================== AUTH CONTEXT với AsyncStorage ====================
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user từ AsyncStorage khi app mở
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (e) {
        console.log("Lỗi load user:", e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (e) {
      console.log("Lỗi lưu user:", e);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem("user");
    } catch (e) {
      console.log("Lỗi xóa user:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// ==================== DATA MẪU ====================
const categories = [
  {
    id: "1",
    name: "Cakes",
    image: "https://via.placeholder.com/100x60.png?text=Cakes",
  },
  {
    id: "2",
    name: "Fast Food",
    image: "https://via.placeholder.com/100x60.png?text=Fast+Food",
  },
  {
    id: "3",
    name: "Drinks",
    image: "https://via.placeholder.com/100x60.png?text=Drinks",
  },
];

const foods = [
  {
    id: "1",
    name: "Pizza",
    by: "by Food Corner",
    price: "$12",
    image: "https://via.placeholder.com/70.png?text=Pizza",
  },
  {
    id: "2",
    name: "Burger",
    by: "by Burger House",
    price: "$8",
    image: "https://via.placeholder.com/70.png?text=Burger",
  },
  {
    id: "3",
    name: "Juice",
    by: "by Fresh Drink",
    price: "$5",
    image: "https://via.placeholder.com/70.png?text=Juice",
  },
];

// ==================== SIGN IN SCREEN ====================
function SignInScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập email và password");
      return;
    }

    const userData = {
      name: "Hien Nguyen",
      email,
      job: "Mobile Developer",
    };

    await login(userData);
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập email"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.forgot}>Forgot Password?</Text>

      <TouchableOpacity style={styles.signButton} onPress={handleSignIn}>
        <Text style={styles.signText}>SIGN IN</Text>
      </TouchableOpacity>

      <Text style={styles.or}>Or sign in with</Text>

      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.google}>
          <Text>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.facebook}>
          <Text style={{ color: "#fff" }}>Facebook</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.signup}>Don't have an account? Sign Up</Text>
    </View>
  );
}

// ==================== EXPLORER SCREEN ====================
function ExplorerScreen() {
  const renderCategory = ({ item }) => (
    <View style={styles.categoryItem}>
      <Image source={{ uri: item.image }} style={styles.categoryImg} />
      <Text style={styles.categoryText}>{item.name}</Text>
    </View>
  );

  const renderFood = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.foodImg} />
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodBy}>{item.by}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.explorerContainer}>
      <Text style={styles.header}>Explorer</Text>

      <View style={styles.searchBox}>
        <Text style={styles.icon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search food..."
        />
        <Text style={styles.icon}>⚙️</Text>
      </View>

      <View style={styles.rowHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <Text style={styles.filter}>View All</Text>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      />

      <View style={styles.rowHeader}>
        <Text style={styles.sectionTitle}>Popular Foods</Text>
        <Text style={styles.view}>View All</Text>
      </View>

      <FlatList
        data={foods}
        renderItem={renderFood}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// ==================== ACCOUNT SCREEN ====================
function AccountScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    Alert.alert("Thông báo", "Đã đăng xuất");
  };

  return (
    <View style={styles.accountContainer}>
      <View style={styles.blueHeader} />

      <Image
        source={{
          uri: "https://via.placeholder.com/130.png?text=Avatar",
        }}
        style={styles.avatar}
      />

      <Text style={styles.name}>{user?.name || "Guest User"}</Text>
      <Text style={styles.job}>{user?.job || "No Job"}</Text>

      <Text style={styles.desc}>
        Email: {user?.email || "No email"}{"\n"}
        Đây là màn hình Account giống bố cục ảnh mẫu.
      </Text>

      <TouchableOpacity style={styles.signButton} onPress={handleLogout}>
        <Text style={styles.signText}>LOG OUT</Text>
      </TouchableOpacity>
    </View>
  );
}

// ==================== HOME TABS ====================
function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Explorer" component={ExplorerScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

// ==================== APP ====================
function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: "center" }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Home" component={HomeTabs} />
      ) : (
        <Stack.Screen name="SignIn" component={SignInScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

// ==================== STYLES  ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  forgot: {
    textAlign: "right",
    color: "orange",
    marginBottom: 20,
  },
  signButton: {
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  signText: {
    color: "#fff",
    fontWeight: "bold",
  },
  or: {
    textAlign: "center",
    marginTop: 20,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  google: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "45%",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  facebook: {
    backgroundColor: "#3b5998",
    width: "45%",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  signup: {
    textAlign: "center",
    marginTop: 20,
  },

  // Explorer
  explorerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  icon: {
    marginHorizontal: 5,
    fontSize: 20,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  filter: {
    color: "orange",
  },
  view: {
    color: "orange",
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 12,
  },
  categoryImg: {
    width: 100,
    height: 60,
    borderRadius: 10,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 12,
  },
  card: {
    flexDirection: "row",
    marginTop: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
  },
  foodImg: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  foodInfo: {
    marginLeft: 10,
    justifyContent: "center",
  },
  foodName: {
    fontWeight: "bold",
  },
  foodBy: {
    color: "gray",
    fontSize: 12,
  },
  price: {
    marginTop: 5,
    fontWeight: "bold",
  },

  // Account
  accountContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  blueHeader: {
    width: "100%",
    height: 180,
    backgroundColor: "#18A9D6",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 5,
    borderColor: "#fff",
    position: "absolute",
    top: 110,
    zIndex: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 90,
  },
  job: {
    color: "#18A9D6",
    marginBottom: 15,
    fontSize: 16,
  },
  desc: {
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 30,
    lineHeight: 22,
    color: "#444",
  },
});