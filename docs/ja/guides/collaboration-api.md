# Collaboration API

> 原文: [https://tiptap.dev/docs/guides/collaboration-api](https://tiptap.dev/docs/guides/collaboration-api)

## ドキュメントに初期コンテンツを追加する

ドキュメントに初期コンテンツを追加する（または空のドキュメントを作る）には、ドキュメント作成 API を使います。

`APP_ID` と `DOCUMENT_NAME` は自分の値に置き換えてください。`YOUR_JWT` は `Documents:Api:All` を持つ署名済みトークンに置き換えます（[Authentication](https://tiptap.dev/docs/authentication) を参照）。このトークンは API への全権限を与えるので、サーバー側だけで保持してください。`APP_ID` はドキュメントサーバーの ID で、[Cloud ダッシュボード](https://cloud.tiptap.dev/v2/configuration/document-server)に「Document server ID」として表示されています。
空のドキュメントを作るだけなら、`content` に空の配列を送ります。

リクエストのペイロードは Tiptap JSON にします。Tiptap JSON は `editor.getJSON()` を呼ぶと取得できます（[JSON を取得する](output-json-html.md#option-1-json)を参照）。

```curl
curl --location \
'https://APP_ID.collab.tiptap.cloud/api/documents/DOCUMENT_NAME?format=json' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_JWT' \
--data '{
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "attrs": {
          "indent": 0,
          "textAlign": "left"
        },
        "content": [
          {
            "text": "This is my initial content.",
            "type": "text"
          }
        ]
      }
    ]
}'
```

## ドキュメントのコンテンツ全体を更新する

ドキュメントの更新は簡単です。現在の JSON ドキュメントを取得し、変更を加えて送り返すだけです。

現在の JSON ドキュメントは、次のリクエストで取得します。

```curl
curl --location \
'https://APP_ID.collab.tiptap.cloud/api/documents/DOCUMENT_NAME?format=json' \
--header 'Authorization: Bearer YOUR_JWT' \
```

次に、JSON に変更を加えて送り返します。Tiptap 側で新しい JSON とドキュメントの現在の状態との差分を計算し、共同編集と両立する形で適用します。
1つのノードだけを更新したい場合は、[ドキュメント内の1つのノードを更新する](#update-a-single-node-in-a-document)を参照してください。

```curl
curl --location --request PATCH \
'https://APP_ID.collab.tiptap.cloud/api/documents/DOCUMENT_NAME?format=json' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_JWT' \
--data 'UPDATED_JSON'
```

## ドキュメント内の1つのノードを更新する

現在の JSON ドキュメントは、次のリクエストで取得します。

```curl
curl --location \
'https://APP_ID.collab.tiptap.cloud/api/documents/DOCUMENT_NAME?format=json' \
--header 'Authorization: Bearer YOUR_JWT'
```

次に、更新したいノードを特定し、JSON の中でそのノードを更新します。送り返すのは更新したノードだけですが、形式は完全な Tiptap JSON にする必要があります。
どのノードを更新するかは、クエリパラメータ `nodeAttributeName` と `nodeAttributeValue` で指定します。たとえば unique-id 拡張機能を使っていて、対象のノードが値 `12345` の `id` 属性を持つなら、`nodeAttributeName=id&nodeAttributeValue=12345` を渡します。この指定はトップレベルのノードにしか使えません。

```curl
curl --location --request PATCH \
'https://APP_ID.collab.tiptap.cloud/api/documents/DOCUMENT_NAME?format=json&nodeAttributeName=id&nodeAttributeValue=12345' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_JWT' \
--data 'UPDATED_JSON'
```

`UPDATED_JSON` の例を以下に示します。更新するノードだけを含め、ほかのノードはすべて（"content" 配列から）省きます。

```json
{
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "attrs": {
          "id": "12345"
        },
        "content": [
          {
            "text": "The API will update the node that matches the query filters (nodeAttributeName and nodeAttributeValue from the query) with the content of this node.",
            "type": "text"
          }
        ]
      }
    ]
}
```

## ドキュメント内のノードを削除する

ドキュメント内のノードを丸ごと削除するには、次のようなリクエストを送ります。

`ATTR_NAME` と `ATTR_VALUE` は、"id" と "12345" のように自分の値に置き換えてください。

```curl
curl --location --request PATCH \
'https://APP_ID.collab.tiptap.cloud/api/documents/DOCUMENT_NAME?format=json&nodeAttributeName=ATTR_NAME&nodeAttributeValue=ATTR_VALUE&mode=delete' \
--header 'Authorization: Bearer YOUR_JWT'
```

## ドキュメント内のノードの属性を更新する

ノードの属性を更新するには、次のようなリクエストを送ります。
このリクエストは、リクエストに含まれない属性をすべて削除します。削除したくない場合は、URL に `mergeAttributes=1` を追加してください。

`ATTR_NAME` と `ATTR_VALUE` は、"id" と "12345" のように自分の値に置き換えてください。

```curl
curl --location --request PATCH \
'https://APP_ID.collab.tiptap.cloud/api/documents/DOCUMENT_NAME?format=json&nodeAttributeName=ATTR_NAME&nodeAttributeValue=ATTR_VALUE&mode=attrs' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_JWT' \
--data '{
    "level": 3
}'
```
