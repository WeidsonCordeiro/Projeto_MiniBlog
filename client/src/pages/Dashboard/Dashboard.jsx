//Components
import { Link } from 'react-router-dom';

//Hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import { useDeleteDocument } from '../../hooks/useDeleteDocument';

//Css
import styles from './Dashboard.module.css'

const Dashboard = () => {
    const { user } = useAuthContext();
    const uid = user?.uid;
    const { documents: posts, loading } = useFetchDocuments('posts', null, uid);
    const { deleteDocument } = useDeleteDocument('posts');


    return (
        <div className={styles.dashboard}>
            <h2>Dashboard</h2>
            <p>Gerencia os seus posts</p>
            {loading && <p>Carregando...</p>}
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
                                        <Link to={`/posts/${post.id}`} className='btn btn-outline'>Ver</Link>
                                        <Link to={`/posts/edit/${post.id}`} className='btn btn-outline'>Editar</Link>
                                        <button onClick={() => deleteDocument(post.id)} className='btn btn-outline btn-danger'>Excluir</button>
                                    </div>
                                </div>
                            ))}
                        </>

                    ) : (
                        <div className={styles.noposts}>
                            <p>Nenhum post encontrado...</p>
                            <Link to="/posts/create" className='btn'>
                                Criar primeiro post
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Dashboard