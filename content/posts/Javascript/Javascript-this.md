---
title: '[Javascript] this'
date: 2021-04-14
categories: ['Javascript']
tags: ['Javascript', '모던 자바스크립트 DeepDive']
draft: false
---



> 아래 내용은 모던 자바스크립트 DeepDive 22장 this를 학습하며 정리한 내용입니다.

<!--more-->

객체의 메서드는 객체의 프로퍼티를 참조하고 조작할 수 있어야 한다.<br>
객체 리터럴 방식으로 객체를 생성할 경우, 메서드를 호출하는 시점에는 이미 변수에 객체가 할당된 시점이기 때문에 참조가 가능하다.<br>
하지만 생성자 함수로 객체를 생성할 경우 생성될 인스턴스의 식별자를 모르기 때문에 참조가 불가능해진다.<br>
이러한 문제를 해결하기 위해 javascript에서는 this 식별자를 제공한다.

### this란?

---

- 자신이 속한 객체 또는 자신이 생성할 인스터스를 가리키는 **자기 참조 변수**다.
- 함수를 호출하면 arguments 객체와 this가 암묵적으로 함수 내부에 전달된다.
- **this 바인딩은 함수 호출 방식에 의해 동적**으로 결정된다.
  > ## 바인딩이란?
  >
  > 간단히 말해서 식별자와 값을 연결하는 작업이다.<br>
  > 변수의 선언의 관점에서 보면 변수명과 확보된 메모리를 연결하는 것으로 볼 수 있다.<br>
  > this 바인딩은 this와 this가 가리킬 객체를 연결하는 작업이다.

### 함수 호출 방식과 this 바인딩

---

### 1. 일반 함수 호출

- 기본적으로 전역객체가 바인딩 된다.
- strict mode를 사용할 경우 일반함수 내에서의 this에는 undefined가 바인딩된다.
- 메서드 내에서 정의한 중첩함수도 일반 함수로 호출되면 중첩함수 내의 this에는 전역객체가 바인딩된다.
  → 호출 방식에 따라 동적으로 동작하기 때문에.

  ```jsx
  const obj = {
    value: 100,
    foo() {
      console.log(this);
      function boo() {
        console.log(this);
      }
      boo();
    },
  };
  obj.foo();
  //obj
  //window

  //------------------ 중첩함수, 콜백함수내에서의 this를 호출한 객체로 바인딩하는 방법
  const obj = {
    value: 100,
    foo() {
      console.log(this);
      const that = this;
      function boo() {
        console.log(that);
      }
      boo();
    },
  };
  obj.foo();
  //obj
  //obj
  ```

### 2. 메서드 호출

- 메서드를 소유한 객체가 아닌, **메서드를 호출한 객체**가 this에 바인딩된다.
- 객체에 속해있는 메서드는 결국 독립적으로 존재하는 함수객체를 가리킬 뿐이다. 그렇기 때문에 자신을 호출한 객체를 this에 바인딩 하는 것.

  ```jsx
  const person = {
    name: 'ham',
    //getName은 식별자일 뿐, 실제 함수 객체는 독립되어 있는 객체다.
    getName() {
      console.log(this.name);
    },
  };

  const anotherPerson = {
    name: 'lee',
    getName: person.getName,
  };

  const windowPerson = person.getName;

  person.getName(); //'ham'
  anotherPerson.getName(); //'lee'
  windowPerson(); //'window.name을 콘솔에 찍는다'
  ```

- 프로토타입에서도 마찬가지로 동작한다.

### 3. 생성자 함수 호출

- 미래에 생성할 인스턴스가 바인딩된다.

### 4. apply / call / bind에 의한 호출

- Function.prototype의 메서드들이다.
- apply, call은 this에 바인딩 할 객체와 인수 리스트를 전달받아 호출한다.
  apply는 배열형태로, call은 인수를 나열하는 형태로 사용.
  대표적으로는 배열 메서드를 사용할 수 없는 유사배열 객체에 배열메서드를 사용할 경우다.
- bind는 호출까지는 하지 않기때문에 명시적으로 호출을 해야한다.
  bind는 this로 바인딩 할 객체만 인자로 받는다.

```jsx
function getBinding() {
  console.log(arguments);
  console.log(this);
}

const obj = { a: 1 };

getBinding.apply(obj, [1, 2, 3, 4]);
//Arguments[1,2,3,4]
//{ a : 1};
getBinding.call(obj, 1, 2, 3, 4);
//Arguments[1,2,3,4]
//{ a : 1};
getBinding.bind(obj);
```

### 요약

---

| 함수 호출 방식    | this 바인딩                             |
| ----------------- | --------------------------------------- |
| 일반 함수 호출    | 전역 객체                               |
| 메서드 호출       | 메서드를 호출한 객체                    |
| 생성자 함수 호출  | 생성자 함수가 생성할 인스턴스           |
| apply, call, bind | 해당 메서드의 첫번째 인자로 전달한 객체 |
