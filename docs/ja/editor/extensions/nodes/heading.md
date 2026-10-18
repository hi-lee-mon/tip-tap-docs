# Heading 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/heading](https://tiptap.dev/docs/editor/extensions/nodes/heading)

Heading 拡張機能は、レベルの異なる見出しを使えるようにします。見出しは `<h1>`、`<h2>`、`<h3>`、`<h4>`、`<h5>`、`<h6>` の HTML タグでレンダリングされます。デフォルトでは 6 つのレベル（スタイル）がすべて有効ですが、配列を渡して一部のレベルだけを許可することもできます。やり方は使い方の例を参照してください。

新しい行の先頭で `# ` と入力すると、魔法のように見出しに変わります。`## `、`### `、`#### `、`##### `、`###### ` も同様です。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/Heading)

## インストール

```bash
npm install @tiptap/extension-heading
```

## 設定

### HTMLAttributes

レンダリングする HTML タグに追加するカスタムの HTML 属性。

```js
Heading.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

### levels

使える見出しのレベルを指定します。

デフォルト: `[1, 2, 3, 4, 5, 6]`

```js
Heading.configure({
  levels: [1, 2],
})
```

## コマンド

### setHeading()

指定したレベルの見出しノードを作ります。

```js
editor.commands.setHeading({ level: 1 })
```

### toggleHeading()

指定したレベルの見出しノードを切り替えます。

```js
editor.commands.toggleHeading({ level: 1 })
```

## キーボードショートカット

| コマンド                  | Windows/Linux                                      | macOS                                          |
| ------------------------- | -------------------------------------------------- | ---------------------------------------------- |
| toggleHeading( level: 1 ) | <kbd>Control</kbd> + <kbd>Alt</kbd> + <kbd>1</kbd> | <kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>1</kbd> |
| toggleHeading( level: 2 ) | <kbd>Control</kbd> + <kbd>Alt</kbd> + <kbd>2</kbd> | <kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>2</kbd> |
| toggleHeading( level: 3 ) | <kbd>Control</kbd> + <kbd>Alt</kbd> + <kbd>3</kbd> | <kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>3</kbd> |
| toggleHeading( level: 4 ) | <kbd>Control</kbd> + <kbd>Alt</kbd> + <kbd>4</kbd> | <kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>4</kbd> |
| toggleHeading( level: 5 ) | <kbd>Control</kbd> + <kbd>Alt</kbd> + <kbd>5</kbd> | <kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>5</kbd> |
| toggleHeading( level: 6 ) | <kbd>Control</kbd> + <kbd>Alt</kbd> + <kbd>6</kbd> | <kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>6</kbd> |

## ソースコード

[packages/extension-heading/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-heading/)
