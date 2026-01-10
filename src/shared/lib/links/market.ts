import { Platform } from 'react-native';
import { Logger } from '../log';
import { openLink } from './openLink';

const MARKET_LINKS = {
  IOS_APP: 'itms-apps://apps.apple.com/id/app/id6753277971',
  IOS_WEB: 'https://apps.apple.com/app/id6753277971',
  ANDROID_APP: 'market://details?id=com.mymorningdiary.morningdiary',
  ANDROID_WEB: 'https://play.google.com/store/apps/details?id=com.mymorningdiary.morningdiary',
};

export const openMarketApp = async () => {
  const appLink = Platform.select({
    android: MARKET_LINKS.ANDROID_APP,
    ios: MARKET_LINKS.IOS_APP,
    default: '',
  });
  const webLink = Platform.select({
    android: MARKET_LINKS.ANDROID_WEB,
    ios: MARKET_LINKS.IOS_WEB,
    default: '',
  });

  const isAppLinkOpened = await openLink(appLink);
  if (!isAppLinkOpened) {
    const isWebLinkOpened = await openLink(webLink);

    if (!isWebLinkOpened) {
      Logger('openMarketApp').error(`Failed to open both market links: ${appLink} & ${webLink}`);
      return false;
    }
  }

  return true;
};
