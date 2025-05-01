<template>
    <button
      :class="[
        'inline-flex items-center justify-center font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        sizeClasses,
        variantClasses,
        { 'rounded-full': rounded, 'w-full': block, 'opacity-60 cursor-not-allowed': disabled || loading }
      ]"
      :disabled="disabled || loading"
      @click="$emit('click', $event)"
    >
      <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
        <LoaderCircle class="animate-spin" size="1.25em" />
      </span>
      <span v-else-if="icon && iconPosition === 'left'" class="mr-2">
        <component :is="icon" size="1.25em" />
      </span>
      <span :class="{ 'opacity-0': loading }">
        <slot />
      </span>
      <span v-if="icon && iconPosition === 'right'" class="ml-2">
        <component :is="icon" size="1.25em" />
      </span>
    </button>
  </template>
  
  <script setup>
  import { LoaderCircle } from 'lucide-vue-next';
  import { computed } from 'vue';
  
  const props = defineProps({
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    icon: {
      type: [Object, null],
      default: null
    },
    iconPosition: {
      type: String,
      default: 'left',
      validator: (value) => ['left', 'right'].includes(value)
    },
    rounded: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  });
  
  defineEmits(['click']);
  
  const sizeClasses = computed(() => {
    switch (props.size) {
      case 'sm': return 'px-3 py-1.5 text-sm';
      case 'lg': return 'px-6 py-3 text-lg';
      default: return 'px-4 py-2 text-base';
    }
  });
  
  const variantClasses = computed(() => {
    switch (props.variant) {
      case 'primary':
        return 'bg-primary text-white hover:bg-primary-dark focus:ring-primary-light border border-transparent rounded-md';
      case 'secondary':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300 border border-transparent rounded-md';
      case 'outline':
        return 'bg-transparent text-primary hover:bg-primary-lighter hover:text-primary-darker border border-primary rounded-md';
      case 'ghost':
        return 'bg-transparent text-primary hover:bg-primary-lighter/10 border border-transparent rounded-md';
      case 'danger':
        return 'bg-error text-white hover:bg-error/90 focus:ring-error/30 border border-transparent rounded-md';
      default:
        return 'bg-primary text-white hover:bg-primary-dark focus:ring-primary-light border border-transparent rounded-md';
    }
  });
  </script>
  
  <style scoped>
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  </style>