<script setup>

import {defineProps, reactive, computed} from 'vue';

const props = defineProps([
  'id',
  'tableResponsive',
  'tableResponsiveMobile',
  'theadSticky',
  'resizeColumn',
  'containerOptions',
  'tableOptions',
  'theadOptions',
  'columns',
  'data',
  'page',
  'pageSize',
  'pageTotal',
]);

const getClasses = (list) => {
  let result = {};
  list.forEach((value) => {
    result[value] = true;
  });
  return result;
};

function columnKey(column) {
  return column.key;
}

function columnType(column) {
  return column.type;
}

function columnLabel(column) {
  return column.label;
}

function columnCell(column, row) {
  return row[column.key] ?? '';
}

function columnSortType(column) {
  return column.sortType ?? '';
}

const table = reactive({
  data: props.data,
  columns: props.columns
})

const setting = reactive({
  order: null,
  pagination: {
    page: props.page,
    size: props.pageSize,
    max: computed(() => {
      if (props.pageTotal <= 0) {
        return 0;
      }
      let maxPage = Math.floor(props.pageTotal / setting.pagination.size);
      if (props.pageTotal % setting.pagination.size > 0) {
        maxPage++;
      }
      return maxPage;
    }),
    offset: computed(() => {
      return (setting.pagination.page - 1) * setting.pagination.size + 1;
    }),
    limit: computed(() => {
      let limit = setting.pagination.page * setting.pagination.size;
      return props.pageTotal >= limit ? limit : props.pageTotal;
    }),
  },
});

const rows = computed(() => {
  let rows = table.data;
  let columns = table.columns;

  const sorts = [];

  const sortLexically = (p, d = 1) => (a, b) => d * a[p].localeCompare(b[p]);
  const sortNumerically = (p, d = 1) => (a, b) => d * (a[p] - b[p]);
  const sortBy = sorts => (a, b) => sorts.reduce((r, s) => r || s(a, b), 0);

  columns.forEach((column) => {
    let key = columnKey(column);
    let type = columnType(column);
    let sort = columnSortType(column);

    if (sort !== 'none' && sort !== '') {
      if (sort === 'desc') {
        sorts.push(
            type !== 'numeric'
                ? sortLexically(key, -1)
                : sortNumerically(key, -1),
        );
      } else if (sort === 'asc') {
        sorts.push(
            type !== 'numeric'
                ? sortLexically(key)
                : sortNumerically(key),
        );
      }
    }
  });

  return sorts.length > 0
      ? rows.sort(sortBy(sorts))
      : rows;
});



const containerClasses = {
  'table-responsive': props.tableResponsive ?? false,
  'table-responsive-mobile': props.tableResponsiveMobile ?? false,
  ...getClasses(props.containerOptions?.class ?? []),
};

const tableClasses = {
  'table': true,
  ...getClasses(props.tableOptions?.class ?? []),
};

const theadClasses = {
  'thead-sticky': props.theadSticky ?? false,
  ...getClasses(props.theadOptions?.class ?? []),
};

function onClickSort(column){
  if (!column.sortable) {
    return;
  }

  const sorts = {
    'none' : 'asc',
    'asc': 'desc',
    'desc': 'none'
  };
  column.sortType = sorts[column.sortType] ?? 'none';


}


</script>

<template>
  <div :class="containerClasses">
    <div v-if="isLoading" class="gridview-loading-mask">
      <div class="vtl-loading-content">
        <span style="color: white">Loading...</span>
      </div>
    </div>
    <table :class="tableClasses">
      <thead :class="theadClasses">
      <tr>
        <th
            v-for="(column,index) of table.columns"
            v-bind:key="column"
            :data-key="columnKey(column)"
            :data-index="index"
            :data-type="columnType(column)"
            scope="col"
            :class="[{
                sortable: column.sortable,
            }]"
            :data-sort-dir="columnSortType(column)"
        >
          <a @click.prevent="onClickSort(column)">{{ columnLabel(column) }}</a>
          <span v-if="resizeColumn ?? false" class="resize-handle"></span>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row of rows" v-bind:key="row">
        <td v-for="(column,index) of table.columns"
            v-bind:key="column"
            :data-key="columnKey(column)"
            :data-label="columnLabel(column)"
            :scope="index === 0 ? 'row': void 0"
        >{{ columnCell(column, row) }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
th[data-sort-dir="desc"].sortable:after {
  content: "\25bc";
  font-size: 0.7em;
  padding-left: 3px;
  line-height: 0.7em;

}
th[data-sort-dir="asc"].sortable:after {
  content: "\25b2";
  font-size: 0.7em;
  padding-left: 3px;
  line-height: 0.7em;
}

.thead-sticky th {
  position: sticky;
  top: 0;
  font-weight: normal;
  font-size: 1.1rem;
}

@media screen and (max-width: 600px) {
  table {
    border: 0;
  }

  table caption {
    font-size: 1.3em;
  }

  .table-responsive-mobile table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  .table-responsive-mobile table tr {
    border-bottom: 3px solid #ddd;
    display: block;
  }

  .table-responsive-mobile table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: .8em;
    text-align: right;
  }

  .table-responsive-mobile table td::before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }

  .table-responsive-mobile table td:last-child {
    border-bottom: 0;
  }
}

</style>
