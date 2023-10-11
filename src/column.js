

export default class Column
{
   #key;
   #type;
   #label;

   constructor(config) {
      this.#key = config.key;
      this.#type = config.type;
      this.#label = config.label;
   }

   label() {
      return this.#label;
   }

   type() {
      return this.#type;
   }

   key() {
      return this.#key;
   }
}