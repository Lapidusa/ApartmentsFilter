import { defineStore } from 'pinia';
import type { Apartment } from '@interfaces/apartments';
import { ref, reactive, watch, computed } from 'vue';
import axios from 'axios';

const STORAGE_KEY = 'apartments-store';

interface Filters {
  rooms: number | null;
  priceMin: number | null;
  priceMax: number | null;
  areaMin: number | null;
  areaMax: number | null;
}

interface PersistedData {
  filters?: Partial<Filters>;
  currentPriceRange?: [number, number];
  currentAreaRange?: [number, number];
  sortKey?: keyof Apartment | '';
  sortOrder?: 'asc' | 'desc';
}

export const useApartmentsStore = defineStore('apartments', () => {
  const allApartments = ref<Apartment[]>([]);
  const filteredApartments = ref<Apartment[]>([]);
  const isLoaded = ref(false);

  const filters = reactive<Filters>({
    rooms: null,
    priceMin: null,
    priceMax: null,
    areaMin: null,
    areaMax: null,
  });

  const currentPriceRange = ref<[number, number]>([0, 0]);
  const currentAreaRange = ref<[number, number]>([0, 0]);

  const sortKey = ref<keyof Apartment | ''>('');
  const sortOrder = ref<'asc' | 'desc'>('asc');

  const minPrice = computed(() => {
    if (!allApartments.value.length) return 0;
    const prices = allApartments.value.map(a => a.price);
    const rawMin = Math.min(...prices);
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawMin)) - 1);
    return Math.floor(rawMin / magnitude) * magnitude;
  });

  const maxPrice = computed(() => {
    if (!allApartments.value.length) return 1000000;
    const prices = allApartments.value.map(a => a.price);
    const rawMax = Math.max(...prices);
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)) - 1);
    return Math.ceil(rawMax / magnitude) * magnitude;
  });

  const minArea = computed(() => {
    if (!allApartments.value.length) return 0;
    return Math.floor(Math.min(...allApartments.value.map(a => a.area)));
  });

  const maxArea = computed(() => {
    if (!allApartments.value.length) return 100;
    return Math.ceil(Math.max(...allApartments.value.map(a => a.area)));
  });

  const { getItem, setItem } = useSafeLocalStorage();

  const { loadPersistedFilters, savePersistedFilters } = usePersistence({
    filters,
    currentPriceRange,
    currentAreaRange,
    sortKey,
    sortOrder,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    getItem,
    setItem,
  });

  const { loadApartments, applyFilters, setFilter, setSort, resetFilters } = useApartmentActions({
    allApartments,
    filteredApartments,
    filters,
    currentPriceRange,
    currentAreaRange,
    sortKey,
    sortOrder,
    isLoaded,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    loadPersistedFilters,
    getItem,
  });

  usePersistentChanges({
    filters,
    sortKey,
    sortOrder,
    currentPriceRange,
    currentAreaRange,
    savePersistedFilters,
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
    resetFilters,
  };
});

function useSafeLocalStorage() {
  return {
    getItem(key: string): string | null {
      return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    },
    setItem(key: string, value: string): void {
      if (typeof window !== 'undefined') localStorage.setItem(key, value);
    },
  };
}

function usePersistence(deps: {
  filters: Filters;
  currentPriceRange: Ref<[number, number]>;
  currentAreaRange: Ref<[number, number]>;
  sortKey: Ref<keyof Apartment | ''>;
  sortOrder: Ref<'asc' | 'desc'>;
  minPrice: ComputedRef<number>;
  maxPrice: ComputedRef<number>;
  minArea: ComputedRef<number>;
  maxArea: ComputedRef<number>;
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}) {
  const loadPersistedFilters = () => {
    const raw = deps.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const data = JSON.parse(raw) as PersistedData;

      if (data.filters) {
        (Object.keys(data.filters) as Array<keyof Filters>).forEach(key => {
          if (data.filters?.[key] !== null && data.filters?.[key] !== undefined) {
            deps.filters[key] = data.filters[key]!;
          }
        });
      }

      if (data.currentPriceRange) {
        deps.currentPriceRange.value = [
          Math.max(data.currentPriceRange[0], deps.minPrice.value),
          Math.min(data.currentPriceRange[1], deps.maxPrice.value),
        ];
      }

      if (data.currentAreaRange) {
        deps.currentAreaRange.value = [
          Math.max(data.currentAreaRange[0], deps.minArea.value),
          Math.min(data.currentAreaRange[1], deps.maxArea.value),
        ];
      }

      if (data.sortKey) deps.sortKey.value = data.sortKey;
      if (data.sortOrder) deps.sortOrder.value = data.sortOrder;
    } catch (e) {
      console.error('Failed to parse localStorage data', e);
    }
  };

  const savePersistedFilters = () => {
    const dataToSave: PersistedData = {
      filters: { ...deps.filters },
      sortKey: deps.sortKey.value,
      sortOrder: deps.sortOrder.value,
      currentPriceRange: [...deps.currentPriceRange.value],
      currentAreaRange: [...deps.currentAreaRange.value],
    };

    deps.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  };

  return { loadPersistedFilters, savePersistedFilters };
}

function useApartmentActions(deps: {
  allApartments: Ref<Apartment[]>;
  filteredApartments: Ref<Apartment[]>;
  filters: Filters;
  currentPriceRange: Ref<[number, number]>;
  currentAreaRange: Ref<[number, number]>;
  sortKey: Ref<keyof Apartment | ''>;
  sortOrder: Ref<'asc' | 'desc'>;
  isLoaded: Ref<boolean>;
  minPrice: ComputedRef<number>;
  maxPrice: ComputedRef<number>;
  minArea: ComputedRef<number>;
  maxArea: ComputedRef<number>;
  loadPersistedFilters: () => void;
  getItem: (key: string) => string | null;
}) {
  const loadApartments = async () => {
    try {
      if (deps.allApartments.value.length === 0) {
        const { data } = await axios.get<Apartment[]>('/data/apartments.json');
        deps.allApartments.value = data;

        deps.loadPersistedFilters();

        if (!deps.getItem(STORAGE_KEY)) {
          deps.currentPriceRange.value = [deps.minPrice.value, deps.maxPrice.value];
          deps.currentAreaRange.value = [deps.minArea.value, deps.maxArea.value];
        }
      }
      applyFilters();
      deps.isLoaded.value = true;
    } catch (e) {
      console.error('Failed to load apartments', e);
    }
  };

  const applyFilters = () => {
    deps.filteredApartments.value = deps.allApartments.value.filter(apartment => {
      return (
        (deps.filters.rooms === null || apartment.rooms === deps.filters.rooms) &&
        (deps.filters.priceMin === null || apartment.price >= deps.filters.priceMin) &&
        (deps.filters.priceMax === null || apartment.price <= deps.filters.priceMax) &&
        (deps.filters.areaMin === null || apartment.area >= deps.filters.areaMin) &&
        (deps.filters.areaMax === null || apartment.area <= deps.filters.areaMax)
      );
    });

    if (deps.sortKey.value) {
      const key = deps.sortKey.value;
      deps.filteredApartments.value.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (valA === valB) return 0;
        return deps.sortOrder.value === 'asc' ?
          (Number(valA) > Number(valB) ? 1 : -1) :
          (Number(valA) < Number(valB) ? 1 : -1);
      });
    }
  };

  const setFilter = (key: keyof Filters, value: number | null) => {
    deps.filters[key] = value;
    applyFilters();
  };

  const setSort = (key: keyof Apartment) => {
    if (deps.sortKey.value === key) {
      deps.sortOrder.value = deps.sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      deps.sortKey.value = key;
      deps.sortOrder.value = 'asc';
    }
    applyFilters();
  };

  const resetFilters = () => {
    deps.filters.rooms = null;
    deps.filters.priceMin = null;
    deps.filters.priceMax = null;
    deps.filters.areaMin = null;
    deps.filters.areaMax = null;

    deps.currentPriceRange.value = [deps.minPrice.value, deps.maxPrice.value];
    deps.currentAreaRange.value = [deps.minArea.value, deps.maxArea.value];

    deps.sortKey.value = '';
    deps.sortOrder.value = 'asc';

    applyFilters();
  };

  return { loadApartments, applyFilters, setFilter, setSort, resetFilters };
}

function usePersistentChanges(deps: {
  filters: Filters;
  sortKey: Ref<keyof Apartment | ''>;
  sortOrder: Ref<'asc' | 'desc'>;
  currentPriceRange: Ref<[number, number]>;
  currentAreaRange: Ref<[number, number]>;
  savePersistedFilters: () => void;
}) {
  let shouldSave = false;
  let saveTimeout: NodeJS.Timeout;

  setTimeout(() => { shouldSave = true; }, 100);

  watch(
    [
      () => ({ ...deps.filters }),
      deps.sortKey,
      deps.sortOrder,
      deps.currentPriceRange,
      deps.currentAreaRange,
    ],
    () => {
      if (!shouldSave) return;
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(deps.savePersistedFilters, 300);
    },
    { deep: true }
  );
}