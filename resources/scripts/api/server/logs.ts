import http from '@/api/http';

export type HastebinResponse = {
  key?: string;
};

export default (uuid: string, logs: string): Promise<HastebinResponse> => {
  return new Promise((resolve, reject) => {
    http
      .post(`/api/client/servers/${uuid}/logs`, { logs })
      .then(({ data }) => resolve(data))
      .catch(reject);
  });
};