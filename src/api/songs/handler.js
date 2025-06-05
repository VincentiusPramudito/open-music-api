class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  postSongHandler = async (request, h) => {
    this._validator.validateSongPayload(request.payload);
    
    const id = await this._service.addSong(request.payload);
    const response = h.response({
      status: 'success',
      message: 'Song Added Successfully',
      data: {
        songId: id
      }
    });
    response.code(201);
    return response;
  }

  getSongsHandler = async () => {
    const songs = await this._service.getSongs();
    return {
      status: 'success',
      data: {
        songs
      }
    }
  }

  getSongByIdHandler = async (request) => {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return {
      status: 'success',
      data: {
        song
      }
    }
  }

  putSongByIdHandler = async (request) => {
    this._validator.validateSongPayload(request.payload);

    const { id } = request.params;
    await this._service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Song updated successfully'
    }
  }

  deleteSongByIdHandler = async (request) => {
    const { id } = request.params;
    
    await this._service.deleteSongById(id)
    return {
      status: 'success',
      message: 'Song deleted successfully'
    }
  }
}

module.exports = SongsHandler;