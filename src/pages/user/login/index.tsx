import { Alert, Checkbox, Icon, Tooltip } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import Link from 'umi/link';
import { connect } from 'dva';
import Axios from 'axios';
import { withRouter, router } from 'umi';
import { StateType } from './model';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;

interface LoginProps {
  dispatch: Dispatch<any>;
  userLogin: StateType;
  submitting: boolean;
}
interface LoginState {
  type: string;
  autoLogin: boolean;
  error: boolean;
  loading: boolean;
}
export interface FormDataType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

@connect(
  ({
    userLogin,
    loading,
  }: {
    userLogin: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    userLogin,
    submitting: loading.effects['userLogin/login'],
  }),
)
class Login extends Component<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type: 'account',
    autoLogin: true,
    error: false,
    loading: false,
  };

  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err: any, values: FormDataType) => {
    const { type } = this.state;
    this.setState({ loading: true });
    if (!err) {
      Axios.get('http://185.251.89.17/api/user/LoginUser', {
        params: {
          UserName: values.userName,
          Password: values.password,
        },
      })
        .then(res => {
          localStorage.setItem('user', res.data);
          this.setState({ error: false, loading: false });
          router.push('/');
          console.log('ok');
        })
        .catch(() => {
          this.setState({ error: true, loading: false });
        });
    }
  };

  onTabChange = (type: string) => {
    this.setState({ type });
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { userLogin, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={(form: any) => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="Войти по логину и паролю">
            {this.state.error &&
              !this.state.loading &&
              this.renderMessage('Неправильные логин или пароль')}
            <UserName
              name="userName"
              placeholder="Логин"
              rules={[
                {
                  required: true,
                  message: 'Это обязательное поле',
                },
              ]}
            />
            <Password
              name="password"
              placeholder="Пароль"
              rules={[
                {
                  required: true,
                  message: 'Это обязательное поле',
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              Запомнить меня
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              <Tooltip overlay="Постарайтесь вспомнить :'( или напишите админам, скоро эта функция станет доступна">
                Забыли пароль?
              </Tooltip>
            </a>
          </div>
          <Submit loading={this.state.loading}>Войти</Submit>
          <div className={styles.other}>
            <Link className={styles.register} to="/user/register">
              Зарегестрироваться
            </Link>
          </div>
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
