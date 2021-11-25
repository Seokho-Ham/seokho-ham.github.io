---
title: '[Javascript] 함수는 일급객체라는데, 일급객체란?'
date: 2021-03-03
categories: ['Javascript']
tags: ['Javascript', '모던 자바스크립트 DeepDive']
draft: false
---

Javascript를 제대로 이해하고 사용하는 개발자가 되기 위해 공부중입니다.

> 아래 내용은 모던 자바스크립트 DeepDive 18장을 학습하며 정리한 내용입니다.

<!--more-->

### 1. 일급 객체

---

- 아래는 일급 객체의 조건이다.
- 함수는 객체와 다르게 호출이 가능하며 함수 고유의 프로퍼티를 가지고 있다.

1. 무명의 리터럴로 생성이 가능하다. (런타임에 생성 가능)
2. 변수나 자료구조(객체, 배열 등)에 저장할 수 있다.

   ```jsx
   //1,2번 모두 해당.
   //이렇게 함수를 생성할 경우 런타임 이전에 increase라는 변수가 선언이 되고
   //런타임 시 함수가 생성 및 할당이 된다.
   const increase = function (num) {
     return ++num;
   };
   const obj = { increase };
   ```

3. 함수의 매개변수에 전달할 수 있다.

   ```jsx
   const makeCounter = function (func) {
     let num = 0;
     num = func(num);
     return num;
   };
   ```

4. 함수의 반환값으로 사용할 수 있다.

   ```jsx
   const makeCounter = function (func) {
     let num = 0;
     return function () {
       num = func(num);
       return num;
     };
   };
   let increaser = makeCounter(obj.increase);
   console.log(increaser());
   ```

### 2. 함수 객체의 프로퍼티

---

**데이터 프로퍼티**

1. length : 지정된 매개변수의 개수를 나타낸다.(arguments.length는 들어온 인자의 개수! 차이를 알아둘것!)
2. name : 함수의 이름을 나타낸다.
   - 함수의 이름이 없을 경우 - ES5 : 빈 문자열 / ES6 : 함수를 가리키는 식별자를 값으로 가짐
3. arguments

   - 매개변수로 받은 값들의 정보를 가진 arguments 객체 ⇒ 매개변수의 개수를 확정할 수 없는 **가변 인자 함수**를 생성할 때 유용하다.
   - arguments객체가 가진 callee는 호출한 함수 자신을 가리킨다.
   - **유사 배열 객체**이다. ⇒ **length 프로퍼티를 가지며 for 문으로 순회할 수 있는 객체**
   - ES6부터는 Rest 파라미터를 도입!! ⇒ 배열 메서드를 바인딩 없이 사용할 수 있게 됨.

   ```jsx
   const func1 = function () {
     console.log(arguments);
   };

   //Rest Parameter =>
   const func1 = function (...args) {
     args.forEach(el => console.log(el));
   };
   ```

4. caller

   - 자신을 호출한 함수를 가리킨다.

   ```jsx
   function func1(func) {
     return func();
   }
   function func2() {
     return func2.caller;
   }
   console.log(func1(func2)); //function func1(func){...}
   console.log(func2()); //null
   ```

5. prototype : 생성자 함수로 호출할 수 있는 함수 객체만 가지고 있는 속성.
   - 함수가 생성하게 될 인스턴스의 프로토타입 객체를 가리킨다.

**Object.prototype 객체의 프로퍼티를 상속받음**

- **proto** : [[Prototype]] 내부 슬롯이 가리키는 프로토타입 객체에 접근하기 위한 접근자 프로퍼티.
