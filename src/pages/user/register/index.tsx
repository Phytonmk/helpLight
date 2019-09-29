import {
  Button,
  Col,
  Form,
  Input,
  Popover,
  Progress,
  Row,
  Select,
  message,
  Radio,
  DatePicker,
} from 'antd';
import axios from 'axios';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';

import { withRouter } from 'umi';
import { StateType } from './model';
import styles from './style.less';

const uuidv4 = require('uuid/v4');

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: <div className={styles.success}>Хороший пароль</div>,
  pass: <div className={styles.warning}>Ненадежный пароль</div>,
  poor: <div className={styles.error}>Плохой пароль</div>,
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

interface RegisterProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  userRegister: StateType;
  submitting: boolean;
}
interface RegisterState {
  count: number;
  confirmDirty: boolean;
  visible: boolean;
  help: string;
  loading: boolean;
  prefix: string;
}

export interface UserRegisterParams {
  mail: string;
  password: string;
  confirm: string;
  mobile: string;
  captcha: string;
  prefix: string;
}

@connect(
  ({
    userRegister,
    loading,
  }: {
    userRegister: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    userRegister,
    submitting: loading.effects['userRegister/submit'],
  }),
)
class Register extends Component<RegisterProps, RegisterState> {
  state: RegisterState = {
    count: 0,
    loading: false,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '+7',
  };

  interval: number | undefined = undefined;

  componentDidUpdate() {
    const { userRegister, form } = this.props;
    const account = form.getFieldValue('mail');
    if (userRegister.status === 'ok') {
      message.success('注册成功！');
      router.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = window.setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (err === null) {
        const userId = uuidv4('Test');
        this.setState({ loading: true });
        const volunteer = {
          idVolunteer: uuidv4(),
          firstName: values.firstName,
          lastName: values.lastName,
          birthday: values.birthday,
        };
        const organization = {
          idOrganization: uuidv4(),
          Name: values.Name,
          city: values.city,
          address: values.address,
        };
        const roles = {
          volunteer,
          organization,
        };
        const role = values.role || 'volunteer';
        axios
          .post('http://185.251.89.17/api/User', {
            idUser: userId,
            userName: values.email,
            passwordHash: values.password,
            role,
            [role]: roles[role],
          })
          .then(() => {
            localStorage.setItem('user', userId);
            this.props.history.push('/');
            this.setState({ loading: false });
          })
          .catch(() => {
            message.error('Не удалось зарегестрироваться');
            this.setState({ loading: false });
          });
      } else {
        console.log(err);
      }
    });
  };

  checkConfirm = (rule: any, value: string, callback: (messgae?: string) => void) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Пароли не совпадают!');
    } else {
      callback();
    }
  };

  checkPassword = (rule: any, value: string, callback: (messgae?: string) => void) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: 'Это обязательное поле',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  changePrefix = (value: string) => {
    this.setState({
      prefix: value,
    });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { count, prefix, help, visible } = this.state;
    return (
      <div className={styles.main} style={{ textAlign: 'center' }}>
        <h3>Регистрация</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('role', { initialValue: 'volunteer' })(
              <Radio.Group size="large">
                <Radio.Button value="volunteer">Я Волонтер</Radio.Button>
                <Radio.Button value="organization">Я Музей</Radio.Button>
              </Radio.Group>,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: 'Это обязательное поле',
                },
                {
                  type: 'email',
                  message: 'Неправильный формат',
                },
              ],
            })(
              <Input
                size="large"
                placeholder={formatMessage({ id: 'user-register.email.placeholder' })}
              />,
            )}
          </FormItem>
          <FormItem help={help}>
            {getFieldDecorator('password', {
              rules: [
                {
                  validator: this.checkPassword,
                },
              ],
            })(<Input size="large" type="password" placeholder="Пароль" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Это обязательное поле',
                },
                {
                  validator: this.checkConfirm,
                  message: 'Пароли не совпадают!',
                },
              ],
            })(<Input size="large" type="password" placeholder="Повторите пароль" />)}
          </FormItem>
          {getFieldValue('role') !== 'organization' ? (
            <>
              <FormItem>
                {getFieldDecorator('firstName', {
                  rules: [
                    {
                      required: true,
                      message: 'Это обязательное поле',
                    },
                  ],
                })(<Input size="large" placeholder="Ваше Имя" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('lastName', {
                  rules: [
                    {
                      required: true,
                      message: 'Это обязательное поле',
                    },
                  ],
                })(<Input size="large" placeholder="Ваша Фамилия" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('birthday', {
                  rules: [
                    {
                      required: true,
                      message: 'Это обязательное поле',
                    },
                  ],
                })(
                  <DatePicker style={{ width: '100%' }} placeholder="Дата рождения" size="large" />,
                )}
              </FormItem>
            </>
          ) : (
            <>
              <FormItem>
                {getFieldDecorator('Name', {
                  rules: [
                    {
                      required: true,
                      message: 'Это обязательное поле',
                    },
                  ],
                })(<Input size="large" placeholder="Название Музея" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('city', {
                  rules: [
                    {
                      required: true,
                      message: 'Это обязательное поле',
                    },
                  ],
                })(<Input size="large" placeholder="Город" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('address', {
                  rules: [
                    {
                      required: true,
                      message: 'Это обязательное поле',
                    },
                  ],
                })(<Input size="large" placeholder="Адрес" />)}
              </FormItem>
            </>
          )}
          <FormItem>
            <Button
              size="large"
              loading={this.state.loading}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              Зарегестрироваться
            </Button>
            <Link className={styles.login} to="/user/login">
              Уже есть аккаунт?
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default withRouter(Form.create<RegisterProps>()(Register));
