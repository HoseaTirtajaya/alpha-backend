import * as express from 'express';
import * as path from 'path';
import { WaveJS, Logger } from '@wave.js/wave.js';

export function startServer(): void {
  const app = express();
  const server = new WaveJS();
  const port = 8000;

  app.use(express.static(path.join(__dirname, '../assets/dist')));
  app.use(express.static(path.join(__dirname, '../assets/frontend')));

  server.updateMediaDir(path.join(__dirname, 'media'));
  server.updateOutputProtocol('hls');
  server.updateHLSOutput({ hlsListSize: 0 });
  server.updateOutputSettings({ endpoint: 'wavejs', port: 3000 });

  server.listen();
}