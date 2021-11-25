---
title: 'Class'
date: 2021-05-01T14:30:11+09:00
categories: ['Javascript']
tags: ['Javascript', '모던 자바스크립트 DeepDive', '클래스']
draft: true
---

Javascript를 제대로 이해하고 사용하는 개발자가 되기 위해 공부중입니다.

> 아래 내용은 모던 자바스크립트 DeepDive 24장을 학습하며 정리한 내용입니다.

<br>

<!--more-->

## Title

```js
class Person {
  constructor(name) {
    this.name = name;
  }
  sayHi() {
    console.log(`Hi my name is ${this.name}.`);
  }
  static sayHello() {
    console.log('Hello!');
  }
}
```

```js
const Person = class MyClass {
  constructor(name) {
    this.name = name;
  }
};
const me = new Person('coco');
me.name; //'coco'
```
