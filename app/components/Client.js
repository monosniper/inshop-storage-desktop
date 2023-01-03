import React, {useEffect, useRef, useState} from 'react';

import clientImg from '../assets/img/client.png'
import editIcon from '../assets/icons/edit.svg'
import deleteIcon from '../assets/icons/delete.svg'
import Checkbox from "~/components/Checkbox";
import {Dialog, Heading, Label, Pane, SideSheet, TextInputField,} from "evergreen-ui";
import {Form, useActionData, useLoaderData, useLocation, useSubmit} from "@remix-run/react";
import {store} from "~/lib/mobx";
import {observer} from "mobx-react";
import ImageInput from "~/components/ImageInput";

const Client = ({ client }) => {
    const submit = useSubmit();
    const actionData = useActionData();
    const deleteFor = useRef();
    const location = useLocation()

    const [selected, setSelected] = useState(store.hasSelectedItem(client.id, location.pathname))
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isSureDeleteShown, setIsSureDeleteShown] = useState(false)

    const [fio, setFio] = useState(client.fio);
    const [email, setEmail] = useState(client.email);
    const [address, setAddress] = useState(client.address);
    const [phone, setPhone] = useState(client.phone);
    const [age, setAge] = useState(client.age);
    const [password, setPassword] = useState();

    const avatar = client.Media && client.Media.length && client.Media.find(media => media.name === 'avatar') ? [
        client.Media.find(media => media.name === 'avatar').filename
    ] : []

    useEffect(() => {
        setSelected(store.hasSelectedItem(client.id, location.pathname))
    }, [store.selectedItems.length])

    const handleSelect = checked => {
        setSelected(checked)

        if(selected) {
            store.unselectItem(client.id, location.pathname)
        } else {
            store.selectItem(client.id, location.pathname)
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
        if(actionData && actionData.data) {
            actionData.data.updateClient && setIsEditOpen(false)
            actionData.data.deleteClients && setIsSureDeleteShown(false)
        }
    }, [actionData])

    const getAvatarPath = () => {
        return avatar.length ? `https://www.inshop-online.com/storage/${client.uuid}/images/${avatar[0]}` : clientImg
    }

    return (
        <div className={'row'}>
            <div className="row__col row__col_1">
                <Checkbox handleCheck={handleSelect} checked={selected} />
            </div>
            <div className="row__col row__col_1 row__id row__number">{client.id}</div>
            <div className="row__col row__col_2">
                <div className="row__img" style={{backgroundImage: `url(${getAvatarPath()})`}} />
            </div>
            <div className="row__col row__col_4">{client.fio}</div>
            <div className="row__col row__col_4"><a className={'link'} href={"mailto:"+client.email}>{client.email}</a></div>
            <div className="row__col row__col_2"><a className={'link'} href={"tel:"+client.phone}>{client.phone}</a></div>
            <div className="row__col row__col_3">{client.address}</div>
            <div className="row__col row__col_1">{client.age}</div>

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
                    <Heading size={600}>Редактирование <b>#{client.id}</b></Heading>
                </Pane>
                <Form method='post' encType={'multipart/form-data'} className="form">
                    <input type="hidden" name={'_action'} value={'update'}/>
                    <input type="hidden" name={'id'} value={client.id}/>
                    <TextInputField
                        className={'field'}
                        label="ФИО"
                        name={'fio'}
                        placeholder="ФИО..."
                        value={fio}
                        onChange={(e) => setFio(e.target.value)}
                    />
                    <TextInputField
                        className={'field'}
                        name={'email'}
                        label="Почта"
                        type="email"
                        placeholder="E-mail адрес..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextInputField
                        className={'field'}
                        name={'address'}
                        label="Адрес"
                        placeholder="Адрес..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <div className="form__row">
                        <div className="form__col">
                            <TextInputField
                                className={'field'}
                                type={'number'}
                                name={'age'}
                                max={150}
                                min={0}
                                label="Возраст"
                                placeholder="Возраст..."
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </div>
                        <div className="form__col">
                            <TextInputField
                                className={'field'}
                                type={'string'}
                                name={'phone'}
                                label="Номер"
                                placeholder="Номер телефона..."
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <TextInputField
                        className={'field'}
                        name={'password'}
                        label="Новый пароль"
                        type="password"
                        placeholder="Пароль..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Label marginBottom={4} marginTop={4} display="block">
                        Аватар
                    </Label>
                    <ImageInput
                        uuid={client.uuid}
                        images={avatar}
                        name={'avatar'}
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
                Клиент будет удален навсегда
                <Form ref={deleteFor} method="post">
                    <input type="hidden" name={'_action'} value={'delete'}/>
                    <input type="hidden" name={'id'} value={client.id}/>
                </Form>
            </Dialog>
        </div>
    );
};

export default observer(Client);