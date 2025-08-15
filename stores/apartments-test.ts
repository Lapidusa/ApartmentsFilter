// import {defineStore} from "pinia";
// import axios from "axios";
// import type {Apartment} from "../interfaces/apartments";
// import {reactive, ref, watch} from "vue";
//
// const STORAGE_KEY = 'apartments-store'
//
// export const useApartmentsStore = defineStore('apartments', () => {
//   const allApartments = ref<Apartment[]>([])
//   const filteredApartments = ref<Apartment[]>([])
//
//
//   const filters = reactive({
//     rooms: null as number | null,
//     priceMin: null as number | null,
//     priceMax: null as number | null,
//     areaMin: null as number | null,
//     areaMax: null as number | null,
//   })
//   const minPrice = computed(() => {
//     if (!allApartments.value.length) return 0
//     const prices = allApartments.value.map(a => a.price)
//     const rawMin = Math.min(...prices)
//     const magnitude = Math.pow(10, Math.floor(Math.log10(rawMin)) - 1)
//     return Math.floor(rawMin / magnitude) * magnitude
//   })
//
//   const maxPrice = computed(() => {
//     if (!allApartments.value.length) return 1000000
//     const prices = allApartments.value.map(a => a.price)
//     const rawMax = Math.max(...prices)
//     const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)) - 1)
//     return Math.ceil(rawMax / magnitude) * magnitude
//   })
//
//   const minArea = computed(() => {
//     if (!allApartments.value.length) return 0
//     return Math.floor(Math.min(...allApartments.value.map(a => a.area)))
//   })
//
//   const maxArea = computed(() => {
//     if (!allApartments.value.length) return 100
//     return Math.ceil(Math.max(...allApartments.value.map(a => a.area)))
//   })
//
//   const currentPriceRange = ref<[number, number]>([0, 0]);
//   const currentAreaRange = ref<[number, number]>([0, 0]);
//
//   const sortKey = ref<keyof Apartment | ''>('')
//   const sortOrder = ref<'asc' | 'desc'>('asc')
//   const isLoaded = ref(false)
//
//   const loadPersistedFilters = () => {
//     // Проверяем что код выполняется на клиенте
//     if (!process.client) return;
//
//     const raw = localStorage.getItem(STORAGE_KEY);
//     if (!raw) return;
//
//     try {
//       const data = JSON.parse(raw);
//       console.log('Loaded from localStorage:', data);
//       // ... остальная логика
//     } catch (e) {
//       console.error('Failed to parse localStorage data', e);
//     }
//   };
//   const loadApartments = async () => {
//     try {
//       if (allApartments.value.length === 0) {
//         const { data } = await axios.get<Apartment[]>('/data/apartments.json');
//         allApartments.value = data;
//         // initializeDefaultRanges(); // Инициализация после загрузки данных
//       }
//       // loadPersistedFilters();
//       loadPersistedFilters()
//       applyFilters();
//       isLoaded.value = true;
//     } catch (e) {
//       console.error('Failed to load apartments', e);
//     }
//   };
//   const applyFilters = () => {
//     let result = allApartments.value.filter((a: Apartment) => {
//       if (filters.rooms !== null && a.rooms !== filters.rooms) return false
//       if (filters.priceMin !== null && a.price < filters.priceMin) return false
//       if (filters.priceMax !== null && a.price > filters.priceMax) return false
//       if (filters.areaMin !== null && a.area < filters.areaMin) return false
//       if (filters.areaMax !== null && a.area > filters.areaMax) return false
//       return true
//     })
//
//     if (sortKey.value) {
//       const key = sortKey.value
//       result = result.slice().sort((a: Apartment, b: Apartment) => {
//         const valA = a[key] as number | string
//         const valB = b[key] as number | string
//         if (valA === valB) return 0
//         if (sortOrder.value === 'asc') return valA > valB ? 1 : -1
//         return valA < valB ? 1 : -1
//       })
//     }
//
//     filteredApartments.value = result
//   }
//   const setFilter = (key: keyof typeof filters, value: any) => {
//     filters[key] = value
//     applyFilters()
//   }
//   const savePersistedFilters = () => {
//     if (!process.client) return;
//
//     const dataToSave: any = {
//       filters: {},
//       sortKey: sortKey.value,
//       sortOrder: sortOrder.value,
//     };
//
//     // Сохраняем только не-null значения фильтров
//     if (filters.rooms !== null) dataToSave.filters.rooms = filters.rooms;
//     if (filters.priceMin !== null) dataToSave.filters.priceMin = filters.priceMin;
//     if (filters.priceMax !== null) dataToSave.filters.priceMax = filters.priceMax;
//     if (filters.areaMin !== null) dataToSave.filters.areaMin = filters.areaMin;
//     if (filters.areaMax !== null) dataToSave.filters.areaMax = filters.areaMax;
//
//     // Сохраняем диапазоны только если они отличаются от дефолтных
//     if (currentPriceRange.value[0] !== minPrice.value ||
//       currentPriceRange.value[1] !== maxPrice.value) {
//       dataToSave.currentPriceRange = currentPriceRange.value;
//     }
//
//     if (currentAreaRange.value[0] !== minArea.value ||
//       currentAreaRange.value[1] !== maxArea.value) {
//       dataToSave.currentAreaRange = currentAreaRange.value;
//     }
//
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
//   }
//   watch([filters, sortKey, sortOrder, currentPriceRange, currentAreaRange], savePersistedFilters, { deep: true })
//
//   return {
//     loadApartments,
//     applyFilters,
//     setFilter,
//     allApartments,
//     filteredApartments,
//     filters,
//     sortKey,
//     sortOrder,
//     isLoaded,
//     minPrice,
//     maxPrice,
//     minArea,
//     maxArea,
//     currentPriceRange,
//     currentAreaRange,
//   }
// })