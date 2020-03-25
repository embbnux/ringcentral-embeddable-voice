import { combineReducers } from 'redux';
import getModuleStatusReducer from 'ringcentral-integration/lib/getModuleStatusReducer';

import { RcVideoActionTypes } from './actionTypes';
import createStatus from './createStatus';

export function getRcVideoInfoReducer(types: RcVideoActionTypes) {
  return (state = {}, { type, meeting = null }) => {
    switch (type) {
      case types.initSuccess:
      case types.updateMeetingSettings:
        return { ...state, ...meeting };
      default:
        return state;
    }
  };
}

export function getRcVideoCreatingStatusReducer(types: RcVideoActionTypes) {
  return (state = createStatus.idle, { type }) => {
    switch (type) {
      case types.initCreating:
        return createStatus.creating;
      case types.created:
        return createStatus.created;
      case types.resetCreating:
        return createStatus.idle;
      default:
        return state;
    }
  };
}

export function getDefaultVideoSettingReducer(types: RcVideoActionTypes) {
  return (state = {}, { type, meeting = null }) => {
    switch (type) {
      case types.saveAsDefaultSetting:
        return { ...state, ...meeting };
      default:
        return state;
    }
  };
}

export function getPersonalMeetingReducer(types: RcVideoActionTypes) {
  return (state = null, { type, meeting = null }) => {
    switch (type) {
      case types.savePersonalMeeting:
        return { ...state, ...meeting };
      default:
        return state;
    }
  };
}

export function getLastVideoStorageReducer(types: RcVideoActionTypes) {
  return (state = {}, { type, meeting = null }) => {
    switch (type) {
      case types.created:
        // eslint-disable-next-line no-case-declarations
        const { allowJoinBeforeHost, muteAudio, muteVideo } = meeting;
        return { allowJoinBeforeHost, muteAudio, muteVideo };
      default:
        return state;
    }
  };
}

export function getHistoryMeetingsReducer(types: RcVideoActionTypes) {
  return (state = [], { type, meetings = [], pageToken }) => {
    switch (type) {
      case types.saveMeetings: {
        if (!pageToken) {
          return meetings;
        }
        return [].concat(state).concat(meetings);
      }
      case types.cleanMeetings: {
        return [];
      }
      default:
        return state;
    }
  };
}

export function getUpcomingMeetingsReducer(types: RcVideoActionTypes) {
  return (state = [], { type, meetings = [], pageToken }) => {
    switch (type) {
      case types.saveUpcomingMeetings: {
        return meetings;
      }
      case types.cleanUpcomingMeetings: {
        return [];
      }
      default:
        return state;
    }
  };
}

export default (types, reducers) =>
  combineReducers({
    ...reducers,
    meeting: getRcVideoInfoReducer(types),
    status: getModuleStatusReducer(types),
    creatingStatus: getRcVideoCreatingStatusReducer(types),
    historyMeetings: getHistoryMeetingsReducer(types),
    upcomingMeetings: getUpcomingMeetingsReducer(types),
  });
