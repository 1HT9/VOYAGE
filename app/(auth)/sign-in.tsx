import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import { useTheme } from '@/core/theme/ThemeProvider';
import { signInWithEmail } from '@/core/auth/useAuth';

export default function SignIn() {
  const t = useTheme();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    const { error } = await signInWithEmail(email.trim());
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <Screen>
      <View style={{ gap: t.spacing.sm, marginTop: t.spacing.xxl }}>
        <Text variant="display">Voyage</Text>
        <Text variant="body" muted>
          Votre mémoire de voyage, à deux.
        </Text>
      </View>

      {sent ? (
        <Text variant="body">
          Lien envoyé à {email}. Ouvrez-le sur cet appareil pour vous connecter.
        </Text>
      ) : (
        <View style={{ gap: t.spacing.md, marginTop: t.spacing.xl }}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="vous@exemple.com"
            placeholderTextColor={t.color.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{
              backgroundColor: t.color.surface,
              borderColor: t.color.hairline,
              borderWidth: 1,
              borderRadius: t.radius.md,
              padding: t.spacing.lg,
              color: t.color.text,
              fontSize: 16,
            }}
          />
          {error ? <Text color={t.color.danger}>{error}</Text> : null}
          <Button title="Recevoir mon lien de connexion" onPress={onSubmit} />
          <Button title="Explorer sans compte" variant="ghost" onPress={() => router.replace('/(tabs)')} />
        </View>
      )}
    </Screen>
  );
}
