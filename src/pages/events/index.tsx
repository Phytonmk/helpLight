import { Form, List, Switch } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Axios from 'axios';
import { Event } from '@/components/Event';
import { Event as EventType } from '../../types';

interface State {
  onlyMy: boolean;
  events: EventType[];
  loading: boolean;
}
class BasicList extends Component<{}, State> {
  state: State = { onlyMy: false, events: [], loading: false };

  componentDidMount() {
    Axios.get(`http://185.251.89.17/api/User/GetUserInfo?userId=${localStorage.getItem('user')}`, {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      if (res.data.volunteer) {
        // Axios.get(`http://185.251.89.17/api/Event/getAllOrganizationEvents?id=${res.data.volunteer.idVounteer}`, {
        //   headers: {
        //     token: localStorage.getItem('user'),
        //   },
        // }).then(res => {
        //   this.setState({ events: res.data, loading: false });
        // });
      } else if (res.data.organization) {
        Axios.get(
          `http://185.251.89.17/api/Event/getAllOrganizationEvents?id=${res.data.organization.idOrganization}`,
          {
            headers: {
              token: localStorage.getItem('user'),
            },
          },
        ).then(res => {
          this.setState({ events: res.data, loading: false });
        });
      }
    });
  }

  render() {
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
    };
    const { events, loading } = this.state;

    const filteredEvents = events.filter(
      event =>
        !this.state.onlyMy ||
        (event.applies || []).find(apply => apply.id === localStorage.getItem('user')),
    );

    return (
      <>
        <PageHeaderWrapper title="Мероприятия">
          <Switch checked={this.state.onlyMy} onChange={onlyMy => this.setState({ onlyMy })} />{' '}
          Показать только мои мероприятия
          <br />
          <br />
          <List<EventType>
            size="large"
            rowKey="id"
            loading={loading}
            pagination={paginationProps}
            dataSource={filteredEvents}
            renderItem={item => <Event event={item} />}
          />
        </PageHeaderWrapper>
      </>
    );
  }
}

export default Form.create<Props>()(BasicList);
