
import Column from './column';

export default class DataManager
{
  #columns = {};
  #data = [];

  constructor(columns = [], data = []) {
    this.#initColumns(columns);
    this.#initData(data);
  }

  #initColumns(columns){
    let increment = 0;
    for(let key in columns){
      const column = new Column(columns[key], increment++)
      this.#columns[column.key()] = column;
    }
  }

  #initData(data){
    this.#data = data;
  }

  columns() {
    return this.#columns;
  }

  data() {
    return this.#data;
  }

}