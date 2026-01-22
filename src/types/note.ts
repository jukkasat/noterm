export type ContentItem =
  | { type: 'text'; id: string; value: string }
  | { type: 'checkbox'; id: string; text: string; checked: boolean }
  | { type: 'image'; id: string; url: string };

export interface Note {
  id: string;
  subject?: string;
  content: ContentItem[];
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

export type TextSize = 1 | 2 | 3 | 4 | 5;
export type SwimlanesCount = 0 | 1 | 2 | 3 | 4 | 5;