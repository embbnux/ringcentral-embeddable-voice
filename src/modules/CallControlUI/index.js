import { CallControlUI as CallControlUIBase }  from '@ringcentral-integration/widgets/modules/CallControlUI';
import { Module } from '@ringcentral-integration/commons/lib/di';
import recordStatus from '@ringcentral-integration/commons/modules/Webphone/recordStatus';
import webphoneErrors from '@ringcentral-integration/commons/modules/Webphone/webphoneErrors';
import sessionStatus from '@ringcentral-integration/commons/modules/Webphone/sessionStatus';

@Module({
  name: 'CallControlUI',
  deps: [
    'Alert',
    'ActiveCallControl',
  ],
})
export default class CallControlUI extends CallControlUIBase {
  getUIProps(options) {
    const props = super.getUIProps(options);
    const session = { ...props.session };
    if (session.status === sessionStatus.connecting) {
      session.recordStatus = recordStatus.pending;
    }
    const {
      appFeatures,
      activeCallControl,
    } = this._deps;
    const telephonySessionId = props.session?.partyData?.sessionId;
    if (telephonySessionId && appFeatures.hasCallControl) {
      const telephonySession = activeCallControl.getActiveSession(telephonySessionId);
      if (telephonySession && session.recordStatus !== recordStatus.pending) {
        session.recordStatus = telephonySession.recordStatus;
      }
    }
    return {
      ...props,
      session,
    }
  }

  _getTelephonySessionId(webphoneSessionId) {
    const {
      appFeatures,
      activeCallControl,
      webphone
    } = this._deps;
    const webphoneSession =
      webphone.sessions.find((session) => session.id === webphoneSessionId);
    const telephonySessionId = webphoneSession?.partyData?.sessionId;
    if (telephonySessionId && appFeatures.hasCallControl) {
      const telephonySession = activeCallControl.getActiveSession(telephonySessionId);
      if (telephonySession) {
        return telephonySessionId;
      }
    }
    return null;
  }

  getUIFunctions(options) {
    const functions = super.getUIFunctions(options);
    return {
      ...functions,
      onRecord: async (sessionId) => {
        const {
          alert,
          activeCallControl,
          webphone
        } = this._deps;
        const telephonySessionId = this._getTelephonySessionId(sessionId);
        if (telephonySessionId) {
          try {
            webphone.updateRecordStatus(sessionId, recordStatus.pending);
            await activeCallControl.startRecord(telephonySessionId);
            webphone.updateRecordStatus(sessionId, recordStatus.recording);
          } catch (e) {
            alert.danger({
              message: webphoneErrors.recordError,
              payload: {
                errorCode: e.message,
              },
            });
            webphone.updateRecordStatus(sessionId, recordStatus.idle);
          }
          return;
        }
        return webphone.startRecord(sessionId);
      },
      onStopRecord: async (sessionId) => {
        const {
          alert,
          activeCallControl,
          webphone
        } = this._deps;
        const telephonySessionId = this._getTelephonySessionId(sessionId);
        if (telephonySessionId) {
          try {
            webphone.updateRecordStatus(sessionId, recordStatus.pending);
            await activeCallControl.stopRecord(telephonySessionId);
            webphone.updateRecordStatus(sessionId, recordStatus.idle);
          } catch (e) {
            if (e.response && e.response.status === 403) {
              alert.danger({
                message: 'stopRecordDisabled',
              });
            } else {
              alert.danger({
                message: webphoneErrors.recordError,
                payload: {
                  errorCode: e.message,
                },
              });
            }
            webphone.updateRecordStatus(sessionId, recordStatus.recording);
          }
          return;
        }
        return webphone.stopRecord(sessionId);
      },
    }
  }
}
