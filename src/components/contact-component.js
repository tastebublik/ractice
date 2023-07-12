import appConstants from '../common/constants'
import { goTo, routes } from '../router'
import { highlightText } from '../common/utils'
import { getContact, setContact } from '../service/contacts'
import { getContactById } from '../api/contactsApi'

class ContactComponent extends HTMLElement {
    constructor(){
        super()
        const shadow = this.attachShadow({mode: 'open'})
        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'contact-holder')
        const block = document.createElement('div')
        block.setAttribute('class', 'contact-block')
        wrapper.appendChild(block)

        const title = document.createElement('h2')
        title.setAttribute('class', 'contact-title-main')

        shadow.appendChild(title)

        block.innerHTML = `
            <div class="avatar-holder">
                <contact-avatar></contact-avatar>
                <div class="contact-title"></div>
            </div>
            <div class="contact-text"></div>
            <div class="add-buttons">
            </div>
        `

        const style = document.createElement('style')

        shadow.appendChild(style)
        shadow.appendChild(wrapper)
    }

    connectedCallback(){
        const shadow = this.shadowRoot
        const id = this.getAttribute('id')
        const single = this.getAttribute('single')
        const contact = getContact(id)
        const contactAvatar = shadow.querySelector('contact-avatar')

        if(single){
            const title = shadow.querySelector('.contact-title-main')
            title.textContent = 'Contact info'
        } else {
            contactAvatar.setAttribute('small', 'true')
        }
        this.updateStyle()

        if(contact){
            this.updateContact()
        } else {
            getContactById(id).then((contact)=> {
                setContact(contact)
                this.updateContact()
            })
                .catch(e => console.log(e))
        }

        const contactText = shadow.querySelector('.contact-text')
        const contactBlock = shadow.querySelector('.contact-holder')

        contactBlock.addEventListener('click', (e) => {
            e.stopPropagation()
            //goto contact page
            const url = routes.Contact.reverse({contact: id})
            goTo(url)
        })





    }

    updateContact() {
        const shadow = this.shadowRoot
        const id = this.getAttribute('id')
        const single = this.getAttribute('single')
        const search = this.getAttribute('search')
        const title = shadow.querySelector('.contact-title')
        const text = shadow.querySelector('.contact-text')

        const contact = getContact(id)

        if(search){
            title.innerHTML = highlightText(contact.contact_fullname, search)
            text.innerHTML = highlightText(contact.contact_name, search)
        } else {
            title.textContent = contact.contact_fullname
            text.textContent = contact.contact_name
        }

        const contactAvatar = shadow.querySelector('contact-avatar')
        contactAvatar.setAttribute('contact-name', contact.contact_name)
    }

    updateStyle(){
        const shadow = this.shadowRoot
        const single = this.getAttribute('single')
        const style = shadow.querySelector('style')

        const customStyle = single ? `
           background-color: #fff;
           border: 1px solid #ccc;
        ` : `
           background-color: #ccc;
        `

        const customButtonStyle = single ? `
           background-color: #fff;
           border: 1px solid #ccc;
        ` : `
           background-color: #ccc;
        `

        style.textContent = `
           .contact-holder{
               display: flex;
               justify-content: center;
           }

           .avatar-holder{
               display: flex;
           }
           
           .contact-title-main{
               text-align: center;
           }
           
           
           .contact-block{
            max-width: 200px;
            border-radius: 10px;
            ${customStyle}
            margin: 10px;
            padding: 10px;
        }

        .contact-block .contact-title{
            padding: 10px;
            font-weight: bold; 
        }

        .contact-block .contact-text{
            padding: 10px;
            font-family: fantasy;
            max-height: 200px;
            overflow: hidden;
            cursor: pointer;
        }
        
        .contact-block .contact-buttons{
            padding: 10px;
            font-family: arial;
            display: flex;
            justify-content: space-around;
            min-width: 200px;
        } 
       
        .contact-block .contact-buttons .contact-btn{
            padding: 10px;
            ${customButtonStyle}
            color: #666;
            border-radius: 8px;
            cursor: pointer;
        }

        .contact-block .contact-buttons .contact-btn:hover{
            color: #333;
            background-color: #eee;
        }

        .highlight{
            background-color: yellow;
        }
        `
    }

}