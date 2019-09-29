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
  Rate,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import RadioGroup from 'antd/es/radio/group';
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
  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Axios.get(
          `http://185.251.89.17/api/Application/WasOnEvent?applicationId=${this.props.match.params.application}`,
          {
            headers: {
              token: localStorage.getItem('user'),
            },
          },
        ).then(() => {
          Axios.post(
            'http://185.251.89.17/api/ReviewOfVolunteer/AddVolunteerReview',
            {
              idReviewOfVolunteer: uuidv4(),
              idVolunteer: this.props.match.params.application,
              idOrganization: this.state.organization.idOrganization,
              idEvent: this.props.match.params.event,
              stars: values.stars,
              review: values.review,
            },
            {
              headers: {
                token: localStorage.getItem('user'),
              },
            },
          ).then(() => {
            message.success('Отзыв оставлен!');
            router.push('/');
          });
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
        sm: { span: 24 },
        md: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24, offset: 1 },
        sm: { span: 24, offset: 1 },
        md: { span: 10, offset: 1 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <PageHeaderWrapper title="Как вы себя чувствуете после мероприятия?">
        <p style={{ textAlign: 'center' }}>
          Пожалуйста, оцените как прошло мероприятие
          <br />
          Нам очень важно ваше мнение
        </p>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="Общее впечатление о мероприятии">
              {getFieldDecorator('common', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Rate />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Уровень организованности">
              {getFieldDecorator('managing', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Rate />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Насколько организаторы были внимательны к вам?">
              {getFieldDecorator('concern', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Rate />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Хотели бы вы посетить мероприятие снова?">
              {getFieldDecorator('visitAgain', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <RadioGroup>
                  <Radio value>Да</Radio>
                  <Radio value={false}>нет</Radio>
                </RadioGroup>,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Было ли что-то, что расстроило вас на мероприятии?"
            >
              {getFieldDecorator('upset', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <RadioGroup>
                  <Radio value>Да</Radio>
                  <Radio value={false}>нет</Radio>
                </RadioGroup>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Любой комментарий">
              {getFieldDecorator('invites', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input.TextArea />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Отправить анкету
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<BasicFormProps>()(
  connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
    submitting: loading.effects['formBasicForm/submitRegularForm'],
  }))(BasicForm),
);
