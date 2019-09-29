import {
  Button,
  Card,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  Select,
  Tooltip,
  message,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Axios from 'axios';
import uuidv4 from 'uuid/v4';
import { withRouter, router } from 'umi';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface BasicFormProps extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
}

class BasicForm extends Component<BasicFormProps> {
  state = { volunteer: null };

  componentDidMount() {
    Axios.get(`http://185.251.89.17/api/User/GetUserInfo?userId=${localStorage.getItem('user')}`, {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      if (res.data.volunteer) {
        this.setState({ volunteer: res.data.volunteer });
      }
    });
  }

  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Axios.post(
          'http://185.251.89.17/api/Application/CreateApplication',
          {
            idApplication: uuidv4(),
            volunteerComment: `${values.benefits || ''}\n${values.comment || ''}`,
            idVolunteer: this.state.volunteer.idVolunteer,
            idEvent: this.props.match.params.event,
          },
          {
            headers: {
              token: localStorage.getItem('user'),
            },
          },
        ).then(() => {
          message.success('Заявка отправлена');
          router.push('/apply-event-success');
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <PageHeaderWrapper content="Заявка на участие в событии">
        <p style={{ textAlign: 'center' }}>
          После отправки заявки организация рассмотрит вашу и другие заявки и выберет лучшие.
          <br />
          Информация о вашем профиле и достижениях будет предоставлена автоматически.
        </p>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ margin: 'auto', maxWidth: 400 }}
          >
            <FormItem>
              {getFieldDecorator('benefits', {
                rules: [],
              })(
                <Input.TextArea
                  style={{ minHeight: 100 }}
                  placeholder="Расскажите, почему именно вас должна выбрать организация в качестве волонтера. (Это не обязательное поле)"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('comment', {
                rules: [],
              })(
                <Input.TextArea
                  style={{ minHeight: 100 }}
                  placeholder="Произвольный комментарий к заявке"
                />,
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Отправить заявку
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default withRouter(
  Form.create<BasicFormProps>()(
    connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
      submitting: loading.effects['formBasicForm/submitRegularForm'],
    }))(BasicForm),
  ),
);
