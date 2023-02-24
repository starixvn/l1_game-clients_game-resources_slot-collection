import * as _ from "lodash";

const Emitter = require("tiny-emitter");
interface EmitterStorageType {
  eventName: string;
  callback: (param?) => void;
}
export default class UIManager {
  static _instance: UIManager;
  static get Instance(): UIManager {
    if (this._instance == null) {
      this._instance = new UIManager();
      this._instance.init();
    }
    return this._instance;
  }

  private emitterStorages: EmitterStorageType[] = [];
  private emitter: Emitter;

  public PACK_TOTAL = 140;

  public selectedSymbolIndex = 0;

  init() {
    this.emitter = new Emitter();
  }

  emit(type: string, data: any) {
    console.log("emiter " + type, data);
    this.emitter.emit(type, data);
  }

  emitterListener(eventName: string, callback: (param?) => void) {
    const storage = {
      eventName,
      callback,
    };
    this.emitter.on(eventName, storage.callback);
    this.emitterStorages.push(storage);
  }

  removeEmitterListener(eventName: string) {
    const callbacks = _.remove(
      this.emitterStorages,
      (storage) => storage.eventName === eventName
    ).map((storage) => storage.callback);
    callbacks.forEach((callback) => {
      this.emitter.removeListener(eventName, callback);
    });
  }
}

export const uiManager = UIManager.Instance;
