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

- [Micro:bit Python Editor](https://python.microbit.org/) でフラッシュする際に、**Bluetooth を有効** にしてください
- `uart.init()` を呼び出さないでください（BLE UART と競合します）
- micro:bit V2 を使用してください（V1 は BLE UART の対応が限定的です）

### `Unsafe attempt to load URL file:///...`

Web Bluetooth は `file://` URL では動作しません。ローカルサーバー経由でアクセスしてください：

```bash
cd web
python -m http.server 8000
# → http://localhost:8000/index.html
```

### BLE デバイスが表示されない

- Chrome または Edge を使用してください（Firefox/Safari は Web Bluetooth 非対応）
- ブラウザの Bluetooth 権限を確認してください
- micro:bit が他のデバイスに接続されていないことを確認してください
- micro:bit の電源を入れ直してください

## ライセンス

[LICENSE](LICENSE) を参照