<script setup>

import {defineProps, reactive, computed, ref} from 'vue';

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
  'pageTotal'
]);

let isLoading = ref(false);

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
    page: props.page || 1,
    size: props.pageSize || 25,
    pages: computed(()=> {
      let currentPage = setting.pagination.page;
      let maxPage = setting.pagination.max;
      let startPage = currentPage - 2 <= 0 ? 1 : currentPage - 2;
      if (maxPage - currentPage <= 2) {
        startPage = maxPage - 4;
      }
      startPage = startPage <= 0 ? 1 : startPage;
      const pages = [];
      for (let i = startPage, l = maxPage; i <= l; i++) {
        if (pages.length < 5) {
          pages.push(i);
        }
      }
      return pages;
    }),
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

  rows =  sorts.length > 0
      ? rows.sort(sortBy(sorts))
      : rows;
  return rows;
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
          <a @click.stop="onClickSort(column)">{{ columnLabel(column) }}</a>
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

    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: setting.pagination.page <= 1 }">
          <a class="page-link" href="#" aria-label="Previous" @click.prevent="setting.pagination.page = 1">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">First</span>
          </a>
        </li>
        <li
            v-for="n in setting.pagination.pages"
            :key="n"
            :class="{ disabled: setting.pagination.page === n }"
            class="page-item"><a class="page-link" href="#">{{ n }}</a></li>

        <li class="page-item"
            :class="{ disabled: setting.pagination.page >= setting.pagination.max }">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Last</span>
          </a>
        </li>
      </ul>
    </nav>

  </div>
</template>

<style>

.gridview-loading-mask {
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-flow: column;
  transition: opacity 0.3s ease;
}

th a {
  cursor: pointer;
}

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
