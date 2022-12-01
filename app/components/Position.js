import React, {useEffect, useRef, useState, useTransition} from 'react';

import positionImg from '../assets/img/position.jpg'
import editIcon from '../assets/icons/edit.svg'
import deleteIcon from '../assets/icons/delete.svg'
import plusIcon from '../assets/icons/add.svg'
import Checkbox from "~/components/Checkbox";
import {Dialog, Heading, Label, Pane, SideSheet, Textarea, TextInputField, toaster} from "evergreen-ui";
import {Form, useActionData, useSubmit} from "@remix-run/react";
import {toast} from "react-toastify";

const Position = ({ position, categories, currency }) => {
    const discount_types = {
        PERCENT: '%',
        AMOUNT: currency,
    }

    const submit = useSubmit();
    const actionData = useActionData();
    const deleteFor = useRef();

    const [selected, setSelected] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isPropCreateShown, setIsPropCreateShown] = useState(false)
    const [isSureDeleteShown, setIsSureDeleteShown] = useState(false)

    const [title, setTitle] = useState(position.title);
    const [subtitle, setSubtitle] = useState(position.subtitle);
    const [description, setDescription] = useState(position.description);
    const [price, setPrice] = useState(position.price);
    const [inStock, setInStock] = useState(position.inStock);
    const [categoryId, setCategoryId] = useState(position.Category.Id);
    const [priority, setPriority] = useState(position.priority);
    const [discount, setDiscount] = useState(position.discount);
    const [discountType, setDiscountType] = useState(position.discountType);
    const [properties, setProperties] = useState(position.properties);

    const [newPropKey, setNewPropKey] = useState('');

    const handleSelect = checked => {
        setSelected(checked)
    }

    const handleEdit = () => {
        setIsEditOpen(true)
    }

    const handlePreDelete = () => {
        setIsSureDeleteShown(true)
    }

    const handleDelete = () => {
        setIsSureDeleteShown(false)
        submit(deleteFor.current, { replace: true });
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
        setNewPropKey('')
    }

    useEffect(() => {
        console.log(actionData)
        if(actionData && actionData.data && actionData.data.updatePosition) {
            setIsEditOpen(false)
            toast('Изменения сохранены')
        }
    }, [actionData])

    return (
        <div className={'position'}>
            <div className="position__col position__col_1">
                <Checkbox handleCheck={handleSelect} defaultChecked={selected} />
            </div>
            <div className="position__col position__col_1 position__id position__number">{position.id}</div>
            <div className="position__col position__col_2">
                <div className="position__img" style={{backgroundImage: `url(${positionImg})`}} />
            </div>
            <div className="position__col position__col_4">{position.title}</div>
            <div className="position__col position__col_3">{position.subtitle}</div>
            <div className="position__col position__col_3">{position.Category.name}</div>
            <div className="position__col position__col_1 position__number position__price">
                <span>{position.price}{currency}</span>
                {position.discount && <span className={'position__discount'}>-{position.discount}{discount_types[position.discount_type]}</span>}
            </div>
            <div className="position__col position__col_1 position__number">{position.inStock}</div>
            <div className="position__col position__col_1 position__number">{position.priority}</div>
            <div className="position__col position__col_2 position__btns">
                <div className="position__btn position__btn_edit" onClick={handleEdit}>
                    <img src={editIcon} />
                </div>
                <div className="position__btn position__btn_delete" onClick={handlePreDelete}>
                    <img src={deleteIcon} />
                </div>
            </div>
            <SideSheet
                width={500}
                isShown={isEditOpen}
                onCloseComplete={() => setIsEditOpen(false)}
                shouldCloseOnOverlayClick={false}
            >
                <Pane padding={16} borderBottom="muted">
                    <Heading size={600}>Редактирование <b>#{position.id}</b></Heading>
                </Pane>
                <Form method='post' className="form">
                    <input type="hidden" name={'id'} value={position.id}/>
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
                                <option value="PERCENT">Процент</option>
                                <option value="AMOUNT">Сумма</option>
                            </select>
                        </div>
                    </div>
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
            <Dialog
                isShown={isSureDeleteShown}
                title="Вы уверены?"
                intent="danger"
                onCloseComplete={() => setIsSureDeleteShown(false)}
                confirmLabel="Да"
                cancelLabel="Отмена"
                onConfirm={handleDelete}
                // hasFooter={false}
            >
                Позиция будет удалена безвозвратно
                <Form ref={deleteFor} method="post" action={'/storage/delete'}>
                    <input type="hidden" name={'id'} value={position.id}/>
                </Form>
            </Dialog>
        </div>
    );
};

export default Position;