module.exports = function (api) {
    api.cache(true);

    return {
        presets: [
            '@babel/typescript',
            ['@babel/env', {
                modules: false,
                useBuiltIns: 'entry',
                corejs: 3,
                targets: {"chrome": "79"},
            }],
            '@babel/react',
        ]
    };
};
