# TCP 통신, channel 전송, UDP 통신

- 팀장님의 미션이 주어졌다..

## 진행 flow

- 진행흐름은 다음과 같다.

![b_golangChannelTcpUdp_121611](./img/b_golangChannelTcpUdp_121611.png)

1. client 서버를 각각 두개(tcp, udp)를 생성한다.
2. tcp client 에서 타이핑시 tcp server 로 전송한다.
3. server에 channel 두개(a, b)를 생성뒤 a => b 구조체로 채널을 전송한다.
4. b 채널에 있는 데이터를 udp client 로 전송시킨다.

## 진행순서

### **TCP-client**

1. 우선 **`TCP client`** 에서 통신을 위한 TCP 네트워크 주소를 생성해 줍니다.
   - `DialTCP` - TCP 소켓을 열고 원격 서버에 연결
   - 기존과 다르게 분리해서 사용하는 이유는 `remoteAddr` 를 서버주소로 고정시켜 연결이 끊겼을시 랜덤으로 port 번호가 재생성되는 것을 방지시켜주기 위함

```go
// 기존
listener, _ := net.Listen("tcp", "localhost:3000") // tcp 서버 생성

// 변경후
localAddr, _ := net.ResolveTCPAddr("tcp", "localhost:3000")
conn, _ := net.DialTCP("tcp", localAddr, &net.TCPAddr{IP: net.IPv4(127, 0, 0, 1), Port: 1234})
```

2. 다음과 같이 입력하는 함수를 따로 생성해 터미널에서 메세지를 받을수 있도록 합니다.
   - **readInput 함수**
     - `scanner` 를 선언하고, `bufio.NewScanner` 를 사용해 새로운 스캐너 객체를 만듭니다. `os.Stdin` 은 키보드 인풋을 받습니다.
     - `scan` 은 `Scan 함수`를 가지고 있습니다. 선언하여 사용자가 입력하는 메세지를 받습니다.
     - 스캔되어진 `scanner.Text()`를 리턴합니다.
   - **conn.Write**
     - 연결 객체 `conn` 의 `Write()` 함수를 사용하여 `msg` 문자열을 `byte 슬라이스`로 변환하여 전송시킵니다.

```go
for {
		fmt.Print("Enter a message: ")
		msg := readInput()
		_, err := conn.Write([]byte(msg))
		if err != nil {
			fmt.Println(err)
		}
	}

...

func readInput() string {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	return scanner.Text()
}
```

### **Server**

3. 다음과 같이 tcp 서버와 udp 서버 를 각각 생성합니다.

```go
listenAddr, _ := net.ResolveTCPAddr("tcp", "localhost:1234") // tcp 서버 생성
serverAddr, _ := net.ResolveUDPAddr("udp", "localhost:3001") // udp 생성
```

4. `a,b channel` 도 각각 생성해줍니다.

- 채널사이즈를 설정하는 이유
  `처음 채널 크기는 0` 이므로 데이터를 빼갈때 까지 대기함 => 데이터를 가져가지 않아서 프로그램이 멈추는 현상이 생긴다(deadlock)

```go
AChannel := make(chan Message, 2)
BChannel := make(chan Message, 2)
```

5.  데이터의 `송신 및 수신여부를 결정`하는 함수들을 각각 선언해 줍니다.

    - **ListenTCP**
      - TCP 패킷에서 \*\*\*\*데이터를 수신할 것이라는 명시를 해주는 함수
    - **DialUDP**

      - UDP 패킷에서 데이터를 송신할 것이라는 명시를 해주는 함수

    - 다음을 맞춰줘야지 의도한 바로 제대로 통신이 됩니다.

    ```go
    listener, err := net.ListenTCP("tcp", listenAddr)
    udpconn, err := net.DialUDP("udp", nil, serverAddr)
    ```

6.  **go routine** 3개 생성

    <details>
    <summary><b>go routine - 1</b></summary>

    - `tcp 통신`을 받아서 `a channel` 에 할당하는 함수

            - **이중 for 루프**
            - 바깥 for 문 : `for 루프` 내 `listener.Accept()` 를 위치시켜 둠으로써 연결이 끊겼을때에도 `TCP 수신`이 가능하도록 대기시켜 둡니다.
            - 내부 for 문 : 내부에 `for 루프` 에 위치시킨 `tcpconn.Read()` 를 통해 `TCP client`에서 `Write` 한 정보를 `buffer` 에 받습니다. ⇒ 연결이 되었을때 루프내에서만 통신이 이어갈 수 있도록 `for 루프` 하나를 더 생성시켰습니다.
            - `if n == 0 { break }` 받은 메세지가 없을시에는 바깥 for 루프로 빠져 나가서 다시 통신이 이루어 질수 있도록 조건식을 걸었습니다.

            - **A channel 구조체 전달**
            - Message 구조체를 사용하여 내부 text 프로퍼티에 버퍼로 받은 값을 string 타입으로 변환하여 전달해 주었습니다.

    ```go
    go func() {
            for {
                tcpconn, _ := listener.Accept()
                buffer := make([]byte, 1024)
                for {
                    n, err := tcpconn.Read(buffer)
                    if n == 0 {
                        break
                    }
                    if err != nil {
                        fmt.Println(err)
                    }
                    AChannel <- Message{Text: string(buffer[:n])}
                }
            }

        }()
    ```

    </details>

    <details>
    <summary><b>go routine - 2</b></summary>

    - **b channel 에 할당하는 함수**
    - `range AChannel` : `AChannel` 에 할당된 값이 있을때에만 `BChannel` 값을 전달하는 루프를 생성하였다.
    - 위에 tcp 통신에서 값을 받을때까지 대기조로 있는다.

    ```go
    go func() {
            for item := range AChannel {
                BChannel <- item
            }
        }()
    ```

    </details>

    <details>
    <summary><b>go routine - 3</b></summary>

    - **udp 연결루틴 생성 및 송신** 하는 함수
    - `range BChannel` : `BChannel` 에 할당된 값이 있을때만 루프가 돌수 있도록 설정해 주었다.
    - `response.Text` 를 byte 슬라이스로 만들어 송신할 `udpconn.Write()` 의 인자값으로 전달해 준다.

    ```go
    go func() {
            defer wg.Done()
            for response := range BChannel {
                msg := []byte(response.Text)
                _, _ = udpconn.Write(msg)
                fmt.Println(string(msg))
            }
        }()
    ```

    </details>

7.  그 밖에

    1. `defer listener.Close()` `defer udpconn.Close()`

       네트워크 리소스를 정리하고 해당 연결을 닫는 데 사용

    2. `var wg sync.WaitGroup` `wg.Add(1)` `wg.Wait()` `defer wg.Done()`

       `WaitGroup` 을 사용하므로써 go routine의 대기시점과 완료시점을 지정해준다.

### **UDP-client**

8. **UDP 네트워크 수신주소 설정**

   - 다음 `ResolveUDPAddr` 함수를 사용하여 수신 받을 주소를 설정해 줍니다.
   - `ListenUDP` 를 통해 `serverAddr` 에서 데이터 수신을 받을 것이라는 것을 명시해줌

   ```go
   serverAddr, _ := net.ResolveUDPAddr("udp", "localhost:3001")
   udpconn, _ := net.ListenUDP("udp", serverAddr)
   ```

9. **데이터 읽어오기**

- `ReadFromUDP` 를 통해 서버단에서 `udpconn.Write` 를 통해 전달받은 데이터를 버퍼로 읽어옵니다.
- `for 루프` 는 파일을 읽어올때 까지 대기하기 위해 감싸주었습니다.

```go
buffer := make([]byte, 1024)
	for {
		n, _, _ := udpconn.ReadFromUDP(buffer)
		message := string(buffer[:n])
		fmt.Println("Received message(UDP client)/ReadFrom:", message)
	}
```

<details>
<summary><b>고려했던 사항 & 직면했던 문제</b></summary>

1. **TCP client**
   - 직접 타이핑
   - client 에서의 송신방식
2. **[TCP server → A routine 채널전송(구조체) → B routine 채널전송(구조체)]**
   - 채널 2개 생성 (채널 통신 고려)
   - TCP 서버에서 채널에 전달방식
   - 채널끼리의 구조체로 전달방식
   - B 채널에서 UDP client 로 송신방식
3. **UDP client**
   - UDP client에서의 수신방식
4. **무한루프**
   - client 단에서 터미널 종료후 재입력시 ⇒ server 무한 루프내에서 행걸린 상태로 `Read` 해오지 못함

</detail>
