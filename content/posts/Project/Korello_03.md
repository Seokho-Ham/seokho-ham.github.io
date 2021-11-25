---
title: '[Korello 프로젝트] Refactoring Day3'
date: 2021-07-26T15:48:09+09:00
categories: ['사이드 프로젝트']
tags: ['Javascript', 'React']
draft: false
---

Korello 개발 3일차의 기록

<br>

<!--more-->

## 카카오 로그인 동작 원리

Korello는 카카오 로그인을 사용하여 로그인을 구현했다. 하지만 대부분의 작업은 서버에서 이루어지기 때문에 내가 직접 관여하는 부분은 적다.<br>
그래서 동작원리를 명확하게 이해하기 위해 kakao developers 사이트를 통해 학습했다.

두가지 방식으로 나뉜다. 카카오 sdk를 사용한 방식과 RestAPI를 사용한 방식. 이중에서 Korello는 RestAPI방식을 사용했다.

<br>

<br><br>

### 동작 원리

1. 유저가 카카오 로그인 버튼을 누르면 로그인 페이지로 이동한다.
2. 로그인 정보가 맞을 경우 카카오 인증 서버에서 Korello 서버로 인증코드를 전송한다.
3. Korello서버에서는 해당 인증코드를 가지고 카카오 인증서버에 토큰을 요청한다.
4. 카카오 서버에서는 코드를 확인한 후, 일치할 경우 토큰을 반환한다.
5. Korello 서버는 해당 토큰으로 사용자 정보를 받아온 후, 사용자 정보를 사용해 자체 토큰을 생성해 프론트로 전송한다.

<br>

## global styles

- 목업 디자인 및 각 화면별 레이아웃 작업
- styled-components에서 전역 스타일 설정 → 중복되는 속성설정을 줄일 수 있다.

  - createGlobalStyle 사용. 최상위 컴포넌트에 컴포넌트 작성.

  ```jsx
  import {createGlobalStyle} from 'styled-components';

  const GlobalStyle = createGlobalStyle`
  	...
  `

  // App.js

  return(
  <div>
  	<GlobalStyles/>
  	...
  </div>
  ```

<br>

## 삽질

- react-router-dom 사용시 브라우저에서 해당 url로 get 요청을 보내 not found화면이 나왔다.

  해결 : webpack devserver에 historyApiFall 옵션을 true로 설정.

  - historyApiFall이란 : HTML5의 History API를 사용하는 경우에 설정해놓은 url 이외의 url 경로로 접근했을때 404 responses를 받게 되는데 이때도 index.html을 서빙할지 결정하는 옵션이다.<br><br>
    > react-router-dom이 내부적으로 HTML5 History API를 사용하므로 미지정 경로로 이동했을때, 있는 경로지만 그 상태에서 refresh를 했을때와 같은 경우에도 애플리케이션이 적절히 서빙될 수 있어서 유용한 옵션이다.<br><br>

- url에 파라미터를 붙이면 notfound 반환..

  - webpack.config.js 에 output에 `publicpath : '/'` 속성을 추가해주니까 해결.

