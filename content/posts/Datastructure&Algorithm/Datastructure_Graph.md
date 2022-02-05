---
title: 'Datastructure_Graph'
date: 2021-06-01T23:27:17+09:00
categories: ['자료구조']
tags: ['자료구조', 'Graph', 'Javascript']
draft: true
---

자료구조 중 Graph에 대해 학습한 내용을 정리합니다.

<br>

<!--more-->

### 그래프란?

- 비선형 자료구조
- 방향의 유무에 따라 방향 그래프(트리), 무방향 그래프로 나뉜다.
- 실생활에서의 사용처 : network, linkedin, facebook
  - facebook의 경우 각 사람이 하나의 버텍스.

### 구성

---

1. Node((Vertices)버텍스라고도 불린다) : 각 엘리먼트
2. Edge((arcs, lines)라고도 불린다) : 두개의 버텍스를 잇는 선
3. In-degree : 다른 버텍스로부터 오는 아크의 수
   - 각 버텍스는 하나 이상의 In-degree를 가질 수 있다
4. Out-degree : 다른 버텍스로 가는 아크의 수
   - 각 버텍스는 하나 이상의 In-degree를 가질 수 있다
