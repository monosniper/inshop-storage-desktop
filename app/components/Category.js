import React, {useEffect, useRef, useState} from 'react';

import categoryImg from '../assets/img/category.jpg'
import editIcon from '../assets/icons/edit.svg'
import deleteIcon from '../assets/icons/delete.svg'
import Checkbox from "~/components/Checkbox";
import {Dialog, Heading, Label, Pane, SideSheet, TextInputField,} from "evergreen-ui";
import {Form, useActionData, useSubmit} from "@remix-run/react";
import {store} from "~/lib/mobx";
import {observer} from "mobx-react";
import ImageInput from "~/components/ImageInput";

const Category = ({ category }) => {
    const submit = useSubmit();
    const actionData = useActionData();
    const deleteFor = useRef();

    const [selected, setSelected] = useState(store.hasSelectedItem(category.id, location.pathname))
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isSureDeleteShown, setIsSureDeleteShown] = useState(false)

    const [title, setTitle] = useState(category.title);

    const image = category.Media && category.Media.length && category.Media.find(media => media.name === 'image') ? [
        category.Media.find(media => media.name === 'image').filename
    ] : []

    useEffect(() => {
        setSelected(store.hasSelectedItem(category.id, location.pathname))
    }, [store.selectedItems.length])

    const handleSelect = checked => {
        setSelected(checked)

        if(selected) {
            store.unselectItem(category.id, location.pathname)
        } else {
            store.selectItem(category.id, location.pathname)
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

    useEffect(() => {
        if(actionData && actionData.data && actionData.data.updateCategory) {
            setIsEditOpen(false)
        }
    }, [actionData])

    const getImagePath = () => {
        return image.length ? `https://www.inshop-online.com/storage/${category.uuid}/images/${image[0]}` : categoryImg
    }

    return (
        <div className={'row'}>
            <div className="row__col row__col_1">
                <Checkbox handleCheck={handleSelect} checked={selected} />
                {/*<div className={'my-checkbox'}>*/}
                {/*    <input type="checkbox" defaultChecked={store.selectedItems.has(category.id)}/>*/}
                {/*    <label onClick={handleSelect} className="checkbox">*/}
                {/*        <img src={checkIcon}/>*/}
                {/*    </label>*/}
                {/*</div>*/}
            </div>
            <div className="row__col row__col_1 row__id row__number">{category.id}</div>
            <div className="row__col row__col_2">
                <div className="row__img" style={{backgroundImage: `url(${getImagePath()})`}} />
            </div>
            <div className="row__col row__col_4">{category.title}</div>
            <div className="row__col row__col_2 row__btns">
                <div className={"row__btn row__btn_edit " + (store.isSelectBarShown ? 'row__btn_disabled' : '')} onClick={handleEdit}>
                    <img src={editIcon} />
                </div>
                <div className={"row__btn row__btn_delete " + (store.isSelectBarShown ? 'row__btn_disabled' : '')} onClick={handlePreDelete}>
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
                    <Heading size={600}>Редактирование <b>#{category.id}</b></Heading>
                </Pane>
                <Form method='post' encType={'multipart/form-data'} className="form">
                    <input type="hidden" name={'_action'} value={'update'}/>
                    <input type="hidden" name={'id'} value={category.id}/>
                    <TextInputField
                        className={'field'}
                        label="Название"
                        name={'title'}
                        placeholder="Название..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <Label marginBottom={4} marginTop={4} display="block">
                        Картинка
                    </Label>
                    <ImageInput
                        uuid={category.uuid}
                        images={image}
                        name={'image'}
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
                Категория будет удалена безвозвратно
                <Form ref={deleteFor} method="post">
                    <input type="hidden" name={'_action'} value={'delete'}/>
                    <input type="hidden" name={'id'} value={category.id}/>
                </Form>
            </Dialog>
        </div>
    );
};

export default observer(Category);