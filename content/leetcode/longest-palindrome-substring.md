---
emoji: 🧮
title: "[Leetcode] Longest Palindrom Substring"
date: '2023-01-25 10:00:00'
author: 포키
categories: Algorithms
---

### 문제
 
주어진 문자열에서 가장 긴 palindrome을 반환할것.

### 입력 및 조건

```md example1
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.
```

```md example2
Input: s = "cbbd"
Output: "bb"
```

#### 제약 조건

- 1 <= `s.length` <= 1000
- 영어로 된 문자만 포함하고 있다.

### 풀이

**첫번째 시도** : 투 포인터를 사용하여 양쪽 끝에서 좁혀가는 방식으로 풀었는데 실패했다.  
**두번째 시도** : 파이썬 알고리즘 인터뷰 책의 풀이를 보고 풀었다. 짝수, 홀수 두가지 경우를 모두 확인하며 palindrome 조건이 맞으면 그 위치부터 확장해나가는 방식이다.

```python
def longestPalindrome(s):
    def check(left, right):
        while left >= 0 and right <= len(s) and s[left] == s[right - 1]:
            left -= 1
            right += 1
        return s[left + 1:right - 1]

    if len(s) < 2 or s == s[::-1]:
        return s

    result = ''
    for i in range(len(s) - 1):
        result = max(result, check(i, i + 1), check(i, i + 2), key=len)

    return result
```

### 깨달은 점

- 파이썬의 `max`메서드에 key로 len을 넣어주면 길이를 기준으로 비교한다. sort 메서으에서 lambda를 사용하는것과 동일하다.
- 문자열 슬라이싱.