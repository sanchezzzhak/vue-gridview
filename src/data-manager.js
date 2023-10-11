
import Column from '@/column';

export default class DataManager
{
  #columns = {};

  constructor(columns) {
    this.#initColumns(columns);
  }

  #initColumns(columns){
    for(let key in columns){
      const column = new Column(columns[key])
      this.#columns[column.key()] = column;
    }
  }

  columns() {
    return this.#columns;
  }

}