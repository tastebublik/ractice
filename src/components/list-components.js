


import appConstants from '../common/constants'


import { getContacts, getContactsBySearch } from '../api/contactApi.js'


class ListComponent extends HTMLElement {
    constructor() {
        super()
        this.search = '';
        this.page = 1;
        this.lastPage = false;
        this.typeList = appConstants.lists.types.post;

        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'list-block')

        const title = document.createElement('h2')
        title.setAttribute('class', 'list-title')
        shadow.appendChild(title)

        //pagination
        const pagination = document.createElement('pagination-component')
        pagination.setAttribute('class', 'list-pagination')
        pagination.setAttribute('page', this.page)
        pagination.setAttribute('last', this.lastPage)

        pagination.addEventListener('paginate-back', (e) => {
            e.stopPropagation()
            if (this.page > 1) {
                this.page = this.page - 1

                if (this.typeList === appConstants.lists.types.user) {
                    this.getContactPage()
                }

            }
        })

        pagination.addEventListener('paginate-next', (e) => {
            e.stopPropagation()
            if (!this.lastPage) {
                this.page = this.page + 1

                if (this.typeList === appConstants.lists.types.user) {
                    this.getContactPage()
                }


            }
        })
        shadow.appendChild(pagination)

        const style = document.createElement('style')

        style.textContent = `
           
           .list-block{
               display: flex;
               align-items: flex-start;
               justify-content: center;
               flex-wrap: wrap;
               padding: 5px;
           }

           .list-title{
               text-align: center;
           }

           .list-pagination{
            display: flex;
            justify-content: center;
           }

        `

        shadow.appendChild(style)
        shadow.appendChild(wrapper)
    }

    connectedCallback() {
        this.updateComponent()
    }

    static get observedAttributes() {
        return ['search']
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.updateComponent()
    }

    updateComponent() {
        const shadow = this.shadowRoot
        const favorite = this.getAttribute('favorite')
        const search = this.getAttribute('search')
        const typeList = this.getAttribute('list-type')

        if (search) {
            this.search = search
        }

        if (typeList) {
            this.typeList = typeList
        }

        const title = shadow.querySelector('.list-title')

        if (this.typeList === appConstants.lists.types.user) {
            this.getContactPage()
        }


    }



    getContactPage() {
        const shadow = this.shadowRoot
        const userId = this.getAttribute('user')
        const wrapper = shadow.querySelector('.list-block')
        const pagination = shadow.querySelector('pagination-component')
        pagination.setAttribute('page', this.page)
        pagination.setAttribute('last', this.lastPage)

        const title = shadow.querySelector('.list-title')
        title.textContent = 'All users'

        const apiCall = this.search ? getContactsBySearch(this.search, this.page)
            : getContacts(this.page)

        apiCall.then(users => {
            this.lastPage = users.length < 10
            pagination.setAttribute('last', this.lastPage)
            wrapper.innerHTML = ''
            users.forEach(user => {

                const userElement = document.createElement('user-component')
                userElement.setAttribute('id', user.id)
                if (this.search) {
                    userElement.setAttribute('search', this.search)
                }
                wrapper.appendChild(userElement)
            });
        })
            .catch(error => console.log(error))

    }



}

customElements.define('list-component', ListComponent)