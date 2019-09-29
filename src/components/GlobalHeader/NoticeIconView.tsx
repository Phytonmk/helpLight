import React, { Component } from 'react';
import { Tag, message } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import groupBy from 'lodash/groupBy';
import moment from 'moment';

import Axios from 'axios';
import { NoticeItem } from '@/models/global';
import NoticeIcon from '../NoticeIcon';
import { CurrentUser } from '@/models/user';
import { ConnectProps, ConnectState } from '@/models/connect';
import styles from './index.less';

export interface GlobalHeaderRightProps extends ConnectProps {
  notices?: string[];
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
}

class GlobalHeaderRight extends Component<GlobalHeaderRightProps> {
  state = {
    notices: [],
  };

  componentDidMount() {
    Axios.get(
      `http://185.251.89.17/api/Notification/GetNotificationsByUserId?userId=${localStorage.getItem(
        'user',
      )}`,
      {
        headers: {
          token: localStorage.getItem('user'),
        },
      },
    ).then(res => {
      this.setState({ notices: res.data.map(not => not.description) });
    });
  }

  render() {
    return (
      <NoticeIcon className={styles.action} count={this.state.notices.length} clearClose>
        <NoticeIcon.Tab
          tabKey="notification"
          count={this.state.notices.length}
          list={this.state.notices.map(title => ({ title }))}
          title="Уведомления"
          emptyText="Уведомлений нет!"
          showViewMore
        />
      </NoticeIcon>
    );
  }
}

export default connect(({ user, global, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(GlobalHeaderRight);
