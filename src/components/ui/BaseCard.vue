<template>
  <div 
    class="rounded-xl overflow-hidden transition-all duration-300 border"
    :class="[
      variant === 'outlined' ? 'border-gray-200' : 'border-transparent shadow-card',
      hover ? 'hover:shadow-card-hover hover:-translate-y-1 hover:border-primary/20' : '',
      className
    ]"
  >
    <div v-if="$slots.header" class="px-6 py-4 border-b border-gray-100">
      <slot name="header"></slot>
    </div>
    <div class="p-6">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outlined', 'flat'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'default':
      return 'bg-white rounded-lg shadow-card';
    case 'outlined':
      return 'bg-white rounded-lg border border-gray-200';
    case 'flat':
      return 'bg-gray-50 rounded-lg';
    default:
      return 'bg-white rounded-lg shadow-card';
  }
});
</script>