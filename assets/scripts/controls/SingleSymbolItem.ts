import StandardSlotReelItem from "../board/StandardSlotReelItem";
import SelectionItem from "../selection-control/SelectionItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SingleSymbolItem extends SelectionItem {
  @property(StandardSlotReelItem)
  reelItem: StandardSlotReelItem = null;
}
