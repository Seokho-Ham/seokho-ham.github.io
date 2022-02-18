---
title: '[디자인 패턴] - MVC 패턴'
date: 2022-02-17
permalink: /java/pattern/mvc-pattern
categories:
  - java
  - patterns
tags:
  - 디자인패턴
  - mvc패턴
toc: true
toc_label: '목차'
toc_sticky: true
---

## MVC 패턴

- 코드를 기능에 따라 나눠주는 패러다임
- 도메인(Model)과 UI(View)이 분리되어 관리되기 때문에 서로에게 영향을 주지 않는다. 즉, **기능확장과 유지보수가 편리해진다**.
- Model, View, Controller로 나뉜다.

### 1. Model

- 애플리케이션과 관련된 데이터, 비즈니스 로직을 담당한다.
- **Model에서는 View, Controller에 대한 의존성을 가지면 안된다.**

### 2. View

- 사용자로부터 받는 입력, 사용자에게 제공하는 출력 등 UI를 담당한다.
- View에서는 Controller에 대한 의존성을 가져서는 안된다. (Model에 대한 의존성은 괜찮다.)
- **View는 Model로부터 데이터를 받을때 사용자에게 다르게 보여지는 부분들에 대해서만 받아야한다.**

### 3. Controller

- Model과 View를 이어주는 역할.
- **View를 통해 들어온 요청사항을 Model에게 전달해주거나 변경사항을 View에게 전달해준다.**
- 반드시 하나의 컨트롤러만 존재해야 하는것은 아니다.

<img src="https://user-images.githubusercontent.com/57708971/154414499-0c157c6f-1327-4dfc-9ac8-3c545b11ed49.jpg" width="700"/>

### 참고자료

- [우테코 테코톡](https://youtu.be/ogaXW6KPc8I)
