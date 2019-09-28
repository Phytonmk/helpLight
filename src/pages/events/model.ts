import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { Event } from '../../types';
import { queryEvents } from './service';

export interface ModalState {
  events: Event[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ModalState) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    fetchEvents: Effect;
  };
  reducers: {
    saveEvents: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'events',

  state: {
    events: [],
  },

  effects: {
    *fetchEvents({ payload }, { call, put }) {
      const response = yield call(queryEvents, payload);
      yield put({
        type: 'saveEvents',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    saveEvents(state, action) {
      return {
        ...(state as ModalState),
        events: action.payload,
      };
    },
  },
};

export default Model;
