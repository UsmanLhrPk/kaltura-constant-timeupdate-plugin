import { BasePlugin, KalturaPlayer } from '@playkit-js/kaltura-player-js';
import { ConstantTimeupdatePluginConfig } from './types';
import { FakeEvent } from '@playkit-js/playkit-js';

export const pluginName = 'constantTimeupdate';

export class ConstantTimeupdate extends BasePlugin {
  private timeHandler: any;
  private currentTime: any;
  private lastTime: any;

  protected static defaultConfig: ConstantTimeupdatePluginConfig = {
    interval: 1000,
    roundFn: Math.round
  };

  constructor(name: string, player: KalturaPlayer, config = {}) {
    super(name, player, config);
    this.addBindings();
  }

  public static isValid(): boolean {
    return true;
  }

  public loadMedia(): void {
    this.addBindings();
  }

  public reset(): void {
    this.clear();
  }

  public destroy(): void {
    this.clear();
  }

  private addBindings(): void {
    this.playListener();
    this.pauseLintener();
    this.endedLintener();
  }

  private playListener(): void {
    this.eventManager.listen(this.player, this.player.Event.Core.PLAY, () => {
      this.clear();

      this.currentTime = this.config.roundFn(this.player.currentTime);
      this.timeHandler = setInterval(() => {
        this.currentTime = this.config.roundFn(this.player.currentTime);
        if (this.lastTime !== this.currentTime) {
          this.player.dispatchEvent(new FakeEvent('constant-timeupdate', { currentTime: this.currentTime }));
          this.lastTime = this.currentTime;
        }
      }, this.config.interval);

      if (this.lastTime !== this.currentTime) {
        this.player.dispatchEvent(new FakeEvent('constant-timeupdate', { currentTime: this.currentTime }));
        this.lastTime = this.currentTime;
      }
    });
  }

  private pauseLintener(): void {
    this.eventManager.listen(this.player, this.player.Event.Core.PAUSE, () => {
      this.clear();
    });
  }

  private endedLintener(): void {
    this.eventManager.listen(this.player, this.player.Event.Core.ENDED, () => {
      this.clear();
    });
  }

  private clear(): void {
    clearInterval(this.timeHandler);
  }
}
