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

1. `web/index.html` をブラウザ（Chrome 推奨）で開く
2. 「Micro:bit に接続」ボタンをクリック
3. BLE デバイス一覧から `BBC micro:bit` を選択
4. 「ゲーム開始」をクリック

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

## ライセンス

[LICENSE](LICENSE) を参照