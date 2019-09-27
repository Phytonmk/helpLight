import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { Organization, Event, Article } from '../../../types';
import { queryOrganization, queryEvents, queryArticles } from './service';

export interface ModalState {
  organization: Organization | null;
  events: Event[];
  articles: Article[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ModalState) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    fetchOrganization: Effect;
    fetchEvents: Effect;
    fetchArticles: Effect;
  };
  reducers: {
    saveOrganization: Reducer<ModalState>;
    saveEvents: Reducer<ModalState>;
    saveArticles: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'organizationCenter',

  state: {
    organization: null,
    events: [],
    articles: [],
  },

  effects: {
    *fetchOrganization({ payload }, { call, put }) {
      const response = yield call(queryOrganization, payload);
      yield put({
        type: 'saveOrganization',
        payload: response,
      });
    },
    *fetchEvents({ payload }, { call, put }) {
      const response = yield call(queryEvents, payload);
      yield put({
        type: 'saveEvents',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetchArticles({ payload }, { call, put }) {
      const response = yield call(queryArticles, payload);
      yield put({
        type: 'saveArticles',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    saveOrganization(state, action) {
      return {
        ...(state as ModalState),
        organization: action.payload || null,
      };
    },
    saveEvents(state, action) {
      return {
        ...(state as ModalState),
        events: action.payload,
      };
    },
    saveArticles(state, action) {
      return {
        ...(state as ModalState),
        articles: action.payload,
      };
    },
  },
};

export default Model;
