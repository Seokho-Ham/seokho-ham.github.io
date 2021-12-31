---
title: '시간 복잡도(Big-O 표기법)'
date: 2021-05-11T14:04:43+09:00
categories: ['자료구조']
tags: ['자료구조', '시간복잡도', 'Big-O']
draft: false
---


<br/>
오늘은 **시간 복잡도**에 대해 학습한 내용을 정리합니다.

<br>

<!--more-->

##시간복잡도란?

---

- 알고리즘이 문제를 해결하는데 얼마의 시간이 걸리는지 분석하는 것.

<br/>

## Big-O 표기법이란?

---

- 알고리즘의 성능을 수학적으로 표현하는 표기법
- 알고리즘의 시간, 공간 복잡도를 표현할 수 있다.
- 데이터, 사용자들에 따라 알고리즘의 성능을 예측하는 것.
- 실제 알고리즘의 걸리는 시간을 계산하는것은 아니기때문에 앞에 붙는 상수는 무시한다.

> ex) for문을 각각 사용해서 총 2번 사용하면 실제로는 O(2n)의 시간이 걸리겠지만 O(n)으로 표기한다.

<br/>

**1. O(1) - constant time(상수 시간)**

- 입력받는 데이터의 크기에 상관없이 언제나 일정한 시간이 걸리는 알고리즘

```jsx
function constantTime(n) {
  return n[0] === 0 ? true : false;
}
```

<br/>

**2. O(n) - linear time(직선적 시간)**

- 입력받는 데이터의 크기에 비례해 시간이 걸리는 알고리즘
- ec) 1차원 배열을 for문을 사용해 반복

```jsx
function linearTime(n) {
  for (let i = 0; i < n.length; i++) {
    console.log(n[i]);
  }
}
```

<br/>

**3. O(n^2) - quadratic time (2차 시간)**

- 입력받는 데이터의 크기의 2제곱의 처리 시간이 걸리는 알고리즘
- ex) 2차원 배열을 for문을 사용해 반복

```jsx
function quadraticTime(n){
	for(let i=0; i<n.length; i++){
		for(let j=0; j<n.length; j++{
			console.log(n[i][j]);
		}
	}
}
```

<br/>

**4. O(nm) - quadratic time**

- n을 m 만큼 돌리는 알고리즘

```jsx
function quadraticTime(n,m){
	for(let i=0; i<n.length; i++){
		for(let j=0; j<m.length; j++{
			console.log(n[i][j]);
		}
	}
}
```

<br/>

**5. O(n^3) - polynimial / cubic time**

- 3차원 배열과 같은 구조

<br/>

**6. O(2^n), O(n^m) - exponential time (지수 시간)**

- 피보나치 수열

<br/>

**7. O(log n)(로그시간)**

- 이진 검색
- 한번의 처리가 진행될때마다 검색해야하는 데이터의 양이 1/2이 되는 알고리즘

```jsx
//arr = [,1,2,3,4,5,6,7,8,9,10]
//key = 6;

function logTime(arr, key){
	let mid = Math.floor(arr.length/2);
	if(arr[mid]===key) return true;
	if(arr[mid] > key) return logTime(arr.splice(0,mid);
	if(arr[mid] < key) return logTime(arr.splice(mid,arr.length);
}
```
