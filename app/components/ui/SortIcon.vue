<script setup lang="ts">
import { useApartmentsStore } from '@stores/apartment'

const store = useApartmentsStore()

const isSortActive = (key: keyof typeof store.sortKey, order: 'asc' | 'desc') =>
    store.sortKey === key && store.sortOrder === order

const handleSort = (key: keyof typeof store.sortKey, order: 'asc' | 'desc') => {
  store.setSort(key, order)
}
</script>

<template>
  <span class="sort-icons">
    <!-- стрелка вверх -->
    <svg
        @click="handleSort('floor', 'asc')"
        :class="['sort-icon', { 'sort-icon_active': isSortActive('floor', 'asc') }]"
        xmlns="http://www.w3.org/2000/svg"
        width="7"
        height="4"
        viewBox="0 0 7 4"
        fill="currentColor"
    >
      <g opacity="0.4">
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M4.03429 0.253496C3.87202 0.0898395 3.65776 0 3.42808 0C3.19896 0 2.98356 0.0898396 2.82244 0.253496L0.167341 3.01277C-0.0560599 3.2388 -0.0560599 3.60445 0.167341 3.83048C0.39017 4.05651 0.75184 4.05651 0.97524 3.83048L3.42808 1.27549L5.88148 3.83048C6.10488 4.05651 6.46598 4.05651 6.68938 3.83048C6.91278 3.60445 6.91278 3.2388 6.68938 3.01277L4.03429 0.253496Z"/>
      </g>
    </svg>

    <!-- стрелка вниз -->
    <svg
        @click="handleSort('floor', 'desc')"
        :class="['sort-icon', 'sort-icon_flipped', { 'sort-icon_active': isSortActive('floor', 'desc') }]"
        xmlns="http://www.w3.org/2000/svg"
        width="7"
        height="4"
        viewBox="0 0 7 4"
        fill="currentColor"
    >
      <g opacity="0.4">
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M4.03429 0.253496C3.87202 0.0898395 3.65776 0 3.42808 0C3.19896 0 2.98356 0.0898396 2.82244 0.253496L0.167341 3.01277C-0.0560599 3.2388 -0.0560599 3.60445 0.167341 3.83048C0.39017 4.05651 0.75184 4.05651 0.97524 3.83048L3.42808 1.27549L5.88148 3.83048C6.10488 4.05651 6.46598 4.05651 6.68938 3.83048C6.91278 3.60445 6.91278 3.2388 6.68938 3.01277L4.03429 0.253496Z"/>
      </g>
    </svg>
  </span>
</template>

<style scoped lang="scss">
.sort-icons {
  display: inline-flex;
  flex-direction: column;
  cursor: pointer;
  gap: 2px;
}

.sort-icon {
  transition: transform 0.3s;
  g path {
    fill: currentColor;
    opacity: 0.4;
  }
}

.sort-icon_active g path {
  fill: var(--main-dark);
  opacity: 1;
}

.sort-icon_flipped {
  transform: rotate(180deg);
}
</style>
