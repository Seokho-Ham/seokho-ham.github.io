---
title: 'Webpack 학습하기'
date: 2021-05-19T17:51:52+09:00
categories: ['Frontend']
tags: ['Webpack']
draft: true
---


오늘은 Webpack에 대해 학습한 내용을 정리했습니다.

<br>

<!--more-->

## Webpack

---

- 웹 브라우저에서 Javascript로 처리하는 코드의 양이 증가.<br/>
- 코드의 유지보수 편의성을 위해 모듈로 나누어 관리하는 모듈 시스템이 필요하다.<br/>
- 하지만 JS 자체적으로 지원하는 모듈 시스템이 없다.(ES6부터 modules라는 자체 모듈 시스템 지원)<br/>
- 이런 한계를 극복하기 위해 사용하는 도구 중 하나가 webpack이다.

<br/>
<br/>

## Webpack이 필요한 이유

---

1. 파일 단위의 자바스크립트 모듈 관리의 필요성
   - 변수의 유효범위 겹침, 함수명 겹침 등의 문제를 해결하기 위함.
2. 웹 개발 작업 자동화 도구
   - 빌드 자동화
3. 웹앱 빠른 로딩 속도와 높은 성능
   - 모듈을 번들링함으로써 서버에 요청하는 파일 숫자를 줄임.
   - 필요한 자원은 그때 요청.

<br/>

## Webpack의 장점

---

1. JS 모듈화 가능하도록 만듬.<br/>
2. 로더 사용 가능.<br/>
3. 빠른 컴파일 속도.<br/>
4. Common JS 와 AMD 모두를 지원한다.<br/>

<br/>

## 모듈이란?

---

- 특정 기능을 가진 작은 코드 단위.→ 웹팩에서는 파일 하나하나가 모듈이라고 불린다.

  ex) math.js는 3가지 기능을 가진 모듈.

  ```jsx
  //math.js
  function sum(a, b) {
    return a + b;
  }

  function substract(a, b) {
    return a - b;
  }

  const pi = 3.14;

  export { sum, substract, pi };
  ```

<br/>

## 모듈 번들링이란?

---

- 웹 애플리케이션을 모듈들을 하나의 파일로 압축하는 동작.
- 빌드, 번들링, 변환 모두 같은 의미.

<br/>

## Webpack Concept

---

<h5>1. Entry</h5>

- 모듈을 번들링 하기 위해 필요한 최초 진입점.(JS 파일 경로)
- 웹앱의 전반적인 구조와 내용이 담겨있어야 한다.
- default는 `./src/index.js` 다.
- 멀티 페이지 애플리케이션의 경우 entry가 여러개일 수 있다.

```jsx
//webpack.config.js
{...
	entry : "./src/index.js"
...}

//index.js

import LoginView from './LoginView.js';
import HomeView from './HomeView.js';
import PostView from './PostView.js';

function initApp() {
  LoginView.init();
  HomeView.init();
  PostView.init();
}
initApp();
```

<br/>

<h5>2. Output</h5>

- 빌드가 완료된 후 결과물의 파일 경로.
- 객체 형태로 옵션을 추가해야한다.

```jsx
module.exports = {
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './dist'),
  },
};
```

- filename 속성에 넣을 수 있는 옵션
  1. 결과 파일 이름에 entry 속성을 표현하는 옵션
  2. 웹팩 내부적으로 사용하는 모듈 ID를 표현하는 옵션
  3. 빌드별로 고유 해시 값을 붙이는 옵션
  4. 모듈 내용을 기준으로 생성된 해시 값을 붙이는 옵션

<br/>

<h5>3. Loader</h5>

- 웹팩은 JS와 JSON 파일만 인식한다. 그렇기때문에 이외의 파일은 Loader를 사용행햐 한다.
- ex) css는 css loader을 사용
  - `test` : 로더를 적용할 파일 유형 (일반적으로 정규 표현식 사용)
  - `use` : 해당 파일에 적용할 로더의 이름
- 주로 사용하는 로더
  - `Babel Loader`, Sass Loader, File Loader, TSLoader
- 여러개의 로더가 적용될경우 오른쪽에서 왼쪽 방향순서로 적용된다.

```jsx
module.exports = {
	module: {
		rules : [
			{
				test : \/.css$/,
				use : ['css-loader']
			},
			{
				test : \/.scss$/,
				use : ['css-loader', 'sass-loader']
			}
		]
	}
}
```

<br/>

<h5>4. Plugin</h5>

- 추가적인 기능을 제공하는 속성. → 결과물의 형태를 바꾸는 역할.
- 생성자 함수로 생성한 객체 인스턴스만 추가될수있다.

```jsx
// webpack.config.js
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    //웹팩으로 빌드한 결과물로 html파일을 생성해주는 플러그인
    new HtmlWebpackPlugin(),
    //웹팩의 빌드 진행율을 표시해주는 플러그인
    new webpack.ProgressPlugin(),
  ],
};
```

<br/>

<h5>5. Mode</h5>

- 3가지 mode에 따라 실행 모드가 결정된다.
- development : 개발 모드 → 웹팩 로그나 결과물이 보여진다.
- production : 배포 모드 → 기본적인 파일 압푹 등의 빌드 과정이 추가된다.
- none : 모드 설정 안함

```jsx
module.exports = {
  mode: 'development' / 'production' / 'none',
};
```

- 모드에 따라 설정 바꾸기.

```jsx
//webpack.config.js
module.exports = (env) => {
  let entryPath = env.mode === 'production'
    ? './public/index.js'
    : './src/index.js';

  return {
    entry: entryPath,
    output: {},
    // ...
  }
}

// package.json
{
  "build": "webpack",
  "development": "npm run build -- --env.mode=development",
  "production": "npm run build -- --env.mode=production"
}
```

<br/>

<h4 style='color:#01c501'>References</h4>

---

- [Webpack 공식문서](https://webpack.js.org/)
- [Webpack Handbook](https://joshua1988.github.io/webpack-guide/)
