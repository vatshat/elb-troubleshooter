module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "webextensions": true,
        "node": true
    },
    "globals": {
        "module": false,
        "inject": false,
        "document": false
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "no-console": 0,
        "indent": ["error", 4],
        "linebreak-style": ["error","windows"],
        "quotes": ["error", "single"],
        'react/prop-types': 'off',
        'no-unused-vars': 'on',
    }
};