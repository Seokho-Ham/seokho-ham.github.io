---
title: 'React Hooks를 알아보자!'
date: 2021-02-05T15:48:09+09:00
categories: ['React']
tags: ['React-Hooks', 'Frontend']
draft: true
---


<br>
오늘은 React에 대해 학습한 내용을 정리합니다.

<!--more-->

> _이 글은 React 공식문서의 Hook 부분을 학습하며 정리한 내용입니다._

**React 16.8**버전부터 Hook이 추가 되었다.<br>
Hook이 나오기 전에는 함수형 컴포넌트에서 할 수 있는 작업은 한계가 있었다. 특히 상태관리와 생명주기 메서드의 사용이 불가능 해서 대부분의 컴포넌트는 클래스 컴포넌트로 작성되었다.
<br><br>
하지만 Hook의 도입은 useState, useEffect등의 메서드를 통해 함수형 컴포넌트에서도 상태관리를 할 수 있도록 만들었다. 지금부터 React Hook에 대해 학습한 내용을 정리해본다.

### Hook이란?

---

함수 컴포넌트 내에서 state와 생명주기 기능을 연동할 수 있게 해주는 함수

### Hook의 장점

---

1. 상태관리와 관련된 로직을 컴포넌트로부터 분리 및 재사용할 수 있다.
2. 클래스 컴포넌트에 비해 직관적이며 복잡하지 않다.

### Hook의 규칙

---

1. 컴포넌트의 최상위에서만 Hook을 호출해야 한다.
   - React는 hook의 호출 순서에 의지한다
2. React 함수 내에서만 호출해야 한다.(일반 JS 함수에서는 호출하면 안된다.)

### useState

---

- 컴포넌트에 **state**와 **state를 업데이트 하는 메서드**를 주는 hook이다.
- 문법 : const [state, state를 업데이트 하는 메서드] = useState(초기값);
  - state와 state를 업데이트하는 메서드를 가진 배열이 생성된다.
  - 배열 구조 분해 문법을 사용해서 변수명을 자유롭게 작성할 수 있다.
- 하나의 컴포넌트 내에 여러개의 state hook을 사용할 수 있다. (클래스 컴포넌트처럼 하나의 state 객체안에 모든 값을 가지고 있지 않는다.)
- this.setState 와의 차이
  1. 이전의 state값에 새로운 값을 합치지 않는다는 점이다.
  2. 인자가 객체일 필요가 없다.

```jsx
import React, { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);
  const onClickHandler = () => {
    setCount(count + 1);
  };
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={onClickHandler}>Click</button>
    </div>
  );
};
```

### useEffect

---

클래스 컴포넌트에서는 사이드 이펙트를(외부 api를 통해 데이터를 가져오거나, dom을 직접 조작하는 작업) 모두 componentDidMount와 같은 생명주기 메서드 내에서 사용했다.
<br><br>
React Hooks에서는 useEffect라는 메서드를 사용해서 사이드 이펙트를 동작하도록 한다.<br>
(기존의 생명주기 메서드와 동일한 목적으로 사용하지만 하나의 API로 통합된것이다.)

- 문법 : useEffect(func, 의존값);
- 컴포넌트가 렌더링 된 이후, 실행해야 할 함수가 useEffect의 인자로 들어간 함수다.
- 첫 렌더링에만 실행되도록 하려면 빈배열을 의존값에 넣으면 된다.
- 의존값이 변할때만 실행되도록 하려면 배열안에 의존값을 넣어서 인자로 넣으면 된다.
- 하나의 컴포넌트 내에서 여러개의 useEffect를 사용할 수 있다.
- 사이드 이펙트를 해제하려면 useEffect 함수 내에서 return을 통해 해제하면 된다.
  - clean up 이 실행되는 시점은 컴포넌트가 언마운트 될때, effect가 다시 실행되기 전이다.
  - 언마운트 될때만 실행시키고 싶으면 2번째 인자로 배열을 넣어주면 된다.

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

	const onClickHandler = ()=>{
		setCount(count+1);
	}

	// componentDidMount, componentDidUpdate와 비슷합니다
  useEffect(() => {
    // 브라우저 API를 이용해 문서의 타이틀을 업데이트합니다
    document.title = `You clicked ${count} times`;
		return (()=>{...이펙트 해제},[])
  },[count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={onClickHandler}>
        Click me
      </button>
    </div>
  );
}
```

### useReducer

---

현재상태와 업데이트에 필요한 정보가 담긴 액션값을 전달받아 새로운 상태를 반환하는 함수다.

- 상태를 변경하는 로직을 외부로 뺄 수 있다.
- 새로운 상태를 만들때는 반드시 불변성을 지켜줘야 한다.
- 첫번째 인자는 리듀서 함수, 두번째 인자는 리듀서의 기본값을 넣어준다.

```js
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { value: state.value + 1 };
    case 'DECREMENT':
      return { value: state.value - 1 };
    default:
      return state;
  }
}
const Counter = () => {
  const [state, dispatch] = useReducer(reducer, { value: 0 });
  return (
    <div>
      <div>{state.value}</div>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
    </div>
  );
};
```

### useMemo

---

컴포넌트 내부에 특정 연산을 담당하는 로직이 있다고 가정했을때, 연산값에는 영향을 주지 않는 정보가 업데이트 될때도 계속 연산을 실행한다면 이것을 메모리의 낭비일것이다.
useMemo를 사용한다면 이런 현상을 방지할 수 있다.
연산값에 영향을 주는 데이터가 변경이 되었을때만 실행되고, 아니라면 이전에 가지고 있던 연산값을 그대로 사용하는 방식이다.

```js
const avg = useMemo(() => getAverage(list), [list]);
```

- list의 값이 바뀔때만 첫번째 인자로 들어온 함수가 실행되도록 작동한다.

### useCallback

---

useMemo와 비슷한 기능으로, 주로 렌더링 성능의 최적화를 위해 사용한다.
useMemo는 연산값을 기억하고 있었다면 useCallback은 생성한 함수 자체를 기억하고 있다.
일반적으로 컴포넌트가 리렌더링 되면 그 안에 생성한 함수들은 재생성 되는데, useCallback을 사용해 함수를 만들경우 의존값으로 들어온 데이터가 바뀌지 않는 이상 기존에 만들어두었던 함수를 재사용한다.

- 빈 배열을 넣을 경우 렌더링 시 만든 함수를 계속 재사용한다.
- 상태값에 의존하고 있는 함수라면 두번째 인자에 반드시 넣어줘야 한다.

```js
const onChange = useCallback(e => {
  setNumber(e.target.value);
}, []);
```

### useRef

---

함수형 컴포넌트에서 더 쉽게 ref를 사용할 수 있도록 하는 함수.

- 컴포넌트 내에서 로컬 변수를 사용할 때 활용할 수 있다.
- 이렇게 사용할 경우 num의 값이 변경되어도 리렌더링 하지 않는다.

```js
const num = useRef(1);
```

### Custom Hook

---

서버에 요청을 보내는 로직이 있다고 가정해보자. 앱의 규모가 커지면 요청을 보내는 코드가 여러개의 컴포넌트에서 필요할 것이다. <br>하지만 그 로직을 모든 컴포넌트에 복사 붙여넣기 하는것은 비효율적이다.
<br><br>
Custom Hook을 사용하면 위와 같은 불편함을 해결할 수 있다. 자신만의 훅을 만드는 것이다.

```jsx
const useGetApi = ()=>{
	const [data, setData] = useState('');
	const [code, setCode] = useState(0);
	const [loading, setLoading] = useState(false);

	useEffect(()=>{
		const getData = async ()=>{
			setLoading(true);
			let {data} = await axios.get(url);
			if(data.result_body){
				setData(data.result_body;
			}
			setCode(data.result_code);
			setLoading(false);
		}

		getData();
	},[])

	return [data, code, loading];
}
```

위 예시는 서버에 get요청을 보내는 Hook이다. 이렇게 CustomHook을 사용하면 필요한 컴포넌트에서 임포트해서 사용할 수 있게된다.
<br><br>
CustomHook의 특징

- use로 시작해야 한다.
- 각각 다른 컴포넌트에서 사용할때 개별적인 state와 effect를 가진다.

---

여기까지 React Hooks의 핵심 개념들을 정리해봤다.
<br>
useCallback, useContext, useMemo와 같은 다른 훅들은 직접 사용해보고 따로 정리해보려고 한다.

### References

---

- [React 공식문서](https://ko.reactjs.org/docs/hooks-reference.html)
