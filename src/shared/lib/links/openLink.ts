import { Linking } from 'react-native';
import { Logger } from '../log';

export const openLink = async (url: string): Promise<boolean> => {
  if (!url) return false;

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Logger('openLink').error(`Cannot open link: ${url}`);
      return false;
    }

    await Linking.openURL(url);
    return true;
  } catch (e) {
    Logger('openLink').error(`Error opening link ${url}:`, e);
    return false;
  }
};
