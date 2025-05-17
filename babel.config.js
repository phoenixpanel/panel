module.exports = function (api) {
    let targets = {};
    const plugins = [
        'babel-plugin-macros',
        'styled-components',
        'react-hot-loader/babel',
        'babel-plugin-macros',
        'styled-components',
        'react-hot-loader/babel',
        '@babel/plugin-syntax-dynamic-import',
        // '@babel/plugin-proposal-private-property-in-object',
    ];

    if (api.env('test')) {
        targets = { node: 'current' };
        plugins.push('@babel/transform-modules-commonjs');
    }

    return {
        sourceType: 'unambiguous',
        plugins,
        presets: [
            '@babel/typescript',
            ['@babel/env', {
                modules: false,
                useBuiltIns: 'usage',
                corejs: 3,
                targets,
            }],
            '@babel/react',
        ]
    };
};
