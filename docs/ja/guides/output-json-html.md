# Tiptap での出力とコンテンツの扱い

> 原文: [https://tiptap.dev/docs/guides/output-json-html](https://tiptap.dev/docs/guides/output-json-html)

コンテンツは JSON オブジェクトとしても、昔ながらの HTML 文字列としても保存できます。どちらでも問題なく動きます。もちろん、どちらの形式でもエディタに渡してコンテンツを復元できます。次のインタラクティブな例では、ドキュメントが変わるたびにコンテンツを HTML と JSON で書き出します。

## 書き出し

### 方法1: JSON

JSON のほうがおそらくループで処理しやすいでしょう。たとえばメンションを探すときです。また、JSON は Tiptap が内部で使う形に近いものです。JSON でコンテンツを保存したい場合は、コンテンツを JSON として取得するメソッドが用意されています。

```js
const json = editor.getJSON()
```

これをデータベースに保存（または API に送信）しておき、初期化時にドキュメントを復元できます。

```js
new Editor({
  content: {
    type: 'doc',
    content: [
      // …
    ],
  },
})
```

何かを待つ必要がある場合は、あとからエディタのインスタンスを通じて復元することもできます。

```js
editor.commands.setContent({
  type: 'doc',
  content: [
    // …
  ],
})
```

実際の動きは、次のインタラクティブな例で確認できます。

[デモを開く](https://embed.tiptap.dev/preview/guidecontent/exportjson?hideSource=true)

### 方法2: HTML

HTML はメールなどほかの場所でも簡単にレンダリングでき、広く使われています。そのため、いずれエディタを乗り換えるときにも楽でしょう。どのエディタのインスタンスにも、現在のドキュメントから HTML を取得するメソッドがあります。

```js
const html = editor.getHTML()
```

これを使って、初期化時にドキュメントを復元できます。

```js
new Editor({
  content: `<p>Example Text</p>`,
})
```

あとから（たとえば API の呼び出しが終わってから）コンテンツを復元することもできます。

```js
editor.commands.setContent(`<p>Example Text</p>`)
```

次のインタラクティブな例で試してみてください。

[デモを開く](https://embed.tiptap.dev/preview/guidecontent/exporthtml?hideSource=true)

### 方法3: Y.js

Tiptap のエディタは Y.js に一級の対応をしています。Y.js を使うと、[リアルタイムの共同編集、オフライン編集、デバイス間の同期](https://tiptap.dev/docs/collaboration/getting-started/overview)といった機能を加えられます。

Y.js は内部で、すべての変更の履歴を保存しています。保存先はブラウザでも、サーバーでも、接続中のほかのクライアントと同期した場所でも、USB メモリでもかまいません。ただし、Y.js にはこの保存された変更が必要だという点は押さえておいてください。単純な JSON ドキュメントだけでは、変更をマージできません。

もちろん、既存の JSON ドキュメントを取り込んで始めたり、Y.js から JSON を取り出したりはできます。しかしそれは取り込みと書き出しのための形式にすぎず、唯一の信頼できるデータ源にはなりません。上に挙げた用途のために Y.js を導入するときは、この点を考慮してください。

とはいえ、Y.js はすばらしいものです。私たちはこれらすべてを手軽に実現できる優れたバックエンドを提供しようとしています。

### Markdown

Tiptap はすでに、Markdown（GitHub Flavored Markdown を含む）の取り込み、書き出し、REST API による変換を提供しています。これにより次のことができます。

- **`.md` や GFM のファイルを Tiptap エディタに取り込み**、Tiptap JSON に変換する
- Tiptap JSON を標準の Markdown や GFM に**書き出し**、エディタのコンテンツを `.md` ファイルとして保存・共有する
- 変換用の REST API で `.md` のコンテンツを送受信し、**サーバー側に組み込む**（エディタは不要）

ほかの Markdown の機能の扱い方や、エディタ内での使い方とサーバー側での使い方の例は、[Markdown Conversion](https://tiptap.dev/docs/conversion/import/markdown/rest-api) を参照してください。

**Tiptap v3 では Markdown への対応をさらに強化します。** 高度な（AI の）用途でも、Markdown をより堅牢に、より組み込みやすくすることに取り組んでいます。

ProseMirror JSON を Markdown に変換したい場合は、`@tiptap/static-renderer` パッケージを使えます。このパッケージは ProseMirror JSON を Markdown に変換できます。詳しい情報と例は[ドキュメント](../editor/api/utilities/static-renderer.md)を参照してください。

## 変更を監視する

ユーザーが書いている間、更新されたコンテンツを継続して保存したい場合は、[イベントにフックできます](../editor/api/events.md)。たとえば次のように書きます。

```js
const editor = new Editor({
  // 初期コンテンツ
  content: `<p>Example Content</p>`,

  // 変更のたびに呼ばれる
  onUpdate: ({ editor }) => {
    const json = editor.getJSON()
    // ここでコンテンツを API に送る
  },
})
```

## レンダリング

### 方法1: 読み取り専用の Tiptap インスタンス

保存したコンテンツをレンダリングするには、エディタを読み取り専用にします。こうすると、CSS やほかのコードを重複させずに、エディタ内とまったく同じレンダリングを得られます。

[デモを開く](https://embed.tiptap.dev/preview/GuideContent/ReadOnly?inline=false&hideSource=false)

### 方法2: ProseMirror JSON から HTML を生成する

サーバー側でコンテンツをレンダリングしたい場合（たとえば Tiptap で書いたブログ記事の HTML を生成する場合）は、実際のエディタのインスタンスなしでレンダリングしたいはずです。

そのためにあるのが `generateHTML()` です。実際のエディタのインスタンスなしで HTML をレンダリングするヘルパー関数です。

[デモを開く](https://embed.tiptap.dev/preview/GuideContent/GenerateHTML?inline=false&hideSource=false)

逆方向の変換もできます。次の例では、HTML から JSON を生成します。

[デモを開く](https://embed.tiptap.dev/preview/GuideContent/GenerateJSON?inline=false&hideSource=false)

### 方法3: 静的レンダラー

ProseMirror JSON から HTML、React 要素、Markdown を生成します。

ブログ記事のようにコンテンツを静的にレンダリングしたい場合は、`@tiptap/static-renderer` パッケージを使えます。ProseMirror JSON を HTML、React 要素、Markdown に変換できます。

```bash
npm install @tiptap/static-renderer
```

静的レンダラーについて詳しくは、[静的レンダラーのドキュメント](../editor/api/utilities/static-renderer.md)を参照してください。

[デモを開く](https://deploy-preview-6012--tiptap-embed.netlify.app/preview/examples/staticrendering?inline=false&hideSource=false)

## 移行

### Draft.js から

Draft.js から Tiptap に移行する場合、コンテンツはおそらく JSON で保存されているでしょう。それなら好都合です。[draft-js-to-tiptap パッケージ](https://github.com/ueberdosis/draft-js-to-tiptap)を使えば、Tiptap で扱えます。詳しい情報と例は[ドキュメント](https://github.com/ueberdosis/draft-js-to-tiptap/blob/main/README.md)を参照してください。

### そのほか

既存のコンテンツを Tiptap に移行する場合は、既存の出力を HTML にすることをおすすめします。ProseMirror が内容に問題がないことを保証してくれるので、Tiptap に初期コンテンツを取り込むにはおそらく最適な形式です。（設定に照らして）許可されていないタグや属性があっても、Tiptap は黙って捨てるだけです。

移行を手助けするために、いくつかの事例を取り上げていく予定です。たとえば、HTML を互換性のある JSON 構造に変換する PHP パッケージを提供しています: [ueberdosis/prosemirror-to-html](https://github.com/ueberdosis/html-to-prosemirror)。

[ぜひ経験を共有してください！](mailto:humans@tiptap.dev) ここに情報を増やしていきたいと考えています。

## セキュリティ

セキュリティを理由にどちらかの形式を選ぶ必要はありません。誰かが悪意のあるコンテンツをサーバーに送ろうとする場合、それが JSON か HTML かは関係ありません。Tiptap を使っているかどうかさえ関係ありません。ユーザーの入力は常に検証してください。
