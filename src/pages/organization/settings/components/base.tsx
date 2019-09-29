import { Button, Form, Input, Upload, message, Spin, Avatar, DatePicker } from 'antd';
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';
import Axios from 'axios';
import styles from './BaseView.less';
import { Organization } from '@/types';

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
            Axios.post('http://185.251.89.17/api/Organization/upload', formData, {
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
  { organization: Organization | null; loading: boolean; submitting: boolean }
> {
  view: HTMLDivElement | undefined = undefined;

  state = { organization: null, loading: true, submitting: false };

  componentDidMount() {
    Axios.get(`http://185.251.89.17/api/User/GetUserInfo?userId=${localStorage.getItem('user')}`, {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      console.log(res.data);
      this.setState({ organization: res.data.organization, loading: false });
    });
  }

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handlerSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields(err => {
      if (!err) {
        const organization = { ...this.state.organization, ...this.props.form.getFieldsValue() };
        this.setState({ submitting: true, organization });
        Axios.post('http://185.251.89.17/api/Organization/UpdateOrgInfo', organization, {
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
    console.log(this.state.organization);

    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem>
              {getFieldDecorator('avatar', {
                initialValue: this.state.organization.avatar,
              })(<AvatarView />)}
            </FormItem>
            <FormItem label="Название организации">
              {getFieldDecorator('Name', {
                initialValue: this.state.organization.name,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Информация об организации">
              {getFieldDecorator('desc', {
                initialValue: this.state.organization.desc,
              })(<Input.TextArea placeholder="Расскажите о себе" rows={4} />)}
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
