import {
  Button,
  Form,
  Input,
  Upload,
  message,
  Spin,
  Avatar,
  DatePicker,
  List,
  Divider,
  Icon,
} from 'antd';
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';
import Axios from 'axios';
import { Link } from 'umi';
import { Volunteer, Organization, Skill } from '@/types';

const uuidv4 = require('uuid/v4');

class Skills extends Component<
  FormComponentProps,
  { volunteer: Volunteer | null; loading: boolean; submitting: boolean; newSkill: string }
> {
  view: HTMLDivElement | undefined = undefined;

  state = { volunteer: null, loading: true, submitting: false, newSkill: '' };

  componentDidMount() {
    Axios.get(`http://185.251.89.17/api/User/GetUserInfo?userId=${localStorage.getItem('user')}`, {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      this.setState({ volunteer: res.data.volunteer, loading: false });
    });
  }

  handlerSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields(err => {
      if (!err) {
        const { volunteer } = this.state;
        this.setState({ submitting: true });
        Axios.post('http://185.251.89.17/api/Volunteer/UpdateVolunteerInfo', volunteer, {
          headers: {
            token: localStorage.getItem('user'),
          },
        })
          .then(res => {
            this.setState({ submitting: false });
            message.success('Информация успешно обновлена');
          })
          .catch(() => {
            this.setState({ submitting: false });
            message.error('Не удалось обновить информацию');
          });
      }
    });
  };

  addSkill() {
    if (this.state.newSkill) {
      let { skills } = this.state.volunteer;

      const newSkill: Skill = {
        description: this.state.newSkill,
        idSkill: uuidv4(),
        idVolunteer: this.state.volunteer.idVolunteer,
      };

      if (Array.isArray(skills)) {
        skills.push(newSkill);
      } else {
        skills = [newSkill];
      }
      this.setState({ volunteer: { ...this.state.volunteer, skills }, newSkill: '' });
    }
  }

  render() {
    if (this.state.loading) return <Spin />;

    return (
      <>
        <List
          dataSource={this.state.volunteer.skills || []}
          locale={{ emptyText: 'Добавьте навыки' }}
          renderItem={(skill: string) => <List.Item>{skill.description}</List.Item>}
        />
        <Divider dashed />
        <Input
          placeholder="Название нового навыка"
          value={this.state.newSkill}
          onChange={({ target: { value } }) => this.setState({ newSkill: value })}
        />
        <br />
        <br />
        <Button onClick={() => this.addSkill()}>
          <Icon type="plus" /> Добавить навык
        </Button>
        <Divider dashed />
        <Button type="primary" onClick={this.handlerSubmit} loading={this.state.submitting}>
          Сохранить информацию
        </Button>
      </>
    );
  }
}

export default Form.create()(Skills);
