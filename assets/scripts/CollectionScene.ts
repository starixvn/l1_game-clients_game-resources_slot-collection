import _ = require("lodash");

import LineView from "./board/LineView";
import SlotBoard from "./board/SlotBoard";
import { Events } from "./manager/Events";
import { uiManager } from "./manager/UIManager";
import HoverItemBase from "./utils/HoverItemBase";

const { ccclass, property } = cc._decorator;
export interface LineData {
  payline: number;
  positions: number[];
  symbol: number;
}
@ccclass
export default class CollectionScene extends cc.Component {
  @property(cc.Node)
  collectionNode: cc.Node = null;

  @property({ type: sp.SkeletonData })
  defaultSkeleton: sp.SkeletonData[] = [];

  @property(SlotBoard)
  board: SlotBoard = null;

  @property(cc.Node)
  lineContainer: cc.Node = null;

  @property(cc.Node)
  leftNumberContainer: cc.Node = null;

  @property(cc.Node)
  rightNumberContainer: cc.Node = null;

  @property(cc.Prefab)
  linePrefab: cc.Prefab = null;

  @property(cc.Prefab)
  lightLinePrefab: cc.Prefab = null;

  static symbolsSkeletons: sp.SkeletonData[] = [];
  static winningAnimations: sp.SkeletonData;

  onLoad(): void {
    this.initDefault();
    this.initListeners();

    this.createAllLines();
    this.initEventForNumberContainer();
  }

  start() {
    this.hideCollection();
  }

  setBoardFullItems() {
    const data = [];
    const itemTypeCount = 11;

    for (let i = 0; i < 15; i++) {
      if (i < itemTypeCount) {
        data.push(i);
      } else {
        data.push(_.random(itemTypeCount - 1));
      }
    }

    const shuffleData = _.shuffle(data);
    this.board.setBoardData(shuffleData);
    this.board.applyData(shuffleData);
  }

  async testSpin() {
    const data = [];
    const itemTypeCount = 11;

    for (let i = 0; i < 15; i++) {
      if (i < itemTypeCount) {
        data.push(i);
      } else {
        data.push(_.random(itemTypeCount - 1));
      }
    }

    const shuffleData = _.shuffle(data);
    this.board.setBoardData(shuffleData);
    await this.board.spin(0.75, false);
  }

  showCollection() {
    this.collectionNode.active = true;
    cc.tween(this.collectionNode).to(0.4, { opacity: 255 }).start();
  }

  hideCollection() {
    this.collectionNode.active = true;
    cc.tween(this.collectionNode)
      .to(0.4, { opacity: 0 })
      .call(() => (this.collectionNode.active = false))
      .start();
  }

  initDefault() {
    CollectionScene.symbolsSkeletons.push(...this.defaultSkeleton);

    this.board.initReels();
    this.setBoardFullItems();
  }

  initListeners() {
    uiManager.emitterListener(
      Events.UPDATE_MULTI_SYMBOLS,
      (skeletons: sp.SkeletonData[]) => {
        skeletons.forEach((skeleton, index) => {
          CollectionScene.symbolsSkeletons[index] = skeleton;
        });
        this.board.reloadItems();
      }
    );
  }

  hideAllLines() {
    this.lineContainer.children.forEach((child) => (child.active = false));
  }

  showLine(num: number, show = true) {
    const line = this.lineContainer.getChildByName(`${num}`);
    if (line) {
      line.active = show;
    }
  }

  showLoopWinningLines(winningLines: LineData[]) {
    const length = winningLines.length;
    const timeShowPayline = 1;
    if (length === 0) {
      return;
    }
    let index = 0;
    cc.tween(this)
      .repeatForever(
        cc
          .tween()
          .call(() => {
            if (index === length) {
              index = 0;
            }
            this.hideAllLines();
            // this.hideWinningEffectOnItems();
            const line = winningLines[index];
            this.showLine(line.payline + 1);
            // this.board.showWinningEffect(line.positions, +line.symbol);
            index++;
          })
          .delay(timeShowPayline)
      )
      .start();
  }

  initEventForNumberContainer() {
    const callback = {
      onMove: (e) => {
        this.showLineWhenHover(e);
      },
      onLeave: (e) => {
        this.hideAllLines();
      },
    };
    this.leftNumberContainer.addComponent(HoverItemBase).touchCallback =
      callback;
    this.rightNumberContainer.addComponent(HoverItemBase).touchCallback =
      callback;
  }

  createLineView(child: cc.Node) {
    const node = new cc.Node();
    const view = node.addComponent(LineView);
    view.linePrefab = this.linePrefab;
    view.lightPrefab = this.lightLinePrefab;
    view.board = this.board;
    view.label = child;
    node.name = child.name;
    view.init();
    node.active = false;
    return view;
  }

  createAllLines() {
    [20, 8, 2, 14, 17, 7, 1, 10, 23, 15, 9, 3, 21].forEach((n) => {
      const node = new cc.Node();
      node.name = n.toString();
      const label = node.addComponent(cc.Label);
      label.fontSize = 27;
      label.lineHeight = 27;
      label.string = n.toString();
      this.leftNumberContainer.addChild(node);
    });
    [18, 5, 12, 24, 6, 22, 16, 11, 19, 13, 4, 25].forEach((n) => {
      const node = new cc.Node();
      node.name = n.toString();
      const label = node.addComponent(cc.Label);
      label.fontSize = 27;
      label.lineHeight = 27;
      label.string = n.toString();
      this.rightNumberContainer.addChild(node);
    });
    this.leftNumberContainer.children.forEach((child) => {
      const view = this.createLineView(child);
      view.isLabelLeft = true;
      this.lineContainer.addChild(view.node);
    });

    this.rightNumberContainer.children.forEach((child) => {
      const view = this.createLineView(child);
      view.isLabelLeft = false;
      this.lineContainer.addChild(view.node);
    });
  }

  showLineWhenHover(e) {
    const container: cc.Node = e.getCurrentTarget();
    const localPosition = container.convertToNodeSpaceAR(e.getLocation());
    container.children.forEach((child) => {
      const show = child.getBoundingBox().contains(localPosition);
      this.showLine(+child.name, show);
    });
  }
}
