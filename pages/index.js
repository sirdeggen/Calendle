import {Game} from '../comps/Game'

const Home = () => {
    return (
        <div
                style={{
                    display: 'block',
                    textAlign: 'center',
                    minHeight: '80vh',
                    padding: '10vh 0',
                }}
            >
            <Game />
        </div>
    )
}

export default Home
