import { Button, Card, Icon, List, Typography } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Link } from 'umi';
import { StateType } from './model';
import { CardListItemDataType } from './data';
import styles from './style.less';
import { Pie, WaterWave, Gauge, TagCloud } from '../dashboard/monitor/components/Charts';

const { Paragraph } = Typography;

interface CardListProps {
  listCardList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
interface CardListState {
  visible: boolean;
  done: boolean;
  current?: Partial<CardListItemDataType>;
}

@connect(
  ({
    listCardList,
    loading,
  }: {
    listCardList: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    listCardList,
    loading: loading.models.listCardList,
  }),
)
class CardList extends Component<CardListProps, CardListState> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listCardList/fetch',
      payload: {
        count: 8,
      },
    });
  }

  render() {
    const {
      listCardList: { list },
      loading,
    } = this.props;

    const content = (
      <div className={styles.pageHeaderContent}>
        В маркете вы можете обменять ваши Токены на мерч, билеты и другие милые вещи :3
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <br />
        <WaterWave
          height={161}
          title={
            <div>
              Ваш баланс <br />
              <strong>10</strong>
              <br />
              Токенов
            </div>
          }
          percent={34}
        />
      </div>
    );
    return (
      <PageHeaderWrapper content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List<Partial<CardListItemDataType>>
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={list}
            renderItem={item => (
              <List.Item key={item.id}>
                <Card hoverable className={styles.card} actions={[<Link to="/">Получить</Link>]}>
                  <Card.Meta
                    avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                    title={<a>{item.title}</a>}
                    description={
                      <Paragraph className={styles.item} ellipsis={{ rows: 3 }}>
                        {item.description}
                      </Paragraph>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
