// import dynamic from "next/dynamic";
import { Line } from "../components/Line";
import MoveEvent from "../components/MoveEvent";
import "./page.scss";

interface Props {
  data?: number;
}

// const ClientMoveEvent = dynamic(() => import("../components/MoveEvent"), {
//   ssr: false,
// });

export default async function ArchivesPage() {
  //
  return (
    <div className="archive_page">
      <h1>Attempts</h1>
      <span>다양한 시도들을 시기별로 나열합니다.</span>
      <Line />
      {/* <MoveEvent /> */}
    </div>
  );
}
