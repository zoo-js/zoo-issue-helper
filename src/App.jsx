import { defineComponent, onMounted, reactive } from 'vue'
import './style.scss'

import HTTP from './http.js'

// directives
const loadDirective = {
    mounted(el, ctx) {
        el.style.transition = 'all .5s'
        el.style.transform = 'scale(0)'
        el.style.opacity = '0.4'
        el.src="loading.gif"
        let lazyLoadList = []
        let io = new IntersectionObserver(([ entry ])=>{
            if( entry.isIntersecting ) {
                if (lazyLoadList.includes(ctx.value)) {
                    el.src = ctx.value
                } else {
                    let image = new Image()
                    image.src = ctx.value
                    image.onload = function(){
                        el.src = ctx.value;
                        lazyLoadList.push(ctx.value)
                    }
                }
                el.style.transform = 'scale(1)'
                el.style.opacity = '1'
            } else {
                el.style.transform = 'scale(0)'
                el.style.opacity = '0.4'
            }
        }, {
            threshold: 0,
            root: null,
            rootMargin: '0px'
        })

        io.observe(el)
    }
}

export default defineComponent({

    directives: {
        lazyLoad: loadDirective,
    },

    setup() {

        let timer

        const state = reactive({
            petList: [],
            pickTarget: {},
            limitNo: 5,
            gitEmail: '',
            iFocus: false,
            errorMsg: 'Please pick your pet~',
            errShow: false,
        })

        const getPets = () => {
            HTTP.get('organizations.json').then( res => {
                state.petList = res.data.data.sort((a, b) => a.name.localeCompare(b.name))
            },rej => {
                console.log(rej)
            })
        }

        const pickPets = (pet) => {
            const ww = document.body.offsetWidth
            if ( ww < 1024 ) return false
            const pickPet = state.pickTarget[pet.name]
            if (pickPet) {
              delete state.pickTarget[pet.name]
              return false
            }
            const keys = Object.keys(state.pickTarget)
            if (keys.length >= state.limitNo) {
              delete state.pickTarget[keys[0]]
            }
            state.pickTarget[pet.name] = pet
        }

        const submit = () => {
            clearTimeout(timer)
            if(!Object.keys(state.pickTarget).length) {
                state.errorMsg = 'Please pick your pets ~'
                state.errShow = true
                timer = setTimeout(()=>{
                    state.errShow = false
                }, 2000)
                return false
            }
            if(!state.gitEmail) {
                state.errorMsg = 'Please enter your email address !'
                state.errShow = true
                timer = setTimeout(()=>{
                    state.errShow = false
                }, 2000)
                return false
            }
            const rePass = new RegExp('^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$', '');
            const isPass = rePass.test(state.gitEmail);
            if (isPass == false) {
                state.errorMsg = 'Please make sure to enter a valid email address !'
                state.errShow = true
                timer = setTimeout(()=>{
                    state.errShow = false
                }, 2000)
                return false
            }
            const title = encodeURIComponent(`[New] 申请`)
            const body = encodeURIComponent(
`<!-- ❤️ 哇，终于等到你了。 -->
<!-- ❤️ Wow, finally waiting for you。 -->

### 😀 申请人 Applicant

GitHub Email: ${state.gitEmail}

<!-- 请在上方输入你的 GitHub 邮箱 -->
<!-- Please enter your GitHub Email above -->

### 🌏 领养宠物 Adopt pets

${Object.keys(state.pickTarget).map((name,index) => {
    return index+1 + '. ' +name +'\n'
}).join('')}

<!-- 请在上方填写你想要领养的小宠物，原则上仅支持单人领养 5 只小宠物，请大家谨慎挑选。超出 5 个，会取前 5 个哦。若您心仪的萌宠没列出，欢迎提出。 -->
<!-- Please fill in the small pets you want to adopt at the top. In principle, only 5 small pets can be adopted by one person. Please choose carefully. If there are more than 5, the first 5 will be taken. If your favorite pet is not listed, please suggest. -->

### 🌈 Tip

- After completing the adoption, it is recommended to close the issue yourself. 完成领养后，建议自行关闭 issue。
- [How to show? 如何展示？](https://github.com/zoo-js/welcome/blob/main/how-to-show.md)
- [What we can? 我可以做什么？](https://github.com/zoo-js/welcome/blob/main/what-we-can.md)

<!-- New application. DO NOT REMOVE! -->
`
            )

            window.location.replace(
              `https://github.com/zoo-js/zoo/issues/new?title=${title}&body=${body}`
            );
        }

        const renderHeader = () => {
            return <div class="zoo-header">
                <div class="zoo-header-content">
                    <a href="https://github.com/zoo-js" target="_blank">
                        <img src={`https://avatars1.githubusercontent.com/u/70757173?s=60&v=4`} />
                    </a>
                    <a href="https://github.com/zoo-js/zoo-issue-helper" target="_blank">
                        <h1>Zoo issue helper2222</h1>
                    </a>
                    <div class="chose-pets">
                        {
                            Object.values(state.pickTarget).map( item => {
                                return <div>
                                    <img src={`https://avatars0.githubusercontent.com/u/${item.code}?s=100&v=4`} onClick={ () => { pickPets(state.pickTarget[item.name]) } } width="40" />
                                </div>
                            })
                        }
                    </div>
                    <div class="zoo-header-form">
                        <div class="zoo-header-item">
                            <label class={state.iFocus||state.gitEmail?'label-title':''} onClick={ () => { document.getElementById('searchInput').focus() } } >Enter your GitHub Email</label>
                            <input id="searchInput" type="text" v-model={state.gitEmail} onFocus={ () => { state.iFocus = true } } onBlur={ () => { state.iFocus = false } }/>
                        </div>
                        <button class="zoo-header-submit" onClick={ () => { submit() } }>Submit</button>
                    </div>
                    <a href="https://zoo-js.github.io/zoo-charts/" target="_blank" class="goto">
                        View charts !
                    </a>
                    <p class="below-msg">Below 1024px preview only !</p>
                </div>
            </div>
        }

        const renderMain = () => {
            return <div class="zoo-main">
                <div class="zoo-main-content">{
                state.petList.map( item => {
                    return renderPet(item)
                })
            }</div>
            </div>
        }

        const renderPet = (pet) => {
            return <div onClick={ () => { pickPets(pet) } } class={ state.pickTarget[pet.name] ? 'zoo-main-card zoo-main-card-chose' : 'zoo-main-card'}>
                <div class="card-img">
                    <img vLazyLoad={`https://avatars0.githubusercontent.com/u/${pet.code}?s=100&v=4`}/>
                </div>
                <div class="card-text">
                    { pet.name }
                </div>
            </div>
        }

        const renderError = () => {
            return <div class={state.errShow ? 'error-msg error-msg-show' : 'error-msg'}>
                <span>{state.errorMsg}</span>
            </div>
        }

        onMounted( () => {
            getPets()
        })

        return () => <>
            { renderHeader() }
            { renderMain() }
            { renderError() }
        </>
    }
})
