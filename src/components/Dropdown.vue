<template>
  <div class="dropdown" ref="dropdownRef">
    <a
      href="#"
      class="btn btn-outline-light my-2 dropdown-toggle"
      @click.prevent="toggleOpen"
      >{{ title }}</a
    >
    <ul
      class="dropdown-menu menu-visible"
      aria-labelledby="dropdownMenuButton"
      v-if="isOpen"
    >
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { useClickOutside } from "@/hooks/useClickOutside";
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "Dropdown",
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    const isOpen = ref(false);
    const dropdownRef = ref<null | HTMLElement>(null);
    const toggleOpen = () => {
      isOpen.value = !isOpen.value;
    };
    const isClickOutSide = useClickOutside(dropdownRef);
    watch(isClickOutSide, () => {
      if (isOpen.value && isClickOutSide.value) {
        isOpen.value = false;
      }
    });
    return {
      isOpen,
      toggleOpen,
      dropdownRef
    };
  }
});
</script>

<style lang="scss" scoped>
.menu-visible {
  display: block;
}
</style>
