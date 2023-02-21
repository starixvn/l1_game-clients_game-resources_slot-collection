import { Events } from "../manager/Events";
import { uiManager } from "../manager/UIManager";
import SelectionControl from "../selection-control/SelectionControl";
import GameUtils from "../utils/GameUtils";
import StaticSymbolColectionRow from "./StaticSymbolColectionRow";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StaticSymbolCollection extends SelectionControl {
  key = "static-symbols";

  arrPack = [1, 2, 3, 20, 125];

  private staticSymbol = 6;

  private _nodes = {};

  async initItems() {
    const total = uiManager.PACK_TOTAL;
    const symbolCount = 15;
    for (const i of this.arrPack) {
      const spriteFrames = [];
      for (let j = 0; j < this.staticSymbol; j++) {
        const path = `${this.key}/pack${i}/symbol-${j}`;
        const spriteData = await GameUtils.loadResource<cc.SpriteFrame>(
          path,
          cc.SpriteFrame
        );
        if (spriteData) {
          spriteFrames.push(spriteData);
        }
      }

      //this._skeletons[i] = skeletons;
      const item = this.initItem(i);

      const selectionItem = item.getComponent(StaticSymbolColectionRow);
      selectionItem.addSymbols(spriteFrames);
      this.items.push(selectionItem);
    }
    this.items.length && this.items[0].setSelected(true);
  }
  emitEventSelected(id: number) {
    uiManager.emit(Events.UPDATE_MULTI_SYMBOLS, this._nodes[id]);
  }
}
