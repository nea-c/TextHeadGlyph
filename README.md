# TextHeadGlyph

テキスト内に表示するプレイヤーの頭のサイズ・Yオフセットを変更するリソースパック

## 最新

[r1](https://github.com/nea-c/TextHeadGlyph/releases/tag/r1)

## 動作要件

Minecraft JE 26.2

## 使用方法

1. [Release](https://github.com/nea-c/TextHeadGlyph/releases/tag/r1)から`TextHeadGlyph-26.2.zip`をダウンロードし、`resourcepacks`に入れて有効にします。
2. [コマンド生成ツール](https://textheadglyph.neac.work/)でMCID・サイズ・Yオフセット等を指定します。
3. 生成されたコマンドをコピーして実行！

### 例1：24×24で表示

```mcfunction
/title @a actionbar {player:"Alex",hat:true,color:"#fe1880",shadow_color:-190336}
```

### 例2：24×24で上へ8移動

```mcfunction
/title @a actionbar {player:"Alex",hat:true,color:"#fe1878",shadow_color:-190344}
```

### 例3：影なしで表示

```mcfunction
/title @a actionbar {player:"Alex",hat:true,color:"#fe1880",shadow_color:0}
```

色を直接指定したい場合は[記述方法](usage.md)を参照してください。

## コマンド生成ツールについて

[TextHeadGlyph](https://textheadglyph.neac.work/)

サイズは1〜255、Yオフセットは−128〜127を1刻みで指定できます。  
正で下、負で上に移動します。

初期値はMCIDがAlex、サイズが8×8、Yオフセットが0です。

MCIDからのスキン取得やPNGの読み込み、プレビューでの表示確認ができます。  
`actionbar` / `title` / `subtitle` / `tellraw`に対応しています。

## 注意事項

> [!NOTE]
> サイズ・位置を変更しても、文字送り・行間・クリック範囲は変わりません。

* 左下を基準に拡縮します。
* チャットの倍率やtitleの拡大がある場合、指定サイズと実際の表示サイズの比率が変わります。プレビューは描画倍率1×が基準です。
* `assets/minecraft/shaders/core/text.vsh`を変更する他のリソースパックとは競合します。

## 使用アセット

プレビューにはMojang Studiosの標準Alexスキン・バニラフォントを使用しています。  
MCIDからのスキン取得には[MCHeads](https://mc-heads.net/)を使用しています。

開発用の手順は[こちら](DEVELOPMENT.md)。

## 更新履歴

* r1
  * 初版
