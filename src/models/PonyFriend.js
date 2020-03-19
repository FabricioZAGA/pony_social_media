import uuid from 'uuid/v4';
import DBManager from '../managers/DBManager';

const postsDBSchema = {
  id: {
    type: String,
    hashKey: true
  },
  friendOneId: String,
  friendTwoId: String,

  friendshipDate: String
};

export default class PonyFriend extends DBManager {
  id;

  friendOneId;

  friendTwoId;

  friendshipDate;

  constructor(
    id,
    friendOneId,
    friendTwoId,
    friendshipDate = new Date()
  ) {
    super('pony-pictures', postsDBSchema);
    this.id = id;
    this.friendOneId = friendOneId;
    this.friendTwoId = friendTwoId;
    this.friendshipDate = friendshipDate;
  }

  toDBFormat() {
    return {
      ...this,
      friendshipDate: this.friendshipDate.toString()
    };
  }

  getKey() {
    return this.id;
  }

  // eslint-disable-next-line class-methods-use-this
  fromDBResponse(ponyFriend) {
    return new PonyFriend(
      ponyFriend.id,
      ponyFriend.friendOneId,
      ponyFriend.friendTwoId,
      new Date(ponyFriend.friendshipDate)
    );
  }

  static newFriendship(friendOneId, friendTwoId) {
    const id = uuid();
    return new PonyFriend(id, friendOneId, friendTwoId);
  }
}
