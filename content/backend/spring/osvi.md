---
emoji: 🌱
title: "OSIV란?"
date: "2022-06-23 10:00:00"
author: "서코코"
categories: Spring
---

## 서론

이번 글은 IssueTracker 프로젝트를 진행하면서 겪었던 영속성 컨텍스트와 관련된 문제를 맞닥트리면서 알게 된 OSIV라는 개념을 정리해보기 위해 작성하게 되었다.

**고민** : 미션을 진행하며 대부분의 api에서 유저의 정보가 필요할것이라고 판단했고, 매번 유저를 조회하는 코드의 중복을 제거하고 싶었다.  
**해결책** : jwt 토큰을 통해 받은 유저의 id를 사용해 인터셉터에서 미리 유저 객체를 조회한 뒤, ArgumentResolver 를 사용해서 해당 유저 객체를 컨트롤러에서 파라미터로 받아서 사용하기로 했다.

하지만 예상하지 못한 문제가 발생했다.

> **인터셉터에서 조회해서 컨트롤러에서 넘겨받은 유저 객체는 영속성 컨텍스트에서 관리해주지 않았다.**

원인은 **영속성 컨텍스트가 생성되는 시점이 우리가 등록한 인터셉터가 실행된 이후였기 때문이다**. 함께 원인을 찾던 중 영속성 컨텍스트의 생명주기에 대해 서로 다르게 알고 있었는데 토리는 "트랜잭션 단위", 나는 "요청 단위"로 알고 있었다. (학습해본 결과 둘다 맞는 이야기다.)
해당 개념을 확실하게 알아두기 위해 조금 더 파보았다.

---

## 🚴🏻 스프링에서의 영속성 컨텍스트 생명 주기

컨테이너에서 관리하는 EntityManager를 사용하는 경우 영속성 컨텍스트의 생명주기는 컨테이너에 의해 관리되는데, 스프링 컨테이너는 기본적으로 트랜잭션 단위로 영속성 컨텍스트를 관리한다.
즉, 하나의 트랜잭션이 시작할때 영속성 컨텍스트가 생성되고 트랜잭션이 종료될 때 영속성 컨텍스트도 함께 종료되며 보통은 서비스 레이어에서 트랜잭션의 시작과 종료가 이루어지게 된다.
이 말은 곧 서비스 레이어에서만 영속성 컨텍스트에 접근할 수 있다는 의미이다. 여기서 한가지 질문이 생긴다.

> **영속성 컨텍스트가 종료된 이후에 뷰 레이어에서 사용하던 지연로딩은 어떻게 가능한걸까?**

말로만 설명하면 이해가 안될것 같아서 간단한 예시 코드를 작성해봤다.

```java
public class Issue {
...
	@OneToMany(mappedBy="issue")
	private List<Comment> comments = new ArrayList<>();
...
}

public class IssueDto {
	...
	private List<CommentDto> comments = new ArrayList<>();

	public IssueDto (Issue issue) {
		this.comments = convertCommentsToCommentsDto(issue.getComments());
	}

	public List<CommentDto> convertCommentsToCommentsDto(List<Comment> comments) {
		return comments.stream()
				.map(CommentDto::new)
				.collect(Collectors.toList());
	}
}


//Service
@Transactional
public class IssueService {
...
	public Issue findIssue() {
		Issue issue = issueRepository.find();
		return issue;
	}
...
}

//Controller
public class IssueController {

	@GetMapping("/issue")
	public IssueDto getIssue() {
		return new IssueDto(issueService.findIssue());
	}
}

```

### <동작과정>

1. 사용자가 이슈를 조회한다.
2. 서비스에서 Issue 엔티티 객체를 찾아온다.
3. 조회한 Issue 엔티티 객체를 Controller에서 IssueDto 형태로 변환해서 리턴한다.
4. IssueDto 내부에서 변환하는 과정에서 comments 리스트에 접근하는데 이때 지연로딩이 발생한다.

분명 영속성 컨텍스트가 트랜잭션 단위로 관리된다면, 영속성 컨텍스트는 종료된 상태일텐데 어떻게 지연로딩이 발생할까?
그건 바로 OSIV 때문이다.

---

## 💫 OSIV란?

Open-Session-In-View의 약자인데, 한마디로 뷰 레이어에서도 세션을 열어두겠다는 의미다.
(JPA에서는 EntityManager, JPA의 구현체인 Hibernate에서는 Session이라고 부른다.)

OSIV를 사용할 경우 사용자의 요청이 발생하면 영속성 컨텍스트가 생성되고 요청이 종료될때 컨텍스트도 종료된다.
즉, 생명주기가 트랜잭션 단위 -> 요청 단위 로 변경되는 것이다.

스프링 부트에서는 기본적으로 OSIV 설정을 true로 설정해준다. 이 개념을 모른다면 나처럼 영속성 컨텍스트는 원래 요청단위로 생성되는것이라고 알고 있을 수 밖에 없다

> **설정을 바꾸려면 application-properties에서 false로 변경해주면 된다.  
> false로 설정하면 트랜잭션 단위로 관리된다.**

```java
//application-properties

spring.jpa.open-in-view=false
```

## 💫 OSIV의 장/단점

장점으로는 앞서 보았던 뷰 레이어에서도 지연로딩을 사용할 수 있게 된다는 장점이 생긴다.

하지만 동시에 단점도 존재하는데 영속성 컨텍스트가 존재한다는 것은 하나의 DB 커넥션을 사용한다는 것이다. 사용자의 요청을 처리하는 스레드의 개수에 비해 DB 커넥션의 개수는 적다. 즉, 트래픽이 많은 서비스 같은 경우 하나의 요청에서 커넥션을 너무 오래 잡고 있어서 서비스 장애로 이어질 수 있다. (특히 해당 요청 내에서 I/O작업과 같이 시간이 소요되는 작업이 발생할 경우, 그만큼 커넥션을 오래 잡고 있게 된다.)
또한 하나의 요청에서 2개 이상의 트랜잭션이 발생했을 경우, 동일한 영속성 컨텍스트를 공유하기 때문에 기존에 영속상태에 있던 엔티티를 의도치 않게 변경할 수 있다는 위험성도 존재한다.

## 🤔 마무리

이번 기회를 통해 OSIV에 대해 알게 되었다.
OSIV를 사용하는것에 대해 좋고 나쁘고는 없는것 같다. OSIV를 켜두면 편하게 어디서든 지연로딩을 통해 접근할 수 있지만, 성능이슈가 발생할 수 있으며 안정성에도 문제가 생길 수 있다. 반대로 꺼두면 성능적인 안전성은 가져갈 수 있지만, 뷰 레이어에서 지연로딩이 지원되지 않기 때문에 fetch join을 통해 엔티티를 조회할 때 미리 데이터를 가져와야한다.
결국 각 서비스의 특성에 맞춰서 사용하면 될 것 같다.

```toc

```
