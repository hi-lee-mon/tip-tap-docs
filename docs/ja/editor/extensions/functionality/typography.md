# Typography 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/typography](https://tiptap.dev/docs/editor/extensions/functionality/typography)

この拡張機能は、よくある文字の並びを、組版上正しい文字に置き換えます。ルールはどれも、内部では入力ルールとして動きます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/Typography)

## インストール

```bash
npm install @tiptap/extension-typography
```

## ルール

| 名前 | 説明 |
| --- | --- |
| emDash | 2つのハイフン `--` を全角ダッシュ `—` に変換する |
| ellipsis | 3つのドット `...` を三点リーダー `…` に変換する |
| openDoubleQuote | 開きの二重引用符を `“`Smart” の形にする |
| closeDoubleQuote | 閉じの二重引用符を “Smart`”` の形にする |
| openSingleQuote | 開きの一重引用符を `‘`Smart’ の形にする |
| closeSingleQuote | 閉じの一重引用符を ‘Smart`’` の形にする |
| leftArrow | `<-` を矢印 `←` に変換する |
| rightArrow | `->` を矢印 `→` に変換する |
| copyright | `(c)` を著作権記号 `©` に変換する |
| registeredTrademark | `(r)` を登録商標記号 `®` に変換する |
| trademark | `(tm)` を登録商標記号 `™` に変換する（訳注: 原文のまま。`™` は商標記号） |
| servicemark | `(sm)` を登録商標記号 `℠` に変換する（訳注: 原文のまま。`℠` はサービスマーク記号） |
| oneHalf | `1/2` を2分の1 `½` に変換する |
| oneQuarter | `1/4` を4分の1 `¼` に変換する |
| threeQuarters | `3/4` を4分の3 `¾` に変換する |
| plusMinus | `+/-` をプラスマイナス記号 `±` に変換する |
| notEqual | `!=` を不等号 `≠` に変換する |
| laquo | `<<` を左向きの二重山括弧 `«` に変換する |
| raquo | `>>` を右向きの二重山括弧 `»` に変換する |
| multiplication | `2*3` や `2x3` を乗算記号を使った `2×3` に変換する |
| superscriptTwo | `^2` を上付きの2 `²` に変換する |
| superscriptThree | `^3` を上付きの3 `³` に変換する |

## キーボードショートカット

| コマンド | Windows/Linux | macOS |
| --- | --- | --- |
| undoInputRule() | <kbd>Backspace</kbd> | <kbd>Delete</kbd> |

## ソースコード

[packages/extension-typography/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-typography/)

### ルールを無効にする

次のように、含まれるルールを個別に設定したり、一部を無効にしたりできます。

```js
import { Editor } from '@tiptap/core'
import Typography from '@tiptap/extension-typography'

const editor = new Editor({
  extensions: [
    // 含まれるルールの一部を無効にする
    Typography.configure({
      oneHalf: false,
      oneQuarter: false,
      threeQuarters: false,
    }),
  ],
})
```

### ルールを上書きする

上書きしたいルールのオプションに文字列を渡すと、そのルールの出力を変えられます。

```js
import { Editor } from '@tiptap/core'
import Typography from '@tiptap/extension-typography'

const editor = new Editor({
  extensions: [
    // 含まれるルールの一部を無効にする
    Typography.configure({
      oneHalf: '1 / 2', // デフォルトの "½" の代わりに "1 / 2" を挿入する
    }),
  ],
})
```

### RTL のスマート引用符

`openDoubleQuote`、`closeDoubleQuote`、`openSingleQuote`、`closeSingleQuote` の各ルールは、`doubleQuotes` と `singleQuotes` オプションで、RTL に合わせた引用符を使えます。

`rtl` を明示的に設定した場合は、`textDirection` より優先されます。明示的な設定がない場合は、`editor.options.textDirection === 'rtl'` かどうかで判断します。どちらでもなければ、デフォルトの LTR の引用符を使います。

> **注:** 書く向きが混在したテキストで判断があいまいにならないよう、コンテンツから向きを自動で判定することはあえてしていません。

```js
import { Editor } from '@tiptap/core'
import Typography from '@tiptap/extension-typography'

const editor = new Editor({
  extensions: [
    Typography.configure({
      doubleQuotes: { rtl: { open: '”', close: '“' } },
      singleQuotes: { rtl: { open: '’', close: '‘' } },
    }),
  ],
})
```
