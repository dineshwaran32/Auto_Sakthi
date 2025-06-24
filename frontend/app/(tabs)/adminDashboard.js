import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Title, Paragraph, Card, Chip, ActivityIndicator, Menu, Button } from 'react-native-paper';
import { useUser } from '../../context/UserContext';
import { useIdeas } from '../../context/IdeaContext';
import { useRouter } from 'expo-router';

const STATUS_OPTIONS = [
  'under review',
  'approved',
  'implemented',
  'rejected',
];

export default function AdminDashboard() {
  const { user } = useUser();
  const { ideas, loading, loadIdeas, updateIdeaStatus } = useIdeas();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.replace('/(tabs)/index'); // redirect non-admins
    } else {
      loadIdeas();
    }
  }, [user]);

  const openMenu = (id) => setMenuVisible(prev => ({ ...prev, [id]: true }));
  const closeMenu = (id) => setMenuVisible(prev => ({ ...prev, [id]: false }));

  const handleStatusChange = async (ideaId, newStatus) => {
    setUpdatingId(ideaId);
    try {
      await updateIdeaStatus(ideaId, { status: newStatus });
      await loadIdeas();
    } catch (e) {
      // Optionally show error
    } finally {
      setUpdatingId(null);
      closeMenu(ideaId);
    }
  };

  if (!user || user.role !== 'admin') {
    return null; // or a loading spinner
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Admin Dashboard</Title>
      <Paragraph>All submitted ideas:</Paragraph>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} />
      ) : (
        ideas.length === 0 ? (
          <Text style={{ marginTop: 32 }}>No ideas submitted yet.</Text>
        ) : (
          ideas.map(idea => (
            <Card key={idea._id} style={styles.ideaCard}>
              <Card.Title title={idea.title} subtitle={`By: ${idea.submittedBy?.name || 'Unknown'} (${idea.submittedBy?.employeeNumber || ''})`} />
              <Card.Content>
                <Paragraph>{idea.description}</Paragraph>
                <View style={styles.statusRow}>
                  <Chip style={styles.statusChip}>{idea.status}</Chip>
                  <Menu
                    visible={!!menuVisible[idea._id]}
                    onDismiss={() => closeMenu(idea._id)}
                    anchor={
                      <Button
                        mode="outlined"
                        onPress={() => openMenu(idea._id)}
                        loading={updatingId === idea._id}
                        disabled={updatingId === idea._id}
                        style={{ marginLeft: 8 }}
                      >
                        Change Status
                      </Button>
                    }
                  >
                    {STATUS_OPTIONS.filter(opt => opt !== idea.status).map(status => (
                      <Menu.Item
                        key={status}
                        onPress={() => handleStatusChange(idea._id, status)}
                        title={status.charAt(0).toUpperCase() + status.slice(1)}
                      />
                    ))}
                  </Menu>
                </View>
              </Card.Content>
            </Card>
          ))
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  ideaCard: { marginBottom: 16 },
  statusRow: { flexDirection: 'row', marginTop: 8, alignItems: 'center' },
  statusChip: { marginRight: 8 },
}); 