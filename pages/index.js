import { Game } from '../components/Game'
import React from 'react'
import { Header } from '../components/Header'; 

const Home = () => {
    const date = new Date();

    const [statsDialogVisible, setStatsDialogVisible] = React.useState(false);
    
    return (
        <>
            <Header statsDialogVisible={statsDialogVisible} setStatsDialogVisible={setStatsDialogVisible} />
            <Game key={date.toDateString()} setStatsDialogVisible={setStatsDialogVisible}/>
        </>
    )
}

export default Home
