<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"

const isVisible = ref(false)
const windowHeight = ref(0);

const checkScroll = () => {
  isVisible.value = window.scrollY > windowHeight.value
}

const onResize = () => {
  windowHeight.value = window.innerHeight
  checkScroll()
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  windowHeight.value = window.innerHeight;
  window.addEventListener("scroll", checkScroll)
  window.addEventListener("resize", onResize)
  checkScroll()
})

onUnmounted(() => {
  window.removeEventListener("scroll", checkScroll)
  window.removeEventListener("resize", onResize)
})
</script>

<template>
  <button
      v-if="isVisible"
      class="scroll-up"
      type="button"
      @click="scrollToTop"
  >
    <img src="@icons/up.svg" alt="Наверх">
  </button>
</template>

<style scoped lang="sass">
@use '@styles/mixins.sass' as *
.scroll-up
  position: fixed
  outline: none
  right: 32px
  bottom: 32px
  cursor: pointer
  @include flex-center
  @include btn-circle(var(--main-light), 40px, black)

</style>
