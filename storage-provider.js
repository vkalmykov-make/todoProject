import { MongoStorage } from './mangoDB-storage.js'
import { MapStorage } from './map-storage.js';

/* export class Storage {
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
} */

export class StorageProvider {
  static getInstance(type) {
    switch (type) {
      case "map":
        return new MapStorage();
      case "mongo":
        return new MongoStorage();
      default:
        throw new Error("unknown type");
    }
  }
}


