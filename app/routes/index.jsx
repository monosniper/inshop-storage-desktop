import globalStyles from "~/styles/global.css";
import styles from "~/styles/index.css";
import Layout from "~/components/Layout/Layout";
import {observer} from "mobx-react";
import {json} from "@remix-run/node";
import {getDomains, getShops} from "~/models/shop.server";
import {requireUser} from "~/utils/session.server";
import {getSession} from "~/sessions";
import Shops from "~/components/Shops";
import {Form, useActionData, useLoaderData} from "@remix-run/react";
import {Heading, Label, Pane, SideSheet, TextInputField} from "evergreen-ui";
import React, {useEffect, useState} from "react";
import plusIcon from "~/assets/icons/add.svg";
import {createShop, deleteShop, updateShop} from "~/models/shop.server";
import {toast} from "react-toastify";
import Select from "react-select";
import shopsIcon from "~/assets/icons/nav/index/shops.svg";
import domainsIcon from "~/assets/icons/nav/index/domains.svg";

export function links() {
    return [
        { rel: "stylesheet", href: globalStyles },
        { rel: "stylesheet", href: styles },
    ];
}

export const action = async ({ request }) => {
    const formData = await request.formData();
    const user = await requireUser(request)
    let result = null;

    switch (formData.get('_action')) {
        case 'update':
            const patch = {
                filters: { id: formData.get('id') },
                set: {
                    domainId: formData.get('domain'),
                    options: {
                        title: formData.get('title'),
                        description: formData.get('description'),
                    }
                },
                media: {
                    preview: formData.get('preview'),
                    favicon: formData.get('favicon'),
                }
            }

            result = await updateShop(patch);
            break;
        case 'create':
            result = await createShop({
                userId: user.id,
                domainId: formData.get('domain'),
                options: {
                    title: formData.get('title'),
                    description: formData.get('description'),
                }
            });
            break;
        case "delete":
            result = await deleteShop(formData.get('id'))
            break;
    }

    return result
};

export const loader = async ({ request }) => {
    const user = await requireUser(request)
    const session = await getSession(request.headers.get('Cookie'))
    let shops = await getShops(user.id);

    if(shops) shops = shops.data.shops
    else shops = []

    let domains = await getDomains(user.id, true);

    if(domains) domains = domains.data.domains
    else domains = []

    return json({
        user,
        domain: session.get('domain'),
        shops,
        domains,
        subNav: [
            {
                pathname: '/',
                icon: shopsIcon,
                title: 'Магазины',
            },
            {
                pathname: '/domains',
                icon: domainsIcon,
                title: 'Доменные имена',
            },
        ],
    });
};

const Index = observer(() => {
    const actionData = useActionData()
    const {shops, domains} = useLoaderData()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    console.log(domains)
    const handleCreate = () => setIsCreateOpen(true)

    useEffect(() => {
        if(actionData && actionData.data) {
            actionData.data.updateShop && toast('Изменения сохранены')
            actionData.data.deleteShop && toast('Магазин удален')

            if(actionData.data.createShop) {
                setIsCreateOpen(false)
                toast('Магазин создан успешно')

                setTitle(null)
                setDescription(null)
            }
        }
    }, [actionData])

    return (
        <Layout>
            <div className="title">
                <div className="title__left"></div>
                <div className="title__right">
                    <button onClick={handleCreate} className="btn">
                        <img src={plusIcon}/>
                        Создать магазин
                    </button>
                </div>
            </div>

            <Shops shops={shops} />

            <SideSheet
                width={500}
                isShown={isCreateOpen}
                onCloseComplete={() => setIsCreateOpen(false)}
                shouldCloseOnOverlayClick={false}
            >
                <Pane padding={16} borderBottom="muted">
                    <Heading size={600}>Создание магазина</Heading>
                </Pane>
                <Form method='post' encType={'multipart/form-data'} className="form">
                    <input type="hidden" name={'_action'} value={'create'}/>
                    <TextInputField
                        className={'field'}
                        label="Название"
                        name={'title'}
                        placeholder="Название..."
                    />
                    <TextInputField
                        className={'field'}
                        name={'description'}
                        label="Описание"
                        type="text"
                        placeholder="Описание..."
                    />

                    <Label className={'lbl ub-mb_8px'}>Доменное имя</Label>
                    <Select
                        placeholder={'Выберите доменное имя'}
                        name={'domain'}
                        options={domains.map(({id: value, name: label}) => {
                            return { value, label }
                        })}
                    />

                    <div className="d-flex flex-end mt-1">
                        <button className="btn" type={'submit'}
                            // disabled={transition.state === "submitting"}
                        >Сохранить</button>
                    </div>
                </Form>
            </SideSheet>
        </Layout>
    );
})

export default Index