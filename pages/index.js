import { Game } from '../components/Game'
import React from 'react'
import { Header } from '../components/Header'; 

const Home = () => {
    const date = new Date();
    return (
        <>
            <Header />
            <Game key={date.toDateString()}/>
        </>
    )
}

export default Home
