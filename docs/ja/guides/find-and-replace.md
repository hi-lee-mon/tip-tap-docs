# 独自の検索・置換 UI を作る

> 原文: [https://tiptap.dev/docs/guides/find-and-replace](https://tiptap.dev/docs/guides/find-and-replace)

[Find and Replace 拡張機能](../editor/extensions/functionality/find-and-replace.md)はヘッドレスです。テキストの検索、ハイライト、結果間の移動、置換はしますが、インターフェースはレンダリングしません。操作部品をどこに置くか（ツールバー、モーダル、サイドバー、フローティングパネル、キーボード中心の操作など）は自分で決めます。

このガイドでは、検索語と置換語の入力欄、一致条件のオプション、結果間の移動、置換の操作を備えた小さなインターフェースを作ります。

## UI と拡張機能のつながり

拡張機能は、検索条件を更新したり操作を実行したりするコマンドを公開しています。現在の状態は `editor.storage.findAndReplace` から読めます。

入力欄やボタンのイベントでは、コマンドを使います。

```js
editor.commands.setSearchTerm('Tiptap')
editor.commands.goToNextResult()
editor.commands.replaceAll()
```

選択中の結果を表示したり、一致がないときに操作を無効にしたりするには、ストレージを読みます。

```js
const { currentIndex, results } = editor.storage.findAndReplace
const resultLabel =
  results.length === 0 ? 'No results' : `${(currentIndex ?? 0) + 1} of ${results.length}`
```

## React

`useEditorState` を使い、操作部品が必要とする Find and Replace のストレージの値だけを購読します。こうすると、関係のないエディタの変更で再レンダリングせずに、UI を同期させておけます。

```jsx
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import FindAndReplace from '@tiptap/extension-find-and-replace'
import StarterKit from '@tiptap/starter-kit'

function FindAndReplaceControls({ editor }) {
  const state = useEditorState({
    editor,
    selector: (context) => ({
      searchTerm: context.editor.storage.findAndReplace.searchTerm,
      replaceTerm: context.editor.storage.findAndReplace.replaceTerm,
      caseSensitive: context.editor.storage.findAndReplace.caseSensitive,
      useRegex: context.editor.storage.findAndReplace.useRegex,
      wholeWord: context.editor.storage.findAndReplace.wholeWord,
      resultCount: context.editor.storage.findAndReplace.results.length,
      currentIndex: context.editor.storage.findAndReplace.currentIndex,
    }),
  })

  const resultLabel =
    state.resultCount === 0
      ? 'No results'
      : `${(state.currentIndex ?? 0) + 1} of ${state.resultCount}`

  return (
    <div className="find-and-replace">
      <input
        aria-label="Search"
        placeholder="Search"
        value={state.searchTerm}
        onChange={(event) => editor.commands.setSearchTerm(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return

          if (event.shiftKey) {
            editor.commands.goToPreviousResult()
          } else {
            editor.commands.goToNextResult()
          }
        }}
      />
      <input
        aria-label="Replace"
        placeholder="Replace"
        value={state.replaceTerm}
        onChange={(event) => editor.commands.setReplaceTerm(event.currentTarget.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={state.caseSensitive}
          onChange={(event) => editor.commands.setCaseSensitive(event.currentTarget.checked)}
        />
        Match case
      </label>
      <label>
        <input
          type="checkbox"
          checked={state.wholeWord}
          onChange={(event) => editor.commands.setWholeWord(event.currentTarget.checked)}
        />
        Whole word
      </label>
      <label>
        <input
          type="checkbox"
          checked={state.useRegex}
          onChange={(event) => editor.commands.setUseRegex(event.currentTarget.checked)}
        />
        Regex
      </label>
      <button
        disabled={state.resultCount === 0}
        onClick={() => editor.commands.goToPreviousResult()}
      >
        Previous
      </button>
      <button disabled={state.resultCount === 0} onClick={() => editor.commands.goToNextResult()}>
        Next
      </button>
      <button disabled={state.resultCount === 0} onClick={() => editor.commands.replace()}>
        Replace
      </button>
      <button disabled={state.resultCount === 0} onClick={() => editor.commands.replaceAll()}>
        Replace all
      </button>
      <button onClick={() => editor.commands.clearSearch()}>Clear</button>
      <span>{resultLabel}</span>
    </div>
  )
}

export default function FindAndReplaceEditor() {
  const editor = useEditor({
    extensions: [StarterKit, FindAndReplace],
    content: '<p>Search this document for Tiptap.</p>',
  })

  if (!editor) {
    return null
  }

  return (
    <>
      <FindAndReplaceControls editor={editor} />
      <EditorContent editor={editor} />
    </>
  )
}
```

## Vue

Vue でも同じインターフェースを作れます。テンプレートでエディタのストレージを読み、イベントハンドラーからコマンドを呼びます。この例は Vue の Options API を使っていますが、Composition API でもコマンドとストレージの使い方は同じです。

```vue
<template>
  <div v-if="editor">
    <div class="find-and-replace">
      <input
        aria-label="Search"
        placeholder="Search"
        :value="editor.storage.findAndReplace.searchTerm"
        @input="(event) => editor.commands.setSearchTerm(event.target.value)"
        @keydown.enter.exact="editor.commands.goToNextResult()"
        @keydown.shift.enter="editor.commands.goToPreviousResult()"
      />
      <input
        aria-label="Replace"
        placeholder="Replace"
        :value="editor.storage.findAndReplace.replaceTerm"
        @input="(event) => editor.commands.setReplaceTerm(event.target.value)"
      />
      <label>
        <input
          type="checkbox"
          :checked="editor.storage.findAndReplace.caseSensitive"
          @change="(event) => editor.commands.setCaseSensitive(event.target.checked)"
        />
        Match case
      </label>
      <label>
        <input
          type="checkbox"
          :checked="editor.storage.findAndReplace.wholeWord"
          @change="(event) => editor.commands.setWholeWord(event.target.checked)"
        />
        Whole word
      </label>
      <label>
        <input
          type="checkbox"
          :checked="editor.storage.findAndReplace.useRegex"
          @change="(event) => editor.commands.setUseRegex(event.target.checked)"
        />
        Regex
      </label>
      <button :disabled="hasNoResults" @click="editor.commands.goToPreviousResult()">
        Previous
      </button>
      <button :disabled="hasNoResults" @click="editor.commands.goToNextResult()">Next</button>
      <button :disabled="hasNoResults" @click="editor.commands.replace()">Replace</button>
      <button :disabled="hasNoResults" @click="editor.commands.replaceAll()">Replace all</button>
      <button @click="editor.commands.clearSearch()">Clear</button>
      <span>{{ resultLabel }}</span>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import FindAndReplace from '@tiptap/extension-find-and-replace'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'

export default {
  components: { EditorContent },

  data() {
    return { editor: null }
  },

  computed: {
    hasNoResults() {
      return this.editor.storage.findAndReplace.results.length === 0
    },

    resultLabel() {
      const { currentIndex, results } = this.editor.storage.findAndReplace

      if (results.length === 0) {
        return 'No results'
      }

      return `${(currentIndex ?? 0) + 1} of ${results.length}`
    },
  },

  mounted() {
    this.editor = new Editor({
      extensions: [StarterKit, FindAndReplace],
      content: '<p>Search this document for Tiptap.</p>',
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>
```

## 一致条件のオプションを組み合わせる

この拡張機能では、Match case（大文字小文字の区別）、Whole word（単語単位）、Regex（正規表現）を同時に使えます。
この挙動はヘッドレスな拡張機能側のもので、React や Vue、特定のインターフェースには依存しません。

たとえば次の検索では、3つのオプションをすべて有効にしています。

```js
editor.commands.setCaseSensitive(true)
editor.commands.setWholeWord(true)
editor.commands.setUseRegex(true)
editor.commands.setSearchTerm('cat|catalog')
```

`Catalog catalog cat cats` に対しては、`catalog` と `cat` が見つかります。

- `Catalog` は、Match case が有効なので除外される
- `cats` は、Whole word が有効なので除外される
- `cat|catalog` は、選択肢 `catalog` の全体には一致する。短いほうの選択肢 `cat` が、長い単語の一部として一致することはない

単語単位の一致では、Unicode の文字、結合文字、数字、`_` などの連結用の句読点を単語の構成文字として扱います。句読点で区切られて連続する一致にも対応します。

## 正規表現のキャプチャグループを再利用する

正規表現モードが有効なときは、置換語の中で一致した文字列全体、番号付きのキャプチャグループ、名前付きのキャプチャグループを再利用できます。

```js
editor.commands.setUseRegex(true)
editor.commands.setSearchTerm('(color|colour)')
editor.commands.setReplaceTerm('[$1]')
editor.commands.replaceAll()
// "color and colour" が "[color] and [colour]" になる
```

置換用のトークンが展開されるのは、正規表現モードのときだけです。リテラルモードでは、`$1` のような置換語は `$1` という文字そのものを挿入します。トークンの完全な一覧と、一致しなかったグループの扱いについては、[Find and Replace 拡張機能のリファレンス](../editor/extensions/functionality/find-and-replace.md#regex-replacement-tokens)を参照してください。

## インターフェースを用途に合わせる

この例の操作部品は、選択肢の1つにすぎません。同じコマンドとストレージを使って、`Cmd/Ctrl+F` で開くダイアログ、常に表示するサイドバー、コンパクトなツールバーなどをレンダリングできます。
