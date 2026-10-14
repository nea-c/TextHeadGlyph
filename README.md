# TextHeadGlyph

Minecraft Java Edition 26.2のテキスト内のプレイヤー頭表示を、サイズとYオフセットで調整するリソースパックです。


## コマンド生成ページ

- サイズ1〜255、Yオフセット−128〜127を1刻みで指定（正で下、負で上）
- MCID入力、初期値はAlex
- サイズの初期値は8×8、Yオフセットの初期値は0
- 標準Alexのスキンを同梱した位置・サイズのプレビュー
- MCIDからのスキン取得、ローカルのスキンPNG読み込み
- 顔・帽子・影の表示、元の8×8との比較
- 点線の左側にバニラフォントの比較用文字を表示
- Actionbar / Title / Subtitle / Tellrawと表示先の選択
- コマンドコピーとリソパZIPダウンロード

スキン取得は[MCHeads](https://mc-heads.net/)を使用します。入力したMCIDは「スキン取得」を押した時だけ送信します。PNGはブラウザー内で処理します。ゲーム内で解決されるプロフィールと取得サービスのスキンが一致する保証はありません。プレビューはGUI倍率100%を基準とした目安で、クリッピング・描画順は再現しません。

## GitHub Pagesに配置

1. GitHubで`TextHeadGlyph`というリポジトリを作ります。
2. このフォルダーの**中身**をリポジトリ直下へアップロードします。`docs`が直下にある構成にしてください。
3. Settings → Pages → Build and deploymentで「Deploy from a branch」を選びます。
4. ブランチを`main`、フォルダーを`/docs`にして保存します。
5. 公開URLは`https://<GitHubユーザー名>.github.io/TextHeadGlyph/`です。

設定方法は[GitHub公式ドキュメント](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)でも確認できます。

HTML・CSS・JavaScriptだけの静的ページです。ビルドや依存パッケージのインストールは不要です。公開状態やPagesの利用可否はGitHubのアカウント・リポジトリ設定に従います。

## リソパを使用

`docs/downloads/TextHeadGlyph-26.2.zip`をMinecraftの`resourcepacks`へ入れ、パックを有効にします。更新時はF3+Tで再読み込みします。ソースは`resourcepack/`にあります。

24×24、下へ8、影ありの例:

```mcfunction
/title @a actionbar {player:"Alex",hat:true,color:"#fe1888",shadow_color:-190328}
```

本体は`#FEssyy`、影はARGBの`0xFFFDssyy`を符号付き32bit整数にした値です。`ss`はサイズ、`yy`はYオフセット＋128を表す16進数です。本体と影で同じ値を使います。

影の整数 = `-196608 + サイズ × 256 + Yオフセット + 128`

影なしは`shadow_color:0`。対象の頭では本体RGBを白、影RGBを各63/255へ戻し、アルファを維持します。通常の影の右下へのずれは残します。

## 制限

- 26.2用です。
- GUIテキスト描画の64×64テクスチャと顔・帽子のUV条件内でのみ色を解釈します。通常文字の256×256フォントアトラスは対象外です。
- 左下を固定して拡縮します。チャットの倍率やTitle自体の拡大など、描画に倍率がかかる場合は指定サイズと実際の表示サイズの比率が変わります。プレビューは描画倍率1×が基準です。
- 文字送り・行間・クリック範囲は変わりません。
- 他の`assets/minecraft/shaders/core/text.vsh`を変更するリソパとは競合します。
- 従来の`#fffffe`は24×24・Y=0として残しています。`shadow_color:0`で使用してください。

## 確認・ローカル起動

Node.jsで`npm test`を実行すると、コマンド生成の境界値・整数入力・影の色変換を検証できます。

`npm run preview`で起動し、`http://127.0.0.1:8000/`を開きます。Ctrl+Cで停止できます。JavaScriptモジュールを使うため、HTMLのファイル直開きではなくHTTPサーバーで確認してください。

リソパのソースを更新した場合は、PowerShellで`./scripts/build-pack.ps1`を実行すると、ページで配布するZIPを再生成できます。

## アセット

`docs/assets/alex.png`はMinecraft Java Edition 26.2の標準Alexのスキンです。元のパスは`assets/minecraft/textures/entity/player/slim/alex.png`、権利者はMojang Studiosです。本プロジェクトはMinecraftの公式プロジェクトではありません。

`docs/assets/ascii.png`も26.2のバニラアセット（`assets/minecraft/textures/font/ascii.png`）です。権利者はMojang Studiosです。
