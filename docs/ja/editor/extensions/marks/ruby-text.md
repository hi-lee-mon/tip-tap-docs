# Ruby Text 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/marks/ruby-text](https://tiptap.dev/docs/editor/extensions/marks/ruby-text)

Ruby Text 拡張機能は、[HTML のルビ注釈](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby)を使えるようにします。ルビ注釈は、日本語のふりがなのように、CJK のテキストに読み方を添えるものです。プログラミング言語の Ruby とは関係ありません。

[デモを開く](https://embed.tiptap.dev/preview/Marks/RubyText)

## インストール

```bash
npm install @tiptap/extension-ruby-text
```

## 使い方

拡張機能をエディタに追加し、選択したテキストに注釈を付けます。

```js
import { Editor } from '@tiptap/core'
import RubyText from '@tiptap/extension-ruby-text'

const editor = new Editor({
  extensions: [
    // ほかの拡張機能 ...
    RubyText,
  ],
})

editor.commands.setRubyText({ rt: 'とうきょう' })
```

この拡張機能は、注釈を HTML のルビとしてレンダリングします。

```html
<ruby><rb>東京</rb><rt>とうきょう</rt></ruby>
```

> [!NOTE]
> **HTML のパース**
>
> この拡張機能は、子に `rb` を持つ ruby 要素と、ベースのテキストを直接持つ ruby 要素の両方を受け付けます。
> 代替表示用の `rp` 要素は無視します。`rt` の注釈を持たない ruby 要素は、Ruby Text マークとしてパースされません。

## 設定

### HTMLAttributes

レンダリングされる `<ruby>` 要素に追加する独自の HTML 属性です。

デフォルト: `{}`

```js
RubyText.configure({
  HTMLAttributes: {
    class: 'ruby-text',
  },
})
```

### allowClickToEdit

注釈をクリックしたときに、インラインの編集欄を開くかを決めます。

デフォルト: `true`

```js
RubyText.configure({
  allowClickToEdit: false,
})
```

インラインの編集欄は、Tiptap エディタが編集可能なときだけ使えます。無効にすると、注釈は表示されるだけで、その場では編集できません。

### renderAnnotationEditor

注釈を編集するための独自の要素をレンダリングします。返した要素が、`<rt>` 要素内のデフォルトの入力欄の代わりに使われます。

コールバックは、現在の `annotation`、Tiptap の `editor`、そして `submit` と `dismiss` の2つの関数を受け取ります。注釈を保存するには `submit(value)` を、変更せずに編集欄を閉じるには `dismiss()` を呼びます。編集欄を開いたときにフォーカスさせたいなら、返す要素かその子孫に `autofocus` を付けます。

```js
RubyText.configure({
  renderAnnotationEditor: ({ annotation, submit, dismiss }) => {
    const input = document.createElement('input')

    input.value = annotation
    input.setAttribute('autofocus', '')
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        dismiss()
      }

      if (event.key === 'Enter') {
        submit(input.value)
      }
    })

    return input
  },
})
```

このオプションを指定しないと、拡張機能はテキストの入力欄をレンダリングします。<kbd>Enter</kbd> で注釈を保存し、<kbd>Escape</kbd> を押すか入力欄からフォーカスを外すと閉じます。IME で変換中のあいだは、Enter や Escape を押しても入力欄は閉じません。

## コマンド

### setRubyText()

選択したテキストにルビ注釈を付けます。

```js
editor.commands.setRubyText({ rt: 'かんじ' })
```

### toggleRubyText()

選択したテキストのルビ注釈を付けたり外したりします。

```js
editor.commands.toggleRubyText({ rt: 'かんじ' })
```

### unsetRubyText()

選択したテキストからルビ注釈を外します。

```js
editor.commands.unsetRubyText()
```

## ソースコード

[packages/extension-ruby-text/](https://github.com/ueberdosis/tiptap/tree/main/packages/extension-ruby-text/)
