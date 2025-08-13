import { defineStore } from 'pinia'
import type { Apartment } from '@interfaces/apartments'
import { ref } from 'vue'
import axios from "axios";

export const useApartmentsStore = defineStore('apartments', () => {
  const allApartments = ref<Apartment[]>([])
  const filteredApartments = ref<Apartment[]>([])
  const filters = ref({
    rooms: null as number | null,
    priceMin: null as number | null,
    priceMax: null as number | null,
    areaMin: null as number | null,
    areaMax: null as number | null,
  })
  const sortKey = ref<keyof Apartment | ''>('')
  const sortOrder = ref<'asc' | 'desc'>('asc')
  const isLoaded = ref(false)

  const loadApartments = async () => {
    try {
      const { data } = await axios.get<Apartment[]>('/data/apartments.json') // твой API
      allApartments.value = data
      applyFilters()
      isLoaded.value = true
    } catch (e) {
      console.error('Failed to load apartments', e)
    }
  }

  const applyFilters = () => {
    let result = allApartments.value.filter(a => {
      if (filters.value.rooms !== null && a.rooms !== filters.value.rooms) return false
      if (filters.value.priceMin !== null && a.price < filters.value.priceMin) return false
      if (filters.value.priceMax !== null && a.price > filters.value.priceMax) return false
      if (filters.value.areaMin !== null && a.area < filters.value.areaMin) return false
      if (filters.value.areaMax !== null && a.area > filters.value.areaMax) return false
      return true
    })

    if (sortKey.value) {
      const key = sortKey.value
      result = result.slice().sort((a, b) => {
        const valA = a[key]
        const valB = b[key]
        if (valA === valB) return 0
        if (sortOrder.value === 'asc') return valA > valB ? 1 : -1
        return valA < valB ? 1 : -1
      })
    }

    filteredApartments.value = result
  }

  const setFilter = (key: keyof typeof filters.value, value: any) => {
    filters.value[key] = value
    applyFilters()
  }

  const setSort = (key: keyof Apartment) => {
    if (sortKey.value === key) {
      if (sortOrder.value === 'asc') sortOrder.value = 'desc'
      else if (sortOrder.value === 'desc') sortKey.value = '', sortOrder.value = 'asc'
    } else {
      sortKey.value = key
      sortOrder.value = 'asc'
    }
    applyFilters()
  }

  const resetFilters = () => {
    filters.value = {
      rooms: null,
      priceMin: null,
      priceMax: null,
      areaMin: null,
      areaMax: null
    }
    applyFilters()
  }

  return {
    allApartments,
    filteredApartments,
    filters,
    sortKey,
    sortOrder,
    isLoaded,
    loadApartments,
    applyFilters,
    setFilter,
    setSort,
    resetFilters
  }
})
