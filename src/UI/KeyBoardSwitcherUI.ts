import {
  AdvancedDynamicTexture,
  StackPanel,
  TextBlock,
  Control,
} from "@babylonjs/gui";

export class KeyboardSwitcherUI {
  private advancedTexture: AdvancedDynamicTexture;
  private container: StackPanel;
  private qwerty:TextBlock;
  private azerty:TextBlock;
  private currentIsAZERTY:boolean = true;

  constructor() {
    this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("InteractUI");
    this.createUI();
  }

  private createUI(): void {
    const panel = new StackPanel("interactPanel");
    panel.isVertical = false;
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    panel.adaptWidthToChildren = true;
    panel.adaptHeightToChildren = true;
    panel.top = "80px";
    panel.left = "200px";

    const makeLabel = (name: string, text: string, width: number): TextBlock => {
      const label = new TextBlock(name, text);
      label.color = "white";
      label.fontSize = "25px";
      label.widthInPixels = width;
      label.heightInPixels = 40;
      label.fontFamily = "Courier New";
      return label;
    };
    this.azerty = new TextBlock("azerty",   "Azerty");
    const tabLabel = new TextBlock("tabLabel", "↹");
    this.qwerty = new TextBlock("qwerty",   "QWERTY");
    this.formatToBold(this.azerty,100);
    this.formatTextBlock(this.qwerty, 100);
    this.formatToBold(tabLabel, 50);

    panel.addControl(this.azerty);
    panel.addControl(tabLabel);
    panel.addControl(this.qwerty);

    this.container = panel;
    this.advancedTexture.addControl(this.container);
  }

  protected formatTextBlock(textBlock: TextBlock, width:number = 100): void {
    textBlock.color = "gray";
    textBlock.fontSize = "25px";
    textBlock.widthInPixels = width;
    textBlock.heightInPixels = 40;
    textBlock.fontFamily = "Courier New";
    textBlock.fontStyle ="normal";
  }

  protected formatToBold(textBlock:TextBlock, width:number = 100){
    textBlock.color = "white";
    textBlock.fontSize = "25px";
    textBlock.widthInPixels = width;
    textBlock.heightInPixels = 40;
    textBlock.fontFamily = "Courier New";
    textBlock.fontStyle = "bold";
  }
  show(): void {
    this.container.isVisible = true;
  }

  hide(): void {
    this.container.isVisible = false;
  }

  public switch(){
    if (this.currentIsAZERTY){
      this.currentIsAZERTY = false;
      this.formatTextBlock(this.azerty);
      this.formatToBold(this.qwerty)
    }
    else{
      this.currentIsAZERTY = true;
      this.formatTextBlock(this.qwerty);
      this.formatToBold(this.azerty)
    }
  }
}