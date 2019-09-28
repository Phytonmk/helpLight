import { Avatar, Icon, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import router from 'umi/router';

import axios from 'axios';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component<
  {},
  { userName: string; avatar: string; role: string }
> {
  state = {
    userName: '',
    avatar: '',
    role: 'unknown',
  };

  componentDidMount() {
    axios
      .get(`http://185.251.89.17/api/User/GetUserInfo?userId=${localStorage.getItem('user')}`, {
        headers: {
          token: localStorage.getItem('user'),
        },
      })
      .then(res => {
        if (!res.data) {
          localStorage.removeItem('user');
          router.push('/');
        } else if (res.data.volunteer) {
          this.setState({
            userName: `${res.data.volunteer.firstName} ${res.data.volunteer.lastName}`,
            avatar: res.data.volunteer.avatar,
            role: 'volunteer',
          });
        } else if (res.data.organization) {
          this.setState({
            userName: `${res.data.organization.name}`,
            avatar: res.data.organization.avatar,
            role: 'organization',
          });
        }
      })
      .catch(() => {
        localStorage.removeItem('user');
        router.push('/');
      });
  }

  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      localStorage.removeItem('user');
      router.push('/');
      return;
    }
    router.push(`/${key}`);
  };

  render(): React.ReactNode {
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key={this.state.role === 'volunteer' ? 'account/center' : 'organization-center'}>
          <Icon type="user" />
          Аккаунт
        </Menu.Item>
        <Menu.Item
          key={this.state.role === 'volunteer' ? 'account/settings' : 'organization-settings'}
        >
          <Icon type="setting" />
          Настроить
        </Menu.Item>
        <Menu.Divider />

        <Menu.Item key="logout">
          <Icon type="logout" />
          Выйти
        </Menu.Item>
      </Menu>
    );

    return this.state.userName ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={this.state.avatar} alt="avatar" />
          <span>{this.state.userName}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    );
  }
}
export default AvatarDropdown;
