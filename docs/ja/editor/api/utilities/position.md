# 位置ユーティリティ

> 原文: [https://tiptap.dev/docs/editor/api/utilities/position](https://tiptap.dev/docs/editor/api/utilities/position)

位置ユーティリティを使うと、ドキュメントの変更に合わせて、エディタ内の位置を追跡・更新できます。

## 位置を作る

位置のインスタンスは `createMappablePosition` で作ります。

```js
// オフセット 10 の位置を作る
const position = editor.utils.createMappablePosition(10)
```

`createMappablePosition` メソッドは、通常は `MappablePosition` のインスタンスを返します。[Collaboration 拡張機能](../../extensions/functionality/collaboration.md)が有効な場合は、`CollaborationMappablePosition` のインスタンスを返します。

- **`MappablePosition`**: 通常のエディタで位置を追跡するための基底クラス
- **`CollaborationMappablePosition`**: 共同編集が有効なときに位置を追跡するための拡張クラス

## 位置を更新する

トランザクションの後に位置を更新するには `getUpdatedPosition` を使います。ドキュメントの変更が位置に反映されます。

```js
// トランザクション後の位置を取得する
const { position: updatedPosition, mapResult } = editor.utils.getUpdatedPosition(
  position,
  transaction,
)

// 更新後の位置は、トランザクション後の新しい場所を指す
const newOffset = updatedPosition.position
```

`getUpdatedPosition` メソッドは、次のプロパティを持つオブジェクトを返します。

- `position`（`MappablePosition`）: 更新後の位置。
- `mapResult`（`MapResult | null`）: マッピング処理の結果で、ProseMirror の [MapResult](https://prosemirror.net/docs/ref/#transform.MapResult) です。位置が削除されたかどうかなど、処理に関する情報を含みます。

## 制限事項

共同編集のトランザクションで段落が 2 つに分割されると、[Y.js](https://docs.yjs.dev/) はこれを「段落の後半の削除」と「新しい段落の挿入」として扱います。そのため、元の位置が改行より後ろにあった場合、更新後の位置は 2 つ目の段落ではなく、1 つ目の段落の末尾になります。これは [Y.js の相対位置](https://docs.yjs.dev/api/relative-positions)の制限で、現在解決策に取り組んでいます。

## API リファレンス

### `MappablePosition`

基底クラスの `MappablePosition` は、ドキュメント内の位置を追跡します。

#### プロパティ

- `position`（`number`）: 現在の位置のオフセット。

#### メソッド

##### `toJSON`

保存用に、位置を JSON オブジェクトにシリアライズします。

```js
const position = editor.utils.createMappablePosition(10)
const json = position.toJSON()

// localStorage に保存するか、サーバーに送る
localStorage.setItem('savedPosition', JSON.stringify(json))
```

##### `fromJSON`

JSON オブジェクトから位置をデシリアライズします。

```js
// ストレージから取り出す
const json = JSON.parse(localStorage.getItem('savedPosition'))

// 位置を復元する
const position = MappablePosition.fromJSON(json)
```

### 例: 位置を保存する

```js
import { MappablePosition } from '@tiptap/core'

// 位置を作ってシリアライズする
const position = editor.utils.createMappablePosition(25)
const json = position.toJSON()

// 保存する
localStorage.setItem('bookmark', JSON.stringify(json))

// あとで復元する
const savedJson = JSON.parse(localStorage.getItem('bookmark'))
const restoredPosition = MappablePosition.fromJSON(savedJson)
```

### `CollaborationMappablePosition`

`CollaborationMappablePosition` は `MappablePosition` を拡張し、共同編集向けに Y.js の相対位置に対応させたクラスです。Collaboration 拡張機能が有効なときは自動で使われます。

#### プロパティ

- `position`（`number`）: 現在の位置のオフセット。
- `yRelativePosition`（`any`）: [Y.js の相対位置](https://docs.yjs.dev/api/relative-positions)（内部用で、共同編集に使われます）。

#### メソッド

##### `toJSON`

共同編集用の位置を、Y.js の相対位置データも含めて JSON オブジェクトにシリアライズします。

```js
// 共同編集のエディタで
const position = editor.utils.createMappablePosition(10)
const json = position.toJSON()

// json には position と yRelativePosition の両方が含まれる
// あとで復元できるように保存しておく
localStorage.setItem('collabPosition', JSON.stringify(json))
```

##### `fromJSON`

JSON オブジェクトから共同編集用の位置をデシリアライズします。

```js
// ストレージから取り出す
const json = JSON.parse(localStorage.getItem('collabPosition'))

// 位置を復元する（CollaborationMappablePosition が自動で作られる）
const position = CollaborationMappablePosition.fromJSON(json)
```

### 例: 共同編集での位置を保存する

```js
import { CollaborationMappablePosition } from '@tiptap/extension-collaboration'

// 共同編集のエディタで位置を作る
const position = editor.utils.createMappablePosition(42)

// 保存用にシリアライズする
const json = position.toJSON()
// json: { position: 42, yRelativePosition: [...] }

// 保存する
localStorage.setItem('collabBookmark', JSON.stringify(json))

// あとで復元する
const savedJson = JSON.parse(localStorage.getItem('collabBookmark'))
const restoredPosition = CollaborationMappablePosition.fromJSON(savedJson)
```
