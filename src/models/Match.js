import DBManager from '../managers/DBManager';
import uuid from 'uuid/v4';

const matchDBSchema = {
  id: {
    type: String,
    hashKey: true
  },
  userId: String,
  secondUserId: String,
  Accept: Number,
  createdAt: String,
  updatedAt: String
};

export default class Match extends DBManager {
  id;

  userId;

  secondUserId;

  Accept;

  createdAt;

  updatedAt;

  constructor(
    id,
    userId,
    secondUserId,
    Accept = 0,
    createdAt = new Date(),
    updatedAt = new Date()
  ) {
    super('delr-match', matchDBSchema);
    this.id = id;
    this.userId = userId;
    this.secondUserId = secondUserId;
    this.Accept = Accept;
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
  fromDBResponse(match) {
    return new Match(
      match.id,
      match.userId,
      match.secondUserId,
      match.Accept,
      new Date(match.createdAt),
      new Date(match.updatedAt)
    );
  }

  static newMatch(userId, secondUserId) {
    const id = uuid();
    return new Match(id, userId, secondUserId);
  }
}
