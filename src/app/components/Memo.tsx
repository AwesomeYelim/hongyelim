"use client";

import { useState } from "react";
import { Add } from "./common/Add";
import { Selected, Tag } from "./Tag";
import { useQuery } from "react-query";
import { getPostsApi } from "./common/functions/myapi";

export const Memo = (): JSX.Element => {
  const [selected, setSelected] = useState<Selected>({ keyword: "" });

  const { data } = useQuery({
    queryKey: 'All',
    queryFn: (data) => getPostsApi({type : data.queryKey[0]}),
  });

  const props = {
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
