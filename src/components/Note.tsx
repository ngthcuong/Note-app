// const Note = ({
//   title,
//   content,
//   createdAt,
// }: {
//   title: string;
//   content: string;
//   createdAt: string;
// }) => {

interface NoteData {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const Note = (noteData: NoteData) => {
  return (
    <div>
      <div>{noteData.title}</div>

      <div>{noteData.content}</div>

      <div>{noteData.createdAt}</div>
    </div>
  );
};

export default Note;
