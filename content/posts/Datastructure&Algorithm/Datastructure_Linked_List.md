---
title: '[자료구조] Linked List'
date: 2020-09-02T14:04:43+09:00
categories: ['자료구조']
tags: ['자료구조', 'Javascript']
draft: false
---

Javascript를 제대로 이해하고 사용하는 개발자가 되기 위해 공부중입니다.
<br>
오늘은 Linked List에 대해 학습한 내용을 정리합니다.

<!--more-->

## 자료구조와 알고리즘

본격적으로 공부하기에 앞서 프로그래밍을 한다고 하면 필수로 여겨지는 자료구조와 알고리즘이란 무엇일까?

## 자료구조란?

> 데이터에 편리하게 접근하고 변경하기 위해 데이터를 저장, 조작하는 방법이다.

- 자료구조의 종류는 여러 종류가 있으며 각각의 장점과 한계를 명확히 알아야한다. 그래야 각 연산에 필요한 자료구조를 사용할 수 있기 때문이다.

## 알고리즘이란?

> 어떠한 문제를 해결하기 위해 정해진 일련의 절차다. 즉, 주어진 값을 사용해 우리가 원하는 결과를 효과적으로 도출해내는 절차를 의미한다.

<!-- more -->

## 자료구조와 알고리즘의 관계는?

자료구조는 데이터를 편리하게 사용하기 위한 저장, 조작 방법이라면 알고리즘은 그 데이터와 관계된 문제를 해결하는 방법을 의미한다.
한가지 예시를 들자면 아래는 `배열`이라는 자료구조이다.

```js
let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
```

아래는 배열이라는 자료구조를 가지고 원하는 값을 도출해내는 알고리즘이다.

```js
//조건 : 짝수만 보여주세요
let result = [];
for (let i = 0; i < array.length; i++) {
  if (array[i] % 2 === 0) {
    result.push(array[i]);
  }
}
return result;
```

문제를 해결하기 위한 가장 좋은 알고리즘을 짜기 위해서는 보통은 그에 맞는 자료구조를 먼저 정해야한다. 그렇기 때문에 이 둘은 밀접한 관계를 가지고 있으며 개발자들 사이에서도 필수 요소로 여겨지고 있다.

## Linked List 란?

> 여러개의 노드로 구성되어 있으며 한줄로 연결되는 방식으로 데이터를 저장하는 자료구조.
> 이 설명만 봐서는 감이 잡히지 않을것이다. 더 간단한 그림을 통해 알아보자.
> 위 그림과 같이 가장 첫번째 노드를 가리키는 `Head`와 마지막 노드를 가리키는 `Tail`이 존재하며 각 노드들이 다음 노드를 가리킨다. \*객체 지향 언어에서는 객체를 사용하여 표현한다.

## 노드의 구성

각 노드는 `Data Field`와 `Link Field`로 구성된다.

- Data Field : 실제 데이터가 담겨있다.
- Link Field : 다음 노드를 가리킨다.

## Linked List Code

이번에는 Javascript를 사용하여 한번 구현해보겠다.

```js
//노드 객체를 만들 때 사용하는 클래스
function Node(value) {
  this.value = value;
  this.next = null;
}

function LinkedList() {
  let list = {};
  list.head = null;
  list.tail = null;

  list.addToTail = function(value) {
    if (list.head === null && list.tail === null) {
      let no = new Node(value);
      list.head = no;
      list.tail = no;
    } else {
      let newNode = new Node(value);
      this.tail.next = newNode;
      list.tail = newNode;
    }
  };

  list.removeHead = function() {
    let result = list.head.value;
    list.head = this.head.next;
    return result;
  };

  list.contains = function(target) {
    let cur = list.head;
    while (cur) {
      if (cur.value === target) {
        return true;
      }
      cur = cur.next;
    }
    return false;
  };

  return list;
};
}
```

### Array List VS Linked List

Array는 여러개의 데이터가 순차적으로 저장되어 있고 Linked List는 각자 다른 위치에 있으며 서로 연결되어 있다.

글의 초반에 이야기한것처럼 각각의 자료구조는 장점과 한계가 있다.<br>
특정 인덱스가 주어져 관련된 값을 찾아야 하는거라면 Array를 사용할 때 좋은 성능을 나타낼 것이다.<br>
데이터를 중간에 추가하거나 삭제할 경우 Array를 사용하면 삭제한 후 일일이 데이터를 빈자리없이 앞으로 끌어와야 할것이다. 하지만 이때 Linked List를 사용한다면 그럴 필요 없이 데이터를 삭제해주고 나머지 데이터를 연결만 해주면 된다.
