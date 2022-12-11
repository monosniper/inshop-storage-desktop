import React from 'react';
import Select, {components} from 'react-select'

import logo from "../../assets/img/logo.svg";
import shopImg from '../../assets/img/user.png'
import upIcon from '../../assets/icons/up.svg'
import downIcon from '../../assets/icons/down.svg'
import {Avatar} from "evergreen-ui";
import {Link, useFetcher, useLocation} from "@remix-run/react";


const Header = ({ user, shops, domain }) => {
    const fetcher = useFetcher()
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
        </header>
    );
};

export default Header;