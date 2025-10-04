import { Linking } from 'react-native';
import { Platform } from 'react-native';

export const openLink = async (url: string) => {
  try {
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
      return true;
    }

    console.error(`Cannot open link: ${url}`);
    return false;
  } catch (e) {
    console.error(`Error opening link ${url}:`, e);
    return false;
  }
};

const STORE_LINKS = {
  IOS_APP: 'itms-apps://apps.apple.com/id/app/id6753277971',
  IOS_WEB: 'https://apps.apple.com/app/id6753277971',
  ANDROID_APP: 'market://details?id=com.mymorningdiary.morningdiary',
  ANDROID_WEB: 'https://play.google.com/store/apps/details?id=com.mymorningdiary.morningdiary',
};

export const openStoreLink = async () => {
  const appLink = Platform.select({
    android: STORE_LINKS.ANDROID_APP,
    ios: STORE_LINKS.IOS_APP,
    default: '',
  });
  const webLink = Platform.select({
    android: STORE_LINKS.ANDROID_WEB,
    ios: STORE_LINKS.IOS_WEB,
    default: '',
  });

  try {
    const isAppLinkOpened = await openLink(appLink);
    if (!isAppLinkOpened) {
      const isWebLinkOpened = await openLink(webLink);

      if (!isWebLinkOpened) {
        console.error(`Failed to open both store links: ${appLink} & ${webLink}`);
        return false;
      }
    }

    return true;
  } catch (e) {
    console.error('Error opening store:', e);
    return false;
  }
};
