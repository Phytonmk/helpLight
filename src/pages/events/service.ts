import request from '@/utils/request';

export async function queryEvents() {
  return request('/api/Event/getAllEvents');
}
