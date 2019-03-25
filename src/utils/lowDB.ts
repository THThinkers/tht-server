import low, { LowdbAsync } from 'lowdb';
import FileSync from 'lowdb/adapters/FileAsync';
import { IImageBucket } from '../schema/ImageBucket';

const adapter = new FileSync('./db.json');

class LowDB {
  public db!: LowdbAsync<IImageBucket>;
  public connect = async () => {
    try {
      this.db = await low(adapter);
    } catch (err) {
      console.error(err);
    }
  }
}

const db = new LowDB();
export default db;
