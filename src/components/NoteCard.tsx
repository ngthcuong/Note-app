import type { Note } from '../interfaces/Note';

// const Note = ({ title, content, updatedAt }: Note) => {  // Destructuring
const NoteCard = (note: Note) => {
  return (
    <div>
      <div>{note.title}</div>

      <div>{note.content}</div>

      <div>{note.createdAt}</div>

      <button type='button'></button>
    </div>
  );
};

export default NoteCard;
