import { rawDataToServerObject, Server } from '@/api/server/getServer';
import http, { getPaginationSet, PaginatedResult, FractalResponseData, FractalResponseList } from '@/api/http';

interface QueryParams {
    query?: string;
    page?: number;
    type?: string;
}

interface ClientApiResponse {
    data: FractalResponseData[];
    meta: {
        pagination: any; // Consider defining a more specific type for pagination if available
    };
}

export default ({ query, ...params }: QueryParams): Promise<PaginatedResult<Server>> => {
    return new Promise((resolve, reject) => {
        http.get('/api/client', {
            params: {
                'filter[*]': query,
                ...params,
            },
        })
            .then(({ data }: { data: ClientApiResponse }) =>
                resolve({
                    items: (data.data || []).map((datum: FractalResponseData) => rawDataToServerObject(datum)),
                    pagination: getPaginationSet(data.meta.pagination),
                })
            )
            .catch(reject);
    });
};
