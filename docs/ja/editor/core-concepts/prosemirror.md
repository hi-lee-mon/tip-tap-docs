# ProseMirror

> 原文: [https://tiptap.dev/docs/editor/core-concepts/prosemirror](https://tiptap.dev/docs/editor/core-concepts/prosemirror)

Tiptap は ProseMirror を土台にしており、ProseMirror はかなり強力な API を持っています。この API を使えるように、`@tiptap/pm` パッケージを用意しています。このパッケージには、`prosemirror-state`、`prosemirror-view`、`prosemirror-model` など、主要な ProseMirror パッケージがすべて入っています。

独自の開発でこのパッケージを使えば、Tiptap が使っているものと常に同じバージョンの ProseMirror を使えます。こうすることで、Tiptap とすべての拡張機能の互換性を保ち、バージョンの衝突を防げます。

ProseMirror のパッケージを一つずつ手動でインストールしなくて済むのも利点です。npm など、peer dependency を自動で解決できるパッケージマネージャーを使っていない場合は特に助かります。

## インストール

```bash
npm i @tiptap/pm
```

インストールすると、内部の ProseMirror パッケージに次のようにアクセスできます。

```js
// この例では ProseMirror の state パッケージから EditorState クラスを読み込む
import { EditorState } from '@tiptap/pm/state'
```

## パッケージを組み込む

使えるパッケージは次のとおりです。

- `@tiptap/pm/changeset`
- `@tiptap/pm/commands`
- `@tiptap/pm/dropcursor`
- `@tiptap/pm/gapcursor`
- `@tiptap/pm/history`
- `@tiptap/pm/inputrules`
- `@tiptap/pm/keymap`
- `@tiptap/pm/model`
- `@tiptap/pm/schema-list`
- `@tiptap/pm/state`
- `@tiptap/pm/tables`
- `@tiptap/pm/transform`
- `@tiptap/pm/view`

`@tiptap/pm` が再エクスポートしていない ProseMirror パッケージ（`prosemirror-collab`、`prosemirror-markdown`、`prosemirror-menu`、`prosemirror-schema-basic`、`prosemirror-trailing-node` など）が必要なら、npm から直接インストールしてください。

これらのライブラリについて詳しくは [ProseMirror のドキュメント](https://prosemirror.net/docs/ref)を参照してください。
