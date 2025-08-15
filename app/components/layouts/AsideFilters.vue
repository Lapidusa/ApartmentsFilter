<script setup lang="ts">
import DoubleRangeSlider from "@components-inputs/DoubleRangeSlider.vue";
import { useApartmentsStore } from "@stores/apartment";
import { computed, ref, watch, onMounted } from "vue";

const store = useApartmentsStore();
const isLoading = computed(() => store.isLoaded)

const activeType = computed({
  get: () => store.filters.rooms?.toString() ?? null,
  set: (val: string | null) => store.setFilter('rooms', val ? Number(val) : null)
});

const priceRange = computed({
  get: () => store.currentPriceRange,
  set: (val: [number, number]) => {
    store.currentPriceRange = val;
    store.setFilter('priceMin', val[0]);
    store.setFilter('priceMax', val[1]);
  }
});

const areaRange = computed({
  get: () => store.currentAreaRange,
  set: (val: [number, number]) => {
    store.currentAreaRange = val;
    store.setFilter('areaMin', val[0]);
    store.setFilter('areaMax', val[1]);
  }
});

const apartmentTypes = [
  { label: '1к', value: '1' },
  { label: '2к', value: '2' },
  { label: '3к', value: '3' },
  { label: '4к', value: '4' }
]

const availableTypes = computed(() => {
  const set = new Set(store.allApartments.map(a => a.rooms.toString()));
  return apartmentTypes.map(t => ({
    ...t,
    disabled: !set.has(t.value)
  }));
});

const resetFilters = () => {
  store.resetFilters();
}

</script>

<template>
  <aside class="aside" v-if="isLoading">
    <div class="aside__types">
      <label class="aside__type" v-for="type in availableTypes" :key="type.value">
        <input
            type="radio"
            name="apartmentType"
            class="aside__type-input"
            v-model="activeType"
            :value="type.value"
            :disabled="type.disabled"
        />
        <span class="aside__type-text">{{type.label}}</span>
      </label>
    </div>

    <div class="aside__slider">
      <label class="aside__label">Стоимость квартиры</label>
      <DoubleRangeSlider
          v-model="priceRange"
          :min="store.minPrice"
          :max="store.maxPrice"
          :step="100000"
          @change="store.setFilter('priceMin', $event[0]); store.setFilter('priceMax', $event[1])"
      />
    </div>

    <div class="aside__slider">
      <label class="aside__label">Площадь квартиры</label>
      <DoubleRangeSlider
          v-model="areaRange"
          :min="store.minArea"
          :max="store.maxArea"
          :step="1"
          @change="store.setFilter('areaMin', $event[0]); store.setFilter('areaMax', $event[1])"
      />
    </div>

    <button class="aside__reset" @click="resetFilters">
      Сбросить параметры
      <img src="@icons/cross-mini.svg" alt="Сбросить параметры">
    </button>
  </aside>
</template>

<style scoped lang="sass">
@use '@styles/variables.sass' as *

.aside
  background: var(--main-gradient)
  padding: 40px
  border-radius: $border-aside
  display: flex
  flex-direction: column
  gap: 24px
  align-items: start
  @media (max-width: 1439px)
    padding: 20px
  &__types
    display: flex
    gap: 8px

  &__type
    position: relative
    cursor: pointer
  &__slider
    width: 100%
  &__type-input
    position: absolute
    opacity: 0

    & + .aside__type-text
      display: flex
      align-items: center
      justify-content: center
      width: 44px
      height: 44px
      border-radius: 50%
      background: white
      transition: all 0.3s ease-in-out
      font-size: 14px
      text-align: center

    &:checked + .aside__type-text
      background: var(--main-dark)
      color: white
      box-shadow: var(--input-shadow)


    &:disabled + .aside__type-text
      color: #999
      cursor: not-allowed

    &:not(:disabled) + .aside__type-text:hover
      box-shadow: var(--input-shadow)
  &__reset
    background: none
    border: none
    cursor: pointer
    display: flex
    gap: 8px
</style>