export default {
  install(app) {
    app.config.globalProperties.$site = {
      // per-site configuration
      // TODO get this from back end
      minLevel: 9,
      maxLevel: 12,
    };
  },
};
