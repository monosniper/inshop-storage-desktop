import React from 'react';
import logo from "../assets/img/logo.svg";

import userImg from '../assets/img/user.png'
import {Avatar} from "evergreen-ui";

const Header = () => {
    return (
        <header className={'header'}>
            <img src={logo}/>
            <div className="header__right">
                <Avatar name="Jeroen Ransijn" size={60} />
            </div>
        </header>
    );
};

export default Header;