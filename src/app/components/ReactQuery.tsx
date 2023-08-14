"use client";

import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ReactNode } from "react";
import axios from "axios";

type Props = {
  children: ReactNode;
};

const queryClient = new QueryClient();

export default function ReactQuery({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      {children}
    </QueryClientProvider>
  );
}
