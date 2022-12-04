import React, {useEffect, useRef, useState, useTransition} from 'react';

import positionImg from '../assets/img/position.jpg'
import editIcon from '../assets/icons/edit.svg'
import deleteIcon from '../assets/icons/delete.svg'
import plusIcon from '../assets/icons/add.svg'
import Checkbox from "~/components/Checkbox";
import {Dialog, Heading, Label, Pane, SideSheet, Textarea, TextInputField, toaster} from "evergreen-ui";
import {Form, useActionData, useNavigate, useSubmit} from "@remix-run/react";
import {toast} from "react-toastify";
import {$positionTypes} from "~/config";
import {store} from "~/lib/mobx";
import {observer} from "mobx-react";
import checkIcon from "~/assets/icons/check.svg";
import ImageInput from "~/components/ImageInput";

const Position = ({ position, categories, currency }) => {
    const discount_types = {
        PERCENT: '%',
        AMOUNT: currency,
    }

    const submit = useSubmit();
    const actionData = useActionData();
    const deleteFor = useRef();

    const [selected, setSelected] = useState(store.selectedPositions.has(position.id))
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isPropCreateShown, setIsPropCreateShown] = useState(false)
    const [isSureDeleteShown, setIsSureDeleteShown] = useState(false)

    const [title, setTitle] = useState(position.title);
    const [type, setType] = useState('');
    const [subtitle, setSubtitle] = useState(position.subtitle);
    const [description, setDescription] = useState(position.description);
    const [price, setPrice] = useState(position.price);
    const [inStock, setInStock] = useState(position.inStock);
    const [categoryId, setCategoryId] = useState(position.Category.Id);
    const [priority, setPriority] = useState(position.priority);
    const [discount, setDiscount] = useState(position.discount);
    const [discountType, setDiscountType] = useState(position.discountType);
    const [properties, setProperties] = useState(position.properties);

    const thumb = position.Media.length && position.Media.find(media => media.name === 'thumb') ? [
        position.Media.find(media => media.name === 'thumb').filename
    ] : []
    const images = position.Media.length && position.Media.find(media => media.name === 'image') ?
        position.Media.filter(media => media.name === 'image').map(image => image.filename) : []

    const [newPropKey, setNewPropKey] = useState('');

    useEffect(() => {
        setSelected(store.selectedPositions.has(position.id))
    }, [store.selectedPositions.size])

    const handleSelect = checked => {
        setSelected(checked)

        if(selected) {
            store.unselectPosition(position.id)
        } else {
            store.selectPosition(position.id)
        }
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
        if(actionData && actionData.data && actionData.data.updatePosition) {
            setIsEditOpen(false)
        }
    }, [actionData])

    const getThumbPath = () => {
        return thumb.length ? `https://www.inshop-online.com/storage/${position.uuid}/images/${thumb[0]}` : positionImg
    }

    return (
        <div className={'position'}>
            <div className="position__col position__col_1">
                <Checkbox handleCheck={handleSelect} checked={selected} />
                {/*<div className={'my-checkbox'}>*/}
                {/*    <input type="checkbox" defaultChecked={store.selectedPositions.has(position.id)}/>*/}
                {/*    <label onClick={handleSelect} className="checkbox">*/}
                {/*        <img src={checkIcon}/>*/}
                {/*    </label>*/}
                {/*</div>*/}
            </div>
            <div className="position__col position__col_1 position__id position__number">{position.id}</div>
            <div className="position__col position__col_2">
                <div className="position__img" style={{backgroundImage: `url(${getThumbPath()})`}} />
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
                <div className={"position__btn position__btn_edit " + (store.isSelectBarShown ? 'position__btn_disabled' : '')} onClick={handleEdit}>
                    <img src={editIcon} />
                </div>
                <div className={"position__btn position__btn_delete " + (store.isSelectBarShown ? 'position__btn_disabled' : '')} onClick={handlePreDelete}>
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
                <Form method='post' encType={'multipart/form-data'} className="form">
                    <input type="hidden" name={'_action'} value={'update'}/>
                    <input type="hidden" name={'id'} value={position.id}/>
                    <Label marginBottom={4} display="block">
                        Превью
                    </Label>
                    <ImageInput
                        uuid={position.uuid}
                        images={thumb}
                    />
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
                    <Label marginBottom={8} display="block">
                        Тип позиции
                    </Label>
                    <select
                        className={'field ub-mb_24px'}
                        name={'type'}
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        {$positionTypes.map((type, i) => <option key={'type-'+i} value={type.slug}>{type.title}</option>)}
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
                                        name={`properties_keys`}
                                        value={property[0]}
                                        className={'field'}
                                        placeholder="Название..."
                                        readOnly
                                    />
                                </div>
                                <div className="property__col">
                                    <input
                                        name={`properties_values`}
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

                    <Label marginBottom={4} marginTop={4} display="block">
                        Картинки
                    </Label>
                    <ImageInput
                        uuid={position.uuid}
                        images={images}
                        multiple
                    />

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
                <Form ref={deleteFor} method="post">
                    <input type="hidden" name={'_action'} value={'delete'}/>
                    <input type="hidden" name={'id'} value={position.id}/>
                </Form>
            </Dialog>
        </div>
    );
};

export default observer(Position);