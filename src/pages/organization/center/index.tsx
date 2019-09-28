import { Avatar, Card, Col, Divider, Icon, Input, Row, Tag, Modal, Button } from 'antd';
import React, { PureComponent } from 'react';

import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import Link from 'umi/link';
import { RouteChildrenProps, withRouter, RouterProps } from 'react-router';
import TextArea from 'antd/es/input/TextArea';
import Axios from 'axios';
import Events from './components/Events';
import Articles from './components/Articles';
import { Article, Event, Organization } from '../../../types';
import styles from './Center.less';

interface CenterState {
  tabKey: 'articles' | 'events';
  enterModal: boolean;
  enterMessage: string;
  enterLoading: boolean;
  organizationLoading: boolean;
  eventsLoading: boolean;
  articlesLoading: boolean;
  articles: Article[];
  events: Event[];
  organization: Organization;
}

class Center extends PureComponent<RouterProps, CenterState> {
  state: CenterState = {
    tabKey: 'events',
    enterModal: false,
    enterMessage: '',
    enterLoading: false,
    organizationLoading: true,
    eventsLoading: true,
    articlesLoading: true,
  };

  public input: Input | null | undefined = undefined;

  componentDidMount() {
    if (
      this.props &&
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.organization
    ) {
      this.loadOrganization(this.props.match.params.organization);
    } else {
      Axios.get(
        `http://185.251.89.17/api/User/GetUserInfo?userId=${localStorage.getItem('user')}`,
        {
          headers: {
            token: localStorage.getItem('user'),
          },
        },
      ).then(res => {
        this.loadOrganization(res.data.organization.idOrganization);
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

  submitEntering = () => {
    this.setState({ enterLoading: true });
    // Axios.post('', {
    //   enterMessage: this.state.enterMessage,
    // })
    this.setState({ enterLoading: false });
    this.setState({ enterModal: false });
    this.setState({ enterMessage: '' });
  };

  loadOrganization(oId) {
    console.log(oId);
    Axios.get(`http://185.251.89.17/api/Organization/GetOrganizationShortInfo/${oId}`, {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      this.setState({ organization: res.data, organizationLoading: false });
    });

    Axios.get(`http://185.251.89.17/api/WallRecords/${oId}`, {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      this.setState({ articles: res.data, articlesLoading: false });
    });

    Axios.get(`http://185.251.89.17/api/Event/getAllOrganizationEvents?id=${oId}`, {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      this.setState({ events: res.data, eventsLoading: false });
    });
  }

  renderChildrenByTabKey = (tabKey: CenterState['tabKey']) => {
    if (tabKey === 'events') {
      return <Events events={this.state.events || []} eventsLoading={this.state.eventsLoading} />;
    }
    if (tabKey === 'articles') {
      return (
        <Articles
          articles={this.state.articles || []}
          articlesLoading={this.state.articlesLoading}
        />
      );
    }
    return null;
  };

  render() {
    const { tabKey } = this.state;
    const { organization, organizationLoading } = this.state;
    const dataLoading = organizationLoading || !(organization && Object.keys(organization).length);

    const operationTabList = [
      {
        key: 'events',
        tab: (
          <span>
            Мероприятия{' '}
            <span style={{ fontSize: 14 }}>
              ({this.state.eventsLoading ? '...' : this.state.events.length})
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
              ({this.state.articlesLoading ? '...' : this.state.articles.length})
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
                      {organization.city}
                    </p>
                  </div>
                  <Divider dashed />
                  <div className={styles.tags}>
                    <div className={styles.tagsTitle}>Теги</div>
                    {(organization.tags || []).map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                  <Divider style={{ marginTop: 16 }} dashed />
                  {
                    <Button type="primary" onClick={() => this.setState({ enterModal: true })}>
                      Вступить в организацию
                    </Button>
                  }
                  <Modal
                    title="Отправить заявку"
                    onOk={() => this.submitEntering()}
                    visible={this.state.enterModal}
                    onCancel={() => this.setState({ enterModal: false })}
                    okText="Отправить заявку"
                    cancelText="Отмена"
                    loading={this.state.enterLoading}
                  >
                    <br />
                    <br />
                    Музей свяжется с вами чтобы подготовить документы, необходимые для волонтерской
                    деятельности в нем. Укажите в поле ниже ваши контакты, по которым вам будет
                    удобно связаться и немного расскажите о себе
                    <br />
                    <br />
                    <TextArea
                      placeholder="Ваши контакты и информация о себе"
                      value={this.state.enterMessage}
                      onChange={({ target: { value } }) => this.setState({ enterMessage: value })}
                    />
                  </Modal>
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

export default withRouter(Center);
