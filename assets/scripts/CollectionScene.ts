import * as _ from "lodash";

import { ClassicSlotSound } from "./board/ClassicSlotSound";
import LineView from "./board/LineView";
import SlotBoard from "./board/SlotBoard";
import { CollectionType } from "./CollectionType";
import SingleSymbolCollection from "./controls/SingleSymbolCollection";
import Exporter from "./Exporter";
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

  @property(cc.Node)
  collectionContainer: cc.Node = null;

  @property(SingleSymbolCollection)
  currentCollection: SingleSymbolCollection = null;

  @property(sp.Skeleton)
  spinButtonSkeleton: sp.Skeleton = null;

  @property(Exporter)
  exporter: Exporter = null;

  static symbolsSkeletons: sp.SkeletonData[] = [];
  static audioClips = {};
  static winningAnimations: sp.SkeletonData;

  private collectionNodes = {};
  private isAnimatingResult = false;

  readonly audioMap = {
    [ClassicSlotSound.SPIN]: "spin-button",
    [ClassicSlotSound.WIN]: "win",
    [ClassicSlotSound.BIG_WIN]: "big-win",
    [ClassicSlotSound.JACKPOT]: "jackpot",
    [ClassicSlotSound.FREESPIN]: "freespin",
    [ClassicSlotSound.BONUS]: "bonus",
    [ClassicSlotSound.SPINNING_NORMAL]: "spinning-normal",
    [ClassicSlotSound.SPINNING_TURBO]: "spinning-turbo",

    [ClassicSlotSound.REEL_STOP]: "reel-stop",
    [ClassicSlotSound.BONUS_POPUP]: "bonus-popup",
    [ClassicSlotSound.CLICK]: "click",
    [ClassicSlotSound.BONUS_TOTAL]: "bonus-total",

    [ClassicSlotSound.TRANSITION]: "transition",
    [ClassicSlotSound.SYMBOL_WIN]: "symbol-win",
  };

  readonly SYMBOL_COUNT = 11;

  onLoad(): void {
    this.initDefault();
    this.initListeners();

    this.createAllLines();
    this.initEventForNumberContainer();
  }

  initCollections() {
    this.collectionContainer.children.forEach((child) => {
      this.collectionNodes[child.name] = child;
    });
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

  stopAllFinishTweens() {
    this.node.stopAllActions();
    this.hideAllLines();
    this.hideWinningEffectOnItems();
  }

  async testSpin() {
    if (this.isAnimatingResult) {
      return;
    }
    this.isAnimatingResult = true;
    this.playSound(ClassicSlotSound.SPIN);
    this.stopAllFinishTweens();

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
    const spinDuration = 0.75;
    cc.tween(this.node)
      .delay(spinDuration * 0.5)
      .call(() => {
        this.playSound(ClassicSlotSound.REEL_STOP);
      })
      .start();
    this.playSound(ClassicSlotSound.SPINNING_NORMAL);
    this.playAnimationSpinButton("spin");
    await this.board.spin(spinDuration, false);
    this.playAnimationSpinButton("idle");
    this.playSound(ClassicSlotSound.SYMBOL_WIN);
    this.showLoopWinningLines([
      this.generateRandomWinPayline(),
      this.generateRandomWinPayline(),
      this.generateRandomWinPayline(),
    ]);
    this.isAnimatingResult = false;
  }

  generateRandomWinPayline() {
    const positions = [
      [1, 4, 7, 10, 13],
      [0, 3, 6, 9, 12],
      [2, 5, 8, 11, 14],
      [2, 4, 6, 10, 14],
      [0, 4, 8, 10, 12],

      [1, 3, 6, 9, 13],
      [1, 5, 8, 11, 13],
      [0, 3, 7, 11, 14],
      [2, 5, 7, 9, 12],
      [1, 5, 7, 9, 13],

      [1, 3, 7, 11, 13],
      [0, 4, 7, 10, 12],
      [2, 4, 7, 10, 14],
      [0, 4, 6, 10, 12],
      [2, 4, 8, 10, 14],

      [1, 4, 6, 10, 13],
      [1, 4, 8, 10, 13],
      [0, 3, 8, 9, 12],
      [2, 5, 6, 11, 14],
      [0, 5, 8, 11, 12],

      [2, 3, 6, 9, 14],
      [1, 3, 8, 9, 13],
      [1, 5, 6, 11, 13],
      [0, 5, 6, 11, 12],
      [2, 3, 8, 9, 14],
    ];

    const payline = _.random(24);
    return {
      payline,
      positions: positions[payline],
      symbol: 0,
    };
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

  playAnimationSpinButton(name: string) {
    this.spinButtonSkeleton.setAnimation(0, name, true);
  }

  initListeners() {
    uiManager.emitterListener(Events.UPDATE_SPIN_BUTTON, (data) => {
      this.spinButtonSkeleton.skeletonData = data.data;
      this.playAnimationSpinButton("idle");

      const key = "spin_button";
      this.exporter.exportData[key] = data.path;
      this.exporter.updateData();
    });
    uiManager.emitterListener(Events.UPDATE_AUDIO_PACK, (data) => {
      CollectionScene.audioClips = data.audio;

      const key = "audio";
      this.exporter.exportData[key] = data.path;
      this.exporter.updateData();
    });

    uiManager.emitterListener(Events.UPDATE_ONE_SYMBOL, (data) => {
      CollectionScene.symbolsSkeletons[uiManager.selectedSymbolIndex] =
        data.symbol;
      const key = data.symbol.skeletonJson ? "symbol_spines" : "symbol_images";
      this.exporter.exportData[key][uiManager.selectedSymbolIndex] = data.path;
      this.exporter.updateData();
      this.board.reloadItems();
      this.currentCollection.reloadItems();
    });
    uiManager.emitterListener(Events.UPDATE_MULTI_SYMBOLS, (data: any[]) => {
      data.forEach((item, index) => {
        if (index >= this.SYMBOL_COUNT) {
          return;
        }
        CollectionScene.symbolsSkeletons[index] = item.symbol;
      });
      CollectionScene.symbolsSkeletons.forEach((item, index) => {
        if (index >= this.SYMBOL_COUNT || index >= data.length) {
          return;
        }
        if (data[index].path) {
          const key = data[index].symbol.skeletonJson
            ? "symbol_spines"
            : "symbol_images";
          this.exporter.exportData[key][index] = data[index].path;
        }
      });
      this.exporter.updateData();
      this.board.reloadItems();
      this.currentCollection.reloadItems();
    });

    uiManager.emitterListener(Events.UPDATE_WINNING_ANIMATION, (data) => {
      const key = "winning_effect";
      this.exporter.exportData[key] = data.path;
      this.exporter.updateData();
    });
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

  hideWinningEffectOnItems() {
    this.board.hideWinningEffect();
  }

  showLoopWinningLines(winningLines: LineData[]) {
    const length = winningLines.length;
    const timeShowPayline = 1;
    if (length === 0) {
      return;
    }
    let index = 0;
    cc.tween(this.node)
      .repeatForever(
        cc
          .tween()
          .call(() => {
            if (index === length) {
              index = 0;
            }
            this.hideAllLines();
            this.hideWinningEffectOnItems();
            const line = winningLines[index];
            this.showLine(line.payline + 1);
            this.board.showWinningEffect(line.positions, +line.symbol);
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
    const createNumberNode = (value) => {
      const node = new cc.Node();
      node.name = value.toString();
      node.width = 40;
      node.height = 32;
      return node;
    };
    [20, 8, 2, 14, 17, 7, 1, 10, 23, 15, 9, 3, 21].forEach((n) => {
      const node = createNumberNode(n);
      this.leftNumberContainer.addChild(node);
    });
    [18, 5, 12, 24, 6, 22, 16, 11, 19, 13, 4, 25].forEach((n) => {
      const node = createNumberNode(n);
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

  showCategories(type: CollectionType) {
    this.collectionContainer.children.forEach((child) => {
      child.active = type === +child.name;
    });

    this.currentCollection.node.active =
      type === CollectionType.Symbol || type === CollectionType.LetterSymbol;
  }

  onCategoryChanged(event: cc.Event.EventTouch) {
    const type = +event.target.name;

    this.showCollection();
    this.showCategories(type);
  }

  playSound(type: ClassicSlotSound) {
    const key = this.audioMap[type.toString()];
    if (CollectionScene.audioClips[key]) {
      cc.audioEngine.play(CollectionScene.audioClips[key], false, 1);
    }
  }
}
