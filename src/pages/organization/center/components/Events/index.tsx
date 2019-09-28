import { Card, List } from 'antd';
import React from 'react';

import moment from 'moment-ru';
import { Link } from 'umi';
import { Event as EventType } from '../../../../../types';
import { ModalState } from '../../model';
import styles from './index.less';
import { Event } from '@/components/Event';

moment.locale('ru');

type Props = Partial<ModalState> & { events: EventType[]; eventsLoading: boolean };

const Events: React.FC<Props> = (props: Props) => {
  const { events, eventsLoading } = props;

  return (
    <List<EventType>
      className={styles.coverCardList}
      rowKey="id"
      loading={eventsLoading}
      dataSource={events || []}
      renderItem={item => <Event event={item} />}
    />
  );
};

export default Events;
