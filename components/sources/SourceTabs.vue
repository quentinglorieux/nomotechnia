<template>
  <div
    :class="{
      flex: variant === 'horizontal',
    }"
  >
    <ul
      :class="{
        flex: variant === 'vertical',
      }"
    >
      <li v-for="(tab, index) in tabList" :key="index">
        <label :for="`${_uid}${index}`" v-text="tab" />
        <input
          :id="`${_uid}${index}`"
          type="radio"
          :name="`${_uid}-tab`"
          :value="index + 1"
          v-model="activeTab"
        />
      </li>
    </ul>

    <template v-for="(tab, index) in tabList">
    
      <div :key="index" v-if="index + 1 === activeTab">
        <slot :name="`tabPanel-${index + 1}`" />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    tabList: {
      type: Array,
      required: true,
    },
    variant: {
      type: String,
      required: false,
      default: () => "vertical",
      validator: (value) => ["horizontal", "vertical"].includes(value),
    },
  },
  data() {
    return {
      activeTab: 1,
    };
  },
};
</script>

<style>
.flex {
  display: flex;
}
</style>