const { SongPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const SongValidator = {
  validateSongPayload: (paylod) => {
    const validationResult = SongPayloadSchema.validate(paylod);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongValidator;
