"use client";

import { useState } from "react";
import { Add } from "./common/Add";
import { Selected, Tag } from "./Tag";
import { useQuery } from "react-query";
import { getPostApi } from "./common/functions/myapi";

export const Memo = (): JSX.Element => {
  const [selected, setSelected] = useState<Selected>({ keyword: "" });

  const { data } = useQuery({
    queryKey: "postsData",
    queryFn: getPostApi,
  });

  const props = {
    posts: data,
    selected,
    setSelected,
  };

  return (
    <>
      <Add {...props} />
      {data && <Tag {...props} />}
    </>
  );
};
