<script setup lang="ts">
import DoubleRangeSlider from "@components-inputs/DoubleRangeSlider.vue";
import { useApartmentsStore } from "@stores/apartment";

const store = useApartmentsStore();

const allApartments = computed(() => store.filteredApartments)
const isLoading = computed(() => store.isLoaded)
const activeType = ref<string | null>(null)

const minPrice = ref(0)
const maxPrice = ref(0)
const minArea = ref(0)
const maxArea = ref(0)

const priceRange = ref<[number, number]>([0, 0])
const areaRange = ref<[number, number]>([0, 0])

const apartmentTypes = [
  { label: '1к', value: '1' },
  { label: '2к', value: '2' },
  { label: '3к', value: '3' },
  { label: '4к', value: '4' }
]

const availableTypes = computed(() => {
  const set = new Set(allApartments.value.map(a => String(a.rooms)));
  return apartmentTypes.map(t => ({
    ...t,
    disabled: !set.has(t.value)
  }));
});

function initialData() {
  if (!allApartments.value.length) return;

  let minP = Infinity, maxP = -Infinity;
  let minA = Infinity, maxA = -Infinity;

  for (const { price, area } of allApartments.value) {
    if (price < minP) minP = price;
    if (price > maxP) maxP = price;
    if (area < minA) minA = area;
    if (area > maxA) maxA = area;
  }

  const magnitudePrice = Math.pow(10, Math.floor(Math.log10(maxP)) - 1);
  minPrice.value = Math.floor(minP / magnitudePrice) * magnitudePrice;
  maxPrice.value = Math.ceil(maxP / magnitudePrice) * magnitudePrice;
  priceRange.value = [minPrice.value, maxPrice.value];

  minArea.value = Math.floor(minA);
  maxArea.value = Math.ceil(maxA);
  areaRange.value = [minArea.value, maxArea.value];
}

onMounted(async () => {
  await store.loadApartments();
  initialData();
});

watchEffect(() => {
  store.setFilter("rooms", activeType.value ? Number(activeType.value) : null);
  store.setFilter("priceMin", priceRange.value[0]);
  store.setFilter("priceMax", priceRange.value[1]);
  store.setFilter("areaMin", areaRange.value[0]);
  store.setFilter("areaMax", areaRange.value[1]);
});

function resetFilters() {
  store.resetFilters();
  activeType.value = null;
  initialData();
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
          :min="minPrice"
          :max="maxPrice"
          :step="100000"
          @change="store.setFilter('priceMin', $event[0]); store.setFilter('priceMax', $event[1])"
      />
    </div>

    <div class="aside__slider">
      <label class="aside__label">Площадь квартиры</label>
      <DoubleRangeSlider
          v-model="areaRange"
          :min="minArea"
          :max="maxArea"
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