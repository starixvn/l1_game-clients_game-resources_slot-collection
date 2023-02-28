import { Events } from "../manager/Events";
import { uiManager } from "../manager/UIManager";
import SelectionControl from "../selection-control/SelectionControl";
import GameUtils from "../utils/GameUtils";
import SpinButtonViewItem from "./SpinButtonViewItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpinButtonCollection extends SelectionControl {
  private folders = {};

  private collectionData = {};
  async initItems() {
    const allData = cc.resources.getDirWithPath("spin-buttons", cc.SpriteFrame);
    for (const key of Object.keys(allData)) {
      const data = allData[key];
      const path: string = data.path;
      const temp = path.split("/");
      const folder = temp[1];
      const filename = temp[2];

      this.folders[folder] = this.folders[folder] || {};
      this.folders[folder][filename] = path;
    }

    let index = 0;

    for (const key of Object.keys(this.folders)) {
      const folder = this.folders[key];
      const item = this.initItem(index);

      const selectionItem = item.getComponent(SpinButtonViewItem);
      this.items.push(selectionItem);
      this.collectionData[index] = {};
      for (const filename of Object.keys(folder)) {
        const path = folder[filename];
        const data = await GameUtils.loadResource<sp.SkeletonData>(
          path,
          sp.SkeletonData
        );

        this.collectionData[index] = data;
        selectionItem.setSkeleton(data);
      }

      index++;
    }
  }

  emitEventSelected(id: number) {
    uiManager.emit(Events.UPDATE_SPIN_BUTTON, this.collectionData[id]);
  }
}
