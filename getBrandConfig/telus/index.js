const path = require('path');

module.exports = {
  prefix: 'rc-widget',
  brandConfig: {
    id: '7310',
    code: 'telus',
    name: 'TELUS Business Connect',
    appName: 'TELUS Business Connect Embeddable',
    fullName: 'TELUS Business Connect',
    application: 'TELUS Business Connect Embeddable',
    defaultLocale: 'en-US',
    supportedLocales: [
      'en-US',
      'en-GB',
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
    callWithJupiter: {
      link: 'https://app.businessconnect.telus.com/',
      protocol: 'rctelus://',
      name: 'TELUS Business Connect App',
    },
    callWithSoftphone: {
      protocol: 'rctelus://',
      name: 'TELUS Business Connect Phone',
    },
    allowRegionSettings: true,
    isDisableSpartan: true,
    allowJupiterUniversalLink: true,
    rcmProductName: 'TELUS Business Connect Meetings',
    rcvProductName: 'Business Connect Video Meeting',
    rcvMeetingTopic: "{extensionName}'s Business Connect Video meeting",
    rcvSettingsTitle: 'Business Connect Video meeting settings',
    rcvTeleconference: 'https://video.businessconnect.telus.com/teleconference',
    rcvInviteMeetingContent:
      '{accountName} has invited you to a TELUS Business Connect Video meeting.\n\nPlease join using this link:\n    {joinUri}{passwordTpl}',
    teleconference: 'https://meetings.businessconnect.telus.com/teleconference',
    eulaLink: 'http://telus.com/BusinessConnect/ServiceTerms',
    assets: {
      logo: '/assets/telus/logo.svg',
      icon: '/assets/telus/icon.svg',
    },
    showFeedback: false,
  },
  brandFolder: __dirname,
  assetsFolder: path.resolve(__dirname, '../../src/assets/telus'),
};
