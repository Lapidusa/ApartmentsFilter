<script setup lang="ts">
import AsideFilters from "@components-layouts/AsideFilters.vue";
import MainBlock from "@components-layouts/MainBlock.vue";
import ScrollUp from "@components-buttons/ScrollUp.vue";
import {useApartmentsStore} from "@stores/apartment";

const store = useApartmentsStore();
import {onMounted} from "vue";

onMounted(async () => {
  await store.loadApartments()
})
</script>

<template>
  <div class="container">
    <MainBlock/>
    <AsideFilters/>
  </div>
  <ScrollUp />
</template>

<style lang="sass">
.container
  display: flex
  gap: 80px
  align-items: start
  justify-content: space-between
  @media (max-width: 1440px)
    justify-content: space-between
    gap: 40px
</style>