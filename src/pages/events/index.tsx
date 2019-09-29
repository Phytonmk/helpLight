import { Form, List, Switch } from 'antd';
import React, { Component } from 'react';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Axios from 'axios';
import { Event } from '@/components/Event';
import { Event as EventType, Application, Volunteer, Organization } from '../../types';

interface State {
  onlyMy: boolean;
  events: EventType[];
  loading: boolean;
  volunteer: Volunteer | null;
  organization: Organization | null;
}
class BasicList extends Component<{}, State> {
  state: State = { onlyMy: true, events: [], loading: false, volunteer: null, organization: null };

  componentDidMount() {
    Axios.get(`http://185.251.89.17/api/User/GetUserInfo?userId=${localStorage.getItem('user')}`, {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      if (res.data.volunteer) {
        this.setState({ volunteer: res.data.volunteer });
      }
      if (res.data.organization) {
        this.setState({ organization: res.data.organization });
      }
    });
    Axios.get('http://185.251.89.17/api/Event/getAllEvents', {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      this.setState({ events: res.data, loading: false });
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
        (this.state.organization &&
          event.idOrganization === this.state.organization.idOrganization) ||
        (event.applications || []).find(
          (application: Application) =>
            this.state.volunteer && application.idVolunteer === this.state.volunteer.idVolunteer,
        ),
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
