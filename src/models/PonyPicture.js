import uuid from 'uuid/v4';
import DBManager from '../managers/DBManager';

const postsDBSchema = {
  id: {
    type: String,
    hashKey: true
  },
  ponyId: String,
  imageUrl: String,
  updatedAt: String
};

export default class PonyPicture extends DBManager {
  id;

  ponyId;

  imageUrl;

  updatedAt;

  constructor(
    id,
    ponyId,
    imageUrl,
    updatedAt = new Date()
  ) {
    super('pony-pictures', postsDBSchema);
    this.id = id;
    this.ponyId = ponyId;
    this.imageUrl = imageUrl;
    this.updatedAt = updatedAt;
  }

  toDBFormat() {
    return {
      ...this,
      updatedAt: this.updatedAt.toString()
    };
  }

  getKey() {
    return this.id;
  }

  // eslint-disable-next-line class-methods-use-this
  fromDBResponse(ponyPicture) {
    return new PonyPicture(
      ponyPicture.id,
      ponyPicture.ponyId,
      ponyPicture.imageUrl,
      new Date(ponyPicture.updatedAt)
    );
  }

  static newImage(ponyId, imageUrl) {
    const id = uuid();
    return new PonyPicture(id, ponyId, imageUrl);
  }
}
