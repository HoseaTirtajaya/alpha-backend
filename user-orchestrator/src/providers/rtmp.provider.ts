import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import * as express from 'express';
import * as ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class RtmpService {
  startServer(): void {
    config();
    const app = express();
    const rtmpPort = process.env.RTMP_PORT || 1935;

    app.use(express.static('/assets/livestreams/'));

    // Handle RTMP stream
    app.all('v1/api/livestream/live/:streamKey', (req, res) => {
      const streamKey = req.params.streamKey;
      const rtmpInputUrl = `rtmp://localhost/v1/api/livestream/live/${streamKey}`;
      const outputDirPath = '/assets/livestreams/';

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
        })
        .on('end', () => {
          console.log('HLS streaming started');
        })
        .run();
      
      res.send('RTMP stream received');
    });

    app.listen(rtmpPort, () => {
      console.log(`RTMP server started on port ${rtmpPort}`);
    });
  }
}
