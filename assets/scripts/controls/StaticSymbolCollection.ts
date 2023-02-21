import { Events } from "../manager/Events";
import { uiManager } from "../manager/UIManager";
import SelectionControl from "../selection-control/SelectionControl";
import GameUtils from "../utils/GameUtils";
import StaticSymbolColectionRow from "./StaticSymbolColectionRow";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StaticSymbolCollection extends SelectionControl {
  key = "letter-symbols";

  arrPack = [1, 3];

  private staticSymbol = 6;

  private _nodes = {};

  async initItems() {
    const total = uiManager.PACK_TOTAL;
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

      const item = this.initItem(i);
      const selectionItem = item.getComponent(StaticSymbolColectionRow);
      selectionItem.addSymbols(spriteFrames);
      this.items.push(selectionItem);

      this._nodes[i] = selectionItem.nodes;
    }
    this.items.length && this.items[0].setSelected(true);
  }
  emitEventSelected(id: number) {
    uiManager.emit(Events.UPDATE_MULTI_SYMBOLS, this._nodes[id]);
  }
}
