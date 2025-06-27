import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  Badge,
  IconButton,
  Portal,
  Modal,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';
import { useIdeas } from '../../context/IdeaContext';
import { theme, spacing } from '../../utils/theme';
import api from '../../utils/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { ideas } = useIdeas();

  const [bellVisible, setBellVisible] = React.useState(false);
  const slideAnim = React.useRef(new Animated.Value(350)).current; // panel width

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const res = await api.get('/api/notifications');
      setNotifications(res.data.data.notifications);
      setUnreadCount(res.data.data.unreadCount);
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {}
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
      fetchNotifications();
    } catch (err) {}
  };

  const showBellPopup = () => {
    setBellVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const hideBellPopup = () => {
    Animated.timing(slideAnim, {
      toValue: 350,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setBellVisible(false));
  };

  const userIdeas = ideas.filter(idea => idea.submittedBy?.employeeNumber === user?.employeeNumber);
  const approvedIdeas = userIdeas.filter(idea => idea.status === 'approved');
  const pendingIdeas = userIdeas.filter(idea => idea.status === 'under_review');
  const implementedIdeas = ideas.filter(idea => idea.status === 'implementing' || idea.status === 'implemented');

  const menuItems = [
    {
      title: 'Submit Idea',
      subtitle: 'Share your improvement idea',
      icon: 'add-circle',
      color: theme.colors.primary,
      route: 'submit',
    },
    {
      title: 'My Ideas',
      subtitle: `${userIdeas.length} ideas submitted`,
      icon: 'track-changes',
      color: theme.colors.secondary,
      route: 'tracker',
    },
    {
      title: 'Leaderboard',
      subtitle: 'Top contributors',
      icon: 'leaderboard',
      color: theme.colors.primary,
      route: 'leaderboard',
    },
    {
      title: 'Implemented',
      subtitle: `${implementedIdeas.length} success stories`,
      icon: 'check-circle',
      color: theme.colors.primary,
      route: 'implemented',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Side Notification Drawer */}
      {bellVisible && (
        <Animated.View style={[styles.bellDrawer, { right: slideAnim }]}> 
          <View style={styles.bellDrawerHeader}>
            <Text style={styles.bellDrawerTitle}>Notifications</Text>
            <IconButton icon="close" size={24} onPress={hideBellPopup} />
          </View>
          <Button mode="text" onPress={markAllAsRead} disabled={unreadCount === 0}>
            Mark all as read
          </Button>
          {loadingNotifications ? (
            <Text>Loading...</Text>
          ) : notifications.length === 0 ? (
            <Text style={styles.bellDrawerText}>No notifications yet.</Text>
          ) : (
            <ScrollView style={{ width: '100%' }}>
              {notifications.map((n) => (
                <Card key={n._id} style={{ marginBottom: 8, backgroundColor: n.isRead ? '#f5f5f5' : '#e3f2fd' }}>
                  <Card.Content>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold' }}>{n.title}</Text>
                        <Paragraph>{n.message}</Paragraph>
                        <Text style={{ fontSize: 12, color: '#888' }}>{new Date(n.createdAt).toLocaleString()}</Text>
                      </View>
                      {!n.isRead && (
                        <Button mode="text" onPress={() => markAsRead(n._id)} compact>
                          Mark as read
                        </Button>
                      )}
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </ScrollView>
          )}
        </Animated.View>
      )}
      <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: 100 }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar.Text 
              size={48} 
              label={user?.name?.split(' ').map(n => n[0]).join('') || 'U'} 
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Title style={styles.userName}>Hi, {user?.name?.split(' ')[0]}</Title>
              <Paragraph style={styles.userRole}>
                {user?.designation} • {user?.department}
              </Paragraph>
            </View>
            <View>
              <IconButton
                icon="bell"
                size={28}
                iconColor={theme.colors.primary}
                onPress={showBellPopup}
              />
              {unreadCount > 0 && (
                <Badge style={{ position: 'absolute', top: 2, right: 2 }}>{unreadCount}</Badge>
              )}
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={[styles.statCard, { backgroundColor: theme.colors.onPrimary }]}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {approvedIdeas.length}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Approved Ideas
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {pendingIdeas.length}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Under Review
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Your Recent Ideas
          </Text>
          
          {userIdeas.slice(0, 3).map((idea) => (
            <Card key={idea._id || idea.id} style={styles.activityCard}>
              <Card.Content style={styles.activityContent}>
                <View style={styles.activityInfo}>
                  <Text variant="titleMedium" style={styles.activityTitle}>
                    {idea.title}
                  </Text>
                  <Text variant="bodySmall" style={styles.activityDate}>
                    {idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : ''}
                  </Text>
                </View>
                <Badge 
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(idea.status) }
                  ]}
                >
                  {getStatusText(idea.status)}
                </Badge>
              </Card.Content>
            </Card>
          ))}

          {userIdeas.length === 0 && (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <MaterialIcons 
                  name="lightbulb-outline" 
                  size={48} 
                  color={theme.colors.onSurfaceVariant} 
                />
                <Text variant="titleMedium" style={styles.emptyTitle}>
                  No ideas yet
                </Text>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  Start your Sakthi Spark journey by submitting your first improvement idea!
                </Text>
                <Button 
                  mode="contained" 
                  style={styles.emptyButton}
                  onPress={() => router.push('submit')}
                >
                  Submit First Idea
                </Button>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Menu Grid */}
        <View style={styles.menuContainer}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <Card 
                key={index} 
                style={styles.menuCard}
                onPress={() => router.push(item.route)}
              >
                <Card.Content style={styles.menuContent}>
                  <MaterialIcons 
                    name={item.icon} 
                    size={32} 
                    color={item.color} 
                    style={styles.menuIcon}
                  />
                  <Text variant="titleMedium" style={styles.menuTitle}>
                    {item.title}
                  </Text>
                  <Text variant="bodySmall" style={styles.menuSubtitle}>
                    {item.subtitle}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case 'approved': return theme.colors.success;
    case 'rejected': return theme.colors.error;
    case 'implementing': return theme.colors.tertiary;
    default: return theme.colors.secondary;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'approved': return 'Approved';
    case 'rejected': return 'Rejected';
    case 'implementing': return 'Implementing';
    default: return 'Under Review';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    padding: spacing.md,
    // paddingBottom: spacing.xl, // handled inline for floating nav bar
  },
  header: {
    padding: spacing.lg,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  userDetails: {
    marginLeft: spacing.md,
    flex: 1,
  },
  userName: {
    marginBottom: 0,
    color: theme.colors.onSurface,
  },
  userRole: {
    color: theme.colors.onSurfaceVariant,
    marginTop: -spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  activityCard: {
    marginBottom: spacing.sm,
    elevation: 1,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    marginBottom: spacing.xs,
  },
  activityDate: {
    color: theme.colors.onSurfaceVariant,
  },
  statusBadge: {
    marginLeft: spacing.md,
  },
  emptyCard: {
    elevation: 1,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.lg,
  },
  emptyButton: {
    marginTop: spacing.sm,
  },
  bellDrawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 320,
    backgroundColor: 'white',
    elevation: 8,
    zIndex: 100,
    padding: spacing.lg,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  bellDrawerHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  bellDrawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  bellDrawerText: {
    fontSize: 16,
    color: theme.colors.onSurface,
    marginTop: spacing.md,
  },
  menuContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: '48%',
    elevation: 2,
    marginBottom: spacing.md,
    backgroundColor: theme.colors.surface,
  },
  menuContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    minHeight: 100,
    textAlign: 'center',
  },
  menuIcon: {
    marginBottom: spacing.sm,
    alignSelf: 'center',
  },
  menuTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    fontSize: 14,
  },
  menuSubtitle: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    fontSize: 11,
    lineHeight: 14,
  },
});