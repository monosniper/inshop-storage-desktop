import React, {useEffect, useRef} from 'react';
import Header from "~/components/Layout/Header";
import Navigation from "~/components/Layout/Navigation";
import {ToastContainer} from "react-toastify";
import {useLocation, useTransition} from "@remix-run/react";
import LoadingBar from 'react-top-loading-bar'
import {motion} from 'framer-motion'
import SelectBar from "~/components/SelectBar";

const Layout = ({ children }) => {
    const loadingRef = useRef()
    const transition = useTransition()

    useEffect(() => {
        if(transition.state === 'loading') {
            loadingRef.current.continuousStart()
        }
        transition.state === 'idle' && loadingRef.current.complete()
    }, [transition.state])

    return (
        <div className={'wrapper container'}>
            <Navigation />
            <div className={'wrapper__right'}>
                <Header />
                <motion.main
                    key={useLocation().pathname}
                    initial={{x: '-10%', opacity: 0}}
                    animate={{opacity: 1, x: '0'}}
                    exit={{y: '-10%', opacity: 0}}
                    transition={{duration: 0.3}}
                >
                    {children}
                </motion.main>
                {/*{children}*/}
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </div>
            <SelectBar />

            <LoadingBar color='#50139E' ref={loadingRef} />
        </div>
    );
};

export default Layout;