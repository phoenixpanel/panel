import React, { memo } from 'react';
import { usePermissions } from '@/plugins/usePermissions';
import isEqual from 'react-fast-compare';

interface Props {
  action: string | string[];
  matchAny?: boolean;
  renderOnError?: React.ReactNode | null;
  children: React.ReactNode;
}

const Can = ({ action, matchAny = false, renderOnError, children }: Props) => {
  const can = usePermissions(action);

  return (
    <>
      {(matchAny && can.filter((p) => p).length > 0) || (!matchAny && can.every((p) => p)) ? children : renderOnError}
    </>
  );
};

export default memo(Can, isEqual);
