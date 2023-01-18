const { AlbumPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AlbumValidator = {
  validateAlbumPayload: (paylod) => {
    const validationResult = AlbumPayloadSchema.validate(paylod);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumValidator;
