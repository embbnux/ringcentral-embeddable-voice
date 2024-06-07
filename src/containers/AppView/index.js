import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { styled, palette2 } from '@ringcentral/juno/foundation';
import { withPhone } from '@ringcentral-integration/widgets/lib/phoneContext';

import { DemoOnlyBanner } from '../../components/DemoOnlyBanner';
import { EnvironmentPanel } from '../../components/EnvironmentPanel';
import { SideDrawerContainer } from '../SideDrawerContainer';

import './styles.scss';

const Root = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${palette2('neutral', 'b01')};
  display: flex;
  flex-direction: row;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  max-width: 100%;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  overflow: hidden;
`;

function AppView(props) {
  return (
    <Root>
      <MainContent>
        <DemoOnlyBanner
          show={props.showDemoWarning}
          onClose={props.dismissDemoWarning}
        />
        <Content>
          {props.children}
          <EnvironmentPanel
            server={props.server}
            enabled={props.enabled}
            clientId={props.clientId}
            clientSecret={props.clientSecret}
            onSetData={props.onSetData}
            redirectUri={props.redirectUri}
            recordingHost={''}
          />
        </Content>
      </MainContent>
      <SideDrawerContainer />
    </Root>
  );
}

AppView.propTypes = {
  children: PropTypes.node,
  server: PropTypes.string,
  appKey: PropTypes.string,
  appSecret: PropTypes.string,
  enabled: PropTypes.bool,
  onSetData: PropTypes.func,
  redirectUri: PropTypes.string.isRequired,
};

AppView.defaultProps = {
  children: null,
  server: null,
  appSecret: null,
  appKey: null,
  enabled: false,
  onSetData: undefined,
};

export default withPhone(connect((_, {
  phone: {
    locale,
    oAuth,
    environment,
    adapter,
  },
}) => ({
  currentLocale: locale.currentLocale,
  server: environment.server,
  clientId: environment.clientId,
  clientSecret: environment.clientSecret,
  enabled: environment.enabled,
  redirectUri: oAuth.redirectUri,
  showDemoWarning: adapter.showDemoWarning,
}), (_, {
  phone: {
    environment,
    adapter,
  },
}) => ({
  onSetData: (options) => {
    environment.setData(options);
  },
  dismissDemoWarning: () => {
    adapter.dismissDemoWarning();
  },
}))(AppView));
