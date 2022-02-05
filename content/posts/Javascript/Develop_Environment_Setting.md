---
title: 'Babel과 Webpack을 이용한 개발 환경 세팅'
date: 2021-07-20T15:11:54+09:00
categories: ['Frontend']
tags: ['Javascript', 'Webpack', 'Babel']
draft: false
---

이 글은 모던 자바스크립트 Deep Dive 49장 "Babel과 Webpack을 이용한 개발환경 세팅" 대해 학습한 내용을 정리한 글입니다.

<br>

<!--more-->

크롬, 파이어폭스, 사파리 등의 브라우저에서는 대부분 ES6 사양을 지원한다.
하지만 IE 11의 지원율은 11%다.

즉, 최신 사양으로 개발된 프로젝트를 구형 브라우저에서 문제없이 동작 시키려면 개발환경을 따로 구축해야한다.

또한, 모듈을 사용하기 위해서는 모듈 로더도 따로 필요하다. ESM은 대부분의 브라우저에서 사용이 가능하지만 실제로는 주로 사용하지 않는다.

이유는 아래와 같다.

- IE와 같은 구형 브라우저에서는 지원하지 않는다.
- ESM을 사용하더라도 트랜스파일링이나 번들링은 필요하다.
- ESM이 아직 지원하지 않는 기능들이 있으며 버그도 존재한다.

그렇기 때문에 주로 Babel과 Webpack을 사용해 트랜스파일링과 번들링 작업을 한다.

<br>

### Babel

---

- ES6이상의 사양을 지원하지 않는 구형 브라우저에서 ES6 이상의 사양으로 작성된 코드를 동작할 수 있도로 ES5 사양의 소스코드로 트랜스파일링 해주는 역할을 한다.
- React에서 사용하는 JSX문법을 브라우저에서 동작할 수 있도록 트랜스파일링 해준다.

<br>

### 설치

---

1.  `npm i -D @babel/core @babel/cli` 를 터미널에 입력한다.
2.  바벨을 사용할 때 함께 사용되어야 할 플러그인들이 모인 @babel/preset-env 프리셋을 설치해야한다.<br>
    아래는 Babel에서 제공하는 공식 프리셋 목록이다.
    - @babel/preset-env
    - @babel/preset-flow
    - @babel/preset-react
    - @babel/preset-typescript
      <br><br>
3.  브라우저 지원 형식은 .browserlistrc 파일에 상세하게 설정할 수 있다.
4.  프로젝트 루트 폴더에 babel.config.json 설정 파일을 생성한다.
    아래 설정을 추가해서 설치한 프리셋을 사용하겠다고 명령한다.

    ```json
    {
      "preset": ["@babel/preset-env"]
    }
    ```

<br>

### 트랜스파일링

---

- npm scripts에 babel cli 명령어를 입력해둔다.
- `babel 타깃폴더 -w -d 결과물 폴더`
- **-w(watch)** : 타깃 폴더에 있는 모든 JS파일들의 변경을 감지하여 자동으로 트랜스파일링한다.
- **-d(out-dir)** : 트랜스파일링된 결과물을 저장할 폴더를 지정한다. 없을경우 자동 생성.

```json
{
  "build": "babel src/js -w -d dist/js"
}
```

- node는 CommonJS를 사용하고 있다. 하지만 브라우저에서는 동작하지 않는다. 이것을 위해 웹팩이 필요하다.

<br>

### Webpack

---

- 의존 관계에 있는 자바스크립트, CSS, 이미지 등의 리소스들을 하나(또는 여러 개) 파일로 번들링하는 모듈 번들러다.

<br>

### 설치

---

1. `npm i -D webpack webpack-cli` 명령어 입력
2. webpack이 번들링 시 babel을 사용해 트랜스파일링 하도록 하기 위해 Babel 로더를 설치한다
   `npm i -D babel-loader` 명령어 입력
3. package.json에서 빌드를 Webpack이 하도록 설정

   ```json
   {
     "build": "webpack -w"
   }
   ```

<br>

### Webpack 설정하기

---

1. webpack.config.js 파일을 생성한다.

   ```jsx
   const path = require('path');

   module.exports = {
     //최초 진입점
     entry: './src/js/main.js',
     //번들링 된 js 파일의 이름과 저장될 경로 지정
     output: {
       path: path.resolve(__dirname, 'dist/js'),
       filename: 'index.js',
     },
     module: {
       rules: [
         {
           test: /\.js$/,
           include: [path.resolve(__dirname, 'src/js')],
           exclude: /node_modules/,
           use: {
             loader: 'babel-loader',
             options: {
               presets: ['@babel/preset-env'],
             },
           },
         },
       ],
     },
     devtool: 'source-map',
     mode: 'development',
   };
   ```

2. `@babel-polyfill` 설치

   - Promise, Object.assign, Array.from 등은 ES5사양에서 대체되는것이 없어서 트랜스파일링이 되지 않는다.
   - 개발환경뿐만 아니라 실제 서비스 환경에서도 사용해야 하기 때문에 Dev-dependencies 대신 dependencies에 설치해야한다.

   ```jsx
   //import를 사용할 경우 webpack 설정의 entry에 다음을 추가한다.
   {
   	entry : ['@babel/polyfill', './src/js/main.js'],
   }
   ```
