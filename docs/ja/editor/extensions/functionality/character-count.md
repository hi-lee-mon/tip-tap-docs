# CharacterCount 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/character-count](https://tiptap.dev/docs/editor/extensions/functionality/character-count)

`CharacterCount` 拡張機能は、入力できる文字数を指定した長さまでに制限し、文字数と単語数を返します。できることはこれだけです。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/CharacterCount)

## インストール

```bash
npm install @tiptap/extensions
```

## 使い方

```js
import { Editor } from '@tiptap/core'
import { CharacterCount } from '@tiptap/extensions'

new Editor({
  extensions: [CharacterCount],
})
```

## 設定

### limit

入力できる最大の文字数です。

デフォルト: `null`

```js
CharacterCount.configure({
  limit: 240,
})
```

### autoTrim

上限を超えるコンテンツをプログラムから設定したときに、自動で切り詰めるかどうかを決めます。`false` にすると自動では切り詰めないので、はみ出した分を自分で処理できます。

デフォルト: `true`

```js
CharacterCount.configure({
  limit: 240,
  autoTrim: false,
})
```

### mode

サイズを計算する方式です。

デフォルト: `'textSize'`

```js
CharacterCount.configure({
  mode: 'nodeSize',
})
```

### autoTrim

最初のコンテンツが設定した上限を超えているときに、自動で切り詰めるかどうかを決めます。`false` にすると、上限を超えた最初のコンテンツはそのまま残ります。ドキュメントが上限を超えている間は、コンテンツのサイズを増やすトランザクションが止められます。

デフォルト: `true`

```js
CharacterCount.configure({
  limit: 280,
  autoTrim: false, // 上限を超えた最初のコンテンツを残す
})
```

### textCounter

文字数を数える関数です。デフォルトでは単純に文字数を数えます。

デフォルト: `(text) => text.length`

```js
CharacterCount.configure({
  textCounter: (text) => [...new Intl.Segmenter().segment(text)].length,
})
```

### wordCounter

単語数を数える関数です。デフォルトでは単純に単語数を数えます。

デフォルト: `(text) => text.split(' ').filter((word) => word !== '').length`

```js
CharacterCount.configure({
  wordCounter: (text) => text.split(/\s+/).filter((word) => word !== '').length,
})
```

## ストレージ

### characters()

現在のドキュメントの文字数を取得します。

```js
editor.storage.characterCount.characters()

// 特定のノードのサイズを取得する
editor.storage.characterCount.characters({ node: someCustomNode })

// デフォルトの `mode` を上書きする
editor.storage.characterCount.characters({ mode: 'nodeSize' })
```

### words()

現在のドキュメントの単語数を取得します。

```js
editor.storage.characterCount.words()

// 特定のノードの単語数を取得する
editor.storage.characterCount.words({ node: someCustomNode })
```

## ソースコード

[packages/extensions/src/character-count/](https://github.com/ueberdosis/tiptap/blob/main/packages/extensions/src/character-count/)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { CharacterCount } from '@tiptap/extension-character-count'

new Editor({
  extensions: [CharacterCount],
})
```
