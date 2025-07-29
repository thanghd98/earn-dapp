import { Environment } from "../types";

export const isBrowser = () => {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}

export const isNode = () => {
    return typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
}

export const isReactNative = () => {
    return typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
}

export const isWebWorker = () => {
    //@ts-expect-error webworker type limited;
    return typeof self !== 'undefined' && typeof self.importScripts === 'function';
}

export const getEnvironment = (): Environment => {
    if (isBrowser()) {
        return Environment.Browser;
    } else if (isNode()) {
        return Environment.Node;
    } else if (isReactNative()) {
        return Environment.ReactNative;
    } else if (isWebWorker()) {
        return Environment.WebWorker;
    } else {
        throw new Error('Unknown environment');
    }
}