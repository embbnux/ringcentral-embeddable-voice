import { Module } from '@ringcentral-integration/commons/lib/di';
import { SettingsUI as BaseSettingsUI } from '@ringcentral-integration/widgets/modules/SettingsUI';

@Module({
  name: 'SettingsUI',
  deps: [
    'CallLogger',
    'ConversationLogger',
    'ThirdPartyService',
    'AudioSettings',
  ]
})
export class SettingsUI extends BaseSettingsUI {
  getUIProps(props) {
    const baseProps = super.getUIProps(props);
    const {
      callLogger,
      conversationLogger,
      appFeatures,
      thirdPartyService,
      audioSettings,
    } = this._deps;
    return {
      ...baseProps,
      version: props.appVersion,
      showAudio: audioSettings.availableDevices.length > 0 && appFeatures.isCallingEnabled,
      showAutoLog: callLogger.ready,
      autoLogEnabled: callLogger.autoLog,
      showAutoLogSMS: conversationLogger.loggerSourceReady,
      autoLogSMSEnabled: conversationLogger.autoLog,
      authorizationRegistered: thirdPartyService.authorizationRegistered,
      thirdPartyAuthorized: thirdPartyService.authorized,
      thirdPartyContactSyncing: thirdPartyService.contactSyncing,
      authorizedTitle: thirdPartyService.authorizedTitle,
      unauthorizedTitle: thirdPartyService.unauthorizedTitle,
      thirdPartyServiceName: thirdPartyService.serviceName,
      authorizationLogo: thirdPartyService.authorizationLogo,
      authorizedAccount: thirdPartyService.authorizedAccount,
      showFeedback: thirdPartyService.showFeedback,
      thirdPartySettings: thirdPartyService.settings,
      autoLogSMSTitle: 'Auto log messages',
      showRingtoneSettings: appFeatures.ringtonePermission,
    }
  }

  getUIFunctions(props) {
    const baseFuncs = super.getUIFunctions(props);
    const {
      callLogger,
      conversationLogger,
      thirdPartyService,
      routerInteraction,
    } = this._deps;
    return {
      ...baseFuncs,
      onAutoLogChange(autoLog) { callLogger.setAutoLog(autoLog); },
      onAutoLogSMSChange(autoLog) { conversationLogger.setAutoLog(autoLog); },
      onThirdPartyAuthorize: () => thirdPartyService.authorizeService(),
      onFeedbackSettingsLinkClick() {
        thirdPartyService.onShowFeedback();
      },
      onSettingToggle: setting => thirdPartyService.onSettingToggle(setting),
      gotoRingtoneSettings: () => routerInteraction.push('/settings/ringtone'),
    }
  }
}