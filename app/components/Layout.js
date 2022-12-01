import React from 'react';
import Header from "~/components/Header";
import Navigation from "~/components/Navigation";
import {ToastContainer} from "react-toastify";

const Layout = ({ children }) => {
    return (
        <div className={'wrapper'}>
            <Navigation />
            <div className={'wrapper__right'}>
                <Header />
                {children}
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
        </div>
    );
};

export default Layout;