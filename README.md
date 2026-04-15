# microbit-sha

Micro:bit V2 を使ったシューティングゲームの外部入力装置 + Web Bluetooth テストゲーム

## 概要

Micro:bit V2 の加速度センサーとタクトスイッチを使い、BLE UART 経由で Web ブラウザ上のシューティングゲームを操作します。

## 構成

```
microbit/
  main.py       ... Micro:bit V2 用 MicroPython ファームウェア
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

### 1. Micro:bit にファームウェアを書き込む

1. [Micro:bit Python Editor](https://python.microbit.org/) を開く
2. `microbit/main.py` の内容をエディタに貼り付ける
3. Micro:bit V2 を USB 接続し、書き込む

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

## トラブルシューティング

### `No Services matching UUID ... found in Device`

UART サービス (NUS) が micro:bit で有効になっていない可能性があります。

micro:bit V2 の MicroPython ファームウェアでは、BLE UART (NUS) はデフォルトで有効です。以下を確認してください：

- **`uart.init()` を呼び出さないでください**（`uart.init()` を呼ぶと UART が USB シリアル用に再構成され、BLE UART が無効になります）
- [Micro:bit Python Editor](https://python.microbit.org/) で `main.py` を書き込んだ後、micro:bit を再起動してください
- micro:bit V2 を使用してください（V1 は BLE UART の対応が限定的です）
- micro:bit が他のデバイス（スマートフォンアプリ等）に接続済みでないことを確認してください

### `Unsafe attempt to load URL file:///...`

Web Bluetooth は `file://` URL では動作しません。ローカルサーバー経由でアクセスしてください：

```bash
cd web
python -m http.server 8000
# → http://localhost:8000/index.html
```

### BLE デバイスが表示されない

以下を順番に確認してください：

1. **ブラウザの確認**: Chrome または Edge を使用してください（Firefox/Safari は Web Bluetooth 非対応）
2. **PC の Bluetooth を確認**: OS の設定で Bluetooth がオンになっていることを確認してください
3. **ブラウザの Bluetooth 権限を確認**: ブラウザの設定で Bluetooth のアクセスが許可されていることを確認してください
4. **micro:bit の電源を確認**: micro:bit の電源を入れ直してください（USB ケーブルを抜き差し、またはバッテリーパックの場合は電源スイッチをオフ→オン）
5. **他の接続を解除**: micro:bit が他のデバイス（スマートフォンアプリ、他のブラウザタブ等）に接続されていないことを確認してください
6. **Bluetooth キャッシュのクリア**: OS の Bluetooth 設定から micro:bit のペアリング情報を一度削除し、再度接続してみてください
7. **「全デバイス表示」ボタン**: 通常の接続ボタンでデバイスが見つからない場合、ゲーム画面の「全デバイス表示」ボタンを使ってすべての BLE デバイスを一覧表示し、micro:bit を手動で選択してください
8. **ファームウェアの再書き込み**: [Micro:bit Python Editor](https://python.microbit.org/) で `main.py` を再度書き込んでください

## ライセンス

[LICENSE](LICENSE) を参照