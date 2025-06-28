import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faHdd, faMemory, faMicrochip, faServer, faClock } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import Spinner from '@/components/elements/Spinner';
import styled from 'styled-components/macro';
import isEqual from 'react-fast-compare';

import { Col, Divider, Row, Tag, Button } from 'antd';

// Determines if the current value is in an alarm threshold so we can show it in red rather
// than the more faded default style.
const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const Icon = memo(
  styled(FontAwesomeIcon)<{ $alarm: boolean }>`
    transform: rotate(10deg);
    ${(props: { $alarm: boolean }) => (props.$alarm ? tw`text-red-400` : tw`text-neutral-500`)};
  `,
  isEqual
);

const IconDescription = styled.p<{ $alarm: boolean }>`
  ${tw`text-sm ml-2`};
  ${(props: { $alarm: boolean }) => (props.$alarm ? tw`text-white` : tw`text-neutral-400`)};
`;

const ServerRowContainer = styled(GreyRowBox)`
  ${tw`grid grid-cols-12 relative`};
`;

type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
  const history = useHistory();
  const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
  const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
  const [stats, setStats] = useState<(ServerStats & { receivedAt?: number }) | null>(null);

  const getStats = () => {
    return getServerResourceUsage(server.uuid)
      .then((data) => {
        // Add timestamp when stats were received
        setStats({ ...data, receivedAt: Date.now() });
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    setIsSuspended(stats?.isSuspended || server.status === 'suspended');
  }, [stats?.isSuspended, server.status]);

  useEffect(() => {
    // Don't waste a HTTP request if there is nothing important to show to the user because
    // the server is suspended.
    if (isSuspended) return;

    getStats().then(() => {
      interval.current = setInterval(() => getStats(), 10000);
    });

    return () => {
      interval.current && clearInterval(interval.current);
    };
  }, [isSuspended]);

  const alarms = { cpu: false, memory: false, disk: false };
  if (stats) {
    alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
    alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
    alarms.disk = server.limits.disk === 0 ? false : isAlarmState(stats.diskUsageInBytes, server.limits.disk);
  }

  const diskLimit = server.limits.disk !== 0 ? bytesToString(mbToBytes(server.limits.disk)) : 'Unlimited';
  const memoryLimit = server.limits.memory !== 0 ? bytesToString(mbToBytes(server.limits.memory)) : 'Unlimited';
  const cpuLimit = server.limits.cpu !== 0 ? server.limits.cpu + ' %' : 'Unlimited';

  const statusColorClass = isSuspended
    ? 'bg-status-100' // Suspended
    : server.isTransferring
    ? 'bg-status-200' // Transferring
    : stats?.status === 'running'
    ? 'bg-status-50' // Online
    : stats?.status === 'offline'
    ? 'bg-status-100' // Offline
    : 'bg-status-300'; // Starting Up or other states

  // Check for server.egg and image_data before trying to display
  const eggImageData = server.egg?.image_data;
  const showEggImage = !!(server.egg && eggImageData && eggImageData.image_enabled && eggImageData.image_value);

  return (
    <ServerRowContainer className={className}>
      {/* Egg Image - Absolutely Centered 50x50 */}
      {showEggImage && eggImageData && (
        <div
          css={tw`absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[50px] w-auto z-10 pointer-events-none flex items-center justify-center`}
        >
          <img
            css={tw`max-w-full max-h-full h-[50px] w-auto object-contain rounded-sm`}
            src={eggImageData.image_value}
            alt={`${server.name} egg icon`}
          />
        </div>
      )}

      {/* Server Name Section */}
      <div css={tw`flex items-center col-span-12 sm:col-span-6 md:col-span-2 pr-2 sm:pr-4 py-2`}>
        <span css={tw`relative flex w-3 h-3 mr-2 sm:mr-4`}>
          <span
            css={tw`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75`}
            className={statusColorClass}
          ></span>
          <span css={tw`relative inline-flex w-3 h-3 rounded-full`} className={statusColorClass}></span>
        </span>
        <div>
          <p css={tw`text-lg break-words`}>{server.name}</p>
        </div>
      </div>

      {/* Resources Section */}
      <div
        css={tw`hidden sm:flex flex-col items-center justify-center col-span-12 sm:col-span-6 md:col-span-2 md:col-start-4 py-2`}
      >
        {!stats || isSuspended ? (
          isSuspended ? (
            <div css={tw`flex-1 text-center`}>
              <Tag className={`${statusColorClass} border-none`} css={tw`text-xs uppercase`}>
                {server.status === 'suspended' ? 'Suspended' : 'Connection Error'}
              </Tag>
            </div>
          ) : server.isTransferring || server.status ? (
            <div css={tw`flex-1 text-center`}>
              <Tag className={`${statusColorClass} border-none`} css={tw`text-xs uppercase`}>
                {server.isTransferring
                  ? 'Transferring'
                  : server.status === 'installing'
                  ? 'Installing'
                  : server.status === 'restoring_backup'
                  ? 'Restoring Backup'
                  : 'Unavailable'}
              </Tag>
            </div>
          ) : (
            <Spinner size={'small'} />
          )
        ) : (
          <div css={tw`flex flex-col space-y-1 md:space-y-2 items-start`}>
            <div css={tw`flex items-center`}>
              <div css={tw`w-6 flex justify-center`}>
                <Icon icon={faMemory} $alarm={alarms.memory} />
              </div>
              <IconDescription $alarm={alarms.memory}>
                {bytesToString(stats.memoryUsageInBytes)} / {memoryLimit}
              </IconDescription>
            </div>
            <div css={tw`flex items-center`}>
              <div css={tw`w-6 flex justify-center`}>
                <Icon icon={faMicrochip} $alarm={alarms.cpu} />
              </div>
              <IconDescription $alarm={alarms.cpu}>
                {stats.cpuUsagePercent.toFixed(2)} % / {cpuLimit}
              </IconDescription>
            </div>
            <div css={tw`flex items-center`}>
              <div css={tw`w-6 flex justify-center`}>
                <Icon icon={faHdd} $alarm={alarms.disk} />
              </div>
              <IconDescription $alarm={alarms.disk}>
                {bytesToString(stats.diskUsageInBytes)} / {diskLimit}
              </IconDescription>
            </div>
          </div>
        )}
      </div>

      {/* Uptime Section */}
      <div css={tw`hidden md:flex flex-col items-center justify-center col-span-12 md:col-span-2 md:col-start-8 py-2`}>
        <div css={tw`flex items-center`}>
          <FontAwesomeIcon icon={faClock} css={tw`text-neutral-500`} />
          <p css={tw`text-sm text-neutral-400 ml-2`}>
            {stats && stats.status !== 'offline' ? (
              <LiveUptime uptime={stats.uptime / 1000} receivedAt={stats.receivedAt} />
            ) : (
              '0w 0d 0m 0s'
            )}
          </p>
        </div>
      </div>

      {/* Manage Button Section */}
      <div css={tw`flex items-center justify-end col-span-12 md:col-span-2 md:col-start-11 pl-2 sm:pl-4 py-2`}>
        <Button
          type='primary'
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.preventDefault();
            e.stopPropagation();
            history.push(`/server/${server.id}`);
          }}
        >
          Manage Server
        </Button>
      </div>
    </ServerRowContainer>
  );
};

const LiveUptime = ({ uptime, receivedAt }: { uptime: number; receivedAt?: number }) => {
  const [currentUptime, setCurrentUptime] = React.useState(Math.floor(uptime));

  React.useEffect(() => {
    const updateUptime = () => {
      if (receivedAt) {
        const elapsedSinceReceived = Math.floor((Date.now() - receivedAt) / 1000);
        setCurrentUptime(Math.floor(uptime) + elapsedSinceReceived);
      } else {
        setCurrentUptime(Math.floor(uptime));
      }
    };

    updateUptime();
    const interval = setInterval(updateUptime, 1000);

    return () => clearInterval(interval);
  }, [uptime, receivedAt]);

  const totalSeconds = currentUptime;

  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor(Math.floor(totalSeconds / 60 / 60) % 24);
  const remainder = Math.floor(totalSeconds - hours * 60 * 60);
  const minutes = Math.floor((remainder / 60) % 60);
  const seconds = remainder % 60;

  const weeks = Math.floor(days / 7);
  const daysRemainder = days % 7;

  if (weeks > 0) {
    return (
      <>
        {weeks}w {daysRemainder}d {hours}h {minutes}m {seconds}s
      </>
    );
  }

  if (days > 0) {
    return (
      <>
        {days}d {hours}h {minutes}m {seconds}s
      </>
    );
  }

  return (
    <>
      {hours}h {minutes}m {seconds}s
    </>
  );
};
