---
title: '자바스크립트의 모듈 시스템'
date: 2021-07-20T13:44:27+09:00
categories: ['Javascript']
tags: ['Javascript', '모듈']
draft: false
---

이 글은 자바스크립트 모듈 시스템에 대해 학습한 내용을 정리한 글입니다.

<br>

<!--more-->

### 모듈이란?

---

애플리케이션을 구성하는 **개별적 요소**로서 **재사용 가능한 코드**를 의미한다.

모듈이 성립되기 위해서는 반드시 **자신만의 스코프**를 가져야 하며 모듈 내에 있는 변수, 함수, 객체등은 모두 **캡슐화** 되어 외부에서 접근할 수 없다.

하지만 모듈은 다른 모듈에 의해 재사용되지 않으면 의미가 없다. 그래서 **export**, **import** 키워드를 사용해 재사용할 수 있도록 한다.

<br>

### 모듈의 특징

---

- 자신만의 스코프를 가질 수 있어야 한다.
- 기본적으로 모듈의 자산은 캡슐화 되어 있다.
- 기능별로 분리되어 개별적인 파일로 작성된다.

<br>

### 자바스크립트 모듈

---

기존에는 순수 자바스크립트에서는 C언어의 #include, 자바의 include등과 같은 모듈 시스템을 지원하지 않았다.

script태그를 사용해 로딩할 수 있었지만 개별적인 스코프를 가지지는 않았다.

하지만 자바스크립트를 브라우저 환경 이외에서도 사용하려는 움직임이 생기면서 CommonJS와 AMD가 생겨났다. 이후 브라우저 환경에서 모듈을 사용하기 위해서는 CommonJS 혹은 AMD를 구현한 모듈 로더 라이브러리를 사용해야 됐다.

Node.js에서는 CommonsJS를 채택했다.

<br>

### ES6 모듈(ESM)

---

ES6부터 클라이언트 사이드 자바스크립트에서 동작하는 모듈 기능이 생겼다.

**사용법**

- script 태그에 type을 module로 설정하면 된다.
- ESM임을 명확하게 하기 위해 확장자는 mjs로 하는것이 권장된다.
- 독자적인 모듈 스코프를 가진다.

```html
<script type="module" src="app.mjs"></script>
```

<br>

### 키워드

---

### export

- 다른 외부 모듈에서 접근할 때 사용하는 키워드

```jsx
export const pi = 3.14;

export function square(x) {
  return x * x;
}
export class Person {
  constructor(name) {
    this.name = name;
  }
}

//export를 한번만 사용해 하나의 객체 형식으로 내보낼 수 있다.
const pi = 3.14;

function square(x) {
  return x * x;
}

class Person {
  constructor(name) {
    this.name = name;
  }
}

export { pi, square, Person };
```

- 하나의 값을 내보낼때는 default 키워드를 사용할 수 있다.

```jsx
export default x => x * x;
```

<br>

### import

- 다른 모듈의 자산을 참조할 때 사용하는 키워드
- 참조하려는 모듈이 export한 식별자 이름으로 import해야한다.
- ESM의 경우 파일 확장자를 생략할 수 없다.

```jsx
import { pi, square, Person } from './lib.mjs';

console.log(pi);
console.log(square);
console.log(new Person('Ham'));
```

- 특정 이름으로 import할수도 있다. → as 뒤에 이름의 객체에 프로퍼티로 할당된다.
- 각 식별자 이름을 변경할수도 있다.

```jsx
import * as lib from './lib.mjs';

console.log(lib.pi);
console.log(lib.square(10));
console.log(lib.new Person('Ham'));

import { pi as PI, square as sq, Person as P } from './lib.mjs';
```

- default가 붙으면 import 시 임의의 이름으로 import 해야한다.

```jsx
import square from './lib.mjs';
console.log(square(3));
```
