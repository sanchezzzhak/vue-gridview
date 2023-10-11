import {createApp} from 'vue';
import Component from '../components/GridView.vue';

export class GridView {

  static TYPE_RAW = 'raw';
  static TYPE_NUMERIC = 'numeric';
  static TYPE_TEXT_SHORT = 'text-short';

  /**
   * @param {Array} configs
   */
  static mounts(configs) {
    configs.forEach(async (config) => {
      GridView.mount(config);
    });
  }

  static mount(config) {
    let {id} = config;
    const app = createApp(Component, config);
    app.mount('#' + id);
  }
}

// jquery plugin
(function($) {
  if ($ === void 0) {
    return;
  }
  $.fn.GridView = function(config) {
    GridView.mount(config);
    return this;
  };

})(window.jQuery ?? void 0); // eslint-disable-line no-undef
