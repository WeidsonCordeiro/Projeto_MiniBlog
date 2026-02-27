//Components
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//Utils
import { requestConfig } from "../../../utils/config";

//Material UI
import { CircularProgress } from "@mui/material";

//Css
import styles from "../Post/Post.module.css";

const Post = () => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      const config = requestConfig("GET", null, null);
      try {
        const res = await fetch(`/api/posts/${id}`, config);
        const result = await res.json();

        if (result.errors) {
          console.log("Erros", result.errors);
          setError(result.errors);
          return;
        }

        setPost(result.post);
      } catch (error) {
        console.error("Erro ao buscar post po id:", error);
        setError("Erro ao buscar post. Tente novamente!");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, []);

  return (
    <div className={styles.post_container}>
      {loading && (
        <div className={styles.loading}>
          <CircularProgress color="black" size={40} />
        </div>
      )}
      {post && post.tags && (
        <>
          <h1>{post.title}</h1>
          <img
            src={`${import.meta.env.VITE_API_URL}${"/uploads/posts/"}${post.img}`}
            alt={post.title}
          />
          <p>{post.body}</p>
          <h3>Este post trata sobre:</h3>
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <p key={tag}>
                <span>#</span>
                {tag}
              </p>
            ))}
          </div>
        </>
      )}
      {!post && !loading && <p>Post não encontrado.</p>}
    </div>
  );
};

export default Post;
