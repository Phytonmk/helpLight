import { Button, Form, Input, Upload, message, Spin, Avatar, DatePicker, List } from 'antd';
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';
import Axios from 'axios';
import { Link } from 'umi';
import { Volunteer, Organization } from '@/types';

class BaseView extends Component<
  FormComponentProps,
  { volunteers: Volunteer[]; loading: boolean }
> {
  view: HTMLDivElement | undefined = undefined;

  state = { volunteers: [], loading: true };

  componentDidMount() {
    Axios.get(`http://185.251.89.17/api/User/GetUserInfo?userId=${localStorage.getItem('user')}`, {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      Axios.get(
        `http://185.251.89.17/api/VolunteerOrganization/GetVolunteersByOrganization/${res.data.organization.idOrganization}`,
        {
          headers: {
            token: localStorage.getItem('user'),
          },
        },
      ).then(res => {
        this.setState({ volunteers: res.data, loading: false });
      });
    });
  }

  render() {
    if (this.state.loading) return <Spin />;

    return (
      <>
        <List
          dataSource={this.state.volunteers}
          locale={{ emptyText: 'Ни один волонтер не привязан к вашей организации' }}
          renderItem={(volunteer: Volunteer) => (
            <List.Item>
              <Link to={`volunteers/${volunteer.idVolunteer}`}>
                {volunteer.firstName} {volunteer.lastName}
              </Link>
            </List.Item>
          )}
        />
      </>
    );
  }
}

export default Form.create()(BaseView);
