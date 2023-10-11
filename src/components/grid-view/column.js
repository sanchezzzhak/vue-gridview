

export default class Column
{
   #key;
   #type;
   #label;
   #index;

   constructor(config, index) {
      this.#key = config.key;
      this.#type = config.type;
      this.#label = config.label;
      this.#index = index;
   }

   label() {
      return this.#label;
   }

   type() {
      return this.#type;
   }

   index() {
    return this.#index;
   }

   key() {
      return this.#key;
   }

   render(row) {
      return row[this.key()] ?? '';
   }
}