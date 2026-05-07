export interface Post {
  id: string;
  authorName: string | null;
  authorAvatar?: string | null;
  content: string | null;
  linkedinUrl?: string | null;
  postedAt?: string | Date | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  likes?: number| null;
  comments?: number| null;
  shares?: number| null;
}