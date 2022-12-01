import React from 'react';
import Header from "~/components/Header";
import Navigation from "~/components/Navigation";
import {ToastContainer} from "react-toastify";
import SelectBar from "~/components/SelectBar";

const Layout = ({ children }) => {
    return (
        <div className={'wrapper container'}>
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
            <SelectBar />

        </div>
    );
};

export default Layout;