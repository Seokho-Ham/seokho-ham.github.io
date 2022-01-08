---
title: "Java 빌드 도구"
date: 2022-01-08T21:14:30+09:00
featuredImage: /images/gradle-logo.png
categories: ['빌드도구']
tags: ['빌드 도구', 'Gradle']
draft: false
---


<br>

<!--more-->

> 인텔리제이를 사용해서 개발을 할때마다 gradle이 뭔지, junit 라이브러리는 어떻게 가져오는건지 궁금했었는데 이참에 간단하게 정리해본다. 

<br>

## 빌드와 빌드 도구

---

보통 우리가 사용하는 프로그래밍 언어는 사람이 알아볼 수 있는 형태로 작성한다. 개발한 앱을 컴퓨터에서 구동하기 위해서는 변환이 필요한데 Java의 경우 개발자가 작성한 **소스코드**(.java 파일)를 1차적으로 **바이트코드**(.class 파일)로 변환을 해야하고 이 과정을 **컴파일**이라고 한다.
컴파일 결과로 생성된 바이트코드는 실행에 필요한 외부 라이브러리등의 외부 리소스와 함께 하나의 **압축파일**(.jar)로 만들어지는데 이 과정을 **링킹**이라고 한다.

앞서 말한 일련의 과정을 **빌드**라고 한다.

이전에는 이런 빌드 작업을 개발자가 일일히 해서 압축 파일을 폴더에 직접 넣어줘야했다. 이런 번거로운 작업들을 편하게 하기 위해서 빌드 작업을 자동화한 프로그램이 나왔고 이것이 바로 **빌드 도구**다.

<img width="820" src="https://user-images.githubusercontent.com/57708971/148648933-dd42f270-28bf-4e77-9d90-1f736fe75488.png">


<br>

## 빌드 도구가 하는 일

---

빌드도구가 해주는 일은 빌드 뿐만 아니라 필요한 **의존성을 다운로드 하는 작업**, **코드를 테스트 하는 작업**, **저장소에 저장하고 배포하는 작업** 등이 있고 덕분에 현재는 애플리케이션의 품질을 높이는데 더 집중할 수 있게 된 것 같다.


<br>

## 빌드 도구의 종류

---

빌드 도구에는 3가지가 있는데 순서대로 설명하려고 한다.

#### 1. Ant

Ant가 3가지 중 가장 먼저 개발된 빌드도구였다.(Make는 제외)  
xml을 사용해서 빌드 스크립트를 작성했으며 개발자가 직접 소스코드의 위치, 빌드된 파일이 저장될 위치 등 개발자가 자유롭게 설정할 수 있지만 이런 높은 자유도가 역으로 번거로운 일이 되어갔다. 또한 앱의 규모가 커질수록 스크립트는 복잡해졌고, 이런 한계점들을 보완해서 나온것이 Maven이다.

#### 2. Maven

Maven은 Ant의 많은 부분들을 보완되어서 나왔다. 특징으로는 빌드의 각 단계를 관리하는 **빌드 생명주기**와 빌드 설정에 대한 정보들을 모델화해서 작성된 있는 **pom.xml**이 도입되었다.   
의존관계를 설정할 수 있었으며 네트워크를 통해 외부 라이브러리를 가져와 중앙 저장소에 저장하는 기능을 제공하였다.

#### 3. Gradle
Gradle은 Ant와 Maven의 장점들을 모아서 나온, 현재 가장 많이 사용되는 빌드 도구다. 특별한 점으로는 xml이 아닌 **Groovy**라는 스크립트 언어를 통해서 작성하는데, 스크립트 언어이기 때문에 컴파일이 필요하지 않고 가독성 또한 좋아졌다. 또한 설정을 주입하는 방식으로 동작하며 `build.gradle` 파일에 작성함으로써 손쉽게 설정할 수 있다.

<br>

## Gradle 간단 정리

---

Gradle을 사용해서 자바 프로젝트를 생성하면 아래의 이미지와 같이 프로젝트 뼈대를 만들어준다. 여러가지 폴더가 있지만 실질적으로 신경써야 할 부분은 2가지다.
- `src` : 실제 프로그램의 구현 코드가 들어가는 폴더다. 실제 구현 코드가 들어가는 main 폴더와 test코드가 들어가는 test 폴더로 나뉘어진다.
- `build.gradle` : gradle의 설정 정보를 작성하는 파일이다. 사용되는 저장소, 의존성 등의 정보가 담겨있다.

<img width="488" src="https://user-images.githubusercontent.com/57708971/148647502-a40d8988-0716-4a90-a3bc-5b386c9b0393.png">

<br>
<br>

아래 사진이 build.gradle 파일의 내부다.
- `plugins` : gradle의 플러그인을 설정하는 부분이다. 기본적으로 'application'이 작성되어 있으며 자바프로그램을 실행시킬 수 있는 run task를 제공한다.
- `repositories` : 외부 라이브러리를 받아와서 저장해두는 저장소를 설정하는 부분이다. 기본적으로 mavenCentral로 설정되어 있으며, 다운로드 받은 외부 라이브러리가 저장되고 필요할때 불러오는 공간이다.
- `dependencies` : 의존성을 관리하는 부분이다. 현재 사진에서는 테스트에 필요한 라이브러리와 Java 앱을 run 하는데 필요한 라이브러리를 작성해둔 상태이다.
- `application` : run task 시 실행될 메인 클래스를 정하는 부분이다.
- `task` : gradle은 task 단위로 실행되는데 test task를 진행할때 사용하는 플랫폼이 지정되어 있다.

<img width="693" src="https://user-images.githubusercontent.com/57708971/148647498-e536f609-5f04-41ca-a695-c613d469ef9b.png">

## 마치며
정말 깊게 파기보다는 가볍에 내가 사용하는게 무엇인지 학습했다. 다음에는 공식문서를 번역해보면서 정리하는걸 목표로 한다.

## 참고 자료

> [Gradle - 기본다지기](https://velog.io/@sa1341/Gradle-%EA%B8%B0%EB%B3%B8-%EB%8B%A4%EC%A7%80%EA%B8%B0-1%ED%8E%B8)  
> [Gradle 번역](https://velog.io/@hanblueblue/%EA%B8%B0%EC%B4%88-%EC%A7%80%EC%8B%9D-%EB%8B%A4%EC%A7%80%EA%B8%B0-2.-Gradle)