# コンテンツのコマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/content](https://tiptap.dev/docs/editor/api/commands/content)

エディタのコンテンツを動的に挿入・置換・削除するときは、これらのコマンドを使います。新しいドキュメントの初期化、既存ドキュメントの更新、ユーザーの選択範囲の扱いなど、コンテンツ操作に必要な道具がそろっています。

## ユースケース

- **新しいドキュメントの初期化:** [`setContent`](set-content.md) コマンドで、まっさらなドキュメントや用意したテンプレートから始めます。
- **既存コンテンツの更新:** [`insertContent`](insert-content.md) や [`insertContentAt`](insert-content-at.md) コマンドで、ユーザーの操作に応じて新しいコンテンツを追加したり、特定の部分を更新したりします。
- **コンテンツの消去:** [`clearContent`](clear-content.md) コマンドで、ドキュメントの構造を正しく保ったまま、すべてのコンテンツを削除します。
- **ユーザーの選択範囲の扱い:** [`insertContentAt`](insert-content-at.md) で、ユーザーの選択に応じた位置や範囲にコンテンツを挿入・置換します。

## コンテンツのコマンド一覧

| コマンド          | 説明                                                                |
| ----------------- | ------------------------------------------------------------------- |
| `clearContent`    | エディタのスキーマに従いつつ、現在のドキュメントを削除する          |
| `insertContent`   | プレーンテキスト、HTML、JSON でドキュメントにコンテンツを追加する   |
| `insertContentAt` | ドキュメント内の特定の位置や範囲にコンテンツを挿入する              |
| `setContent`      | JSON や HTML を使って、ドキュメント全体を新しいものに置き換える     |
