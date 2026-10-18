# 共同編集用ドキュメントの名前と構造を決める

> 原文: [https://tiptap.dev/docs/guides/naming-documents](https://tiptap.dev/docs/guides/naming-documents)

このガイドでは、ドキュメントの名前の付け方と、1つのドキュメント内でのコンテンツの整理について、推奨する方法をまとめます。自分のアプリケーションのドキュメント構造を決める参考にしてください。

ドキュメント名はアクセス制御でも重要な役割を果たします。名前の決め方を十分に理解するには、[認可のガイド](https://tiptap.dev/docs/collaboration/getting-started/authenticate#authorize-per-document)もあわせて確認してください。

## ドキュメント名を構造化する

Tiptap Collaboration は、共同編集のセッションを成り立たせるためにドキュメント名を使います。ドキュメント名は、ユーザーを同じドキュメントに結びつける一意の識別子です。理屈の上では、どんな文字列でもかまいません。

次の例では、CMS アプリケーションでよくある、エンティティの名前と一意の ID を組み合わせた形を使っています。ただし、アプリケーションの要件に合うなら、どんな命名規則を採用してもかまいません。

新しいドキュメントは必要に応じて自動で作られます。プロバイダーに文字列の識別子を渡すだけで済みます。

```typescript
const documentName = 'article.123'
```

この形式の名前なら、主要な情報を簡単に取り出せます。

```typescript
const documentName = 'article.123'

// ドキュメント名を部分ごとに分割する
const [entityType, entityID] = documentName.split('.')

console.log(entityType) // Output: "article"
console.log(entityID) // Output: "123"
```

## フラグメントで入れ子のドキュメントを管理する

Yjs のフラグメントは、いくつかのセクションに分かれた複雑なドキュメントを扱うのに向いています。ドキュメントを入れ子にしたい場合、たとえば `title` と `content` に分かれたブログ記事のような場合に関係します。

フラグメントを使うと、1つの Y.Doc インスタンス（つまり1つのドキュメント）を使いながら、セクションごとに別のエディタを使えます。

たとえば、ブログ記事なら次のように構成します。

```typescript
const ydoc = new Y.Doc()

// タイトル用のエディタ
const titleEditor = new Editor({
  extensions: [
    Collaboration.configure({
      document: this.ydoc,
      field: 'title',
    }),
  ],
})

// 本文用のエディタ
const bodyEditor = new Editor({
  extensions: [
    Collaboration.configure({
      document: this.ydoc,
      field: 'content',
    }),
  ],
})
```

フラグメントを入れ子にする複雑な構成では、`document` と `field` の設定を使わずに、Y.js のフラグメントを直接使えます。

```typescript
// Y.js のフラグメントをそのまま使う
Collaboration.configure({
  fragment: ydoc.getXmlFragment('custom'),
})
```

Tiptap Collaboration でドキュメント名がアクセス制御にどう影響するかを十分に理解するには、[認可のガイド](https://tiptap.dev/docs/collaboration/getting-started/authenticate)を必ず確認してください。
