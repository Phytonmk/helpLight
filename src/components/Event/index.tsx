import React, { Component } from 'react';
import { Card, List, Divider, Modal, Button, Input } from 'antd';
import moment from 'moment-ru';
import { Link } from 'umi';
import ButtonGroup from 'antd/es/button/button-group';
import { Event as EventType } from '../../types';

moment.locale('ru');

export const Event = ({ event }: { event: EventType }) => {
  const [visibleModal, setVisibleModal] = React.useState(-1);
  const [orgComments, setOrgComments] = React.useState({});
  const handleModal = (index, newStatus) => {
    const apply = index;
    const comment = orgComments[index];
  };

  return (
    <List.Item>
      <Card hoverable cover={<img alt={event.workDescription} src={event.poster} />}>
        <Card.Meta description={event.workDescription} />
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
                      extra={`${stuff.found}/${stuff.amount}`}
                      actions={
                        stuff.found < stuff.amount ? [<Link to="/">Подать заявку</Link>] : []
                      }
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

          {(event.idOrganization.toString() === localStorage.getItem('helpLight-userId') ||
            true) && (
            <>
              <br />
              <br />
              <Divider dashed />
              <div>Заявки:</div>
              <List
                size="small"
                dataSource={event.applies}
                renderItem={(apply, index) => (
                  <List.Item
                    extra={apply.status}
                    actions={[
                      <a href="#" onClick={() => setVisibleModal(index)}>
                        Рассмотреть заявку
                      </a>,
                    ]}
                  >
                    <List.Item.Meta
                      title={apply.volunteer.name}
                      key={apply.volunteer.id}
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
                        <Link to={`/volunteer/${apply.volunteer.id}`}>{apply.volunteer.name}</Link>
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
                          <Button type="dashed" onClick={() => handleModal(index, 'decline')}>
                            Отклонить заявку
                          </Button>
                          <Button type="normal" onClick={() => handleModal(index, 'approve')}>
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
