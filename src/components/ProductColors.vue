<template>
  <ul class="colors">
    <li class="colors__item" v-for="color in colors" :key="color.id">
      <label class="colors__label">
        <input
          class="colors__radio sr-only"
          type="radio"
          :value="color.id"
          v-model="currentColors"
        />
        <span class="colors__value" :style="{ backgroundColor: color.code }"></span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ProductColor',
  props: ['colors', 'currentColor'],
  computed: {
    currentColors: {
      get() {
        return this.currentColor;
      },
      set(value) {
        this.$emit('update:currentColor', value);
      },
    },
  },
};
</script>
