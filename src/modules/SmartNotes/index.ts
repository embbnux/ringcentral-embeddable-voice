import { Module } from '@ringcentral-integration/commons/lib/di';
import {
  action,
  RcModuleV2,
  state,
} from '@ringcentral-integration/core';
import { dynamicLoad } from '@ringcentral/mfe-react';
import callDirections from '@ringcentral-integration/commons/enums/callDirections';

@Module({
  name: 'SmartNotes',
  deps: [
    'Client',
    'Auth',
    'AppFeatures',
    'Webphone',
    'ContactMatcher',
  ],
})
export class SmartNotes extends RcModuleV2 {
  protected SmartNoteClient: any;
  protected _smartNoteClient: any;

  constructor(deps) {
    super({
      deps,
      storageKey: 'smartNotes',
      enableCache: false,
    });
    this.SmartNoteClient = null
    this._smartNoteClient = null;
  }

  onInitOnce() {
    if (this.hasPermission) {
      this._deps.webphone.onCallStart((webphoneSession) => {
        if (!webphoneSession.partyData) {
          return;
        }
        const phoneNumber =
          webphoneSession.direction === callDirections.outbound ?
            webphoneSession.to :
            webphoneSession.from;
        const feedbackName =
          webphoneSession.direction === callDirections.outbound ?
            webphoneSession.toUserName :
            webphoneSession.fromUserName;
        const contact = this._deps.contactMatcher.dataMapping[phoneNumber];
        this.setSession({
          id: webphoneSession.partyData.sessionId,
          status: 'Answered',
          phoneNumber: phoneNumber,
          contactName: contact && contact.length > 0 ? contact[0].name : feedbackName,
        });
      });
      this._deps.webphone.onCallEnd((webphoneSession) => {
        if (!webphoneSession.partyData) {
          return;
        }
        if (this.session?.id === webphoneSession.partyData.sessionId) {
          this.setSession({
            id: webphoneSession.partyData.sessionId,
            status: 'Disconnected',
          });
        }
      });
      dynamicLoad(
        '@ringcentral/smart-note-widget/src/bootstrap',
        'http://localhost:5000/remoteEntry.js',
      ).then((module) => {
        return this.SmartNoteClient = module.default.SmartNoteClient;
      })
    }
  }

  @state
  session = null;

  @action
  _setSession(session) {
    this.session = session;
  }

  setSession(session) {
    if (!this.SmartNoteClient) {
      return;
    }
    if (!this.session) {
      this._smartNoteClient = new this.SmartNoteClient({
        sdk: this._deps.client.service,
        telephonySessionId: session.id,
        extensionId: this._deps.auth.ownerId,
        telephonySessionStatus: session.status,
        contact: {
          name: session.contactName,
          phoneNumber: session.phoneNumber,
        }
      });
      this._setSession(session);
    } else {
      if (!session) {
        this._smartNoteClient.stop();
        this._smartNoteClient = null;
        this._setSession(null);
        return;
      }
      if (session.id === this.session.id) {
        this._setSession(session);
        this._smartNoteClient.updateTelephonySessionStatus(session.status);
      } else {
        this._setSession(null);
        this._smartNoteClient.stop();
        this._smartNoteClient = new this.SmartNoteClient({
          sdk: this._deps.client.service,
          telephonySessionId: session.id,
          extensionId: this._deps.auth.ownerId,
          telephonySessionStatus: session.status,
          contact: {
            name: session.contactName,
            phoneNumber: session.phoneNumber,
          }
        });
        this._setSession(session);
      }
    }
  }

  get hasPermission() {
    return this._deps.appFeatures.hasSmartNotePermission;
  }

  get smartNoteClient() {
    return this._smartNoteClient;
  }
}
