---
emoji: 🌱
title: "Gradle 맛보기"
date: "2022-11-20 10:00:00"
author: "@seokhoho"
categories: Review
---

이번에 식도락 프로젝트를 진행하는 과정에서 빌드 시 submodule의 파일들을 복사하는 task를 추가하는 작업을 맡았습니다.

쿠킴의 레퍼런스 덕분에 작업 자체는 수월했지만, gradle에 대해 거의 모르다보니 build와의 의존관계설정을 설정해주지 않아서 동작하지 않았던 경험이 있었습니다. 또한 Jay가 작성한 restdocs 관련 task도 설명없이는 이해하지 못했고 답답함을 느껴 이번 기회에 정리해보았습니다.

## 빌드란 무엇인가요?

개발자가 만든 애플리케이션을 컴퓨터에서 구동하기 위해서는 변환작업이 필요합니다. Java 애플리케이션의 경우 2가지 단계를 거치게 됩니다.

- **컴파일** : 소스코드를 바이트코드로 변환
- **링킹** : 바이트코드를 의존하고 있는 라이브러리들과 함께 하나의 파일로 압축하는 과정

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/a004e04c-a30a-4704-ab17-855329bd9546">

---

## 빌드 도구는 왜 필요한가요?

앞의 설명과 같이 애플리케이션을 실행하려면 먼저 **컴파일과 링킹 과정**이 필요합니다. 하나의 파일만 컴파일한다면 javac 명령어를 터미널에 쳐서 하면 되겠지만 보통 애플리케이션은 수많은 패키지와 파일들로 구성되어 있습니다.

이때 우리가 작성한 모든 클래스들에 대해 위의 방식으로 일일이 컴파일 작업을 진행하기는 어렵습니다. 더 나아가 외부의 라이브러리를 사용하고 있는 경우 해당 의존성까지 묶어서 빌드를 진행해야하기 때문에 이 작업을 매번 개발자가 하기는 어렵습니다.

이런 작업을 수월하게 하기 위해서 빌드 도구를 사용합니다.

## 빌드 도구의 종류

> **Ant도 있지만 현재는 사용하지 않기 때문에 설명에서 제외했습니다.**
> 현재 Java에서 대표적으로 사용하는 빌드도구로는 Maven과 Gradle이 있습니다.

이중에서도 오늘은 Gradle에 대해 정리해보려고 합니다.

### Maven

Maven은 가장 많이 사용하고 있는 빌드도구입니다. 아래는 현시점 사용률인데 Maven이 압도적으로 높습니다.
아무래도 오랜기간 사용되어오다보니 점유율이 높을 수 밖에 없는것 같습니다. (첫 릴리스 : 2004년)

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/293e617f-58c4-436f-b884-7a4bba2f4b53">

Maven의 특징은 다음과 같습니다.

- xml 파일로 관리한다.
- JVM에서만 동작하며 기본적으로는 Java 애플리케이션만 빌드해준다. (서드파티 플러그인을 이용하면 코틀린, 스칼라 등 다른 언어로 되어 있는 애플리케이션도 빌드가능)
- 의존성을 자동으로 관리해준다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/fe084ae6-60ed-4901-a41f-4666f15cf034">

### Gradle

Maven과 마찬가지로 대표적인 빌드 자동화 도구입니다. (첫 릴리스 : 2012년)

특징은 다음과 같습니다.

- 다양한 언어를 지원합니다.
- Maven보다 빌드 속도가 2배 가까이 빠릅니다.
- Groovy라는 동적타입 프로그래밍 언어를 사용합니다. 현재는 Kotlin으로도 가능하다고 합니다.

<br/>

## 왜 Gradle을 사용할까요?

아직 점유율 자체는 Maven이 높지만 새롭게 만드는 프로젝트들은 대부분 Gradle로 작성된다고 합니다. 여러가지 이유들이 있겠지만 가장 큰 2가지 이유는 빌드속도와 작성/가독성의 차이 때문이라고 생각합니다.

### 1. 빌드 속도

Gradle 공식문서에는 Maven과 세가지 경우에 대해서 테스트한 결과를 비교한 내용을 제공하고 있습니다.

|                               | Maven   | Gradle  |
| ----------------------------- | ------- | ------- |
| 클린 빌드                     | 26.19초 | 14.79초 |
| 재빌드                        | 25.85초 | 0.68초  |
| 코드 일부분만 수정해서 재빌드 | 4.08초  | 0.55초  |

결과는 위의 표와 같이 **2배 가까이** 차이가 나고 있습니다.
2배 가까이 차이가 나는 이유는 아래와 같습니다.

- task의 input, output을 트래킹하기 때문에 이전 빌드와 달라진점이 없다면 빌드를 진행하지 않습니다.
- 이전 빌드의 캐시를 가지고 있기 때문에 이전 빌드 결과를 가지고 변경이 발생한 클래스들만 컴파일을 진행합니다.
- gradle daemon이라는 프로세스가 백그라운드에서 동작해서 빌드의 정보들을 메모리에 가지고 있습니다.

### 2. 작성 / 가독성

Maven은 xml을 사용하기 때문에 태그로 일일이 정보를 감싸서 작성해야하며 중복되는 코드가 많습니다.

반면 Gradle은 스크립트 언어로 작성되어 작성하기도 수월하고 가독성 또한 좋습니다. 실제로 Maven에서는 이렇게 길었던 코드가 Gradle에서는 4줄로 끝났습니다.

<img width="609" src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/0bad9110-31fa-4a54-ae9f-795edcca387c">

<br/>

<img width="609" alt="gradle-5" src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/6b1ac68b-db12-49a9-80a6-9ff4aa9794a9">

<br/>

## Gradle이 빌드를 하는 과정

Gradle 세단계를 거쳐 빌드작업을 진행합니다.

- Initialization(초기화)

  - 환경변수, 빌드 시 필요한 프로젝트 등 빌드에 필요한 정보를 읽어서 Project 객체를 생성합니다.
  - 멀티 프로젝트를 지원하는데 이때 사용할 프로젝트의 목록은 settings.gradle 에 존재합니다.
    settings.gradle 이 없다면 단일 프로젝트로, 있으면 내부의 목록을 읽고 단일 / 멀티 여부를 결정합니다.

- Configuration(환경구성)

  - 초기화 과정에서 생성된 Project 객체에 맞는 빌드 스크립트가 실행되고, 실행한 task와 동일한 이름의 task를 프로젝트에서 찾습니다.
  - 이때 task 그래프를 만들고 메인 task를 위해 실행해야하는 task들의 순서를 결정합니다.

- Execution(실행) : task들을 실행합니다.

<br/>

## Task는 뭔가요?

기본적으로 Gradle은 task 단위로 동작하는데 이름 그대로 빌드 시 실행할 하나의 작업을 의미합니다. 빌드 시 Configure 단계에서 의존성에 기반해서 여러개의 task를 정의하고 실행해야하는 순서를 정한 뒤, 그래프 형태로 연결시킵니다.

<img width="422" title="하하하" src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/73486df1-44e1-4006-8005-ee69b2e4d21c">

Task는 다음과 같이 구성됩니다.

- Action : 어떤 작업을 할지를 나타냅니다.
- Input : 작업을 수행하기 위해서 필요한 입력값 (ex - 변수, 파일, 경로…)을 나타냅니다.
- Output : 작업의 결과로 영향을 받을 파일 혹은 경로를 나타냅니다.
  > **Gradle의 빌드속도가 빠른 이유는 변한값이 존재하지 않으면 이전 빌드의 결과물을 사용한다고 했는데, task의 input, output을 확인해서 변경 여부를 파악합니다. (변경된 값이 없는 경우, 해당 task는 건너뜁니다)**

<br/>

## TIP

Task는 서로 의존관계를 설정할 수 있습니다.

- dependsOn 키워드를 사용해서 의존하는 task를 설정할 수 있습니다. 의존관계를 작성하면, 반드시 의존하고 있는 task 이후에 실행됩니다. (dependsOn 이외에도 의존관계를 설정하거나 실행순서를 지정할 수 있는 다양한 메서드가 있습니다. 링크)

```groovy
secondTask {
      dependsOn firstTask
}

//or

firstTask.dependOn('secondTask')
```

Task에서 property 키워드를 사용해 동적으로 환경변수를 지정할 수 있습니다.

```groovy
taskName {
      property "key", "value"
}
```

아래 토글은 input,output이 설정되고 action이 실행되는 과정이 궁금해서 copy task의 동작 과정을 얕게 파본 내용입니다.  
(건너뛰어도 무방합니다.)

<details>
<summary>더보기</summary>

아래는 현재 진행중인 프로젝트에서 사용하고 있는 submodule의 application.yml을 복사하는 task입니다.

<img width="315" alt="gradle-1" src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/c16b3606-7382-4f83-ba42-9991fd1c897a">

**1. 가장 먼저 Copy Task 클래스입니다.**

- copy액션을 생성하는 메서드, copy작업 시 파일 경로등을 담은 스펙을 생성하는 메서드로 구성되어 있있습니다.
  <img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/d67b1b61-08b5-473f-9610-eb132218bce8">

**2. AbstractCopyTask 추상 클래스의 from, into, include 메서드를 사용해서 경로를 지정해줍니다.**

- 내부적으로는 Spec클래스들에 정보를 저장합니다.
- 여기서 MainSpec과 RootSpec은 액션을 수행하기 위해 필요한 정보들을 담고 있는 클래스들입니다.

<img width="451" alt="gradle-3" src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/21385e3c-fe5a-46c3-9ac3-9ab117036367"> <br/>
<img width="393" alt="gradle-4" src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/1b2f8b69-1d16-48eb-8e95-29876d235e5c"> <br/>
<img width="431" alt="gradle-5" src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/50ba3b3f-109c-4b47-b4e3-18005a709fd1"> <br/>

- AbstractCopyTask 추상 클래스를 보면 생성될 시 현재 구현체의 스펙을 생성하는 메서드를 호출합니다. (여기서 실제 구현체는 Copy 클래스입니다.)

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/1d6b7ec2-455a-4424-b961-6748429f6a43">
<br/>

- 아래는 Copy 구현체가 생성하는 스펙 클래스입니다.
  - 위에서 설정해준 into 경로는 해당 클래스의 destinationDir로 설정됩니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/b51d63cb-b6a1-465b-91be-4a68661adbc9">

**3. AbstractCopyTask 추상 클래스로 올라가보면 실제 copyTask가 존재합니다.**

- action을 실행시켜줄 executor와 action을 만들어줍니다. 매개변수로는 이전에 생성했던 Spec클래스와 action을 넣어줍니다.
- `@TaskAction`` 어노테이션은 실제 태스크가 실행될때 호출될 메서드를 가리킵니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/06841086-8cc4-447c-926e-95b90026c750">

- 여기서 생성되는 CopyAction은 실제로는 Copy 클래스에 있는 메서드가 생성하는 FileCopyAction클래스가 됩니다.
  <img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/9b689e0d-c480-4486-b5fb-7493a5352e85">

**4. Task가 실행되면 실제로는 FileCopyAction클래스 내부에 있는 innerClass의 메서드가 호출됩니다.**

- 아래 클래스의 processFile 메서드가 호출되고 이때 파일이 복사됩니다.

<img src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/4b1beea2-0198-40f3-a597-a1937939144c">

</details>

## Spring Boot 프로젝트의 build.gradle

Gradle에 대해 알아보았으니 이제는 SpringBoot 프로젝트의 기본 build.gradle를 간단하게 알아보고자 합니다.

<img width="634" alt="gradle-7" src="https://github.com/Seokho-Ham/seokho-ham.github.io/assets/57708971/c6cbf50b-02ba-4cc4-ace3-c404d09ca28e">

**1. plugins**

- plugin이란 일반적으로 사용되는 task들의 묶음이며 프로젝트에 추가함으로써 task를 직접 만들지 않고도 편하게 사용할 수 있습니다.
  - 예시로 java 플러그인 내부에는 대표적으로 compileJava, test 등의 task가 존재합니다. 링크
- Springboot 프로젝트를 만들면 기본적으로 java, dependency-management 플러그인을 포함합니다.

**2. sourceCompatibility**

- 소스코드를 컴파일할때 사용하는 자바 버전을 나타냅니다.

**3. repositories**

- dependencies에 있는 의존성들을 어디서 다운로드할 저장소를 지정하는 블록입니다.
- 기본적으로 maven central repository에서 다운받습니다.

**4. dependencies**

- 프로젝트에서 필요한 의존성들을 작성하는 블록입니다.
- 아래는 자주 사용되는 속성들입니다.
- 설명에 앞서서 모듈의 의존관계가 project → module2 → module1 형태로 되어 있다고 가정해보겠습니다.
  - **api** : 의존성을 가져올때는 module2가 의존하는 module1까지 가져옵니다. (module1이 필요하지 않은 경우 빌드 시간만 늘어나기 때문에 필요할 경우에만 사용해야합니다.)
  - **implementation** : 의존성을 가져올때 module2만 가져옵니다.
  - **runtimeOnly** : 실행 시점에만 필요한 의존성을 나타냅니다. 최종 빌드되는 결과물에만 포함됩니다.
  - **compileOnly** : 컴파일 시점에만 필요한 의존성을 나타냅니다. 최종 빌드되는 결과물에는 포함되지 않습니다.
  - **testImplementation** : 테스트시에만 사용되는 의존성을 나타냅니다.
  - **annotationProcessor** : 컴파일 시점에 특정 라이브러리의 어노테이션을 읽도록 설정할때 사용됩니다. 대표적으로 Lombok을 사용할때 사용합니다.

**5. test**

- test task를 실행할 때 테스트 프레임워크로 JUnit을 사용하도록 설정합니다.

지금까지 간단하게나마 Gradle의 동작 과정과 SpringBoot 프로젝트에 생성되는 build.gradle을 정리해보았습니다.

> **잘못된 정보에 대한 피드백은 언제든 환영합니다 😁**

<br/>

## 참고자료

- gradle 공식문서
- https://tomgregory.com/gradle-tutorials/
- https://tomgregory.com/gradle-task-inputs-and-outputs/
- https://docs.spring.io/spring-boot/docs/current/gradle-plugin/reference/htmlsingle/

```toc

```
