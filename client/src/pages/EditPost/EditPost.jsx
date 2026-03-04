//Components
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//Utils
import { requestConfig, getToLocalStorage } from "../../../utils/config";

//Material UI
import { CircularProgress } from "@mui/material";

//Css
import styles from "./EditPost.module.css";

const EditPost = () => {
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const { id } = useParams();

  const navigate = useNavigate();

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

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
      setImagePreview(post.img);
      setTags(post.tags.join(", "));
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formClean = () => {
      setTitle("");
      setImagePreview(null);
      setBody("");
      setTags("");
    };

    setLoading(true);
    setError("");

    let validationErrors = {}; // Objeto para armazenar erros locais

    if (!title.trim()) {
      validationErrors.title = "Titulo é obrigatório.";
    }

    if (!body.trim()) {
      validationErrors.body = "Conteudo é obrigatório.";
    }

    if (tags.length === 0) {
      validationErrors.tags = "Tag é obrigatório.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrorMessage(validationErrors);
      return;
    }

    setErrorMessage({}); // Limpa os erros se tudo estiver válido

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag !== "");

    const post = {
      title,
      body,
      tags: tagsArray,
    };

    const token = getToLocalStorage("user")?.token;
    const config = requestConfig("PUT", post, token);
    try {
      const res = await fetch(`/api/posts/${id}`, config);
      const result = await res.json();

      if (result.errors) {
        console.log("Erros", result.errors);
        setError(result.errors);
        return;
      }

      formClean();
      navigate("/dashboard");
    } catch (error) {
      setError("Erro ao alterar o Post. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.editPost}>
      {loading && (
        <div className={styles.loading}>
          <CircularProgress color="black" size={40} />
        </div>
      )}
      {post && (
        <>
          <h2>Editando Post: {post.title}</h2>
          <p className={styles.titlePost}>
            Altere os dados do post como desejar!
          </p>
          <form onSubmit={handleSubmit} noValidate>
            <label>
              <span>Título:</span>
              <input
                type="text"
                name="title"
                placeholder="Pense num bom título..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            {errorMessage.title && (
              <div className="errormsg">
                <p>{errorMessage.title}</p>
              </div>
            )}
            <p className={styles.preview_title}>Preview da imagem atual!</p>
            <img
              className={styles.preview_image}
              src={imagePreview}
              alt={post.title}
            />
            <label>
              <span>Conteúdo:</span>
              <textarea
                name="body"
                placeholder="Insira o conteudo do post"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              ></textarea>
            </label>
            {errorMessage.body && (
              <div className="errormsg">
                <p>{errorMessage.body}</p>
              </div>
            )}
            <label>
              <span>Tags:</span>
              <input
                type="text"
                name="tags"
                placeholder="Insira as tags separadas por vírgula"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </label>
            {errorMessage.tags && (
              <div className="errormsg">
                <p>{errorMessage.tags}</p>
              </div>
            )}
            {!loading && <button className="btn">Editar</button>}
            {loading && (
              <button className="btn" disabled>
                Aguarde...
              </button>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default EditPost;
