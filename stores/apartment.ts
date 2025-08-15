import { defineStore } from 'pinia'
import type { Apartment } from '@interfaces/apartments'
import { ref, reactive, watch, computed } from 'vue'
import axios from 'axios'

const STORAGE_KEY = 'apartments-store'

export const useApartmentsStore = defineStore('apartments', () => {
  const allApartments = ref<Apartment[]>([])
  const filteredApartments = ref<Apartment[]>([])
  const isLoaded = ref(false)

  const filters = reactive({
    rooms: null as number | null,
    priceMin: null as number | null,
    priceMax: null as number | null,
    areaMin: null as number | null,
    areaMax: null as number | null,
  })

  const currentPriceRange = ref<[number, number]>([0, 0]);
  const currentAreaRange = ref<[number, number]>([0, 0]);

  const sortKey = ref<keyof Apartment | ''>('')
  const sortOrder = ref<'asc' | 'desc'>('asc')

  const minPrice = computed(() => {
    if (!allApartments.value.length) return 0
    const prices = allApartments.value.map(a => a.price)
    const rawMin = Math.min(...prices)
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawMin)) - 1)
    return Math.floor(rawMin / magnitude) * magnitude
  })

  const maxPrice = computed(() => {
    if (!allApartments.value.length) return 1000000
    const prices = allApartments.value.map(a => a.price)
    const rawMax = Math.max(...prices)
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)) - 1)
    return Math.ceil(rawMax / magnitude) * magnitude
  })

  const minArea = computed(() => {
    if (!allApartments.value.length) return 0
    return Math.floor(Math.min(...allApartments.value.map(a => a.area)))
  })

  const maxArea = computed(() => {
    if (!allApartments.value.length) return 100
    return Math.ceil(Math.max(...allApartments.value.map(a => a.area)))
  })

  const safeLocalStorage = {
    getItem(key: string): string | null {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    },
    setItem(key: string, value: string): void {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    }
  };

  const loadPersistedFilters = () => {
    const raw = safeLocalStorage.getItem(STORAGE_KEY);
    if (!raw) {
      console.log('No saved data in localStorage');
      return;
    }

    try {
      const data = JSON.parse(raw);

      if (data.filters) {

        if (data.filters.rooms !== undefined && data.filters.rooms !== null) {
          filters.rooms = data.filters.rooms;
        }
        if (data.filters.priceMin !== undefined && data.filters.priceMin !== null) {
          filters.priceMin = Math.max(data.filters.priceMin, minPrice.value);
        }
        if (data.filters.priceMax !== undefined && data.filters.priceMax !== null) {
          filters.priceMax = Math.min(data.filters.priceMax, maxPrice.value);
        }
        if (data.filters.areaMin !== undefined && data.filters.areaMin !== null) {
          filters.areaMin = Math.max(data.filters.areaMin, minArea.value);
        }
        if (data.filters.areaMax !== undefined && data.filters.areaMax !== null) {
          filters.areaMax = Math.min(data.filters.areaMax, maxArea.value);
        }

        if (data.currentPriceRange) {
          currentPriceRange.value = [
            Math.max(data.currentPriceRange[0], minPrice.value),
            Math.min(data.currentPriceRange[1], maxPrice.value)
          ];
        }
        if (data.currentAreaRange) {
          currentAreaRange.value = [
            Math.max(data.currentAreaRange[0], minArea.value),
            Math.min(data.currentAreaRange[1], maxArea.value)
          ];
        }
      }

      if (data.sortKey) sortKey.value = data.sortKey;
      if (data.sortOrder) sortOrder.value = data.sortOrder;

    } catch (e) {
      console.error('Failed to parse localStorage data', e);
    }
  };

  const savePersistedFilters = () => {
    const dataToSave = {
      filters: {
        rooms: filters.rooms,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        areaMin: filters.areaMin,
        areaMax: filters.areaMax,
      },
      sortKey: sortKey.value,
      sortOrder: sortOrder.value,
      currentPriceRange: currentPriceRange.value,
      currentAreaRange: currentAreaRange.value
    };
    console.log('2minPrice:', minPrice.value, 'maxPrice:', maxPrice.value);
    console.log('2Current filters:', {...filters});
    console.log('2Current ranges:', currentPriceRange.value, currentAreaRange.value);
    safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  };

  const loadApartments = async () => {
    try {
      if (allApartments.value.length === 0) {
        const { data } = await axios.get<Apartment[]>('/data/apartments.json');
        allApartments.value = data;
        loadPersistedFilters();
        if (!safeLocalStorage.getItem(STORAGE_KEY)) {
          currentPriceRange.value = [minPrice.value, maxPrice.value];
          currentAreaRange.value = [minArea.value, maxArea.value];
        }

        setTimeout(() => {
          shouldSave = true;
        }, 100);
      }
      applyFilters();
      isLoaded.value = true;
    } catch (e) {
      console.error('Failed to load apartments', e);
    }
  };

  const applyFilters = () => {
    let result = allApartments.value.filter((a: Apartment) => {
      if (filters.rooms !== null && a.rooms !== filters.rooms) return false
      if (filters.priceMin !== null && a.price < filters.priceMin) return false
      if (filters.priceMax !== null && a.price > filters.priceMax) return false
      if (filters.areaMin !== null && a.area < filters.areaMin) return false
      if (filters.areaMax !== null && a.area > filters.areaMax) return false
      return true
    })

    if (sortKey.value) {
      const key = sortKey.value
      result = result.slice().sort((a: Apartment, b: Apartment) => {
        const valA = a[key] as number | string
        const valB = b[key] as number | string
        if (valA === valB) return 0
        if (sortOrder.value === 'asc') return valA > valB ? 1 : -1
        return valA < valB ? 1 : -1
      })
    }

    filteredApartments.value = result
  }

  const setFilter = (key: keyof typeof filters, value: any) => {
    filters[key] = value
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
    filters.rooms = null
    filters.priceMin = null
    filters.priceMax = null
    filters.areaMin = null
    filters.areaMax = null
    currentPriceRange.value[0] = minPrice.value
    currentPriceRange.value[1] = maxPrice.value
    currentAreaRange.value[0] = minArea.value
    currentAreaRange.value[1] = maxArea.value
    sortKey.value = ''
    sortOrder.value = 'asc'
    applyFilters()
  }

  let shouldSave = false;

  watch([filters, sortKey, sortOrder, currentPriceRange, currentAreaRange], () => {
    if (shouldSave) {
      savePersistedFilters();
    }
  });

  return {
    allApartments,
    filteredApartments,
    filters,
    sortKey,
    sortOrder,
    isLoaded,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    currentPriceRange,
    currentAreaRange,
    loadApartments,
    applyFilters,
    setFilter,
    setSort,
    resetFilters
  }
})
