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
import { router } from 'umi';
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
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface BasicFormProps extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
}

class BasicForm extends Component<BasicFormProps> {
  state = { organization: 'loading', loading: true, submitting: false };

  componentDidMount() {
    Axios.get(`http://185.251.89.17/api/User/GetUserInfo?userId=${localStorage.getItem('user')}`, {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      this.setState({ organization: res.data.organization, loading: false });
    });
  }

  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const idEvent = uuidv4();
        Axios.post('http://185.251.89.17/api/Event/CreateEvent', {
          idEvent,
          dateFrom: values.date[0].format(),
          dateTo: values.date[1].format(),
          type: values.type,
          idOrganization: this.state.organization.idOrganization,
          title: values.title,
          workDescription: values.workDescription,
          peopleRequired: values.peopleRequired.map(volunteer => ({
            ...volunteer,
            idPeopleRequired: uuidv4(),
            idEvent,
          })),
        })
          .then(() => {
            message.success('Мероприятие создано');
            router.push('/');
          })
          .catch(() => {
            message.error('Не удалось создать мероприятие');
          });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    console.log(this.state.organization);
    if (!this.state.organization) {
      return 'Вы не можете создавать мероприятия';
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="Тип">
              {getFieldDecorator('type', {
                rules: [
                  {
                    required: true,
                    message: 'Обязательное поле',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio.Button value="event">Мероприятие</Radio.Button>
                  <Radio.Button value="task">Задание</Radio.Button>
                </Radio.Group>,
              )}
            </FormItem>
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
                    message: 'Это обязательное поле',
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
