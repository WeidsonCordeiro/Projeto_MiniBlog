//Components
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PostDetails from "../../components/PostDetails/PostDetails";

//Utils
import { requestConfig } from "../../../utils/config";

//Material UI
import { CircularProgress } from "@mui/material";

//CSS
import styles from "../Home/Home.module.css";

const Home = () => {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllPosts = async () => {
      setLoading(true);
      setError(null);

      const config = requestConfig("GET", null, null);
      try {
        const res = await fetch(`/api/posts/`, config);
        const result = await res.json();

        if (result.errors) {
          console.log("Erros", result.errors);
          setError(result.errors);
          return;
        }
        setPosts(result.posts);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
        setError("Erro ao buscar posts. Tente novamente!");
      } finally {
        setLoading(false);
      }
    };
    fetchAllPosts();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (search) {
      return navigate(`/search?q=${search.toLocaleLowerCase()}`);
    }
  };

  return (
    <div className={styles.home}>
      <h1>Veja os nossos posts mais recentes</h1>
      <form onSubmit={handleSubmit} noValidate className={styles.search_form}>
        <label>
          <input
            type="text"
            placeholder="Ou busque por tags..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <button className="btn btn-dark" disabled={!search.trim()}>
          Pesquisar
        </button>
      </form>
      <div>
        {loading && (
          <div className={styles.loading}>
            <CircularProgress color="black" size={40} />
          </div>
        )}
        {error && <p>{error}</p>}
        {!loading && !error && posts.length === 0 && (
          <div className={styles.noposts}>
            <p>Nenhum post encontrado...</p>
            <Link to="/posts/create" className="btn">
              Criar primeiro post
            </Link>
          </div>
        )}
        {!loading && !error && posts.length > 0 && (
          <div className={styles.posts_grid}>
            {posts.map((post) => (
              <div key={post.id} className={styles.post_item}>
                <PostDetails post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
