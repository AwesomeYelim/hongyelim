# go lang 에서 channel 사용시 발생할 수 있는 이슈들 정리

- 기본적으로 채널은 가득 찰 경우 무조건 블로킹 된다.
- channel 은 크기지정을 안했을때 무조건 0 이다.

## channel 크기 0일때 발생할수 있는 이슈들

- 채널크기 미지정시 버퍼링이 없는 블로킹 채널이 생성
- 해당 채널에는 값을 전송할 때 수신자가 대기하고 있어야 함(아니면 데드락이 발생)

1. deadlock 현상 발생

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	ch1 := make(chan int)
	slInt := make([]int, 10)

	go func() {
		// ch1 에 순차적으로 할당을 해줌
		for i, _ := range slInt {
			time.Sleep(1 * time.Second)
			ch1 <- i + 1

		}
		//close(ch1) // 대기조로 남아있는 서브루틴으로 인한 deadlock을 방지하기 위해 채널을 닫아준다.
	}()

	// 대기조로 남아있는다.
	for val := range ch1 {
		fmt.Println(val)
		time.Sleep(time.Second)
	}
	fmt.Println("끝이야 ~!")
}
```

2.  성능 이슈

- 블로킹 현상이 일어남에 따른 추가 지연시간

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	c := make(chan struct{})
	go func() {
		time.Sleep(2 * time.Second)
		<-c
	}()
	start := time.Now()
	c <- struct{}{} //  여기서 블로킹 현상이 일어납니다
	elapsed := time.Since(start)
	fmt.Printf("Elapsed: %v\n", elapsed) // 블로킹 현상이 일어나는 시간 산출 => ex) Elapsed: 2.0125838s
}
```

3. 메모리 누수

- 무한루프내 채널에 값을 지속적으로 보내는 코드를 위치시킬시 채널의 버퍼는 실시간으로 채워지게 되고, 값을 빼낼 수 없는 상태라 블록이 된다.

```go

package main

import (
	"fmt"
	"time"
)

func main() {
	ch := make(chan int)
	go func() {
		i := 1
		for {
			ch <- i
			i++
			// 적절한 처리 시간을 주지 않으면 메모리 누수가 발생할 수 있음
			time.Sleep(time.Second * 2)
		}
	}()

    // 1. 종료 케이스
	value := <-ch // 여기서 종료가 될시에는 채널에서 값을 받아오지 않으면 고루틴이 블록되어 더 이상 값을 전송하지 않음 => 종료 됨 -=> 메모리 누수가 발생하지 않는다.
	fmt.Println("Received:", value)


    // 2. 미종료 케이스
	// 하지만 아래 주석 처리된 부분을 주석 해제하면 블록을 피하고 메모리 누수가 발생할 수 있음
	// time.Sleep(time.Second * 5)
}

```
