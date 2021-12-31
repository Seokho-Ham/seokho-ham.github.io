---
title: 'React에 대해 알아보자 - 2편'
date: 2020-10-19T15:48:09+09:00
categories: ['React']
tags: ['React', 'Frontend']
draft: true
---

<br>
오늘은 Inflearn에 있는 김민준 님의 "누구든지 하는 React" 강의를 통해 학습한 부분을 정리합니다.

<!--more-->

## **State**

> 컴포넌트에서 가지고 직접 가지고 있는 상태.

- 반드시 setState 메서드를 통해 **값을 변경해야** 한다. (직접 변경은 불가!)
- constructor 내부에 설정할수도 있고, 필드에 state라는 객체를 설정해 사용할 수도 있다.
- Event Handling 메서드를 생성할 때 일반 함수로 만들 경우 해당 this가 undefined가 될 수 있다. 그렇기 때문에 constructor 안에서 this바인딩이 필요가 없다.
- **constructor** : 컴포넌트가 만들어질때 호출되는 함수.
- **super** : 부모 컴포넌트의 생성자 함수를 호출하는 함수. 부모 컴포넌트를 참조하기 위해. (반드시 선언 해줘야 constructor 내부에서 this를 사용할 수 있다.)

```jsx
class Counter extends Component {
  // (1)
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
  }
  // (2)
  state = { number: 0 };

  render() {
    return (
      <>
        <div>{this.state.number}</div>
      </>
    );
  }
}
```

<br>

## **setState**

> state를 변경시키는 메서드.

- 변경 시킬 state값만 객체 형태로 넣어주면 된다. -> 내부적으로 알아서 들어온 값만 변경 시킨다.
- 비동기적으로 동작한다.
- 인자에 객체 대신 함수를 넣어 사용할 수 있다.
- 업데이트 이후 실행시킬 함수를 두번째 인자로 넣어서 사용할 수 있다.
- 배열이나 객체의 경우 사본을 만들어 변경한 후 업데이트 해야한다.

```jsx
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
  }
  render() {
    return (
      <>
        <div>{this.state.number}</div>
        <button
          onClick={() => {
            //(1)
            this.setState({ number: ++number });
            //(2)
            this.setState(prevState => {
              return { number: prevState.number + 1 };
            });
            //(3)
            this.setState(prevState => {
              return { number: prevState.number + 1 };
            }, ()=>{
              console.log('업데이트 이후 실행되는 함수입니다.);
            });
          }}
        ></button>
      </>
    );
  }
}
```

<br>

## Event 관리

- 이벤트명은 카멜 케이스로 작성할 것.
- 실행할 함수 형태의 값을 전달한다.
- DOM 요소에만 이벤트를 설정할 수 있다.
- 함수 선언문 방식으로 메서드를 만들게 된다면 this 바인딩이 필요하다.<br>
  (this는 호출 시점에 따라 결정되기 때문에 바인딩을 하지 않으면 메서드와 this의 관계가 끊어지게 된다.)
- 화살표 함수를 사용하면 바인딩을 하지 않아도 된다.<br>
  (화살표 함수에서의 this는 선언시 정적으로 결정되기 때문에)

<br>

## **LifeCycle API**

> 컴포넌트가 브라우저 상에서 나타날 때, 업데이트 될 때, 사라질 때 사용할 수 있다.

<br>
<br>
<br>

### **1. Mounting** : 컴포넌트가 브라우저상에 렌더링 될 때

- **constructor** : 생성자 함수 → 컴포넌트가 만들어질 때 가장 먼저 시작된다.
  state 초기화 작업
- **getDerivedStateFromProps** : props로 받은 값을 state에 동기화 시킬 때 사용한다.
- **render** : 우리가 만들 돔, 내부의 태그에 전달할 값을 정의.
- **componentDidMount** : 렌더된 이후 외부 라이브러리를 사용하거나 ajax 처리할 때 보통 사용한다.

### **2. Updating** : 컴포넌트의 props, state가 변경되었거나 부모 컴포넌트가 리렌더링 될 때

- **shouldComponentUpdate** : 컴포넌트가 업데이트 되는 성능을 최적화 시키고 싶을때 사용.
  - 부모 컴포넌트가 리렌더되면 자식 컴포넌트들도 자동으로 리렌더 된다. (virtual dom에서만!) ⇒ 이런 성능도 최적화 시키고 싶을 때 사용하면 된다.
  - true or false를 통해 렌더 여부 또한 정할 수 있다.
  - nextProps, nextState 두가지의 인자를 받아서 사용한다.
- **getSnapshotBeforeUpdate** : render함수가 실행된 직후, 돔에 렌더링 되기 직전에 호출되는 함수.
  - 업데이트 되기 직전의 상태를 componentDidUpdate에서 받아올 수 있다.
- **componentDidUpdate** : 업데이트 된 이후 호출되는 함수
  - state가 바뀌었을 때 이전의 상태와 지금의 상태가 다를 때 어떤 작업을 설정 등등

### **3. Unmounting** : 컴포넌트가 브라우저에서 사라질 때

- **componentWillUnmount** : EventListener 제거 등 → 컴포넌트를 더이상 사용하지 않을 때의 동작을 지정 가능하다!

### **4. Error Catch**

- **componentDidCatch** : 렌더링 시 오류를 잡아주는 함수.
  - 오류가 발생할 수 있는 컴포넌트의 부모 컴포넌트에서 사용해야한다.
  - 파라미터로 error, info를 받아올 수 있다. 에러가 발생한 위치, 에러의 내용!

<br>

## **실습**

**npx create react app <폴더명>**: react app 생성

- 따로 설정하기 위해서는 npm eject 명령어를 입력하면 된다. → 설정파일이 꺼내진다.

_**"reactjs code snippets"**_ : React 앱에서 코드를 더 수월하게 작성할 수 있도록 도와주는 extension.

- rcc(클래스), rsc(함수형) 입력하면 컴포넌트 형식을 만들어줌.

**_npm start_** → 개발 서버 시작

**_npm run build_** → 배포 시 사용

<br>

### **인풋 상태 관리하기**

**_e.target_** ⇒ 이벤트가 발생하는 태그

- 여러개의 인풋이 있을경우 인풋별로 name을 설정

- form 태그에서는 submit 버튼을 누르면 새로고침이 된다.

- e.preventDefault : 실행되는 이벤트를 취소.

자식 컴포넌트에서 부모 컴포넌트에게 값 전달 과정.

1. handleCreate 메서드 생성
2. 메서드를 props로 전달.
3. setState 메서드로 값을 변경해야하는데 불변성을 지켜줘야 하기 때문에 기존의 값에 추가하는게 아닌 기존의 값을 포함한, 새로운 배열을 만들어야한다

<br>

### **배열 렌더링**

key : 여러 데이터를 렌더링할 때 최적화 시키는 역할.

- key 가 없으면 중간에 데이터가 추가되거나 삭제되면 각 태그의 데이터가 하나씩 당겨지거나 밀리는 등 바뀐다.
- key값이 있으면 고유한 값이 있는 태그가 그저 생성되고 삭제되는 방식으로 동작한다! ⇒ 더 효율적.

