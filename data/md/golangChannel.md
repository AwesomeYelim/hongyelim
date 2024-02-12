# Go lang 에서 channel 방식 다뤄보기

## 00. channel 이란 ??

- `channel` 은 고루틴 간의 메세지를 전달할 수 있는 `메시지 큐(Thread-safe queue)` 이다.

## 01. 생성

다음과 같이 `make()` 로 채널 인스턴스를 생성할 수 있다.

```go
var msg = make(chan string)
```

## 02. 데이터 전달

`<-` 연산자를 통해 채널에 데이터를 전달 할 수 있다.

```go
msg <- "안녕"
```

## 03. 데이터 사용

반대로 `<-` 연산자를 통해 채널에서 데이터를 추출할 수 있다.

```go
msgCopy := <- msg
```

## 04. 채널 크기

### 4-1 채널 크기가 설정되어있지 않은 경우

❓ 다음과 같이 일반적인 변수처럼 할당후에 바로 사용을 해본다고 하면 무슨일이 생길까?

```go
package main

import "fmt"

func main() {
	var msg = make(chan string)

	msg <- "안녕"

	fmt.Println(<-msg)
}
```

다음과 같은 `deadlock` 현상을 마주하게 되는데 그 이유는 `channel` 에는 크기 개념이 존재하기 때문이다. => 사이즈를 지정해주지 않으면 기본 생성되는 `channel` 인스턴스 크기는 0 이된다. `make(chan string, 0)`

![b_golangChannel_33531](./img/b_golangChannel_33531.png)

🍄 다음과 같이 사이즈 지정시 예상한 결과가 잘 나오게 된다.

```go
package main

import "fmt"

func main() {
	var msg = make(chan string, 1)
	msg <- "안녕"
	fmt.Println(<-msg)
}

// 안녕
```

#### a. channel값 사용 => go routine 사용한 경우

다음과 같이 어디로 튈지 모르는 channel로 인해 `WaitGroup`을 지정하여 대기시점 및 종료시점을 설정해 주었다.

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	var wg sync.WaitGroup

	ch := make(chan int)
	slInt := make([]int, 10)

	wg.Add(1)
	// 대기조로 남아있는다.
	go func() {
		defer wg.Done()
		for val := range ch {
			fmt.Println(val)
			time.Sleep(time.Second)
		}
		fmt.Println("끝이야 ~!")
	}()

	// ch1 에 순차적으로 할당을 해줌
	for i, _ := range slInt {
		ch <- i + 1
	}
	wg.Wait()

	close(ch) // 대기조로 남아있는 서브루틴으로 인한 deadlock을 방지하기 위해 채널을 닫아준다.
	time.Sleep(2 * time.Second)
}
```

#### b. channel에 값 할당 => go routine 사용한 경우

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	// 비버퍼 채널 생성
	ch := make(chan int)
	slInt := make([]int, 10)

	go func() {
		for i, _ := range slInt {
			ch <- i + 1
		}
		close(ch)
	}()

	for value := range ch {
		fmt.Println(value)
		time.Sleep(time.Second)
	}
	fmt.Println("끝이야 ~!")
}

```

## 05. go routine 과의 상호 작용

하지만 아까전 [channel의 개념](#channel-이란)을 다시한번 살펴보면 go routine 간에 메세지를 전달할 수 있는 `메시지 큐` 라고 하였다.

❓ 그렇다면 channel을 통한 go routine 간에 상호작용은 어떻게 할수 있을까 ?

다음과 같은 크기가 지정되지 않은 channel 에 할당이전 고루틴을 사용하여 값을 프린트 해주었다.

```go
package main

import (
	"fmt"
)

func main() {
	msg := make(chan string)

	go func() { // 1. 할당이전 고루틴은 대기상태
			fmt.Println("바로 이맛이야~")
			fmt.Println(<-msg) // 3. 아래에서 할당이후 값을 프린트 해준다.
	}()

	msg <- "안녕" // 2. 할당

}

// 바로 이맛이야~
// 안녕
```

### go routine 내 두개의 서브 go routine에서의 동작 방식

❓ 다음과 같이 두개의 서브 고루틴에서의 동작방식은 어떻게 될까?

1. 크기를 설정하지 않은 경우

```go

package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	ch := make(chan int)
	var wg sync.WaitGroup

	wg.Add(1)
    // go routine 1
	go func() {
		defer wg.Done()
		var i int
		for {
			time.Sleep(1 * time.Second)
			fmt.Println("go-1-할당전 : ", i)
			ch <- i
			fmt.Println("go-1-할당후 : ", i)
			i++

		}
	}()
	wg.Add(1)
    // go routine 2
	go func() {
		defer wg.Done()
		for {
			test := <-ch
			fmt.Println("go-2-값꺼냄 : ", test)
			time.Sleep(2 * time.Second)
		}
	}()

	wg.Wait()
}

```

다음과 같이 예상한 순차적 진행이 일어나는것을 볼수 있다.

![b_golangChannel_51214](./img/b_golangChannel_51214.png)

하지만 위에 (바로 꺼내쓰는)동작 방식과는 다르게 데이터의 전송과정중 비동기 적인 흐름으로 우리는 메세지 큐 그 자체를 만들어(쌓아놓은 뒤) 데이터 FIFO 전송방식을 따라가야 하는 경우들이 있는데 그럴때에는 사이즈를 지정해서 관리해주면된다.

2. 크기를 지정한 경우

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	size := 3
	ch := make(chan int, size)
	var wg sync.WaitGroup

	wg.Add(1)
	go func() {
		defer wg.Done()
		var i int
		for {
			time.Sleep(1 * time.Second)
			fmt.Println("go-1-할당전 : ", i)
			ch <- i
			fmt.Println("go-1-할당후 : ", i)
			i++
			if size == len(ch) {
				fmt.Println("행행 : ", len(ch))
			}
		}
	}()
	wg.Add(1)
	go func() {
		defer wg.Done()
		for {
			test := <-ch
			fmt.Println("go-2-값꺼냄 : ", test)
			time.Sleep(2 * time.Second)
		}
	}()

	wg.Wait()
}

```

이렇게 되면 중간에 행이 걸리는 순간이 있지만 go routine 두개를 사용하므로써 순차적인 값사용이 가능한것을 볼수 있다.
