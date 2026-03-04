//Components
import { useEffect, useState } from "react";
import PostDetails from "../../components/PostDetails/PostDetails";
import { Link } from "react-router-dom";

//Hooks
import { useQuery } from "../../hooks/useQuery";

//Material UI
import { CircularProgress } from "@mui/material";

//Utils
import { requestConfig } from "../../../utils/config";

//CSS
import styles from "../Search/Search.module.css";

const Search = () => {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const query = useQuery();
  const search = query.get("q").trim();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      const config = requestConfig("GET", null, null);
      try {
        const res = await fetch(
          `/api/posts/search?q=${encodeURIComponent(search)}`,
          config
        );
        const result = await res.json();

        if (result.errors) {
          console.log("Erros", result.errors);
          setError(result.errors);
          return;
        }
        console.log("Posts encontrados:", result.posts);
        setPosts(result.posts);
      } catch (error) {
        console.error("Erro ao buscar posts por nome:", error);
        setError("Erro ao buscar posts por nome. Tente novamente!");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  console.log("Posts:", posts);
  return (
    <div className={styles.search_container}>
      <h2>Search</h2>
      {loading && (
        <div className={styles.loading}>
          <CircularProgress color="black" size={40} />
        </div>
      )}
      <div>
        {posts && posts.length === 0 && (
          <div className={styles.noposts}>
            <p>Não foram encontrados posts a partir da sua busca...</p>
            <Link to="/" className="btn btn-dark">
              Voltar
            </Link>
          </div>
        )}
        {posts &&
          posts.map((post) => <PostDetails key={post.id} post={post} />)}
      </div>
    </div>
  );
};

export default Search;
