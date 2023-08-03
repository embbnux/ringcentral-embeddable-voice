import { OAuth as OAuthBase } from '@ringcentral-integration/widgets/modules/OAuth';
import { authMessages } from '@ringcentral-integration/commons/modules/Auth/authMessages';
import parseCallbackUri from '@ringcentral-integration/widgets/lib/parseCallbackUri';
import { Module } from '@ringcentral-integration/commons/lib/di';
import { watch } from '@ringcentral-integration/core';

@Module({
  name: 'OAuth',
  deps: []
})
export class OAuth extends OAuthBase {
  protected _authorizationCode?: string;
  protected _authorizationCodeVerifier?: string;
  protected _disableLoginPopup?: boolean;
  protected _jwt?: string;

  constructor(deps) {
    super(deps);
    this._authorizationCode = deps.oAuthOptions.authorizationCode;
    this._authorizationCodeVerifier = deps.oAuthOptions.authorizationCodeVerifier;
    this._disableLoginPopup = deps.oAuthOptions.disableLoginPopup;
    this._jwt = deps.oAuthOptions.jwt;
  }

  override onInitOnce() {
    super.onInitOnce();
    watch(
      this,
      () => this.ready,
      async () => {
        if (!this.ready) {
          return;
        }
        if (this._deps.auth.loggedIn) {
          return;
        }
        if (this._authorizationCode) {
          await this._silentLoginWithCode();
          return;
        }
        if (this._jwt) {
          await this._deps.auth.jwtLogin(this._jwt);
        }
      },
    );
  }

  async _silentLoginWithCode() {
    try {
      if (this._authorizationCodeVerifier) {
        // TODO: remove this when we have a better way to handle the code verifier
        this._deps.client.service.platform()._codeVerifier = this._authorizationCodeVerifier;
      }
      await this._loginWithCallbackQuery({
        code: this._authorizationCode,
        // code_verifier: this._authorizationCodeVerifier
      });
    } catch (e) {
      console.error(e);
    }
  }

  get oAuthUri() {
    const query = {
      redirectUri: this.redirectUri,
      brandId: this._deps.brand.id,
      state: this.authState,
      display: 'page',
      implicit: this._deps.auth.isImplicit,
      localeId: this._deps.locale.currentLocale,
      uiOptions: ['hide_remember_me', 'hide_tos']
    };
    if (query.brandId === "1210") {
      delete query.brandId; // don't remove this, for support private apps from no RC US brand
    }
    return this._deps.auth.getLoginUrl(query);
  }

  async _handleCallbackUri(callbackUri, refresh = false) {
    try {
      const query = parseCallbackUri(callbackUri);
      if (this._deps.auth.useWAP) {
        await this._deps.auth.wapLogin(callbackUri);
        return;
      }
      if (query.jwt) {
        await this._deps.auth.jwtLogin(query.jwt);
        return;
      }
      if (query.code_verifier) {
        // TODO: remove this when we have a better way to handle the code verifier
        this._deps.client.service.platform()._codeVerifier = query.code_verifier;
      }
      if (refresh) {
        await this._refreshWithCallbackQuery(query);
      } else {
        await this._loginWithCallbackQuery(query);
      }
    } catch (error) {
      console.error('oauth error: ', error);
      if (error && error.error_description) {
        console.error('oauth error description: ', error.error_description);
      }
      let message;
      switch (error.message) {
        case 'invalid_request':
        case 'unauthorized_client':
        case 'unsupported_response_type':
        case 'invalid_scope':
        case 'login_required':
        case 'interaction_required':
        case 'access_denied':
          message = authMessages.accessDenied;
          break;
        case 'server_error':
        case 'temporarily_unavailable':
        default:
          message = authMessages.internalError;
          break;
      }
      if (message) {
        this._deps.alert.danger({
          message,
          payload: error,
        });
      }
    }
  }

  async openOAuthPage() {
    if (this._disableLoginPopup) {
      if (this._deps.client.service.platform().discovery()) {
        await this._deps.client.service.platform().loginUrlWithDiscovery();
      }
      window.parent.postMessage({
        type: 'rc-login-popup-notify',
        oAuthUri: this.oAuthUri,
      }, '*');
      return;
    }
    await super.openOAuthPage();
  }
}
