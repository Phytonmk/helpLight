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
  Upload,
  List,
  Divider,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import { Event } from '@/types';

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

interface VolunteersProps {
  onChange: (value: Event['peopleRequired']) => void;
  value: Event['peopleRequired'];
}
const Volunteers: React.FC<VolunteersProps> = (props: VolunteersProps & { form: any }) => {
  const [work, setWork] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [requirements, setRequirements] = React.useState('');
  const [tokens, setTokens] = React.useState(0);
  const [amount, setAmount] = React.useState(0);

  const handleSubmit = () => {
    if (work && desc && requirements && tokens && amount) {
      props.onChange([
        ...(props.value || []),
        {
          work,
          desc,
          requirements,
          tokens,
          amount,
          found: 0,
        },
      ]);
      setWork('');
      setDesc('');
      setRequirements('');
      setTokens(0);
      setAmount(0);
    }
  };

  const remove = index => {
    const newValue = [...(props.value || [])];
    newValue.splice(index, 1);
    props.onChange(newValue);
  };

  return (
    <>
      <Divider dashed />
      <List
        dataSource={props.value}
        rowKey="work"
        locale={{ emptyText: 'Добавьте волонтеров' }}
        renderItem={(volunteer, index) => (
          <List.Item
            extra={`Нужно человек: ${volunteer.amount}`}
            actions={[<Icon type="delete" onClick={() => remove(index)} />]}
          >
            <List.Item.Meta
              title={`${volunteer.work} (Награда: ${volunteer.tokens})`}
              key={volunteer.work}
              description={`${volunteer.desc}  \n  ${volunteer.requirements}`}
            />
          </List.Item>
        )}
      />
      <Divider dashed />
      <FormItem {...formItemLayout} label="Должность волонтера">
        <Input value={work} onChange={({ target: { value } }) => setWork(value)} />
      </FormItem>
      <FormItem {...formItemLayout} label="Описание должности">
        <Input value={desc} onChange={({ target: { value } }) => setDesc(value)} />
      </FormItem>
      <FormItem {...formItemLayout} label="Требования">
        <Input value={requirements} onChange={({ target: { value } }) => setRequirements(value)} />
      </FormItem>
      <FormItem {...formItemLayout} label="Бонус токенами">
        <InputNumber value={tokens} onChange={value => value !== undefined && setTokens(value)} />
      </FormItem>
      <FormItem {...formItemLayout} label="Количество волонтеров">
        <InputNumber value={amount} onChange={value => value !== undefined && setAmount(value)} />
      </FormItem>
      <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
        <Button onClick={handleSubmit} style={{ marginLeft: 8 }}>
          <Icon type="plus" />
          Добавить должность
        </Button>
      </FormItem>
      <Divider dashed />
    </>
  );
};

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
        dispatch({
          type: 'formBasicForm/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <PageHeaderWrapper content={<FormattedMessage id="form-basic-form.basic.description" />}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="Название мероприятия">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'Обязательное поле',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Дата мероприятие">
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: 'Обязательное поле',
                  },
                ],
              })(<RangePicker style={{ width: '100%' }} placeholder={['Начало', 'Конец']} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Описание мероприятия">
              {getFieldDecorator('workDescription', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'form-basic-form.goal.required' }),
                  },
                ],
              })(<TextArea style={{ minHeight: 32 }} rows={4} />)}
            </FormItem>
            <FormItem>{getFieldDecorator('peopleRequired')(<Volunteers />)}</FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Создать мероприятие
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
    submitting: loading.effects['createEvent/submit'],
  }))(BasicForm),
);
