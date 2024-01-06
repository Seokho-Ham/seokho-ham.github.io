---
emoji: 🌱
title: "SpringSecurity가 OAuth 로그인을 처리하는 과정 파헤치기"
date: "2023-03-05 10:00:00"
author: "@seokhoho"
categories: Spring
---

## 서론

저는 이전에 참여했던 사이드 프로젝트 에서 OAuth 로그인 개발을 담당했습니다.  
그리고 이번에 프로젝트 리팩토링을 계획하면서 가장 마음에 안들던 로그인 관련 코드를 개선하기로 결정했습니다.

최초 기획에서는 카카오 로그인만을 사용하기로 했기 때문에 카카오 로그인에 맞게 코드를 작성하였고, 현재 로그인 관련 코드는 카카오 로그인에 종속적인 코드입니다. 때문에 새로운 로그인 방식을 도입하기에도 까다로운 상황이라 이번 기회에 OAuth 로그인 관련 코드를 개선하기로 했습니다.

OAuth 관련 클래스들을 추상화하기 위해 고민하던 중 SpringSecurity에서는 어떻게 여러개의 플랫폼에 쉽게 대응할 수 있도록 했는지, 실제 내부 동작은 어떻게 동작하는지 궁금해졌고 그래서 디버깅을 통해 내부 동작을 학습해보았습니다.

---

## SpringSecurity?

공식문서에서는 애플리케이션 보안(특히 유저의 인증, 인가)을 관리하기 위해 제공되는 프레임워크라고 설명합니다.
대표적인 특징으로는 Spring의 Filter를 이용해서 처리한다는 점이 있습니다.  
(더 자세한 설명은 [**공식문서**](https://docs.spring.io/spring-security/site/docs/3.2.10.RELEASE/reference/htmlsingle/html5/#what-is-acegi-security)를 읽어보시면 될거 같습니다.)

SpringSecurity에 대한 소개가 주제가 아니기 때문에 해당 글을 읽을때 필수적으로 필요한 개념들만 간단하게 정리하고 넘어가겠습니다.

- **SecurityContextHolder**
  - SpringSecurity에서는 기본적으로 유저의 정보를 ThreadLocal을 SecurityContext를 생성해 관리합니다. 해당 Context를 관리할 수 있는 클래스입니다.
  - Context의 생성부터 소멸을 관리합니다.
- **SecurityContext**
  - 쓰레드별로 생성되는 클래스이며, 실제 요청 유저와 관련된 정보가 담기는 Authentication 객체가 저장되는 공간입니다.
  - 요청이 끝날때 해당 Context 객체는 사라집니다.
- **Authentication**
  - 현재 요청을 보낸 유저의 실제 정보를 담고 있는 객체를 의미합니다.
  - 유저의 롤, 인증된 플랫폼 명, 유저 정보 등을 담고 있습니다.
- **AuthenticationProvider(AuthenticationManager)**
  - 요청 정보를 가지고 리소스 서버에 요청을 보내 유저 인증을 처리하는 클래스입니다.
  - AuthenticationManager와 동일한 클래스는 아니지만 Manger내부의 Provider가 실제 인증을 처리하기 때문에 여기서는 묶어서 작성했습니다.

---

## SpringSecurity는 어떻게 여러 플랫폼에 대해 유연하게 처리하는가?

제가 리팩토링에 앞서 가장 고민하던 부분은 각 플랫폼별로 요청 형태와 응답 형태가 조금씩 다른데 이걸 어떻게 깔끔하게 처리할것인가였습니다.  
SpringSecurity에서는 다음과 같은 방식으로 각각 처리했습니다.

**[요청]**
SpringSecurity에서는 각각의 리소스 서버에 대한 정보(clientId, clientSecret, 각 api uri 등등)를 ClientRegistration이라는 클래스로 관리합니다.

**1. 각각의 플랫폼에 대한 정보를 ClientRegistration 타입의 객체로 생성합니다.**

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/9e5d48f9-047c-44b3-b38f-c3a5ec7cdf72" width="600px"/><br/>

**2. 모든 ClientRegistration 객체들을 InMemoryClientRegistrationRepository 타입의 Bean에서 Map 형태로 관리합니다.**

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/ee2456b1-7f08-43c1-89c0-78d46379f074" width="600px"/><br/>

**3. 유저의 요청이 올때 해당 Repository에서 플랫폼명에 맞는 ClientRegistration 정보를 사용해 인증요청들을 처리합니다.**

**[응답]**

응답의 경우 객체의 필드에 값을 매핑을하고 있던 저의 방식과 다르게 추상화 된 User객체를 만들고 실제 데이터들은 Map형태로 저장하고 있습니다. 아래 코드에서 보이는 attributes라는 Map형태의 필드에 응답값들을 저장합니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/d11efeea-c7a6-4504-b658-7f675680af1e" width="600px"/><br/>

그리고 각 요청에서 실제 필요한 값을 Dto에 매핑하는 작업은 개발자에게 위임하고 있습니다.  
엄청 특별한 방법은 아니지만 이 코드를 보며 추상화를 어떻게 해야할지 감을 잡을 수 있었습니다.

---

## SpringSecurity가 OAuth로그인을 처리하는 과정

다음은 SpringSecurity가 OAuth 로그인을 처리하는 Flow입니다.  
이해를 돕고자 흐름도를 그렸습니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/86c7fba8-e51b-4506-9d81-67101b470739" width="600px"/><br/>

**첫번째 그림은 유저가 처음 로그인 요청을 했을 때의 Flow입니다.**  
**[1~2]** 유저가 우리의 서버에 로그인 요청을 보내면 서버에서는 리소스 서버로 redirect를 시킵니다.

- 이때 위에서 설명드린 InMemoryClientRegistrationRepository에서 ClientRegistration 객체를 찾아 정보를 얻어옵니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/7259b1d3-07b3-4d63-816a-47e0b0dc9ebb" width="600px"/><br/>

- 만약 해당하는 플랫폼명이 없다면 예외를 발생시킵니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/ac5843e1-2ebd-4c25-9281-b30acc890ede" width="800px"/> <br/>

**[3]** 리소스 서버에서 유저가 접근허용을 할 경우 parameter에 담긴 redirectUri로 authorization code와 함께 redirect 시킵니다.

- 그림에 보이시는 state값은 OAuth2 프로토콜에서 csrf 공격을 방지하기 위해 전송하는것을 권장하고 있습니다.
  Security 내부에서는 처음 요청의 state와 응답의 state값을 비교하여 다를 경우 예외를 발생시키고 있습니다.

**여기서부터는 SpringSecurity 내부의 Flow입니다.**  
_(사진이 작으면 확대해주세요)_

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/3b9e5c4a-731e-4273-b7b9-701b36e51371" />

**[4]** authorization code를 서버가 받게되면 `OAuthLoginAuthenticationFilter`의 attemptAuthentication 메서드에서 해당 요청의 처리를 맡게 됩니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/dcc3bc15-842a-45db-a3f9-3eec0207a610" width="800px"> <br/>

해당 메서드의 내부로 가보겠습니다.

> **코드 내부에서 authorizationRequest, authorizationResponse, redirectUri 객체생성 혹은 검증과 같은 코드도 있지만 이해하는데 필수적이지는 않아서 설명을 제외했습니다.**

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/3b5a6e0c-fef8-4811-a175-07ef6612233a" width="900px"> <br/>

**[5]** 다음의 메서드들을 사용하여 AuthorizationCode를 검증합니다. 존재하지 않을 경우 예외를 발생시킵니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/755872a5-b70e-4731-8580-2cc2ffdccc43" width="800px"> <br/>

**[6~7]** InMemoryClientRegistrationRepository로부터 해당 플랫폼에 맞는 ClientRegistration 객체를 조회해옵니다.

**[8]** 앞에서 설명드린 OAuthProvider의 구현체인 `OAuth2LoginAuthenticationProvider` 에게 **유저 인증**을 요청합니다.

- 파라미터로는 유저의 정보를 가져오는데 사용할 토큰을 저장할 추후 SecurityContext에 저장할 _`OAuth2LoginAuthenticationToken`_ 객체를 전달합니다.
- 현재 시점에서는 access, refresh 토큰이 null이며 authenticated 상태도 false입니다.

<img width="225" alt="oauth-11" src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/0758a840-1368-4a93-883b-a3d60cd24afa"> <br/>

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/20658e32-6612-4764-b0ef-8be36c29a049" witdh="600px"> <br/>

**[9]** 리소스서버로부터 AccessToken을 요청하는 역할은 OAuth2AuthorizationCodeAuthenticationProvider 클래스가 가지고 있게 때문에 위의 코드에서 볼 수 있듯이 다시한번 authenticate 메서드를 실행합니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/748a5d25-3963-4d77-8130-3cbcd5b7904f" width="900px"> <br/>

**[10~12]** OAuth2AuthorizationCodeAuthenticationProvider의 authenticate 메서드 내에서는 리소스서버에 accessToken 요청을 하고 있습니다. 이후 응답값을 변환하여 반환합니다.

- OAuth2AuthorizationCodeAuthenticationProvider는 내부에 **요청을 변환하는 converter**와 **resttemplate으로 요청을 보내는 client 객체**를 가지고 있습니다.

<img width="540" alt="oauth-14" src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/6f0f47f7-d15f-4399-80e8-486e12a21df9"> <br/>

**[13]** OAuth2LoginAuthenticationProvider는 응답받은 AccessToken을 UserRequest 타입의 객체로 `UserService`에게 전달합니다.

- UserRequest 타입의 객체는 내부에 ClientRegistration과 AccessToken을 가지고 있습니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/e21766b6-708e-4fa1-b3b9-061e34b15e30" width="900px"> <br/>

**[14~16]** DefaultOAuth2UserService의 loadUser 메서드 내부에서는 getResponse라는 메서드를 호출합니다. 해당 시점에 리소스서버로 유저의 정보를 요청힙니다. 이후 응답 받은 데이터를 파싱하여 추상화 된 유저 클래스로 변환한 뒤 반환합니다.

- 일반적으로 UserService는 DB에 저장하는 로직을 가지고 있기 때문에 개발자가 직접 작성하게 됩니다.
  이때 SpringSecurity에서 제공하는 DefaultOAuth2UserService를 상속받아서 작성하면 보다 응답값을 사용하여 추가 로직을 작성할 수 있습니다.이 시점에 보통 DB에 저장하는 로직 등이 진행됩니다.

**[17]** 작업이 종료되면 유저 정보를 담은 객체를 AuthenticationProvider에게 반환합니다.

**[18]** 유저 정보를 받은 OAuth2LoginAuthenticationProvider에서는 SecurityContext에 저장할 Authentication 타입의 OAuth2AuthenticationToken 객체로 변환한 뒤 반환합니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/03d46e9a-7902-4153-8781-3734154bb6ea" width="900px"> <br/>

**[19]** 마지막으로 OAuthLoginAuthenticationFilter 에서는 반환된 정보를 SecurityContext에 저장하게 됩니다.

---

## 마무리

직접 프로젝트에서 SpringSecurity를 써보지 않고 학습해서 중간중간 코드를 이해하지 못하는 상황
*(ex. Filter에서 AuthorizedClientService에 저장하는 로직 등)*들도 있었지만 이번 기회를 통해 SpringSecurity에 대한 개념과 Security에서의 OAuth 로그인을 이해할 수 있었습니다. 또한 사이드 프로젝트 리팩토링의 방향성을 얻을 수 있었습니다.
다음 포스트는 이번에 학습한 내용을 사이드프로젝트 리팩토링에 녹여낸 경험이 될 것 같습니다.

## 참고자료

- https://docs.spring.io/spring-security/site/docs/3.2.10.RELEASE/reference/htmlsingle/html5/#what-is-acegi-security
- https://www.callicoder.com/spring-boot-security-oauth2-social-login-part-2/
- https://mangkyu.tistory.com/76
- https://velog.io/@max9106/OAuth3

```toc

```
