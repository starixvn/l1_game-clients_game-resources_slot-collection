import { Events } from "../manager/Events";
import { uiManager } from "../manager/UIManager";
import SelectionControl from "../selection-control/SelectionControl";
import GameUtils from "../utils/GameUtils";
import SimpleCollectionItem from "./SimpleCollectionItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BackgroundCollection extends SelectionControl {
  private folders = {};

  private collectionData = {};
  async initItems() {
    const allData = cc.resources.getDirWithPath("audios", cc.AudioClip);
    for (const key of Object.keys(allData)) {
      const data = allData[key];
      const path: string = data.path;
      const temp = path.split("/");
      const folder = temp[0] + "/" + temp[1];
      const filename = temp[2];

      this.folders[folder] = this.folders[folder] || {};
      this.folders[folder][filename] = path;
    }

    let index = 0;

    for (const key of Object.keys(this.folders)) {
      const folder = this.folders[key];
      const item = this.initItem(index);

      const selectionItem = item.getComponent(SimpleCollectionItem);
      selectionItem.setNameLabel(key);
      this.pushItem(selectionItem);
      this.collectionData[index] = { audio: {}, path: "" };
      for (const filename of Object.keys(folder)) {
        const path = folder[filename];
        const audio = await GameUtils.loadResource<cc.AudioClip>(
          path,
          cc.AudioClip
        );

        this.collectionData[index]["audio"][filename] = audio;
        this.collectionData[index]["path"] = key;
      }

      index++;
    }
  }

  emitEventSelected(id: number) {
    const data = this.collectionData[id];

    uiManager.emit(Events.UPDATE_AUDIO_PACK, data);
  }
}
