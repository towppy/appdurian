import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker'; // Kailangan itong import
import { API_URL } from '../config/appconf';
import styles from '../styles/adminstyles/index.styles';


const { width } = Dimensions.get('window');
const isMobile = width < 768;

interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState<{ message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [showDeactivated, setShowDeactivated] = useState(false);

  useEffect(() => {
    fetchStatus();
    fetchUsers();
  }, []);

  const fetchStatus = () => {
    setLoading(true);
    fetch(`${API_URL}/status`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setStatusData(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Dashboard Error:", err);
        setError("Failed to fetch backend status.");
      })
      .finally(() => setLoading(false));
  };

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API_URL}/admin/users`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Normalize backend response: convert 'id' to '_id'
        const normalizedUsers = data.users.map((user: any) => ({
          ...user,
          _id: user._id || user.id
        }));
        setUsers(normalizedUsers);
        setError(null);
      })
      .catch((err) => {
        console.error("Fetch Users Error:", err);
        setError("Failed to fetch users.");
      })
      .finally(() => setLoading(false));
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['jwt_token', 'user_role', 'user_id', 'name']);
      Alert.alert("Logged Out", "Redirecting to home screen...");
      router.replace("/");
    } catch (e) {
      Alert.alert("Error", "Failed to logout");
    }
  };

  const updateUserRole = (userId: string, newRole: string) => {
    fetch(`${API_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({ role: newRole })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Success", `User is now an ${newRole}.`);
          fetchUsers();
        } else {
          Alert.alert("Error", data.error || "Failed to update role.");
        }
      })
      .catch((err) => {
        console.error("Update Role Error:", err);
        Alert.alert("Error", "Failed to update role.");
      });
  };

  const deactivateUser = (userId: string) => {
    fetch(`${API_URL}/admin/users/${userId}/deactivate`, {
      method: 'PUT',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Success", "User deactivated.");
          fetchUsers();
        } else {
          Alert.alert("Error", data.error || "Failed to deactivate user.");
        }
      })
      .catch((err) => {
        console.error("Deactivate User Error:", err);
        Alert.alert("Error", "Failed to deactivate user.");
      });
  };

  const reactivateUser = (userId: string) => {
    fetch(`${API_URL}/admin/users/${userId}/activate`, {
      method: 'PUT',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Success", "User reactivated.");
          fetchUsers();
        } else {
          Alert.alert("Error", data.error || "Failed to reactivate user.");
        }
      })
      .catch((err) => {
        console.error("Reactivate User Error:", err);
        Alert.alert("Error", "Failed to reactivate user.");
      });
  };

  const deleteUser = (userId: string) => {
    console.log("Delete button pressed with userId:", userId);
    
    // Direct delete without alert confirmation
    console.log("API_URL:", API_URL);
    const url = `${API_URL}/admin/users/${userId}`;
    console.log("Fetching:", url);
    fetch(url, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then((res) => {
        console.log("Delete response status:", res.status);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Delete response:", data);
        if (data.success) {
          Alert.alert("Success", "User deleted.");
          fetchUsers();
        } else {
          Alert.alert("Error", data.error || "Failed to delete user.");
        }
      })
      .catch((err) => {
        console.error("Delete Error:", err);
        Alert.alert("Error", "Failed to delete user: " + err.message);
      });
  };

  if (loading && users.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#1b5e20" />
        <Text style={{marginTop: 10}}>Connecting to server...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, flexDirection: isMobile ? 'column' : 'row' }}>
     
      
      <ScrollView 
        style={[
          styles.container,
          isMobile ? {} : { marginLeft: 240 }
        ]}
        contentContainerStyle={isMobile ? undefined : { paddingBottom: 40 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Status</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusIndicator, { backgroundColor: error ? 'red' : '#4caf50' }]} />
            <Text style={styles.statusText}>
              {error ? "Backend Offline" : statusData?.message || "Online"}
            </Text>
          </View>
          {error && (
            <TouchableOpacity style={styles.retryBtn} onPress={fetchStatus}>
              <Text style={styles.retryBtnText}>Retry Connection</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.welcomeText}>Welcome, Administrator!</Text>

        <View style={[styles.card, { marginBottom: 40 }]}>
          <Text style={styles.cardTitle}>User Management</Text>
          <TouchableOpacity
            style={[styles.retryBtn, { alignSelf: 'flex-start', marginTop: 10 }]}
            onPress={() => setShowDeactivated((prev) => !prev)}
          >
            <Text style={styles.retryBtnText}>
              {showDeactivated ? 'Hide Deactivated' : 'Show Deactivated'}
            </Text>
          </TouchableOpacity>

          {(showDeactivated ? users : users.filter((u) => u.isActive !== false)).length === 0 ? (
            <Text style={styles.emptyText}>No users found.</Text>
        ) : (
          (showDeactivated ? users : users.filter((u) => u.isActive !== false)).map((user) => (
            <View key={user._id} style={styles.userRow}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>

              <View style={styles.userActions}>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={user.role}
                    onValueChange={(itemValue) => {
                      if (itemValue === "deactivate") {
                        deactivateUser(user._id);
                      } else {
                        updateUserRole(user._id, itemValue);
                      }
                    }}
                    style={styles.picker}
                    mode="dropdown"
                  >
                    <Picker.Item label="User" value="user" />
                    <Picker.Item label="Admin" value="admin" />
                    <Picker.Item label="Deactivate" value="deactivate" color="red" />
                  </Picker>
                </View>

                {user.isActive === false ? (
                  <TouchableOpacity 
                    onPress={() => reactivateUser(user._id)} 
                    style={styles.retryBtn}
                  >
                    <Text style={styles.retryBtnText}>Reactivate</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    onPress={() => deleteUser(user._id)} 
                    style={styles.deleteBtn}
                  >
                    <Text style={styles.deleteBtnText}>Deactivate</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminDashboard;