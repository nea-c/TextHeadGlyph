# TextHeadGlyph

テキスト内に表示するプレイヤーの頭のサイズ・Yオフセットを変更するリソースパック


[textheadglyph.neac.work](https://textheadglyph.neac.work/)からコマンドを生成できます

## 最新

r1

## 動作要件

Minecraft JE 26.2

## 使用方法

1. [Release](https://github.com/nea-c/TextHeadGlyph/releases/latest)から`TextHeadGlyph-26.2.zip`をダウンロードし、`resourcepacks`に入れて有効にします。
2. [コマンド生成ツール](https://textheadglyph.neac.work/)でMCID・サイズ・Yオフセット等を指定します。
3. 生成されたコマンドをコピーして実行！

色を直接指定したい場合は[記述方法](usage.md)を参照

## 注意事項

> [!NOTE]
> サイズ・位置を変更しても、文字送り・行間・クリック範囲は変わりません。

* 左下を基準に拡縮します。
* チャットの倍率やtitleの拡大がある場合、指定サイズと実際の表示サイズの比率が変わります。プレビューは描画倍率1×が基準です。
* `assets/minecraft/shaders/core/text.vsh`を変更する他のリソースパックとは競合します。

## 使用アセット

プレビューにはMojang Studiosの標準Alexスキン・バニラフォント・タイトル画面のパノラマを使用しています。
MCIDからのスキン取得には[MCHeads](https://mc-heads.net/)を使用しています。


## 更新履歴

* r1
  * 初版
