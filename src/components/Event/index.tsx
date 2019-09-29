import React, { Component } from 'react';
import { Card, List, Divider, Modal, Button, Input, message } from 'antd';
import moment from 'moment-ru';
import { Link } from 'umi';
import ButtonGroup from 'antd/es/button/button-group';
import Axios from 'axios';
import uuidv4 from 'uuid/v4';
import { Event as EventType } from '../../types';

moment.locale('ru');

export const Event = ({ event }: { event: EventType }) => {
  const [volunteer, setVolunteer] = React.useState(null);
  const [organization, setOrganization] = React.useState(null);
  React.useEffect(() => {
    Axios.get(`http://185.251.89.17/api/User/GetUserInfo?userId=${localStorage.getItem('user')}`, {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      if (res.data) {
        if (res.data.volunteer) {
          setVolunteer(res.data.volunteer);
        }
        if (res.data.organization) {
          setOrganization(res.data.organization);
        }
      }
    });
  }, []);
  const [visibleModal, setVisibleModal] = React.useState(-1);
  const [orgComments, setOrgComments] = React.useState({});

  const approveApplication = index => {
    Axios.get(
      `http://185.251.89.17/api/Application/ApproveApplication?applicationId=${event.applications[index].idApplication}`,
      {
        headers: {
          token: localStorage.getItem('user'),
        },
      },
    ).then(() => {
      message.success('Принято');
      setVisibleModal(-1);
    });
  };
  const rejectApplication = index => {
    Axios.get(
      `http://185.251.89.17/api/Application/RejectApplication?applicationId=${event.applications[index].idApplication}`,
      {
        headers: {
          token: localStorage.getItem('user'),
        },
      },
    ).then(() => {
      message.success('Отклонено');
      setVisibleModal(-1);
    });
  };
  return (
    <List.Item>
      <Card
        hoverable
        style={{ minWidth: '100%' }}
        cover={event.poster && <img alt={event.workDescription} src={event.poster} />}
      >
        <Card.Meta
          description={event.workDescription}
          title={<Link to={`/organization/${event.idOrganization}`}>{event.title}</Link>}
        />
        <div>
          <div>Начнется: {moment(event.dateFrom).fromNow()}</div>
          <div>Закончится: {moment(event.dateTo).fromNow()}</div>

          {new Date(event.dateFrom).getTime() > Date.now() && (
            <>
              <br />
              <br />
              <Divider dashed />
              <div>Кто нужен на мероприятии:</div>
              <div>
                <List
                  size="small"
                  dataSource={event.peopleRequired}
                  renderItem={stuff => (
                    <List.Item
                      extra={`${
                        event.applications.filter(application => application.approved).length
                      }/${stuff.amount}`}
                      actions={[
                        volunteer &&
                          (event.applications.find(
                            application =>
                              volunteer && application.idVolunteer === volunteer.idVolunteer,
                          ) === undefined && (
                            <Link to={`/apply-event/${event.idEvent}/${stuff.work}`}>
                              Подать заявку
                            </Link>
                          )),
                        event.applications.find(
                          application =>
                            volunteer && application.idVolunteer === volunteer.idVolunteer,
                        ) !== undefined &&
                          ((
                            event.applications.find(
                              application =>
                                volunteer && application.idVolunteer === volunteer.idVolunteer,
                            ) || {}
                          ).wasOnEnent ? (
                            <Link
                              to={`/feedback/${volunteer && volunteer.idVolunteer}/${
                                event.idOrganization
                              }`}
                            >
                              Заполнить анкету
                            </Link>
                          ) : (
                            <Link
                              to={`/refuse-event/${
                                (
                                  event.applications.find(
                                    application =>
                                      application &&
                                      volunteer &&
                                      application.idVolunteer === volunteer.idVolunteer,
                                  ) || {}
                                ).idApplication
                              }`}
                            >
                              Отозвать заявку
                            </Link>
                          )),
                      ]}
                    >
                      <List.Item.Meta
                        title={`${stuff.work} (Награда: ${stuff.tokens})`}
                        key={stuff.work}
                        description={`${stuff.desc}  \n  ${stuff.requirements}`}
                      />
                    </List.Item>
                  )}
                />
              </div>
            </>
          )}

          {organization && event.idOrganization === organization.idOrganization && (
            <>
              <br />
              <br />
              <Divider dashed />
              <div>Заявки:</div>
              <List
                size="small"
                dataSource={event.applications}
                renderItem={(apply, index) => (
                  <List.Item
                    extra={apply.status}
                    actions={[
                      !apply.approved && !apply.rejected && (
                        <a href="#" onClick={() => setVisibleModal(index)}>
                          Рассмотреть заявку
                        </a>
                      ),
                      apply.approved && (
                        <Link to={`/review/${apply.idVolunteer}/${apply.idApplication}`}>
                          Оценить волонтера
                        </Link>
                      ),
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        apply.volunteer
                          ? `${apply.volunteer.firstName} ${apply.volunteer.lastName}`
                          : `Волонтер (#${index + 1})`
                      }
                      key={apply.idVolunteer}
                      description={apply.volunteerComment}
                    />
                    <Modal
                      footer={null}
                      visible={visibleModal === index}
                      title="Заявка на участие"
                      onCancel={() => setVisibleModal(-1)}
                    >
                      <p>
                        Волонтер:{' '}
                        <Link to={`/volunteer/${apply.idVolunteer}`}>
                          {apply.volunteer
                            ? `${apply.volunteer.firstName} ${apply.volunteer.lastName}`
                            : `Волонтер (#${index + 1})`}
                        </Link>
                      </p>
                      <p>Комментарий волонтера: {apply.volunteerComment || 'Отсутствует'}</p>
                      <div>
                        <Input
                          value={orgComments[index] || ''}
                          placeholder="Комментарий для волонтера"
                          onChange={({ target: { value } }) =>
                            setOrgComments({ ...orgComments, [index]: value })
                          }
                        />
                      </div>
                      <br />
                      <br />
                      <div>
                        <ButtonGroup>
                          <Button type="dashed" onClick={() => rejectApplication(index)}>
                            Отклонить заявку
                          </Button>
                          <Button type="normal" onClick={() => approveApplication(index)}>
                            Подтвердить заявку
                          </Button>
                        </ButtonGroup>
                      </div>
                    </Modal>
                  </List.Item>
                )}
              />
            </>
          )}
        </div>
      </Card>
    </List.Item>
  );
};
