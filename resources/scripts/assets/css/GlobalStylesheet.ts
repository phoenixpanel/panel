import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';

export default createGlobalStyle`
    body {
        ${tw`font-sans bg-neutral-900 text-neutral-100`};
        letter-spacing: 0.015em;
    }

    /* Add phoenix theme gradients for specific elements */
    .phoenix-gradient {
        background: linear-gradient(135deg, #E25822, #FF9500);
    }
    
    .phoenix-gradient-subtle {
        background: linear-gradient(135deg, rgba(226, 88, 34, 0.2), rgba(255, 149, 0, 0.2));
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-normal font-header`};
    }

    p {
        ${tw`text-neutral-200 leading-snug font-sans`};
    }
    
    a {
        ${tw`text-phoenix-600 hover:text-phoenix-500`};
        transition: color 0.2s ease;
    }

    form {
        ${tw`m-0`};
    }

    textarea, select, input, button, button:focus, button:focus-visible {
        ${tw`outline-none`};
    }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield !important;
    }

    /* Scroll Bar Style */
    ::-webkit-scrollbar {
        background: none;
        width: 16px;
        height: 16px;
    }

    ::-webkit-scrollbar-thumb {
        border: solid 0 rgb(0 0 0 / 0%);
        border-right-width: 4px;
        border-left-width: 4px;
        -webkit-border-radius: 9px 4px;
        -webkit-box-shadow: inset 0 0 0 1px theme('colors.phoenix.600'), inset 0 0 0 4px theme('colors.neutral.700');
    }

    ::-webkit-scrollbar-track-piece {
        margin: 4px 0;
    }

    ::-webkit-scrollbar-thumb:horizontal {
        border-right-width: 0;
        border-left-width: 0;
        border-top-width: 4px;
        border-bottom-width: 4px;
        -webkit-border-radius: 4px 9px;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }

    /* Override Ant Design Form Item Label Padding */
    & {
      :where(.css-18afz5u).ant-form-vertical .ant-form-item:not(.ant-form-item-horizontal) .ant-form-item-label,
      :where(.css-18afz5u).ant-form-vertical .ant-form-item:not(.ant-form-item-horizontal) .ant-col-24.ant-form-item-label,
      :where(.css-18afz5u).ant-form-vertical .ant-form-item:not(.ant-form-item-horizontal) .ant-col-xl-24.ant-form-item-label {
        padding: 0 !important;
        margin: 0;
        white-space: initial;
        text-align: start;
      }
    }
`;
