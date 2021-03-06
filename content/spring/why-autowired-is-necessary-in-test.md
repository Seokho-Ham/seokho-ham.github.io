---
emoji: 🍀
title: Test에서는 왜 @Autowired 없이는 의존성 주입이 안될까?
date: '2022-03-18 23:00:00'
author: 포키
tags: spring, test
categories: 스프링
---


스프링 카페 미션 3단계를 진행하며 Repository에 대한 테스트코드를 작성하며 했던 삽질에 대해 정리한 내용이다.

테스트코드에는 @JdbcTest 어노테이션을 추가했고, 생성자가 하나밖에 없었기 때문에 의존성 주입이 자동으로 이루어질 줄 알았지만 실행해보니 아래와 같은 에러가 발생했다.

![error-message](../../assets/spring/parameter-resolver-error.png)

처음 보는 에러에 헤매다가 결국 쿠킴의 도움을 받아서 필드에 @Autowired를 붙여주니까 의존성 주입이 되었고 문제는 해결이 됐다.
하지만 분명 스프링에서는 생성자가 하나면 @Autowired를 생략할 수 있다고 배웠는데 대체 왜 안되는지 이해가 안되서 자료를 찾아보게 되었다.

<!--more-->

### 주입하는 주체가 다르다

SpringApplication의 경우 빈을 주입해주는 역할을 스프링이 담당한다.
하지만 테스트의 경우 Junit(Jupiter 엔진)에 의해 객체를 주입하게 된다. 이때 JUnit은 ParameterResolver를 사용해서 주입을 한다.

### Parameter Resolver

- 테스트에 동적으로 parameter를 주입할 수 있도록 junit에서 제공하는 인터페이스
- `xxxExtension` 를 구현체로 보통 사용하며 `supportsParameter()` , `resolveParameter()` 메서드를 구현해야한다.
  - `supportsParameter()` : 주입할 수 있는 타입 여부를 boolean으로 리턴한다.
  - `resolveParameter()` : 주입할 타입의 객체를 반환한다.
- 사용하려면 @ExtendWith(xxxExtension.class)를 테스트 위에 붙여야 한다.

### 결론

`@SpringBootTest`, `@JdbcTest`내부에는 `@ExtendWith(SpringExtension.class)`어노테이션이 등록되어 있으며, **SpringExtension은 ParameterResolver를 구현한 구현체**다.
SpringExtension 클래스의 supportParameter 메서드에서는 스프링 컨테이너에서 가져올 수 있는 빈 타입 여부를 @AutoWired 어노테이션이 있는지를 가지고 판단한다.
![spring-extension](../../assets/spring/spring-extension.png)

![isAutowirable](../../assets/spring/isAutowirable.png)

Junit에서 @Autowired를 사용하지 않으면 SpringExtension은 해당 타입의 객체를 제공할 수 없다고 응답하게 되고, Junit은 해당 타입을 처리할 ParameterResolver가 없다고 에러를 발생시키게 된다.

> **그래서 결과적으로 @AutoWired가 없이는 객체의 주입이 불가능하다.**

#### 참고자료

- [Why does @SpringBootTest need @Autowired in constructor injection](https://stackoverflow.com/questions/66671846/why-does-springboottest-need-autowired-in-constructor-injection)
- [Inject Parameters into JUnit Jupiter Unit Tests](https://www.baeldung.com/junit-5-parameters)

```toc
```