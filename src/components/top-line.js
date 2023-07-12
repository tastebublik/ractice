import appConstants from "../common/constants.js";


class TopLine extends HTMLElement {
    constructor() {
        super()
        let shadow = this.attachShadow({mode: 'open'})
        let style = document.createElement('style')
        const wrapper = document.createElement('div')
        wrapper.className = 'wrapper'
        const img = document.createElement('img')
        img.src=appConstants.images.phoneIcon
        this.searchType = appConstants.search.types.name

        style.textContent = `
        
        img{
            width:25px;
            height:25px
        }
        
        .wrapper {
               display: flex;
               align-items: center;
               padding: 5px;
               background-color:darkseagreen;
           }

           .global-search {
               font-size: 16px;
               border: 1px solid #ccc;
               border-radius: 8px;
               padding: 5px 20px;
               width: 100%;
               margin: 0 10px;
           }

           .global-search:placeholder{
               color: #aaa;
           }                   
        `

        shadow.appendChild(style)
        shadow.appendChild(wrapper)
        wrapper.appendChild(img)
        if (window.location.pathname == appConstants.routes.index) {

            const search = document.createElement('input')
            search.setAttribute('class', 'global-search')
            search.addEventListener('keyup', (e) => {
                e.stopPropagation()
                if (e.key === 'Enter') {
                    e.preventDefault()
                    const text = e.target.value
                    console.log('search', text)
                }
            })

            wrapper.appendChild(search)
        } else if (window.location.pathname == appConstants.routes.create) {
            this.innerHtml = 'createpage'
        }


    }

    updateSearch() {
        const shadow = this.shadowRoot
        const input = shadow.querySelector('input')
        const search = this.getAttribute('search')
        input.value = search
        if (this.searchType === appConstants.search.types.post) {
            input.setAttribute('placeholder', 'Search post...')
        } else if (this.searchType === appConstants.search.types.user) {
            input.setAttribute('placeholder', 'Search user...')
        }

    }


    connectedCallback() {
        if (window.location.pathname == appConstants.routes.index) {
            const shadow = this.shadowRoot;
            const searchText = this.getAttribute('search')
            this.searchType = this.getAttribute('type') ? this.getAttribute('type') : appConstants.search.types.post

            if (searchText) {
                const input = shadow.querySelector('input')
                input.value = searchText
            }

            const {pathname: path} = new URL(window.location.href)
            const link = this.links.find((l) => l.href === path)

            if (link) {
                const linkElement = shadow.querySelector(`.${link.class}`)
                linkElement.setAttribute('selected', 'true')
            }
        } else if (window.location.pathname == appConstants.routes.create) {
            this.innerHtml = 'createpage'
        }
    }

    static get observedAttributes() {
        return ['search']
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'search') {
            this.updateSearch()
        }
        if (name === 'type') {
            this.searchType = newValue
            this.updateSearch()
        }
    }

}

customElements.define('top-line', TopLine);

