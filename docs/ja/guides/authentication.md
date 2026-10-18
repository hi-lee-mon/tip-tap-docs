# 共同編集での認証

> 原文: [https://tiptap.dev/docs/guides/authentication](https://tiptap.dev/docs/guides/authentication)

トークンは、アプリケーションがサーバー上で、環境の秘密鍵を使って自分で署名します。秘密鍵がサーバーの外に出ることはありません。

ここでは手早くセットアップする方法を紹介します。詳しいリファレンスは [Authentication](https://tiptap.dev/docs/authentication) と [Authenticate and authorize in Collaboration](https://tiptap.dev/docs/collaboration/getting-started/authenticate) を参照してください。

## トークンに署名する

トークンには、サーバー上で環境の秘密鍵を使って署名します。秘密鍵は決してサーバーの外に出してはいけません。共同編集用のトークンは `aud: "Documents"` を設定し、ユーザーがどのドキュメントにアクセスできるかを表す `permissions` を持ちます。

```typescript
import { SignJWT, importPKCS8 } from 'jose'

const privateKey = await importPKCS8(process.env.TIPTAP_PRIVATE_KEY, 'ES256')

const jwt = await new SignJWT({
  permissions: [{ action: 'Documents:Write', resource: '*' }],
})
  .setProtectedHeader({ alg: 'ES256' })
  .setIssuer(process.env.TIPTAP_ENVIRONMENT_ID)
  .setSubject('user-identifier')
  .setAudience(['Documents'])
  .setExpirationTime('30m')
  .sign(privateKey)
// このトークンをプロバイダーの `token` フィールドで送る。秘密鍵は決してフロントエンドに公開しないこと。
```

ほかの言語での例は [Signing the token](https://tiptap.dev/docs/authentication#signing-the-token) を、有効期間の短いトークンと失効については [Handle token expiry](https://tiptap.dev/docs/collaboration/getting-started/authenticate#handle-token-expiry) を参照してください。

## 特定のドキュメントだけにアクセスを制限する

トークンの対象を特定のドキュメントに絞るには、権限の `resource` にドキュメント名を設定します。まとまったドキュメント群に一致させたい場合は、`prefix` 制約を使います。

```typescript
const jwt = await new SignJWT({
  permissions: [
    {
      action: 'Documents:Write',
      resource: '*',
      constraints: { prefix: '1500c624-8f9f-496a-b196-5e5dd8ec3c25/' },
    },
  ],
})
  .setProtectedHeader({ alg: 'ES256' })
  .setIssuer(process.env.TIPTAP_ENVIRONMENT_ID)
  .setAudience(['Documents'])
  .setExpirationTime('30m')
  .sign(privateKey)
```

この例では、そのユーザーの接頭辞配下にあるすべてのドキュメントへのアクセスを許可します。以前の `allowedDocumentNames` 方式については [Legacy authentication](https://tiptap.dev/docs/authentication/legacy) を参照してください。
