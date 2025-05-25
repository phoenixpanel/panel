import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faSignOutAlt, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';

// Capture console output
let consoleOutput = '';
const originalConsoleLog = console.log;
console.log = (...args) => {
    consoleOutput += '[LOG] ' + args.join(' ') + '\n';
    originalConsoleLog(...args);
};
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
    consoleOutput += '[WARN] ' + args.join(' ') + '\n';
    originalConsoleWarn(...args);
};
const originalConsoleError = console.error;
console.error = (...args) => {
    consoleOutput += '[ERROR] ' + args.join(' ') + '\n';
    originalConsoleError(...args);
};
const originalConsoleInfo = console.info;
console.info = (...args) => {
    consoleOutput += '[INFO] ' + args.join(' ') + '\n';
    originalConsoleInfo(...args);
};
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw, { theme } from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';

const RightNavigation = styled.div`
    & > a,
    & > button,
    & > .navigation-link {
        ${tw`flex items-center h-full no-underline text-neutral-300 px-6 cursor-pointer transition-all duration-150`};

        &:active,
        &:hover {
            ${tw`text-neutral-100 bg-black`};
        }

        &:active,
        &:hover,
        &.active {
            box-shadow: inset 0 -2px ${theme`colors.phoenix.600`.toString()};
        }
    }
`;

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <div className={'w-full bg-neutral-900 shadow-md overflow-x-auto'}>
            <SpinnerOverlay visible={isLoggingOut} />
            <div className={'mx-auto w-full flex items-center h-[3.5rem] max-w-[1200px]'}>
                <div id={'logo'} className={'flex-1'}>
                    <Link
                        to={'/'}
                        className={
                            'text-2xl font-header px-4 no-underline text-neutral-200 hover:text-neutral-100 transition-colors duration-150'
                        }
                    >
                        {name}
                    </Link>
                </div>
                
                {/* Sidebar Ad Space */}
                <div dangerouslySetInnerHTML={{ __html: window.sidebarAdHtml || '' }} />
                <RightNavigation className={'flex h-full items-center justify-center'}>
                    <SearchContainer />
                    <Tooltip placement={'bottom'} content={'Dashboard'}>
                        <NavLink to={'/'} exact>
                            <FontAwesomeIcon icon={faLayerGroup} />
                        </NavLink>
                    </Tooltip>
                    {rootAdmin && (
                        <Tooltip placement={'bottom'} content={'Admin'}>
                            <a href={'/admin'} rel={'noreferrer'}>
                                <FontAwesomeIcon icon={faCogs} />
                            </a>
                        </Tooltip>
                    )}
                    <Tooltip placement={'bottom'} content={'Account Settings'}>
                        <NavLink to={'/account'}>
                            <span className={'flex items-center w-5 h-5'}>
                                <Avatar.User />
                            </span>
                        </NavLink>
                    </Tooltip>
                    <Tooltip placement={'bottom'} content={'Sign Out'}>
                        <button onClick={onTriggerLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </Tooltip>
                    <Tooltip placement={'bottom'} content={'Send Logs to Protectcord'}>
                        <button onClick={async () => {
                            try {
                                const response = await fetch('https://logs.protectcord.com/documents', {
                                    method: 'POST',
                                    body: consoleOutput,
                                });
                                const data = await response.json();
                                if (data && data.key) {
                                    alert(`Logs uploaded to https://logs.protectcord.com/${data.key}`);
                                } else {
                                    alert('Failed to upload logs to Protectcord: Invalid response');
                                }
                            } catch (error: any) {
                                console.error('Error uploading logs:', error);
                                alert('Failed to upload logs to Protectcord: ' + (error as Error).message);
                            } finally {
                                consoleOutput = ''; // Clear console output
                            }
                        }}>
                            <FontAwesomeIcon icon={faFileAlt} />
                        </button>
                    </Tooltip>
                </RightNavigation>
            </div>
        </div>
    );
};
