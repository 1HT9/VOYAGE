import React from 'react';
import { View } from 'react-native';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';
import { Card } from '@/ui/Card';
import { useTheme } from '@/core/theme/ThemeProvider';
import { useTrips } from '@/modules/trips/useTrips';

/**
 * "Aujourd'hui" — accueil contextuel. En Phase 0 : affiche le prochain voyage
 * et un compte à rebours. La logique avant/pendant/après viendra en Phase 1.
 */
export default function Today() {
  const t = useTheme();
  const { trips } = useTrips();
  const next = trips.find((x) => x.status !== 'past');

  const daysLeft = next?.startDate
    ? Math.ceil((new Date(next.startDate).getTime() - Date.now()) / 86_400_000)
    : null;

  return (
    <Screen>
      <View style={{ gap: t.spacing.xs }}>
        <Text variant="caption" muted>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
        <Text variant="display">Aujourd'hui</Text>
      </View>

      {next ? (
        <Card>
          <Text variant="caption" muted>
            Prochain voyage
          </Text>
          <Text variant="title">{next.title}</Text>
          {daysLeft != null && daysLeft >= 0 ? (
            <Text variant="heading" color={t.color.accentWarm}>
              J−{daysLeft}
            </Text>
          ) : null}
        </Card>
      ) : (
        <Card>
          <Text variant="heading">Aucun voyage pour l'instant</Text>
          <Text variant="body" muted>
            Créez votre premier voyage depuis l'onglet Voyages — votre aventure d'octobre vous attend.
          </Text>
        </Card>
      )}

      <Card>
        <Text variant="heading">À venir (Phase 1)</Text>
        <Text variant="body" muted>
          Check-lists à finir, prochaines réservations, météo de la destination, capture rapide.
        </Text>
      </Card>
    </Screen>
  );
}
