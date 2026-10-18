# Tracked Changes 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/tracked-changes](https://tiptap.dev/docs/editor/extensions/functionality/tracked-changes)

Tracked Changes 拡張機能は、共同編集のワークフロー向けに提案モードを提供します。有効にすると、すべての編集が承認・却下できる提案として表示されます。ワープロソフトの変更履歴の記録に似た仕組みです。

> [!TIP]
> **詳細**
>
> Tiptap Tracked Changes 拡張機能の組み込み方、インストール、設定の詳細は、[機能のページ](https://tiptap.dev/docs/tracked-changes/getting-started/overview)を参照してください。

> [!WARNING]
> **実験的な機能**
>
> この拡張機能は現在活発に開発中で、今後のリリースで API が変わる可能性があります。1.0.0 より前のバージョンはすべて不安定な前提なので、自己責任で使ってください。

[デモを開く](https://embed-pro.tiptap.dev/preview/Experiments/TrackedChanges)

## インストール

```bash
npm install @tiptap-pro/extension-tracked-changes
```

## 基本的なセットアップ

```js
import { Editor } from '@tiptap/core'
import { TrackedChanges } from '@tiptap-pro/extension-tracked-changes'

const editor = new Editor({
  extensions: [
    TrackedChanges.configure({
      enabled: true,
      userId: 'user-123',
      userMetadata: { name: 'John Doe' },
    }),
  ],
})
```

## プログラムから提案を作る

この拡張機能は、ユーザーが操作するレビューのワークフローに加えて、アプリのロジックから直接、記録付きの提案を作るコマンドも提供します。エディタのすべての操作で変更の記録モードをオンにすることなく、コンテンツの挿入・削除・置換を提案として行いたい場合に使います。プログラムから作る提案には `reason` を付けることもでき、作成イベントと一緒に発行されるので、後続のワークフローで使えます。挿入と置換のコマンドは Tiptap の `Content` を丸ごと受け付けるので、プレーンテキストだけでなく、画像などの JSON のノードも扱えます。マークを記録するコマンドは、`bold` のような単純な書式のマークにも、`link` や `highlight` のような属性付きのマークにも対応しています。

[TrailingNode](trailing-node.md) 拡張機能も使っている場合は、`addTrackedInsertion()` と `addTrackedReplacement()` に `skipTrailingNode: true` を指定できます。指定すると、そのトランザクションのメタ情報が、発行される変更記録のトランザクションに引き継がれます。

```js
editor.commands.addTrackedInsertion({
  from: 7,
  content: 'big ',
  reason: 'Applied assistant suggestion',
})

editor.commands.addTrackedDeletion({
  from: 7,
  to: 12,
  reason: 'Removed deprecated sentence',
})

editor.commands.addTrackedReplacement({
  from: 7,
  to: 12,
  content: 'earth',
  reason: 'Standardized terminology',
  skipTrailingNode: true,
})

editor.commands.addTrackedMark({
  from: 7,
  to: 12,
  markName: 'bold',
  reason: 'Emphasized approved terminology',
})

editor.commands.toggleTrackedMark({
  from: 7,
  to: 12,
  markName: 'link',
  markAttrs: {
    href: 'https://tiptap.dev',
    target: '_blank',
  },
  reason: 'Added canonical reference',
})
```

```js
editor.commands.addTrackedInsertion({
  from: 7,
  content: {
    type: 'image',
    attrs: {
      src: '/example.png',
      alt: 'Example image',
    },
  },
  reason: 'Inserted approved image asset',
})
```

API の全体は[コマンドのリファレンス](https://tiptap.dev/docs/tracked-changes/api-reference/commands)を参照してください。

## 次のステップ

- [インストールと設定](https://tiptap.dev/docs/tracked-changes/getting-started/install): 設定の完全なリファレンス
- [基本的な使い方](https://tiptap.dev/docs/tracked-changes/usage/basic-usage): 変更の記録を有効にし、提案を承認・却下する
- [高度な使い方](https://tiptap.dev/docs/tracked-changes/usage/advanced-usage): グループ化、共同編集、コメントとの連携
- [API リファレンス](https://tiptap.dev/docs/tracked-changes/api-reference/commands): コマンド、イベント、ユーティリティ、型
