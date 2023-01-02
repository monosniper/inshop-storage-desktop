import {json} from "@remix-run/node";
import {Form, useActionData, useLoaderData} from "@remix-run/react";
import {
    createCategory,
    deleteCategories,
    deleteCategory,
    getCategories,
    updateCategory
} from "~/models/category.server";

import styles from "~/styles/global.css";
import Layout from "~/components/Layout/Layout";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {Heading, Pane, SideSheet, TextInputField} from "evergreen-ui";
import plusIcon from "~/assets/icons/add.svg";
import {store} from "~/lib/mobx";
import {getSession} from "~/sessions";
import {getShops} from "~/models/shop.server";
import {requireUser} from "~/utils/session.server";
import positionsIcon from '~/assets/icons/nav/storage.svg';
import categoriesIcon from '~/assets/icons/nav/storage/categories.svg';
import categoriesIconBlack from '~/assets/icons/nav/storage/categories_black.svg';
import Categories from "~/components/Categories";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const loader = async ({ request }) => {
    const { data: session } = await getSession(request.headers.get("Cookie"))

    const user = await requireUser(request)
    let categories = []
    const noties = []

    const { domain } = session

    if(domain) {
        categories = await getCategories(domain)
        categories = categories.data.categories
    } else {
        noties.push({
            type: 'warning',
            message: 'Необходимо выбрать магазин'
        })
    }

    let shops = await getShops(user.id);
    shops = shops.data.shops

    return json({
        categories,
        shops,
        domain,
        user,
        noties,
        subNav: [
            {
                pathname: '/storage',
                icon: positionsIcon,
                title: 'Позиции',
            },
            {
                pathname: '/storage/categories',
                icon: categoriesIcon,
                title: 'Категории',
            },
        ],
    });
};

export const action = async ({ request }) => {
    const formData = await request.formData();

    let result = null;

    switch (formData.get('_action')) {
        case 'update':
            result = await updateCategory({
                filters: { id: formData.get('id') },
                set: {
                    title: formData.get('title'),
                },
                media: {
                    image: formData.get('image'),
                }
            });
            break;
        case 'create':
            result = await createCategory({
                title: formData.get('title'),
            });
            break;
        case "delete":
            result = await deleteCategory(formData.get('id'))
            break;
        case "deleteMany":
            result = await deleteCategories(formData.getAll('category_ids'))
            break;
    }

    return result
};

export default function CategoriesPage() {
    const data = useLoaderData();
    const actionData = useActionData();
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const [title, setTitle] = useState('');

    const handleCreate = () => {
        setIsCreateOpen(true)
    }

    console.log("HELOLO")
    console.log(data)

    useEffect(() => {
        if(actionData && actionData.data) {
            store.clearSelectedItems()

            actionData.data.updateCategory && toast('Изменения сохранены')
            actionData.data.deleteCategory && toast('Категория удалена')
            actionData.data.deleteCategories && toast('Категории удалены')

            if(actionData.data.createCategory) {
                setIsCreateOpen(false)
                toast('Категория создана успешно')

                setTitle(null)
            }
        }
    }, [actionData])

    return <Layout>
        <div className="title">
          <div className="title__left">
              <img src={categoriesIconBlack}/>
              Категории
          </div>
            <div className="title__right">
                <button onClick={handleCreate} className="btn">
                    <img src={plusIcon}/>
                    Добавить категорию
                </button>
            </div>
        </div>

        <Categories categories={data.categories} />

        <SideSheet
            width={500}
            isShown={isCreateOpen}
            onCloseComplete={() => setIsCreateOpen(false)}
            shouldCloseOnOverlayClick={false}
        >
            <Pane padding={16} borderBottom="muted">
                <Heading size={600}>Добавить категорию</Heading>
            </Pane>
            <Form method='post' encType={'multipart/form-data'} className="form">
                <input type="hidden" name={'_action'} value={'create'}/>
                <TextInputField
                    className={'field'}
                    label="Название"
                    name={'title'}
                    placeholder="Название..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="d-flex flex-end mt-1">
                    <button className="btn" type={'submit'}
                        // disabled={transition.state === "submitting"}
                    >Сохранить</button>
                </div>
            </Form>
        </SideSheet>
    </Layout>;
}