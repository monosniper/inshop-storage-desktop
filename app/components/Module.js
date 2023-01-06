import React, {useEffect, useRef} from 'react';
import moduleImg from "~/assets/img/module.png";
import {Form, Link, useActionData, useSubmit} from "@remix-run/react";
import {$routes} from "~/utils/config";
import {Position, Tooltip} from "evergreen-ui";
import dependenciesIcon from '~/assets/icons/dependencies.svg'
import checkCircleIcon from '~/assets/icons/check_circle.svg'

const Module = ({ module }) => {
    const submit = useSubmit();
    const moduleBuyForm = useRef();

    const image = module.Media?.length && module.Media.find(media => media.name === 'image') ? [
        module.Media.find(media => media.name === 'image').filename
    ] : []

    const getImagePath = () => {
        return image.length ? `https://www.inshop-online.com/storage/modules/${module.uuid}/image/${image[0]}` : moduleImg
    }

    const handleClick = () => {
        submit(moduleBuyForm.current, { replace: true });
    }

    return (
        <div className={'module'}>
            <div className="module__left">
                <div className="module__img" style={{backgroundImage: `url('${getImagePath()}')`}}></div>
            </div>
            <div className="module__right">
                <Link className={'module__title'} to={$routes.store.module(module.slug)}>
                    <Tooltip content={module.title} position={Position.TOP} showDelay={module.title.length > 20 ? 0 : 99999}>
                        <div>
                            {module.title_ ? module.title_.start : module.title.slice(0, 20) + (module.title.length > 20 ? '...' : '')}
                            {module.title_ && <mark>{module.title_.mark}</mark>}
                            {module.title_ && module.title_.end}
                        </div>
                    </Tooltip>
                </Link>
                <div className="module__body">{module.description}</div>
                <div className="module__footer">
                    <div className="module__terms">
                        {module.Dependencies.length ? <Tooltip content={'Имеет зависимости'} position={Position.BOTTOM}>
                            {module.Dependencies.length ? <img src={dependenciesIcon} /> : null}
                        </Tooltip> : null}
                    </div>
                    <button onClick={handleClick} className={"module-btn " + (module.buyed ? 'module-btn_buyed' : '')}>
                        {module.buyed ? <img src={checkCircleIcon} /> : '$' + module.price / 100}
                        <span className="module-btn__text">{module.buyed ? 'Куплено' : 'Купить'}</span>
                    </button>
                </div>
            </div>
            {module.buyed ? null : <Form ref={moduleBuyForm} method="post">
                <input type="hidden" name={'_action'} value='buy'/>
                <input type="hidden" name={'id'} value={module.id}/>
            </Form>}
        </div>
    );
};

export default Module;