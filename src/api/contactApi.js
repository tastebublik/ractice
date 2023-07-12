
import service from './contactApi.js'

export const getContacts = (page) => {
    return service.get(`/contacts?_page=${page}&limit=10`)
}

export const getContactsBySearch = (search, page) => {
    return service.get(`/contacts?q=${search}&_page=${page}&limit=10`)
}

export  {
    getContacts,
    getContactsBySearch,
}