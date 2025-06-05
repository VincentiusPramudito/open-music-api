class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  postAlbumHandler = async (request, h) => {
    this._validator.validateAlbumPayload(request.payload);

    const id = await this._service.addAlbum(request.payload);
    const response = h.response({
      status: 'success',
      message: 'Album added successfully',
      data: {
        albumId: id
      }
    });
    response.code(201);
    return response;
  }

  getAlbumByIdHandler = async (request) => {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album
      }
    }
  }

  putAlbumByIdHandler = async (request) => {
    this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album updated successfully'
    }
  }

  deleteAlbumByIdHandler = async (request) => {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
  
    return {
      status: 'success',
      message: 'Album deleted successfully'
    }
  }
}

module.exports = AlbumsHandler;