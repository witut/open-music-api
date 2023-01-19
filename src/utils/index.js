const mapAlbum = (data) => {
  const album = data.map(({ id, name, year }) => ({
    id,
    name,
    year,
    songs: data.filter(({song_id, title, performer}) => {
      if(song_id){
        return {
          id: song_id,
          title,
          performer,
        }
      };
    }),
  }));

  return album[0];
};

module.exports = mapAlbum;
