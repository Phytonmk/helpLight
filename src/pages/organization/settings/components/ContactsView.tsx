import { Button, Form, Input, Upload, message, Spin, Avatar, DatePicker } from 'antd';
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';
import Axios from 'axios';
import styles from './BaseView.less';
import { Volunteer } from '@/types';

const FormItem = Form.Item;

class BaseView extends Component<
  FormComponentProps,
  { volunteer: Volunteer | null; loading: boolean; submitting: boolean }
> {
  view: HTMLDivElement | undefined = undefined;

  state = { volunteer: null, loading: true, submitting: false };

  componentDidMount() {
    Axios.get(`http://185.251.89.17/api/User/GetUserInfo?userId=${localStorage.getItem('user')}`, {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      this.setState({ volunteer: res.data.volunteer, loading: false });
    });
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        form.setFieldsValue(obj);
      });
    }
  };

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handlerSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields(err => {
      if (!err) {
        const volunteer = { ...this.state.volunteer, contacts: this.props.form.getFieldsValue() };
        this.setState({ submitting: true, volunteer });
        Axios.post('http://185.251.89.17/api/Volunteer/UpdateVolunteerInfo', volunteer, {
          headers: {
            token: localStorage.getItem('user'),
          },
        })
          .then(res => {
            console.log(res.data);
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

  render() {
    if (this.state.loading) return <Spin />;

    const {
      form: { getFieldDecorator },
    } = this.props;
    console.log(this.state.volunteer.contacts);
    const contacts = this.state.volunteer.contacts || {};
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label="Telegram">
              {getFieldDecorator('tg', {
                initialValue: contacts.telegram,
              })(<Input />)}
            </FormItem>
            <FormItem label="Vk">
              {getFieldDecorator('vk', {
                initialValue: contacts.vk,
              })(<Input />)}
            </FormItem>
            <FormItem label="WhatsApp">
              {getFieldDecorator('wp', {
                initialValue: contacts.wp,
              })(<Input />)}
            </FormItem>
            <FormItem label="Facebook">
              {getFieldDecorator('fb', {
                initialValue: contacts.fb,
              })(<Input />)}
            </FormItem>
            <FormItem label="Instagram">
              {getFieldDecorator('inst', {
                initialValue: contacts.inst,
              })(<Input />)}
            </FormItem>

            <Button type="primary" onClick={this.handlerSubmit} loading={this.state.submitting}>
              Сохранить информацию
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(BaseView);
