import React from 'react';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';
import { Card } from '@/ui/Card';

/**
 * "Carte" — placeholder. En Phase 1 : Mapbox (@rnmapbox/maps) avec tracé du
 * parcours, épingles des lieux visités et cartes hors ligne (cf. docs/06).
 */
export default function MapScreen() {
  return (
    <Screen>
      <Text variant="display">Carte</Text>
      <Card>
        <Text variant="heading">Bientôt : Mapbox</Text>
        <Text variant="body" muted>
          Le parcours animé de vos voyages, les lieux visités épinglés, et les cartes hors ligne
          téléchargées avant le départ.
        </Text>
      </Card>
    </Screen>
  );
}
