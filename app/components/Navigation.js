import React from 'react';

import homeIcon from '~/assets/icons/nav/home.svg';
import storageIcon from '~/assets/icons/nav/storage.svg';
import shopIcon from '~/assets/icons/nav/shop.svg';
import libraryIcon from '~/assets/icons/nav/library.svg';
import walletIcon from '~/assets/icons/nav/wallet.svg';
import clientsIcon from '~/assets/icons/nav/clients.svg';

const Navigation = () => {
    return (
        <div className={'nav'}>
            <a href="/" className="nav-item">
                <img src={homeIcon}/>
            </a>
            <a href="/storage" className="nav-item nav-item_active">
                <img src={storageIcon}/>
            </a>
            <a href="/" className="nav-item">
                <img src={shopIcon}/>
            </a>
            <a href="/" className="nav-item">
                <img src={libraryIcon}/>
            </a>
            <a href="/" className="nav-item">
                <img src={walletIcon}/>
            </a>
            <a href="/" className="nav-item">
                <img src={clientsIcon}/>
            </a>
        </div>
    );
};

export default Navigation;