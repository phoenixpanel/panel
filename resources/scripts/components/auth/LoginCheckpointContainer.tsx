import 'styled-components/macro';
import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import loginCheckpoint from '@/api/auth/loginCheckpoint';
import { ActionCreator } from 'easy-peasy';
import { StaticContext } from 'react-router';
import { useFormikContext, withFormik, FormikProps, FormikHelpers } from 'formik';
import useFlash from '@/plugins/useFlash';
import { FlashStore } from '@/state/flashes';
import tw from 'twin.macro';
import { Form, Input, Button as AntButton, Typography } from 'antd';
import styled from 'styled-components';

// Overall page wrapper
const LoginPageWrapper = styled.div`
    ${tw`min-h-screen flex items-center justify-center p-4`}
    background: #0F0F0F;
`;

// The main form container
const StyledFormBox = styled.div`
    ${tw`w-full relative overflow-hidden`}
    width: 34rem;
    height: 30rem; // Adjusted to ensure content fits, can be flexible
    background: rgba(35.55, 35.55, 35.55, 0.82);
    border-radius: 20px;
    padding: 40px; // Adjusted padding for uniform spacing
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`;

const FormBackgroundLogo = styled.img`
    ${tw`absolute pointer-events-none`}
    z-index: 0;
    opacity: 0.04;
    width: 30rem; /* (252.35px / 502px) * 100 */
    height: auto; /* Maintain aspect ratio */
    left: -46%; /* (-127.51px / 502px) * 100 */
    transform: rotate(-9deg);
    transform-origin: top left;
`;

// Define StyledInput component for individual characters
const StyledCodeInput = styled(Input)`
    ${tw`text-center`}
    background: rgba(49.04, 49.04, 49.04, 0.72) !important;
    border: 1px #373737 solid !important;
    border-radius: 2px !important;
    color: rgba(220, 220, 220, 0.85) !important;
    padding: 10px 0 !important; // Adjusted padding for height and center text
    height: 48px !important; // Larger height for individual inputs
    width: 40px !important; // Fixed width for individual inputs
    font-size: 20px !important; // Larger font size
    margin: 0 4px; // Space between inputs

    &::placeholder {
        color: rgba(110.34, 110.34, 110.34, 0.85) !important;
        font-family: 'Roboto', sans-serif;
        font-weight: 400;
        font-size: 14px;
    }

    &:focus,
    &:focus-within {
        border-color: #ff9500 !important;
        box-shadow: 0 0 0 2px rgba(255, 149, 0, 0.2) !important;
    }
`;

const SubmitButton = styled(AntButton)`
    ${tw`w-full text-white`}
    background: #FF9500 !important;
    border-color: #ff9500 !important;
    border-radius: 7px !important;
    height: 42px !important;
    font-size: 18px !important;
    font-family: 'Roboto', sans-serif;
    font-weight: 700 !important; // Bolder submit text from screenshot
    line-height: 24.01px !important; // Consistent line height
    letter-spacing: 0.5px; // Slight letter spacing for SUBMIT

    &:hover,
    &:focus {
        background: #e08000 !important; // Darker orange for hover/focus
        border-color: #e08000 !important;
    }
`;

interface Values {
    code: string;
    recoveryCode: string;
}

type OwnProps = RouteComponentProps<Record<string, string | undefined>, StaticContext, { token?: string }>;

type Props = OwnProps & {
    clearAndAddHttpError: ActionCreator<FlashStore['clearAndAddHttpError']['payload']>;
};

const LoginCheckpointContainer = () => {
    const { isSubmitting, setFieldValue, submitForm } = useFormikContext<Values>();
    const [isMissingDevice, setIsMissingDevice] = useState(false);
    const codeLength = isMissingDevice ? 10 : 6;
    const [codeValues, setCodeValues] = useState<string[]>(Array(codeLength).fill(''));
    const inputRefs = useRef<(Input | null)[]>([]);

    useEffect(() => {
        setCodeValues(Array(codeLength).fill(''));
        // Focus the first input field when the code type changes
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [codeLength]);

    useEffect(() => {
        const code = codeValues.join('');
        if (code.length === codeLength) {
            if (isMissingDevice) {
                setFieldValue('recoveryCode', code);
                setFieldValue('code', ''); // Clear 2FA code field
            } else {
                setFieldValue('code', code);
                setFieldValue('recoveryCode', ''); // Clear recovery code field
            }
            submitForm();
        }
    }, [codeValues, codeLength, isMissingDevice, setFieldValue, submitForm]);

    const handleInputChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const newCodeValues = [...codeValues];
        const char = value.slice(-1); // Get the last character entered

        // Validate input based on code type
        if (!isMissingDevice && !/^\d*$/.test(char)) {
            // Only allow digits for 2FA code
            return;
        }

        newCodeValues[index] = char;
        setCodeValues(newCodeValues);

        // Move focus to the next input field if a character was entered and it's not the last field
        if (char && index < codeLength - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !codeValues[index] && index > 0) {
            // If backspace is pressed and the current field is empty, move focus to the previous field
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <LoginPageWrapper>
            <StyledFormBox>
                <FormBackgroundLogo src="/phoenixassets/phoenixpanel-transparent.png" alt="Phoenix Panel background logo" />
                <div css={tw`text-center mb-8 relative z-10`}>
                    <Typography.Title
                        level={1}
                        style={{
                            color: '#FFFFFF',
                            fontSize: '38px',
                            fontFamily: `'Roboto', sans-serif`,
                            fontWeight: 400,
                            lineHeight: '46px',
                            marginBottom: '6px',
                        }}
                    >
                        {isMissingDevice ? 'Recovery Code' : 'Two Factor Authentication'}
                    </Typography.Title>
                    <Typography.Text
                        style={{
                            color: '#767676',
                            fontSize: '13px',
                            fontFamily: `'Roboto', sans-serif`,
                            fontWeight: 400,
                            lineHeight: '18px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}
                    >
                        {isMissingDevice
                            ? 'ENTER ONE OF THE RECOVERY CODES GENERATED WHEN YOU SETUP 2-FACTOR AUTHENTICATION'
                            : 'PLEASE ENTER THE 6 DIGIT CODE SENT TO YOUR AUTHENTICATOR APP'}
                    </Typography.Text>
                </div>

                <Form layout='vertical' css={tw`relative z-10`}>
                    <Form.Item css={tw`flex justify-center`}>
                        {Array.from({ length: codeLength }).map((_, index) => (
                            <StyledCodeInput
                                key={index}
                                ref={(el: Input | null) => { inputRefs.current[index] = el; }}
                                value={codeValues[index]}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(index, e)}
                                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                                maxLength={1}
                                disabled={isSubmitting}
                                autoFocus={index === 0}
                                type={isMissingDevice ? 'text' : 'number'} // Use text for recovery code to allow alphanumeric
                            />
                        ))}
                    </Form.Item>

                    {/* The submit button is now triggered automatically */}
                    {/* <div css={tw`mt-6`}>
                        <Button size={'xlarge'} type={'submit'} disabled={isSubmitting} isLoading={isSubmitting}>
                            Continue
                        </Button>
                    </div> */}

                    <div css={tw`mt-6 text-center`}>
                        <span
                            onClick={() => {
                                setFieldValue('code', '');
                                setFieldValue('recoveryCode', '');
                                setIsMissingDevice((s: boolean) => !s);
                            }}
                            css={tw`cursor-pointer text-xs text-neutral-500 tracking-wide uppercase no-underline hover:text-neutral-700`}
                        >
                            {!isMissingDevice ? "I've Lost My Device" : 'I Have My Device'}
                        </span>
                    </div>
                    <div css={tw`mt-6 text-center`}>
                        <Link
                            to={'/auth/login'}
                            css={tw`text-xs text-neutral-500 tracking-wide uppercase no-underline hover:text-neutral-700`}
                        >
                            Return to Login
                        </Link>
                    </div>
                </Form>
            </StyledFormBox>
        </LoginPageWrapper>
    );
};

const EnhancedForm = withFormik<Props, Values>({
    handleSubmit: (
        { code, recoveryCode }: Values,
        { setSubmitting, props: { clearAndAddHttpError, location } }: FormikHelpers<Values> & { props: Props }
    ) => {
        loginCheckpoint(location.state?.token || '', code, recoveryCode)
            .then((response) => {
                if (response.complete) {
                    // @ts-expect-error this is valid
                    window.location = response.intended || '/';
                    return;
                }

                setSubmitting(false);
            })
            .catch((error) => {
                console.error(error);
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    },

    mapPropsToValues: () => ({
        code: '',
        recoveryCode: '',
    }),
})(LoginCheckpointContainer);

export default ({ history, location, ...props }: OwnProps) => {
    const { clearAndAddHttpError } = useFlash();

    if (!location.state?.token) {
        history.replace('/auth/login');

        return null;
    }

    return (
        <EnhancedForm clearAndAddHttpError={clearAndAddHttpError} history={history} location={location} {...props} />
    );
};
