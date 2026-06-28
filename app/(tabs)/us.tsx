import React from 'react';
import { View } from 'react-native';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { useTheme } from '@/core/theme/ThemeProvider';
import { useAuth, signOut } from '@/core/auth/useAuth';
import { isSupabaseConfigured } from '@/core/supabase/client';

/** "Nous" — l'espace couple : stats, souvenirs, profil du foyer. */
export default function UsScreen() {
  const t = useTheme();
  const { user, isAuthenticated } = useAuth();

  return (
    <Screen>
      <Text variant="display">Nous</Text>

      <Card>
        <Text variant="heading">Notre foyer</Text>
        <Text variant="body" muted>
          {isAuthenticated ? user?.email : 'Mode hors-ligne (aucun compte)'}
        </Text>
        {!isSupabaseConfigured ? (
          <Text variant="caption" color={t.color.warning}>
            Supabase non configuré — renseignez .env pour la sync et l'invitation du partenaire.
          </Text>
        ) : null}
      </Card>

      <Card>
        <Text variant="heading">Statistiques (Phase 2)</Text>
        <View style={{ flexDirection: 'row', gap: t.spacing.xl }}>
          <Stat label="Pays" value="0" />
          <Stat label="Villes" value="0" />
          <Stat label="Jours" value="0" />
        </View>
      </Card>

      {isAuthenticated ? <Button title="Se déconnecter" variant="ghost" onPress={() => signOut()} /> : null}
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text variant="title">{value}</Text>
      <Text variant="caption" muted>
        {label}
      </Text>
    </View>
  );
}
