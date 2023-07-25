# axios 타입 분석

## 기본 개념

- 브라우저 => fetch
- 노드 => fetch
- axios => fetch + 여러기능 (XMLHttpsRequest) ✔ (멀티 플랫폼에서 요청 보낼수 있어서 axios 선호)

  ❓멀티 플랫폼(영어: multi-platform)

  크로스 플랫폼(영어: cross-platform) 또는 멀티 플랫폼(영어: multi-platform)은 컴퓨터 프로그램, 운영 체제, 컴퓨터 언어, 프로그래밍 언어, 컴퓨터 소프트웨어 등이 여러 종류의 컴퓨터 플랫폼에서 동작할 수 있다는 것을 뜻하는 용어이다.

- 다음과 같은 더미 사이트를 이용하여 axios를 테스트 해보자
  (테스트하기 좋은 가짜 서버)

```ts
"http://jsonplaceholder.com";
```

```ts
(async () => {
  try {
    await axios.get("http://jsonplaceholder.typicode.com/posts/1");
  } catch (err) {}
})();
```

## axios 의 타입

🚩 axios 의 타입을 추적해보면 axios type 은 class 이면서, 함수면서, 객체임

```ts
export class Axios {
  constructor(config?: AxiosRequestConfig);
  defaults: AxiosDefaults;
  interceptors: {
    request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
  getUri(config?: AxiosRequestConfig): string;
  request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
  get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  head<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  options<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  patch<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  postForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  putForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  patchForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
}

export interface AxiosInstance extends Axios {
  <T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
  <T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;

  defaults: Omit<AxiosDefaults, "headers"> & {
    headers: HeadersDefaults & {
      [key: string]: AxiosHeaderValue;
    };
  };
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: CreateAxiosDefaults): AxiosInstance;
  Cancel: CancelStatic;
  CancelToken: CancelTokenStatic;
  Axios: typeof Axios;
  AxiosError: typeof AxiosError;
  HttpStatusCode: typeof HttpStatusCode;
  readonly VERSION: string;
  isCancel: typeof isCancel;
  all: typeof all;
  spread: typeof spread;
  isAxiosError: typeof isAxiosError;
  toFormData: typeof toFormData;
  formToJSON: typeof formToJSON;
  CanceledError: typeof CanceledError;
  AxiosHeaders: typeof AxiosHeaders;
}
```

- 그래서 사용시에 다음과 같이 모양이 다름

```ts
new axios();
axios();
axios.create();
```

# catch Error

- catch error 와 같은 경우 error 타입은 unknown 으로 출력됨
  이와 같은 경우 다음과 같이 설정할 수 있지만..

```ts

// case 1
catch (err) {
    console.log((err as AxiosError).response?.data);
  }

// case 2 (AxiosError 는 class 타입이라 가능)
catch (err) {
   if (err instanceof AxiosError) {
      console.log(err.response?.data);
    }
  }

```

- 타입 자체에 assertion 을 사용하는 방법은 그리 바람직해 보이지 않는다.. 다른 AxiosError 에서 확장된 error 타입이 들어올수도 있는거고

- 그래서 내가 만든 CustomError

```ts
// 다음과 같이 CustomError typing을 해준뒤
export type CustomError = {
  [key: string]: string;
} & typeof AxiosError & {
    response: {
      data: { statusCode: number; message: string };
    };
  };

export const customError = (error: unknown) => {
  return error as CustomError;
};


// 이런식으로 분기를 처리해 주었다.
catch (error) {
      if (error && customError(error).response.data.statusCode) {
        const errorStatusCode = customError(error).response.data.statusCode;
        setStatus(errorStatusCode);

      }
    }
```
