import { MongoStorage } from "./db/mangoDB-storage.js";
import { MapStorage } from "./db/map-storage.js";
import { postgreSQL } from "./db/postgreSQL-storage.js";

export class StorageProvider {
  static getInstance(type) {
    switch (type) {
      case "map":
        return new MapStorage();
      case "mongo":
        return new MongoStorage();
      case "postgres":
        return new postgreSQL();
      default:
        throw new Error("unknown type");
    }
  }
}
