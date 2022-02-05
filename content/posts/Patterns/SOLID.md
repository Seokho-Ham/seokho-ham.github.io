---
title: "SOLID"
date: 2021-11-23T12:48:09+09:00
categories: ['패턴']
tags: ['SOLID 원칙']
featuredImage: /images/solid-principle.jpeg
draft: false
---


객체지향 설계에서 지켜야 할 5가지 원칙을 말하며 시스템에 변경사항이 발생해도 유연하게 대처하고 확장성 있는 구조를 설계하기 위한 원칙이다.

<!--more-->

### 1. 단일 책임 원칙(SRP / Single Responsibility Principle)

---

- 객체는 **하나의 책임만 가져야 한다.**
- 응집도는 높게, 결합도(의존성)는 낮게.
- ex) Calculator 객체는 연산에 대한 책임만 있을뿐, 연산 후의 동작까지 가져서는 안된다.

<br>

### 2. 개방 - 폐쇄 원칙(OCP / Open-Closed Principle)

---

- 기존의 코드를 변경하지 않으면서 기능의 확장이 가능하도록 설계가 되어야 한다.
- 확장에 대해서는 open, 수정에 대해서는 close
- 캡슐화를 통해서 **같은 기능을 인터페이스에서 정의**해서 사용하는 방법을 통해 구현할 수 있다.

<br>

### 3. 리스코프 치환 원칙(LSP / Liskov Substitution Principle)

---

- 자식 클래스는 최소한 자신의 부모 클래스에서 가능한 행위는 수행할 수 있어야 한다는 설계 원칙
- 자식 클래스는 부모 클래스의 책임을 재정의하지 않고, 확장만 하도록 구현해야 한다.
  ⇒ **오버라이드를 가급적 피해라**

<br>

### 4. 인터페이스 분리 원칙(ISP / Interface Segregation Principle)

---

- 하나의 거대한 인터페이스보다 **여러개의 구체적인 인터페이스**로 분리하는 원칙
- 인터페이스의 단일 책임 원칙이라고 생각할 수 있다.
- ex) Car 인터페이스에 경적울리기, 이동하기 기능이 있다면 경적울리기, 이동하기를 각각의 인터페이스로 만드는 것.

<br>

### 5. 의존 역전 원칙(DIP / Dependency Inversion Principle)

---

- 의존 관계를 맺을 때, **변화하기 쉬운것**보다 **변화하기 어려운 것**에 의존해야 한다는 원칙
- 구체적인 클래스보다는 인터페이스, 추상클래스와 의존관계를 맺는것.
  → **의존성 주입**이 가능해진다