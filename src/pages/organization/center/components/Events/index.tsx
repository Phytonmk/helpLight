import { Card, List } from 'antd';
import React from 'react';

import moment from 'moment-ru';
import { Link } from 'umi';
import { Event } from '../../../../../types';
import { ModalState } from '../../model';
import styles from './index.less';
moment.locale('ru');

type Props = Partial<ModalState> & { events: Event[]; eventsLoading: boolean };

const Events: React.FC<Props> = (props: Props) => {
  const { events, eventsLoading } = props;

  return (
    <List<Event>
      className={styles.coverCardList}
      rowKey="id"
      loading={eventsLoading}
      dataSource={events || []}
      renderItem={item => (
        <List.Item>
          <Card
            className={styles.card}
            hoverable
            cover={<img alt={item.workDescription} src={item.poster} />}
          >
            <Card.Meta description={item.workDescription} />
            <div className={styles.cardItemContent}>
              <div>Начнется: {moment(item.dateFrom).fromNow()}</div>
              <div>Закончится: {moment(item.dateTo).fromNow()}</div>

              {new Date(item.dateFrom).getTime() > Date.now() && (
                <>
                  <br />
                  <br />
                  <div>Кто нужен на мероприятии:</div>
                  <div className={styles.avatarList}>
                    <List
                      size="small"
                      dataSource={item.peopleRequired}
                      renderItem={subItem => (
                        <List.Item
                          extra={`${subItem.found}/${subItem.amount}`}
                          actions={
                            subItem.found < subItem.amount
                              ? [<Link to="/">Подать заявку</Link>]
                              : []
                          }
                        >
                          <List.Item.Meta
                            title={`${subItem.work} (Награда: ${subItem.tokens})`}
                            key={subItem.work}
                            description={subItem.desc}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default Events;
