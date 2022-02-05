---
title: '함수형 프로그래밍 (Functional Programming)'
date: 2021-06-03T15:34:20+09:00
categories: ['Javascript']
tags: ['Javascript', '함수형 프로그래밍']
draft: false
---

함수형 프로그래밍에 대해 학습하고 정리한 글입니다.

<br>

<!--more-->

### 프로그래밍 패러다임

---

프로그래밍 방식은 크게 2가지로 나눌 수 있다.<br>
명령형 프로그래밍과 선언형 프로그래밍이다.

#### 명령형 프로그래밍 : 어떻게 동작을 할것인지 단계를 차례대로 작성하는 방식.

- 절차지향 프로그래밍, 객체지향 프로그래밍
- 주로 구문을 사용한다. ex) if, switch, for...

```jsx
const arr = [1, 2, 3, 4, 5];
const addOne = arr => {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr[i] + 1;
  }
  return result;
};
addOne(arr); // [2,3,4,5,6];
```

<br>

#### 선언형 프로그래밍 : 동작 흐름을 작성하기보다는 데이터를 사용해 무엇을 할것인지를 작성하는 방식.

- 함수형 프로그래밍
- 주로 표현식을 사용한다. ex) 함수 호출, 연산자...

```jsx
const arr = [1, 2, 3, 4, 5];
const addOne = arr.map(el => el + 1); //[2,3,4,5,6]
```

<br>

### 함수형 프로그래밍이란?

---

### 순수함수를 사용하여 데이터의 불변성을 지키고, 사이드 이펙트를 방지한 소프트웨어를 만드는 프로그래밍 방식

<br>

### 반드시 알아야 할 개념

---

1. **순수 함수(Pure Function)**
   - 외부의 상태값에 의존하거나 변경하지 않는 함수
   - 동일한 input에 동일한 output을 반환하는 함수

<br>

2. **불변성(Immutable)**
   - 전달된 외부의 데이터를 변경하는 것이 아닌, 새로운 결과값을 만들어서 반환해야한다.
   - 함수형 프로그래밍에서는 이런 불변성을 꼭 지켜야한다.

<br>

3. **비상태(Stateless)**
   - 불변성과 비슷한 맥락으로 외부의 상태를 참조하고 있으면 안된다.

<br>

### 함수형 프로그래밍의 장점

---

1. 코드가 간결해지며 예측이 가능해진다.

2. side effect를 방지할 수 있다.

- side effect : 함수를 호출하면 상태가 변경되거나 예기치 못한 에러가 발생하는 등의 현상
- 대표적인 사이드 이펙트 : 외부 변수, 객체의 속성 수정

<br>

### 함수형 프로그래밍의 특징

---

1. 선언형 프로그래밍이다.

<br>

2. 함수를 값으로 바라본다.
   - Javascript에서 함수는 1급 객체다.
   - 즉, 함수를 인자로 여기거나, 리턴값으로 반환하거나, 할당할 수 있다.
   - 결과값이 예측이 되기때문에 값처럼 여기고 사용한다.

<br>

3. 고차함수를 사용한다.
   - 다른 함수를 인자로 받아 결과를 내거나 함수를 반환하는 함수를 말한다.
   - 예를 들어서, Array의 map메서드가 있다. map메서드는 인자로 함수를 받는다.

<br>

### Javascript를 사용해 만든 예시

---

```js
const users = [
  { name: 'user1', age: 16, address: '강남구' },
  { name: 'user2', age: 20, address: '노원구' },
  { name: 'user3', age: 12, address: '노원구' },
  { name: 'user4', age: 32, address: '강남구' },
  { name: 'user5', age: 45, address: '강동구' },
  { name: 'user6', age: 37, address: '강서구' },
  { name: 'user7', age: 30, address: '노원구' },
  { name: 'user8', age: 29, address: '강북구' },
  { name: 'user9', age: 27, address: '강남구' },
  { name: 'user10', age: 28, address: '서초구' },
];

// 요구사항 : 나이가 20살 이상인 사람들 중 주소가 노원구인 사람들의 이름을 나이가 적은 순서대로 배열에 담아 반환하라

const result = users
  .filter(el => el.age >= 20 && el.address === '노원구')
  .sort((a, b) => a - b)
  .map(el => el.name);

console.log(result);
```
