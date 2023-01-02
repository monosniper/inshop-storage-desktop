import React, {useEffect, useRef, useState} from 'react';

import deleteIcon from '~/assets/icons/black_delete.svg'
import closeIcon from '~/assets/icons/close.svg'
import {observer} from "mobx-react";
import {store} from "~/lib/mobx";
import {Form, useActionData, useLocation, useSubmit} from "@remix-run/react";
import {Dialog} from "evergreen-ui";

const SelectBar = () => {
    const deleteForm = useRef()
    const submit = useSubmit()
    const actionData = useActionData()
    const location = useLocation()
    const page_with_select = [
        '/storage',
        '/storage/categories'
    ]
    const [isSureDeleteShown, setIsSureDeleteShown] = useState(false)

    const handleClose = () => {
        store.clearSelectedItems()
        store.setIsSelectBarShown(false)
    }

    const handleDelete = () => {
        store.setIsSelectBarShown(false)
        submit(deleteForm.current, { replace: true });
    }

    useEffect(() => {
        if(actionData && actionData.data && actionData.data.deleteItems) {
            setIsSureDeleteShown(false)
        }
    }, [actionData])

    useEffect(() => {
        if(page_with_select.includes(location.pathname)) {
            store.setIsSelectBarShown(!!store.selectedItems.length)
        } else {
            store.setIsSelectBarShown(false)
        }
    }, [store.selectedItems.length, location])

    useEffect(() => {
        page_with_select.includes(location.pathname) && store.setIsSelectBarShown(!!store.selectedItems.length)
    }, [])

    return (
        <div className={'select-bar ' + (store.isSelectBarShown ? '' : 'select-bar_hidden')}>
            <Dialog
                isShown={isSureDeleteShown}
                title="Вы уверены?"
                intent="danger"
                onCloseComplete={() => setIsSureDeleteShown(false)}
                confirmLabel="Да"
                cancelLabel="Отмена"
                onConfirm={handleDelete}
            >
                {store.selectedItems.length} элементов будут удалены безвозвратно
                <Form ref={deleteForm} method="post">
                    <input type="hidden" name={'_action'} value={'deleteMany'}/>
                    {[...store.selectedItems].map(id => <input key={'Item-ids-'+id} type="hidden" name={'Item_ids'} value={id} />)}
                </Form>
            </Dialog>

            <div className="container select-bar__wrapper">
                <div className="select-bar__col">
                    {store.selectedItems.length} элемента(ов) выбрано
                </div>
                <div className="select-bar__col">
                    <button onClick={() => setIsSureDeleteShown(true)} className="select-bar__btn select-bar__btn_min">
                        <img src={deleteIcon} />
                    </button>
                    <button onClick={handleClose} className="select-bar__btn">
                        <img src={closeIcon} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default observer(SelectBar);