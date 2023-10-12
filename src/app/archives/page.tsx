import dynamic from "next/dynamic";

interface Props {
  data?: number;
}

const ClientMoveEvent = dynamic(() => import("../components/MoveEvent"), {
  ssr: false,
});

export default async function ArchivesPage() {
  //
  return (
    <div className="archive_page">
      <h1>Project</h1>
      <ClientMoveEvent />
      {/* <Memo posts={posts} /> */}
    </div>
  );
}
