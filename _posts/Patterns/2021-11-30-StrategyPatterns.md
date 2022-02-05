---
title: '[디자인 패턴] - Strategy Patterns'
permalink: /java/pattern
categories:
  - java
  - pattern
tags:
  - java
  - 전략 패턴
toc: true
toc_label: '목차'
toc_sticky: true
---

# Strategy 패턴이란?

객체가 할 수 있는 행위들을 각각의 전략으로 만들어 놓고, 동적으로 행위의 수정이 필요한 경우 전략을 바꾸는 것만으로 행위의 수정이 가능하도록 만든 패턴을 말한다. <br>
<br>
> **문제를 해결하는 전략을 상황에 따라 쉽게 변경할 수 있다는 장점이 있다.**

<!--more-->



## 핵심 디자인 원칙


### 1. 변하지 않는 부분을 변하지 않는 부분으로부터 변하는 부분을 분리해낸다.

- 달라지는 부분을 찾아서 **캡슐화**를 진행한다.

### 2. 구현이 아닌 인터페이스에 맞춰서 프로그래밍 한다.

- 상위 형식에 맞춰서 프로그래밍을 해서 **다형성** 을 활용한다.

### 3. 상속보다는 구성을 활용한다.

- 구성이란 두 클래스를 합쳐서 사용하는 방식.


## 구조


### 1. Strategy

- 인터페이스 혹은 추상 클래스로 공통적으로 사용하는 메서드를 명시한다.

### 2. ConcreteStrategy

- 인터페이스의 구현 클래스

### 3. Context

- strategy 패턴을 이용하는 역할을 수행.
- strategy를 인자로 받아서 필드를 세팅하는 세터 메서드가 존재한다.

<br>

## Example 1 - 오리 시뮬레이션


### 기능 확장

- Duck 클래스는 상속을 통해 구현되어 있는데 "날다"라는 기능이 필요해짐.
- 오리별로 소리를 내는 방식이 달라야함

### 문제점

- 상속관계에 있는 상위 클래스에 추가하게 되면 날 수 없는 오리장난감도 날 수 있게 됨.
- 인터페이스를 만들어서 구현하면 모든 날 수 있는 오리 종류에서 기능을 구현해야함.

### 개선방법

- "날다" 와 "소리를 내다" 라는 행동은 변하지 않는다.
- "나는 행위", "소리내는 행위"를 Duck으로부터 분리해서 인터페이스로 만든다.
- Duck의 인스턴스 변수에 각각의 행위를 주입받는다.

<br>

```java
//FlyBehaviorStrategy
public interface FlyBehaviorStrategy {
    void fly();
}

public class FlyWithWingsStrategy {
    void fly() {
        System.out.println("날개로 난다");
    }
}

public class NoWingsStrategy {
    void fly() {
        System.out.println("못난다");
    }
}
```

<br>

```java
//QuackBehaviorStrategy
public interface QuackBehaviorStrategy {
    void makeSound();
}

public class QuackStrategy {
    void makeSound() {
        System.out.println("꽥");
    }
}

public class SqueakStrategy {
    void makeSound() {
        System.out.println("뀍");
    }
}
```

<br>

```java
//Duck
public class Duck {
    FlyBehaviorStrategy flyBehavior;
    QuackBehaviorStrategy quackbehavior;

    void setFlyBehavior(FlyBehaviorStrategy fb) {
        flyBehavior = fb;
    }

    void setQuackBehavior(QuackBehaviorStrategy qb) {
        QuackBehavior = qb;
    }
}
```

## Example 2 - 자동차 이동

##### 기존 기능

- 자동차가 랜덤 숫자의 값이 4 이상일 경우에만 이동해야한다.

##### 기능 변경

- 항상 이동해야한다 혹은 항상 이동하지 말아야 한다로 바뀐다면?

<br>

```java
//기존 코드
class Car {
    void move(int randomNumber) {
        if (randomNumber >= 4) {
            this.position++;
        }
    }
}

//수정 코드
interface MovingStratagy {
    boolean isMove();
}

class AlwaysMovingStrategy implements MovingStrategy {
    @Override
    boolean isMove() {
        return true;
    }
}

class Car {
    void move(MovingStrategy strategy) {
        if (strategy.isMove()) {
            this.position++;
        }
    }
}

```
