import React from 'react';

export default ({
  video,
  width='560',
  height='315'
}) => {

  if (!video) return;

  let id;

  if (video.match(/youtu.be/))
    id = video.match(/youtu.be\/([^\/\?]+)/)[1];
  else
    id = video.match(/watch\?v=([^&]*)/)[1];

  return (
    <div className='YoutubeVideo height-100'>
      <iframe
        width={width}
        height={height}
        src={`https://www.youtube.com/embed/${id}`}
        frameBorder='0'
        allowFullScreen>
      </iframe>
    </div>
  );
}
