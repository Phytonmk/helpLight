import {
  Avatar,
  Card,
  Col,
  Divider,
  Icon,
  Input,
  Row,
  Tag,
  Skeleton,
  message,
  Comment,
  Rate,
} from 'antd';
import React, { PureComponent } from 'react';

import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import Link from 'umi/link';
import { RouteChildrenProps, withRouter } from 'react-router';
import { connect } from 'dva';
import Axios from 'axios';
import { ModalState } from './model';
import Projects from './components/Projects';
import Articles from './components/Articles';
import Applications from './components/Applications';
import { CurrentUser, TagType } from './data.d';
import styles from './Center.less';
import { Volunteer } from '@/types';

const operationTabList = [
  {
    key: 'articles',
    tab: (
      <span>
        文章 <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
  {
    key: 'applications',
    tab: (
      <span>
        应用 <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
  {
    key: 'projects',
    tab: (
      <span>
        项目 <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
];

interface CenterProps extends RouteChildrenProps {
  dispatch: Dispatch<any>;
  currentUser: CurrentUser;
  currentUserLoading: boolean;
}
interface CenterState {
  volunteerLoading: boolean;
  currentUserLoading: boolean;
  volunteer: Volunteer;
  currentUser: unknown;
}

class Center extends PureComponent<CenterProps, CenterState> {
  state: CenterState = {
    volunteer: null,
    currentUser: null,
    volunteerLoading: true,
    currentUserLoading: true,
  };

  public input: Input | null | undefined = undefined;

  componentDidMount() {
    const vId =
      this.props.match && this.props.match.params && this.props.match.params.volunteer
        ? this.props.match && this.props.match.params && this.props.match.params.volunteer
        : localStorage.getItem('user');
    Axios.get(`http://185.251.89.17/api/User/GetUserInfo?userId=${vId}`, {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      this.setState({ volunteer: res.data.volunteer, volunteerLoading: false });
    });
    Axios.get(`http://185.251.89.17/api/User/GetUserInfo?userId=${localStorage.getItem('user')}`, {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      this.setState({ currentUser: res.data, currentUserLoading: false });
    });
  }

  render() {
    if (this.state.volunteerLoading || this.state.currentUserLoading) return <Skeleton />;
    if (!this.state.volunteer || !this.state.currentUser) return null;

    const { volunteer } = this.state;

    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }}>
              <div>
                <div className={styles.avatarHolder}>
                  <Avatar size={150} src={volunteer.avatar} />
                  <br />
                  <br />
                  <div className={styles.name}>
                    {volunteer.firstName} {volunteer.lastName}
                  </div>
                  <div>{volunteer.about}</div>
                </div>
                <Divider dashed />
                <div className={styles.detail}>
                  <div>Контакты:</div>
                  {Object.keys(volunteer.contacts || {})
                    .filter(key => key === 'telegram' || key.length < 5)
                    .map(messenger => (
                      <p>
                        {messenger}: {volunteer.contacts[messenger]}
                      </p>
                    ))}
                </div>
                <Divider dashed />
                <div className={styles.tags}>
                  <div>Навыки:</div>
                  {(volunteer.skills || []).map(item => (
                    <Tag key={item.description}>{item.description}</Tag>
                  ))}
                </div>
                <Divider style={{ marginTop: 16 }} dashed />
              </div>
            </Card>
          </Col>

          {this.state.currentUser.organization && (
            <Col lg={17} md={24}>
              <Card className={styles.tabsCard} bordered={false}>
                {(volunteer.reviews || []).map(review => (
                  <Comment
                    author={review.organization.name}
                    avatar={
                      <Avatar src={review.organization.avatar} alt={review.organization.name} />
                    }
                    content={
                      <div>
                        <p>{review.content}</p>
                        <Rate count={review.rate} />
                      </div>
                    }
                  />
                ))}
              </Card>
            </Col>
          )}
        </Row>
      </GridContent>
    );
  }
}

export default withRouter(Center);
