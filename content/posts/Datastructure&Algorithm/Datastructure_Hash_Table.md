---
title: '[자료구조] 해시 테이블(Hash Table)'
date: 2021-06-01T15:25:09+09:00
categories: ['자료구조']
tags: ['자료구조', 'Hash Table', 'Javascript']
draft: false
---

해시 테이블(Hash Table)에 대해 학습한 내용을 정리합니다.

<br>

<!--more-->

### Hash Table이란?

---

> 연관 배열구조를 이용하여 key에 value를 저장하는 자료구조를 말한다.

만약 직원들의 전화번호를 사용해 직원들의 정보를 저장한다고 예시를 들어보자.
크게 3가지 방식이 떠오른다.<br><br>
첫번째, array 혹은 linked list를 사용해 저장하는 방식. 이렇게 저장할 경우 데이터의 접근에는 쉬울 수 있으나 데이터를 추가하거나 삭제할 경우, 어려움이 발생할것이다.<br><br>
두번째, binary search tree를 사용해 데이터를 저장하는 방식이다. 이 경우 데이터의 접근, 추가, 삭제 모두 O(logN)의 시간복잡도를 가질것이다.<br><br>
마지막으로 큰 배열을 만들어서 전화번호에 해당하는 인덱스에 정보를 저장하는 것이다. 이렇게 할경우 공간의 낭비가 발생한다.
<br><br>
이런 경우 사용할 수 있는게 바로 **해시 테이블** 이다.

<br>

### Hash Table 구성

---

1. Key : 해시 함수의 input 값이 되는 값이다.(때에 따라서는 value와 동일할 수 있다.)

2. Hash Function : key를 hash로 바꿔주는 함수다. 큰 값을 일정한 길이를 가진 값으로 변환해 테이블의 인덱스로 사용할 수 있게 만들어준다.

- 자주 사용하는 해시 함수
  - aritmetic modular : key를 테이블의 크기로 나눈 값의 나머지를 반환한다.
  - truncation : key의 일부 값을 반환한다.
  - folding : key를 일정 규칙으로 분리해서 분리된 값들을 하나로 합친다. 이후 테이블의 사이즈로 나눈 나머지 등을 반환한다.

3. Hash : 해시 함수를 사요해 나온 결과값. 테이블에 value가 저장되는 인덱스 값이라고 생각해도 된다.
4. Value : 실제 테이블에 저장되는 값이다.
5. Table(bucket이라고도 부른다) : 배열 형태를 가진 저장소를 말한다.

<br>

### Hash의 충돌

---

해시함수를 통해 해시를 만들다보면 동일한 해시값이 나오는 경우가 발생할 수 있다.<br>
이런 현상을 **해시의 충돌(Collision)** 이라고 한다.
이런 현상을 방지하기 위해 해시 함수를 작성할때 최대한 충돌이 발생하지 않도록 작성해야한다. 하지만 완전히 막을 수 없기 때문에 여러가지 방법을 통해 방지해야한다.

<br>

### 1. 체이닝(Chaining)

- 테이블의 각 셀을 Linked List로 만드는 방식이다. 충돌이 발생할 경우, 해당 셀에 있는 데이터의 Head 혹은 Tail에 데이터를 저장한다.
- Head에 데이터를 저장할 경우 O(1), Tail에 저장할 경우 최소 O(1), 최대 O(N)의 시간복잡도를 가지게 된다.
- 키의 개수가 불분명할때 보통 사용한다.

#### <장점>

- 해시 테이블이 넘치지 않으며 크기 또한 커지지 않는다.
- 해시함수를 만들때 덜 신경써도 된다.

#### <단점>

- 공간의 낭비가 발생한다. (절대 사용하지 않게되는 공간이 발생한다.)
- 하나의 체인이 길어질 경우, 시간복잡도가 늘어난다.
- links를 위한 추가 공간이 필요하게 된다.

<br>

### 2. 개방 주소법(Open Addressing)

- 충돌이 발생할경우 비어있는 다른 셀을 찾아서 데이터를 저장하는 방식.
- 데이터의 검색, 추가, 삭제 모두 O(1)~O(N)의 시간 복잡도를 가진다.
- 일정한 방법으로 비어있는 위치를 찾는다.
- 키의 개수가 분명할때 주로 사용한다.

1. 선형 탐색 : 다음 비어있는 셀, 혹은 n개 뒤에 비어있는 셀을 사용한다.
2. 제곱 탐색 : 해시의 제곱을 한 위치에 저장한다.
3. 이중 해시 : 다른 해시 함수를 한번 더 적용해서 저장한다.

#### <장점>

- 하나의 셀에 하나의 데이터가 매칭되어 저장된다.
- 간단한다.

#### <단점>

- 데이터가 많을 경우, 테이블이 꽉차서 크기 조정을 해야할수도 있다.
- 데이터가 밀집될 수 있다.
- 해시 함수의 성능에 따라 해시테이블의 성능이 달라진다.

<br>

### Javacript를 사용한 Hash Table 구현

---

- 충돌을 방지하기 위해 Linked List를 사용했다.

```js
class Node {
  constructor(key, next = null) {
    this.key = key;
    this.next = next;
  }
}

class HashTable {
  constructor(size) {
    this.storage = new Array(size);
    this.size = size;
    this.dataLength = 0;
  }
  calculateHash(key) {
    return key.toString().length % this.size;
  }
  add(key) {
    const hash = this.calculateHash(key);
    if (!this.storage[hash]) {
      this.storage[hash] = new Node(key);
    } else {
      this.storage[hash] = new Node(key, this.storage[hash]);
    }
    this.dataLength++;
  }
  searchLinks(node, key) {
    if (node.key === key) {
      return node;
    } else {
      return this.searchLinks(node.next, key);
    }
  }
  search(key) {
    const hash = this.calculateHash(key);
    if (this.storage[hash].key === key) {
      return this.storage[hash];
    } else {
      return this.searchLinks(this.storage[hash].next, key);
    }
  }
  delete(key) {
    const hash = this.calculateHash(key);
    if (this.storage[hash].key === key) {
      if (this.storage[hash].next) {
        this.storage[hash] = this.storage[hash].next;
      } else {
        this.storage[hash] = null;
      }
    } else {
      let data = this.storage[hash];
      let node = this.searchLinks(data.next, key);
      while (data.next !== node) {
        data = data.next;
      }
      data.next = node.next;
    }
  }
  getLength() {
    return this.dataLength;
  }
}

const table = new HashTable(50);
table.add('ham');
table.add('5');
table.add('asasasasasasasasasas');
table.search('asasasasasasasasasas');
table.delete('asasasasasasasasasas');
```

<br>

## 참고자료

---

- [GeeksforGeeks](https://www.geeksforgeeks.org/hashing-data-structure/)
- [DataStructure101](https://www.educative.io/blog/data-strucutres-hash-table-javascript)
