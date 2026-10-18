# 新しいマークを作る

> 原文: [https://tiptap.dev/docs/guides/create-mark](https://tiptap.dev/docs/guides/create-mark)

# マーク拡張機能を作る

Tiptap では、テキストにインラインの書式を付けるのにマークを使います。よくある例は太字、斜体、下線です。ここでは、独自のマーク拡張機能を一歩ずつ作っていきます。

使えるオプションは [Mark API](https://tiptap.dev/docs/editor/extensions/custom-extensions/mark) にまとまっています。

## 基本の構造

まず、マーク拡張機能の基本の構造を作ります。

```typescript
// filepath: src/HighlightMark.ts
import { Mark } from '@tiptap/core'

const HighlightMark = Mark.create({
  name: 'highlight',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
})

export default HighlightMark
```

ここでやったことは次のとおりです。

- `HighlightMark` という名前の新しいマーク拡張機能を作った
- `addOptions` メソッドを追加し、ユーザーが設定できるマークのオプションを定義した

## スタイルを付ける

マークの HTML へのレンダリング方法と HTML からのパース方法を定義して、スタイルを付けられるようにします。

```typescript
// filepath: src/HighlightMark.ts
const HighlightMark = Mark.create({
  // ...既存のコード...

  parseHTML() {
    return [
      {
        tag: 'mark',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['mark', HTMLAttributes, 0]
  },
})
```

## 属性を追加する

カスタマイズできる属性を追加すると、マークをもっと柔軟にできます。

```typescript
// filepath: src/HighlightMark.ts
const HighlightMark = Mark.create({
  // ...既存のコード...

  addAttributes() {
    return {
      color: {
        default: 'yellow',
        parseHTML: (element) => element.getAttribute('data-color'),
        renderHTML: (attributes) => ({
          'data-color': attributes.color,
          style: `background-color: ${attributes.color}`,
        }),
      },
    }
  },
})
```

## コマンドを追加する

コマンドを追加して、マークを操作できるようにします。

```typescript
// filepath: src/HighlightMark.ts

// 独自のコマンドをエディタに追加するため、Commands インターフェースを拡張する
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setHighlight: (attributes: { color: string }) => ReturnType
    toggleHighlight: (attributes: { color: string }) => ReturnType
    unsetHighlight: () => ReturnType
  }
}

const HighlightMark = Mark.create({
  // ...既存のコード...

  addCommands() {
    return {
      setHighlight:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes)
        },
      toggleHighlight:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, attributes)
        },
      unsetHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
    }
  },
})
```

これで、次のようにエディタのインスタンスからコマンドを使えるようになります。

- `editor.commands.setHighlight({ color: 'pink' })`: コマンド API を使う場合
- `editor.chain().toggleHighlight().run()`: チェーン API を使う場合

## キーボードショートカットを追加する

すばやく書式を付けられるように、キーボードショートカットを追加します。

```typescript
// filepath: src/HighlightMark.ts
const HighlightMark = Mark.create({
  // ...既存のコード...

  addKeyboardShortcuts() {
    return {
      'Mod-h': () => this.editor.commands.toggleHighlight(),
    }
  },
})
```

## 入力ルールを追加する

Markdown 風の記法に対応させます。

```typescript
// filepath: src/HighlightMark.ts
import { markInputRule } from '@tiptap/core'

const HighlightMark = Mark.create({
  // ...既存のコード...

  addInputRules() {
    return [
      markInputRule({
        find: /(?:==)((?:[^=]+))(?:==)$/,
        type: this.type,
      }),
    ]
  },
})
```

## マークを使う

作ったマーク拡張機能は、次のように使います。

```typescript
// filepath: src/Editor.ts
import { Editor } from '@tiptap/core'
import HighlightMark from './HighlightMark'

new Editor({
  extensions: [
    HighlightMark,
    // ... ほかの拡張機能
  ],
})
```

これで次のことができます。

- `==text==` と入力してテキストをハイライトする（入力ルール）
- Cmd+H（Windows では Ctrl+H）でハイライトを切り替える
- プログラムからハイライトを操作する
  ```js
  editor.commands.setHighlight({ color: 'pink' })
  editor.commands.toggleHighlight()
  editor.commands.unsetHighlight()
  ```

## テスト

マークが期待どおりに動くことを確かめるテストを書きます。

```typescript
// filepath: src/HighlightMark.test.ts
import { Editor } from '@tiptap/core'
import HighlightMark from './HighlightMark'

describe('HighlightMark', () => {
  let editor: Editor

  beforeEach(() => {
    editor = new Editor({
      extensions: [HighlightMark],
      content: '',
    })
  })

  test('can toggle highlight mark', () => {
    editor.commands.setContent('test')
    editor.commands.selectAll()
    editor.commands.toggleHighlight()

    expect(editor.getHTML()).toBe('<mark>test</mark>')
  })
})
```

このマーク拡張機能は、それぞれの用途に合わせて作り込むための土台になります。属性やコマンドを追加したり、エディタでのレンダリング方法を変えたりして、さらに拡張できます。
