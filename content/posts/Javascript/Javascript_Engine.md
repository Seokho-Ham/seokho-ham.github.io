---
title: '자바스크립트 엔진과 구동원리'
date: 2021-06-10T14:00:33+09:00
categories: ['Javascript']
tags: ['V8엔진', Javascript', 'EventLoop']
draft: false
---

이 글은 Javascript 엔진인 V8엔진과 Javascript의 런타임에 대해 학습한 내용을 정리한 글입니다.

<br>

<!--more-->

### Javascript 엔진이란?

---

- 자바스크립트 코드를 실행하는 프로그램 혹은 인터프리터를 말한다.
- V8(구글 개발/오픈소스), Rhino, SpiderMonkey(최초의 JS 엔진) 등등이 있다.

<br>

### V8 엔진이란?

---

- 구글에서 C++을 사용하여 개발한 `고성능 자바스크립트` & `웹 어셈블리 엔진`을 말한다.
- Chrome과 Node.js에서 사용되고 있다.

V8 엔진에서 JS코드를 실행 시키는 과정은 아래와 같다.

**1. 개발자가 작성한 Javascript 소스코드는 scanner-parser과정을 거친다.**

- scanner : 코드를 문자 단위로 스캔하여 토큰으로 변환한다.
- parser : 토큰 목록을 분석해 AST로 변환한다.

**2. 변환된 AST는 바이트 코드로 변환하는 인터프리터(Ignition)에게 전달된다.**

- AST(Abstract Syntax Tree) : 추상 구문 트리
- 원본 코드를 다시 파싱(Parsing)해야하는 수고를 덜고 코드의 양도 줄이면서 코드 실행 때 차지하는 메모리 공간을 아끼기 위해서.
- 바이트 코드란?
  고급 언어 → 중간 코드로 컴파일 된 코드.

**3. 바이트 코드가 실행되며, 자주 사용되는 코드는 컴파일러(TurboFan)로 보내진다.**

**4. 컴파일러에서 최적화된 코드로 컴파일 된다.**

- 사용이 덜 되면 다시 빠지기도 한다.

<br>

### 단일 스레드를 가진다

---

1. 하나의 Heap 과 Stack으로 구성된다.<br>
   - **Heap** : 변수, 함수 등이 저장되는 메모리 공간
   - **Call Stack** : 함수 호출 스택(실행 컨텍스트)이 쌓이는 공간<br><br>
1. 하나의 Call Stack으로 구성되어 있기 때문에 한번에 한가지 일밖에 못한다.

<br>

### Non-blocking I/O

---

<p>기본적으로 블로킹으로 동작할 경우 서버에 요청을 보내면 응답이 오고 해당 함수가 끝날때까지 다른 동작은 전혀 할 수 없게 된다. 만약 브라우저에서 이렇게 동작을 한다면 사용자들은 속터져서 아무 일도 할 수 없게 될것이다.</p>

논블로킹으로 동작한다는 것은 요청에 대한 결과값을 기다리지 않고 다음 동작들을 실행하는 방식이다.<br>
**사용자가 서버에 요청을 보내고 응답이 오기전까지 다른 동작들을 할 수 있는 이유가 바로 V8엔진은 논블로킹 방식이기 때문이다.**

<br>

### Javascript Runtime

---

그렇다면 어떻게 여러가지 동작들을 동시에 할 수 있을까?<br>
먼저 사진과 함께 아래의 개념들을 알아야한다.

- **Web Api** : 웹 브라우저에서 제공하는 API다. HTTP전송, setTimeout, DOM 이벤트 등의 비동기 작업을 가능하게 해준다.(엔진에서 제공하지 않는다.)
- **Task Queue** : 비동기적으로 동작하는 함수(콜백)들을 담아두는 큐다.
- **MicroTask Queue** : 일반 Task Queue보다 우선순위를 가진 큐다.
- **Event Loop** : 콜스택이 비었는지 확인하여 비었으면 태스크 큐의 함수를 콜스택으로 옮기는 역할을 한다.

자바스크립트의 코드들은 아래의 순서로동작한다.

1. 동기적으로 동작하는 함수는 순서대로 Call Stack에 쌓인다.
2. 비동기 함수의 경우 브라우저의 WebAPI에게 전달하고 별도의 쓰레드에서 동작한다.
3. 해당 요청이 완료되면 콜백 함수를 Task Queue로 이동시킨다.
4. 동기적으로 동작하는 함수들이 모두 끝나게 되면 Event Loop가 Queue에 있는 함수들을 순서대로 Call Stack에 넣는다.

아래의 코드를 예시로 구체적인 동작의 순서를 설명하겠다.

```jsx
function boo() {
  console.log('Hello');
}
function foo() {
  setTimeout(boo, 1000);
}
function doo() {
  foo();
}
doo();
console.log('Bye');
```

위의 JS파일이 실행되는 순서는 아래와 같다.

**1. 콜스택에 doo의 함수 스택이 쌓인다.**<br>
**2. doo 내에서 foo를 호출 했기 때문에 foo 함수 스택이 쌓인다.**<br>
**3. foo 내의 setTimeout 함수가 스택에 쌓인다.**<br>(이때 WebApi에서 타이머가 실행된다.)<br>
**4. 쌓였던 역순으로 스택에서 빠진다.**<br>
**5. console.log가 스택에 쌓이고 콘솔에는 'Bye'가 출력된다.**<br>
**6. 1초가 지나고 나서 setTimeout에 함께 전달했던 boo함수가 태스크 큐로 이동한다.**<br>
**7. EventLoop가 콜스택이 비어있는것을 확인 후, Task Queue에 대기중인 함수를 콜스택으로 옮긴다.**<br>
**8. 콘솔에 'Hello'가 출력된다.**

지금까지 Javascript 엔진과 구동 원리에 대해 정리했다.

