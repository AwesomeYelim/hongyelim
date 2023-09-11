# 02. 문자 하나 찾기!

**모든 문자 찾기**

1. 마침표(.) : 아무 문자 <mark>하나</mark> 와 일치

```js
const str = "Hello, my name is Yelim. I really hope you guys have good day~!";

function test(e) {
  return console.log(e.match(".lim")[0]);
}

test(str); // elim
```

2. 연속 마침표 두개 (..) : 붙어있는 문자 <mark>두개</mark> 와 일치

```js
const str = "Hello, my name is Yelim. I really hope you guys have good day~!";

function test(e) {
  return console.log(e.match("..lim")[0]);
}

test(str); // Yelim
```

3. 이스케이프(\\) 사용한 마침표(.) : 마침표(.) 자체를 찾을수 있다.

```js
const str = "Hello, my name is Yelim. I really hope you guys have good day~!";

function test(e) {
  return console.log(e.match("m\\.")[0]);
} // 역슬래시(\) 자체가 이스케이프 되므로 인식이 안되기 때문에 다른 문자를 이스케이프 해줄때는 역슬래시(\) 두번사용

test(str); // m.
```

```js
const arr = [
  "yelim1.jpg",
  "nun2.jpg",
  "dong1.xls",
  "don2.xls",
  "dong3.xls",
  "don4.xls",
  "sal.png",
  "sal2.png",
];

function test(e) {
  for (let i of e) {
    i.match("don..") && console.log(i.match("don..")[0]);
  }
}

test(arr);
// dong1
// don2.
// dong3
// don4.
```

> **역슬래시(\\)**

> 메타 문자다(문자 그대로 사용되지 않고 특별한 의미를 지니는 문자를 칭함)


|부호|기능|
| --- | --- |
|.|아무 문자 <mark>하나</mark> 와 일치|
|..|붙어있는 문자 <mark>두개</mark> 와 일치|
|\\.| 자체를 찾을수 있다.

