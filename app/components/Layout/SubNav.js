import React from 'react';
import {Link, useLoaderData, useLocation} from "@remix-run/react";
import {Position, Tooltip} from "evergreen-ui";

const SubNav = () => {
    const loaderData = useLoaderData()
    const location = useLocation()

    return (
        <div className={'sub-nav'}>
            {loaderData.subNav.map(route => (
                <Tooltip key={'sub-'+route.pathname} content={route.title} position={Position.BOTTOM} showDelay={200}>
                    <Link to={route.pathname} className={"nav-item " + (location.pathname === route.pathname ? 'nav-item_active' : '')}>
                        <img src={route.icon}/>
                    </Link>
                    {/*<a key={route.pathname} href={route.pathname} className={"nav-item " + (location.pathname === route.pathname ? 'nav-item_active' : '')}>*/}
                    {/*    <img src={route.icon}/>*/}
                    {/*</a>*/}
                </Tooltip>
            ))}
        </div>
    );
};

export default SubNav;