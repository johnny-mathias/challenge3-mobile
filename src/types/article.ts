export interface Article {
  id: number;
  title: string;
  description?: string;
  content: string;
  tags?: string[];
  authorId: number;
  createdAt: string;
  authorName?: string;
}