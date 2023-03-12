import React, {useEffect, useRef, useState} from 'react';

import deleteIcon from '../assets/icons/delete.svg'
import Checkbox from "~/components/Checkbox";
import {Dialog} from "evergreen-ui";
import {Form, useActionData, useLocation, useSubmit} from "@remix-run/react";
import {store} from "~/lib/mobx";
import {observer} from "mobx-react";

const Client = ({ domain }) => {
    const submit = useSubmit();
    const actionData = useActionData();
    const deleteFor = useRef();
    const location = useLocation()

    const [selected, setSelected] = useState(store.hasSelectedItem(domain.id, location.pathname))
    const [isSureDeleteShown, setIsSureDeleteShown] = useState(false)

    useEffect(() => {
        setSelected(store.hasSelectedItem(domain.id, location.pathname))
    }, [store.selectedItems.length])

    const handleSelect = checked => {
        setSelected(checked)

        if(selected) {
            store.unselectItem(domain.id, location.pathname)
        } else {
            store.selectItem(domain.id, location.pathname)
        }
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
            actionData.data.deleteDomain && setIsSureDeleteShown(false)
            actionData.data.deleteDomains && setIsSureDeleteShown(false)
        }
    }, [actionData])

    return (
        <div className={'row'}>
            <div className="row__col row__col_1">
                <Checkbox handleCheck={handleSelect} checked={selected} />
            </div>
            <div className="row__col row__col_1 row__id row__number">{domain.id}</div>
            <div className="row__col"><a className={'link'} target={'_blank'} href={'http://'+domain.name}>{domain.name}</a></div>
            <div className="row__col">
                {/*  Current shop  */}
            </div>
            <div className="row__col">
                {/*  Состояние - активен (днс направлен)  */}
            </div>
            <div className="row__col row__btns">
                <div className={"row__btn row__btn_delete " + (store.isSelectBarShown ? 'row__btn_disabled' : '')} onClick={handlePreDelete}>
                    <img src={deleteIcon} />
                </div>
            </div>
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
                Доменное имя будет удалено навсегда
                <Form ref={deleteFor} method="post">
                    <input type="hidden" name={'_action'} value={'delete'}/>
                    <input type="hidden" name={'id'} value={domain.id}/>
                </Form>
            </Dialog>
        </div>
    );
};

export default observer(Client);