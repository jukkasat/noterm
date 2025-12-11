export interface Note {
  id: string;
  subject?: string;
  message: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface NotesState {
  notes: Note[];
}
