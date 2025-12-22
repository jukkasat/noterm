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

export type TextSize = 'small' | 'normal' | 'large';