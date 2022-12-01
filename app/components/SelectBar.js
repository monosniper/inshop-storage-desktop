import React, {useEffect, useRef, useState} from 'react';

import deleteIcon from '~/assets/icons/black_delete.svg'
import closeIcon from '~/assets/icons/close.svg'
import {observer} from "mobx-react";
import {store} from "~/lib/mobx";
import {Form, useActionData, useSubmit} from "@remix-run/react";
import {Dialog} from "evergreen-ui";

const SelectBar = () => {
    const deleteForm = useRef()
    const submit = useSubmit()
    const actionData = useActionData()
    const [isSureDeleteShown, setIsSureDeleteShown] = useState(false)

    const handleClose = () => {
        store.clearSelectedPositions()
        store.setIsSelectBarShown(false)
    }

    const handleDelete = () => {
        store.setIsSelectBarShown(false)
        submit(deleteForm.current, { replace: true });
    }

    useEffect(() => {
        if(actionData && actionData.data && actionData.data.deletePositions) {
            setIsSureDeleteShown(false)
        }
    }, [actionData])

    useEffect(() => {
        store.selectedPositions.size && store.setIsSelectBarShown(true)
    }, [store.selectedPositions.size])

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
                {store.selectedPositions.size} позиции будет удалены безвозвратно
                <Form ref={deleteForm} method="post">
                    <input type="hidden" name={'_action'} value={'deleteMany'}/>
                    {[...store.selectedPositions].map(id => <input key={'position-ids-'+id} type="hidden" name={'position_ids'} value={id} />)}
                </Form>
            </Dialog>

            <div className="container select-bar__wrapper">
                <div className="select-bar__col">
                    {store.selectedPositions.size} элемента(ов) выбрано
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