const fileRegex=/.(template)$/

//plugin for transform .template file to string which contain html, idk how it exactly work, it stoled from vite docs.
export default function templatePlugin(){
    return{
        name: 'template-loader-plugin',
        transform(src, id){
            if(fileRegex.test(id)){
                return{
                    code:`export default function template(props = {}){return \`${src}\`}`,
                    map:null
                }
            }
        }
    }

}
