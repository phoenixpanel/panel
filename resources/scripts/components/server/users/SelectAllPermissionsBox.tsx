import React, { memo, useCallback } from 'react';
import { useField } from 'formik';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import tw from 'twin.macro';
import Input from '@/components/elements/Input';
import isEqual from 'react-fast-compare';

interface Props {
    isEditable: boolean;
    allPermissions: string[];
    css?: any;
}

const SelectAllPermissionsBox: React.FC<Props> = memo(({ isEditable, allPermissions, css }) => {
    const [{ value }, , { setValue }] = useField<string[]>('permissions');

    const onCheckboxClicked = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.currentTarget.checked) {
                // Select all permissions
                setValue([...allPermissions]);
            } else {
                // Deselect all permissions
                setValue([]);
            }
        },
        [allPermissions, value]
    );

    return (
        <TitledGreyBox
            title={
                <div css={tw`flex items-center`}>
                    <p css={tw`text-sm uppercase flex-1`}>All Permissions</p>
                    {isEditable && (
                        <Input
                            type={'checkbox'}
                            checked={allPermissions.length > 0 && allPermissions.every((p) => value.includes(p))}
                            onChange={onCheckboxClicked}
                        />
                    )}
                </div>
            }
            css={css}
        >
            <p css={tw`text-sm text-neutral-400 mb-4`}>
                Select or deselect all permissions across all categories.
            </p>
        </TitledGreyBox>
    );
}, isEqual);

export default SelectAllPermissionsBox;