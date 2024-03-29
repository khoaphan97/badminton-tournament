import { contextBridge, ipcRenderer } from "electron";
import { IPCMainEvents, IPCResponse, TableNames, WINDOW_NAME } from "@utils/types";
import { readJSON, writeJSON } from "@utils/helpers";



export const controller = {
    openWindow(windowName: WINDOW_NAME) {
        ipcRenderer.send("openWindow", windowName);
    },

    closeWindow(windowName: WINDOW_NAME) {
        ipcRenderer.send("closeWindow", windowName);
    },

    previewPrint(url: string) {
        ipcRenderer.send("previewComponent", url);
    }
}

export const api = {
    fetch<T>(table: TableNames, id: string = ''): Promise<T> {
        const eventName = `fetch:${table}`;
        ipcRenderer.send(eventName, id);
        return new Promise((resolve, reject) => {
            ipcRenderer.on(`${eventName}/response`, (event, response: IPCResponse<T>) => {
                if (response.status === 'error') {
                    reject();
                } else {
                    resolve(response.data);
                }
            })
        })
    },
    fetchConsecutive<T>(table: TableNames, id: string = ''): Promise<T> {
        const eventName = `fetch:${table}`;
        ipcRenderer.send(eventName, id);
        return new Promise((resolve, reject) => {
            ipcRenderer.on(`${eventName}/response`, (event, response: IPCResponse<T>) => {
                if (response.status === 'error') {
                    reject();
                } else {
                    resolve(response.data);
                }
            })
        })
    },
    save<T>(table: TableNames, data: T): Promise<T> {
        const eventName = `save:${table}`;
        ipcRenderer.send(eventName, data);
        return new Promise((resolve, reject) => {
            ipcRenderer.on(`${eventName}/response`, (event, response: IPCResponse<T>) => {
                if (response.status === 'error') {
                    reject();
                } else {
                    resolve(response.data);
                }
            })
        });
    },
    create(table: TableNames, data: any): Promise<any> {
        const eventName = `create:${table}`;
        ipcRenderer.send(eventName, data);
        return new Promise((resolve, reject) => {
            ipcRenderer.on(`${eventName}/response`, (event, response: IPCResponse<any>) => {
                if (response.status === 'error') {
                    reject();
                } else {
                    resolve(response.data);
                }
            })
        });
    },
    remove<T>(table: TableNames, id: string): Promise<T> {
        const eventName = `delete:${table}`;
        ipcRenderer.send(eventName, id);
        return new Promise((resolve, reject) => {
            ipcRenderer.on(`${eventName}/response`, (event, response: IPCResponse<T>) => {
                if (response.status === 'error') {
                    reject();
                } else {
                    resolve(response.data);
                }
            })
        });
    },
    fetchBatch<T>(table: TableNames, listId: string[]): Promise<T[]> {
        const eventName = `fetchBatch:${table}`;
        ipcRenderer.send(eventName, listId);
        return new Promise((resolve, reject) => {
            ipcRenderer.on(`${eventName}/response`, (event, response: IPCResponse<T[]>) => {
                if (response.status === 'error') {
                    reject();
                } else {
                    resolve(response.data);
                }
            })
        });
    },
    saveBatch<T>(table: TableNames, data: T[]): Promise<T[]> {
        const eventName = `saveBatch:${table}`;
        ipcRenderer.send(eventName, data);
        return new Promise((resolve, reject) => {
            ipcRenderer.on(`${eventName}/response`, (event, response: IPCResponse<T[]>) => {
                if (response.status === 'error') {
                    reject();
                } else {
                    resolve(response.data);
                }
            })
        });
    },
}

contextBridge.exposeInMainWorld('Controller', controller);
contextBridge.exposeInMainWorld('Api', api);

