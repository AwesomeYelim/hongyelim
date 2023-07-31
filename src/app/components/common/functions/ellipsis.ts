/**
 * 1. 컴포넌트 : client\src\common\functions\ellipsis.ts
 * 2. 작성일 : 2023.06.14 / 15시 59분 00초
 * 3. 작성자 : 홍예림
 * 4. 설명 : **외국어 적용시** 말줄임표 (...) ellipsis 가 적용된 태그에만 title을 표시
 */

export interface TitleEl extends Element {
  clientWidth: number;
  scrollWidth: number;
  title: string;
  innerText: string;
  children: HTMLCollectionOf<Element>;
}

export type TitleType<T = { display?: "block" }> = {
  onFocus: (e: React.FocusEvent<TitleEl | SVGElement>) => void;
  onMouseOver: (e: React.MouseEvent<TitleEl | SVGElement>) => void;
  style?: React.CSSProperties & T;
};

export const titleCondition: TitleType = {
  // style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  onFocus: (e) => {
    e.stopPropagation();
  },
  onMouseOver: (e) => {
    e.stopPropagation();
    if (
      !e.currentTarget.children.length &&
      (e.currentTarget as TitleEl).innerText &&
      e.currentTarget.clientWidth < e.currentTarget.scrollWidth
    ) {
      (e.currentTarget as TitleEl).title = (e.currentTarget as TitleEl).innerText;
    }
  },
};
