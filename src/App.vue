<template>
  <div id="app">
    <div class="zoo-header">
      <div class="zoo-header-content">
        <a href="https://github.com/zoo-js" target="_blank">
          <img src="https://avatars1.githubusercontent.com/u/70757173?s=60&v=4" />
        </a>
        <a href="https://github.com/zoo-js/zoo-issue-helper" target="_blank">
          <h1>Zoo issue helper </h1>
        </a>
        <div v-if="chose.length > 0" class="chose-pets">
          <div
            v-for="it in chose"
            :key="it.name"
          >
            <img :src="`https://avatars0.githubusercontent.com/u/${it.code}?s=100&v=4`" width="40" />
          </div>
        </div>
        <div class="zoo-header-form">
          <q-input
            color="secondary"
            v-model="gitEmail"
            label="GitHub Email222222 *"
            lazy-rules
            ref="input"
            style="width: 200px;"
            :rules="[ val => val && val.length > 0 || 'Please type your GitHub Email!']"
          />
          <q-btn style="height: 36px; width: 100px; margin-top: 18px; margin-left: 30px;" push color="secondary" no-caps @click="doSub" >Submit</q-btn>
        </div>
        <div class="zoo-header-tip">
          Below 1024px preview only !
        </div>
        <a href="https://zoo-js.github.io/zoo-charts/" target="_blank" class="goto">
          View charts!
        </a>
      </div>
    </div>

    <div class="zoo-main">
      <div class="zoo-main-content">
        <q-intersection
          class="zoo-main-card"
          v-for="pet in pets"
          :key="pet.name"
          transition="scale"
          @click="chosePet(pet)"
          :class="choseName.includes(pet.name) ? 'zoo-main-card-chose' : ''">
          <div class="card-img">
            <img :src="`https://avatars0.githubusercontent.com/u/${pet.code}?s=100&v=4`" />
          </div>
          <div class="card-text">
            {{ pet.name }}
          </div>
        </q-intersection>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  created () {
    this.$q.loadingBar.setDefaults({
      color: 'secondary',
    });
    this.loadData();
  },
  data() {
    return {
      pets: [],
      chose: [],
      choseName: [],
      limitNo: 5,
      gitEmail: '',
    }
  },

  methods: {
    loadData() {
      this.$http.get('organizations.json').then( res => {
        this.pets = res.data.data.sort((a, b) => a.name.localeCompare(b.name))
      },rej => {
        console.log(rej)
      })
    },

    chosePet(pet) {
      const ww = document.body.offsetWidth
      if ( ww < 1024 ) return false
      const i = this.choseName.indexOf(pet.name)
      if (i !== -1) {
        this.chose.splice(i,1);
        this.choseName.splice(i,1);
        return false
      }
      if (this.chose.length === this.limitNo) {
        this.chose.pop()
        this.choseName.pop()
      }
      this.chose.push(pet)
      this.choseName.push(pet.name)
    },

    doSub() {
      const { gitEmail, choseName } = this
      if (choseName.length == 0) {
        this.$q.notify({
          message: 'Please chose cute pets!',
          timeout: 2000,
          color: 'pink'
        })
      }
      this.$refs.input.validate()
      if (gitEmail.length > 0 && choseName.length > 0) {
        const title = encodeURIComponent(`[New] 申请`)
        const body = encodeURIComponent(
          `<!-- ❤️ 哇，终于等到你了。 -->
<!-- ❤️ Wow, finally waiting for you。 -->

### 😀 申请人 Applicant

GitHub Email: ${gitEmail}

<!-- 请在上方输入你的 GitHub 邮箱 -->
<!-- Please enter your GitHub Email above -->

### 🌏 领养宠物 Adopt pets

${choseName.map( (name,index) => {
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
    }
  },
}
</script>

<style lang="scss">
.q-field__append {
  display: none !important;
}
.q-field__bottom {
  padding-top: 2px !important;
}
</style>
