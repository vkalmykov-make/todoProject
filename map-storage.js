import { createRanNum } from "./randomNumber.js";
import { Storage } from "./types.js";
//MAP storage
export class MapStorage extends Storage {
  constructor() {
    super();
    this.authors = new Map([
      ["12", { Firstname: "Valentin", Lastname: "Ivanov" }],
      ["13", { Firstname: "Grigoriy", Lastname: "Ovalov" }],
    ]);
    this.instance = new Map([
      [
        "1",
        {
          name: "jhello ",
          author: "Abam",
          id: "1",
          task: "BDoImportantThing",
          createdAt: "2022-12-20T20:16:42.542Z",
          modifiedAt: "2022-12-20T20:16:42.542Z",
          description: "first1",
        },
      ],
      [
        "2",
        {
          name: "asd2 ",
          author: "Cigan",
          id: "2",
          task: "ASomeTask",
          createdAt: "2022-12-22T14:19:45.985Z",
          modifiedAt: "2022-12-22T14:19:45.985Z",
          description: "hura",
        },
      ],
      [
        "3",
        {
          name: "asd3 ",
          author: "Bubam",
          id: "4",
          task: "DSomeTask",
          modifiedAt: "2022-12-21T14:20:35.897Z",
          createdAt: "2022-12-21T14:20:35.897Z",
          description: "hura",
        },
      ],
      [
        "4",
        {
          name: "name4 ",
          author: "Digran",
          id: "3",
          task: "CSomeTask",
          modifiedAt: "2022-12-23T20:17:56.806Z",
          createdAt: "2022-12-23T20:17:56.806Z",
          description: "hura",
        },
      ],
    ]);
  }

  getItems(taskName, description1, sort) {
    //sort by autor,date(timestamp),task == asc/des
    let todoDatas = Array.from(this.instance.values());
    let result = JSON.parse(JSON.stringify(todoDatas));
    if (taskName || description1 || sort) {
      let newArr = [];
      if (taskName && description1 === undefined) {
        for (let [key, value] of Object.entries(result)) {
          if (value["task"] == `${taskName}`) {
            newArr.push(key, value);
          }
        }
        return (result = newArr);
      }
      if (description1 && taskName === undefined) {
        for (let [key, value] of Object.entries(result)) {
          if (value["description"] == `${description1}`) {
            newArr.push(key, value);
          }
        }
        return (result = newArr);
      }
      if (description1 && taskName) {
        for (let [key, value] of Object.entries(result)) {
          if (
            value["description"] == `${description1}` &&
            value["task"] == `${taskName}`
          ) {
            newArr.push(key, value);
          }
        }
        return (result = newArr);
      }

      if (sort) {
        if (sort.createdAt === 1) {
          //asc
          result.sort((a, b) => {
            // a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0
            (a = new Date(a.createdAt)), (b = new Date(b.createdAt));
            return a - b;
          });
        }
        if (sort.createdAt === -1) {
          //desc
          result.sort((a, b) => {
            (a = new Date(a.createdAt)), (b = new Date(b.createdAt));
            return b - a;
          });
        }
        if (sort.task === 1)
          result.sort((a, b) => {
            const nameA = a.task.toUpperCase(); // ignore upper and lowercase
            const nameB = b.task.toUpperCase(); // ignore upper and lowercase

            // sort in an ascending order
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
          });
        if (sort.task === -1)
          result.sort((a, b) => {
            const nameA = a.task.toUpperCase();
            const nameB = b.task.toUpperCase(); 

            // sort in an ascending order
            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }

            // names must be equal
            return 0;
          });
      }
      result;
    }
    return Array.from(result);
  }

  filterItems(query, sort) {
    let obj = Array.from(this.instance.values());
    if (!query) {
      return;
    }
    const result = obj.filter((item) => {
      if (query.and && query.and !== undefined) {
        for (let i = 0; i < query.and.length; i++) {
          let flag = true;
          Object.keys(query.and[i]).forEach((key) => {
            if (item[key] !== query.and[i][key]) {
              flag = false;
            }
          });
          if (!flag) {
            return false;
          }
        }
      }
      if (query.or) {
        for (let i = 0; i < query.or.length; i++) {
          let flag2 = false;
          Object.keys(query.or[i]).forEach((key) => {
            if (item[key] == query.or[i][key]) {
              flag2 = true;
            }
          });
          if (!flag2) {
            return false;
          }
        }
      }
      return true;
    });
    if (sort) {
      if (sort.createdAt === 1) {
        //asc
        result.sort((a, b) => {
          (a = new Date(a.createdAt)), (b = new Date(b.createdAt));
          return a - b;
        });
      }
      if (sort.createdAt === -1) {
        //desc
        result.sort((a, b) => {
          (a = new Date(a.createdAt)), (b = new Date(b.createdAt));
          return b - a;
        });
      }
      if (sort.task === 1)
        result.sort((a, b) => {
          const nameA = a.task.toUpperCase(); 
          const nameB = b.task.toUpperCase(); 

          // sort in an ascending order
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });
      if (sort.task === -1)
        result.sort((a, b) => {
          const nameA = a.task.toUpperCase(); 
          const nameB = b.task.toUpperCase();

          // sort in an ascending order
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }

          // names must be equal
          return 0;
        });
    }
    return result;
  }

  getItemById(id) {
    const item = this.instance.get(id);
    return item;
  }

  setItems(author, task) {
    const id = createRanNum().toString();
    this.instance.set(id, {
      author,
      task,
      _id: id,
      modifiedAt: new Date(),
      createdAt: new Date(),
    });
    return this.instance.get(id);
  }

  updateItem(id, params) {
    this.instance.set(id, {
      ...this.instance.get(id),
      ...params,
      modifiedAt: new Date(),
    });

    return this.instance.get(id);
  }

  deleteItem(id) {
    const item = this.instance.delete(id);

    return { success: `${item}` };
  }

  createAuthor(name, surname) {
    const id = createRanNum().toString();
    this.instance.set(id, { name, surname });
    return this.instance.get(id);
  }
}
