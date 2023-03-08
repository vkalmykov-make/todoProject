//import { Sequelize } from "sequelize";
import "dotenv/config";
import { Error } from "mongoose";
import pg from "pg";
//import { INSERT } from "sequelize/types/query-types.js";
import { Storage } from "../storage.js";
const { Pool } = pg;

export class postgreSQL extends Storage {
  constructor() {
    super();
    try {
      this.instance = new Pool({
        //Client
        host: process.env.DB_PSQL_HOST,
        port: process.env.DB_PSQL_PORT,
        database: process.env.NAME,
        user: process.env.DB_PSQL_USER,
        password: process.env.DB_PSQL_PASSWORD,
      });
      this.instance
        .connect()
        .then(() => console.log("Postgres connected"))
        .catch((err) => console.error("connection error", err.stack));
    } catch (error) {
      console.log(`This error: ${error}. And ${error.message}`);
    }
  }

  async getItems(taskName, description1, sort) {
    try {
      let query = "SELECT * FROM task";
      const params = [];

      if (taskName && !description1) {
        query = "SELECT * FROM task WHERE task LIKE $1";
        params.push(`%${taskName}%`);
      } else if (description1 && !taskName) {
        query = "SELECT * FROM task WHERE description LIKE $1";
        params.push(`%${description1}%`);
      } else if (description1 && taskName) {
        query = "SELECT * FROM task WHERE task LIKE $1 AND description LIKE $2";
        params.push(`%${taskName}%`, `%${description1}%`);
      }

      if (sort) {
        for (const obj in sort) {
          if (sort[obj] === 1) {
            query += ` ORDER BY ${obj} ASC`;
          } else if (sort[obj] === -1) {
            query += ` ORDER BY ${obj} DESC`;
          }
        }
      }

      const res = await this.instance.query(query, params);
      const data = res.rows;
      return data;
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async filterItems(query, sort) {
    try {
      let data = "SELECT * FROM task";
      let filter = [];
      if (query) {
        data += ` WHERE`;

        for (const key in query) {
          query[key].forEach((item) => {
            for (const objKey in item) {
              data += ` ${objKey} = $${filter.length + 1} ${key}`;
              filter.push(item[objKey]);
            }
            data += ``;
          });
        }

        data = data.substring(0, data.length - 3);
      }

      if (sort) {
        for (const obj in sort) {
          if (sort[obj] === 1) {
            data += ` ORDER BY ${obj} ASC`;
          } else if (sort[obj] === -1) {
            data += ` ORDER BY ${obj} DESC`;
          }
        }
      }

      const res = await this.instance.query(data, filter);
      return res.rows;
    } catch (error) {
      console.log(error);
    }
  }

  async getItemById(id) {
    try {
      let data = "SELECT * FROM task WHERE id = $1";
      const params = [id];

      const res = await this.instance.query(data, params);
      if (res.rows.length > 0) {
        return res.rows[0];
      } else {
        throw new Error(`No item found with id ${id}`);
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch item by id");
    }
  }

  async setItems(author, task, description) {
    try {
      const queryText =
        "INSERT INTO task (task, author, description) VALUES ($1, $2, $3) RETURNING *";
      const queryValues = [task, author, description];
      const item = await this.instance.query(queryText, queryValues);
      return item.rows;
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  async updateItem(id, {author, task, description}) {
    try {
      // Validate input parameters
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid id parameter');
      }
  
      // Get the current item from the database
      const currentItem = await this.instance.query(
        'SELECT * FROM task WHERE id = $1',
        [id]
      );
  
      // Merge the existing item with the updated fields
      const updatedItem = {
        ...currentItem.rows[0],
        ...(author && { author }),
        ...(task && { task }),
        ...(description && { description }),
      };
  
      // Update the item in the database
      const sql =
        'UPDATE task SET task = $1, description = $2, author = $3 WHERE id = $4';
      const values = [updatedItem.task, updatedItem.description, updatedItem.author, id];
      const result = await this.instance.query(sql, values);
      console.log(`Updated ${result.rowCount} rows`);
  
      // Return the updated item
      return updatedItem;
    } catch (error) {
      console.error(`Error updating task with id ${id}: ${error.message}`);
      throw error;
    }
  }
  
  

  async deleteItem(id) {
    try {
      let data = "DELETE FROM task WHERE id = $1 ";
      const check = `SELECT EXISTS(SELECT 1 FROM task WHERE id = $1) AS "exists"`;
      const query = [id];
      await this.instance.query(data, query);
      const res = await this.instance.query(check, query);
      return res.rows;
    } catch (error) {
      console.log(error);
      throw new Error("Something goes wrong");
    }
  }

  async createAuthor(firstname, lastname) {
    try {
      let data =
        "INSERT INTO author (firstname, lastname) VALUES ($1, $2) RETURNING *";
      const query = [firstname, lastname];
      const res = await this.instance.query(data, query);
      return res.rows;
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}
