import MoveEvent from "../components/MoveEvent";

interface Props {
  data?: number;
}

export default async function ArchivesPage() {
  //
  return (
    <div className="archive_page">
      <h1>Project</h1>
      <MoveEvent />
      {/* <Memo posts={posts} /> */}
    </div>
  );
}
