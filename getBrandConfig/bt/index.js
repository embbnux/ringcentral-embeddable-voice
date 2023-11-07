const path = require('path');

module.exports = {
  prefix: 'rc-widget',
  brandConfig: {
    id: '7710',
    code: 'bt',
    name: 'BT Cloud Work',
    appName: 'BT Cloud Work Embeddable',
    fullName: 'BT Cloud Work',
    application: 'BT Cloud Work Embeddable',
    callWithJupiter: {
      link: 'https://app.cloudwork.bt.com/',
      protocol: 'com.bt.cloudwork.app://',
      name: 'BT Cloud Work App',
    },
    callWithSoftphone: {
      protocol: 'rcbtmobile://',
      name: 'BT Cloud Work Phone',
    },
    defaultLocale: 'en-GB',
    supportedLocales: [
      'en-GB',
      'en-US',
      'en-AU',
      'fr-FR',
      'fr-CA',
      'de-DE',
      'it-IT',
      'es-ES',
      'es-419',
      'ja-JP',
      'pt-PT',
      'pt-BR',
      'zh-CN',
      'zh-TW',
      'zh-HK',
      'nl-NL',
      'ko-KR',
    ],
    isDisableSpartan: true,
    allowRegionSettings: true,
    allowJupiterUniversalLink: false,
    rcmProductName: 'BT Cloud Work Meetings',
    rcvProductName: 'BT Cloud Work Video',
    rcvTeleconference: 'https://video.cloudwork.bt.com/teleconference',
    rcvMeetingTopic: "{extensionName}'s {shortName} Video meeting",
    rcvSettingsTitle: '{shortName} Video meeting settings',
    rcvInviteMeetingContent:
      "{accountName} has invited you to a {rcvProductName} meeting.\n\nPlease join using this link:\n    {joinUri}{passwordTpl}",
    teleconference: 'https://meetings.btcloudphone.bt.com/teleconference',
    eulaLink: 'https://www.bt.com/products/static/terms/terms-of-use.html',
    assets: {
      logo: '/assets/bt/logo.svg',
      icon: '/assets/bt/icon.svg',
    },
    showFeedback: false,
  },
  brandFolder: __dirname,
  assetsFolder: path.resolve(__dirname, '../../src/assets/bt'),
};
