# Link 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/marks/link](https://tiptap.dev/docs/editor/extensions/marks/link)

Link 拡張機能は、エディタで `<a>` タグを使えるようにします。この拡張機能もヘッドレスで、リンクを追加・変更・削除する UI は付いていません。下の使用例では、仕組みを示すために JavaScript 標準の prompt を使っています。

実際のアプリケーションでは、もっと作り込んだ UI を用意することになるでしょう。

貼り付けた URL は自動でリンクに変わります。

[デモを開く](https://embed.tiptap.dev/preview/Marks/Link)

## インストール

```bash
npm install @tiptap/extension-link
```

## 設定

### protocols

リンクとして認識させたい独自のプロトコルを追加します。

デフォルト: `[]`

```js
Link.configure({
  protocols: ['ftp', 'mailto'],
})
```

デフォルトでは、[linkify](https://linkify.js.org/docs/) がプロトコルの末尾に `//` を付けます。この動作は `optionalSlashes` オプションで変えられます。

```js
Link.configure({
  protocols: [
    {
      scheme: 'tel',
      optionalSlashes: true,
    },
  ],
})
```

### autolink

有効にすると、入力中に自動でリンクを付けます。

デフォルト: `true`

```js
Link.configure({
  autolink: false,
})
```

### openOnClick

有効にすると、クリックでリンクが開きます。

デフォルト: `true`

```js
Link.configure({
  openOnClick: false,
})
```

### enableClickSelection

有効にすると、リンクをクリックしたときにそのリンクが選択されます。

デフォルト: `false`

```js
Link.configure({
  enableClickSelection: true,
})
```

### linkOnPaste

貼り付けたコンテンツが URL だけのとき、現在の選択範囲にリンクを付けます。

デフォルト: `true`

```js
Link.configure({
  linkOnPaste: false,
})
```

### defaultProtocol

プロトコルが指定されていないときに、`linkOnPaste` と `autolink` が使うデフォルトのプロトコルです。

デフォルトでは、example.com から生成される href は http://example.com になります。このオプションで、そのプロトコルを変えられます。

デフォルト: `http`

```js
Link.configure({
  defaultProtocol: 'https',
})
```

### HTMLAttributes

レンダリングされる HTML タグに追加する独自の HTML 属性です。

```js
Link.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

#### 既存の HTML 属性を取り除く・上書きする

HTMLAttributes に `rel: null` を指定すると、デフォルトの `rel="noopener noreferrer nofollow"` を取り除けます。`rel: "your-value"` でデフォルト値を上書きすることもできます。

同じ方法で、`target` をデフォルト値の `_blank` から変えることもできます。

```js
Link.configure({
  HTMLAttributes: {
    // rel を別の値に変える
    // 検索エンジンがリンクをたどれるようにする（nofollow を外す）
    rel: 'noopener noreferrer',
    // target 自体を取り除き、リンクを今のタブで開くようにする
    target: null,
  },
})
```

### isAllowedUri

リンクの検証方法をカスタマイズし、デフォルトの検証ロジックを変える関数です。URL と、追加のプロパティを持つコンテキストオブジェクトを受け取ります。

**引数:**

- `url`: 検証する URL。
- `ctx`: 次のものを含むオブジェクト。
  - `defaultValidate`: デフォルトの URL 検証を行う関数。
  - `protocols`: その URL に許可するプロトコルの配列。例: `["http", "https"]`。
  - `defaultProtocol`: デフォルトのプロトコル（例: `'http'`）。

**戻り値:** `boolean` - URL が正しければ `true`、そうでなければ `false`。

この関数を使うと、URL を自動リンクにするときに、許可するプロトコルやドメインのルールを強制できます。

```js
// 相対 URL 以外だけを受け付けるように URL を検証する
Link.configure({
  isAllowedUri: (url, ctx) => ctx.defaultValidate(url) && !url.startsWith('./'),
})
```

### validate（非推奨）

この関数は非推奨になりました。代わりに、名前から役割が分かりやすい `shouldAutoLink` 関数を使ってください。`validate` 関数を指定すると、`shouldAutoLink` 関数の代わりに使われます。

### shouldAutoLink

正しいリンクを、エディタのコンテンツ内で自動でリンクにするかを決めます。

**引数:**

- `url`: すでに検証を通った URL。

**戻り値:** `boolean` - 自動でリンクにするなら `true`、しないなら `false`。

この関数を使うと、URL に応じて自動リンクの動作を制御できます。

```js
// 例: 安全な URL だけを自動でリンクにする
Link.configure({
  shouldAutoLink: (url) => url.startsWith('https://'),
})
```

## コマンド

### setLink()

選択したテキストにリンクを付けます。

```js
editor.commands.setLink({ href: 'https://example.com' })
editor.commands.setLink({ href: 'https://example.com', target: '_blank' })
```

### toggleLink()

選択したテキストのリンクを付けたり外したりします。

```js
editor.commands.toggleLink({ href: 'https://example.com' })
editor.commands.toggleLink({ href: 'https://example.com', target: '_blank' })
```

### unsetLink()

リンクを外します。

```js
editor.commands.unsetLink()
```

## キーボードショートカット

> [!NOTE]
> **キーボードショートカットなし**
>
> この拡張機能は、特定のキーボードショートカットを割り当てていません。ただ、独自の UI を
> `Mod-k` で開くようにするのが一般的でしょう。

## 現在の値を取得する

[`getAttributes`](../../api/editor.md#getattributes) を使うと、今どの属性（たとえばどの href）が設定されているかを調べられます。状態を変える[コマンド](../../api/commands/index.md)と混同しないでください。これはただのメソッドです。使い方は次のとおりです。

```js
this.editor.getAttributes('link').href
```

## ソースコード

[packages/extension-link/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-link/)
