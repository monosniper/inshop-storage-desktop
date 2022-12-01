import {makeAutoObservable} from "mobx";

class Store {
    selectedPositions = new Set()
    isSelectBarShown = false

    constructor() {
        makeAutoObservable(this)
    }

    setIsSelectBarShown(bool) {
        this.isSelectBarShown = bool
    }

    selectPosition(id) {
        this.selectedPositions.add(id)
    }

    unselectPosition(id) {
        this.selectedPositions.delete(id)
    }

    clearSelectedPositions() {
        this.selectedPositions.clear()
    }
}

export const store = new Store()