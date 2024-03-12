import * as ffmpeg from 'fluent-ffmpeg';

export function RtmpServerExecute(streamKey: string) {
  const rtmpInputUrl = `rtmp://localhost/v1/api/livestream/live/${streamKey}`;
  const outputDirPath = '/assets/livestreams/';

  // Set the path to the ffmpeg executable
  ffmpeg.setFfmpegPath("C:/Program Files (x86)/ffmpeg/ffmpeg-master-latest-win64-gpl/bin");

  ffmpeg(rtmpInputUrl)
    .outputOptions([
      '-c copy',
      '-f hls',
      '-hls_time 10',
      '-hls_list_size 6',
      '-hls_wrap 10',
      '-start_number 1'
    ])
    .output(`${outputDirPath}/${streamKey}.m3u8`)
    .on('error', (err) => {
      console.error('Error generating HLS:', err.message);
      throw new Error('Error processing RTMP stream');
    })
    .on('end', () => {
      console.log('HLS streaming started');
      throw new Error('RTMP stream received and HLS stream started');
    })
    .run();

}
