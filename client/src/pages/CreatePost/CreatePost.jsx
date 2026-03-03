//Components
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

//Utils
import { requestConfig, getToLocalStorage } from "../../../utils/config";

//Css
import styles from "./CreatePost.module.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setErrorMessage((prev) => ({
        ...prev,
        image: "Selecione apenas imagens.",
      }));
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (selectedFile.size > 2 * 1024 * 1024) {
      setErrorMessage((prev) => ({
        ...prev,
        image: "A imagem deve ter no máximo 2MB.",
      }));
      return;
    }

    setImage(selectedFile);

    // Criar preview da imagem
    const previewUrl = URL.createObjectURL(selectedFile);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formClean = () => {
      setTitle("");
      setImage(null);
      setImagePreview(null);
      setBody("");
      setTags("");
    };

    setLoading(true);
    setError("");

    let validationErrors = {};

    if (!title.trim()) {
      validationErrors.title = "Titulo é obrigatório.";
    }

    if (image === null) {
      validationErrors.image = "Imagem é obrigatório.";
    }
    // else {
    //   try {
    //     new URL(img);
    //   } catch (error) {
    //     validationErrors.img = "A URL da imagem é inválida.";
    //   }
    //}

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

    setErrorMessage({});

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag !== "");

    const formData = new FormData();

    formData.append("title", title);
    formData.append("body", body);
    formData.append("userId", user.userId);
    formData.append("createdBy", user.name);

    tagsArray.forEach((tag) => {
      formData.append("tags[]", tag);
    });

    if (image instanceof File) {
      formData.append("img", image);
    }

    // Listando o conteúdo do FormData
    // for (let [key, value] of formData.entries()) {
    //   if (value instanceof File) {
    //     console.log(`${key}: ${value.name}`);
    //   } else {
    //     console.log(`${key}: ${value}`);
    //   }
    // }

    const token = getToLocalStorage("user")?.token;
    const config = requestConfig("POST", formData, token);
    try {
      const res = await fetch(`/api/posts/newPost`, config);
      const result = await res.json();

      if (result.errors) {
        console.log("Erros", result.errors);
        setError(result.errors);
        return;
      }
      console.log("Post criado com sucesso:", result);
      formClean();
      navigate("/");
    } catch (error) {
      console.error("Erro ao registar post:", error);
      setError("Erro ao registar Post. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createPost}>
      <h2>Criar Post</h2>
      <p className={styles.titlePost}>
        Escreva sobre o que quiser e compartilhe o seu conhecimento!
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
        <div className={styles.fileUpload}>
          <label
            htmlFor="file"
            className={styles.uploadBox}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile({ target: { files: e.dataTransfer.files } });
            }}
          >
            {imagePreview ? (
              <>
                <button
                  type="button"
                  className={styles.removeImageBtn}
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                >
                  ✕
                </button>
                <img src={imagePreview} alt="Preview" />
              </>
            ) : (
              <div className={styles.placeholder}>
                <span>📷</span>
                <p>Clique para selecionar uma imagem</p>
                <small>até 2MB</small>
              </div>
            )}
          </label>

          <input type="file" id="file" accept="image/*" onChange={handleFile} />
        </div>
        {errorMessage.image && (
          <div className="errormsg">
            <p>{errorMessage.image}</p>
          </div>
        )}
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
        {!loading && <button className="btn">Cadastrar</button>}
        {loading && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
