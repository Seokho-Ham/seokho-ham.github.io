---
emoji: ๐
title: Test์์๋ ์ @Autowired ์์ด๋ ์์กด์ฑ ์ฃผ์์ด ์๋ ๊น?
date: '2022-03-18 23:00:00'
author: ํฌํค
tags: spring, test
categories: ์คํ๋ง
---


์คํ๋ง ์นดํ ๋ฏธ์ 3๋จ๊ณ๋ฅผ ์งํํ๋ฉฐ Repository์ ๋ํ ํ์คํธ์ฝ๋๋ฅผ ์์ฑํ๋ฉฐ ํ๋ ์ฝ์ง์ ๋ํด ์ ๋ฆฌํ ๋ด์ฉ์ด๋ค.

ํ์คํธ์ฝ๋์๋ @JdbcTest ์ด๋ธํ์ด์์ ์ถ๊ฐํ๊ณ , ์์ฑ์๊ฐ ํ๋๋ฐ์ ์์๊ธฐ ๋๋ฌธ์ ์์กด์ฑ ์ฃผ์์ด ์๋์ผ๋ก ์ด๋ฃจ์ด์ง ์ค ์์์ง๋ง ์คํํด๋ณด๋ ์๋์ ๊ฐ์ ์๋ฌ๊ฐ ๋ฐ์ํ๋ค.

![error-message](../../assets/spring/parameter-resolver-error.png)

์ฒ์ ๋ณด๋ ์๋ฌ์ ํค๋งค๋ค๊ฐ ๊ฒฐ๊ตญ ์ฟ ํด์ ๋์์ ๋ฐ์์ ํ๋์ @Autowired๋ฅผ ๋ถ์ฌ์ฃผ๋๊น ์์กด์ฑ ์ฃผ์์ด ๋์๊ณ  ๋ฌธ์ ๋ ํด๊ฒฐ์ด ๋๋ค.
ํ์ง๋ง ๋ถ๋ช ์คํ๋ง์์๋ ์์ฑ์๊ฐ ํ๋๋ฉด @Autowired๋ฅผ ์๋ตํ  ์ ์๋ค๊ณ  ๋ฐฐ์ ๋๋ฐ ๋์ฒด ์ ์๋๋์ง ์ดํด๊ฐ ์๋์ ์๋ฃ๋ฅผ ์ฐพ์๋ณด๊ฒ ๋์๋ค.

<!--more-->

### ์ฃผ์ํ๋ ์ฃผ์ฒด๊ฐ ๋ค๋ฅด๋ค

SpringApplication์ ๊ฒฝ์ฐ ๋น์ ์ฃผ์ํด์ฃผ๋ ์ญํ ์ ์คํ๋ง์ด ๋ด๋นํ๋ค.
ํ์ง๋ง ํ์คํธ์ ๊ฒฝ์ฐ Junit(Jupiter ์์ง)์ ์ํด ๊ฐ์ฒด๋ฅผ ์ฃผ์ํ๊ฒ ๋๋ค. ์ด๋ JUnit์ ParameterResolver๋ฅผ ์ฌ์ฉํด์ ์ฃผ์์ ํ๋ค.

### Parameter Resolver

- ํ์คํธ์ ๋์ ์ผ๋ก parameter๋ฅผ ์ฃผ์ํ  ์ ์๋๋ก junit์์ ์ ๊ณตํ๋ ์ธํฐํ์ด์ค
- `xxxExtension` ๋ฅผ ๊ตฌํ์ฒด๋ก ๋ณดํต ์ฌ์ฉํ๋ฉฐ `supportsParameter()` , `resolveParameter()` ๋ฉ์๋๋ฅผ ๊ตฌํํด์ผํ๋ค.
  - `supportsParameter()` : ์ฃผ์ํ  ์ ์๋ ํ์ ์ฌ๋ถ๋ฅผ boolean์ผ๋ก ๋ฆฌํดํ๋ค.
  - `resolveParameter()` : ์ฃผ์ํ  ํ์์ ๊ฐ์ฒด๋ฅผ ๋ฐํํ๋ค.
- ์ฌ์ฉํ๋ ค๋ฉด @ExtendWith(xxxExtension.class)๋ฅผ ํ์คํธ ์์ ๋ถ์ฌ์ผ ํ๋ค.

### ๊ฒฐ๋ก 

`@SpringBootTest`, `@JdbcTest`๋ด๋ถ์๋ `@ExtendWith(SpringExtension.class)`์ด๋ธํ์ด์์ด ๋ฑ๋ก๋์ด ์์ผ๋ฉฐ, **SpringExtension์ ParameterResolver๋ฅผ ๊ตฌํํ ๊ตฌํ์ฒด**๋ค.
SpringExtension ํด๋์ค์ supportParameter ๋ฉ์๋์์๋ ์คํ๋ง ์ปจํ์ด๋์์ ๊ฐ์ ธ์ฌ ์ ์๋ ๋น ํ์ ์ฌ๋ถ๋ฅผ @AutoWired ์ด๋ธํ์ด์์ด ์๋์ง๋ฅผ ๊ฐ์ง๊ณ  ํ๋จํ๋ค.
![spring-extension](../../assets/spring/spring-extension.png)

![isAutowirable](../../assets/spring/isAutowirable.png)

Junit์์ @Autowired๋ฅผ ์ฌ์ฉํ์ง ์์ผ๋ฉด SpringExtension์ ํด๋น ํ์์ ๊ฐ์ฒด๋ฅผ ์ ๊ณตํ  ์ ์๋ค๊ณ  ์๋ตํ๊ฒ ๋๊ณ , Junit์ ํด๋น ํ์์ ์ฒ๋ฆฌํ  ParameterResolver๊ฐ ์๋ค๊ณ  ์๋ฌ๋ฅผ ๋ฐ์์ํค๊ฒ ๋๋ค.

> **๊ทธ๋์ ๊ฒฐ๊ณผ์ ์ผ๋ก @AutoWired๊ฐ ์์ด๋ ๊ฐ์ฒด์ ์ฃผ์์ด ๋ถ๊ฐ๋ฅํ๋ค.**

#### ์ฐธ๊ณ ์๋ฃ

- [Why does @SpringBootTest need @Autowired in constructor injection](https://stackoverflow.com/questions/66671846/why-does-springboottest-need-autowired-in-constructor-injection)
- [Inject Parameters into JUnit Jupiter Unit Tests](https://www.baeldung.com/junit-5-parameters)

```toc
```