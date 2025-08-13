<script setup lang="ts">
import {useApartmentsStore} from "@stores/apartment";
import type {Apartment} from "@interfaces/apartments";
const store = useApartmentsStore();
const allApartments = computed(() => store.filteredApartments)
const visibleApartments = computed(() => store.filteredApartments.slice(0, visibleCount.value))

const isLoading = computed(() => store.isLoaded)

const width = ref(0)
const isWide = computed(() => width.value >= 1400)
const isMedium = computed(() => width.value > 314 && width.value < 1400)

const countLoadApartments = ref(20)
const visibleCount = ref(countLoadApartments.value)
const onResize = () => {
  width.value = window.innerWidth
}

const loadMore = () => {
  visibleCount.value += countLoadApartments.value
}

const toggleSort = (key: keyof Apartment) => {
  store.setSort(key)
}

const isSortActive = (key: keyof Apartment, order: 'asc' | 'desc') =>
    store.sortKey === key && store.sortOrder === order

onMounted(async () => {
  onResize()
  window.addEventListener('resize', onResize)
})
</script>

<template>
  <div class="loading container" v-if="!isLoading">
    Загрузка...
  </div>
  <div id="top" v-else>
    <main class="main">
      <h1 class="main__title">Квартиры</h1>

      <div class="main__apartments" v-if="visibleApartments.length !== 0">
        <table class="main__apartments-table" v-if="isWide">
          <thead>
          <tr class="main__apartments-header-row">
            <th class="main__apartments-header-cell"><div class="main__apartments-inner">Планировка</div></th>
            <th class="main__apartments-header-cell"><div class="main__apartments-inner ">Квартира</div></th>

            <th
                @click="toggleSort('area')"
                class="main__apartments-sort"
                role="button"
                tabindex="0"
            >
              <div class="main__apartments-inner">
                <span class="main__apartments-sort-text">S, м²</span>
                <span class="main__apartments-sort-icons">
                    <svg
                        :class="{'main__apartments-sort-icon_active': isSortActive('area', 'asc')}"
                        class="main__apartments-sort-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="7"
                        height="4"
                        viewBox="0 0 7 4"
                        fill="currentColor"
                    >
                      <g opacity="0.4">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M4.03429 0.253496C3.87202 0.0898395 3.65776 0 3.42808 0C3.19896 0 2.98356 0.0898396 2.82244 0.253496L0.167341 3.01277C-0.0560599 3.2388 -0.0560599 3.60445 0.167341 3.83048C0.39017 4.05651 0.75184 4.05651 0.97524 3.83048L3.42808 1.27549L5.88148 3.83048C6.10488 4.05651 6.46598 4.05651 6.68938 3.83048C6.91278 3.60445 6.91278 3.2388 6.68938 3.01277L4.03429 0.253496Z"
                        />
                      </g>
                    </svg>
                    <svg
                        :class="[
                        'main__apartments-sort-icon',
                        'main__apartments-sort-icon_flipped',
                        {'main__apartments-sort-icon_active': isSortActive('area', 'desc')}
                      ]"
                        xmlns="http://www.w3.org/2000/svg"
                        width="7"
                        height="4"
                        viewBox="0 0 7 4"
                        fill="currentColor"
                    >
                      <g opacity="0.4">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M4.03429 0.253496C3.87202 0.0898395 3.65776 0 3.42808 0C3.19896 0 2.98356 0.0898396 2.82244 0.253496L0.167341 3.01277C-0.0560599 3.2388 -0.0560599 3.60445 0.167341 3.83048C0.39017 4.05651 0.75184 4.05651 0.97524 3.83048L3.42808 1.27549L5.88148 3.83048C6.10488 4.05651 6.46598 4.05651 6.68938 3.83048C6.91278 3.60445 6.91278 3.2388 6.68938 3.01277L4.03429 0.253496Z"
                        />
                      </g>
                    </svg>
                  </span>
              </div>
            </th>

            <th
                @click="toggleSort('floor')"
                class="main__apartments-sort"
                role="button"
                tabindex="0"
            >
              <div class="main__apartments-inner">
                <span class="main__apartments-sort-text">Этаж</span>
                <span class="main__apartments-sort-icons">
                    <svg
                        :class="{'main__apartments-sort-icon_active': isSortActive('floor', 'asc')}"
                        class="main__apartments-sort-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="7"
                        height="4"
                        viewBox="0 0 7 4"
                        fill="currentColor"
                    >
                      <g opacity="0.4">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M4.03429 0.253496C3.87202 0.0898395 3.65776 0 3.42808 0C3.19896 0 2.98356 0.0898396 2.82244 0.253496L0.167341 3.01277C-0.0560599 3.2388 -0.0560599 3.60445 0.167341 3.83048C0.39017 4.05651 0.75184 4.05651 0.97524 3.83048L3.42808 1.27549L5.88148 3.83048C6.10488 4.05651 6.46598 4.05651 6.68938 3.83048C6.91278 3.60445 6.91278 3.2388 6.68938 3.01277L4.03429 0.253496Z"
                        />
                      </g>
                    </svg>
                    <svg
                        :class="[
                        'main__apartments-sort-icon',
                        'main__apartments-sort-icon_flipped',
                        {'main__apartments-sort-icon_active': isSortActive('floor', 'desc')}
                      ]"
                        xmlns="http://www.w3.org/2000/svg"
                        width="7"
                        height="4"
                        viewBox="0 0 7 4"
                        fill="currentColor"
                    >
                      <g opacity="0.4">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M4.03429 0.253496C3.87202 0.0898395 3.65776 0 3.42808 0C3.19896 0 2.98356 0.0898396 2.82244 0.253496L0.167341 3.01277C-0.0560599 3.2388 -0.0560599 3.60445 0.167341 3.83048C0.39017 4.05651 0.75184 4.05651 0.97524 3.83048L3.42808 1.27549L5.88148 3.83048C6.10488 4.05651 6.46598 4.05651 6.68938 3.83048C6.91278 3.60445 6.91278 3.2388 6.68938 3.01277L4.03429 0.253496Z"
                        />
                      </g>
                    </svg>
                  </span>
              </div>
            </th>

            <th
                @click="toggleSort('price')"
                class="main__apartments-sort"
                role="button"
                tabindex="0"
            >
              <div class="main__apartments-inner">
                <span class="main__apartments-sort-text text-green">Цена, ₽</span>
                <span class="main__apartments-sort-icons">
                    <svg
                        :class="{'main__apartments-sort-icon_active': isSortActive('price', 'asc')}"
                        class="main__apartments-sort-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="7"
                        height="4"
                        viewBox="0 0 7 4"
                        fill="currentColor"
                    >
                      <g opacity="0.4">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M4.03429 0.253496C3.87202 0.0898395 3.65776 0 3.42808 0C3.19896 0 2.98356 0.0898396 2.82244 0.253496L0.167341 3.01277C-0.0560599 3.2388 -0.0560599 3.60445 0.167341 3.83048C0.39017 4.05651 0.75184 4.05651 0.97524 3.83048L3.42808 1.27549L5.88148 3.83048C6.10488 4.05651 6.46598 4.05651 6.68938 3.83048C6.91278 3.60445 6.91278 3.2388 6.68938 3.01277L4.03429 0.253496Z"
                        />
                      </g>
                    </svg>
                    <svg
                        :class="[
                      'main__apartments-sort-icon',
                      'main__apartments-sort-icon_flipped',
                      {'main__apartments-sort-icon_active': isSortActive('price', 'desc')}
                      ]"
                        xmlns="http://www.w3.org/2000/svg"
                        width="7"
                        height="4"
                        viewBox="0 0 7 4"
                        fill="currentColor"
                    >
                      <g opacity="0.4">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M4.03429 0.253496C3.87202 0.0898395 3.65776 0 3.42808 0C3.19896 0 2.98356 0.0898396 2.82244 0.253496L0.167341 3.01277C-0.0560599 3.2388 -0.0560599 3.60445 0.167341 3.83048C0.39017 4.05651 0.75184 4.05651 0.97524 3.83048L3.42808 1.27549L5.88148 3.83048C6.10488 4.05651 6.46598 4.05651 6.68938 3.83048C6.91278 3.60445 6.91278 3.2388 6.68938 3.01277L4.03429 0.253496Z"
                        />
                      </g>
                    </svg>
                  </span>
              </div>
            </th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="apt in visibleApartments" :key="apt.id" class="main__apartments-row">
            <td><img :src="apt.image" alt="Планировка" /></td>
            <td class="text-medium"><p>{{ apt.rooms }}-комнатная {{ apt.title }}</p></td>
            <td><p>{{ apt.area }}</p></td>
            <td><p>{{ apt.floor }} <span class="text-opacity">из {{ apt.totalFloors }} этаж</span></p></td>
            <td><p>{{ apt.price.toLocaleString('ru-RU') }}</p></td>
          </tr>
          </tbody>
        </table>

        <div class="main__apartments-cards" v-else-if="isMedium">
          <div class="main__apartments-header">
            <button
                @click="toggleSort('area')"
                class="main__apartments-sort"
                type="button"
            >
              <span class="main__apartments-sort-text">S, м²</span>
              <span class="main__apartments-sort-icons">
                <svg
                    :class="{'main__apartments-sort-icon_active': isSortActive('area', 'desc')}"
                    class="main__apartments-sort-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="7"
                    height="4"
                    viewBox="0 0 7 4"
                    fill="currentColor"
                >
                  <g opacity="0.4">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M4.03429 0.253496C3.87202 0.0898395 3.65776 0 3.42808 0C3.19896 0 2.98356 0.0898396 2.82244 0.253496L0.167341 3.01277C-0.0560599 3.2388 -0.0560599 3.60445 0.167341 3.83048C0.39017 4.05651 0.75184 4.05651 0.97524 3.83048L3.42808 1.27549L5.88148 3.83048C6.10488 4.05651 6.46598 4.05651 6.68938 3.83048C6.91278 3.60445 6.91278 3.2388 6.68938 3.01277L4.03429 0.253496Z"
                    />
                  </g>
                </svg>
                <svg
                    :class="[
                    'main__apartments-sort-icon',
                    'main__apartments-sort-icon_flipped',
                    {'main__apartments-sort-icon_active': isSortActive('area', 'asc')}
                  ]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="7"
                    height="4"
                    viewBox="0 0 7 4"
                    fill="currentColor"
                >
                  <g opacity="0.4">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M4.03429 0.253496C3.87202 0.0898395 3.65776 0 3.42808 0C3.19896 0 2.98356 0.0898396 2.82244 0.253496L0.167341 3.01277C-0.0560599 3.2388 -0.0560599 3.60445 0.167341 3.83048C0.39017 4.05651 0.75184 4.05651 0.97524 3.83048L3.42808 1.27549L5.88148 3.83048C6.10488 4.05651 6.46598 4.05651 6.68938 3.83048C6.91278 3.60445 6.91278 3.2388 6.68938 3.01277L4.03429 0.253496Z"
                    />
                  </g>
                </svg>
              </span>
            </button>
            <button @click="toggleSort('floor')" class="main__apartments-sort" type="button">
              <span class="main__apartments-sort-text">Этаж</span>
              <span class="main__apartments-sort-icons">
                <svg
                    :class="{'main__apartments-sort-icon_active': isSortActive('floor', 'desc')}"
                    class="main__apartments-sort-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="7"
                    height="4"
                    viewBox="0 0 7 4"
                    fill="currentColor"
                >
                  <g opacity="0.4">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M4.03429 0.253496C3.87202 0.0898395 3.65776 0 3.42808 0C3.19896 0 2.98356 0.0898396 2.82244 0.253496L0.167341 3.01277C-0.0560599 3.2388 -0.0560599 3.60445 0.167341 3.83048C0.39017 4.05651 0.75184 4.05651 0.97524 3.83048L3.42808 1.27549L5.88148 3.83048C6.10488 4.05651 6.46598 4.05651 6.68938 3.83048C6.91278 3.60445 6.91278 3.2388 6.68938 3.01277L4.03429 0.253496Z"
                    />
                  </g>
                </svg>
                <svg
                    :class="[
                    'main__apartments-sort-icon',
                    'main__apartments-sort-icon_flipped',
                    {'main__apartments-sort-icon_active': isSortActive('floor', 'asc')}
                  ]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="7"
                    height="4"
                    viewBox="0 0 7 4"
                    fill="currentColor"
                >
                  <g opacity="0.4">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M4.03429 0.253496C3.87202 0.0898395 3.65776 0 3.42808 0C3.19896 0 2.98356 0.0898396 2.82244 0.253496L0.167341 3.01277C-0.0560599 3.2388 -0.0560599 3.60445 0.167341 3.83048C0.39017 4.05651 0.75184 4.05651 0.97524 3.83048L3.42808 1.27549L5.88148 3.83048C6.10488 4.05651 6.46598 4.05651 6.68938 3.83048C6.91278 3.60445 6.91278 3.2388 6.68938 3.01277L4.03429 0.253496Z"
                    />
                  </g>
                </svg>
              </span>
            </button>
            <button @click="toggleSort('price')" class="main__apartments-sort" type="button">
              <span class="main__apartments-sort-text text-green">Цена, ₽</span>
              <span class="main__apartments-sort-icons">
                <svg
                    :class="{'main__apartments-sort-icon_active': isSortActive('price', 'desc')}"
                    class="main__apartments-sort-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="7"
                    height="4"
                    viewBox="0 0 7 4"
                    fill="currentColor"
                >
                  <g opacity="0.4">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M4.03429 0.253496C3.87202 0.0898395 3.65776 0 3.42808 0C3.19896 0 2.98356 0.0898396 2.82244 0.253496L0.167341 3.01277C-0.0560599 3.2388 -0.0560599 3.60445 0.167341 3.83048C0.39017 4.05651 0.75184 4.05651 0.97524 3.83048L3.42808 1.27549L5.88148 3.83048C6.10488 4.05651 6.46598 4.05651 6.68938 3.83048C6.91278 3.60445 6.91278 3.2388 6.68938 3.01277L4.03429 0.253496Z"
                    />
                  </g>
                </svg>
                <svg
                    :class="[
                  'main__apartments-sort-icon',
                  'main__apartments-sort-icon_flipped',
                  {'main__apartments-sort-icon_active': isSortActive('price', 'asc')}
                  ]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="7"
                    height="4"
                    viewBox="0 0 7 4"
                    fill="currentColor"
                >
                  <g opacity="0.4">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M4.03429 0.253496C3.87202 0.0898395 3.65776 0 3.42808 0C3.19896 0 2.98356 0.0898396 2.82244 0.253496L0.167341 3.01277C-0.0560599 3.2388 -0.0560599 3.60445 0.167341 3.83048C0.39017 4.05651 0.75184 4.05651 0.97524 3.83048L3.42808 1.27549L5.88148 3.83048C6.10488 4.05651 6.46598 4.05651 6.68938 3.83048C6.91278 3.60445 6.91278 3.2388 6.68938 3.01277L4.03429 0.253496Z"
                    />
                  </g>
                </svg>
              </span>
            </button>
          </div>

          <div v-for="apt in visibleApartments" :key="apt.id" class="main__apartments-card">
            <div class="main__apartments-card-info">
              <div class="main__apartments-title">
                {{ apt.rooms }}-комнатная {{ apt.title }}
              </div>
              <div class="main__apartments-details">
                <p class="text-medium">{{ apt.area }} м²</p>
                <p>{{ apt.floor }} <span class="text-opacity">из {{ apt.totalFloors }} этаж</span></p>
                <p class="text-medium">{{ apt.price.toLocaleString('ru-RU') }} ₽</p>
              </div>
            </div>
            <img :src="apt.image" alt="Планировка" class="main__apartments-card-image" />
          </div>
        </div>
      </div>
      <div class="main__empty-apartments" v-else>
        Увы, нет подходящих квартир, попробуйте изменить настройки
      </div>
      <button class="main__btn" v-if="visibleCount < allApartments.length" @click="loadMore" type="button">
        Загрузить ещё
      </button>
    </main>
  </div>
</template>

<style scoped lang="sass">
@use '@styles/variables.sass' as *
@use '@styles/mixins.sass' as *
.main
  &__title
    font-size: 54px

  &__apartments
    margin-top: 48px

  &__apartments-table
    width: 100%
    border-collapse: collapse
    table-layout: fixed
    box-sizing: content-box

    & th:first-child
      width: 100px
      padding: 0 20px 16px 0

    & th:nth-child(2)
      width: auto
      padding: 0 20px 16px 0

    & th:nth-child(n+3)
      width: 140px
      padding: 0 20px 16px 0

    & th:last-child
      width: 120px
      padding-right: 0

  &__apartments-header-cell
    font-weight: 400
    text-align: start
    font-size: 14px

  &__apartments-sort
    text-align: start
    cursor: pointer
    user-select: none
    border: none
    background: none
    font-size: 14px

    &-icons
      display: flex
      flex-direction: column
      gap: 4px

    &-icon
      width: 7px
      height: 4px
      transition: filter 0.3s
      fill: currentColor

    &-icon_active
      & path
        fill: var(--main-dark)
        opacity: 1

    &-icon_flipped
      transform: rotate(180deg)

  &__apartments-inner
    display: flex
    align-items: center
    gap: 8px

  &__apartments-cards
    display: flex
    flex-direction: column
    gap: 12px

    & .main__apartments-sort
      display: flex
      align-items: center

      gap: 8px

  &__apartments-header
    display: flex
    gap: 20px
    margin-bottom: 12px

  &__apartments-row, &__apartments-header-row
    box-shadow: var(--shadow)

  &__apartments-row td *
    margin: 16px 0 24px 0

  &__apartments-card
    display: flex
    justify-content: space-between
    border: 1px solid var(--stroke-card)
    padding: 16px
    border-radius: 8px
    font-size: 14px

  &__apartments-card-info
    display: flex
    flex-direction: column
    gap: 8px

  &__apartments-title
    font-weight: 600

  &__apartments-details
    display: flex
    gap: 16px

  &__apartments-card-image
    max-width: 150px
    object-fit: contain

  &__btn
    @include btn-stroke
    margin-top: 48px
</style>