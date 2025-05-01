<template>
    <div class="w-full">
      <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label }}
        <span v-if="required" class="text-error">*</span>
      </label>
      
      <div class="relative">
        <span v-if="iconLeft" class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <component :is="iconLeft" size="1.25em" />
        </span>
        
        <input
          :id="id"
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          :autocomplete="autocomplete"
          :class="[
            'block w-full rounded-md shadow-sm border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 transition-colors duration-150',
            { 'pl-10': iconLeft, 'pr-10': iconRight, 'border-error focus:border-error focus:ring-error/20': error },
            disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
          ]"
          @input="$emit('update:modelValue', $event.target.value)"
          @blur="$emit('blur', $event)"
          @focus="$emit('focus', $event)"
        />
        
        <span v-if="iconRight" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
          <component :is="iconRight" size="1.25em" />
        </span>
      </div>
      
      <p v-if="error" class="mt-1 text-xs text-error">{{ error }}</p>
      <p v-else-if="hint" class="mt-1 text-xs text-gray-500">{{ hint }}</p>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: () => `input-${Math.random().toString(36).substring(2, 9)}`
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    },
    iconLeft: {
      type: [Object, null],
      default: null
    },
    iconRight: {
      type: [Object, null],
      default: null
    },
    autocomplete: {
      type: String,
      default: 'off'
    }
  });
  
  defineEmits(['update:modelValue', 'blur', 'focus']);
  </script>