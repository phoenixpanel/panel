import 'styled-components/macro';
import React, { useEffect, useRef, useState } from 'react';
import type {} from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import login from '@/api/auth/login';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Formik, FormikHelpers, Field as FormikField, FormikProps } from 'formik';
import { object, string } from 'yup';
import tw from 'twin.macro';
import Reaptcha from 'reaptcha';
import Turnstile from 'react-turnstile';
import useFlash from '@/plugins/useFlash';
import { Form, Input, Button as AntButton, Typography } from 'antd';
import styled from 'styled-components';

interface Values {
  username: string;
  password: string;
}

const LoginPageWrapper = styled.div`
  ${tw`min-h-screen flex items-center justify-center p-4`}
  background: #0F0F0F;
`;

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

const LoginContainer = ({ history }: RouteComponentProps) => {
  const ref = useRef<Reaptcha>(null);
  const [token, setToken] = useState('');

  const { clearFlashes, clearAndAddHttpError } = useFlash();
  const settingsData = useStoreState((state: any) => state.settings.data);
  const setUserData = useStoreActions((actions: any) => actions.user.setUserData);
  const captchaSettings = settingsData?.captcha;
  const { provider, siteKey, enabled } = captchaSettings || {};

  useEffect(() => {
    clearFlashes();

    // Necessary for CF Turnstiles
    window.javascriptCallback = function (token: string) {};
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

    let captchaKey: string | undefined;
    if (provider === 'google') {
      captchaKey = 'captcha-response';
    } else if (provider === 'cloudflare') {
      captchaKey = 'cf-turnstile-response';
    }

    try {
      login({ ...values, captchaKey, captchaData: token || '' })
        .then((response) => {
          if (response.complete) {
            // Update user data in store before redirecting
            if (response.user) {
              setUserData({
                uuid: response.user.uuid,
                username: response.user.username,
                email: response.user.email,
                language: response.user.language,
                rootAdmin: response.user.root_admin,
                useTotp: response.user.use_totp,
                createdAt: new Date(response.user.created_at),
                updatedAt: new Date(response.user.updated_at),
              });
            }

            // Use history.replace for consistent routing
            history.replace(response.intended || '/');
            return;
          }
          // Only navigate to checkpoint if confirmationToken is present
          if (response.confirmationToken) {
            history.replace('/auth/login/checkpoint', {
              token: response.confirmationToken,
            });
          } else {
            // Handle unexpected response - maybe show an error message
            console.error('Login API error: 2FA required but no confirmation token received.');
            clearAndAddHttpError({
              key: 'form:login',
              error: new Error('An unexpected error occurred during login.'),
            });
          }
        })
        .catch((error: any) => {
          console.error('Login API error:', error);
          setToken('');
          if (ref.current) ref.current.reset();

          console.log(error.message);
          // Check if the error is the specific captcha error from login.ts
          if (error instanceof Error && error.message === 'Incorrect captcha, please try again!') {
            clearAndAddHttpError({
              key: 'form:login',
              error: new Error(error.message),
            });
            setErrors({ password: 'Incorrect captcha, try again later!' });
          } else if (error.response && error.response.status === 400) {
            // Existing logic for generic 400 errors (like incorrect credentials)
            setErrors({ password: 'Incorrect credentials, ' });
          } else {
            // Handle other HTTP errors
            clearAndAddHttpError({ error });
          }
        });
    } catch (error: any) {
      console.error('Unexpected error during login process:', error);
      clearAndAddHttpError({ error });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LoginPageWrapper>
      <StyledFormBox>
        <FormBackgroundLogo src='/phoenixassets/phoenixpanel-transparent.png' alt='Phoenix Panel background logo' />
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
            Login
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
            JUST ONE CLICK AWAY FROM YOUR SERVERS
          </Typography.Text>
        </div>

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={object().shape({
            username: string().required('A username or email must be provided.'),
            password: string().required('Please enter your account password.'),
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
          }: FormikProps<Values>) => (
            <Form onFinish={handleSubmit} layout='vertical' css={tw`relative z-10`}>
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
                    Email or Username:
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
                  placeholder='Enter your email or username...'
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
                    Password:
                  </span>
                }
                name='password'
                validateStatus={touched.password && errors.password ? 'error' : undefined}
                help={
                  touched.password && errors.password ? (
                    <span css={tw`text-red-400 text-xs mt-1`}>
                      {errors.password === 'Incorrect credentials, ' ? (
                        <>
                          Incorrect credentials,{' '}
                          <Link
                            to={'/auth/password'}
                            css={tw`text-sm no-underline hover:underline`}
                            style={{ color: '#FF9500', fontWeight: 500 }}
                          >
                            reset password!
                          </Link>
                        </>
                      ) : (
                        errors.password
                      )}
                    </span>
                  ) : null
                }
                style={{ marginBottom: '15px' }}
              >
                <StyledInputPassword
                  name='password'
                  placeholder='Enter your password...'
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  autoComplete='current-password'
                />
              </Form.Item>

              {provider === 'cloudflare' && enabled === '1' ? (
                <div css={tw`mx-auto`} style={{ marginBottom: '0px !important' }}>
                  <Turnstile
                    sitekey={siteKey}
                    onSuccess={(token: string) => {
                      console.log('Turnstile callback called with token:', token);
                      setToken(token);
                    }}
                  />
                </div>
              ) : provider === 'google' && enabled === '1' ? (
                <div css={tw`mx-auto`} style={{ marginBottom: '0px !important' }}>
                  <Reaptcha
                    ref={ref}
                    sitekey={siteKey}
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

              <Form.Item css={tw`mt-[0.5rem !important]`}>
                <SubmitButton type='primary' htmlType='submit' loading={isSubmitting}>
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

export default LoginContainer;
