//Components
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

//Utils
import { requestConfig, getToLocalStorage } from "../../../utils/config";

//Material UI
import { CircularProgress } from "@mui/material";

//Css
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true);
      setError(null);

      const token = getToLocalStorage("user")?.token;
      const config = requestConfig("GET", null, token);
      try {
        const res = await fetch(`/api/posts/myPosts`, config);
        const result = await res.json();

        if (result.errors) {
          console.log("Erros", result.errors);
          setError(result.errors);
          return;
        }
        setPosts(result.posts);
      } catch (error) {
        console.error("Erro ao buscar posts do usuário:", error);
        setError("Erro ao buscar seus posts. Tente novamente!");
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  const deleteDocument = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir?"); //Melhoria futura: criar um modal de confirmação
    if (!confirmDelete) {
      return;
    }
    setLoading(true);
    setError(null);
    const token = getToLocalStorage("user")?.token;
    const config = requestConfig("DELETE", null, token);
    try {
      const res = await fetch(`/api/posts/${id}`, config);
      const result = await res.json();
      if (result.errors) {
        console.log("Erros", error);
        setError(result.errors);
        return;
      }
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Erro ao excluir post:", error);
      setError("Erro ao excluir o post. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <p>Gerencia os seus posts</p>
      {loading && (
        <div className={styles.loading}>
          <CircularProgress color="black" size={40} />
        </div>
      )}
      {posts === null ? null : (
        <>
          {posts.length > 0 ? (
            <>
              <div className={styles.post_header}>
                <span>Titulo</span>
                <span>Ações</span>
              </div>
              {posts.map((post) => (
                <div key={post.id} className={styles.post_row}>
                  <p>{post.title}</p>
                  <div>
                    <Link to={`/posts/${post.id}`} className="btn btn-outline">
                      Ver
                    </Link>
                    <Link
                      to={`/posts/edit/${post.id}`}
                      className="btn btn-outline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => deleteDocument(post.id)}
                      className="btn btn-outline btn-danger"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.noposts}>
              <p>Nenhum post encontrado...</p>
              <Link to="/posts/create" className="btn">
                Criar primeiro post
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
