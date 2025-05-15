import React, { useEffect, useRef, useState } from 'react';
import type {} from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import register from '@/api/auth/register';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers, Field as FormikField, FormikProps } from 'formik';
import { object, string } from 'yup';
import tw from 'twin.macro';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';
import { Form, Input, Button as AntButton, Typography, notification, message } from 'antd';
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
    height: 41rem; // Updated height to accommodate all fields
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

// Define StyledInput component
const StyledInput = styled(Input)`
    background: rgba(49.04, 49.04, 49.04, 0.72) !important;
    border: 1px #373737 solid !important;
    border-radius: 2px !important;
    color: rgba(220, 220, 220, 0.85) !important;
    padding: 10px 12px !important; // Adjusted padding for height
    height: 38px !important; // Explicit height

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

const StyledInputPassword = styled(Input.Password)`
    background: rgba(49.04, 49.04, 49.04, 0.72) !important;
    border: 1px #373737 solid !important;
    border-radius: 2px !important;
    color: rgba(220, 220, 220, 0.85) !important;
    padding: 0 12px !important;
    height: 38px !important;
    margin-bottom: 15px; // Added margin for spacing

    .ant-input {
        // Target inner input for background & text color
        background: transparent !important;
        color: rgba(220, 220, 220, 0.85) !important;
        font-family: 'Roboto', sans-serif;
        font-weight: 400;
        font-size: 14px;
        padding-left: 0;

        &::placeholder {
            // Target inner input placeholder
            color: rgba(110.34, 110.34, 110.34, 0.85) !important;
            font-family: 'Roboto', sans-serif;
            font-weight: 400;
            font-size: 14px;
        }
    }

    .ant-input-suffix .anticon {
        // Eye icon color
        color: rgba(110.34, 110.34, 110.34, 0.85) !important;
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

// Visually accurate placeholder for Cloudflare Turnstile/reCAPTCHA
const RecaptchaPlaceholder = styled.div`
    width: 300px; // Width from screenshot
    height: 65px; // Height from screenshot
    background-color: #222222; // Background from screenshot
    border: 1px solid #4a4a4a; // Border from screenshot (approx)
    border-radius: 3px;
    display: flex;
    align-items: center;
    padding: 10px 12px;
    margin: 25px auto; // Centered with more margin
    font-family: 'Roboto', sans-serif; // Consistent font

    .checkbox-container {
        width: 28px;
        height: 28px;
        background-color: #000000;
        border: 2px solid #b0b0b0;
        border-radius: 3px;
        margin-right: 12px;
        // Add inner tick or visual cue if needed, for now, it's a box
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

        .logo-placeholder {
            width: 75px; /* from HTML analysis */
            height: 25px; /* from HTML analysis */
            position: relative;
            margin-bottom: 3px;

            // Simplified Cloudflare logo elements based on screenshot analysis
            .cf-shape {
                position: absolute;
            }
            .cf-bar1 {
                /* Orange main shape */
                width: 28.04px;
                height: 16.27px;
                background: #f48120;
                left: 9.49px;
                top: 0;
            }
            .cf-bar2 {
                /* White overlay/cutout */
                width: 24.38px;
                height: 9.48px;
                background: #ffffff;
                left: 28.1px;
                top: 6.64px;
            }
            .cf-bar3 {
                /* Yellow accent */
                width: 10.67px;
                height: 9.26px;
                background: #faad3f;
                left: 45.2px;
                top: 6.87px;
            }
            .cf-text-shape {
                /* White bar for "CLOUDFLARE" text */
                width: 65px;
                height: 5px;
                background: #ffffff;
                left: 0;
                top: 18.8px;
            }
        }

        .privacy-terms {
            color: #a9a9a9; // Lighter grey for privacy/terms
            font-size: 9px;
            font-weight: 400;
            a {
                color: #a9a9a9;
                text-decoration: none;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
`;

// Update the interface to match the new form fields
interface Values {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    name_first: string;
    name_last: string;
}

const RegisterContainer = ({ history }: RouteComponentProps) => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const settingsData = useStoreState((state: any) => state.settings.data);
    const captchaSettings = settingsData?.captcha;
    const { provider, siteKey, enabled } = captchaSettings || {};

    useEffect(() => {
        clearFlashes();
    }, []);

    const handleFormSubmit = (values: Values, { setSubmitting, setErrors }: FormikHelpers<Values>) => {
        clearFlashes();
        if (provider == 'google' && enabled && !token && ref.current) {
            ref.current!.execute().catch((error: any) => {
                console.error('ReCAPTCHA execution error:', error);
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
            return;
        }

        console.log('Frontend Captcha State:');
        console.log('  Provider:', provider);
        console.log('  Enabled:', enabled);
        console.log('  Token:', token);
        
        // Include all required fields in registration
        register({
            username: values.username,
            email: values.email,
            password: values.password,
                name_first: values.name_first,
                name_last: values.name_last,
                recaptchaData: token
            })
            .then(() => {
                // Assuming successful registration redirects to login or shows a success message
                // You might want to redirect to the login page after successful registration
                history.push('/auth/login');
                message.success('Registration successful! Please log in.');
            })
            .catch((error: any) => {
                console.error('Registration API error:', error);
                setToken('');
                if (ref.current) ref.current.reset();
                setSubmitting(false);
                if (error.response && error.response.status === 409) {
                    // Handle user already exists error
                    setErrors({ email: 'A user with this username or email already exists.' });
                } else {
                    clearAndAddHttpError({ error });
                }
            });
    };

    return (
        <LoginPageWrapper>
            <StyledFormBox>
                <FormBackgroundLogo src='/assets/phoenixpanel-transparent.png' alt='Phoenix Panel background logo' />
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
                        Register
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
                        JUST ONE CLICK AWAY FROM ACCESSING THE PANEL
                    </Typography.Text>
                </div>
                
                <Formik
                    initialValues={{
                        username: '',
                        email: '',
                        password: '',
                        password_confirmation: '',
                        name_first: '',
                        name_last: '',
                    }}
                    validationSchema={object().shape({
                        username: string().required('Username is required'),
                        email: string().required('Email is required').email('Invalid email address'),
                        password: string().required('Password is required').min(8, 'Password must be at least 8 characters'),
                        password_confirmation: string()
                            .required('Password confirmation is required')
                            .test('passwords-match', 'Passwords do not match', function(value) {
                                return value === this.parent.password;
                            }),
                        name_first: string().required('First name is required'),
                        name_last: string().required('Last name is required'),
                    })}
                    onSubmit={handleFormSubmit}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        touched,
                        errors,
                        isSubmitting,
                        setSubmitting,
                        submitForm,
                        setErrors,
                    }) => (
                        <Form onFinish={handleSubmit} layout='vertical' css={tw`relative z-10`}>
                            {/* First Name and Last Name Fields */}
                            <div style={{ marginBottom: '15px' }}>
                                <StyledInput
                                    name="name_first"
                                    placeholder="First Name"
                                    value={values.name_first}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                    style={{ width: '48%', display: 'inline-block', marginRight: '4%' }}
                                />
                                <StyledInput
                                    name="name_last"
                                    placeholder="Last Name"
                                    value={values.name_last}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                    style={{ width: '48%', display: 'inline-block' }}
                                />
                                {touched.name_first && errors.name_first && (
                                    <div css={tw`text-red-400 text-xs mt-1`}>{errors.name_first}</div>
                                )}
                                {touched.name_last && errors.name_last && (
                                    <div css={tw`text-red-400 text-xs mt-1`}>{errors.name_last}</div>
                                )}
                            </div>
                            
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
                                        Username:
                                    </span>
                                }
                                name='username'
                                validateStatus={touched.username && errors.username ? 'error' : undefined}
                                help={
                                    touched.username && errors.username ? (
                                        <span css={tw`text-red-400 text-xs mt-1`}>{errors.username}</span>
                                    ) : null
                                }
                            >
                                <StyledInput
                                    name='username'
                                    placeholder='Enter your username...'
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                    autoComplete='username'
                                />
                            </Form.Item>

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
                                        Email:
                                    </span>
                                }
                                name='email'
                                validateStatus={touched.email && errors.email ? 'error' : undefined}
                                help={
                                    touched.email && errors.email ? (
                                        <span css={tw`text-red-400 text-xs mt-1`}>{errors.email}</span>
                                    ) : null
                                }
                            >
                                <StyledInput
                                    name='email'
                                    placeholder='Enter your email...'
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                    autoComplete='email'
                                />
                            </Form.Item>

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
                                        Password:
                                    </span>
                                }
                                name='password'
                                validateStatus={touched.password && errors.password ? 'error' : undefined}
                                help={
                                    touched.password && errors.password ? (
                                        <span css={tw`text-red-400 text-xs mt-1`}>{errors.password}</span>
                                    ) : null
                                }
                                style={{ marginBottom: '10px' }}
                            >
                                <StyledInputPassword
                                    name='password'
                                    placeholder='Enter your password...'
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                    autoComplete='new-password'
                                />
                            </Form.Item>

                            <Form.Item
                                name='password_confirmation'
                                validateStatus={
                                    touched.password_confirmation && errors.password_confirmation ? 'error' : undefined
                                }
                                help={
                                    touched.password_confirmation && errors.password_confirmation ? (
                                        <span css={tw`text-red-400 text-xs mt-1`}>
                                            {errors.password_confirmation}
                                        </span>
                                    ) : null
                                }
                            >
                                <StyledInputPassword
                                    name='password_confirmation'
                                    placeholder='Confirm your password...'
                                    value={values.password_confirmation}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    autoComplete='new-password'
                                    disabled={isSubmitting}
                                />
                            </Form.Item>

                            {provider === 'cloudflare' && enabled === true ? (
                                <div css={tw`mx-auto`}>
                                    <div
                                        className="cf-turnstile"
                                        data-sitekey={siteKey}
                                        data-callback="javascriptCallback"
                                    ></div>
                                    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
                                </div>
                            ) : provider === 'google' && enabled === true ? (
                                <div css={tw`mx-auto`}>
                                    <Reaptcha
                                        ref={ref}
                                        sitekey={siteKey || ''}
                                        onVerify={(response: string) => {
                                            setToken(response);
                                            if (!isSubmitting) {
                                                submitForm();
                                            }
                                        }}
                                        onExpire={() => {
                                            setToken('');
                                            setSubmitting(false);
                                        }}
                                    />
                                </div>
                            ) : null}

                            <Form.Item css={tw`mt-8 mb-6`}>
                                <SubmitButton
                                    type='primary'
                                    htmlType='submit'
                                    loading={isSubmitting}
                                >
                                    SUBMIT
                                </SubmitButton>
                            </Form.Item>
                        </Form>
                    )}
                </Formik>
            </StyledFormBox>
        </LoginPageWrapper>
    );
};

export default RegisterContainer;