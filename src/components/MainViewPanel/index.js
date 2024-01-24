import React from 'react';

import {
  Phone,
  PhoneBorder,
  Calls,
  CallsBorder,
  PhoneInbox,
  PhoneInboxBorder,
  BubbleLines,
  BubbleLinesBorder,
  Contacts,
  ContactsBorder,
  Videocam,
  VideocamBorder,
  MoreHoriz,
  Settings,
  SettingsBorder,
} from '@ringcentral/juno-icon';
import { RcIcon } from '@ringcentral/juno';
import TabNavigationView from '../TabNavigationView';

import i18n from './i18n';

const getIconRenderer = ({ Icon }) => {
  return ({ active }) => {
    const color = active ? 'nav.iconSelected' : 'nav.iconDefault';
    return (
      <RcIcon
        symbol={Icon}
        size="medium"
        color={color}
      />
    )
  }
}

export const MainViewPanel = (props) => {
  const {
    currentLocale,
    showMessages,
    unreadCounts,
    showMeeting,
    showCall,
    showHistory,
    showContacts,
    showGlip,
    glipUnreadCounts,
    isRCV,
    rcvProductName,
    settingsUnreadCount,
  } = props;
  const tabList = [
    showCall && {
      icon: getIconRenderer({ Icon: PhoneBorder }),
      activeIcon: getIconRenderer({ Icon: Phone }),
      label: i18n.getString('dialpadLabel', currentLocale),
      path: '/dialer',
      isActive: (currentPath) => (
        currentPath === '/dialer' ||
        currentPath === '/calls' ||
        currentPath.indexOf('/calls/active') !== -1
      ),
    },
    showCall && showHistory && {
      icon: getIconRenderer({ Icon: CallsBorder }),
      activeIcon: getIconRenderer({ Icon: Calls }),
      label: i18n.getString('historyLabel', currentLocale),
      path: '/history',
      isActive: (currentPath) => (
        currentPath === '/history'
      ),
    },
    showMessages && {
      icon: getIconRenderer({ Icon: PhoneInboxBorder }),
      activeIcon: getIconRenderer({ Icon: PhoneInbox }),
      label: i18n.getString('messagesLabel', currentLocale),
      path: '/messages',
      noticeCounts: unreadCounts,
      isActive: (currentPath) => (
        currentPath === '/messages' ||
        currentPath === '/composeText' ||
        currentPath.indexOf('/conversations/') !== -1
      ),
    },
    showGlip && {
      icon: getIconRenderer({ Icon: BubbleLinesBorder }),
      activeIcon: getIconRenderer({ Icon: BubbleLines }),
      label: i18n.getString('glipLabel', currentLocale),
      path: '/glip',
      noticeCounts: glipUnreadCounts,
      isActive: currentPath => (
        currentPath === '/glip' ||
        currentPath.indexOf('/glip/') !== -1
      ),
    },
    showContacts && {
      icon: getIconRenderer({ Icon: ContactsBorder }),
      activeIcon: getIconRenderer({ Icon: Contacts }),
      moreMenuIcon: getIconRenderer({ Icon: MoreHoriz }),
      label: i18n.getString('contactsLabel', currentLocale),
      path: '/contacts',
      isActive: (currentPath) => (
        currentPath.substr(0, 9) === '/contacts'
      ),
    },
    showMeeting && {
      icon: getIconRenderer({ Icon: VideocamBorder }),
      activeIcon: getIconRenderer({ Icon: Videocam }),
      moreMenuIcon: getIconRenderer({ Icon: MoreHoriz }),
      label: isRCV ? rcvProductName : i18n.getString('meetingLabel', currentLocale),
      path: isRCV ? '/meeting/home' : '/meeting/schedule',
      isActive: (currentPath) => (
        currentPath.indexOf('/meeting') === 0
      ),
    },
    {
      icon: getIconRenderer({ Icon: SettingsBorder }),
      activeIcon: getIconRenderer({ Icon: Settings }),
      moreMenuIcon: getIconRenderer({ Icon: MoreHoriz }),
      label: i18n.getString('settingsLabel', currentLocale),
      path: '/settings',
      noticeCounts: settingsUnreadCount,
      isActive: currentPath => (
        currentPath.substr(0, 9) === '/settings'
      ),
    }
  ];
  let tabs = tabList.filter((x) => !!x);
  if (tabs.length > 5) {
    const childTabs = tabs.slice(4, tabs.length);
    tabs = tabs.slice(0, 4);
    tabs.push({
      icon: ({ currentPath, active }) => {
        const childTab = childTabs.filter(childTab => (
          (currentPath === childTab.path || childTab.isActive(currentPath))
            && childTab.moreMenuIcon
        ));
        if (childTab.length > 0) {
          const Icon = childTab[0].moreMenuIcon;
          return <Icon active={active} />;
        }
        return (
          <RcIcon
            symbol={MoreHoriz}
            size="medium"
            color="nav.iconDefault"
          />
        )
      },
      activeIcon: ({ currentPath, active }) => {
        const childTab = childTabs.filter(childTab => (
          (currentPath === childTab.path || childTab.isActive(currentPath))
            && childTab.moreMenuIcon
        ));
        if (childTab.length > 0) {
          const Icon = childTab[0].moreMenuIcon;
          return <Icon active={active} />;
        }
        return (
          <RcIcon
            symbol={MoreHoriz}
            size="medium"
            color="nav.iconSelected"
          />
        )
      },
      label: i18n.getString('moreMenuLabel', currentLocale),
      virtualPath: '!moreMenu',
      isActive: (currentPath, currentVirtualPath) => (
        currentVirtualPath === '!moreMenu'
      ),
      childTabs,
      noticeCounts: childTabs.reduce((acc, childTab) => {
        if (childTab.noticeCounts) {
          acc += childTab.noticeCounts;
        }
        return acc;
      }, 0),
    });
  }
  return <TabNavigationView {...props} tabs={tabs} />;
}