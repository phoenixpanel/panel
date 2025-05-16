import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import requestPasswordResetEmail from '@/api/auth/requestPasswordResetEmail';
import { httpErrorToHuman } from '@/api/http';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { object, string } from 'yup';
import tw from 'twin.macro';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';
import styled from 'styled-components';
import { Form, Input, Button as AntButton, Typography, message } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const RequestPasswordPageWrapper = styled.div`
    ${tw`min-h-screen flex items-center justify-center p-4`}
    background: #0F0F0F;
`;

const StyledFormBox = styled.div`
    ${tw`w-full relative overflow-hidden`}
    width: 34rem;
    height: 22rem;
    background: rgba(35.55, 35.55, 35.55, 0.82);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`;

const FormBackgroundLogo = styled.img`
    ${tw`absolute pointer-events-none`}
    z-index: 0;
    opacity: 0.04;
    width: 30rem;
    height: auto;
    left: -46%;
    transform: rotate(-9deg);
    transform-origin: top left;
`;

const StyledInputContainer = styled.div`
    ${tw`relative flex items-center`}
`;

const StyledInput = styled(Input)`
    background: rgba(49.04, 49.04, 49.04, 0.72) !important;
    border: 1px #373737 solid !important;
    border-radius: 2px !important;
    color: rgba(220, 220, 220, 0.85) !important;
    padding: 10px 12px !important;
    height: 38px !important;
    flex-grow: 1;

    &::placeholder {
        color: rgba(110.34, 110.34, 110.34, 0.85) !important;
        font-family: 'Roboto', sans-serif;
        font-weight: 400;
        font-size: 14px;
    }

    &:focus, &:focus-within {
        border-color: #FF9500 !important;
        box-shadow: 0 0 0 2px rgba(255, 149, 0, 0.2) !important;
    }
`;

const StyledArrowButton = styled(AntButton)`
    ${tw`absolute right-0 flex items-center justify-center`}
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    color: #FF9500 !important;
    font-size: 20px;
    width: 40px;
    cursor: pointer;

    &:hover, &:focus {
        color: #e08000 !important;
    }
`;


const RecaptchaPlaceholder = styled.div`
    width: 300px;
    height: 65px;
    background-color: #222222;
    border: 1px solid #4a4a4a;
    border-radius: 3px;
    display: flex;
    align-items: center;
    padding: 10px 12px;
    margin: 25px auto;
    font-family: 'Roboto', sans-serif;

    .checkbox-container {
        width: 28px;
        height: 28px;
        background-color: #000000;
        border: 2px solid #b0b0b0;
        border-radius: 3px;
        margin-right: 12px;
    }

    .text-verify {
        color: #ffffff;
        font-size: 14px;
        font-weight: 400;
        flex-grow: 1;
    }

    .cloudflare-branding {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
`;

interface Values {
    email: string;
}

export default () => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');
    const [showCaptchaOverlay, setShowCaptchaOverlay] = useState(false);

    const { clearFlashes, addFlash } = useFlash();
    const settingsData = useStoreState((state: any) => state.settings.data);
    const captchaSettings = settingsData?.captcha;
    const { provider, siteKey, enabled } = captchaSettings || {};

    useEffect(() => {
        clearFlashes();
    }, []);

    const handleSubmission = ({ email }: Values, { setSubmitting, resetForm }: FormikHelpers<Values>) => {
        console.log('DEBUG: handleSubmission called with email:', email);
        clearFlashes();

        console.log('DEBUG: Checking CAPTCHA provider and token...');

        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the captcha data is returned by the component.
        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        console.log(captchaSettings)
        if (enabled == true && (provider === "google" || provider === "cloudflare") && !token) {
            console.log('DEBUG: CAPTCHA enabled and no token. Setting showCaptchaOverlay to true.');
            setShowCaptchaOverlay(true);
            console.log('DEBUG: showCaptchaOverlay state immediately after setting true:', showCaptchaOverlay);

            console.log(`DEBUG: ${provider} CAPTCHA enabled and no token, showing overlay.`);
            console.log('DEBUG: showCaptchaOverlay state (after setting true):', showCaptchaOverlay);
            console.log('DEBUG: ref.current before execute:', ref.current);

            return;
        }

        console.log('DEBUG: CAPTCHA check passed. Calling requestPasswordResetEmail with email:', email, 'and token:', token);
        requestPasswordResetEmail(email, token)
            .then((response) => {
                console.log('DEBUG: requestPasswordResetEmail success:', response);
                resetForm();
                message.success(response);
            })
            .catch((error: any) => {
                console.error('DEBUG: requestPasswordResetEmail error:', error);
                addFlash({ type: 'error', title: 'Error', message: httpErrorToHuman(error) });
            })
            .then(() => {
                console.log('DEBUG: requestPasswordResetEmail finished');
                setToken('');
                if (ref.current) ref.current.reset();

                setSubmitting(false);
            });
    };

    return (
        <RequestPasswordPageWrapper>
            <StyledFormBox>
                <FormBackgroundLogo src='/phoenixassets/phoenixpanel-transparent.png' alt='Phoenix Panel background logo' />
                <div css={tw`text-center mb-8 relative z-10`}>
                    <Typography.Title level={1} style={{ color: '#FFFFFF', fontSize: '38px', fontFamily: `'Roboto', sans-serif`, fontWeight: 400, lineHeight: '46px', marginBottom: '6px' }}>
                        Reset Password
                    </Typography.Title>
                    <Typography.Text style={{ color: '#767676', fontSize: '13px', fontFamily: `'Roboto', sans-serif`, fontWeight: 400, lineHeight: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        IT'S FINE, IT HAPPENS TO THE BEST OF US! RESET YOUR PASSWORD HERE
                    </Typography.Text>
                </div>
                <Formik
                    onSubmit={handleSubmission}
                    initialValues={{ email: '' }}
                    validationSchema={object().shape({
                        email: string()
                            .email('A valid email address must be provided to continue.')
                            .required('A valid email address must be provided to continue.'),
                    })}
                >
                    {({ isSubmitting, setSubmitting, submitForm, values, handleChange, handleBlur, errors, touched }: FormikProps<Values>) => {
                        console.log('Formik render prop called');
                        return (
                            <>
                                <Form layout="vertical" onFinish={() => {
                                    console.log('Form onFinish called, calling submitForm()');
                                    submitForm().catch((err: any) => console.error('Error from submitForm promise:', err));
                                }}>
                                    <Form.Item
                                        label={
                                            <span
                                                style={{
                                                    color: '#979797',
                                                    fontSize: '12px',
                                                    fontFamily: `'Roboto', sans-serif`,
                                                    fontWeight: 400,
                                                    lineHeight: '16px',
                                                    display: 'block',
                                                }}
                                            >
                                                EMAIL
                                            </span>
                                        }
                                        help={
                                            <span
                                                style={{
                                                    color: '#979797',
                                                    fontSize: '12px',
                                                    fontFamily: `'Roboto', sans-serif`,
                                                    fontWeight: 400,
                                                    lineHeight: '16px',
                                                    display: 'block',
                                                    margin: '0.5rem 0px 10px 0px',
                                                }}
                                            >
                                                Enter your account email address to receive instructions on resetting your password.
                                            </span>
                                        }
                                    >
                                        <StyledInputContainer>
                                            <StyledInput
                                                name="email"
                                                type="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Enter your email address..."
                                                disabled={isSubmitting}
                                            />
                                            {!!values.email && !errors.email && (
                                                <StyledArrowButton onClick={() => submitForm()} disabled={isSubmitting}>
                                                    <ArrowRightOutlined />
                                                </StyledArrowButton>
                                            )}
                                        </StyledInputContainer>
                                    </Form.Item>

                                    <div css={tw`mt-6 text-center`}>
                                        <Link
                                            to={'/auth/login'}
                                            css={tw`text-xs text-neutral-500 tracking-wide uppercase no-underline hover:text-neutral-700`}
                                        >
                                            RETURN TO LOGIN
                                        </Link>
                                    </div>
                                </Form>
                                       {console.log('DEBUG: Inside render prop. showCaptchaOverlay:', showCaptchaOverlay, 'enabled:', enabled, 'provider:', provider, 'siteKey:', siteKey)}
                                {showCaptchaOverlay && enabled == true && (provider === "google" || provider === "cloudflare") && (
                                   <div css={tw`fixed inset-0 bg-[#0F0F0F] bg-opacity-80 flex items-center justify-center transition-opacity duration-300 ease-out`} className={showCaptchaOverlay ? 'opacity-100' : 'opacity-0'}>
                                       {provider === "google" && (
                                           <Reaptcha
                                               ref={ref}
                                               size={'invisible'}
                                               sitekey={siteKey || '_invalid_key'}
                                               onVerify={(response: string) => {
                                                   console.log('DEBUG: Reaptcha onVerify called.');
                                                   setToken(response);
                                                   setShowCaptchaOverlay(false);
                                                   submitForm();
                                               }}
                                               onExpire={() => {
                                                   console.log('DEBUG: Reaptcha onExpire called.');
                                                   setShowCaptchaOverlay(false);
                                                   setSubmitting(false);
                                                   setToken('');
                                               }}
                                               onError={() => {
                                                   console.error('DEBUG: Reaptcha onError called.');
                                                   setShowCaptchaOverlay(false);
                                                   setSubmitting(false);
                                                   setToken('');
                                                   addFlash({ type: 'error', title: 'Error', message: httpErrorToHuman('reCAPTCHA execution failed.') });
                                               }}
                                               onRender={() => {
                                                   console.log('DEBUG: Reaptcha onRender called. Component has rendered.');
                                                   // Execute reCAPTCHA only for Google provider after it has rendered
                                                   if (provider === "google" && ref.current) {
                                                       console.log('DEBUG: Inside onRender. Attempting to execute Google reCAPTCHA.');
                                                       console.log('DEBUG: Site key being used:', siteKey);
                                                       console.log('DEBUG: Reaptcha ref.current state before execute:', ref.current.state);
                                                       ref.current.execute().catch((error: any) => {
                                                           console.error('DEBUG: reCAPTCHA execution error from onRender:', error);
                                                           setShowCaptchaOverlay(false);
                                                           setSubmitting(false);
                                                           addFlash({ type: 'error', title: 'Error', message: httpErrorToHuman(error) });
                                                       });
                                                   }
                                               }}
                                               onLoad={() => {
                                                   console.log('DEBUG: Reaptcha onLoad called. Script has loaded.');
                                                   // Execution logic moved to onRender
                                               }}
                                           />
                                       )}
                                       {provider === "cloudflare" && (
                                           <div css={tw`mx-auto`}>
                                               <div
                                                   className="cf-turnstile"
                                                   data-sitekey={siteKey || '_invalid_key'}
                                                   data-callback="javascriptCallback" // This callback needs to be globally available or handled differently
                                                   data-theme="dark" // Assuming dark theme based on the site's look
                                               ></div>
                                               {/* The script tag should ideally be in the HTML head, but adding it here for now */}
                                               <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
                                           </div>
                                       )}
                                   </div>
                                )}
                            </>
                        );
                    }}
                </Formik>
            </StyledFormBox>
        </RequestPasswordPageWrapper>
    );
};
