import React from 'react';
import Module from "~/components/Module";

const Modules = ({ modules, oneCol=false }) => {
    return (
        <div className={'modules ' + (oneCol ? 'modules_one-col' : '')}>
            {modules.map((module, i) => !module.hidden && <Module key={'module-'+i} module={module} />)}
        </div>
    );
};

export default Modules;