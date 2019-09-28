import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { fakeSubmitForm } from './service';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    submit: Effect;
  };
}
const Model: ModelType = {
  namespace: 'createEvent',

  state: {},

  effects: {
    *submit({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('Мероприятие создано!');
    },
  },
};

export default Model;
