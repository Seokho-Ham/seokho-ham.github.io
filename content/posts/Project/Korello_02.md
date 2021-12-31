---
title: '[Korello 프로젝트] Refactoring Day2'
date: 2021-07-21T22:52:01+09:00
categories: ['사이드 프로젝트']
tags: ['Javascript', 'React', 'Webpack', 'Babel']
draft: true
---

Korello 프로젝트의 Webpack & Babel 설정을 직접 했다.

혼자하다가 막혀서 여러 블로그의 도움을 받았다.

<br>

<!--more-->

### 개발 환경 구축

- 개발환경 세팅할 브랜치를 생성했다.
  브랜치 명 : Core/Setting
- npm 을 사용해 프로젝트에서 사용할 필수 패키지들을 설치했다.

<br>

## Babel

- babel-cli : 커맨드 라인을 사용한 트랜스파일링
- babel-core : 바벨 코어 패키지
- babel/preset-env : 필수 프리셋. 플러그인들 모음
- babel/preset-react : jsx변환용 프리셋
- babel-plugin-styled-components : 클래스명을 쉽게 볼 수 있도록 변환

<br>

## Webpack

- webpack : 웹팩의 코어
- webpack-cli : 웹팩을 커맨드라인에서 사용
- webpack-dev-server : 실시간 리로드 기능을 갖춘 개발 서버.
- 메모리 컴파일을 사용해 컴파일 속도가 빠르다
  - 동작원리
    - 서버 실행 시 소스 파일들을 번들링하여 메모리에 저장소스 파일을 감시
    - 소스파일 변경시 변경된 모듈만 새로 번들링
    - 변경된 모듈 정보를 브라우저에 전송
    - 브라우저는 변경을 인지하고 새로고침되어 변경사항이 반영된 페이지를 로드
- html-webpack-plugin : 번들링이 된 파일이 적용된 html을 새롭게 생성하도록 돕는 모듈

<br>

## Loader

- babel-loader : jsx, ES6 문법 트랜스파일링

<br>

## 최종 웹팩 설정

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  entry: './src/index',
  //웹팩이 모듈을 처리하는 방식을 설정하는 속성. -> 확장자를 생략해도 인식하게 만든다.
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  //모듈에 적용할 로더들과 옵션의 설정
  //test : 어떤 파일에 적용할지 확장자를 작성
  //exclude : 로더에서 제외할 파일 설정
  // loader : 적용할 로더 작성, 여러개일 경우 use 키워드 사용
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      // index.html에 output에서 만들어진 bundle.js 적용, dist에 새로운 html 생성
      template: `./public/index.html`,
    }),
  ],
  // source-map을 설정하는 부분으로 에러가 발생했을 때 번들링된 파일에서 어느 부분에 에러가 났는지를 쉽게 확인할 수 있게 해주는 도구
  devServer: {
    port: 8080,
    //해당 경로의 파일이 변할때 리로딩하도록 설정
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    overlay: true,
    //모듈의 변화만 자동으로 로드하는 Hot Module Replacement 기능 활성화
    hot: true,
    //메모리 뿐만 아니라 파일도 만들것인지 설정'
    // writeToDisk: true,
    //프록시 설정 : 서버에 요청시 localhost가 아닌, korello.app에서 요청한걸로 인식하도록!
    proxy: {
      '/api': {
        target: 'korello.app',
        changeOrigin: true,
      },
    },
  },
};
```

### 삽질

---

- Webpack에 속성이 너무 많다.. 그래서 최소한으로만 일단 했다. 개발하면서 필요한 플러그인들이나 패키지는 추가 예정
  어떤역할인지 하나씩 공부하면서 설정하느라 시간이 걸렸다.
- 설정 이후 webpack dev server를 사용해 실행을 시켰는데
  "Cannot find module 'webpack/bin/config-yargs" 라는 에러 발생.

      해결 : webpack-cli 버전이 3.xx의 경우 webpack-dev-server라는 명령어로 서버를 실행시켜야 하지만 4.xx버전 이후부터는 webpack server라는 명령어로 실행시켜야했다.

- 웹팩 데브 서버는 웹팩 빌드와 다르다.
  빌드한 결과물이 메모리에 저장될 뿐, 파일로 생성되는것이 아니기 때문에 실제 배포를 위해서는 커맨드라인에서 webpack 명령어로 빌드를 해줘야한다.
- cra로 만든 리액트 프로젝트에서 `npm run eject`명령을 통해 웹팩 설정을 꺼내올 수 있었다. 직접 분석해보자라는 패기를 가지고 시작했지만 코드를 보고 포기했다..ㅎ
  나중에 수준이 높아지면 하나씩 뜯어봐야겠다.

