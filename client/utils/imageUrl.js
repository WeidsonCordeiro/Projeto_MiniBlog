const VITE_API_URL = import.meta.env.VITE_API_URL;

export const postImageUrl = (filename) =>
  `${VITE_API_URL}/uploads/posts/${filename}`;

export const userImageUrl = (filename) =>
  `${VITE_API_URL}/uploads/users/${filename}`;
