import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faHdd, faMemory, faMicrochip, faServer, faClock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import Spinner from '@/components/elements/Spinner';
import styled from 'styled-components/macro';
import isEqual from 'react-fast-compare';

import { Col, Divider, Row, Tag } from 'antd';

// Determines if the current value is in an alarm threshold so we can show it in red rather
// than the more faded default style.
const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const Icon = memo(
    styled(FontAwesomeIcon)<{ $alarm: boolean }>`
        transform: rotate(10deg);
        ${(props) => (props.$alarm ? tw`text-red-400` : tw`text-neutral-500`)};
    `,
    isEqual
);

const IconDescription = styled.p<{ $alarm: boolean }>`
    ${tw`text-sm ml-2`};
    ${(props) => (props.$alarm ? tw`text-white` : tw`text-neutral-400`)};
`;

const ServerRowContainer = styled(GreyRowBox)`
    ${tw`grid grid-cols-12 relative`};
`;

type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats & { receivedAt?: number } | null>(null);

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

    return (
        <ServerRowContainer as={Link} to={`/server/${server.id}`} className={className}>
            <div css={tw`flex items-center col-span-12 sm:col-span-4 lg:col-span-3`}>
                { (stats?.status && stats?.status === 'running') }
                <span css={tw`relative flex w-3 h-3 mr-[1rem]`}>
                    <span css={tw`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75`} className={statusColorClass}></span>
                    <span css={tw`relative inline-flex w-3 h-3 rounded-full`} className={statusColorClass}></span>
                </span>
                <div>
                    <p css={tw`text-lg break-words`}>{server.name}</p>
                </div>
            </div>

            <div css={tw`hidden col-span-7 lg:col-start-4 lg:col-span-4 sm:flex items-baseline lg:-ml-4`}>
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
                    <div css={tw`flex flex-col space-y-2`}>
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

            <div css={tw`flex-1 ml-4 lg:block lg:col-span-2 hidden`}>
                <div css={tw`flex items-center`}>
                    <FontAwesomeIcon icon={faClock} css={tw`text-neutral-500`} />
                    <p css={tw`text-sm text-neutral-400 ml-2`}>
                        {stats && stats.status !== 'offline' ? (
                            <LiveUptime uptime={stats.uptime/1000} receivedAt={stats.receivedAt} />
                        ) : (
                            '0w 0d 0m 0s'
                        )}
                    </p>
                </div>
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
    const hours = Math.floor((Math.floor(totalSeconds / 60 / 60)) % 24);
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