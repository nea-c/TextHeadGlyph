# 開発用の手順

## 構成

* `resourcepack/`：リソースパックのソース
* `docs/`：GitHub Pagesで配信する変換ページ
* `docs/downloads/TextHeadGlyph-26.2.zip`：Releaseへ添付する配布ZIP
* `tests/`：コマンド生成のテスト

## ローカル起動

Node.jsで以下を実行します。依存パッケージのインストールは不要です。

```text
npm run preview
```

`http://127.0.0.1:8000/`を開きます。Ctrl+Cで停止できます。  
JavaScriptモジュールを使うため、HTMLのファイル直開きではなくHTTPサーバーで確認してください。

## テスト

```text
npm test
```

初期値・境界値・整数入力・影の色変換を検証します。

## 配布ZIPの生成

リソースパックを変更した場合は、PowerShellで以下を実行します。

```powershell
./scripts/build-pack.ps1
```

生成したZIPをGitHub Releaseに添付します。  
シェーダーを変更したときに`r2`、`r3`のようにリリース番号を増やします。READMEの整理や変換ページだけの変更では増やしません。

ページのダウンロード先は`docs/index.html`、READMEのリリースリンクは`README.md`を更新します。  
CSSやJavaScriptを更新した場合は、読み込みURLの更新番号も変更してブラウザーのキャッシュを避けます。

## GitHub Pages

Settings → Pagesで「Deploy from a branch」を選び、`main`ブランチの`/docs`を公開元にします。

HTML・CSS・JavaScriptだけの静的ページなのでビルドは不要です。

## プレビュー

入力したMCIDは「スキン取得」を押した時だけMCHeadsへ送信します。  
PNGはブラウザー内で処理します。

取得サービスのスキンと、ゲーム内で解決されるプロフィールのスキンが一致する保証はありません。  
プレビューは描画倍率1×を基準とした目安で、ゲーム内のクリッピング・描画順は再現しません。

## アセット

以下はMinecraft Java Edition 26.2のバニラアセットです。権利者はMojang Studiosです。

* `docs/assets/alex.png`：`assets/minecraft/textures/entity/player/slim/alex.png`
* `docs/assets/ascii.png`：`assets/minecraft/textures/font/ascii.png`

本プロジェクトはMinecraftの公式プロジェクトではありません。
