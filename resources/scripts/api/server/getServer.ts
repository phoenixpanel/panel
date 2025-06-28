import http, { FractalResponseData, FractalResponseList } from '@/api/http';
import { rawDataToServerAllocation, rawDataToServerEggVariable } from '@/api/transformers';
import { ServerEggVariable, ServerStatus } from '@/api/server/types';

export interface Allocation {
  id: number;
  ip: string;
  alias: string | null;
  port: number;
  notes: string | null;
  isDefault: boolean;
}

export interface EggImageData {
  image_enabled: boolean;
  image_type: string;
  image_value: string;
}

export interface Egg {
  uuid: string;
  name: string;
  image_data?: EggImageData;
}

export interface Server {
  id: string;
  internalId: number | string;
  uuid: string;
  name: string;
  node: string;
  isNodeUnderMaintenance: boolean;
  status: ServerStatus;
  sftpDetails: {
    ip: string;
    port: number;
    domain: string;
  };
  invocation: string;
  dockerImage: string;
  description: string;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
    threads: string;
  };
  eggFeatures: string[];
  featureLimits: {
    databases: number;
    allocations: number;
    backups: number;
  };
  isTransferring: boolean;
  variables: ServerEggVariable[];
  allocations: Allocation[];
  egg: Egg;
}

// Accept the FractalResponseData object which contains attributes
export const rawDataToServerObject = ({ attributes }: FractalResponseData): Server => {
  // Access relationships and egg from *within* attributes, based on logs
  const relationships = attributes.relationships;
  const eggData = attributes.egg;

  return {
    id: attributes.identifier,
    internalId: attributes.internal_id,
    uuid: attributes.uuid,
    name: attributes.name,
    node: attributes.node,
    isNodeUnderMaintenance: attributes.is_node_under_maintenance,
    status: attributes.status,
    invocation: attributes.invocation,
    dockerImage: attributes.docker_image,
    sftpDetails: {
      ip: attributes.sftp_details.ip,
      port: attributes.sftp_details.port,
      domain: attributes.sftp_details.domain,
    },
    description: attributes.description ? (attributes.description.length > 0 ? attributes.description : null) : null,
    limits: { ...attributes.limits },
    eggFeatures: attributes.egg_features || [],
    featureLimits: { ...attributes.feature_limits },
    isTransferring: attributes.is_transferring,
    // Map variables and allocations from relationships
    variables: ((relationships?.variables as FractalResponseList | undefined)?.data || []).map(
      rawDataToServerEggVariable
    ),
    allocations: ((relationships?.allocations as FractalResponseList | undefined)?.data || []).map(
      rawDataToServerAllocation
    ),
    // Map egg data from the nested eggData object
    egg: eggData
      ? ({
          uuid: eggData.uuid,
          name: eggData.name,
          image_data: eggData.image_data,
        } as Egg)
      : { uuid: '', name: '' }, // Fallback
  };
};

export default (uuid: string): Promise<[Server, string[]]> => {
  return new Promise((resolve, reject) => {
    // Revert the .then() structure for single server fetch as it might differ
    http
      .get(`/api/client/servers/${uuid}`)
      .then(({ data }) => {
        resolve([
          rawDataToServerObject(data), // Pass the FractalResponseData object
          // eslint-disable-next-line camelcase
          // Access meta from within attributes as well, consistent with logs
          // Access meta directly from data
          data.meta?.is_server_owner ? ['*'] : data.meta?.user_permissions || [],
        ]);
      })
      .catch(reject);
  });
};
