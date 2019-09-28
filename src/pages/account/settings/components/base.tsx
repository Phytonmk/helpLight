import { Button, Form, Input, Upload, message, Spin, Avatar, DatePicker } from 'antd';
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';
import Axios from 'axios';
import styles from './BaseView.less';
import { Volunteer } from '@/types';

const FormItem = Form.Item;

const AvatarView = ({ value, onChange }: { value: string; onChange: (url: string) => void }) => {
  const [tmpUrl, setTmpUrl] = React.useState('');
  return (
    <Fragment>
      <div className={styles.avatar_title}>Аватарка</div>
      <div style={{ textAlign: 'center' }}>
        <Avatar icon="user" size={100} src={tmpUrl || value} alt="avatar" />
      </div>
      <br />
      <br />
      <Upload
        fileList={[]}
        action={file =>
          new Promise(() => {
            const formData = new FormData();
            formData.append('uploadedFile', file);
            Axios.post('http://185.251.89.17/api/Volunteer/upload', formData, {
              headers: { token: localStorage.getItem('user') || '' },
            })
              .then(res => {
                const url = `http://185.251.89.17/MyImages/${res.data}`;
                setTmpUrl(url);
                onChange(url);
              })
              .catch(console.error);
          })
        }
        onChange={console.log}
      >
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Button icon="upload">Загрузить новую</Button>
        </div>
      </Upload>
    </Fragment>
  );
};

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
      console.log(res.data);
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

  getAvatarURL() {
    return this.state.volunteer !== null && this.state.volunteer.avatar
      ? this.state.volunteer.avatar
      : undefined;
  }

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handlerSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields(err => {
      if (!err) {
        const volunteer = { ...this.state.volunteer, ...this.props.form.getFieldsValue() };
        volunteer.birthday = volunteer.birthday.format();
        this.setState({ submitting: true, volunteer });
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

  render() {
    if (this.state.loading) return <Spin />;

    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem>
              {getFieldDecorator('avatar', {
                initialValue: this.state.volunteer.avatar,
              })(<AvatarView />)}
            </FormItem>
            <FormItem label="Имя">
              {getFieldDecorator('firstName', {
                initialValue: this.state.volunteer.firstName,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Фамилия">
              {getFieldDecorator('lastName', {
                initialValue: this.state.volunteer.lastName,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Немного о вас">
              {getFieldDecorator('about', {
                initialValue: this.state.volunteer.about,
              })(<Input.TextArea placeholder="Расскажите о себе" rows={4} />)}
            </FormItem>
            <FormItem label="Дата рождения">
              {getFieldDecorator('birthday', {
                initialValue: moment(new Date(this.state.volunteer.birthday).getTime()),
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<DatePicker />)}
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

export default Form.create<BaseViewProps>()(BaseView);
