export class Storage {
    getItems() {
      throw new Error("Not implemented");
    }
  
    setItems() {
      throw new Error("Not implemented");
    }
  
    getItemById(id) {
      throw new Error("Not implemented");
    }
  
    isEmpty(value) {
      return Boolean(value);
    }
  }