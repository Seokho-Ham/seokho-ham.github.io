---
title: '[Javascript] 프로토타입(Prototype)'
date: 2021-03-05
categories: ['Javascript']
tags: ['Javascript', '모던 자바스크립트 DeepDive']
draft: false
---



> 아래 내용은 모던 자바스크립트 DeepDive 19장 프토토타입을 학습하며 정리한 내용입니다.

<!--more-->

자바스크립트는 명령형, 함수형, 프로토타입 기반 객체지향 프로그래밍을 지원하는 멀티 패러다임 프로그래밍 언어다.

- Java 와 C와 같은 클래스 기반 객체지향 언어가 가진 특징 : 캡슐화, 상속을 위한 키워드를 가지고 있다.
- Javascript는 그런게 없어서 OOP언어가 아니라고 오해를 받는다.
- But! **프로토타입 기반 OOP언어**다.

### OOP(객체지향 프로그래밍)

---

- 객체의 집합으로 프로그램을 표현하려는 프로그래밍 패러다임.
- 상태를 나타내는 **속성(Property)**, 상태를 조작하는 **동작(Method)**으로 구성된다.
- 추상화 : 다양한 속성중에서 프로그램에 필요한 속성을 간추려 내는 것.

  ```jsx
  //사람이 가진 속성들과 추상화.
  const person = {
    name: 'Seokho',
    age: 28,
  };
  ```

### 상속과 프로토타입

---

- 상속 : 특정 객체의 프로퍼티와 메서드를 다른 객체가 그대로 사용할 수 있는 것.
- Javascript는 프로토타입을 기반으로 상속을 구현한다.

```jsx
function Circle(radius) {
  this.radius = radius;
  this.getArea = function () {
    return Math.PI * this.radius ** 2;
  };
}
const circle1 = new Circle(5);
const circle2 = new Circle(10);
```

- 위의 코드로 작성할 경우, 생성한 각각의 객체가 getArea라는 메서드를 가지게 된다. ⇒ **코드의 중복이 발생!**
- 퍼포먼스에도 악영향을 주며, 메모리를 불필요하게 낭비하게 된다.

```jsx
function Circle(radius) {
  this.radius = radius;
}

Circle.prototype.getArea = function () {
  return Math.PI * this.radius ** 2;
};

const circle1 = new Circle(5);
const circle2 = new Circle(10);
```

- Circle 생성자 함수가 생성한 모든 인스턴스는 자신의 프로토타입(부모 객체 역할)인 Circle.prototype의 모든 프로퍼티와 메서드를 상속받는다.

### 프로토타입 객체

---

- 객체간의 상속을 구현하기 위해 사용한다.
- 모든 객체는 [[Prototype]]이라는 내부 슬롯을 가지며 값은 프로토타입의 참조다.
- 내부 슬롯에 저장 되는 프로토타입은 객체의 생성 방식에 따라 달라진다.
  - 객체 리터럴 방식에 의한 생성 : Object.prototype
  - 생성자 함수에 의한 생성 : 생성자 함수에 prototype 프로퍼티에 바인딩되어 있는 객체
- 인스턴스(만들어진 객체)에서는 \_\_proto\_\_를 통해 프로토타입에 접근할 수 있다.
- 생성자 함수에서는 prototype 프로퍼티를 통해 프로토타입에 접근할 수 있다.
- 프로토타입에서는 constructor 프로퍼티를 통해 생성자 함수에 접근할 수 있다.

```jsx
function Circle(radius) {
  this.radius = radius;
}
const circle1 = new Circle(5);
const circle2 = { radius: 5 };

console.dir(circle1);
console.dir(circle2);
```

**1. \_\_proto\_\_ 접근자 프로퍼티**

- 접근자 프로퍼티다. (자체적인 값을 가지지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 사용하는 접근자 함수로 구성된 프로퍼티) - \_\_proto\_\_을 사용해 프로토타입에 접근하면, 내부적으로 getter 함수를 호출해서 프로토타입을 가져온다.
- \_\_proto\_\_에 새로운 프로토타입을 할당하면 내부적으로 setter 함수를 호출해서 값을 저장한다.
- 객체가 직접 소유하는 프로퍼티가 아닌 Object.prototype의 프로퍼티다.
- \_\_proto\_\_를 사용해 프로토타입에 접근하는 이유는 상호 참조하는 구조를 만들지 않게 하기 위함이다.
  ⇒ 이렇게 될 경우 프로토타입 체인은 무한루프에 빠진다. - 코드내에서는 직접 사용하지 말것.

**2. prototype 프로퍼티**

- 함수 객체만이 소유하고 있으며 생성자 함수가 생성할 인스턴스의 프로토타입을 가리킨다.
- 생성한 인스턴스의 \_\_proto\_\_와 동일한 것들 가리키고 있다.

> \_\_proto\_\_ : 객체가 자신의 프로토타입에 접근하기 위해 사용
> prototype 프로퍼티 : 생성자 함수가 자신이 생성할 인스턴스의 프로토타입을 할당하기 위해 사용

**3. 프로토타입의 constructor 프로퍼티와 생성자 함수**

- prototype 프로퍼티로 자신을 참조하고 있는 생성자 함수를 가리킨다.

### 프로토타입 체인

---

- 객체의 프로퍼티에 접근시, 해당 객체가 가지고 있지 않다면 객체의 프로토타입에 접근해서 프로퍼티를 순차적으로 검색한다.
  ⇒ **프로토타입 체인이라고 한다.**

  ```jsx
  function Person() {
    this.name = 'coco';
  }
  const me = new Person();

  me.hasOwnProperty('name'); // true
  ```

  1. 먼저 스코프체인에서 me라는 객체를 검색.
  2. 전역에서 검색된 me 객체에서 hasOwnProperty 메서드를 검색.
  3. 없으면 me의 프로토타입에서 검색.
  4. 또 없으면 me의 프로토타입의 프로토타입에서 검색.

> 스코프체인 : 식별자를 검색하기 위한 메커니즘
> 프로토타입체인 : 상속과 프로퍼티를 검색하기 위한 메커니즘

### 오버라이딩 & 프로퍼티 섀도잉

---

1. **오버라이딩**
   - 상위 클래스가 갖고 있는 메서드를 하위 클래스가 재정의하여 사용하는 방식.
2. **프로퍼티 섀도잉**
   - 상속 관계에 의해 프로토타입의 프로퍼티가 가려지는 현상.

```jsx
function Person(name) {
  this.name = name;
}
Person.prototype.sayHello = function () {
  console.log(`Hello my name is ${this.name}.`);
};

const me = new Person('coco');

//sayHello 프로퍼티를 오버라이딩 했다.
me.sayHello = function () {
  console.log('hahaha');
};
```

### 프로토타입 교체

---

- 동적으로 상속관계를 변경할 수 있다.
- 프로토타입을 교체하게 되면 생성자 함수와의 연결이 끊어지기 때문에 constructor 프로퍼티에 생성자 함수를 다시 연결해줘야 한다.
- 생성자 함수에 의해 교체하게 되면 생성자 함수의 prototype은 교체된 프로토타입을 가리킨다.
- 인스턴스에 의해 교체하게 되면 해당 인스턴스의 프로토타입만 바뀐것이기 때문에 생성자 함수의 prorotype에 매핑해줘야한다.

```jsx
function Person(name){
	this.name = name
}
//생성자 함수에 의한 교체
Person.prototype = {...}

const me = new Person('coco');
// 인스턴스에 의한 교체
me.__proto__ = {...}
```
