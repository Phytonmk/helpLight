import { Form, List, Switch } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Event } from '@/components/Event';
import { Event as EventType } from '../../types';

interface Props extends FormComponentProps {
  events: EventType[];
  dispatch: Dispatch<any>;
  eventsLoading: boolean;
}
interface State {
  onlyMy: boolean;
}
@connect(
  ({
    events,
    loading,
  }: {
    events: { events: EventType[] };
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    events: events.events,
    eventsLoading: loading.models.events,
  }),
)
class BasicList extends Component<Props, State> {
  state: State = { onlyMy: false };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'events/fetchEvents',
    });
  }

  render() {
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
    };
    const { events, eventsLoading } = this.props;

    const filteredEvents = events.filter(
      event =>
        !this.state.onlyMy ||
        (event.applies || []).find(apply => apply.id === localStorage.getItem('helpLight-userId')),
    );

    return (
      <>
        <PageHeaderWrapper title="Мероприятия">
          <Switch checked={this.state.onlyMy} onChange={onlyMy => this.setState({ onlyMy })} />{' '}
          Показать только мои мероприятия
          <br />
          <br />
          <List<EventType>
            size="large"
            rowKey="id"
            loading={eventsLoading}
            pagination={paginationProps}
            dataSource={filteredEvents}
            renderItem={item => <Event event={item} />}
          />
        </PageHeaderWrapper>
      </>
    );
  }
}

export default Form.create<Props>()(BasicList);
