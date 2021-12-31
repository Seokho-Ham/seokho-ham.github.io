---
title: '[자료구조] 동적 프로그래밍(DynamicProgramming)'
date: 2021-02-15T14:04:43+09:00
categories: ['자료구조']
tags: ['자료구조', 'DynamicProgramming', 'Javascript']
draft: false
---


<br>
오늘은 동적 프로그래밍(DynamicProgramming)에 대해 학습한 내용을 정리합니다.

<!--more-->

알고리즘은 보통 분할정복 기법을 사용한다.

> 분할 정복 기법 : 큰문제를 여러개의 작은 단위의 문제들로 만들어서 푸는 방식.

이 과정에서 분할해서 풀다보면 중복이 발생하게 된다.

```jsx
ex) 피보나치 수열 : 앞의 두 항을 더한 수로 정의
fib(5)의 경우
- fib(4)
  - fib(3)
	  - fib(2)
	  - fib(1)
- fib(3)
  - fib(2)
	- fib(1)
```

fib(3)아래로는 중복된다. 즉, 이미 계산했던것을 또 계산해야한다.

**동적 프로그래밍**은 그것을 방지하기 위해 작은 단위의 문제를 푼 후 저장해둔 다음 그 값을 재사용하는 방식이다.

- 피보나치 수를 구하는 문제(반복이 발생하는 경우)
- 어느 지점에서 목표지점까지 최단 거리 등의 문제

### Top-down(Memoization)

---

- 큰 단위부터 작은 단위로 나누어가며 문제를 푸는 방식

```jsx
let fib = [0];
let memoization = n => {
  if (n < 2) {
    fib[n] = 1;
  }

  if (!fib[n]) {
    fib[n] = memoization(n - 1) + memoization(n - 2);
  }

  return fib(n);
};
```

### Bottom-Up 방식

---

- 작은 문제들부터 큰문제로 풀어가는 방식

```jsx
function fib(n) {
  let arr = new Array(n);
  for (let i = 0; i < n; i++) {
    if (i === 0 || i === 1) {
      arr[i] = 1;
    } else {
      arr[i] = arr[i - 1] + arr[i - 2];
    }
  }
  return arr[n];
}
```
