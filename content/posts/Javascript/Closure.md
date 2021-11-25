---
title: '[Javascript] 클로저(Closure)'
date: 2021-04-23T13:07:36+09:00
categories: ['Javascript']
tags: ['Javascript', '모던 자바스크립트 DeepDive', '클로저']
draft: false
---

Javascript를 제대로 이해하고 사용하는 개발자가 되기 위해 공부중입니다.

> 아래 내용은 모던 자바스크립트 DeepDive 24장을 학습하며 정리한 내용입니다.

<br>

<!--more-->

## 클로저란?

---

> 함수와 함수가 선언된 렉시컬 환경(상위 스코프)의 조합

처음 보면 이게 무슨 말인가 싶다. 하지만 실행 컨텍스트의 개념을 먼저 알고 학습하면 금방 이해가 될 것이다.
위의 정의에서 핵심은 "함수가 선언된 렉시컬 환경"이다.

<br>

먼저 알아두어야 할것은 자바스크립트에서는 렉시컬 스코프를 따른다.
렉시컬 스코프란, 함수가 선언되는 시점에 스코프가 정해지는 것이다.

```js
const x = 1;

function outer() {
  const x = 10;
  function inner() {
    console.log(x);
  }
  return inner;
}

const innerFunc = outer();
innerFunc();
```

위의 코드를 보면 outer함수가 선언되는 시점은 전역코드의 실행,
inner 함수가 선언되는 시점은 outer함수 코드가 실행될때다.
즉, **전역 스코프 > outer > inner** 꼴이 되는것이다.

이번에는 이전 글에서 알아본 실행 컨텍스트의 개념을 가져와 코드의 실행 순서를 한번 보자.

#### 1. 전역 코드의 평가 단계가 진행된다.

- 여기서 변수 x와 innerFunc, outer라는 함수가 선언된다.

#### 2. 전역 코드의 실행 단계가 진행된다.

- x에는 1이 할당되고 innerFunc에는 outer 함수를 호출한 값이 할당된다.

#### 3. outer 함수의 호출이 이루어졌으니 outer함수의 실행 컨텍스트로 넘어간다.

- 평가 단계에서 변수 x와 함수 inner가 선언되고 실행까지 마친다.

#### 4. 이후 전역코드로 돌아와 innerFunc 함수를 실행한다.

여기서 보면 분명 outer함수는 중첩함수 inner보다 먼저 실행되고 먼저 종료되어 콜스택에서 사라진 상태다. 하지만 inner에서는 outer에서 선언한 x값을 콘솔에 출력한다.

앞에서 사용한 정의에 함수명을 대입해보면

> inner 함수와 inner함수가 선언된 시점의 렉시컬 환경의 조합

이 된다.
이 말은 곧 inner함수가 outer함수 내의 상태를 기억하고 있다는 의미다.

이렇게 외부함수보다 생명주기가 더 긴 중첩함수이며, 외부함수의 변수를 참조하고 있는 함수를 **클로저** 라고 부른다.

그리고 클로저 내에서 참조하고 있는 외부함수의 변수를 다른 이름으로 **자유 변수**라고 부른다.

##클로저는 언제 사용할까?

---

클로저의 사용 목적은 다음과 같다.

- 상태를 안전하게 변경하고 유지하기 위해.
- 상태를 은닉하고 특정 함수에게만 상태 변경을 허용하기 위해.

아래 코드는 대표적인 예시다.

```js
function counter() {
  let num = 0;

  return {
    increase() {
      console.log(num++);
    },
    decrease() {
      console.log(num--);
    },
  };
}
const counter1 = counter();
counter1.increase();
counter1.increase();
counter1.decrease();
counter1.decrease();
```

사용자는 counter 내부에 num에는 직접적으로 접근하거나 수정할 수 없다.
오직 increase, decrease 메서드로만 접근할 수 있다.

이런식으로 정해진 방식 이외의 방법으로 인해 예기치 못한 변경을 막기 위해 클로저를 사용한다.
