import DBManager from '../managers/DBManager';
import uuid from 'uuid/v4';

const PonysReplyDBSchema = {
  id: {
    type: String,
    hashKey: true
  },
  postId: String,
  parentId: String,
  author: String,
  content: String,
  likeCount: Number,
  createdAt: String,
  updatedAt: String
};

export default class PonysReply extends DBManager {
  id;

  postId;

  parentId;

  author;

  content;

  likeCount;

  createdAt;

  updatedAt;

  constructor(
    id,
    postId,
    parentId,
    author,
    content,
    likeCount = 0,
    createdAt = new Date(),
    updatedAt = new Date()
  ) {
    super('delr-PonysReply', PonysReplyDBSchema);
    this.id = id;
    this.postId = postId;
    this.parentId = parentId;
    this.author = author;
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
    return this.id;
  }

  // eslint-disable-next-line class-methods-use-this
  fromDBResponse(ponysReply) {
    return new PonysReply(
      ponysReply.id,
      ponysReply.postId,
      ponysReply.parentId,
      ponysReply.author,
      ponysReply.content,
      ponysReply.likeCount,
      new Date(ponysReply.createdAt),
      new Date(ponysReply.updatedAt)
    );
  }

  static newPonysReply(postId, parentId, author, content) {
    const id = uuid();
    return new PonysReply(id, postId, parentId, author, content);
  }
}
