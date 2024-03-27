import * as express from 'express';
import * as path from 'path';
import { WaveJS, Logger } from '@wave.js/wave.js';

export function startServer(): void {
  const app = express();
  const server = new WaveJS();
  const port = 8000;

  const updatedMPDSetting = {
    segDuration: 6, // Segment duration in seconds
    fragDuration: 1, // Fragment duration in seconds
    initSegName: 'init_$RepresentationID$.mp4', // Naming pattern for initialization segments
    mediaSegName: 'segment_$RepresentationID$_$Number%05d$.mp4', // Naming pattern for media segments
    ldash: true, // Enable Low Latency DASH mode
    writePrft: true, // Write presentation timestamps in MPD for LL-DASH
    targetLatency: 5, // Target latency in seconds
    dashSegmentType: 'mp4', // Segment type for DASH output
    streaming: true, // Indicate that the output is for streaming
  }

  const updatedHLSSetting = {
      hlsTime: 2, // Segment duration in seconds
      hlsListSize: 3, // Number of segments in the playlist
      hlsStartNumberSource: 'datetime', // Start segment number based on datetime
      hlsPlaylistType: 'event', // HLS playlist type set to 'event'
      httpUserAgent: 'Custom-User-Agent', // Custom HTTP User-Agent header
      timeout: 5000, // Timeout for HTTP requests in milliseconds
  };

  app.use(express.static(path.join(__dirname, '../assets/dist')));
  app.use(express.static(path.join(__dirname, '../assets/frontend')));
  
  server.updateMediaDir(path.join(__dirname, 'media'));
  server.updateHLSOutput(updatedHLSSetting);
  server.updateOutputProtocol('hls');
  server.updateOutputSettings({ endpoint: 'wavejs', port: 3000 });

  server.listen();
}