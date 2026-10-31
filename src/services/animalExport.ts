import { Platform } from 'react-native';

import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import type { OracleAnimal } from '../types/api.types';

// Mesmo nome usado no script do mongoimport (--file "./03_animais.json" --jsonArray)
export const ANIMALS_EXPORT_FILENAME = '03_animais.json';

function downloadOnWeb(content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = ANIMALS_EXPORT_FILENAME;
  link.click();
  URL.revokeObjectURL(url);
}

// Gera o JSON (array, formato do mongoimport) e entrega ao usuário:
// no celular abre o menu de compartilhar/salvar; na web baixa o arquivo.
export async function exportAnimalsJson(animals: OracleAnimal[]) {
  const content = JSON.stringify(animals, null, 2);

  if (Platform.OS === 'web') {
    downloadOnWeb(content);
    return;
  }

  const file = new File(Paths.cache, ANIMALS_EXPORT_FILENAME);
  if (file.exists) file.delete();
  file.create();
  file.write(content);

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Compartilhamento de arquivos indisponível neste dispositivo');
  }

  await Sharing.shareAsync(file.uri, {
    mimeType: 'application/json',
    dialogTitle: 'Salvar dataset de animais',
    UTI: 'public.json',
  });
}
