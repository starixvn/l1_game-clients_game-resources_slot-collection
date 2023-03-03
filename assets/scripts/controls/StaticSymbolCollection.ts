import { Events } from "../manager/Events";
import { uiManager } from "../manager/UIManager";
import SelectionControl from "../selection-control/SelectionControl";
import GameUtils from "../utils/GameUtils";
import StaticSymbolColectionRow from "./StaticSymbolColectionRow";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StaticSymbolCollection extends SelectionControl {
  key = "letter-symbols";

  private _collectionData = {};
  private selectionItemDict = {};

  async initItems() {
    const allData = cc.resources.getDirWithPath(this.key, cc.SpriteFrame);
    let currentIndex: number;
    for (const key of Object.keys(allData)) {
      const data = allData[key];
      const path: string = data.path;
      const temp = path.split("/");
      const packIndex = +temp[1];

      if (currentIndex === undefined || currentIndex !== packIndex) {
        currentIndex = packIndex;
        const item = this.initItem(packIndex);

        const selectionItem = item.getComponent(StaticSymbolColectionRow);
        this.selectionItemDict[packIndex] = selectionItem;
        this.pushItem(selectionItem);
        this._collectionData[packIndex] = selectionItem.nodes;
      }

      const spriteData = await GameUtils.loadResource<cc.SpriteFrame>(
        path,
        cc.SpriteFrame
      );
      if (spriteData) {
        const symbolData = { symbol: spriteData, path };
        (
          this.selectionItemDict[packIndex] as StaticSymbolColectionRow
        ).addSymbol(symbolData);
      }
    }

    this.items.length && this.items[0].setSelected(true);
  }
  emitEventSelected(id: number) {
    uiManager.emit(Events.UPDATE_MULTI_SYMBOLS, this._collectionData[id]);
  }
}
