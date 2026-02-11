
//Components
import { useParams } from "react-router-dom"

//Hooks
import { useFetchDocument } from "../../hooks/useFetchDocument";

//Css
import styles from '../Post/Post.module.css'


const Post = () => {
    const { id } = useParams();
    const {document: post, loading} = useFetchDocument('posts', id);

  return (
    <div className={styles.post_container}>
        {loading && <p>Carregando...</p>}
        {post && post.tagsArray  && (
            <>
                <h1>{post.title}</h1>
                <img src={post.image} alt={post.title} />
                <p>{post.body}</p>
                <h3>Este post trata sobre:</h3>
                <div className={styles.tags}>
                    {(post.tagsArray).map((tag) => (
                        <p key={tag}><span>#</span>{tag}</p>
                    ))}
                </div>
            </>
        )}
        {!post && !loading && <p>Post não encontrado.</p>}
    </div>
  )
}

export default Post