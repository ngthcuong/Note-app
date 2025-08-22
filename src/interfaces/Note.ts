export interface Note {
  id: string;
  title: string;
  content: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
