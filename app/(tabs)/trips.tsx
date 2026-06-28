import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { useTheme } from '@/core/theme/ThemeProvider';
import { useTrips } from '@/modules/trips/useTrips';

// Foyer de démonstration tant que l'invitation du partenaire n'est pas branchée (Phase 1).
const DEMO_HOUSEHOLD_ID = 'demo-household';

export default function TripsScreen() {
  const t = useTheme();
  const { trips, createTrip, softDelete } = useTrips();
  const [title, setTitle] = useState('');

  function onAdd() {
    if (!title.trim()) return;
    createTrip({ householdId: DEMO_HOUSEHOLD_ID, title: title.trim() });
    setTitle('');
  }

  return (
    <Screen>
      <Text variant="display">Voyages</Text>

      <Card>
        <Text variant="heading">Nouveau voyage</Text>
        <View style={{ flexDirection: 'row', gap: t.spacing.sm }}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Japon 2026"
            placeholderTextColor={t.color.textMuted}
            style={{
              flex: 1,
              backgroundColor: t.color.background,
              borderColor: t.color.hairline,
              borderWidth: 1,
              borderRadius: t.radius.md,
              padding: t.spacing.md,
              color: t.color.text,
              fontSize: 16,
            }}
          />
        </View>
        <Button title="Créer" onPress={onAdd} />
      </Card>

      {trips.length === 0 ? (
        <Text variant="body" muted>
          Votre premier voyage commence ici.
        </Text>
      ) : (
        trips.map((trip) => (
          <Card key={trip.id}>
            <Text variant="title">{trip.title}</Text>
            <Text variant="caption" muted>
              {trip.status} · {trip.dirty ? 'à synchroniser' : 'synchronisé'}
            </Text>
            <Pressable onPress={() => softDelete(trip.id)}>
              <Text variant="caption" color={t.color.danger}>
                Supprimer
              </Text>
            </Pressable>
          </Card>
        ))
      )}
    </Screen>
  );
}
