
export enum BlockType {
    CONTENT = "CONTENT",
    NOTE = "NOTE",
    SUMMARY = "SUMMARY",
    EXPLANATION = "EXPLANATION",
    TWEET = "TWEET",
    REDDIT = "REDDIT",
}

export interface NoteBlock {
    content: string;
    block_type: BlockType;
    extra_metadata?: object;
  }
  export interface Note {
    title: string;
    session_id?: string;
    url?: string;
    content?: string;
    blocks: NoteBlock[];
    folder_id: string;
    extra_metadata?: object;
    note_type?: string;
  }


export interface Folder {
    id: string;
    name: string;
}

export interface Article {
    title: string | null;
    content: string | null;
    textContent: string | null;
    length: number | null;
    excerpt: string | null;
    byline: string | null;
    dir: string | null;
    siteName: string | null;
    lang: string | null;
    publishedTime: string | null;
}

export default {}