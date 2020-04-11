import firebase from "firebase";
import "firebase/firestore";
import { BatchUpdate, GameId } from "../../types";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  db: any;

  constructor() {
    firebase.initializeApp(config);
    this.db = firebase.firestore();
  }

  async create(collection: string, data: any): Promise<GameId> {
    try {
      const { id } = await this.db.collection(collection).add(data);
      return id;
    } catch (e) {
      console.log("error!", e);
    }
  }

  async get(collection: string, document: string): Promise<any> {
    try {
      const doc = await this.db.collection(collection).doc(document).get();
      if (doc.exists) {
        return doc.data();
      } else {
        return null;
      }
    } catch (e) {
      console.log("error in get", e);
    }
  }

  async updateData(
    collection: string,
    document: string,
    data: any
  ): Promise<any> {
    return await this.db.collection(collection).doc(document).update(data);
  }

  async batchModifyData(updates: Array<BatchUpdate>): Promise<void> {
    let batch = this.db.batch();
    updates.forEach((u) => {
      const ref = this.db.collection(u.collection).doc(u.data);
      switch (u.action) {
        case "update":
          batch.update(ref, u.data);
          break;
        case "delete":
          batch.delete(ref);
          break;
        case "set":
          batch.set(ref, u.data);
      }
    });
    await batch.commit();
  }

  async listenToCollection(
    collection: string,
    handle: (c: any) => any
  ): Promise<any> {
    return await this.db.collection(collection).onSnapshot(function (c: any) {
      handle(c);
    });
  }

  async listenToDocument(
    collection: string,
    document: string,
    handle: (c: any) => any
  ): Promise<any> {
    return await this.db
      .collection(collection)
      .doc(document)
      .onSnapshot(function (c: any) {
        handle(c);
      });
  }
}

const store = new Firebase();

export default store;
