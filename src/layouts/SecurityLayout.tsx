import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { ConnectState, ConnectProps } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import PageLoading from '@/components/PageLoading';

interface SecurityLayoutProps extends ConnectProps {
  loading: boolean;
}

interface SecurityLayoutState {
  isReady: boolean;
  userName: string;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {}

  render() {
    const { isReady } = this.state;
    const { children, loading } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    const isLogin = localStorage.getItem('user');
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin) {
      // return <Redirect to={`/user/login?${queryString}`}></Redirect>;
    }
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
