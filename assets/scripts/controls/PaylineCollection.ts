import { Events } from "../manager/Events";
import { uiManager } from "../manager/UIManager";
import SelectionControl from "../selection-control/SelectionControl";
import SelectionItem from "../selection-control/SelectionItem";
import GameUtils from "../utils/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PaylineCollection extends SelectionControl {
  private _sprites = {};
  async initItems() {
    const total = uiManager.PACK_TOTAL;
    for (let i = 1; i <= total; i++) {
      const path = `paylines/pack${i}/line-normal`;
      const path2 = `paylines/pack${i}/line-glow`;
      const resource = await GameUtils.loadResource<cc.SpriteFrame>(
        path,
        cc.SpriteFrame
      );
      const resource2 = await GameUtils.loadResource<cc.SpriteFrame>(
        path2,
        cc.SpriteFrame
      );
      if (resource && resource2) {
        const item = this.initItem(i);

        item.getChildByName("line-normal").getComponent(cc.Sprite).spriteFrame =
          resource;
        item.getChildByName("line-glow").getComponent(cc.Sprite).spriteFrame =
          resource2;

        this._sprites[i] = [resource, resource2];
        const selectionItem = item.getComponent(SelectionItem);
        this.items.push(selectionItem);
      }

      this.items.length && this.items[0].setSelected(true);
    }
  }
  emitEventSelected(id: number) {
    uiManager.emit(Events.UPDATE_PAYLINE, this._sprites[id]);
  }
}
