const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'babel'],
  extends: [
    'airbnb', // airbnb style guide 적용
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['stories/', 'node_modules/', 'src/module/'], // lint 적용 제외경로
  settings: {
    'import/resolver': {
      // import path 관련
      node: {
        extensions: ['js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
  rules: {
    'import/extensions': [
      'error',
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    'import/no-extraneous-dependencies': [
      // dependencies 무시
      'error',
      {
        devDependencies: true,
      },
    ],
    'prettier/prettier': [
      'error',
      {
        // 문자열은 따옴표로 formatting
        singleQuote: true,
        // 코드 마지막에 세미콜른이 있게 formatting
        semi: true,
        // 탭의 사용을 금하고 스페이스바 사용으로 대체하게 formatting
        useTabs: false,
        // 들여쓰기 너비는 2칸
        tabWidth: 2,
        // 자세한 설명은 구글링이 짱이긴하나 객체나 배열 키:값 뒤에 항상 콤마를 붙히도록 formatting
        trailingComma: 'es5',
        // 코드 한줄이 maximum 100칸
        printWidth: 100,
        // 화살표 함수가 하나의 매개변수를 받을 때 괄호를 생략하게 formatting
        arrowParens: 'avoid',
        // "parser": 'typescript',
        // platform에 따른 line ending sequence 설정 무시
        endOfLine: 'auto',
      },
    ],
    'no-unused-expressions': 'off',
    'babel/no-unused-expressions': 'error',
    'class-methods-use-this': 'off', // class method 에서 this 필수 접근 무시
    '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }], // ...args: any[] 는 무시
    // eslint/no-shadow 대신 ts eslint 사용
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    // eslint/no-use-before-define 대신 ts eslint 사용
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
  },
};