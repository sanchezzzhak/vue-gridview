<script setup>

import {defineProps} from 'vue';
import DataManager from './grid-view/data-manager';

const props = defineProps([
  'id',
  'tableResponsive',
  'theadSticky',
  'resizeColumn',

  'containerOptions',
  'tableOptions',
  'theadOptions',
  'columns',
  'data',
]);


// const theme = props.config?.theme ?? 'bootstrap5';

const getClasses = (list) => {
  let result = {};
  list.forEach((value) => {
    result[value] = true;
  })
  return result;
}

const containerClasses = {
  'table-responsive': props.tableResponsive ?? false,
  ...getClasses(props.options?.class ?? [])
};

const tableClasses = {
  'table': true,
  ...getClasses(props.tableOptions?.class ?? [])
};

const theadClasses = {
  'thead-sticky': props.theadSticky ?? false,
  ...getClasses(props.theadOptions?.class ?? [])
};

const dataManager = new DataManager(props.columns ?? [], props.data ?? []);
</script>

<template >
  <div :class="containerClasses">
    <table :class="tableClasses">
      <thead :class="theadClasses">
      <tr>
        <th
            v-for="column of dataManager.columns()"
            v-bind:key="column"
            :data-key="column.key()"
            :data-index="column.index()"
            :data-type="column.type()"
            scope="col"
        >{{ column.label() }} <span v-if="props.resizeColumn ?? false" class="resize-handle"></span>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row of dataManager.data()"  v-bind:key="row">
        <td v-for="column of dataManager.columns()"
            v-bind:key="column"
            :data-key="column.key()"
            :data-label="column.label()"
            :scope ="column.index() === 0 ? 'row': void 0"
        >{{ column.render(row) }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.thead-sticky th {
  position: sticky;
  top: 0;
  background: #6c7ae0;
  font-weight: normal;
  font-size: 1.1rem;
  color: white;
}

@media screen and (max-width: 600px) {
  table {
    border: 0;
  }

  table caption {
    font-size: 1.3em;
  }

  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: .625em;
  }

  table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: .8em;
    text-align: right;
  }

  table td::before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }

  table td:last-child {
    border-bottom: 0;
  }
}

</style>
