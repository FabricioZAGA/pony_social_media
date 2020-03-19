import uuid from 'uuid/v4';
import DBManager from '../managers/DBManager';

const usersDBSchema = {
  id: {
    type: String,
    hashKey: true
  },
  ponyName: String,
  ponyFirstLastName: String,
  ponySeccondtLastName: String,
  ponyRazetLastName: String,
  ponyPassword: String,
  createdAt: String,
  updatedAt: String
};

export default class Users extends DBManager {
  id;

  ponyName;

  ponyFirstLastName;

  ponySeccondtLastName;

  ponyRazetLastName;

  ponyPassword;

  createdAt;

  updatedAt;

  constructor(
    id,
    ponyName,
    ponyFirstLastName,
    ponySeccondtLastName,
    ponyRazetLastName,
    ponyPassword,
    createdAt = new Date(),
    updatedAt = new Date()
  ) {
    super('delr-users', usersDBSchema);
    this.id = id;
    this.ponyName = ponyName;
    this.ponyFirstLastName = ponyFirstLastName;
    this.ponySeccondtLastName = ponySeccondtLastName;
    this.ponyRazetLastName = ponyRazetLastName;
    this.ponyPassword = ponyPassword;
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
  fromDBResponse(users) {
    return new Users(
      users.id,
      users.ponyName,
      users.ponyFirstLastName,
      users.ponySeccondtLastName,
      users.ponyRazetLastName,
      users.ponyPassword,
      new Date(users.createdAt),
      new Date(users.updatedAt)
    );
  }

  static newUsers(
    ponyName,
    ponyFirstLastName,
    ponySeccondtLastName,
    ponyRazetLastName,
    ponyPassword
  ) {
    const id = uuid();
    return new Users(
      id,
      ponyName,
      ponyFirstLastName,
      ponySeccondtLastName,
      ponyRazetLastName,
      ponyPassword
    );
  }
}
