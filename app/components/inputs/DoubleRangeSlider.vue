<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: [number, number]
  min: number
  max: number
  step?: number
}

const props = withDefaults(defineProps<Props>(), {
  step: 1
})

const emit = defineEmits(['update:modelValue', 'change'])

const trackStyle = computed(() => {
  const leftPos = ((props.modelValue[0] - props.min) / (props.max - props.min)) * 100
  const rightPos = 100 - ((props.modelValue[1] - props.min) / (props.max - props.min)) * 100

  return {
    left: `${leftPos}%`,
    right: `${rightPos}%`
  }
})

const handleInput = (index: number, e: Event) => {
  const target = e.target as HTMLInputElement
  const newValue = [...props.modelValue] as [number, number]
  newValue[index] = parseFloat(
      Math.max(props.min, Math.min(props.max, Number(target.value))).toFixed(1)
  )

  if (index === 0) {newValue[1] = Math.max(newValue[1], newValue[0])}
  if (index === 1) {newValue[0] = Math.min(newValue[0], newValue[1])}

  emit('update:modelValue', newValue)
  emit('change', newValue)
}

</script>

<template>
  <div class="double-range-slider">
    <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue[0]"
        @input="handleInput(0, $event)"
    >
    <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue[1]"
        @input="handleInput(1, $event)"
    >
    <div class="slider-track">
      <div class="slider-range" :style="trackStyle"></div>
    </div>
    <div class="price-range-values">
      <span class="text-medium"><span class="text-opacity">от</span>{{ modelValue[0].toLocaleString('ru-RU') }}</span>
      <span class="text-medium"><span class="text-opacity">до</span>{{ modelValue[1].toLocaleString('ru-RU') }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.double-range-slider {
  position: relative;
  height: 50px;
  width: 100%;
  padding: 10px 0;
}
.text-opacity{
  margin-right: 8px;
}
input[type="range"] {
  position: absolute;
  width: 100%;
  height: 0;
  z-index: 100;
  pointer-events: none;
  -webkit-appearance: none;
  top: 75%;

  &::-webkit-slider-thumb {
    transform: translateY(-50%);
  }

  &::-webkit-slider-thumb {
    pointer-events: auto;
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--main-dark);
    margin-top: 14px;
    cursor: pointer;
    top: 75%;
    position: relative;
    z-index: 100;

  }

  &::-moz-range-thumb {
    pointer-events: auto;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--main-dark);
    cursor: pointer;
    top: 75%;
    z-index: 100;
    transform: translateY(-50%);
  }
}

.slider-track {
  position: absolute;
  height: 4px;
  width: 100%;
  background: #e0e0e0;
  top: 75%;
  transform: translateY(-50%);
  border-radius: 2px;
  z-index: -1;

  .slider-range {
    position: absolute;
    height: 100%;
    background: var(--main-dark);
    border-radius: 2px;
    z-index: -1;
  }
}

.price-range-values {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #666;
  top: -25px;
  font-size: 14px;
}
</style>