---
title: 'React에 대해 알아보자 - 1편'
date: 2020-10-16T15:48:09+09:00
categories: ['React']
tags: ['React', 'Frontend']
draft: false
---

Javascript를 제대로 이해하고 사용하는 개발자가 되기 위해 공부중입니다.
<br>
오늘은 React에 대해 학습한 내용을 정리합니다.

<!--more-->

## **React는 Frontend Library!**

기존에는 일일이 dom을 가져와서 사용해야 했다. 하지만 서비스의 규모가 커지면 수많은 dom 요소를 필요에 맞게 사용하는 것이 쉽지 않다.
그래서 Facebook에서는 React를 개발했다.

- DOM 관리, 상태값 업데이트 관리를 최소화 하고 오로지 기능 개발, UI 개발에 집중할 수 있도록 도와준다.
- **생산성 향상**과 **유지보수**에 효과적이다!

<br>

## **React의 Virtual DOM**

- Virtual DOM이란 Javascript로 이루어진 **가상의 DOM**이다.
- 동작 원리
  1. 데이터가 변경되면 Virtual DOM에 렌더링을 한다.
  2. 실제 DOM 과 Virtual DOM 간에 비교가 이루어진다.
  3. 변화가 이루어진 부분만 실제 DOM에 적용시킨다.


<br>

## **Webpack & Babel**

**Webpack** : 코드를 의존하는 순서대로 번들링 작업을 하도록 도와주는 도구. ex) js파일을 하나(또는 여러개)로 묶어준다.

> Bundle이란?
> 소프트웨어에서 작동하는데 필요한 모든것의 묶음.

- 여러개의 파일을 브라우저에서 로딩하는 것은 성능적으로 좋지 않다.

**Babel** : Javascript로 컴파일 해주는 도구. / ex) ES6문법을 지원하지 않는 브라우저에서 기존의 문법으로 변환시켜서 넘겨준다.

## **JSX**

- HTML 문법과 비슷하지만 지켜야 할 규칙들이 있다.

1.  **태그**는 반드시 닫혀 있어야 한다.
2.  2개 이상의 엘리먼트는 하나의 엘리먼트 내에 속해야 한다.

    - React 16.2부터는 **Fragment**라는 기능이 생겼다.
      → 여러개의 엘리먼트를 사용할 때 그것들을 묶기 위해 불필요한 div를 사용할 필요가 없어졌다.

    ```html
    <div>
      <div>Hello</div>
      <div>Bye</div>
    </div>
    //------------------
    <Fragment>
      <div>Hello</div>
      <div>Bye</div>
    </Fragment>
    ```

3.  Javascript 문법을 사용할 때는 **중괄호** 내에서 사용해야 한다.

    ```jsx
    class App extends Component{
        render(){
    	  const name = "coco";
    	  return(
    		<div>
    			<h1>Hello, {name}>
    		</div>
    	  )
        }
    }
    ```

4.  **조건부 렌더링**

    - JSX내에서는 If 문을 사용할 수 없다.

      - **삼항 연산자**를 사용해서 렌더링 내용을 정할 수 있다.
      - "**&&**"를 사용해서 조건에 따라 렌더링을 할 수 있다.
        - falsy한 값인 0은 화면에 나타난다.
      - **즉시 실행 함수**를 통해 사용할 수도 있다.

    ```jsx
                // 삼항 연산자
            {
                name === 'coco' ? (
                    <h1>안녕하세요 {name} 님</h1>
                ) : (
                    <h1>회원이 아닙니다.</h1>
                );
            }

                //&&
            {
                name === 'coco' && <h1>안녕하세요 {name} 님</h1>;
            }

                //즉시 실행 함수

            {
            (function(){
                if(name === 'coco'){
                    return <h1> 안녕하세요 {name} 님</h1>
                }
                return <h1> 회원이 아닙니다.</h1>
            })()
    ```

5.  **Inline Style**을 사용할 수 있다.

    - 객체 형태로 넣는다. / value는 문자열로 넣는다.
    - 속성의 이름은 **camelCase**로 작성한다.
    - class → className으로 사용한다.

    ```jsx
    const style = {
      backgroundColor: 'black',
      padding: '16px',
    };
    <div className='App' style={style}>
      Hello
    </div>;
    ```

6.  주석은 멀티라인으로 작성해야 하며 중괄호로 묶어야 한다.

### **Component**

1. **함수형 컴포넌트**

   - 보통 props를 받아와서 렌더하기만 할 때 사용한다.
   - 초기 마운트 속도가 (미세하게) 빠르며 메모리를 덜 사용한다.
   - state, lifecycle이 존재하지 않는다.

   ```jsx
   const MyName = props => {
     return <div>안녕하세요 저는 {props.name}이라고 합니다.</div>;
   };
   ```

2. **클래스 컴포넌트**

   - state와 lifcycle API가 존재한다.
   - 반드시 render 메서드를 통해 JSX를 반환해야 한다.
   - event를 적용시킬 때 arrow function을 사용하지 않으면 this 바인딩이 필요하다.

   ```jsx
   class MyName extends React.Components {
     state = {
       name: 'coco',
     };
     render() {
       return <div>안녕하세요 저는 {this.state.name}이라고 합니다.</div>;
     }
   }
   ```

   <br>

### 두가지 방식의 장단점

| 장/단 | 함수형                                                             | 클래스형                          |
| ----- | ------------------------------------------------------------------ | --------------------------------- |
| 장점  | - 클래스에 비해 선언이 간단하다. <br>- 메모리 자원을 덜 사용한다.  | - state와 lifcycle API가 존재한다 |
| 단점  | -state와 lifcycle API를 사용할 수 없다.<br>(hooks가 나오면서 해결) | 함수형의 장점의 반대              |

### **Props**

- 부모 컴포넌트가 자식 컴포넌트에게 값을 전달할 때 사용된다 .
- 단방향 데이터 플로우다.
- 읽기전용이다.
- 컴포넌트를 호출할 때 props를 함께 넘겨준다.
- **static defaultProps**를 설정하면 props가 넘어오지 않을 경우를 대비해 기본값을 설정해 둘 수 있다.
- **props.children**을 사용하면 컴포넌트 사이에 있는 문자열을 사용할 수 있다.
- **propTypes**를 사용해 넘겨 받을 prop의 타입을 미리 지정할 수 있다.

```jsx
import PropTypes from 'prop-types';

class MyName extends Component {
  static defaultProps = {
    name: 'basic name',
  };
  static propTypes={
    name : PropTypes.string;
  }
  render() {
    return <div>안녕하세요 저는 {this.props.name}이라고 합니다.</div>;
  }
}


<MyName name='coco' />; //-> props = {name: 'coco'}
```
