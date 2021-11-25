---
title: '[Javascript] 생성자 함수를 사용해 생성한 객체는 어떻게 다를까?'
date: 2021-03-02T15:11:54+09:00
categories: ['Javascript']
tags: ['Javascript', '모던 자바스크립트 DeepDive']

draft: false
---

Javascript를 제대로 이해하고 사용하는 개발자가 되기 위해 공부중입니다.

> 아래 내용은 모던 자바스크립트 DeepDive 17장을 학습하며 정리한 내용입니다.

<!--more-->

### 1. Object 생성자 함수

---

- new 연산자와 Object 생성자 함수를 함께 호출하면 빈 객체를 반환한다.
- 생성자 함수란? ⇒ new 연산자와 함께 호출하여 인스턴스(생성자 함수에 의해 생성된 객체)를 생성하는 함수를 말한다.

```jsx
//아래는 빌트인 객체
const obj = new Object(); //{}
obj.name = 'seokho'; //{name: 'seokho'}

const str = new String('Ham');
console.log(str); //'Ham'

const num = new Number(123);
console.log(num); //123

const bool = new Boolean(true);
console.log(bool); //true

const func = new Function('x', 'return x+1');
func(1); //2

const arr = new Array(1, 2, 3);
console.log(arr); //[1,2,3]
```

### 2. 생성자 함수

---

- 인스턴스를 생성하기 위한 템플릿(클래스)으로 동작하며 인스턴스를 초기화하는 역할을 한다.
- 일반 함수와 같이 정의하고 **new 연산자와 함께 사용하면 생성자 함수로 동작한다.**
  ⇒ new 연산자 없이 호출할 경우 일반 함수로 동작한다.
- 일반 함수와 형식적인 차이가 없기 때문에 첫글자를 대문자로 작성한다(파스칼 케이스).

```jsx
function Circle(radius) {
  this.radius = radius;
  this.getDiameter = function () {
    return 2 * this.radius;
  };
}
const circle1 = new Circle(5);
```

> this
> 객체 자신의 프로퍼티나 메서드를 참조하기 위한 자기 참조 변수. this 바인딩은 함수 호출 방식에 따라 동적으로 결정된다.
> **1. 일반 함수의 호출** : _전역 객체_  
> **2. 메서드로서의 호출** : _메서드를 호출한 객체_  
> **3. 생성자 함수로서의 호출** : _생성자 함수가 생성할 인스턴스_

<생성과정>

1. 암묵적으로 빈 객체가 생성된다. 빈 객체가 this에 바인딩된다. (런타임 이전에 실행된다.)
2. 인스턴스가 초기화된다.(함수 내의 코드가 한줄씩 실행된다)
3. 인스턴의 반환. 완성된 인스턴스가 바인딩 된 this가 반환된다.
   만약 명시적으로 다른 반환값을 주면 this는 무시된다. 원시값을 줄경우 원시값을 무시하고 this를 반환.
   생성자 함수 내에서는 return 값을 생략해야 하는 이유다.

```jsx
function Circle(radius) {
  //(1)
  //(2)
  this.radius = radius;
  this.getDiameter = function () {
    return 2 * this.radius;
  };
  //(3)
  return {}; // => this를 무시하고 빈 객체가 반환된다.
  return 123; // => 원시값이기 때문에 this가 반환된다.
}
const circle1 = new Circle(5);
```

### 3. 생성자 함수를 통해 생성한 객체의 특징

---

- 함수 선언문이나 함수 표현식으로 작성한 함수는 생성자 함수로 사용할 수 있다.
- 함수도 객체이기 때문에 프로퍼티와 메서드를 가질 수 있다. ⇒ 객체와 함수의 내부 메서드를 모두 가지고 있다.
- 내부메서드 : 함수를 호출할 경우 [[Call]], 생성자 함수로 사용할 경우 [[Construct]]이 호출되는 것이다.
  [[Call]]을 가진 함수 객체를 callable이라 부른다. ⇒ 모든 함수는 callable하다!
  [[Construct]]을 가진 객체를 constructor, 없으면 non-constructor(생성자 함수로 호출할 수 없는 함수)이라고 부른다.

<자바스크립트 엔진이 constructor과 non-constructor을 구분하는 방식>

- constructor : 함수 선언문, 함수 표현식, 클래스
- non-constructor : 메서드(ES6메서드 축약 표현), 화살표 함수

```jsx
//constructor
function foo() {}
const func1 = function () {};
const obj = {
  x: function () {}, //일반 함수로 정의되었기 때문에 메서드로 인정되지 않는다.
};

//non-constructor
const func2 = () => {};
const obj2 = {
  x() {},
};
```

### 4. new.target

---

- ES6부터 도입되었으면 생성자 함수가 new 연산자 없이 호출될 경우라도 생성자 함수로 동작할 수 있도록 도와주는 역할을 한다.
- constructor로 생성된 모든 함수 내에서는 지역변수와 같이 사용되며 **메타 프로퍼티**라고 부른다.
- new.target을 사용하면 new 연산자와 함께 생성자 함수로 호출 되었는지 확인할 수 있다.
- new 연산자를 사용할 경우 : new.target은 함수 자신을 가리킨다.
- new 연산자를 사용하지 않은 경우 : undefined 를 가진다.

```jsx
function Circle(radius) {
  if (!new.target) return new Circle(radius);
  this.radius = radius;
  this.getDiameter = function () {
    return 2 * this.radius;
  };
}

//ES6가 지원되지 않는 경우 => 스코프 세이프 생성자 패턴
function Circle(radius) {
  if (!this instanceof Circle) return new Circle(radius);
  this.radius = radius;
  this.getDiameter = function () {
    return 2 * this.radius;
  };
}
```
