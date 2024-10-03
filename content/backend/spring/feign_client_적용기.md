---
emoji: 🌱
title: "프로젝트에 Feign Client를 적용해보자"
date: "2022-08-13 10:00:00"
author: "서코코"
categories: Spring
---

## 서론

현재 진행하고 있는 [식당 리뷰 sns 프로젝트](https://github.com/jjik-muk/sikdorak)에서 유저 로그인 기능의 구현을 담당하고 있다.

카카오 로그인을 구현하던 중, 카카오에서 제공하는 api에 Http 요청을 보내기 위해서는 클라이언트 객체를 사용해야했고 흔히 알고 있는 **RestTemplate**과 **WebClient**를 후보에 두고 고민하고 있었다.
그러던 중 쿠킴의 소개로 **Feign Client**의 존재를 알게 되었다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/8099416e-a8ab-4a7a-9dfa-fae7a93db4ac" width="400">

---

## 💫 Feign Client란?

Feign Client란 Netflix에서 개발한 Http Client다.  
(HttpClient는 Http 요청을 간편하게 만들어서 보낼 수 있도록 돕는 객체라고 생각하면 될것 같다.)  
처음에는 Netflix에서 자체적으로 개발을 진행했지만 현재는 오픈소스로 전환했으며 SpringCloud 프레임워크의 프로젝트 중 하나로 들어가있다.

### 장점

- SpringMvc에서 제공되는 어노테이션을 그대로 사용할 수 있다. (Spring Cloud의 starter-openfeign을 사용할 경우)
- RestTemplate 보다 간편하게 사용할 수 있으며 가독성이 좋다.
- Feign Client를 사용한 통합 테스트가 비교적 간편하다.
- 요청에 대한 커스텀이 간편하다.  
  ex) 요청이 실패했을때 몇초 간격으로 몇번 재요청을 보낼것인지를 구체적으로 정할 수 있다.

### 단점

- 동기적으로 동작한다. 즉, 하나의 요청이 끝나야 다음 동작이 가능하다.  
  (이건 비동기적으로 동작해야하는 경우 단점이 될 수 있을것 같다.)

> **우리 서비스에서는 사용자 로그인 API에서만 사용하기 때문에 비동기가 지원될 필요가 없다고 판단했고  
> Feign Client를 도입해보기로 결정했다.**

---

## 💫 프로젝트에 적용

FeignClient를 사용하기 위해 먼저 build.gradle에 관련 의존성을 추가했다.

```java
//프로젝트에서 사용한 버전 정보
spring-boot : 2.7.1
spring-cloud : 2021.0.3
spring-cloud-openfeign : 3.1.3
```

```java
ext {
	springCloudVersion = '2021.0.3'
}

//...

dependencyManagement {
	imports {
		mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
	}
}

//...
dependencies {
	implementation 'org.springframework.cloud:spring-cloud-starter-openfeign'
}

```

- **ext** : gradle 내에서 사용할 변수를 설정할 수 있다. 여기서는 springCloudVersion을 변수로 관리하도록 했다.
- **dependencyManagement** : 사용할 의존성의 버전을 명시해두면 dependencies에서 실제 의존성을 작성할때 버전을 따로 작성하지 않아도 위에 명시된 버전으로 가져온다.

의존성을 가져온 뒤 Feign Client를 사용하여 API 호출을 담당할 클라이언트 인터페이스를 만들었다.  
만드는 방법은 간단한데 클라이언트를 인터페이스로 만들고 내부에 호출할 메서드만 작성하면 된다.

```java
//FeignClient를 사용한 코드

@FeignClient(name = "oauth-token-client", url = "https://oauth-server.com")
public interface OAuthTokenClient {

    @PostMapping("/oauth/token")
	OAuthTokenResponse getAccessToken(@RequestParam(value = "grant_type") String grantType,
                                      @RequestParam(value = "client_id") String clientId,
                                      @RequestParam(value = "redirect_uri") String redirectUri,
                                      @RequestParam(value = "code") String code);
}
```

- **@FeignClient** : 앱이 런타임 시 해당 어노테이션이 붙은 인터페이스를 토대로 실제 구현체를 만든다.
  - name : 실제 구현체가 Application Context에 빈으로 등록될때 이름으로 사용된다.
  - url : 요청을 보낼 엔드포인트를 의미한다.
- **@PostMapping** : 해당 HttpMethod로 요청을 전송한다.
- **@RequestParam** : 요청 시 함께 보낼 파라미터들 설정한다.
  - 메서드의 파라미터에 @RequestParam, @RequestHeader 등의 어노테이션을 사용하지 않으면 기본적으로 요청의 Body에 파리미터의 값들이 들어간다.

코드를 작성하고나니 의문이 생겼다.

> **어떻게 SpringMvc의 어노테이션을 사용할 수 있는걸까?**

찾아보니 FeignClient는 빈으로 생성될 때 설정된 configuration 을 읽어서 생성되는데 configuration 내부에는  
Client 생성 시 사용할 Decoder, Encoder, Logger, Contract 등을 빈으로 등록하는 코드가 담겨있었다.

이때 Client에 따로 Configuration 설정을 해주지 않으면 디폴트인 **FeignClientsConfiguration** 를 사용해서 생성하는데 default로 적용된 Contract는 SpringMvcContract였고 덕분에 SpringMvc의 어노테이션을 사용할 수 있었다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/70687782-c66c-4412-80a9-e8b3126a1e45" width="1000">

- decoder, encoder, logger도 모두 Spring이 사용하는 객체들을 사용하도록 되어있다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/317c2534-6f7c-46b2-9d71-53731eaed5bb" width="600">

이후 서비스의 로직에서는 만든 클라이언트 객체를 빈으로 주입받아 사용했다.

```java
@Service
@RequiredArgsConstructor
public class OAuthService {

    private final OAuthTokenClient oAuthTokenClient;

    //...

    public JwtToken login(String code) {
        OAuthTokenResponse oAuthTokenResponse = getOAuthAccessToken(code);

        //...
    }

    private OAuthTokenResponse getOAuthAccessToken(String code) {
        return oAuthTokenClient.getAccessToken(
                oAuthProperties.getGrantType(),
                oAuthProperties.getClientId(),
                oAuthProperties.getRedirectUri(),
                code);
    }
}
```

FeignClient는 SpringBootApplication이 실행될때 @FeignClient 어노테이션이 붙은 파일들을 읽어서 구현체를 만들기 때문에 앱 구동시 어노테이션을 읽을 수 있게 @EnableFeignClients 어노테이션을 붙여주었다.

```java
@SpringBootApplication
@EnableFeignClients
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}
```

아래는 위의 설정을 마치고 실제 OAuth 서버로 요청을 보냈을때의 요청/응답 로그다.  
해당 로그가 출력되려면 프로젝트의 로깅 레벨은 DEBUG 로, FeignClient의 로깅 레벨은 FULL로 설정되어 있어야 한다.

```java
//application.yml
logging:
  level:
    com.project: debug

feign:
  client:
    config:
      default:
        loggerLevel: FULL
```

```json
//요청
---> POST http://oauth-server/oauth/token?grant_type=authorization_code&client_id=1234&redirect_uri=redirectUri&code=code HTTP/1.1
Content-Type: application/x-www-form-urlencoded;charset=utf-8
---> END HTTP (0-byte body)

// 응답
<--- HTTP/1.1 200 OK (131ms)
access-control-allow-headers: Authorization, KA, Origin, X-Requested-With, Content-Type, Accept
access-control-allow-methods: GET, POST, OPTIONS
access-control-allow-origin: *
cache-control: no-cache, no-store, max-age=0, must-revalidate
connection: keep-alive
content-type: application/json;charset=utf-8
date: Sat, 13 Aug 2022 02:48:13 GMT
expires: 0
transfer-encoding: chunked
x-content-type-options: nosniff
x-frame-options: DENY
x-xss-protection: 1; mode=block
response-body: {
  "token_type":"bearer",
  "access_token":"accessToken",
  "expires_in":43199,
  "refresh_token":"refreshToken",
  "refresh_token_expires_in":25184000,
  "scope":"account_email profile"
}
<--- END HTTP (190-byte body)
```

아래는 추가적으로 해준 설정들이다.

## 🛠 커스텀한 Configuration 설정

### 1. 공통 헤더적용을 위한 Configuration

- 요청에 content-type 헤더가 기본적으로 필요해서 configuration 파일을 만들었고 Client 객체에 적용했다.
- 요청을 가로채서 헤더를 세팅하는 requestInterceptor를 빈으로 등록하면 된다.

```java
public class FeignClientHeaderConfiguration {

    public static final String APPLICATION_FORM_URLENCODED_UTF8_VALUE =
        MediaType.APPLICATION_FORM_URLENCODED_VALUE + ";charset=utf-8";

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> requestTemplate.header(HttpHeaders.CONTENT_TYPE, APPLICATION_FORM_URLENCODED_UTF8_VALUE);
    }

}
```

### 2. FeignClient Exception을 서비스 예외로 처리하기 위한 Configuration

- Feign Client를 통한 요청이 실패했을 경우 OAuthServer에서의 예외가 발생했다는 메세지를 사용자에게 전달하고 싶었고, 커스텀한 ErrorDecoder를 빈으로 등록하는 configuration을 Client 객체에 적용했다.

```java
@Slf4j
public class FeignClientOAuthErrorConfiguration {

    @Bean
    public ErrorDecoder decoder() {

        return (methodKey, response) -> {
            log.error("{} 요청이 성공하지 못했습니다. requestUrl: {}, requestBody: {}, responseBody: {}",
                    methodKey, response.request().url(), FeignClientResponseUtils.getRequestBody(response), FeignClientResponseUtils.getResponseBody(response));

            return new OAuthServerException();
        };
    }
}
```

**위의 Configuration들을 적용한 코드**

```java
//적용
@FeignClient(name = "oauth-token-client", url = "oauth-server", configuration = {FeignClientHeaderConfiguration.class, FeignClientOAuthErrorConfiguration.class})
public interface OAuthTokenClient { ... }
```

이때 주의할 점으로는 configuration 파일에 **@Configuration 어노테이션을 붙이는것을 지양**해야한다.
해당 어노테이션을 붙이게 되면 컴포넌트 스캔이 발생하는 시점에 빈으로 등록되어 모든 FeignClient에 적용된다.

- 현재 서비스에서는 모든 요청에 대해 적용할 decoder라서 어노테이션을 붙일까 고민했지만 변경사항이 발생할 수 있기에 직접 configuration을 설정해줬다.

### 3. url을 application.properties에서 관리 후 적용

url을 하드코딩 하기보다는 프로퍼티에서 관리하는것이 변경이 발생했을때 변경사항을 적용하기 편리하다.

아래와 같은 방식으로 작성하면 application.properties에서 해당 프로퍼티를 읽어온다.

```java
@FeignClient(name = "token-client", url = "${oauth.kakao.service.token_url}")
public interface OAuthTokenClient { ... }
```

## 💫 마무리

이번에 FeignClient를 어노테이션만으로 요청에 필요한 모든 설정을 마칠 수 있다는 점에서 이전에 RestTemplate, WebClient를 사용했을때와 비교해 너무 간편하다는 느낌을 받았다.
물론 추가적인 설정 없이는 비동기적으로 동작하지 않기에 WebClient를 대체할 수는 없지만 특별히 비동기적인 동작이 필요없다면 FeignClient를 사용하지 않을까 싶다.

또한 WireMock을 함께 사용하면 테스트도 쉽게 할 수 있는데 이 내용은 다음 글에서 이어서 작성하려고 한다.

```toc

```
