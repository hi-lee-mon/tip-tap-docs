# エディタをオフラインに対応させる

> 原文: [https://tiptap.dev/docs/guides/offline-support](https://tiptap.dev/docs/guides/offline-support)

[Y IndexedDB](https://docs.yjs.dev/ecosystem/database-provider/y-indexeddb) 拡張機能を使うと、共同編集エディタを簡単にオフラインに対応させられます。Y.js のエコシステムに含まれるこのツールは、エディタにオフラインでのデータ保存と同期の機能を加えます。

## オフライン対応を組み込む

まず、プロジェクトに Y IndexedDB アダプターを追加します。

```bash
npm install y-indexeddb
```

Y IndexedDB を Y ドキュメントに接続し、ドキュメントをローカルに保存します。

```typescript
import { Editor } from '@tiptap/core'
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'

const ydoc = new Y.Doc()

// Y ドキュメントをローカルに保存するため、IndexedDB を設定する
new IndexeddbPersistence('example-document', ydoc)

const editor = new Editor({
  extensions: [
    // ほかの拡張機能...
    Collaboration.configure({
      document: ydoc,
    }),
  ],
})
```

IndexedDB アダプターを使うと、ドキュメントへの変更はすべてブラウザのローカルに保存されます。タブを閉じても、インターネット接続が切れても、オフラインで編集しても、作業内容は保存されます。オンラインに戻ると、変更は自動で同期されます。
