// hls.service.ts
import { Injectable } from '@nestjs/common';
import * as express from 'express';
import * as ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class HlsService {
  startServer(rtmpInputUrl: string, outputDirPath: string, port: number): void {
    const app = express();

    app.use(express.static(outputDirPath));

    ffmpeg(rtmpInputUrl)
      .outputOptions([
        '-hls_time 10',      // Segment duration in seconds
        '-hls_list_size 6',  // Maximum number of playlist entries
        '-hls_wrap 10',      // Number of HLS wrap-around files
        '-start_number 1'    // Start number for HLS segment filenames
      ])
      .output(`${outputDirPath}/index.m3u8`)
      .on('error', (err) => {
        console.error('Error generating HLS:', err.message);
      })
      .on('end', () => {
        console.log('HLS streaming started');
      })
      .run();

    app.listen(port, () => {
      console.log(`HLS server running on port ${port}`);
    });
  }
}
