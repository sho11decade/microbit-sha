# microbit-sha

Micro:bit V2 を使ったシューティングゲームの外部入力装置 + Web Bluetooth テストゲーム

## 概要

Micro:bit V2 の加速度センサーとタクトスイッチを使い、BLE UART 経由で Web ブラウザ上のシューティングゲームを操作します。

## 構成

```
microbit/
  main.ts       ... Micro:bit V2 用 MakeCode ファームウェア（BLE UART 対応）
  pxt.json      ... MakeCode プロジェクト設定
  main.py       ... MicroPython 版（USB シリアルのみ、BLE 非対応）
web/
  index.html    ... Web Bluetooth テストゲーム（ブラウザで開く）
```

## ハードウェア

- **Micro:bit V2**
- **タクトスイッチ（NO）**: Pin1 と GND に接続（ソフトウェアプルアップ使用）

```
Pin1 ──┤ ├── GND
     (タクトスイッチ NO)
```

## 操作方法

| 操作 | 入力 |
|------|------|
| エイム（照準移動） | Micro:bit を傾ける（加速度センサー） |
| 発射 | Pin1 のタクトスイッチを押す |

## 通信プロトコル（BLE UART）

Micro:bit からブラウザへ送信されるメッセージ:

| メッセージ | 説明 |
|-----------|------|
| `F\n` | 発射イベント |
| `A:<x>,<y>\n` | エイムデータ（加速度センサー値、-1024〜1024） |

## セットアップ

### 1. Micro:bit にファームウェアを書き込む（MakeCode）

> **⚠️ 重要**: BLE 通信には MakeCode の Bluetooth 拡張機能が必要です。MicroPython の `uart.write()` は USB シリアルにのみ出力され、BLE には対応していません。

1. [MakeCode エディタ](https://makecode.microbit.org/) を開く
2. 「新しいプロジェクト」を作成
3. **Bluetooth 拡張機能を追加**:
   - 画面下部の「高度なブロック」→「拡張機能」をクリック
   - 「bluetooth」を検索して追加
   - 「radio 拡張機能を削除しますか？」と表示されたら「OK」をクリック（Bluetooth と Radio は同時に使用できません）
4. 画面上部で「JavaScript」モードに切り替え
5. `microbit/main.ts` の内容をエディタに貼り付ける
6. 左下の「ダウンロード」をクリックして hex ファイルを micro:bit にコピー

#### Bluetooth ペアリング設定（任意）

MakeCode の Bluetooth 拡張機能はデフォルトで「ペアリング不要」モードで動作します。Web Bluetooth との接続にはこのモードが最適です。

### 2. テストゲームを起動する

> **⚠️ 重要**: Web Bluetooth は `file://` では動作しません。ローカルサーバー経由で開いてください。

```bash
# web/ フォルダに移動
cd web

# Python のローカルサーバーを起動
python -m http.server 8000
```

ブラウザで http://localhost:8000/index.html を開きます。

1. 「Micro:bit に接続」ボタンをクリック
2. BLE デバイス一覧から `BBC micro:bit` を選択
3. 「ゲーム開始」をクリック

> **注意**: Web Bluetooth は Chrome/Edge で対応しています。HTTPS または localhost で動作します。

### キーボード・マウスでのテスト

Micro:bit が未接続でも、以下の操作でゲームをテストできます:

| 操作 | 入力 |
|------|------|
| エイム | マウス移動 / 矢印キー |
| 発射 | クリック / スペースキー |

## ゲームルール

- 30 秒の制限時間内にターゲットを撃ち、スコアを稼ぐ
- ターゲット命中: +10 点
- ターゲットは画面内を動き回る

## MicroPython 版について

`microbit/main.py` は MicroPython 版のコントローラーコードです。ただし、micro:bit V2 の MicroPython ファームウェアでは `uart.write()` が USB シリアルにのみ出力され、BLE UART へのブリッジは行われません（[ファームウェアソースコード](https://github.com/microbit-foundation/micropython-microbit-v2/blob/main/src/codal_app/mphalport.cpp)で `uBit.serial.send()` を使用していることが確認できます）。

BLE 通信が必要な場合は、上記の MakeCode 版（`main.ts`）を使用してください。

## トラブルシューティング

### BLE デバイスが表示されない

以下を順番に確認してください：

1. **MakeCode で書き込んだか確認**: MicroPython（python.microbit.org）ではなく、**MakeCode** で Bluetooth 拡張機能を有効にして書き込む必要があります
2. **ブラウザの確認**: Chrome または Edge を使用してください（Firefox/Safari は Web Bluetooth 非対応）
3. **PC の Bluetooth を確認**: OS の設定で Bluetooth がオンになっていることを確認してください
4. **ブラウザの Bluetooth 権限を確認**: ブラウザの設定で Bluetooth のアクセスが許可されていることを確認してください
5. **micro:bit の電源を確認**: micro:bit の電源を入れ直してください（USB ケーブルを抜き差し、またはバッテリーパックの場合は電源スイッチをオフ→オン）
6. **他の接続を解除**: micro:bit が他のデバイス（スマートフォンアプリ、他のブラウザタブ等）に接続されていないことを確認してください
7. **Bluetooth キャッシュのクリア**: OS の Bluetooth 設定から micro:bit のペアリング情報を一度削除し、再度接続してみてください
8. **「全デバイス表示」ボタン**: 通常の接続ボタンでデバイスが見つからない場合、ゲーム画面の「全デバイス表示」ボタンを使ってすべての BLE デバイスを一覧表示し、micro:bit を手動で選択してください

### `No Services matching UUID ... found in Device`

UART サービス (NUS) が micro:bit で有効になっていない可能性があります。

- **MakeCode の Bluetooth 拡張機能が追加されているか確認してください**
- コード内で `bluetooth.startUartService()` が呼ばれていることを確認してください
- micro:bit V2 を使用してください（V1 は BLE UART の対応が限定的です）
- micro:bit が他のデバイス（スマートフォンアプリ等）に接続済みでないことを確認してください

### `Unsafe attempt to load URL file:///...`

Web Bluetooth は `file://` URL では動作しません。ローカルサーバー経由でアクセスしてください：

```bash
cd web
python -m http.server 8000
# → http://localhost:8000/index.html
```

## ライセンス

[LICENSE](LICENSE) を参照