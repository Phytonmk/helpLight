import { Avatar, Card, Col, Divider, Icon, Input, Row, Tag } from 'antd';
import React, { PureComponent } from 'react';

import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import Link from 'umi/link';
import { RouteChildrenProps } from 'react-router';
import { connect } from 'dva';
import { ModalState } from './model';
import Events from './components/Events';
import Articles from './components/Articles';
import { Article, Event, Organization } from '../../../types';
import styles from './Center.less';

interface CenterProps extends RouteChildrenProps {
  dispatch: Dispatch<any>;
  organization: Organization;
  organizationLoading: boolean;
  articles: Article[];
  articlesLoading: boolean;
  events: Event[];
  eventsLoading: boolean;
}
interface CenterState {
  tabKey: 'articles' | 'events';
}

@connect(
  ({
    loading,
    organizationCenter,
  }: {
    loading: { effects: { [key: string]: boolean } };
    organizationCenter: ModalState;
  }) => ({
    organization: organizationCenter.organization,
    organizationLoading: loading.effects['organizationCenter/fetchOrganization'],
    events: organizationCenter.events,
    eventsLoading: loading.effects['organizationCenter/fetchEvents'],
    articles: organizationCenter.articles,
    articlesLoading: loading.effects['organizationCenter/fetchArticles'],
  }),
)
class Center extends PureComponent<CenterProps, CenterState> {
  state: CenterState = {
    tabKey: 'events',
  };

  public input: Input | null | undefined = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.match !== null) {
      const { organization } = this.props.match.params as any;
      dispatch({
        type: 'organizationCenter/fetchOrganization',
        payload: organization,
      });
      dispatch({
        type: 'organizationCenter/fetchEvents',
        payload: organization,
      });
      dispatch({
        type: 'organizationCenter/fetchArticles',
        payload: organization,
      });
    }
  }

  onTabChange = (key: string) => {
    // If you need to sync state to url
    // const { match } = this.props;
    // router.push(`${match.url}/${key}`);
    this.setState({
      tabKey: key as CenterState['tabKey'],
    });
  };

  renderChildrenByTabKey = (tabKey: CenterState['tabKey']) => {
    if (tabKey === 'events') {
      return <Events events={this.props.events || []} eventsLoading={this.props.eventsLoading} />;
    }
    if (tabKey === 'articles') {
      return (
        <Articles
          articles={this.props.articles || []}
          articlesLoading={this.props.articlesLoading}
        />
      );
    }
    return null;
  };

  render() {
    const { tabKey } = this.state;
    const { organization, organizationLoading } = this.props;
    const dataLoading = organizationLoading || !(organization && Object.keys(organization).length);

    const operationTabList = [
      {
        key: 'events',
        tab: (
          <span>
            Мероприятия{' '}
            <span style={{ fontSize: 14 }}>
              ({this.props.eventsLoading ? '...' : this.props.events.length})
            </span>
          </span>
        ),
      },
      {
        key: 'articles',
        tab: (
          <span>
            Новости{' '}
            <span style={{ fontSize: 14 }}>
              ({this.props.articlesLoading ? '...' : this.props.articles.length})
            </span>
          </span>
        ),
      },
    ];

    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={dataLoading}>
              {!dataLoading ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <Avatar src={organization.avatar} size={150} />
                    <div className={styles.name}>{organization.name}</div>
                    <div>{organization.desc}</div>
                  </div>
                  <div className={styles.detail}>
                    <p>
                      <i className={styles.title} />
                      {organization.title}
                    </p>
                    <p>
                      <i className={styles.address} />
                      {organization.address}
                    </p>
                    <p>
                      <i className={styles.address} />
                      {organization.address}
                      {organization.city}
                    </p>
                  </div>
                  <Divider dashed />
                  <div className={styles.tags}>
                    <div className={styles.tagsTitle}>Теги</div>
                    {organization.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                  <Divider style={{ marginTop: 16 }} dashed />
                </div>
              ) : null}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
            >
              {this.renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
