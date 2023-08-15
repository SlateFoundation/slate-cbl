module.exports = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  rules: {
    // override/add rules settings here
    "vue/valid-v-slot": "off",
    "sort-imports": "off",
    "vue/require-default-prop": "off",
  },
};
