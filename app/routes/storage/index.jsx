import {json, redirect} from "@remix-run/node";
import {Form, useActionData, useLoaderData} from "@remix-run/react";
import {createPosition, deletePosition, deletePositions, getPositions, updatePosition} from "~/models/position.server";
import { getCategories } from "~/models/category.server";

import styles from "~/styles/global.css";
import Positions from "~/components/Positions";
import Layout from "~/components/Layout";
import storageIcon from "~/assets/icons/black_storage.svg";
import addIcon from "~/assets/icons/add.svg";
import {useEffect, useRef, useState, useTransition} from "react";
import {toast} from "react-toastify";
import {Dialog, Heading, Label, Pane, SideSheet, Textarea, TextInputField} from "evergreen-ui";
import plusIcon from "~/assets/icons/add.svg";
import deleteIcon from "~/assets/icons/delete.svg";
import {$positionTypes} from "~/config";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const loader = async () => {
  return json({
    categories: await getCategories(),
    positions: await getPositions(),
  });
};

export const action = async ({ request }) => {
    const formData = await request.formData();

    let result = null;

    switch (formData.get('_action')) {
        case 'update':
            result = await updatePosition({
                filters: { id: formData.get('id') },
                set: {
                    title: formData.get('title'),
                    type: formData.get('type'),
                    subtitle: formData.get('subtitle'),
                    description: formData.get('description'),
                    price: Number(formData.get('price')),
                    inStock: Number(formData.get('inStock')),
                    CategoryId: Number(formData.get('CategoryId')),
                    priority: Number(formData.get('priority')),
                    discount: Number(formData.get('discount')),
                    discount_type: formData.get('discount_type'),
                    // properties: Object.fromEntries(formData.get('properties')),
                }
            });
            break;
        case 'create':
            result = await createPosition({
                title: formData.get('title'),
                subtitle: formData.get('subtitle'),
                type: formData.get('type'),
                description: formData.get('description'),
                price: Number(formData.get('price')),
                inStock: Number(formData.get('inStock')),
                CategoryId: Number(formData.get('CategoryId')),
                priority: Number(formData.get('priority')),
                discount: Number(formData.get('discount')),
                discount_type: formData.get('discount_type'),
                // properties: Object.fromEntries(formData.get('properties')),
            });
            break;
        case "delete":
            result = await deletePosition(formData.get('id'))
            break;
        case "deleteMany":
            result = await deletePositions(formData.getAll('position_ids'))
            break;
    }

    return result
};

export default function Storage() {
    const data = useLoaderData();
    const actionData = useActionData();
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const categories = data.categories.data.categories
    const propField = useRef()

    const [isPropCreateShown, setIsPropCreateShown] = useState(false)

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState();
    const [inStock, setInStock] = useState();
    const [categoryId, setCategoryId] = useState();
    const [priority, setPriority] = useState();
    const [discount, setDiscount] = useState();
    const [discountType, setDiscountType] = useState($positionTypes[0].slug);
    const [properties, setProperties] = useState({});

    const [newPropKey, setNewPropKey] = useState('');

    const handleCreate = () => {
        setIsCreateOpen(true)
    }

    const handlePropUpdate = (key, value) => {
        const newProperties = JSON.parse(JSON.stringify(properties))

        newProperties[key.toString()] = value

        setProperties(newProperties)
    }

    const handlePropDelete = key => {
        const newProperties = JSON.parse(JSON.stringify(properties))
        delete newProperties[key.toString()]
        setProperties(JSON.parse(JSON.stringify(newProperties)))
    }
    const handlePropCreate = () => {
        const key = newPropKey.toString().trim()

        if(key !== "") {
            const newProperties = JSON.parse(JSON.stringify(properties))

            newProperties[key] = ""

            setProperties(newProperties)

            setIsPropCreateShown(false)
        }
    }

    const handlePrePropCreate = () => {
        setIsPropCreateShown(true)
        propField.current.focus()
        setNewPropKey('')
    }

    useEffect(() => {
        if(actionData && actionData.data) {
            actionData.data.updatePosition && toast('Изменения сохранены')
            actionData.data.deletePosition && toast('Позиция удалена')
            actionData.data.deletePositions && toast('Позиции удалены')
            if(actionData.data.createPosition) {
                setIsCreateOpen(false)
                toast('Позиция создана успешно')

                setTitle(null)
                setSubtitle(null)
                setType(null)
                setDescription(null)
                setPrice(null)
                setInStock(null)
                setCategoryId(null)
                setPriority(null)
                setDiscount(null)
                setDiscountType(null)
                setProperties({})
            }
        }
    }, [actionData])

    return <Layout>
        <div className="title">
          <div className="title__left">
              <img src={storageIcon}/>
              Общий склад
          </div>
            <div className="title__right">
                <button onClick={handleCreate} className="btn">
                    <img src={addIcon}/>
                    Добавить позицию
                </button>
            </div>
        </div>
        <Positions
            positions={data.positions.data.positions}
            categories={categories}
        />
        <SideSheet
            width={500}
            isShown={isCreateOpen}
            onCloseComplete={() => setIsCreateOpen(false)}
            shouldCloseOnOverlayClick={false}
        >
            <Pane padding={16} borderBottom="muted">
                <Heading size={600}>Добавить позицию</Heading>
            </Pane>
            <Form method='post' className="form">
                <input type="hidden" name={'_action'} value={'create'}/>
                <TextInputField
                    className={'field'}
                    label="Название"
                    name={'title'}
                    placeholder="Название..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextInputField
                    className={'field'}
                    name={'subtitle'}
                    label="Подзаголовок"
                    placeholder="Подзаголовок..."
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                />
                <Label marginBottom={4} display="block">
                    Описание
                </Label>
                <Textarea
                    className={'field'}
                    name={'description'}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Описание..."
                />
                <div className="form__row">
                    <div className="form__col">
                        <TextInputField
                            className={'field'}
                            type={'number'}
                            name={'price'}
                            label="Цена"
                            placeholder="Цена..."
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className="form__col">
                        <TextInputField
                            className={'field'}
                            type={'number'}
                            name={'inStock'}
                            label="В наличии"
                            placeholder="В наличии..."
                            value={inStock}
                            onChange={(e) => setInStock(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form__row">
                    <div className="form__col">
                        <Label marginBottom={8} display="block">
                            Категория
                        </Label>
                        <select
                            className={'field'}
                            name={'CategoryId'}
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            {categories.map(cat => <option key={'cat-'+cat.id} value={cat.id}>{cat.title}</option>)}
                        </select>
                    </div>
                    <div className="form__col">
                        <TextInputField
                            className={'field'}
                            type={'number'}
                            name={'priority'}
                            label="Приоритет"
                            placeholder="Приоритет..."
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form__row">
                    <div className="form__col">
                        <TextInputField
                            name={'discount'}
                            className={'field'}
                            type={'number'}
                            label="Скидка"
                            placeholder="Скидка..."
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                        />
                    </div>
                    <div className="form__col">
                        <Label marginBottom={8} display="block">
                            Тип скидки
                        </Label>
                        <select
                            name={'discount_type'}
                            className={'field'}
                            value={discountType}
                            onChange={(e) => setDiscountType(e.target.value)}
                        >
                            <option value="PERCENT" selected>Процент</option>
                            <option value="AMOUNT">Сумма</option>
                        </select>
                    </div>
                </div>
                <Label marginBottom={8} display="block">
                    Тип позиции
                </Label>
                <select
                    className={'field ub-mb_24px'}
                    name={'type'}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    {$positionTypes.map((type, i) => <option key={'type-'+i} value={type.slug} selected>{type.title}</option>)}
                </select>
                <div className="form__header">
                    <Label display="block">
                        Свойства
                    </Label>
                    <button type={'button'} onClick={handlePrePropCreate} className="btn btn_sm btn_lime">
                        <img src={plusIcon} />
                    </button>
                </div>

                <Dialog
                    isShown={isPropCreateShown}
                    title="Новое свойство"
                    onCloseComplete={() => setIsPropCreateShown(false)}
                    confirmLabel="Создать"
                    cancelLabel="Отмена"
                    onConfirm={handlePropCreate}
                >
                    <input
                        ref={propField}
                        className={'field'}
                        placeholder="Название..."
                        value={newPropKey}
                        onChange={(e) => setNewPropKey(e.target.value)}
                    />
                </Dialog>

                {properties && Object.entries(properties).map((property, i) => {
                    return (
                        <div key={'property-' + i} className="property">
                            <div className="property__col">
                                <input
                                    name={`properties[${i}][key]`}
                                    value={property[0]}
                                    className={'field'}
                                    placeholder="Название..."
                                    readOnly
                                />
                            </div>
                            <div className="property__col">
                                <input
                                    name={`properties[${i}][value]`}
                                    value={property[1]}
                                    onChange={(e) => handlePropUpdate(property[0], e.target.value)}
                                    className={'field'}
                                    placeholder="Значение..."
                                />
                            </div>
                            <button className="btn btn_sm btn_red property__btn" onClick={() => handlePropDelete(property[0])}>
                                <img src={deleteIcon}/>
                            </button>
                        </div>
                    )
                })}

                <div className="d-flex flex-end mt-1">
                    <button className="btn" type={'submit'}
                        // disabled={transition.state === "submitting"}
                    >Сохранить</button>
                </div>
            </Form>
        </SideSheet>
    </Layout>;
}