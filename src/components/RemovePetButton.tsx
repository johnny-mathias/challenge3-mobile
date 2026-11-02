import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useTranslation } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { themes } from '../theme/theme';

interface RemovePetButtonProps {
  name: string;
  onRemove: () => Promise<unknown>;
}

// Remover fica só na tela de edição do pet (antes ficava em cada card da lista),
// com a mesma confirmação; ao remover, volta para a lista
export default function RemovePetButton({ name, onRemove }: RemovePetButtonProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const [isRemoving, setIsRemoving] = useState(false);

  async function remove() {
    setIsRemoving(true);
    try {
      await onRemove();
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(t('pets.removeError'), error?.message ?? t('error.generic'));
    } finally {
      setIsRemoving(false);
    }
  }

  function handlePress() {
    Alert.alert(t('pets.removeTitle'), t('pets.removeConfirm', { name }), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.remove'), style: 'destructive', onPress: remove },
    ]);
  }

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress} disabled={isRemoving}>
      {isRemoving ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{t('pets.removeTitle')}</Text>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (theme: (typeof themes)['light']) =>
  StyleSheet.create({
    button: {
      backgroundColor: theme.colors.remove,
      padding: 16,
      borderRadius: 8,
      marginBottom: 40,
      alignItems: 'center',
    },

    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
