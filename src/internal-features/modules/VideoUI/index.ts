import { Module } from 'ringcentral-integration/lib/di';
import RcUIModule from 'ringcentral-widgets/lib/RcUIModule';
import Brand from 'ringcentral-integration/modules/Brand';

import { RcVideo } from '../RcV/rcvideo';

@Module({
  name: 'VideoUI',
  deps: ['RcVideo', 'Locale', 'RateLimiter', 'ConnectivityMonitor', 'Brand'],
})
export default class VideoUI extends RcUIModule {
  private _locale: any;
  private _rcVideo: RcVideo;
  private _rateLimiter: any;
  private _connectivityMonitor: any;
  private _brand: Brand;
  constructor({
    rcVideo,
    locale,
    rateLimiter,
    connectivityMonitor,
    brand,
    ...options
  }) {
    super({
      ...options,
    });
    this._rcVideo = rcVideo;
    this._locale = locale;
    this._rateLimiter = rateLimiter;
    this._connectivityMonitor = connectivityMonitor;
    this._brand = brand;
  }

  getUIProps({ disabled }) {
    return {
      currentLocale: this._locale.currentLocale,
      meeting: this._rcVideo.meeting,
      showSaveAsDefault: this._rcVideo._saveAsDefaultSetting,
      brandName: this._brand.name,
      disabled:
        this._rcVideo.isScheduling ||
        disabled ||
        !this._connectivityMonitor.connectivity ||
        (this._rateLimiter && this._rateLimiter.throttling),
    };
  }

  getUIFunctions({ schedule }) {
    return {
      updateMeetingSettings: (value) =>
        this._rcVideo.updateMeetingSettings(value),
      invite: async (meetingInfo) => {
        if (schedule) {
          await schedule(meetingInfo);
          return;
        }
        await this._rcVideo.createMeeting(meetingInfo);
      },
      init: () => {
        this._rcVideo.init();
      },
    };
  }
}
