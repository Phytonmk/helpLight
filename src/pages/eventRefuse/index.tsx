import { Button, Card, Form, Input } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { withRouter, router } from 'umi';
import Axios from 'axios';
import styles from './style.less';

const FormItem = Form.Item;
interface BasicFormProps extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
}

class BasicForm extends Component<BasicFormProps> {
  handleSubmit = (e: React.FormEvent) => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Axios.get(
          `http://185.251.89.17/api/Application/RecallApplication?applicationId=${this.props.match.params.application}`,
          {
            headers: {
              token: localStorage.getItem('user'),
            },
          },
        ).then(res => {
          router.push('/refuse-event-success');
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <PageHeaderWrapper content="Отзыв заявки">
        <p style={{ textAlign: 'center' }}>
          Пожалуйста, напишите почему вы хотите отказаться от участия в мероприятии
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
              })(<Input.TextArea style={{ minHeight: 100 }} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Отозвать заявку
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
