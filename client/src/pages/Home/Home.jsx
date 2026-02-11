//Components
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFetchDocuments } from '../../hooks/useFetchDocuments'
import PostDetails from '../../components/PostDetails/PostDetails'

//CSS
import styles from '../Home/Home.module.css'


const Home = () => {
    const [search, setSearch] = useState('');
    const { documents: posts, loading, error } = useFetchDocuments('posts');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if(search){
            return navigate(`/search?q=${search.toLocaleLowerCase()}`)
        }
    }

    return (
        <div className={styles.home}>
            <h1>Veja os nossos posts mais recentes</h1>
            <form onSubmit={handleSubmit} noValidate className={styles.search_form}>
                <label>
                    <input type="text" placeholder='Ou busque por tags...' onChange={(e) => setSearch(e.target.value)} />
                </label>
                <button className='btn btn-dark'>Pesquisar</button>
            </form>
            <div>
                {loading && <p>Carregando...</p>}
                {error && <p>{error}</p>}
                {posts === null ? null : (
                    <>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post.id}>
                                    <PostDetails post={post} key={post.id}/>
                                </div>
                            ))
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
        </div>
    )
}

export default Home