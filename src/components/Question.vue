<template>
  <li class="ques-list">
    <p class="ques-title" :class="{
      'succeed': right,
      'fail': error
    }">
      <slot></slot>. {{ $t(`questions[${index}].title`) }}
    </p>
    <ul class="ques-options">
      <li v-for="(i, ii) in order" :key="i">
        <span @click="select(i)" class="ques-radio" :class="{
          'tick selected': i === selected && !showAnswer,
          'hide': showAnswer,
          'tick right': i === 0 && showAnswer,
          'error': i === selected && error
        }"/>
        <span @click="select(i)" >
          {{ title[ii] }}
          {{ $t(`questions[${index}].options[${i}]`) }}
        </span>
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'Question',
  props: {
    index: Number,
    showAnswer: Boolean
  },
  data () {
    return {
      selected: -1,
      order: [0, 1, 2, 3].sort(() => (Math.random() - 0.5)),
      title: [
        'A. ',
        'B. ',
        'C. ',
        'D. '
      ]
    }
  },
  computed: {
    right () {
      return this.showAnswer && this.selected === 0
    },
    error () {
      return this.showAnswer && this.selected !== 0
    }
  },
  methods: {
    select (i) {
      if (this.showAnswer) {
        return
      }
      this.$emit('select', this.index, i)
      this.selected = i
    }
  }
}
</script>

<style lang="stylus">
.ques-list
  padding 10px 15px
.ques-options
  color #7F838D
  font-size 14px
  line-height 16px
  li
    margin 10px 0
    display flex
    align-items flex-start
  .ques-radio
    flex 0 0 16px
    margin-right 10px
    width 16px
    height 16px
    box-sizing border-box
    border solid 1px #7F838D
    border-radius 8px
    position relative
    cursor pointer
  .tick
    &:before
      content ''
      position absolute
      width 8px
      height 1px
      top 9.3px
      left 6.4px
      background-color #fff
      transform rotate(-45deg)
      transform-origin 0 100%
    &:after
      content ''
      position absolute
      width 5px
      height 1px
      top 9.3px
      left 6.4px
      background-color #fff
      transform rotate(-135deg)
      transform-origin 0 100%
  .selected
    border-color #0071BC
    background-color #0071BC
  .hide
    visibility hidden
  .right
    border-color #09C46A
    background-color #09C46A
    visibility visible
  .error
    border-color #F84646
    background-color #F84646
    visibility visible
    &:before
      content ''
      position absolute
      width 10px
      height 1px
      top 50%
      left 50%
      background-color #fff
      transform translate3d(-50%, -50%, 0) rotate(-45deg)
      transform-origin 50% 50%
    &:after
      content ''
      position absolute
      width 10px
      height 1px
      top 50%
      left 50%
      background-color #fff
      transform translate3d(-50%, -50%, 0) rotate(-135deg)
      transform-origin 50% 50%
</style>
