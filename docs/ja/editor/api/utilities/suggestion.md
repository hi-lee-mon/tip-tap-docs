# サジェストユーティリティ

> 原文: [https://tiptap.dev/docs/editor/api/utilities/suggestion](https://tiptap.dev/docs/editor/api/utilities/suggestion)

このユーティリティは、エディタでのあらゆる種類の候補表示（サジェスト）を支援します。実際の動きは [`Mention`](../../extensions/nodes/mention.md) ノードや [`Emoji`](../../extensions/nodes/emoji.md) ノードで確認できます。

## 設定

### char

入力補完のポップアップを開くきっかけになる文字です。

デフォルト: `'@'`

### pluginKey

ProseMirror の PluginKey です。

デフォルト: `SuggestionPluginKey`

### allow

サジェストを有効にするかどうかを真偽値で返す関数です。

デフォルト: `(props: { editor: Editor; state: EditorState; range: Range, isActive?: boolean }) => true`

### shouldShow

サジェストを有効にするかどうかを真偽値で返す関数です。共同編集の環境で、リモートのユーザーの操作によってサジェストが開くのを防ぐのに役立ちます。

```js
shouldShow: ({ editor, range, query, text, transaction }) => {
  return !isChangeOrigin(transaction)
}
```

デフォルト: `null`

### shouldResetDismissed

ユーザーが Escape や `exitSuggestion()` で閉じたサジェストを、いつ再び有効にするかを制御します。

デフォルトでは、ユーザーが同じトリガーの文脈にいる間、閉じたサジェストは閉じたままです。`allowSpaces: true` の場合、閉じた文脈はカーソルがそこを離れるまで空白をまたいで続きます。

閉じた文脈をいつ解除するかを自分で決めたい場合は、`shouldResetDismissed` を使います。

このコールバックはトランザクションのたびに呼ばれるわけではありません。評価されるのは、サジェストのプラグインが有効なマッチを見つけ、そのマッチが `allow` と `shouldShow` を通過し、かつ解除の対象になりうる「閉じた」状態があるトランザクションだけです。

```js
Suggestion({
  // ...
  shouldResetDismissed: ({ transaction, allowSpaces, range, match }) => {
    if (!allowSpaces) {
      return false
    }

    return transaction.doc.textBetween(range.from, match.range.to, '\n').includes('.')
  },
})
```

`true` を返すと、現在のトランザクションで閉じた状態が解除され、サジェストが再び開けるようになります。

デフォルト: `null`

### allowSpaces

候補の項目に空白を含めてよいかどうかです。`allowToIncludeChar` とは併用できません。`allowToIncludeChar` が `true` の場合、このオプションは無効になります。

デフォルト: `false`

### allowToIncludeChar

トリガー文字そのものをサジェストのクエリに含めてよいかどうかです。`allowSpaces` とは併用できません。

デフォルト: `false`

### allowedPrefixes

サジェストのきっかけとして許可する、直前の文字です。`null` にすると、どの文字が前にあっても許可します。

デフォルト: `[' ']`

### startOfLine

行頭でだけ入力補完のポップアップを開きます。

デフォルト: `false`

### minQueryLength

`items()` 関数が呼ばれるまでに、トリガー文字の後ろでユーザーが入力しなければならない最小の文字数です。

API から候補を取得する場合に便利です。意味をなさないほど短いクエリで、無駄なネットワークリクエストが飛ぶのを防げます。

デフォルト: `0`

```js
Suggestion({
  minQueryLength: 2,
  items: async ({ query, signal }) => {
    // query.length >= 2 のときだけ呼ばれる
    const response = await fetch(`/api/search?q=${query}`, { signal })
    return response.json()
  },
})
```

### debounce

ユーザーが入力を止めてから `items()` を呼ぶまでの待ち時間（ミリ秒）です。キー入力のたびに重い処理（API リクエストなど）が走るのを防ぎます。

デバウンスのタイマーはキー入力のたびにリセットされます。そのため `items()` 関数は、ユーザーが指定した時間だけ入力を止めたときに 1 回だけ呼ばれます。

デフォルト: `0`（デバウンスなし）

```js
Suggestion({
  debounce: 300,
  items: async ({ query }) => {
    // ユーザーが入力を止めてから 300ms 後に呼ばれる
    return searchApi(query)
  },
})
```

### initialItems

サジェストのポップアップが開いたとき、非同期の `items()` の結果が返る前にすぐ表示する項目の配列です。`items()` が完了すると、その結果で初期項目が置き換わります。

本来の結果を読み込んでいる間、最近使った項目や人気の項目を見せたいときに便利です。

```js
Suggestion({
  initialItems: ['Lea Thompson', 'Cyndi Lauper', 'Tom Cruise'],
  items: async ({ query }) => {
    // 結果が返ると、初期項目がこれで置き換わる
    return fetchSearchResults(query)
  },
})
```

デフォルト: `undefined`

### decorationTag

サジェスト部分にレンダリングする HTML タグです。

デフォルト: `'span'`

### decorationClass

サジェスト部分に付ける CSS クラスです。

デフォルト: `'suggestion'`

### decorationContent

サジェストのデコレーションの中にレンダリングするコンテンツです。

デフォルト: `''`

### decorationEmptyClass

サジェスト部分が空のときに付ける CSS クラスです。

デフォルト: `'is-empty'`

### placement

カーソルまたはトリガーのデコレーションに対して、サジェストのポップアップをどこに置きたいかを指定します。値は [Floating UI の placement の値](https://floating-ui.com/docs/computePosition#placement)を使います。

確定した配置は `SuggestionProps.floatingUi.placement` に渡され、レンダリングのコールバック内で読めます。

デフォルト: `'bottom-start'`

```js
Suggestion({
  placement: 'top-start',
})
```

### offset

サジェストのポップアップを、基準の位置から各軸方向に指定したピクセル数だけずらします。値は Floating UI の [`offset` ミドルウェア](https://floating-ui.com/docs/offset)に渡されます。

デフォルト: `{ mainAxis: 4, crossAxis: 0 }`

```js
Suggestion({
  offset: { mainAxis: 8, crossAxis: 4 },
})
```

### flip

有効にすると、指定した方向に十分な空きがないとき、ポップアップが自動で反対側に反転します。Floating UI の [`flip` ミドルウェア](https://floating-ui.com/docs/flip)のオン・オフを切り替えます。

デフォルト: `true`

```js
Suggestion({
  placement: 'top-start',
  flip: false,
})
```

### container

サジェストのポップアップを入れるコンテナを、CSS セレクターの文字列または `HTMLElement` で指定します。スクロールの範囲や z-index の重なり順の問題を解決するのに役立つことがあります。

デフォルト: `undefined`

```js
Suggestion({
  container: '#my-editor-container',
})
```

### floatingUi

トップレベルのオプションでは細かく制御しきれない場合に使う、Floating UI の高度な設定です。基準の位置と配置はプラグインが管理し続けます（配置の向きはトップレベルの [`placement`](#placement) オプションで指定します）。`floatingUi` では、位置決めの `strategy` を切り替えたり、`middleware` を追加したりできます。

渡したミドルウェアは、トップレベルの `offset` と `flip` オプションからプラグインが作る `offset`・`flip` ミドルウェアの _後ろに_ 追加されます。両者は置き換わるのではなく組み合わさります。

```js
import { shift, size } from '@floating-ui/dom'

Suggestion({
  placement: 'top-start',
  floatingUi: {
    strategy: 'fixed',
    middleware: [shift({ padding: 8 }), size()],
  },
})
```

プロパティはすべて省略可能です。型の全体は次のとおりです。

```ts
type SuggestionFloatingUiOptions = {
  strategy?: 'absolute' | 'fixed'
  middleware?: Middleware[]
}
```

デフォルト: `undefined`

### dismissOnOutsideClick

`true` にすると、ポップアップとエディタのどちらでもない場所をポインターで操作したときに、有効なサジェストが閉じます。これは[管理された位置決め](#managed-positioning-with-propsmount)（`props.mount`）でポップアップをレンダリングした場合にだけ働きます。何が「外側」かを判断するには、どの要素がポップアップなのかをプラグインが知っている必要があるためです。

デフォルト: `true`

### command

候補が選ばれたときに実行されます。

デフォルト: `() => {}`

### items

ユーザーの入力に応じて絞り込んだ候補を返す関数、または非同期関数です。関数は `AbortSignal`（`signal`）を受け取ります。このシグナルは、ユーザーが入力を続けたとき（新しいキー入力で現在のリクエストが古くなったときなど）に中断されます。進行中の fetch リクエストのキャンセルに使ってください。

```js
items: async ({ editor, query, signal }) => {
  const response = await fetch(`/api/search?q=${query}`, { signal })
  return response.json()
}
```

デフォルト: `({ editor, query, signal }) => []`

### render

入力補完のポップアップのレンダリング関数です。`SuggestionProps` オブジェクトを受け取るライフサイクルフック（`onStart`、`onBeforeStart`、`onUpdate`、`onBeforeUpdate`、`onExit`、`onKeyDown`）を持つオブジェクトを返します。

各フックに渡される `SuggestionProps` オブジェクトには、既存の `editor`、`range`、`query`、`text`、`items`、`command`、`decorationNode`、`clientRect` に加えて、次のプロパティがあります。

```ts
{
  /** ポップアップ要素をマウントし、位置決めを引き受ける。サジェストの
   *  ポップアップをレンダリングする推奨のデフォルトの方法（下の「位置決め」を参照）。
   *  `onExit` で呼ぶための `unmount` 関数を返す。 */
  mount: (element: HTMLElement, options?: SuggestionMountOptions) => () => void

  /** 非同期の items() 呼び出しが進行中なら true、そうでなければ false。
   *  items() が Promise を返す場合にだけ意味を持つ。 */
  loading: boolean

  /** 確定した位置決めのオプション。サジェストのオプションからそのまま渡されるので、
   *  レンダリングのコールバック内で読める。 */
  placement: SuggestionPlacement
  offset: { mainAxis: number; crossAxis: number }
  flip: boolean
  container?: string | HTMLElement

  /** 確定した Floating UI の設定。そのまま `computePosition()` に渡せる。
   *  `mount()` を使わずに、自前の位置決めループを回すための逃げ道。 */
  floatingUi: {
    placement: SuggestionPlacement
    strategy: 'absolute' | 'fixed'
    middleware: Middleware[]
  }
}
```

デフォルト: `() => ({})`

### findSuggestionMatch

サジェストのきっかけを判定する、エディタのコンテンツに対する組み込みの正規表現マッチングを置き換えるための引数です（省略可）。
詳しくは[ソースコード](https://github.com/ueberdosis/tiptap/blob/main/packages/suggestion/src/findSuggestionMatch.ts#L18)を参照してください。

デフォルト: `findSuggestionMatch(config: Trigger): SuggestionMatch`

## 非同期の動作

`items()` 関数が `Promise` を返す場合、サジェストのプラグインは非同期のライフサイクルを自動で扱います。

1. **初期状態:** ポップアップが開き、`loading` が `true` になります。`initialItems` を指定していれば、その項目がすぐに表示されます。
2. **取得中:** `items()` 関数が `AbortSignal` 付きで呼ばれます。ユーザーが入力を続けると、前のリクエストのシグナルが中断され、`debounce` の待ち時間のあとで新しいリクエストが始まります。
3. **解決:** Promise が解決すると、返された項目で現在の項目が置き換わり、`loading` が `false` になります。新しい `SuggestionProps` を引数に `onUpdate` コールバックが呼ばれます。
4. **空の状態:** `items()` 関数を指定していないか、空の配列が返された場合、ポップアップは空の状態を表示します。取得中でない限り、`loading` は `false` のままです。
5. **閉じる:** ポップアップが閉じると（ユーザーが Escape を押したときなど）、進行中のリクエストは自動で中断されます。

完全な例を示します。

```js
Suggestion({
  minQueryLength: 2,
  debounce: 300,
  initialItems: ['Lea Thompson', 'Cyndi Lauper'],
  items: async ({ query, signal }) => {
    // API 呼び出しの模擬。クエリが変わると中断される
    const response = await fetch(`/api/users?q=${query}`, { signal })
    const data = await response.json()
    return data.slice(0, 5)
  },
  render: () => {
    let component
    let unmount

    return {
      onStart(props) {
        component = new ReactRenderer(MyList, {
          props,
          editor: props.editor,
        })
        // ポップアップのマウントと位置決めはプラグインに任せる
        unmount = props.mount(component.element)
      },
      onUpdate(props) {
        // `props.loading` は取得中なら true、そうでなければ false
        // `props.items` には解決したデータ（解決前は initialItems）が入る
        component.updateProps(props)
      },
      onExit() {
        unmount?.()
        component.destroy()
      },
    }
  },
})
```

## 位置決め

サジェストユーティリティは、ポップアップの位置決めに [Floating UI](https://floating-ui.com/) を使います。ポップアップの位置決めには 2 つの方法があります。

- **`props.mount` による管理された位置決め** — 推奨のデフォルトです。プラグインが要素をマウントし、カーソルに合わせて配置し、その位置を保ちます。
- **手動の位置決め** — 逃げ道です。要素を自分でマウントし、`props.floatingUi` と `props.clientRect` を使って自前の位置決めループを回します。

### `props.mount` による管理された位置決め

`render` のコールバック内で、レンダリングしたポップアップ要素（たとえば `ReactRenderer` や `VueRenderer` の `element`）を渡して `props.mount(element)` を呼びます。するとプラグインは次のことを行います。

- 要素を、設定した [`container`](#container)（デフォルトは `document.body`）に追加する
- [`placement`](#placement)、[`offset`](#offset)、[`flip`](#flip)、[`floatingUi`](#floatingui) の各オプションに従い、サジェストのカーソルの矩形を基準に配置する
- Floating UI の [`autoUpdate`](https://floating-ui.com/docs/autoUpdate) により、スクロール、リサイズ、レイアウトのずれに合わせて自動で位置を直す（リスナーを自分で書く必要はない）
- [`dismissOnOutsideClick`](#dismissonoutsideclick) が有効なら、外側のクリックで閉じる

`mount()` は `unmount` 関数を返します。自動更新のループと外側クリックのリスナーを片付ける（プラグインが要素を追加した場合はその要素も取り除く）ために、**`onExit` で必ず呼んでください**。忘れるとリスナーがリークし、DOM に取り残されたポップアップが残ります。

```js
import { ReactRenderer } from '@tiptap/react'
import DropdownList from './DropdownList.jsx'

Suggestion({
  placement: 'top-start',
  offset: { mainAxis: 8 },
  items: ({ query }) => fetchItems(query),
  render: () => {
    let component
    let unmount = null

    return {
      onStart(props) {
        component = new ReactRenderer(DropdownList, {
          props,
          editor: props.editor,
        })

        // プラグインが要素をマウントして配置し、その位置を保つ
        unmount = props.mount(component.element)
      },
      onUpdate(props) {
        component.updateProps(props)
        // 位置を直す呼び出しは不要。autoUpdate が位置を保つ
      },
      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          component.destroy()
          return true
        }
        return component.ref?.onKeyDown(props)
      },
      onExit() {
        unmount?.()
        component.destroy()
      },
    }
  },
})
```

> [!NOTE]
> **注意**
>
> 渡した要素がすでに DOM に追加されている場合、プラグインはその要素を移動も削除もせず、位置決め
> だけを行います。この場合、要素のマウントとアンマウントは引き続き自分で行う必要があります。
> DOM の管理をプラグインに任せたいなら、DOM に追加していない要素を渡してください。

### placement、offset、flip を設定する

管理されたポップアップの表示位置は、トップレベルの [`placement`](#placement)、[`offset`](#offset)、[`flip`](#flip) オプションで制御します。

```js
Suggestion({
  placement: 'top-start',
  offset: { mainAxis: 8, crossAxis: 0 },
  flip: true,
})
```

位置決めの `strategy` を変えたり、独自のミドルウェア（`shift` や `size` など）を使ったりするには、[`floatingUi`](#floatingui) オプションを追加します。その `middleware` は、プラグイン自身の `offset`・`flip` ミドルウェアの後ろに追加されます。

```js
import { shift, size } from '@floating-ui/dom'

Suggestion({
  placement: 'bottom-end',
  floatingUi: {
    strategy: 'fixed',
    middleware: [
      shift({ padding: 16 }),
      size({
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
            maxHeight: `${availableHeight}px`,
          })
        },
      }),
    ],
  },
})
```

### 位置の適用方法をカスタマイズする

デフォルトでは、管理されたポップアップの位置は、要素の style に `position`、`left`、`top` を書き込んで適用します（また、間違った座標で一瞬表示されないよう、最初の計測が終わるまで要素は非表示になります）。

CSS の transform、アニメーション、フレームワークの ref への書き込みなど、別の方法で位置を適用したい場合は、mount のオプションに `onPosition` コールバックを渡します。すると、プラグインは自分で style を書き込むのをやめ、計算した座標を渡してくれます。

```js
onStart(props) {
  component = new ReactRenderer(DropdownList, { props, editor: props.editor })

  unmount = props.mount(component.element, {
    onPosition({ x, y, placement, strategy }) {
      Object.assign(component.element.style, {
        position: strategy,
        transform: `translate(${x}px, ${y}px)`,
      })
    },
  })
}
```

> [!NOTE]
> **注意**
>
> `onPosition` を渡すと、プラグインは最初の計測前に要素を非表示にしなくなります。一瞬間違った
> 位置に表示されないよう、初期位置は自分で適用してください。

### アニメーションや transform で動く基準要素に追従する

`autoUpdate` は、もともとスクロール、リサイズ、レイアウトのずれに反応します。transform やアニメーションが適用されたコンテナの中など、基準要素が絶えず動く場合は、[`autoUpdate` のオプション](https://floating-ui.com/docs/autoUpdate#options)を渡してフレームごとの更新を有効にしてください。

```js
unmount = props.mount(component.element, {
  autoUpdate: { animationFrame: true },
})
```

### コンテナの中にマウントする

モーダルやダイアログなど、特定の重なり順やスクロールの文脈の中でポップアップをレンダリングするには、[`container`](#container) オプションを設定します。管理されたポップアップは、`document.body` ではなくそこに追加されます。

```js
Suggestion({
  container: '#my-dialog',
})
```

文字列は CSS セレクターとして扱われます。`HTMLElement` を直接渡すこともできます。セレクターに一致する要素がない（またはセレクターが不正な）場合、プラグインは `document.body` を代わりに使います。

### 手動の位置決め（逃げ道）

マウントと位置決めを完全に自分で制御したい場合は、`props.mount` をまったく使わずに済ませます。要素を自分でマウントし、確定済みの `props.floatingUi` の設定と `props.clientRect` を使って、自前の Floating UI のループを回してください。この場合は DOM を自分で管理しているので、`onUpdate` での位置の再計算と `onExit` での後始末も自分で行う必要があります。

```js
import { computePosition, shift } from '@floating-ui/dom'
import { ReactRenderer } from '@tiptap/react'

function reposition(props, element) {
  const reference = { getBoundingClientRect: () => props.clientRect() }

  computePosition(reference, element, props.floatingUi).then(({ x, y, strategy }) => {
    Object.assign(element.style, {
      position: strategy,
      left: `${x}px`,
      top: `${y}px`,
    })
  })
}

Suggestion({
  floatingUi: {
    strategy: 'fixed',
    middleware: [shift({ padding: 8 })],
  },
  render: () => {
    let component

    return {
      onStart(props) {
        component = new ReactRenderer(DropdownList, { props, editor: props.editor })

        if (!props.clientRect) {
          return
        }

        document.body.appendChild(component.element)
        reposition(props, component.element)
      },
      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        reposition(props, component.element)
      },
      onExit() {
        component.element.remove()
        component.destroy()
      },
    }
  },
})
```

> [!WARNING]
> **注意**
>
> 手動の位置決めでは `onUpdate` のときにしか位置を直さないため、自分でリスナー（または Floating UI の
> `autoUpdate`）を組み込まない限り、ポップアップはスクロール、リサイズ、レイアウトのずれに追従しません。
> `props.mount` ならこれらをすべて処理してくれます。推奨の方法とされているのはこのためです。

[デモを開く](https://embed.tiptap.dev/preview/Examples/SuggestionPositioning)

## 開いているサジェストを閉じる

項目を選ばずに、開いているサジェストを閉じられるようにしたい場合があります。ユーザーは Escape を押せば、開いているサジェストを閉じられます。
サジェストをプログラムから閉じたい場合は、`exitSuggestion` ユーティリティ関数を使って、ビュー上の既存のサジェストを閉じられます。

```js
import { exitSuggestion } from '@tiptap/suggestion'
import { PluginKey } from 'prosemirror-state' // 独自のキーを作る必要がある場合のみ

const MySuggestionPluginKey = new PluginKey('my-suggestions') // またはデフォルトの 'suggestion' を使う

exitSuggestion(editor.view, MySuggestionPluginKey)

// デフォルトのプラグインキーを使う場合:
// exitSuggestion(editor.view, 'suggestion')
```

## 共同編集

共同編集の環境で Tiptap を使うと、1 人のユーザーがサジェスト（メンションなど）を呼び出したときに、全ユーザーの画面でサジェストが開いてしまうことがあります。ドキュメントの変更が全クライアントに同期され、各クライアントのサジェストのプラグインがその変更に反応するためです。

これを防ぐには、`shouldShow` オプションと `@tiptap/extension-collaboration` の `isChangeOrigin` ヘルパーを組み合わせます。

```js
import { isChangeOrigin } from '@tiptap/extension-collaboration'

Suggestion({
  // …
  shouldShow: ({ transaction }) => {
    return !isChangeOrigin(transaction)
  },
})
```

`!isChangeOrigin(props.transaction)` を返すことで、現在のユーザー自身が変更を起こした場合にだけサジェストが有効になります。

## ソースコード

[packages/suggestion/](https://github.com/ueberdosis/tiptap/blob/main/packages/suggestion/)
