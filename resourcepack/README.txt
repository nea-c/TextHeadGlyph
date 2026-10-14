Minecraft Java Edition 26.2 / TextHeadGlyph

0. 色の形式
本体: color:"#FEssyy"
影: shadow_color に ARGB 0xFFFDssyy を符号付き32bit整数で指定
ss: 一辺のサイズ（16進数01〜FF、1〜255）
yy: Yオフセット + 128（16進数00〜FF、-128〜127）
Yは負で上、正で下。80で移動なし。
本体と影で同じss・yyを指定してください。
影なしは shadow_color:0。
本体は白、影はRGB各63/255に戻します。アルファは維持します。

1. コマンド例
24x24 / Y=0 / 影あり (#fe1880, ARGB 0xfffd1880):
/tellraw @s {player:"Alex",color:"#fe1880",shadow_color:-190336}

24x24 / Y=-8 / 影あり (#fe1878, ARGB 0xfffd1878):
/tellraw @s {player:"Alex",color:"#fe1878",shadow_color:-190344}

17x17 / Y=-3 / 影あり (#fe117d, ARGB 0xfffd117d):
/tellraw @s {player:"Alex",color:"#fe117d",shadow_color:-192131}

24x24 / Y=-8 / 影なし:
/tellraw @s {player:"Alex",color:"#fe1878",shadow_color:0}

従来の #fffffe は24x24 / Y=0として残しています。影を消して使ってください。
/tellraw @s {player:"Alex",color:"#fffffe",shadow_color:0}

2. 数値変換
影の整数 = -196608 + サイズ * 256 + (Yオフセット + 128)
これはアルファ255、R=253、G=サイズ、B=Y+128のARGB整数です。

3. 適用条件・制限
GUIテキスト描画、64x64テクスチャ、顔・帽子のUVの条件内だけで解釈します。
通常フォントの256x256アトラスは対象外です。
左下を固定して拡縮します。影の通常の右下へのずれは残します。
サイズ・Yオフセットはチャットの倍率100%を基準としたGUI単位です。
倍率を変更した場合、元の8x8部分と追加した拡大量の比率が変わります。
文字送り・行間・クリック範囲は変わりません。空白・空行で余白を確保してください。
他のtext.vshを変更するパックとは競合します。
ゲーム内でF3+Tを押してリソースを再読み込みしてください。

26.2のバニラJARと描画コードに合わせて作成。
ゲーム内表示は未確認です。
