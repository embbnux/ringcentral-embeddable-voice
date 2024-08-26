import { Module } from '@ringcentral-integration/commons/lib/di';
import {
  SettingsUI as BaseSettingsUI,
} from '@ringcentral-integration/widgets/modules/SettingsUI';

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
      autoLogTitle: thirdPartyService.callLoggerAutoSettingLabel,
      showAutoLogSMS: conversationLogger.loggerSourceReady,
      autoLogSMSEnabled: conversationLogger.autoLog,
      autoLogSMSTitle: thirdPartyService.messageLoggerAutoSettingLabel || 'Auto log messages',
      authorizationRegistered: thirdPartyService.authorizationRegistered,
      thirdPartyAuthorized: thirdPartyService.authorized,
      thirdPartyContactSyncing: thirdPartyService.contactSyncing,
      authorizedTitle: thirdPartyService.authorizedTitle,
      unauthorizedTitle: thirdPartyService.unauthorizedTitle,
      thirdPartyServiceName: thirdPartyService.serviceName,
      thirdPartyServiceInfo: thirdPartyService.serviceInfo,
      authorizationLogo: thirdPartyService.authorizationLogo,
      authorizedAccount: thirdPartyService.authorizedAccount,
      showAuthRedDot: thirdPartyService.showAuthRedDot,
      showFeedback: thirdPartyService.showFeedback,
      thirdPartySettings: thirdPartyService.settings,
      thirdPartyAuth: thirdPartyService.authorizationRegistered ? {
        serviceName: thirdPartyService.displayName || thirdPartyService.serviceName,
        serviceInfo: thirdPartyService.serviceInfo,
        authorized: thirdPartyService.authorized,
        contactSyncing: thirdPartyService.contactSyncing,
        authorizedTitle: thirdPartyService.authorizedTitle,
        unauthorizedTitle: thirdPartyService.unauthorizedTitle,
        authorizationLogo: thirdPartyService.authorizationLogo,
        authorizedAccount: thirdPartyService.authorizedAccount,
        showAuthRedDot: thirdPartyService.showAuthRedDot,
      } : null,
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
      onSettingToggle: setting => thirdPartyService.onUpdateSetting({
        ...setting,
        value: !setting.value,
      }),
      gotoThirdPartySection: (sectionId) => {
        routerInteraction.push(`/settings/thirdParty/${sectionId}`);
      },
      onThirdPartyButtonClick: (buttonId) => {
        thirdPartyService.onClickSettingButton(buttonId);
      },
    }
  }
}
