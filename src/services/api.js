import { matchPath } from 'react-router-dom';
import {axiosInstance as axios} from './axiosInstance'

const CREATE_NEW_USER = () => `api/public/user/sign-up`;
const AUTHENTICATE = () => `api/public/authenticate`;

const TEST_API = () => `api/public/test1`;

const FAVORITE_LIST = (userId) => `api/public/user/favorite-items/${userId}`;

const ALL_ITEMS = () => 'api/items/getAllItems';

const ADD_ITEMS_TO_FAVORITE_LIST = (userId, itemId) => `api/public/user/add-favorite/${userId}/${itemId}`;

const REMOVE_ITEM_FROM_FAVORITE_LIST = (userId, itemId) => `api/public/user/remove-favorite/${userId}/${itemId}`;

const ADD_ITEM_TO_ORDER = (userId, itemId) => `api/public/user/add-item-to-order/${userId}/${itemId}`;

const GET_CLOSE_ORDERS = (userId) => `api/public/user/getClosedOrdersByUserId/${userId}`;

const REMOVE_USER = (id) => `api/public/user/delete/${id}`;

const GET_TEMP_ORDER = (userId) => `api/public/user/getTempOrdersByUserId/${userId}`;

const PROCESS_PAYMENT = (userId, orderId) => `api/public/order/processPayment/${userId}/${orderId}`;

const REMOVE_ITEM_FROM_TEMP_ORDER = (orderId, itemId, userId) => `api/public/user/remove-item-from-order/${orderId}/${itemId}/${userId}`;

const SEARCH_BAR_RESULTS = () => `api/items/itemSearch`;






export const searchBarResults = (params) => {
    return axios.get(SEARCH_BAR_RESULTS(), {params: params});
}

export const createNewUser = (userBody) => {
    return axios.post(CREATE_NEW_USER(), userBody);
}

export const authenticate = (userBody) => {
    return axios.post(AUTHENTICATE(), userBody);
}

export const testAuthenticatedApi = (params) => {
    return axios.get(TEST_API(), {params: params});
}

export const favoriteList = (userId) => {
    return axios.get(FAVORITE_LIST(userId));
}


export const allItems = () => {
    return axios.get(ALL_ITEMS());
}

export const addItemToFavoriteList = (userId, itemId) => {
    return axios.post(ADD_ITEMS_TO_FAVORITE_LIST(userId, itemId));
}

export const removeItemFromFavoriteList = (userId, itemId) => {
    return axios.delete(REMOVE_ITEM_FROM_FAVORITE_LIST(userId, itemId));
}

export const addItemToOrder = (userId, itemId) => {
    return axios.post(ADD_ITEM_TO_ORDER(userId, itemId));
}

export const getCloseOrders = (userId) => {
    return axios.get(GET_CLOSE_ORDERS(userId));
}

export const getTempOrder = (userId) => {
    return axios.get(GET_TEMP_ORDER(userId)); 
}

export const processPayment = (userId, orderId) =>{
    return axios.post(PROCESS_PAYMENT(userId, orderId));
}

export const removeItemFromTempOrder = (orderId, itemId, userId) =>{
    return axios.delete(REMOVE_ITEM_FROM_TEMP_ORDER(orderId, itemId, userId));
}

export const removeUser = (id) => {
    return axios.delete(REMOVE_USER(id));
}