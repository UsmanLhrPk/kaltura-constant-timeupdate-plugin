import { registerPlugin } from '@playkit-js/kaltura-player-js';
import { pluginName, ConstantTimeupdate } from './constant-timeupdate';

console.log(registerPlugin(pluginName, ConstantTimeupdate));

export * from './types';
