import { uiManager } from "../manager/UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NodeObserver extends cc.Component {
  @property
  eventName = "";

  onLoad() {
    uiManager.emitterListener(this.eventName, this.onEvent.bind(this));
  }

  onEvent(param: any) {}
}
