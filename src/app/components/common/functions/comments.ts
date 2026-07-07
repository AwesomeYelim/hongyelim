import { CommentEl } from "@/service/posts";

/**
 * Flat comment array -> nested tree.
 * Extracted from route.ts so client components can import it
 * without pulling in server-only nodemailer.
 */
export const commentsTree = (arr: CommentEl[]) => {
  arr = arr.sort((a, b) => {
    const ac = a.com_created_at;
    const bc = b.com_created_at;
    const [al, bl] = [ac.at(-1), bc.at(-1)] as number[];
    if (ac.length === bc.length) return bl - al;
    return bc.length - ac.length;
  });

  const lengthOne = arr.filter((highData) => {
    [...arr].forEach((data) => {
      const h = highData.com_created_at;
      const d = data.com_created_at;
      const duplePrevent = !highData.children?.map((el) => el.com_created_at.at(-1)).includes(d.at(-1));

      if (h.at(-1) === d.at(-2) && duplePrevent) {
        (highData.children || (highData.children = [])).push(data);
      }
    });

    return highData?.com_created_at?.length === 1;
  });
  return lengthOne;
};
