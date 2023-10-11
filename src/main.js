import { createApp } from 'vue'
import App from './App.vue'

class DataGrid {

  static TYPE_RAW = 'raw'
  static TYPE_NUMERIC = 'numeric'
  static TYPE_TEXT_SHORT = 'text-short'

  /**
   * @param {Array} configes
   */
  static mounts (configes) {
    configes.forEach(async (config) => {
      DataGrid.mount(config)
    })
  }

  static mount(config) {
    let {id} = config
    const app = createApp(App, config)
    app.mount('#' + id)
  }
}

window.DataGrid = DataGrid
export default DataGrid


