# Tiptap のデコレーション

> 原文: [https://tiptap.dev/docs/editor/core-concepts/decorations](https://tiptap.dev/docs/editor/core-concepts/decorations)

デコレーションは、エディタ内でのコンテンツの見え方を変えます。ドキュメント自体は変えません。エディタの内容を JSON や HTML として保存しても、デコレーションは含まれません。

拡張機能は `addDecorations()` でデコレーションを追加します。デコレーションの作成には `Decoration` クラスを使います。エディタへの追加は Tiptap が受け持ちます。

[デモを開く](https://embed.tiptap.dev/preview/Examples/Decorations?inline=false&hideSource=false)

## デコレーションとノードビューの使い分け

目印が見た目だけのもので、ドキュメントの外にあるならデコレーションを使います。コンテンツがドキュメントの一部なら[ノードビュー](../extensions/custom-extensions/node-views/index.md)を使います。

> [!NOTE]
> **デコレーションとノードビュー**
>
> ハイライト、検索結果、コメント、注釈、一時的な UI の目印など、ドキュメントを変えないものには
> **デコレーション**を使います。保存される独自のドキュメントコンテンツ、編集できる独自のブロック、
> ドキュメント構造を持つ複雑な埋め込み UI が必要なら **[ノード
> ビュー](../extensions/custom-extensions/node-views/index.md)** を使います。

## 3種類のデコレーション

デコレーションには3種類あり、どれも `Decoration` クラスで作ります。

- **node**: 1つのノードに CSS クラスなどの属性を追加する
- **inline**: テキストなどのインラインコンテンツの範囲にスタイルを付ける
- **widget**: ドキュメント内の1か所に DOM 要素やフレームワークのコンポーネントを追加する

## デコレーションを宣言する

拡張機能は、ライフサイクルフック `addDecorations()` でデコレーションを宣言します。このフックは `DecorationSpec` を返します（デコレーションがなければ `null`）。デコレーション自体は、`@tiptap/core` からインポートした `Decoration` クラスで作ります。

```ts
import { Decoration, Extension } from '@tiptap/core'

const MyExtension = Extension.create({
  name: 'myExtension',

  addDecorations() {
    return {
      create: ({ editor, state, view }) => [Decoration.Inline(1, 5, { class: 'highlight' })],
    }
  },
})
```

ほかの拡張機能のフックと同じく、`addDecorations()` の `this` には `{ name, options, storage, editor, type, parent }` がバインドされています。そのため、デコレーションを宣言しながらオプションやストレージを読めます。

> [!WARNING]
> **状態は editor.state ではなく引数の state から読む**
>
> `create()` と `createInRange()` の中では、ドキュメントを必ず `editor.state` ではなく引数の `state` から
> 読んでください。トランザクションの処理中はエディタのビューの状態がまだ更新されていないため、
> `editor.state` はトランザクション適用前のドキュメントを指しています。引数の `state` こそが、
> 組み立て中の正しい状態です。

### `Decoration` クラス

`Decoration` クラスには、Tiptap に何を表示させるかを表すデコレーションのインスタンスを返す静的メソッドがあります。`@tiptap/core` からインポートします。

```ts
import { Decoration } from '@tiptap/core'

// 1つのノードを装飾する（attrs はノードの DOM ラッパーに付く）
Decoration.Node(from, to, attrs, spec)

// インラインコンテンツの範囲を装飾する（スタイル付きの span で囲む）
Decoration.Inline(from, to, attrs, spec)

// ある位置にウィジェット（DOM ノード）を挿入する。`key` は必須
Decoration.Widget(pos, render, options)
```

`attrs` には `class`、`style`、`nodeName` のほか、任意の HTML 属性を指定できます（ProseMirror の `DecorationAttrs`）。

### node デコレーション

node デコレーションは、1つのノードの DOM ラッパーに属性を適用します。たとえばすべての見出しにクラスを付けて枠線を引くなら、これが最も軽い方法です。

```ts
addDecorations() {
  return {
    create: ({ state }) => {
      const decorations = []
      state.doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          decorations.push(Decoration.Node(pos, pos + node.nodeSize, { class: 'is-heading' }))
        }
      })
      return decorations
    },
  }
}
```

### inline デコレーション

inline デコレーションは、インラインコンテンツの範囲をスタイル付きの span で囲みます。ハイライトや検索結果に最適です。

```ts
Decoration.Inline(matchFrom, matchTo, { class: 'is-match' })
```

### widget デコレーション

widget デコレーションは、1か所に DOM ノードを挿入します。node や inline のデコレーションと違い、ウィジェットには `render` コールバックと、**必須で安定した `key`** が要ります。

```ts
Decoration.Widget(
  pos,
  (view, getPos) => {
    const el = document.createElement('span')
    el.textContent = '★'
    return el
  },
  { key: `marker-${pos}`, side: -1 },
)
```

`side` は、ウィジェットを位置のどちら側に置くかを決めます。ProseMirror の [`Decoration.widget`](https://prosemirror.net/docs/ref/#view.Decoration%5Ewidget) を参照してください。どのウィジェットにも `key` が必要です。

## ウィジェットのキー

widget デコレーションにはすべて、安定していて位置に依存しない `key` が必要です。ウィジェットを扱うときのバグは、これが原因であることが最も多いです。

> [!WARNING]
> **安定していてグローバルに一意なキーを選ぶ**
>
> ProseMirror が再描画のときにウィジェットの DOM を再利用するのは、**キーが前回のレンダリングと一致する場合だけ**です。
> キーが安定していないと、更新のたびにウィジェットが破棄されて作り直され、ちらつきやコンポーネントの
> 状態の消失が起きます。キーは、エディタ内のすべての widget デコレーションの中で**グローバルに一意**でなければなりません。
> キーが重複すると、ProseMirror がウィジェットの DOM を誤った位置に置き、クラッシュします。
>
> Tiptap は、1回の構築で同じキーを持つ widget デコレーションを2つ見つけると、開発時の警告を出し、
> 原因の拡張機能の名前を示します。
>
> `[tiptap warn]: Duplicate widget decoration key "<key>" in extension "<name>". Widget decoration keys must
>   be globally unique…`
>
> この警告は問題を見つける手がかりになりますが、キーを一意にする作業はやはり必要です。そうしないと、
> ProseMirror がウィジェットの DOM を誤った位置に置きます。

**良いキー**は、その項目自身の ID を使います。例: `comment-${id}`、`paragraph-${node.attrs.id}`、`suggestion-${id}`。

**悪いキー**は、不安定なものや位置に依存するものです。ループや段落のインデックス、ドキュメント内の位置（`marker-${from}`）、位置から導いた値などがこれにあたります。

1つの対象に2つのウィジェットが必要なら、接尾辞を付けます。例: `comment-${id}-start` と `comment-${id}-end`。

> [!TIP]
> **状態を持たないウィジェットは例外**
>
> デモや簡単な例の中の、状態を持たないウィジェット（静的な目印など）なら、インデックスや
> 位置に基づくキーでもかまいません。状態を持つウィジェットには、安定した項目 ID を使ってください。

## デフォルトの動作

- エディタの初期化時に、各拡張機能の `create` が1回実行され、最初のデコレーションを作ります。
- ドキュメントが変わると、デフォルトでは Tiptap がデコレーションを作り直します。
- 選択範囲だけが変わったときは、Tiptap は今のデコレーションを残し、位置だけを更新します。

## パフォーマンス

デコレーションは、デフォルトで `document` という更新方式を使います。この方式では、ドキュメントが変わるたびにデコレーションを作り直します。大きなドキュメントでは、別の方式を選ぶと処理量を減らせます。

### `shouldUpdate` で更新を省く

編集がデコレーションに影響しえない場合は、`shouldUpdate` から `false` を返します。Tiptap はデコレーションを作り直さずに残し、位置だけを更新します。

```ts
addDecorations() {
  return {
    create: ({ state }) => buildHeadingOutline(state),
    shouldUpdate: ({ tr, oldState, newState }) => {
      // 見出しの数が変わったときだけ作り直す
      return countHeadings(oldState.doc) !== countHeadings(newState.doc)
    },
  }
}
```

デフォルトでは、`shouldUpdate` はドキュメントが変わるたびに実行されます。

### 編集されたブロックには `changedRanges` を使う

`update: 'changedRanges'` と `createInRange` コールバックを指定すると、ドキュメントが変わったときにマネージャーは次の処理をします。

1. 今のデコレーションの位置を更新する。
2. トランザクションで変更された範囲を計算し、それを**囲んでいるトップレベルのブロックの境界**まで広げる。こうすることで、編集箇所そのものにまたがる一致（たとえば単語の途中での入力）も、範囲内にすべて収まる。
3. それらのブロックに置かれていた古いデコレーションを取り除き、`createInRange({ state, from, to })` を呼んで**そのブロックだけ**を作り直す。

通常の編集中、Tiptap は `create` を呼びません。`create` を呼ぶのは、エディタの起動時と [`updateDecorations()`](#build-decorations-again) を呼んだときだけです。これで、キーを押すたびにドキュメント全体を走査せずに済みます。

`createInRange` が受け取る `from`/`to` は**ブロック単位にそろえた**値で、その範囲内のデコレーションだけを返さなければなりません。通常は、走査用のヘルパーを `create` と共有します。

```ts
addDecorations() {
  const scan = (editor, state, from, to) => {
    const decorations = []
    state.doc.nodesBetween(from, to, (node, pos) => {
      // …[from, to] 内のノードやテキストのデコレーションを作る…
    })
    return decorations
  }

  return {
    update: 'changedRanges',
    create: ({ editor, state }) => scan(editor, state, 0, state.doc.content.size),
    createInRange: ({ editor, state, from, to }) => scan(editor, state, from, to),
  }
}
```

> [!WARNING]
> **createInRange の約束事**
>
> `createInRange` が返してよいのは、開始位置が `[from, to)` の中にあるデコレーション**だけ**です。
> 開始位置とは、inline と node のデコレーションなら `from`、widget デコレーションなら `pos` です。`to` は範囲に含みません。
> `to` は次のブロックの開始位置で、そのブロックを作り直すときに扱われるため、`to` に置かれたデコレーションは無視されます。
> 例外は最後のブロックで、ドキュメントの末尾を受け持ちます。`from` より前に置かれたデコレーションは、
> マネージャーが取り除かなかった隣のブロックに属します。それを返すと、重複したデコレーションが残り、二度と片付けられません。
> 渡された範囲の外のコンテンツに依存するデコレーションなら、代わりに `document` 方式を使ってください。

この組み合わせは TypeScript が強制します。`update: 'changedRanges'` には `createInRange` が必須で、ほかの方式では `createInRange` を指定できません。

> [!WARNING]
> **差分更新モードが正しく動くのは、ブロック内で完結するデコレーションだけ**
>   差分更新モードが正しく動くのは、**各デコレーションが、自分のブロックや範囲の中のコンテンツだけに依存する場合に限られます。**
>   Tiptap が走査し直すのは、編集されたブロックだけです。ほかのブロックのデコレーションは確認しません。
>
> **安全（ブロック内で完結）:** 「ある単語の出現箇所をすべてハイライトする」「すべての見出しに枠線を引く」「綴りの誤った
> 単語に下線を引く」。どのデコレーションも、自分のブロックだけに依存します。
>
> **安全でない（ドキュメント全体に依存）:** デフォルトの `document` 方式と `create` を使うか、
> `updateDecorations()` で全体の作り直しを強制してください。
>
> - 順序や数を数える処理: 「最初の一致だけをハイライトする」「3回目ごとの出現箇所に色を付ける」
> - ドキュメント全体にまたがる関係: 「ドキュメント中で重複している単語に印を付ける」
> - 構造上の関係: 「最初の見出しに特別なクラスを付ける」
> - 選択範囲や外部の状態に依存するもの全般。変更範囲に基づく更新は、_コンテンツ_の変更にしか反応しません。
>   選択範囲や状態が変わったときは、代わりに `updateDecorations()` を呼んでください。

### 外部の状態には `manual` を使う

ドキュメントのトランザクションで既存のデコレーションを新しい位置へ移すだけにしたいなら、`update: 'manual'` を使います。manual のデコレーションが作り直されるのは、初期化時と `updateDecorations()` を呼んだときだけです。

検索語やフィルターなど、ドキュメントの外の値にデコレーションが依存する場合は manual 方式を使います。`shouldUpdate` や `createInRange` とは併用できません。

## デコレーションを作り直す

検索語やフィルターなど、ドキュメントの外のものにデコレーションが依存することがあります。その値が変わったら `updateDecorations` を呼びます。

```ts
editor.commands.updateDecorations() // すべての拡張機能を更新する
editor.commands.updateDecorations('myExtension') // 1つの拡張機能を更新する
```

`updateDecorations` は常に、ドキュメント全体を対象に `create` を呼びます。この更新では、更新方式と `shouldUpdate` は無視されます。

### ストレージで実行時のパラメーターを渡す

変化する値は、拡張機能の [`storage`](../extensions/custom-extensions/create-new/extension.md#addstorage) に入れておきます。`create` の中でその値を読み、値を変えたら `updateDecorations` を呼びます。

```ts
editor.storage.myExtension.term = 'foo'
editor.commands.updateDecorations('myExtension')
```

## フレームワークのコンポーネントをウィジェットとしてレンダリングする

widget デコレーションでは、React や Vue のコンポーネントをレンダリングできます。コンポーネントはエディタの React や Vue のアプリ内に置かれたままなので、フック、コンテキスト、`provide`/`inject` もそのまま使えます。

[デモを開く](https://embed.tiptap.dev/preview/Examples/DecorationComponents?inline=false&hideSource=false)

### React: `ReactWidgetRenderer`

`ReactWidgetRenderer` を `@tiptap/react` からインポートします。これは `WidgetDecoration` を返すので、`Decoration.Node` や `Decoration.Inline` と同じように `create` や `createInRange` から返します。コンポーネントには、props として `editor` と `getPos` も渡されます。

```tsx
import { Extension } from '@tiptap/core'
import { ReactWidgetRenderer } from '@tiptap/react'
import type { Editor } from '@tiptap/core'

function CommentMarker({
  editor,
  getPos,
  label,
}: {
  editor: Editor
  getPos: () => number | undefined
  label: string
}) {
  return <button onClick={() => console.log(getPos())}>{label}</button>
}

const Comments = Extension.create({
  name: 'comments',

  addDecorations() {
    return {
      create: ({ editor, state }) =>
        findComments(state.doc).map((c) =>
          ReactWidgetRenderer(CommentMarker, {
            editor,
            pos: c.pos,
            key: `comment-${c.id}`, // 安定したドメインのキー → コンポーネントの状態が保たれる
            props: { label: c.label },
          }),
        ),
    }
  },
})
```

知っておくとよい点があります。

- `create` や `createInRange` が再実行されると、Tiptap は新しい `props` を渡します。同じキーならレンダラーを再利用するので、コンポーネントは状態を保ちます。
- キャッシュは、エディタが破棄されるときに片付けられます。

### Vue: `VueWidgetRenderer`

`VueWidgetRenderer` を `@tiptap/vue-3`（または `@tiptap/vue-2`）からインポートします。内部で Tiptap の `VueRenderer` を再利用するので、コンポーネントはエディタのアプリのコンテキストを共有します（`provide`/`inject` が使えます）。コンポーネントには、指定した `props` に加えて `editor` と `getPos` が渡されます。

```ts
import { Extension } from '@tiptap/core'
import { VueWidgetRenderer } from '@tiptap/vue-3'
import CommentMarker from './CommentMarker.vue'

const Comments = Extension.create({
  name: 'comments',

  addDecorations() {
    return {
      create: ({ editor, state }) =>
        findComments(state.doc).map((c) =>
          VueWidgetRenderer(CommentMarker, {
            editor,
            pos: c.pos,
            key: `comment-${c.id}`,
            props: { label: c.label },
          }),
        ),
    }
  },
})
```

> [!WARNING]
> **Vue 固有の注意点**
>
> コンポーネントは**ルート要素を1つだけレンダリングしなければなりません**。`editor` は意図的に
> そのまま（`markRaw` 付きで）渡しています。リアクティブにラップしないでください。

## 実例: 検索語のハイライト

この例では、3種類のデコレーションと差分更新モードをすべて使います。ある語の出現箇所をすべてハイライトし（inline）、一致箇所の前に星の目印を表示し（widget）、すべての見出しに枠線を引きます（node）。検索語はストレージに置き、実行時に `updateDecorations` で変えます。

一致箇所も見出しも自分のブロックだけに依存するので、ここでは `update: 'changedRanges'` を安全に使えます。

```ts
import { Decoration, Extension } from '@tiptap/core'
import type { Editor } from '@tiptap/core'
import type { EditorState } from '@tiptap/pm/state'

export interface HighlightOptions {
  term: string
}
export interface HighlightStorage {
  term: string
}

declare module '@tiptap/core' {
  interface Storage {
    highlight: HighlightStorage
  }
}

export const Highlight = Extension.create<HighlightOptions, HighlightStorage>({
  name: 'highlight',

  addOptions: () => ({ term: 'tiptap' }),

  addStorage() {
    return { term: this.options.term }
  },

  addDecorations() {
    const scan = (editor: Editor, state: EditorState, from: number, to: number) => {
      const decorations: Decoration[] = []
      const term = editor.storage.highlight.term.trim().toLowerCase()

      state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.name === 'heading') {
          decorations.push(Decoration.Node(pos, pos + node.nodeSize, { class: 'is-heading' }))
        }
        if (!term || !node.isText || !node.text) return

        const text = node.text.toLowerCase()
        let index = text.indexOf(term)
        while (index !== -1) {
          const matchFrom = pos + index
          const matchTo = matchFrom + term.length
          decorations.push(Decoration.Inline(matchFrom, matchTo, { class: 'is-match' }))
          decorations.push(
            Decoration.Widget(
              matchFrom,
              () => {
                const el = document.createElement('span')
                el.textContent = '★'
                return el
              },
              { key: `marker-${matchFrom}`, side: -1 }, // 状態を持たない → 位置ベースのキーで問題ない
            ),
          )
          index = text.indexOf(term, index + term.length)
        }
      })
      return decorations
    }

    return {
      update: 'changedRanges', // 一致箇所も見出しもブロック内で完結する → 安全
      create: ({ editor, state }) => scan(editor, state, 0, state.doc.content.size),
      createInRange: ({ editor, state, from, to }) => scan(editor, state, from, to),
    }
  },
})
```

検索語を変えるには、ストレージを更新してデコレーションを作り直します。

```ts
editor.storage.highlight.term = 'editor'
editor.commands.updateDecorations('highlight')
```

## 次のステップ

- すべてのシグネチャとオプションは、[Decorations API リファレンス](../api/decorations.md)を参照してください。
- [Vanilla JS のチュートリアル](https://tiptap.dev/docs/guides/decorations-vanilla)、[React のチュートリアル](../../guides/decorations-react.md)、[Vue 3 のチュートリアル](https://tiptap.dev/docs/guides/decorations-vue)で、検索語のハイライトを作ってみてください。
- [`addDecorations` フック](../extensions/custom-extensions/create-new/extension.md#adddecorations)が拡張機能のライフサイクルのどこに位置するかを確認してください。
- 保存されて編集できる独自のコンテンツが必要なら、[ノードビュー](../extensions/custom-extensions/node-views/index.md)と比べてみてください。
