import React, {useState} from 'react';

const Switch = ({ onChange, defaultChecked=false }) => {
    const [checked, setChecked] = useState(defaultChecked)

    const handleClick = () => {
        setChecked(!checked)
        onChange(checked)
    }

    return (
        <div onClick={handleClick} className={'switch ' + (checked ? 'active' : '')}>
            <input type="checkbox" checked={checked} onChange={onChange} />
            <div className="switch__ball"></div>
        </div>
    );
};

export default Switch;