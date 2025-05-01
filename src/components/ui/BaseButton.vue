<template>
  <button 
    :type="type"
    class="inline-flex items-center justify-center font-medium transition-all duration-300"
    :class="[
      sizeClasses[size],
      variantClasses[variant],
      block ? 'w-full' : '',
      iconPosition === 'right' ? 'flex-row-reverse' : '',
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md',
      loading ? 'cursor-wait' : '',
      className
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <LoaderCircle v-if="loading" class="animate-spin mr-2" :size="loaderSize" />
    <component v-else-if="icon" :is="icon" :size="iconSize" :class="text ? iconPosition === 'left' ? 'mr-2' : 'ml-2' : ''" />
    <span v-if="text">{{ text }}</span>
    <slot v-else></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { LoaderCircle } from 'lucide-vue-next';

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
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
  },
  text: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  },
  loaderSize: {
    type: String,
    default: '1.25em'
  },
  iconSize: {
    type: String,
    default: '1.25em'
  }
});

defineEmits(['click']);

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

const variantClasses = {
  primary: 'bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-lg shadow-sm',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg',
  outline: 'bg-transparent text-primary hover:bg-primary-lighter hover:text-primary-darker border border-primary rounded-lg',
  ghost: 'bg-transparent text-primary hover:bg-primary-lighter/10 border border-transparent rounded-lg',
  danger: 'bg-error text-white hover:bg-error/90 focus:ring-error/30 border border-transparent rounded-lg'
};
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