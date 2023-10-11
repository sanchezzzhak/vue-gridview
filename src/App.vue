<script setup>

import {defineProps} from 'vue';
import DataManager from './data-manager';

const props = defineProps([
  'id',
  'options',
  'tableResponsive',
  'resizeColumn',
  'columns',
  'tableOptions',
  'theadSticky',
  'theadOptions',
]);


// const theme = props.config?.theme ?? 'bootstrap5';

const getClasses = (list) => {
  return list.map((value) => {
    let result = {};
    return result[value] = true;
  })

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

const dataManager = new DataManager(props.columns ?? []);
</script>

<template>
  <div :class="containerClasses">
    <table :class="tableClasses">
      <thead :class="theadClasses">
      <tr>
        <th
            v-for="column of dataManager.columns()"
            v-bind:key="column"
            :data-key="column.key()"
            :data-type="column.type()"
        >
          {{ column.label() }}
          <span v-if="props.resizeColumn ?? false" class="resize-handle"></span>
        </th>
      </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.thead-sticky th {
  position: sticky;
  top: 0;
  background: #6c7ae0;
  text-align: left;
  font-weight: normal;
  font-size: 1.1rem;
  color: white;
}

</style>
