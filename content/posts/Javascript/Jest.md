---
title: '테스트 프레임워크 - Jest'
date: 2021-07-18T20:26:05+09:00
categories: ['Test']
tags: ['TDD', 'Jest']
draft: false
---

이 글은 테스트 라이브러리인 Jest 대해 학습한 내용을 정리한 글입니다.

<br>

<!--more-->

### Jest란?

---

- 페이스북에서 만든 자바스크립트 테스트 프레임워크다.
- Jasmine을 기반으로 만들었다.

<br>

### 다른 테스트 라이브러리와의 차이점

---

이전의 라이브러리들은 여러가지를 조합해서 사용해야 했다.
테스트 러너, 매처, 목을 조합해서 사용하는 방식.

- Jest는 테스트 러너, 매처, 목 프레임워크를 한번에 제공하는 All-in-one 방식이다.
- Babel, Webpack, Typescript 등과 함께 사용 가능하다.

<br>

### 사용법

---

1. Dev-Dependencies에 jest 설치

   `npm install -D jest`

2. test 파일에 test 추가하기

   - test메서드
     - 첫번째 인자 : 테스트 내용을 문장으로 작성
     - 두번째 인자 : 함수
   - expect 와 toBe : 결과값과 기대값을 작성.

   ```jsx
   test('sum함수를 사용해서 1+2를 더할경우 3이어야한다.', () => {
     expect(sum(1, 2)).toBe(3);
   });
   ```

3. test 실행

   - package.json에 scripts에 다음을 추가한다.

     `"test" : "jest"`

   - test를 실행한다.

     `npm run test`

<br>

### 매처

---

- 기본적으로 정확한 일치비교를 위해 expect - toBe 를 사용한다.
- expect는 예상되는 객체를 반환한다. 이 이상의 역할은 안한다.
- **toBe가 매처 역할이다.**

  - 객체 내의 필드들을 검사하기 위해서는 **toEqual**을 사용한다. (객체 혹은 배열의 모든 필드를 재귀적으로 확인한다.)
  - **not.toBe**도 사용 가능.

  ```jsx
  test('sum함수를 사용해서 1+2를 더할경우 3이어야한다.', ()=>{
  	//일반 값
  	expect(sum(1,2))ㄴ.toBe(3);
  	expect(sum(1,2)).not.toBe(4);
  	//객체
  	let data = {name:'kiki'};
  	expect(data).toEqual({name:'kiki'});
  })
  ```

- toBeNull : null에만 일치
- toBeUndefined : undefined에만 일치
- toBeDefined : undefined 아닐경우에만 일치
- toBeTruthy : true
- toBeFalsy : false


<br>

### 비동기 처리

---

### **콜백**

- done이라는 인자를 사용한다. → 테스트가 끝나기 전에 done 콜백이 호출될 때를 기다린다.

```jsx
test('the data is peanut butter', done=>{
	function callback(data){
		try {
			expect(data).toBe('peanut butter');
			done();
		} catch (error) {
			done(error);
		}
	}

	fetchData(callback);
}
```

<br>

### **프로미스**

- 프로미스는 resolve, reject가 있어서 간단하다.
- 테스트에서 **프로미스를 반환**시키면 jest는 resolve를 기다린다. → reject되면 실패한 것.
- **.resolves / .rejects 매처**를 사용할 수 있다.

```jsx
test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});

// .resolves/.rejects 매처를 사용할 경우
test('the data is peanut butter', () => {
  return expect(fetchData()).resolves.toBe('peanut butter');
});
test('the fetch fails with an error', () => {
  return expect(fetchData()).rejects.toMatch('error');
});
```

<br>

### **Async / Await**

- test 내에서 async/await을 사용할 수 있다.
- test의 두번째 인자에 전달되는 함수에 async 사용.
- **.resolves / .rejects 매처**를 사용할 수 있다.

```jsx
test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (e) {
    expect(e).toMatch('error');
  }
});

test('the data is peanut butter', async () => {
  await expect(fetchData()).resolves.toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  await expect(fetchData()).rejects.toThrow('error');
});
```

### References

- [Jest 공식 문서](https://jestjs.io/docs/getting-started)
- [Jest 공식 문서 번역본](https://mulder21c.github.io/jest/docs/en/next/getting-started)
