import React, {useEffect, useState} from 'react';

import checkIcon from '../assets/icons/check.svg'

const Checkbox = ({ handleCheck, defaultChecked }) => {
    const [checked, setChecked] = useState(defaultChecked)

    useEffect(() => {
        handleCheck(checked)
    }, [checked])

    return (
        <div className={'my-checkbox'}>
            <input type="checkbox" defaultChecked={checked}/>
            <label onClick={(e) => setChecked(!checked)} className="checkbox">
                <img src={checkIcon}/>
            </label>
        </div>
    );
};

export default Checkbox;