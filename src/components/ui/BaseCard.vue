<template>
    <div :class="[
      'overflow-hidden transition-all duration-300',
      variantClasses,
      { 'transform hover:-translate-y-1 hover:shadow-card-hover': hover }
    ]">
      <div v-if="$slots.header" class="px-5 py-4 border-b border-gray-100">
        <slot name="header" />
      </div>
      <div class="p-5">
        <slot />
      </div>
      <div v-if="$slots.footer" class="px-5 py-4 border-t border-gray-100">
        <slot name="footer" />
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