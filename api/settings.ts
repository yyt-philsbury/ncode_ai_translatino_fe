import { getSettingsDb } from 'api/db';

type SettingsType = {
  // targetLanguage: string;
  apiKey: string;
  temp: number;
  top_p: number;
  systemMsg: string;
};

export const initSettings = async () => {
  const settingsDb = getSettingsDb();
  const ret = await settingsDb.getItem<SettingsType>('settings');

  if (!ret) {
    const newSettings: SettingsType = {
      apiKey: '',
      temp: 1,
      top_p: 1,
      systemMsg: 'Translate to english',
    };
    await settingsDb.setItem('settings', newSettings);
  }
};

export const getLocalSettings = async (): Promise<SettingsType | null> => {
  return getSettingsDb().getItem<SettingsType>('settings');
};

export const setLocalSettings = async (
  settings: SettingsType,
): Promise<SettingsType> => {
  const currSettings = await getLocalSettings();
  const newSettings = {
    ...currSettings,
    ...settings,
  };
  await getSettingsDb().setItem('settings', newSettings);

  return newSettings;
};

