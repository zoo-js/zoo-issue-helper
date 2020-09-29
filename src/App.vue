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
            <img :src="`https://avatars0.githubusercontent.com/u/${it.src}?s=100&v=4`" width="40" />
          </div>
        </div>
        <div class="zoo-header-form">
          <q-input
            color="secondary"
            v-model="gitname"
            label="GitHub name *"
            lazy-rules
            ref="input"
            style="width: 200px;"
            :rules="[ val => val && val.length > 0 || 'Please type your GitHub name!']"
          />
          <q-btn style="height: 36px; width: 100px; margin-top: 18px; margin-left: 30px;" push color="secondary" no-caps @click="doSub" >Submit</q-btn>
        </div>
        <div class="zoo-header-tip">
          Below 1024px preview only !
        </div>
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
            <img :src="`https://avatars0.githubusercontent.com/u/${pet.src}?s=100&v=4`" />
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
  },
  data() {
    return {
      pets: window.ZOO_HELPER_CONFIG['PETS'],
      chose: [],
      choseName: [],

      gitname: '',
    }
  },

  methods: {
    chosePet(pet) {
      const ww = document.body.offsetWidth
      if ( ww < 1024 ) { return false }
      const i = this.choseName.indexOf(pet.name)
      if (i != -1) {
        this.chose.splice(i,1);
        this.choseName.splice(i,1);
        return false
      }
      if (this.chose.length === 3) {
        this.chose.pop()
        this.choseName.pop()
      }
      this.chose.push(pet)
      this.choseName.push(pet.name)
    },

    doSub() {
      const { gitname, choseName } = this
      if (choseName.length == 0) {
        this.$q.notify({
          message: 'Please chose cute pets!',
          timeout: 2000,
          color: 'pink'
        })
      }
      this.$refs.input.validate()
      if (gitname.length > 0 && choseName.length > 0) {
        const title = encodeURIComponent(`[New] 申请`)
        const body = encodeURIComponent(
          `<!-- ❤️ 哇，终于等到你了。 -->
<!-- ❤️ Wow, finally waiting for you。 -->

### 😀 申请人 Applicant

- GitHub: ${gitname}

<!-- 请在上方输入你的 GitHub 用户名 -->
<!-- Please enter your GitHub username above -->

### 🌏 领养宠物 Adopt pets

1. ${choseName[0]}
2. ${choseName[1] || ''}
3. ${choseName[2] || ''}

<!-- 请在上方填写你想要领养的小宠物，原则上仅支持单人领养3只小宠物，请大家谨慎挑选。超出3个，会取前3个哦。若您心仪的萌宠没列出，欢迎提出。 -->
<!-- Please fill in the small pets you want to adopt at the top. In principle, only 3 small pets can be adopted by one person. Please choose carefully. If there are more than 3, the first 3 will be taken. If your favorite pet is not listed, please suggest. -->

### 🌈 Tip

- 完成领养后，建议自行关闭 issue。
- [如何展示？](https://github.com/zoo-js/welcome/blob/master/how-to-show.md)
- [我可以做什么？](https://github.com/zoo-js/welcome/blob/master/what-we-can.md)
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
