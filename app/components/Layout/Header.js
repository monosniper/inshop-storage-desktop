import React from 'react';
import Select from 'react-select'

import logo from "../../assets/img/logo.svg";
import {Avatar} from "evergreen-ui";
import {useFetcher, useLoaderData, useLocation} from "@remix-run/react";
import SubNav from "~/components/Layout/SubNav";
import {motion} from "framer-motion";


const Header = ({ user, shops, domain }) => {
    const fetcher = useFetcher()
    const loaderData = useLoaderData()
    const location = useLocation()
    const options = [...(shops.map(({ Domain, options }) => (
        {
            value: Domain.name,
            label: options.title,
        }
    )))]

    const handleChange = (e) => {
        if(e.value !== 'new') {
            fetcher.submit({
                domain: e.value
            }, {
                method: 'post',
                action: '/home'
            })
        } else {
            fetcher.submit({}, {method: 'get', action: '/new_shop'})
        }
    }

    return (
        <header className={'header'}>
            {loaderData.subNav && <motion.main
                key={location.pathname}
                initial={{x: '-10%', opacity: 0}}
                animate={{opacity: 1, x: '0'}}
                exit={{x: '10%', opacity: 0}}
                transition={{duration: 0.3}}
            >
                <SubNav />
            </motion.main>}
            <div className="header__container">
                <img src={logo}/>

                <div className="header__right">
                    <fetcher className="Form" />
                    {options.length && <Select
                        placeholder={'Выберите магазин'}
                        onChange={handleChange}
                        defaultValue={options.find(option => option.value === domain)}
                        options={options}
                    />}
                    <Avatar name={user.name ? user.name : user.email} size={60} />
                </div>

            </div>
        </header>
    );
};

export default Header;