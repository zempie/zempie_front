const fs = require('fs');
const chalk = require('chalk');

module.exports = {
    input: [
        '**/*.{js,ts,vue}',
        '***/**/*.{js,ts,vue}',
        // Use ! to filter out files or directories
        '!src/locales/**',
        '!**/node_modules/**',
    ],

    output: './',
    options: {
        debug: true,
        func: {
            list: ['i18next.t', 'i18n.ts.t', '\\$t', 'this.\\$t','\\$i18n.t', 'i18n.t','t',],
            extensions: ['.js', '.ts', '.vue']
        },
        trans: {
            component: 'Trans',
            i18nKey: 'i18nKey',
            defaultsKey: 'defaults',
            extensions: ['.js', '.ts', '.vue'],
            fallbackKey: function (ns, value) {
                return value;
            },
            acorn: {
                ecmaVersion: 10, // defaults to 10
                sourceType: 'module', // defaults to 'module'
                // Check out https://github.com/acornjs/acorn/tree/master/acorn#interface for additional options
            }
        },
        lngs: ['en', 'ko'],
        //default언어는 우선 영어로 지정해두었습니다.
        defaultLng: 'en',
        defaultValue: '__STRING_NOT_TRANSLATED__',
        //언어 경로
        resource: {
            loadPath: 'locales/{{lng}}/{{ns}}.json',
            savePath: 'locales/{{lng}}/{{ns}}.json',
            jsonIndent: 2,
            lineEnding: '\n'
        },
        nsSeparator: false, // namespace separator
        keySeparator: false, // key separator
        interpolation: {
            prefix: '{{',
            suffix: '}}'
        }
    }

};