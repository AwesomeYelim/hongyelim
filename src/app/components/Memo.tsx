"use client";

import { useState } from "react";
import { Add } from "./common/Add";
import { Selected, Tag } from "./Tag";
import { useQuery } from "@tanstack/react-query";
import { getPostsApi } from "./common/functions/myapi";

export const Memo = (): JSX.Element => {
  const [selected, setSelected] = useState<Selected>({ keyword: "" });

  const { data } = useQuery({
    queryKey: ["All"],
    queryFn: () => getPostsApi({ type: "All" }),
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
