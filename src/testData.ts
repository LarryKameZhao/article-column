export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}
export interface PostProps {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  columnId: number;
}
