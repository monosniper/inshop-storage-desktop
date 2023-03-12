import React, {useEffect, useRef, useState} from 'react';
import globalStyles from "~/styles/global.css";
import storeStyles from "~/styles/pages/store.css";
import styles from "~/styles/pages/library.css";
import {requireUser} from "~/utils/session.server";
import {getSession} from "~/sessions";
import {getShops} from "~/models/shop.server";
import {json} from "@remix-run/node";
import {getModule, activateModule, deactivateModule, getModules, saveModule} from "~/models/module.server";
import {Form, useActionData, useLoaderData, useSubmit} from "@remix-run/react";
import moduleImg from "~/assets/img/module.png";
import LibraryLayout from "~/components/Layout/LibraryLayout";
import Switch from "~/components/ui/Switch";
import {toast} from "react-toastify";

export function links() {
    return [
        { rel: "stylesheet", href: globalStyles },
        { rel: "stylesheet", href: storeStyles },
        { rel: "stylesheet", href: styles },
    ];
}

export const action = async ({ request }) => {
    const formData = await request.formData();
    const { data: session } = await getSession(request.headers.get("Cookie"))

    const { domain } = session

    const action_ = {
        activate: activateModule,
        deactivate: deactivateModule,
    }

    const id = formData.get('id')

    if (formData.get('_action') === 'save') {
        return await saveModule(domain, JSON.parse(formData.get('options')), id);
    } else {
        return await action_[formData.get('_action')](domain, id);
    }
};

export const loader = async ({ request, params }) => {
    const user = await requireUser(request)
    const { data: session } = await getSession(request.headers.get("Cookie"))

    let module
    const noties = []
    let modules = []
    let shops = await getShops(user.id);
    shops = shops.data.shops

    const { domain } = session

    if(domain) {
        module = await getModule(domain, params.slug)
        module = module.data.module

        modules = await getModules(domain, true)
        modules = modules.data.modules
    } else {
        noties.push({
            type: 'warning',
            message: 'Необходимо выбрать магазин'
        })
    }

    return json({
        user,
        domain,
        shops,
        module,
        modules,
        noties,
    });
};

const slugField = (field, value, onChange) => {
    if (field.type === 'input') {
        return <div className="slug__field">
            <label>{field.label}</label>
            <input value={value} onChange={(value) => onChange(value, field.slug)} defaultValue={field.defaultValue} type="text"/>
        </div>
    } else {
        return <div className="slug__switch">
            <label>{field.label}</label>
            <Switch onChange={(value) => onChange(value, field.slug)} defaultChecked={field.defaultValue} />
        </div>
    }
}

const ModulePage = () => {
    const loaderData = useLoaderData()
    const actionData = useActionData()
    const module = loaderData.module
    const [options, setOptions] = useState(module.options)
    const [showedToast, setShowedToast] = useState(false)
    const [moduleOptions, setModuleOptions] = useState(module.default_options)
    console.log(module)
    useEffect(() => {
        const newOptions = {...options}
        module.default_options?.fields.forEach(field => {
            if(!newOptions[field.slug]) newOptions[field.slug] = field.defaultValue
        })
        setOptions(newOptions)
    }, [])

    useEffect(() => {
        if(actionData && actionData.data) {
            actionData.data.activateModule && !showedToast && toast('Модуль был активирован'); setShowedToast(true)
            actionData.data.deactivateModule && !showedToast && toast('Модуль был деактивирован'); setShowedToast(true)
            actionData.data.saveModule && !showedToast && toast('Изменения сохранены'); setShowedToast(true)
        }
    }, [actionData])

    const submit = useSubmit();
    const moduleActivationForm = useRef();
    const moduleOptionsForm = useRef();

    const image = module.Media?.length && module.Media.find(media => media.name === 'image') ? [
        module.Media.find(media => media.name === 'image').filename
    ] : []
    const images = module.Media?.length && module.Media.find(media => media.name === 'images') ?
        module.Media.filter(media => media.name === 'images').map(image => image.filename) : []

    const getImagePath = (filename=image[0], s=false) => {
        return image.length ? `https://www.inshop-online.com/storage/modules/${module.uuid}/image${s?'s':''}/${filename}` : moduleImg
    }

    const getImagesPath = (filename) => {
        return `https://www.inshop-online.com/storage/modules/${module.uuid}/images/${filename}`
    }

    const handleClick = () => {
        submit(moduleActivationForm.current, { replace: true });
    }

    const onOptionsChange = (e, slug) => {
        const newOptions = {...options}
        newOptions[slug] = e.target.value
        setOptions(newOptions)
    }

    const toggle = () => {
        submit(moduleActivationForm.current, { replace: true });
    }

    const save = () => {
        submit(moduleOptionsForm.current, { replace: true });
    }
    console.log(options)
    return <LibraryLayout>
        <div className="slug__title">
            <div>
                <span>{module.title}</span>
                <span>
                    <Switch onChange={toggle} defaultChecked={module.isActive} />
                </span>
            </div>
            <div>
                <a href={`/store/${module.slug}`} className="link">Страница в магазине</a>
            </div>
        </div>
        <div className="slug__form">
            {module.default_options?.fields.map((field) => slugField(field, options[field.slug], onOptionsChange))}
        </div>
        <div className="slug__end">
            <button onClick={save} className="btn">Сохранить</button>
        </div>
        <Form ref={moduleOptionsForm} method="post">
            <input type="hidden" name={'_action'} value={'save'}/>
            <input type="hidden" name={'id'} value={module.id}/>
            <input type="hidden" name={'options'} value={JSON.stringify(options)}/>
        </Form>
        <Form ref={moduleActivationForm} method="post">
            <input type="hidden" name={'_action'} value={module.buyed ? module.isActive ? 'deactivate' : 'activate' : 'buy'}/>
            <input type="hidden" name={'id'} value={module.id}/>
        </Form>
    </LibraryLayout>
};

export default ModulePage;