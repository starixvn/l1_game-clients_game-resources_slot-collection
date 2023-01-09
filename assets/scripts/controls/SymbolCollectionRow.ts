import SelectionItem from "../selection-control/SelectionItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SymbolCollectionRow extends SelectionItem {
  private content: cc.Node;
  private itemSample: cc.Node;

  onLoad() {
    this.content = this.node.getChildByName("content");
    this.itemSample = this.node.getChildByName("item-sample");
    super.onLoad();
  }

  addSymbols(skeletons: sp.SkeletonData[]) {
    skeletons.forEach((skeleton) => {
      const node = cc.instantiate(this.itemSample);
      node.active = true;
      this.content.addChild(node);
      const iconNode = node.getChildByName("icon");
      const spine = iconNode.getComponent(sp.Skeleton);
      spine.skeletonData = skeleton;
      iconNode.scale = this.itemSample.width / iconNode.width;
      spine.setAnimation(0, "idle", true);
    });
  }
}
