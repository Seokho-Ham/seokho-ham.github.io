---
emoji: 🌱
title: "여러 플랫폼에 대응할 수 있는 OAuth 코드로 개선하기"
date: "2023-06-04 10:00:00"
author: "@seokhoho"
categories: Spring
---

## 서론

[이전 글](https://seokho-ham.github.io/backend/spring/spring-security-and-oauth/)에서 SpringSecurity가 OAuth 로그인을 처리하는 과정을 디버깅을 통해 학습했습니다.

학습경험을 바탕으로 식도락 프로젝트의 기존 OAuth 로그인 코드를 개선한 과정에 대해 글을 써보려 합니다.

---

## 기존의 문제점

### 카카오 로그인에 의존적이며 확장에 닫혀있는 코드.

새로운 플랫폼을 지원하도록 확장하기 위해서는 요청을 보내는 클라이언트뿐만 아니라 비즈니스로직이 담긴 서비스 클래스까지 변경이 발생합니다. 또한 추가적으로 작성해야되는 클래스가 너무 많이 필요합니다.

- **Properties 클래스의 주입.**  
  기존의 서비스 코드에서는 카카오api 사용에 필요한 정보를 담은 KakaoProperties 클래스를 직접 주입받아서 사용하고 있었습니다. 즉, 새로운 플랫폼을 지원할때마다 주입받아야하는 클래스가 늘어나야 했으며 요청 형태에 따라 조건문으로 구별해서 사용해야 했습니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/dd3db9d1-87a2-4d29-b8e9-04204891c8e6" width="600px"> <br/>

<img width="589" alt="re-2" src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/13ef419f-3822-445a-97bc-f3cb0e5bc121"> <br/>

- **Response 객체.**  
  응답을 담든 Response 객체가 카카오의 응답형태에 종속적이었습니다.
  중요한건 서버에 저장할 도메인 객체인 User 클래스이지만 기존 구조에서는 이와 직접적으로 관련없는 Response 클래스를 각 플랫폼별로 만들어야했습니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/07d9b671-3cc2-48c4-9d49-2c7cf9321ead" width="800px"> <br/>

- **Client 객체**  
  요청을 보내는 클라이언트 객체가 카카오 api에 종속적이었습니다.
  플랫폼을 늘리기 위해서는 해당 코드가 동적으로 동작할 수 있도록 개선해야했습니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/e21b50c1-3870-43be-8190-f046251ed627" width="800px"> <br/>
<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/5f525099-d69b-43a5-befd-c7f30b08a0b5" width="800px"> <br/>

---

## 개선 과정

### 1. 구성정보 객체 추상화 및 동적사용

각각의 플랫폼에 맞는 Properties 클래스를 일일이 만들고 매번 이를 직접 주입받아서 사용하는건 좋은 방법이 아닌것 같습니다.

이를 개선하기 위해 SpringSecurity의 `InMemoryClientRegistrationRepository` 클래스를 참고하여 저희 서비스에서 사용할 `InMemoryClientRegistrationRepository` 를 직접 작성했습니다.  
(해당 내용이 궁금하다면 [이전 글](https://seokho-ham.github.io/backend/spring/spring-security-and-oauth/)을 참고해주세요.)

- 인메모리가 아닌 외부 환경을 이용하는 상황을 대비해 ClientRegistrationRepository 인터페이스를 두고 구현체를 사용하였습니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/5a595a57-e2dd-4adb-b8bf-128852507deb" width="600px"> <br/>
<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/8023ce0f-d6ae-4dd0-8899-b350184aa85d" width="800px"> <br/>

저장소를 만들었으니 이제는 실제 구성정보를 담는 객체를 추상화해야 합니다. OAuthClientRegistration 클래스를 작성하였고, 해당 클래스는 2가지 클래스를 조합하여 만들기로 결정했습니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/21d8ab2d-fb60-4a59-8614-51768f76dfbc" width="800px"> <br/>

Registration 객체를 만들기 위해 먼저는 clientId, secret 등을 가지고 있는 기존의 Properties 객체와 같은 클래스가 필요합니다.

다행히도 OAuth 프로토콜에서는 해당 플랫폼을 이용하기 위해 필요한 정보와 요청 형태가 표준화 되어 있습니다. 덕분에 공통된 하나의 타입의 클래스인 **OAuthRegistrationProperty** 클래스를 만들어 이를 해결하였습니다.

두번째는 **Converter 클래스**입니다.
플랫폼별로 유저정보의 응답형태가 조금씩 다릅니다. 예를들어 카카오는 유저 이름이 nickname이라는 필드로 제공되는 반면, google의 경우 name으로 제공됩니다. 이렇게 조금씩 다른 응답을 공통된 형태의 응답객체로 사용하고 싶었습니다. 이를 위해 해당 플랫폼에 맞는 Converter를 그때그때 직접 구현하기로 결정하였습니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/dcce9dd9-6fb7-40df-b4fc-f09c15d683b7" width="800px"> <br/>

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/d18b30d6-7a29-42f5-9379-2dd73fd39c5f" width="800px"> <br/>

개선 후의 구체적인 동작흐름은 다음과 같습니다.

**1.** 애플리케이션 실행 시 application.yml에 작성된 구성정보를 읽어 OAuthClientProperty 클래스들이 Map에 등록됩니다.  
이때 각 플랫폼으로부터 오는 응답을 공통된 형태의 객체로 변환해 줄 Converter 클래스도 함께 등록됩니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/242c6bc5-8678-447e-bfeb-642277846c96" width="600px"> <br/>

**2.** 프로퍼티 객체들과 컨버터 객체들을 조합하여 플랫폼별 OAuthClientRegistration 클래스를 생성하고 InMemoryClientRegistrationRepository에 등록합니다.

- 생성자에서 createRegistrationMap 메서드가 호출되고 이 시점에 Property 객체와 Converter 객체를 조합해 플랫폼별 Registration 클래스를 생성합니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/7e7a70fc-c8aa-4f21-97e8-40df4043d3cb" width="800px"> <br/>

이를 통해 기존에 특정 Property 객체를 직접 주입받아 사용하던 서비스의 코드를 제거할 수 있었으며, 각각 다른 Response 타입을 만드는 대신 Converter를 사용해 공통적으로 사용할 OAuthUserProfile이라는 클래스 타입으로 사용할 수 있었습니다.  
더 나아가 요청 형태에 따라 사용할 플랫폼 정보를 동적으로 사용할 수 있도록 개선하였습니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/a77a78db-becd-4e6f-ae81-3d7605aab337" width="800px"> <br/>

### 2. Client 객체

기존에 사용하던 클라이언트 객체를 요청할 플랫폼에 상관없이 재사용하고 싶었습니다.  
이를 위해 FeignClient 문서를 찾아보다 요청의 첫번째 인자로 URI 타입의 정보를 넘겨주면 요청 uri를 동적으로 설정할 수 있다는 사실을 알게 되었습니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/7b8b180d-9a49-45eb-befb-2bd80d738614" width="800px"> <br/>

이를 통해 서비스 코드에서는 하나의 Client 객체만으로 모든 OAuth 관련 요청을 처리할 수 있게 되었습니다.

- **getOAuthAccessToken**: 유저의 정보를 요청할때 필요한 access token을 요청하는 메서드입니다.
  필수적으로 필요한 정보를 registration으로부터 꺼내 body에 담아 요청합니다.
- **getOAuthUserInformation**: 유저의 정보를 요청하는 메서드입니다.
  (이때 kakao의 경우 응답 json의 depth가 2~3까지 들어가는 반면 github은 1입니다. 이 정보들을 평탄화하여 map에 저장하는 작업을 FeignClient Deserializer에서 합니다.)

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/7d800805-36b9-4b80-86f9-b69985f99808" width="800px"> <br/>

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/7998b377-ea0f-4d63-bda1-1536a40d2932" width="800px"> <br/>

---

## 최종 개선

아래는 결과적으로 개선된 코드입니다.

**1.** Controller 레이어에서 해당 플랫폼을 처리할 수 있는 Registration 객체를 찾아 서비스에 전달합니다.  
**2.** 서비스에서는 access token, user 정보를 차례대로 요청합니다. 이때 플랫폼 상관없이 공통된 타입의 객체로 응답을 처리합니다.  
**3.** Converter를 사용해 받은 응답으로부터 서비스에서 필요한 정보들만 뽑아 OAuthUserProfile 객체를 만든 뒤, 유저를 저장하는 로직을 처리합니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/47e00c4a-347b-4d9d-b281-40a0e5b4d498" width="800px"> <br/>

---

## 마무리

지금까지 유연한 OAuth 로그인 처리를 위해 기존의 코드를 개선한 과정을 작성해보았습니다.  
기존 코드에서 새로운 플랫폼을 지원하려고 한다면 아래와 같은 작업들이 필요했습니다.

- 새로운 Properties 작성, Client 클래스 작성
- 플랫폼의 응답을 처리할 Response 클래스 작성
- Service 객체에서 새로운 Properties 주입 후 조건문을 통한 동적 사용
  동시에 실제 비즈니스 로직이 변경되는것이 아님에도 불구하고 서비스의 코드에 변경이 반영되어야 했습니다.

하지만 개선한 뒤에는 아래 2가지 작업만 하면 새로운 플랫폼을 지원할 수 있도록 변경되었습니다.

- application.yml에 구성정보 작성
- 응답을 처리할 컨버터 클래스 작성

결과적으로 기존 코드를 직접 개선하는 경험을 통해 확장에 유연한 코드의 중요성에 대해 더 체감할 수 있었으며 리팩토링의 즐거움 또한 알 수 있었습니다.

```toc

```
