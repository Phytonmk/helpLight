import { Request, Response } from 'express';
import { Event } from '../../types';

export default {
  'GET  /api/Event/getAllEvents': (req: Request, res: Response) => {
    const result: Event[] = Array(Math.floor(Math.random() * 10 + 10))
      .fill(0)
      .map(
        () =>
          ({
            idEvent: Math.random().toString(),
            title: 'Lorem ipsum',
            dateFrom: new Date(Date.now() + 1000 * 60 * 60 * 1).toString(),
            dateTo: new Date(Date.now() + 1000 * 60 * 60 * 25).toString(),
            workDescription: 'Lorem ipsum dolor sit amet',
            poster: 'https://vecherka-spb.ru/wp-content/uploads/2018/10/bolshoh-subbotnik.jpg',
            peopleRequired: [
              {
                work: 'Уборщик',
                desc: 'Убирать туалеты',
                requirements: 'Два+ высших образования',
                tokens: 5,
                amount: 10,
                found: 3,
              },
              {
                work: 'Программист',
                desc: 'Хакатонить',
                requirements: 'Переносимость ред-булла',
                tokens: 1,
                amount: 3,
                found: 0,
              },
            ],
            applies: [
              {
                volunteer: {
                  name: 'Vasily Pupkin',
                  id: '123',
                },
                volunteerComment: '',
                organizationComment: '',
                status: 'pending',
              },
            ],
            tokens: 53,
            idOrganization: Math.random(),
          } as Event),
      );

    return res.json(result);
  },
};
