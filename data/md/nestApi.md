# nest Api 설계하기

## express 에서 사용했던 api를 옮겨보자

> 📍 참고

<https://github.com/ZeroCho/sleact/blob/master/API.md>

### nest cli

- nest는 컨트롤러 모듈 서비스를 생성하는 명령어를 제공함

> 📍 참고

<https://docs.nestjs.com/cli/usages#nest-generate>

```sh
# 모듈
nest g mo users
nest g mo workspaces
nest g mo channels
nest g mo dms
```

- 이렇게 하게 되면 각각 폴더내 모듈 생성후 `app.module.ts` 에 의존성 주입이 된다.

```js
// app.module.ts
...
@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    DmsModule,
  ],
  ...
})
...
```

- 이제 서비스와 컨트롤러도 같은 맥락으로 만들어 준다.

```sh
# 서비스
nest g s users
nest g s dms
nest g s channels
nest g s workspaces

# 컨트롤러
nest g co users
nest g co dms
nest g co channels
nest g co workspaces
```

- `users.controller.ts` 가 생성이 되면 다음과 같이 작성해준다.

```ts
import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { JoinRequestDto } from "./dto/join.request.dto";
import { UsersService } from "./users.service";

@Controller("api/users")
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  getUsers(@Req() req) {
    return req.user;
  }

  @Post()
  postUsers(@Body() data: JoinRequestDto) {
    this.usersService.postUsers(data.email, data.nickname, data.password);
  }

  @Post("login")
  logIn() {}

  @Post("logout")
  logout(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie("connect.sid", { httpOnly: true });
    res.send("ok");
  }
}
```

- 위에 있는 `JoinRequestDto` 타입을 만들어 보도록 하자

> `DTO (Data Transfer Object)` 란 ?

- 데이터를 전송하거나 서로 다른 계층 간에 데이터를 전달하기 위한 객체이다. 주로 비즈니스 계층과 퍼시스턴스 계층 간의 데이터 전송에 사용되며, 데이터베이스나 외부 시스템과의 통신 등에서 주로 활용

### `nest`의 `convention`

1. `hypen`이나 `camelcase` 잘안쓰고 점으로 naming
2. `export default` 를 잘 안씀
3. `interface` 잘안쓰고 `class`를 많이 씀(컴파일 이후에도 남아있어서 js단에서도 타입검증 , 벨리데이션 같은 것을 수행할 수 있다.)

- `nest` 는 di 까지는 해줘도 타입까지는 정확하게 못잡아주기 때문에 타입을 붙여줘야한다.

```ts
// user/dto/join.request.dto.ts

export class JoinRequestDto {
  public email: string;
  public nickname: string;
  public password: string;
}
```

### query string 사용법

- 아래 부분을 `nest` 에서 구현해 보자면..

<https://github.com/ZeroCho/sleact/blob/master/API.md#get-workspacesworkspacedmsidchats>

- 다음과 같이 작성

```ts
// user/dms/dms.controller.ts

import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";

@Controller("api/workspaces/:url/dms")
export class DmsController {
  @Get(":id/chats")
  getChet(@Query() query, @Param() param) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
  }

  @Post(":id/chats")
  postChat(@Body() body) {}
}
```

```ts
// user/channels/channels.controller.ts

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('channels')
export class ChannelsController {
  @Get()
  getAllChannels() {}

  @Post()
  createChannels() {}

  @Get(':name')
  getSpecificChannel() {}

  @Get(':name/chats')
  getChet(@Query() query, @Param() param) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
  }

  @Post(':name/chats')
  postChat(@Body() body) {}

  @Get(':name')
  getAllMembers() {}

  @Post(':name/chats')
  inviteMemvbers() {}
}
Chat(@Body() body) {}
```

## API 문서 작성

- `express` 는 자유도가 너무 높아서 api 문서를 만들어 주는데 한계가... 다음패키지 설치

> 참고: <https://docs.nestjs.com/openapi/introduction>

```sh
yarn add @nestjs/swagger

```

- 다음과 같이 api 문서가 세팅된다 ~

![b_02_nestApi825](./img/b_02_nestApi825.png)

### 각 api description 작성

- 다음과 같이 각 `api`위에 `@ApiOperation`를 달아주면

```ts
// users.controller.ts

...
export class UsersController {
  constructor(private usersService: UsersService) {}
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getUsers(@Req() req) {
    return req.user;
  }

  ...
}

...

```

- 다음과 같이 볼수 있다.

  ![b_02_nestApi80](./img/b_02_nestApi80.png)

### `Property` 작성

- `dto` 에서도 `@ApiProperty`를 달면

```ts
// user/dto/join.request.dto.ts

export class JoinRequestDto {
  @ApiProperty({
    example: "uiop01900@gmail.com",
    description: "이메일",
    required: true,
  })
  public email: string;
  ...
}
```

- 다음과 같이 확인할 수 있다.

![b_02_nestApi833](./img/b_02_nestApi833.png)

![b_02_nestApi859](./img/b_02_nestApi859.png)

### `query` 작성

- 또한 `dms`에서 다음과 같이 `@ApiQuery`를 작성해주면

```ts
// dms.controller.ts

 ...
 export class DmsController {
  @ApiQuery({
    name: 'perPage',
    required: true,
    description: '한 번에 가져오는 개수',
  })
  @Get(':id/chats')
  getChet(@Query() query, @Param() param) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
  }

}

```

- 이렇게 확인 가능하다

![b_02_nestApi846](./img/b_02_nestApi846.png)

### `tag` 작성

- `@ApiTags` 공통으로 묶어서

```ts
// dms.controller.ts

...
@ApiTags("DM")
@Controller("api/workspaces/:url/dms")
export class DmsController {}
```

- 다음과 같이 구분 `tag` 를 가질수 있음

![b_02_nestApi845](./img/b_02_nestApi845.png)

### `dto` 관리

- 자주 사용하는 `dto` 는 따로 빼서 관리를 해주는게 편함(나중에 `validation` 하는 라이브러리 붙여서 `bodyparser` 동작하게 하면서 동시에 `validation`까지 같이 할 수 있음)

```ts
// common/dto/user.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { JoinRequestDto } from "src/users/dto/join.request.dto";

export class UserDto extends JoinRequestDto {
  @ApiProperty({
    required: true,
    example: 1,
    description: "아이디",
  })
  id: number;

  @ApiProperty({
    required: true,
    example: "uiop01900@gmail.com",
    description: "이메일",
  })
  id: number;
}
```

### `dto extend` (에러 코드마다 별개로 작성해 줘야함)

- 위에 작성한 `dto` 를 `@ApiResponse`로 가져다 사용하면 된다.

```ts
// users.controller.ts

...
export class UsersController {
  constructor(private usersService: UsersService) {}
    @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDto,
  })
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getUsers(@Req() req) {
    return req.user;
  }

  ...
}

...

```

- 그럼 다음과 같이 보여짐
  ![b_02_nestApi936](./img/b_02_nestApi936.png)

## `custom decorator` 만들기

- `contorller` 안에 req, res 를 사용하는것은 왠만하면 지양해야한다고 했었음(의존성 관련해서, 나중에 festify 나 Koa로 쉽게 건너갈수 있음/ 중복제거) => `custom decorator` 사용해서 해결할 수있음

- 다음과 같이 작성이후 `users.controller.ts` 의 `@Req() req` => `@User() user` 로 `req` => `user` 로 바꿔준다.

```ts
// common/decorator/user.decorator.ts

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
```

```ts
// common/decorator/token.decorator.ts

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Token = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const res = ctx.switchToHttp().getResponse(); // 이런식으로 실행 컨텍스트에 접근이 가능하면 이 함수 안에서 동시에 http, rpc 서버 정보 등을 가져올수 있고 웹소켓이랑 http 통신을 쉽게 해준다.
  return res.locals.jwt;
});

// 이것도 다음과 같이 사용가능함
// @Token() token
```

## `interceptor` 사용하기

- aop 관점으로 개발하게 된다.

> AOP

- AOP는 관점 지향 프로그래밍을 의미한다. 이는 모듈성을 높이고 소프트웨어 개발에서 교차 관심을 촉진하는 것을 목표로 하는 프로그래밍 패러다임이다.

기존 객체 지향 프로그래밍(OOP)에서는 로깅, 보안 또는 트랜잭션 관리와 같은 문제가 코드베이스 전체에 분산되어 관리 및 유지 관리가 더 어려워지는 경우가 많았다.

![b_02_nestApi1126](./img/b_02_nestApi1126.png)

- `middleware/logger.middleware.ts` 을 보게 되면 `controller 전` 과 `controller 후` 둘을 동시에 담당하고 있음 => 이런것들을 nest 의 `interceptor` 로 그대로 구현 할 수 있음

- `controller` 에서 `return 한 값`도 가공을 해줄수 있음

```ts
// common/interceptors/undefinedToNull.interceptor.ts

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // 전 부분
    // return next.handle().pipe(map((data) => ({ data, code: 'SUCCESS' })));
    return next.handle().pipe(map((data) => (data === undefined ? null : data)));
  }
}
```

- 적용은 다음과 같이 가능하다.

```ts
// users.controller.ts

...
@UseInterceptors(UndefinedToNullInterceptor) // 전체 적용하려면 여기 위치시킴
@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  ...
}
...
```

```ts
...
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(UndefinedToNullInterceptor) // 개별 적용
  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDto,
  })
  ...
}
...
```

- `undefinedToNull.interceptor.ts` 에서 사용한 `rxjs` 는 다음을 참고하자

<https://rxjs.dev/guide/operators>
