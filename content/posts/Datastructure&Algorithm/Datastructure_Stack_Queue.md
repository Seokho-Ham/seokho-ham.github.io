---
title: '[자료구조] Stack & Queue'
date: 2021-01-15T14:04:43+09:00
categories: ['자료구조']
tags: ['자료구조', 'Stack', 'Queue', 'Javascript']
draft: false
---

Javascript를 제대로 이해하고 사용하는 개발자가 되기 위해 공부중입니다.
<br>
오늘은 Stack & Queue에 대해 학습한 내용을 정리합니다.

<!--more-->

## 스택

---

- 데이터를 집어넣을 수 있는 선형 자료형.
- push, pop, peek등의 작업을 통해 데이터를 삽입, 추출, 확인 할 수 있다.
- 후입 선출(LIFO)의 구조를 가지고 있다.

- Javascript를 통한 구현

  ```jsx
  function Stack() {
    this.data = [];
  }
  Stack.prototype.push = function (data) {
    this.data.push(data);
  };
  Stack.prototype.pop = function () {
    this.data.pop();
  };
  Stack.prototype.peek = function () {
    return this.data[this.data.length - 1];
  };

  let stack = new Stack();
  stack.push(1);
  stack.push(2);
  stack.pop();
  stack.peek();
  ```

## 큐

---

- 데이터를 집어 넣을 수 있는 선형 자료형.
- enqueue, dequeue등의 작업을 통해 데이터를 삽입, 추출할 수 있다.
- 선입 선출(FIFO)의 구조를 가지고 있다.

- javascript를 통한 구현

  ```jsx
  function Queue() {
    this.data = [];
  }
  Queue.prototype.enqueue = function (el) {
    this.data.push(el);
  };
  Queue.prototype.dequeue = function () {
    this.data.shift();
  };

  let q = new Queue();
  q.enqueue(1);
  q.enqueue(2);
  q.enqueue(3);
  q.dequeue();
  q.dequeue();
  q.dequeue();
  ```
