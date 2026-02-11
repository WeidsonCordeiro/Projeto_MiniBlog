//Components
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext';
import { useUpdateDocument } from '../../hooks/useUpdateDocument';
import { useFetchDocument } from '../../hooks/useFetchDocument';

//Css
import styles from './EditPost.module.css'

const EditPost = () => {
    const { id } = useParams();
    const { document: post, loading: loading_fetchDocument } = useFetchDocument('posts', id);

    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [body, setBody] = useState('');
    const [tags, setTags] = useState([]);
    const [formError, setFormError] = useState('');
    const [errorMessage, setErrorMessage] = useState({});
    const { updateDocument, loading, error: errorUpdateDocument, data } = useUpdateDocument("posts");
    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setBody(post.body);
            setImage(post.image);
            setTags(post.tagsArray.join(", "));
        }
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formClean = () => {
            setTitle('');
            setImage('');
            setBody('');
            setTags('');
        };

        setFormError('');
        let validationErrors = {}; // Objeto para armazenar erros locais

        if (!title.trim()) {
            validationErrors.title = "Titulo é obrigatório.";
        }

        if (!image.trim()) {
            validationErrors.image = "URL da imagem é obrigatório.";
        } else {
            try {
                new URL(image);
            } catch (error) {
                validationErrors.image = "A URL da imagem é inválida.";
            }
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

        const tagsArray = tags.split(",").map(tag => tag.trim().toLowerCase());

        const post = {
            title,
            image,
            body,
            tagsArray,
            uid: user.uid,
            createdBy: user.displayName
        }

        try {
            updateDocument(id, post);
            formClean();
            navigate('/dashboard');
        } catch (error) {
            setFormError("Erro ao alterar o Post. Tente novamente!");
        }

    }

    return (
        <div className={styles.editPost}>
            {post && (
                <>
                    <h2>Editando Post: {post.title}</h2>
                    <p className={styles.titlePost}>Altere os dados do post como desejar!</p>
                    <form onSubmit={handleSubmit} noValidate>
                        <label>
                            <span>Título:</span>
                            <input type="text" name='title' placeholder='Pense num bom título...' value={title} onChange={(e) => setTitle(e.target.value)} />
                        </label>
                        {errorMessage.title && <div className="errormsg">
                            <p>{errorMessage.title}</p>
                        </div>}
                        <label>
                            <span>URL da imagem:</span>
                            <input type="text" name='image' placeholder='Insira uma imagem que representa o seu post' value={image} onChange={(e) => setImage(e.target.value)} />
                        </label>
                        {errorMessage.image && <div className="errormsg">
                            <p>{errorMessage.image}</p>
                        </div>}
                        <p className={styles.preview_title}>Preview da imagem atual!</p>
                        <img className={styles.preview_image} src={post.image} alt={post.title} />
                        <label>
                            <span>Conteúdo:</span>
                            <textarea name="body" placeholder='Insira o conteudo do post' value={body} onChange={(e) => setBody(e.target.value)}></textarea>
                        </label>
                        {errorMessage.body && <div className="errormsg">
                            <p>{errorMessage.body}</p>
                        </div>}
                        <label>
                            <span>Tags:</span>
                            <input type="text" name="tags" placeholder='Insira as tags separadas por vírgula' value={tags} onChange={(e) => setTags(e.target.value)} />
                        </label>
                        {errorMessage.tags && <div className="errormsg">
                            <p>{errorMessage.tags}</p>
                        </div>}
                        {!loading && <button className='btn'>Editar</button>}
                        {loading && <button className='btn' disabled>Aguarde...</button>}
                        {errorUpdateDocument && <p className='error'>{errorUpdateDocument}</p>}
                        {/* {formError && <p className='error'>{formError}</p>} */}
                    </form>
                </>
            )}
        </div >
    )
}

export default EditPost