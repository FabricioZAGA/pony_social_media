import uuid from 'uuid/v4';
import DBManager from '../managers/DBManager';

const postsDBSchema = {
  id_authorpony: {
    type: String,
    hashKey: true
  },
  authorpony: String,
  title: String,
  content: String,
  likeCount: Number,
  createdAt: String,
  updatedAt: String
};

export default class Ponys extends DBManager {
  id_authorpony;

  authorpony;

  title;

  content;

  likeCount;

  createdAt;

  updatedAt;

  constructor(
    id_authorpony,
    authorpony,
    title,
    content,
    likeCount = 0,
    updatedAt = new Date(),
    createdAt = new Date()
  ) {
    super('ponys-primorosos', postsDBSchema);
    this.id_authorpony = id_authorpony;
    this.authorpony = authorpony;
    this.title = title;
    this.content = content;
    this.likeCount = likeCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toDBFormat() {
    return {
      ...this,
      updatedAt: this.updatedAt.toString(),
      createdAt: this.createdAt.toString()
    };
  }

  getKey() {
    return this.id_authorpony;
  }

  // eslint-disable-next-line class-methods-use-this
  fromDBResponse(ponys) {
    return new Ponys(
        ponys.id_authorpony,
        ponys.authorpony,
        ponys.title,
        ponys.content,
        ponys.likeCount,
      new Date(ponys.updatedAt),
      new Date(ponys.createdAt)
    );
  }

  static newPost(authorpony, title, content) {
    const id_authorpony = uuid();
    return new Ponys(id_authorpony, authorpony, title, content);
  }
}
