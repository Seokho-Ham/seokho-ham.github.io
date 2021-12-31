---
title: 'Redux에 대해 알아보자!'
date: 2021-02-09T15:48:09+09:00
categories: ['Redux']
tags: ['Redux', 'Frontend']
draft: true
---


<br>
오늘은 Redux에 대해 학습한 내용을 정리합니다.

<!--more-->

> _이 글은 Redux 공식문서와 NaverD2 블로그의 내용을 학습하며 정리한 내용입니다._

React에서는 각 컴포넌트마다 state가 존재하며, 자식 컴포넌트에서 state에 접근하기 위해서는 props를 통해 넘겨주는 방법밖에 없다. 작은 프로젝트에서는 컴포넌트 구조가 복잡하지 않기 때문에 큰 어려움이 발생하지 않을 수 있지만, 규모가 커질수록 props를 계속 내려주는것이 어려워지고 동시에 유지보수도 어려워진다. 또한, 해당 state를 사용하지 않는 컴포넌트를 거쳐서 가야한다. (_props drilling이라도도 표현한다_)
<br><br>
이런 어려움을 해결하는 방법은 ContextAPI, Redux, MobX 등 여러 라이브러리가 있지만 오늘은 Redux에 대해서 글을 써보려고 한다.
<br><br>

### Redux란?

---

상태관리 라이브러리다.

### 왜 사용하는가?

---

앱의 규모가 커질수록 관리해야할 데이터가 많아진다. 하지만 여러 컴포넌트를 관리하는데 가장 아래에 있는 컴포넌트에게 데이터를 넘겨주기 위해서는 중간 컴포넌트를 모두 거쳐야하는 단점이있다.
<br><br>
리덕스를 사용하면 스토어라는 데이터 저장소에서 상태관리를 따로 하기 때문에 어떤 위치에서든 그 상태값에 직접적으로 접근할 수 있게 된다.

- 코드가 깔끔해진다.
- 유지보수가 편하다.

### 작동원리

---

1. ui에서 특정 이벤트(데이터의 변경 요청)가 발생한다.
2. 액션생성자를 통해 액션이 생성된다.
3. 액션이 디스패치 함수를 통해 스토어에 전달된다.
4. 액션의 타입에 따른 리듀서가 작동한다.
5. 리듀서에서 변경된 state를 반환한다.
6. 구독되어 있는 컴포넌트에 state가 전달된다.
7. 변경된 state가 뷰에 렌더링된다.

- Redux의 흐름에서 미들웨어를 사용할 수 있다.
  (여기서의 미들웨어란 리듀서에 가기전 액션을 조작하는 작업을 의미한다. 보통은 외부 API에 데이터를 받아오는 작업 등을 한다.)

### 개념

---

### 1. Action

- 앱의 저장소로 보내는 데이터 묶음. ⇒ 이벤트의 종류와 데이터를 스토어에 보내는 역할.
- 객체 형태로 되어있다.
- 반드시 type이라는 키를 가지고 있어야한다. 보통 type은 문자열 상수로 정의.(todos/todoAdded 과 같은 형식)
- 데이터는 보통 payload에 전달한다.
- 보통은 액션생성자를 사용하는것이 일반적이다.
- **`바인딩 된 액션 생성자를 사용하는 방법도 있다`.**

```jsx
//action types
const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'
//액션 생성자
function onIncrement(){
	return {
		type : INCREMENT,
		payload : 1,
	}
}
function onDecrement(){
	return {
		type : DECREMENT,
		payload : 1,
	}
}
//바인딩 된 액션 생성자
const boundOnIncrement = () => dispatch(onIncrement())
****
```

### 2. Reducer

- 이전 상태와 액션을 받아와 새로운 상태를 반환한다. ⇒ eventListener과 같은 역할
  - 인수 변경 금지
  - API 호출, 라우팅 전환과 같은 사이드 이펙트 금지
  - Date.now, Math.random과 같은 순수하지 않은 함수 호출 금지.
  - **배열이나 객체형식의 데이터를 수정할 경우 이전에 있던 엘리먼트와 혼합해 새로운 배열 혹은 객체를 반환해야한다.**

```jsx
const initialState = {
  number: 0,
};

function counter(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...initialState, number: state.number + action.payload };
    case 'DECREMENT':
      return { ...initialState, number: state.number - action.payload };
    default:
      return state;
  }
}
export default counter;
```

### 3. Store

- 데이터를 저장하는 저장소
- getState()를 사용해 상태에 접근
- dispatch(action)를 사용해 상태를 수정
- subscribe(listener)를 통해 리스너 등록

```jsx
//index.js(앱의 최상단)

import { createStore } from 'redux';
import counter from './reducers';

//스토어를 만드는 작업.
//subscribe, dispatch와 같은 메서드를 가진 객체를 반환한다.
let store = createStore(counter);
```

### 4. Dispatch

- 스토어가 가지고 있는 상태 수정 메서드.
- dispatch 메서드의 인자로 액션을 넣으면 데이터를 업데이트 할 수 있다.

```jsx
store.dispatch(액션);
```

### ETC(react-redux 모듈 사용)

---

combineReducer() : 여러개의 리듀서 함수를 인자로 받아 하나의 리듀서 함수로 변환해준다.

- 호출 시 내부의 모든 리듀서를 호출하고 결과를 모아서 하나의 상태 객체로 바꿔준다.

<br><br>

Provider : react-redux 라이브러리에 내장되어 있는 컴포넌트. store을 쉽게 연동할 수 있도록 돕는다.

- App을 Provider로 묶고 props로 store을 넘겨주면 앱에서 store에 접근할 수 있는 권한이 생긴다.
- connect로 감싸져있는 컴포넌트에서는 모두 접근 가능하다.

```jsx
import {Provider} from 'react-redux';
import { createStore } from 'redux'
import reducers from './reducers';
const store = createStore(reducers);

ReactDOM.render(
<Provider store={store}>
	<App/>
</Provider>,
document.querySelector('#root'))
);
```

<br>

connect 메서드 : ReactContainer을 Redux에 바인딩하는데 사용한다.

- connect 이후 컴포넌트에서 컨테이너를 렌더링하면 된다.

```jsx
import React from 'react';
import Counter from '../Counter';
import * as actions from '../actions/';
import { connect } from 'react-redux';

//스토어의 state를 컴포넌트에게 props로 넘겨주는 메서드
const mapStateToProps = state => ({
  text: state.inputHandler.text,
  value: state.counter.value,
});
//액션 함수들을 props로 넘겨주는 메서드
const mapDispatchToProps = dispatch => ({
  onIncrement: () => dispatch(actions.increment()),
  onDecrement: () => dispatch(actions.decrement()),
  onUserIncrement: text => dispatch(actions.userIncrement(text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

### React와 함께 사용할 때 기본 구조

---

**프리젠테이셔널 컴포넌트** 와 **컨테이너 컴포넌트**로 나뉜다.

1. 프리젠테이셔널 컴포넌트
   - 뷰만을 담당하는 컴포넌트
   - DOM 엘리먼트와 스타일을 가지고 있다.
   - store에는 직접적인 접근 권한이 없으며 props로만 가져올 수 있다,

<br><br>

2. 컨테이너 컴포넌트
   - DOM엘리먼트는 감싸는 용도로만 사용한다.
   - 상태를 관리하는 컴포넌트.

<br><br>

폴더 구조

- components : 프리젠테이셔널 컴포넌트를 담는다.
- reducers : 리듀서들을 담는다.
- actions : 액션들을 담는다.
- store : 보통 index.js 하나만 존재하며, 비동기 처리등의 미들웨어를 작성한다.

---

비동기 작업은 redux-thunk, redux-saga 라는 라이브러리를 사용한다고 하는데 조금 더 학습한 후 따로 작성해야겠다.

