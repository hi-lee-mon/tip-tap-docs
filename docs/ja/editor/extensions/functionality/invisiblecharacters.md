# InvisibleCharacters 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/invisiblecharacters](https://tiptap.dev/docs/editor/extensions/functionality/invisiblecharacters)

この拡張機能は、印刷されない文字を表示するデコレーションを追加し、アクセシビリティの向上に役立ちます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/InvisibleCharacters)

## インストール

```bash
npm install @tiptap/extension-invisible-characters
```

## 設定

### visible

最初に表示するかどうかを決めます。

デフォルト: `true`

```js
InvisibleCharacters.configure({
  visible: false,
})
```

### builders

不可視文字の配列です。デフォルトでは、スペース、強制改行、段落が含まれます。

デフォルト: `[new SpaceCharacter(), new HardBreakNode(), new ParagraphNode()]`

```js
import InvisibleCharacters, { SpaceCharacter } from '@tiptap/extension-invisible-characters'

// [...]

InvisibleCharacters.configure({
  builders: [new SpaceCharacter(), new YourCustomInvisibleCharacter()],
})
```

### injectCSS

デフォルトでは、この拡張機能は CSS を挿入します。`injectCSS` で無効にできます。

デフォルト: `true`

```js
InvisibleCharacters.configure({
  injectCSS: false,
})
```

### injectNonce

`nonce` 付きの [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) を使っている場合は、動的に作られる要素に付ける `nonce` を指定できます。例を示します。

デフォルト: `undefined`

```js
InvisibleCharacters.configure({
  injectCSS: false,
  injectNonce: 'your-nonce-here',
})
```

## ストレージ

### visibility()

不可視文字を表示しているかどうかを調べます。

```js
editor.storage.invisibleCharacters.visibility()
```

## コマンド

### showInvisibleCharacters()

不可視文字を表示します。`false` を渡すと、同じコマンドで非表示にもできます。

```js
editor.commands.showInvisibleCharacters()
```

### hideInvisibleCharacters()

不可視文字を非表示にします。

```js
editor.commands.hideInvisibleCharacters()
```

### toggleInvisibleCharacters()

不可視文字の表示・非表示を切り替えます。

```js
editor.commands.toggleInvisibleCharacters()
```

## 独自の不可視文字

独自の不可視文字を作るには、パッケージが提供するクラスを継承します。

### InvisibleCharacter

```js
import InvisibleCharacters, { InvisibleCharacter } from '@tiptap/extension-invisible-characters'

class MyInvisibleCharacter extends InvisibleCharacter {
  constructor() {
    super({
      type: 'my-invisible-character',
      predicate: (value) => value === '+',
    })
  }
}

// …次のように使う
new Editor({
  extensions: [InvisibleCharacters.configure({ builders: [new MyInvisibleCharacter()] })],
})
```

CSS でこのデコレーションを選ぶには、次のセレクターを使います。

```css
.Tiptap-invisible-character.Tiptap-invisible-character--my-invisible-character {
  // …
}
```

### InvisibleNode

```js
import InvisibleCharacters, { InvisibleNode } from '@tiptap/extension-invisible-characters'

class MyInvisibleNode extends InvisibleNode {
  constructor() {
    super({
      type: 'my-invisible-node',
      predicate: (node) => node.type === node.type.schema.nodes.listItem,
    })
  }
}

// …次のように使う
new Editor({
  extensions: [InvisibleCharacters.configure({ builders: [new MyInvisibleNode()] })],
})
```

CSS でこのデコレーションを選ぶには、次のセレクターを使います。

```css
.Tiptap-invisible-character.Tiptap-invisible-character--my-invisible-node {
  // …
}
```
