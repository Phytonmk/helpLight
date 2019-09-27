import { Request, Response } from 'express';
import { Article, Organization, Event } from '../../../types';

export default {
  'GET  /api/WallRecords/:organization': (req: Request, res: Response) => {
    const params = req.query;

    const { organization } = params;

    const result: Article[] = Array(Math.floor(Math.random() * 10 + 10))
      .fill(0)
      .map(
        () =>
          ({
            idWallRecord: Math.random().toString(),
            poster: 'https://hi-news.ru/wp-content/uploads/2017/04/falcon9landing-1300x867.jpg',
            textContent: 'Lorem ipsum dolor sit amet',
            idOrganization: organization,
            likes: Math.floor(Math.random() * 50),
          } as Article),
      );

    return res.json(result);
  },
  'GET  /api/Event/getAllOrganizationEvents/:organization': (req: Request, res: Response) => {
    const params = req.query;

    const { organization } = params;

    const result: Event[] = Array(Math.floor(Math.random() * 10 + 10))
      .fill(0)
      .map(
        () =>
          ({
            idEvent: Math.random().toString(),
            dateFrom: new Date(Date.now() + 1000 * 60 * 60 * 1).toString(),
            dateTo: new Date(Date.now() + 1000 * 60 * 60 * 25).toString(),
            workDescription: 'Lorem ipsum',
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
            tokens: 53,
            idOrganization: organization,
          } as Event),
      );

    return res.json(result);
  },
  'GET  /api/Organization/GetOrganizationShortInfo/:organization': (
    req: Request,
    res: Response,
  ) => {
    const params = req.query;

    const { organization } = params;

    const result: Organization = {
      name: 'Политехнический музей',
      id: organization,
      avatar: 'https://s2.afisha.ru/mediastorage/fb/14/05210437d5bb48238db78a6f14fb.png',
      email: 'info@polytech.one',
      desc:
        'Jдин из крупнейших научно-технических музеев мира. Он был создан на основе фондов Политехнической выставки 1872 года по инициативе Общества любителей естествознания, антропологии и этнографии.',
      title: 'Политехнический музей',
      city: 'Москва',
      tags: ['Музей', 'Фонд', 'Поликек'],
      address: 'Новый Арбат 42',
      phone: '0752-268888888',
    };

    return res.json(result);
  },
};
