import request from '@/utils/request';

export async function queryOrganization(params: { organization: string }) {
  return request(`/api/Organization/GetOrganizationShortInfo/${params.organization}`);
}

export async function queryArticles(params: { organization: string }) {
  return request(`/api/WallRecords/${params.organization}`);
}

export async function queryEvents(params: { organization: string }) {
  return request(`/api/Event/getAllOrganizationEvents/${params.organization}`);
}
