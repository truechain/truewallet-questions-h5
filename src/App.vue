<template>
  <div id="app">
    <div v-if="state === 2" class="aq-succeed">
      <div class="aq-intro">
        <img src="@/assets/succeed.svg" alt="fail" width="100">
        <p>{{ $t('succeed') }}</p>
      </div>
      <div class="ap-commit ap-commit-active" @click="exit">
        <span>{{ $t('towallet') }}</span>
      </div>
    </div>
    <div v-else>
      <div v-if="state === 1" class="aq-intro">
        <img src="@/assets/fail.svg" alt="fail" width="40">
        <p class="fail">{{ $t('fail') }}</p>
      </div>
      <div v-else class="aq-intro">
        <img src="@/assets/evaluation.svg" alt="evaluation" width="40">
        <p>{{ $t('intro') }}</p>
      </div>
      <div class="ap-form">
        <p class="title">{{ $t('formtitle') }}</p>
        <ul>
          <Question v-for="(i, index) in order" :key="i"
            :showAnswer="showAnswer" :index="i"
            @select="onSelect">{{ index + 1 }}</Question>
        </ul>
      </div>
      <div class="ap-commit" :class="{ 'ap-commit-active': selectedCount === qusCount }"
        @click="submit">
        <span v-if="state === 1">{{ $t('restart') }}</span>
        <span v-else-if="selectedCount === qusCount">{{ $t('submit') }}</span>
        <span v-else>{{ selectedCount }}/{{ qusCount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Question from '@/components/Question'

const v4 = window.webkit &&
  window.webkit.messageHandlers &&
  window.webkit.messageHandlers.changeOrientation &&
  window.webkit.messageHandlers.changeOrientation.postMessage

const v4Android = window.Android &&
    window.Android.changeOrientation

const postMessage = message => {
  if (v4) {
    window.webkit.messageHandlers.changeOrientation.postMessage(message)
  } else if(v4Android){
      window.Android.changeOrientation(message);
  } else {
    window.postMessage(message)
  }
}

export default {
  name: 'app',
  data () {
    const qusCount = this.$t('questions').length
    const order = []
    const answers = new Array(qusCount).fill(-1)
    for (let i = 0; i < qusCount; i++) {
      order[i] = i
    }
    return {
      state: 0,
      showAnswer: false,
      qusCount,
      selectedCount: 0,
      order: order.sort(() => (Math.random() - 0.5)),
      answers
    }
  },
  created () {
    if (process.env.NODE_ENV === 'development') {
      this.init({ data: 'onload' })
    } else {
      document.addEventListener('message', this.init)
      window.message = this.init
    }
  },
  methods: {
    init (e) {
      const data = e.data || e
      if (/onload/.test(data)) {
        const lang = data.match(/lang=(\w+)/)
        if (lang && lang[1]) {
          this.$i18n.locale = lang[1]
        } else {
          this.$i18n.locale = 'zh'
        }
        const payload = {
          timestamp: new Date().getTime(),
          method: 'set_title',
          data: {
            title: this.$t('title')
          }
        }
        postMessage(JSON.stringify(payload))
        document.title = this.$t('title')
        document.removeEventListener('message', this.init)
      }
    },
    onSelect (quesIndex, optionIndex) {
      if (this.answers[quesIndex] === -1) {
        this.selectedCount++
      }
      this.answers[quesIndex] = optionIndex
    },
    submit () {
      if (this.selectedCount !== this.qusCount) {
        return
      }
      if (this.state === 1) {
        this.showAnswer = false
        this.selectedCount = 0
        this.state = 0
        this.answers = new Array(this.qusCount).fill(-1)
        const oldOrder = this.order
        this.order = []
        this.$nextTick(() => {
          this.order = oldOrder.sort(() => (Math.random() - 0.5))
        })
        return
      }
      const result = this.answers.reduce((sum, answer) => sum && (answer === 0), true)
      if (result) {
        this.state = 2 // succeed
        if (process.env.NODE_ENV === 'production') {
          const payload = {
            timestamp: new Date().getTime(),
            method: 'custom_passexam'
          }
          postMessage(JSON.stringify(payload))
        }
      } else {
        window.scrollTo(0, 0)
        this.showAnswer = true
        this.state = 1 // fail
      }
    },
    exit () {
      if (process.env.NODE_ENV === 'development') {
        console.log('exit')
      } else {
        const payload = {
          timestamp: new Date().getTime(),
          method: 'close'
        }
        postMessage(JSON.stringify(payload))
      }
    }
  },
  components: {
    Question
  }
}
</script>

<style lang="stylus">
body, p, ul
  margin 0
ul
  padding 0
  list-style none
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  border-top solid 12px #F1F4FA
  font-size 16px
  color #203260

.fail
  color #F84646
.succeed
  color #00a857

.aq-succeed
  .aq-intro
    margin-top 110px
  .ap-commit
    position absolute
    bottom 0px
    width calc(100% - 30px)

.aq-intro
  text-align center
  padding 20px
  p
    line-height 24px
.ap-form
  margin 10px 15px
  background-color #F1F4FA
  min-height 200px
  border-radius 5px
  position relative
  .title
    position absolute
    top -10px
    left 50%
    transform translateX(-50%)
    background-color #D9E4F5
    line-height 24px
    padding 5px 0
    width 150px
    text-align center
    position relative
    &:before
      content ''
      width 20px
      height 100%
      background-color #D9E4F5
      position absolute
      left -10px
      top 0
      border-radius 5px
      transform skewX(18deg)
    &:after
      content ''
      width 20px
      height 100%
      background-color #D9E4F5
      position absolute
      right -10px
      top 0
      border-radius 5px
      transform skewX(-18deg)
.ap-commit
  margin 20px 15px 60px
  background-color #D9E4F5
  height 50px
  border-radius 25px
  display flex
  color #fff
  justify-content center
  align-items center
.ap-commit-active
  background-color #0071BC
  cursor pointer
</style>
