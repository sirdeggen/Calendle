import React from 'react'
import Head from 'next/head'
import '../layout/main.css'

const Layout = ({ children }) => <div className="layout">{children}</div>

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Calendle</title>
                <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no'/>
            </Head>

            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    )
}
