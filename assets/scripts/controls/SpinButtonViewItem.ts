import SelectionItem from "../selection-control/SelectionItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SymbolCollectionRow extends SelectionItem {
  setSkeleton(skeleton: sp.SkeletonData) {
    const spine = this.node.getChildByName("spine").getComponent(sp.Skeleton);
    spine.skeletonData = skeleton;
    spine.enableBatch = true;
    spine.setAnimation(0, "idle", true);
  }
}
