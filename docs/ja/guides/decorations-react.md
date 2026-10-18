# React でデコレーションを使って検索語をハイライトする

> 原文: [https://tiptap.dev/docs/guides/decorations-react](https://tiptap.dev/docs/guides/decorations-react)

このチュートリアルでは、React で Tiptap エディタ用の検索語ハイライト機能を作ります。ユーザーが入力欄に検索語を打ち込むと、ドキュメント内の一致箇所がすべてハイライトされます。ドキュメントそのものは何も変わりません。ハイライトは見た目だけのものです。

完成した機能では、3種類のデコレーションをすべて使います。

- **インラインデコレーション**: 一致箇所をすべて黄色の背景でハイライトする
- **ノードデコレーション**: 一致箇所を1つ以上含むブロックをすべて枠線で囲む
- **ウィジェットデコレーション**: 一致箇所ごとに、その後ろへ番号付きの小さな React バッジをレンダリングする

## デコレーションとは

デコレーションは、ドキュメントの上に重ねて表示する視覚的な目印です。ユーザーに見える内容は変わりますが、ドキュメントのコンテンツは変わりません。エディタを JSON や HTML として保存しても、デコレーションは含まれません。

Tiptap のデコレーションには3種類あります。

- **インライン**: テキストの範囲をスタイル付きの span で包む。ハイライトに使う
- **ノード**: ブロック全体を包む DOM 要素に属性（CSS クラスなど）を追加する。段落や見出しを枠線で囲むのに使う
- **ウィジェット**: 1つの位置に DOM 要素を挿入する。バッジや目印、小さな UI 要素に使う

3種類とも、`@tiptap/core` からインポートする `Decoration` クラスで作ります。React コンポーネントをレンダリングするウィジェットには、`@tiptap/react` の `ReactWidgetRenderer` を使います。

## エディタと検索入力欄を用意する

まず、検索入力欄とエディタをレンダリングする基本の React コンポーネントを作ります。

```tsx
// Editor.tsx
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'

import { Highlight } from './Highlight'
import './styles.css'

export function TiptapEditor() {
  // 入力欄を制御コンポーネントにするため、検索語は React の state に保持する
  const [searchTerm, setSearchTerm] = useState('')

  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: `
      <h2>Tiptap decorations tutorial</h2>
      <p>Tiptap is a headless editor toolkit built on ProseMirror.</p>
      <p>You can highlight words without changing the document.</p>
      <p>Try typing "tiptap" in the search box above.</p>
    `,
  })

  if (!editor) {
    return null
  }

  return (
    <div>
      <div className="highlight-toolbar">
        <input
          aria-label="Search"
          placeholder="Type a word to highlight..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
```

`Highlight` 拡張機能はまだありません。次に作ります。入力欄は React の state にはつながっていますが、エディタにはまだつながっていません。エディタとの接続は、拡張機能ができてから行います。

## ハイライト用の拡張機能を作る

拡張機能は Tiptap を組み立てる部品です。太字からコードブロックまで、どの機能も拡張機能として実装されています。ここでは、検索語を読み取ってデコレーションを生成する独自の拡張機能が必要です。

まず、中身が空の拡張機能と、検索語を入れるストレージのフィールドを用意します。

```tsx
// Highlight.tsx
import { Extension } from '@tiptap/core'

// ストレージの形を TypeScript に伝える
interface HighlightStorage {
  term: string
}

// Tiptap はすべての拡張機能のストレージを、共有の1つのオブジェクト editor.storage に保持する。
// TypeScript は初期状態では "highlight" キーを知らないので、
// declare module で追加する。これで editor.storage.highlight に型チェックが効く。
declare module '@tiptap/core' {
  interface Storage {
    highlight: HighlightStorage
  }
}

export const Highlight = Extension.create<{}, HighlightStorage>({
  name: 'highlight',

  // addStorage は、この拡張機能のストレージの初期値を返す。
  // デコレーションのロジックから読めるよう、検索語をここに保持する。
  addStorage() {
    return {
      term: '',
    }
  },

  // addCommands は、editor.commands から呼べる独自のコマンドを定義する。
  // ストレージに書き込むだけではデコレーションは再構築されないので、
  // 検索語の保存とデコレーションの更新をまとめて行うコマンドを1つ作る。
  addCommands() {
    return {
      setSearchTerm: (term: string) => ({ editor, commands }) => {
        editor.storage.highlight.term = term
        commands.updateDecorations('highlight')
        return true
      },
    }
  },
})
```

ストレージは、拡張機能のインスタンスが持つただのオブジェクトです。書き込むだけではデコレーションは再構築されません。そこで、検索語の保存と `updateDecorations` の呼び出しを一度に行う `setSearchTerm` コマンドを追加しました。このコマンドは、あとで React コンポーネントから呼びます。`addDecorations` の中では、ストレージから検索語を読み取ります。

## バッジのウィジェットコンポーネントを作る

デコレーションを追加する前に、ウィジェットがレンダリングする React コンポーネントを作ります。一致箇所ごとに、その後ろに表示する番号付きの小さなバッジです。

`ReactWidgetRenderer` は、こちらが渡す props に加えて、`editor` と `getPos` を自動でコンポーネントの props に渡します。このバッジに必要なのは一致箇所の番号だけです。

```tsx
// MatchBadge.tsx
import type { ReactWidgetDecorationProps } from '@tiptap/react'

// ReactWidgetDecorationProps から editor と getPos を受け取る。
// 独自の props として、表示する一致箇所の番号を追加する。
interface MatchBadgeProps extends ReactWidgetDecorationProps {
  matchNumber: number
}

export function MatchBadge({ matchNumber }: MatchBadgeProps) {
  return (
    <span className="match-badge" contentEditable={false}>
      {matchNumber}
    </span>
  )
}
```

`contentEditable={false}` は欠かせません。これがないと、ユーザーがバッジの中に文字を入力できてしまい、ProseMirror の編集ロジックが混乱します。

> [!NOTE]
> **editor と getPos とは**
>
> ウィジェットのコンポーネントはどれも、`editor`（Tiptap エディタのインスタンス）と `getPos`（ウィジェットのドキュメント内での現在位置を返す関数）を受け取ります。
> 静的なバッジでは使いませんが、操作できるウィジェットには欠かせません。たとえば「置換」ボタンなら、`getPos()` を使ってドキュメントのどの部分を置き換えるかを知ります。
> 位置はユーザーの編集に応じて変わるので、位置が必要なときは毎回 `getPos()` を呼び、結果を保存しないでください。

## 一致箇所を見つけてハイライトする

次に、拡張機能に `addDecorations` フックを追加します。ここでドキュメントから一致箇所を探し、デコレーションを返します。

3段階で組み立てます。最初にインラインデコレーション、次にノードデコレーション、最後にウィジェットデコレーションです。

### ステップ1: ハイライト用のインラインデコレーション

```tsx
// Highlight.tsx
import { Decoration, Extension } from '@tiptap/core'

// ... HighlightStorage、declare module、addStorage、addCommands は変わらない ...

export const Highlight = Extension.create<{}, HighlightStorage>({
  name: 'highlight',

  addStorage() {
    return { term: '' }
  },

  addDecorations() {
    return {
      // 'manual' にすると、Tiptap はキー入力のたびにデコレーションを再構築しない。
      // 再構築のタイミングは、editor.commands.updateDecorations() を呼んで自分で決める。
      update: 'manual',

      // create は初期化時と、updateDecorations() を呼ぶたびに実行される。
      create: ({ editor, state }) => {
        // ストレージから検索語を読み取り、整える
        const term = editor.storage.highlight.term.trim().toLowerCase()

        // 検索語がなければ空の配列を返す（デコレーションなし）
        if (!term) return []

        const decorations: Decoration[] = []

        // descendants() はドキュメント内のすべてのノードをたどる。
        // 各ノードには開始位置（pos）が付いてくる。
        state.doc.descendants((node, pos) => {
          // 対象はテキストノードだけ。見出しや段落などは飛ばす。
          if (!node.isText || !node.text) return

          // このテキストノードの中を検索する（大文字小文字を区別しない）
          const text = node.text.toLowerCase()
          let index = text.indexOf(term)

          // このテキストノードで一致箇所がなくなるまで検索を続ける
          while (index !== -1) {
            // pos はテキストノードの開始位置。
            // index はテキストノード内での一致箇所の開始位置。
            // したがって、一致箇所のドキュメント内の位置は pos + index になる。
            const matchFrom = pos + index
            const matchTo = matchFrom + term.length

            // 一致箇所を CSS クラス "highlight-match" 付きの span で包む
            // インラインデコレーションを作る
            decorations.push(
              Decoration.Inline(matchFrom, matchTo, { class: 'highlight-match' }),
            )

            // この一致箇所の先に進み、次の一致箇所を探す
            index = text.indexOf(term, index + term.length)
          }
        })

        return decorations
      },
    }
  },
})
```

> [!NOTE]
> **manual の更新方式を使う理由**
>
> 検索語はドキュメントの外（入力欄）から来ます。ユーザーがエディタに入力するとドキュメントは変わりますが、検索語は変わりません。
> キー入力のたびにデコレーションを再構築する理由はないのです。`update: 'manual'` にすると、Tiptap は既存のデコレーションを新しい位置へ対応付けるだけ（高速です）にとどめ、
> 検索語が実際に変わって `updateDecorations()` が呼ばれるのを待ちます。

### ステップ2: ブロックを枠線で囲むノードデコレーション

インラインデコレーションは個々の単語をハイライトします。ノードデコレーションを使うと、一致箇所を含むブロック（段落や見出しなど）全体を枠線で囲めます。同じブロックを重複して装飾しないよう、装飾済みのブロックを記録しておきます。

```tsx
// create の中、descendants() の呼び出しの前に、装飾済みブロックを記録する Set を追加する:

create: ({ editor, state }) => {
  const term = editor.storage.highlight.term.trim().toLowerCase()
  if (!term) return []

  const decorations: Decoration[] = []
  // 枠線で囲んだブロックの開始位置を記録する
  const decoratedBlocks = new Set<number>()

  state.doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return

    const text = node.text.toLowerCase()
    let index = text.indexOf(term)

    while (index !== -1) {
      const matchFrom = pos + index
      const matchTo = matchFrom + term.length

      // インライン: 一致箇所をハイライトする
      decorations.push(
        Decoration.Inline(matchFrom, matchTo, { class: 'highlight-match' }),
      )

      // ノード: この一致箇所を含むブロックを枠線で囲む。
      // resolve() は、その位置がどのブロックの中にあるかなどの情報を返す。
      const $match = state.doc.resolve(matchFrom)

      // depth は一致箇所の入れ子の深さ。1 はトップレベルのブロック、
      // 2 は別のブロックの中にあるブロック。この計算で、
      // 一致箇所をいちばん内側で囲むブロックを選ぶ。
      const depth = Math.max(1, $match.depth)

      // before() と after() で、囲んでいるブロックの開始位置と終了位置を得る
      const blockStart = $match.before(depth)
      const blockEnd = $match.after(depth)

      // 一致箇所が複数あっても、各ブロックは1回だけ枠線で囲む
      if (!decoratedBlocks.has(blockStart)) {
        decoratedBlocks.add(blockStart)
        decorations.push(
          Decoration.Node(blockStart, blockEnd, { class: 'has-match' }),
        )
      }

      index = text.indexOf(term, index + term.length)
    }
  })

  return decorations
},
```

### ステップ3: 番号付きバッジのウィジェットデコレーション

最後にウィジェットを追加します。先ほど作った `MatchBadge` コンポーネントを、`ReactWidgetRenderer` でレンダリングします。すべてのテキストノードを通して一致箇所に番号を振るため、カウンターを用意します。

```tsx
// Highlight.tsx の先頭にインポートを追加する:
import { ReactWidgetRenderer } from '@tiptap/react'
import { MatchBadge } from './MatchBadge'

// create の中、descendants() の呼び出しの前にカウンターを追加する:
let matchNumber = 0

// そして while ループの中、ノードデコレーションの後に追加する:

// ウィジェット: 一致箇所の後ろに番号付きの React バッジをレンダリングする。
// ReactWidgetRenderer は、コンポーネントとオプションのオブジェクトを受け取る。
// コンポーネントは、渡した props に加えて editor と getPos を受け取る。
matchNumber++
decorations.push(
  ReactWidgetRenderer(MatchBadge, {
    editor,
    // ウィジェットを一致箇所の直後に置く
    pos: matchTo,
    // key は、再構築をまたいでこのウィジェットを識別する。
    // バッジは状態を持たないので、位置に基づく key で問題ない。
    // 状態を持つウィジェットでは、`match-${id}` のような安定した key を使う。
    key: `match-badge-${matchFrom}`,
    // この props が MatchBadge コンポーネントに渡される
    props: { matchNumber },
    // side: 1 でウィジェットを一致箇所の後ろ（右側）に置く
    side: 1,
  }),
)
```

> [!NOTE]
> **ウィジェットの key について**
>
> ウィジェットにはどれも `key` が必要です。ProseMirror は key を見て、再描画のときにウィジェットの DOM を再利用するか、破棄して作り直すかを決めます。
> key が変わらなければウィジェットはマウントされたままで、React はその状態を保ちます。key が変わると、ウィジェットは作り直されます。
>
> このバッジのように状態を持たないウィジェットなら、位置に基づく key（`match-badge-${matchFrom}`）で問題ありません。
> 状態を持つウィジェット（ユーザーが変更したデータを保持するもの全般）では、`comment-${id}` のように、項目の同一性に結びついた安定した key を使ってください。
> コアコンセプトのガイドにある[ウィジェットの key の節](../editor/core-concepts/decorations.md#widget-keys)を参照してください。

## 拡張機能の完成形

3種類のデコレーションをすべて使った拡張機能の全体です。

```tsx
// Highlight.tsx
import { Decoration, Extension } from '@tiptap/core'
import { ReactWidgetRenderer } from '@tiptap/react'

import { MatchBadge } from './MatchBadge'

interface HighlightStorage {
  term: string
}

// editor.storage.highlight に型が付くよう、Tiptap の Storage インターフェースを拡張する
declare module '@tiptap/core' {
  interface Storage {
    highlight: HighlightStorage
  }
}

export const Highlight = Extension.create<{}, HighlightStorage>({
  name: 'highlight',

  addStorage() {
    return { term: '' }
  },

  addCommands() {
    return {
      setSearchTerm: (term: string) => ({ editor, commands }) => {
        editor.storage.highlight.term = term
        commands.updateDecorations('highlight')
        return true
      },
    }
  },

  addDecorations() {
    return {
      update: 'manual',
      create: ({ editor, state }) => {
        const term = editor.storage.highlight.term.trim().toLowerCase()
        if (!term) return []

        const decorations: Decoration[] = []
        let matchNumber = 0
        const decoratedBlocks = new Set<number>()

        state.doc.descendants((node, pos) => {
          if (!node.isText || !node.text) return

          const text = node.text.toLowerCase()
          let index = text.indexOf(term)

          while (index !== -1) {
            const matchFrom = pos + index
            const matchTo = matchFrom + term.length

            // インライン: 一致箇所をハイライトする
            decorations.push(
              Decoration.Inline(matchFrom, matchTo, { class: 'highlight-match' }),
            )

            // ノード: 一致箇所を含むブロックを1回だけ枠線で囲む
            const $match = state.doc.resolve(matchFrom)
            const depth = Math.max(1, $match.depth)
            const blockStart = $match.before(depth)
            const blockEnd = $match.after(depth)

            if (!decoratedBlocks.has(blockStart)) {
              decoratedBlocks.add(blockStart)
              decorations.push(
                Decoration.Node(blockStart, blockEnd, { class: 'has-match' }),
              )
            }

            // ウィジェット: 一致箇所の後ろに番号付きの React バッジを置く
            matchNumber++
            decorations.push(
              ReactWidgetRenderer(MatchBadge, {
                editor,
                pos: matchTo,
                key: `match-badge-${matchFrom}`,
                props: { matchNumber },
                side: 1,
              }),
            )

            index = text.indexOf(term, index + term.length)
          }
        })

        return decorations
      },
    }
  },
})
```

## 検索入力欄をつなぐ

次に、入力欄を拡張機能につなぎます。検索語が変わったら、拡張機能のストレージに書き込み、デコレーションを再構築するよう Tiptap に伝えます。

```tsx
// Editor.tsx
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'

import { Highlight } from './Highlight'
import './styles.css'

export function TiptapEditor() {
  const [searchTerm, setSearchTerm] = useState('')
  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: `
      <h2>Tiptap decorations tutorial</h2>
      <p>Tiptap is a headless editor toolkit built on ProseMirror.</p>
      <p>You can highlight words without changing the document.</p>
      <p>Try typing "tiptap" in the search box above.</p>
    `,
  })

  // 入力欄の値が変わるたびに呼ばれる
  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)

    if (!editor) return

    // 独自のコマンドが検索語を保存し、デコレーションを再構築する。
    // ストレージを直接触ったり、updateDecorations を別に呼んだりする必要はない。
    editor.commands.setSearchTerm(value)
  }

  if (!editor) {
    return null
  }

  return (
    <div>
      <div className="highlight-toolbar">
        <input
          aria-label="Search"
          placeholder="Type a word to highlight..."
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
```

処理の流れは次のとおりです。ユーザーが入力すると React の state が更新され、`setSearchTerm` コマンドが検索語を保存して再構築を起こします。すると Tiptap が `create` 関数を呼び、`create` がドキュメントを走査して新しいデコレーションを返します。

## デコレーションにスタイルを付ける

デコレーションはドキュメントに CSS クラスを追加します。目に見えるよう、次のスタイルを追加してください。

```css
/* styles.css */

/* インラインデコレーション: 各一致箇所を黄色でハイライトする */
.highlight-match {
  background: #fff3a3;
  border-radius: 2px;
}

/* ノードデコレーション: 一致箇所を含むブロックを枠線で囲む */
.has-match {
  outline: 2px solid #ffc857;
  outline-offset: 2px;
  border-radius: 2px;
}

/* ウィジェットデコレーション: 各一致箇所の後ろの番号付きバッジ */
.match-badge {
  margin-inline-start: 0.25rem;
  padding: 0.1rem 0.4rem;
  background: #1f2937;
  color: white;
  font-size: 0.75rem;
  border-radius: 0.25rem;
  vertical-align: middle;
  user-select: none;
}
```

## 次のステップ

- コアコンセプトのガイドで[デコレーションの種類と更新方式](../editor/core-concepts/decorations.md)を確認する
- すべてのシグネチャとオプションは [Decorations API リファレンス](../editor/api/decorations.md)で確認する
- フレームワークを使わずに手でウィジェットを作りたい場合は [Vanilla JS のチュートリアル](https://tiptap.dev/docs/guides/decorations-vanilla)を、Vue を使う場合は [Vue 3 のチュートリアル](https://tiptap.dev/docs/guides/decorations-vue)を参照する
