import { Link } from 'react-router-dom'

//CSS
import style from '../About/About.module.css'

const About = () => {
    return (
        <div className={style.about}>
            <h2>Sobre o Mini <span>Blog</span></h2>
            <p>Este Projeto consiste em um blog feito com react no Front-End e Firebase no Back-End.</p>
            <Link to="/posts/create" className="btn">Criar Post</Link>
        </div>
    )
}

export default About    