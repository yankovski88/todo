'use strict';

export class Storage {
    constructor(key) {
        this.key = key;
    }

    get() {
        return JSON.parse(window.localStorage.getItem(this.key)) ?? [];
    }

    set(value) {
        window.localStorage.setItem(this.key, JSON.stringify(value));
    }
}


