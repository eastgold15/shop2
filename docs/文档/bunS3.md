> Bun 提供了用于与兼容 S3 的对象存储服务进行交互的快速、原生绑定。

生产服务器通常会从 S3 兼容的对象存储服务中读取、上传和写入文件，而不是使用本地文件系统。传统上，这意味着你在开发时使用的本地文件系统 API 在生产环境中无法使用。但当你使用 Bun 时，情况有所不同。

### Bun 的 S3 API 非常快



Bun 提供了用于与兼容 S3 的对象存储服务交互的快速、原生绑定。Bun 的 S3 API 设计简洁，并且感觉类似于 `fetch` 的 `Response` 和 `Blob` API（就像 Bun 的本地文件系统 API 一样）。

```ts s3.ts
import { s3, write, S3Client } from "bun";

// Bun.s3 会从环境变量中读取凭证
// file() 返回一个对 S3 上文件的惰性引用
const metadata = s3.file("123.json");

// 从 S3 下载为 JSON
const data = await metadata.json();

// 上传到 S3
await write(metadata, JSON.stringify({ name: "John", age: 30 }));

// 预签名 URL（同步操作 - 不需要网络请求）
const url = metadata.presign({
  acl: "public-read",
  expiresIn: 60 * 60 * 24, // 1 天
});

// 删除文件
await metadata.delete();
```

S3 是互联网文件系统的[事实标准](https://en.wikipedia.org/wiki/De_facto_standard)。Bun 的 S3 API 可与以下 S3 兼容的存储服务配合使用：

* AWS S3
* Cloudflare R2
* DigitalOcean Spaces
* MinIO
* Backblaze B2
* ……以及其他任何 S3 兼容的存储服务

## 基本用法

有多种方式可以与 Bun 的 S3 API 进行交互。

### `Bun.S3Client` 与 `Bun.s3`

`Bun.s3` 等同于 `new Bun.S3Client()`，它依赖环境变量来获取凭证。

要显式设置凭证，请将它们传递给 `Bun.S3Client` 构造函数。

```ts s3.ts
import { S3Client } from "bun";

const client = new S3Client({
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
  bucket: "my-bucket",
  // sessionToken: "..."
  // acl: "public-read",
  // endpoint: "https://s3.us-east-1.amazonaws.com",
  // endpoint: "https://<account-id>.r2.cloudflarestorage.com", // Cloudflare R2
  // endpoint: "https://<region>.digitaloceanspaces.com", // DigitalOcean Spaces
  // endpoint: "http://localhost:9000", // MinIO
});

// Bun.s3 是一个全局单例，等价于 `new Bun.S3Client()`
```

### 操作 S3 文件

`S3Client` 中的 **`file`** 方法返回一个 **对 S3 上文件的惰性引用**。

```ts s3.ts
// 对 S3 上文件的惰性引用
const s3file: S3File = client.file("123.json");
```

与 `Bun.file(path)` 类似，`S3Client` 的 `file` 方法是同步的。在你调用依赖网络请求的方法之前，它不会发起任何网络请求。

### 从 S3 读取文件

如果你使用过 `fetch` API，就会熟悉 `Response` 和 `Blob` API。`S3File` 继承自 `Blob`。适用于 `Blob` 的方法同样适用于 `S3File`。

```ts s3.ts
// 将 S3File 读取为文本
const text = await s3file.text();

// 将 S3File 读取为 JSON
const json = await s3file.json();

// 将 S3File 读取为 ArrayBuffer
const buffer = await s3file.arrayBuffer();

// 仅获取前 1024 字节
const partial = await s3file.slice(0, 1024).text();

// 流式读取文件
const stream = s3file.stream();
for await (const chunk of stream) {
  console.log(chunk);
}
```

#### 内存优化

像 `text()`、`json()`、`bytes()` 或 `arrayBuffer()` 这样的方法会尽可能避免在内存中重复字符串或字节。

如果文本恰好是 ASCII 编码，Bun 会直接将字符串传输给 JavaScriptCore（引擎），无需转码，也无需在内存中复制字符串。当你使用 `.bytes()` 或 `.arrayBuffer()` 时，也会避免在内存中重复字节。

这些辅助方法不仅简化了 API，还使其更快。

### 向 S3 写入和上传文件

向 S3 写入同样简单。

```ts s3.ts
// 写入字符串（替换文件）
await s3file.write("Hello World!");

// 写入 Buffer（替换文件）
await s3file.write(Buffer.from("Hello World!"));

// 写入 Response（替换文件）
await s3file.write(new Response("Hello World!"));

// 带内容类型写入
await s3file.write(JSON.stringify({ name: "John", age: 30 }), {
  type: "application/json",
});

// 使用 writer 流式写入
const writer = s3file.writer({ type: "application/json" });
writer.write("Hello");
writer.write(" World!");
await writer.end();

// 使用 Bun.write 写入
await Bun.write(s3file, "Hello World!");
```

### 处理大文件（流式）

Bun 会自动处理大文件的分段上传，并提供流式功能。适用于本地文件的相同 API 也适用于 S3 文件。

```ts s3.ts
// 写入大文件
const bigFile = Buffer.alloc(10 * 1024 * 1024); // 10MB
const writer = s3file.writer({
  // 网络错误时自动重试最多 3 次
  retry: 3,

  // 最多同时排队 10 个请求
  queueSize: 10,

  // 以 5 MB 的块上传
  partSize: 5 * 1024 * 1024,
});
for (let i = 0; i < 10; i++) {
  writer.write(bigFile);
  await writer.flush();
}
await writer.end();
```

***

## 预签名 URL

当你的生产服务需要让用户上传文件到你的服务器时，通常更可靠的做法是让用户直接上传到 S3，而不是让服务器充当中介。

为此，你可以为 S3 文件预签名 URL。这会生成一个带有签名的 URL，允许用户安全地将特定文件上传到 S3，而无需暴露你的凭证或授予他们对存储桶的不必要访问权限。

默认行为是生成一个在 24 小时后过期的 `GET` URL。Bun 会尝试根据文件扩展名推断内容类型。如果无法推断，则默认为 `application/octet-stream`。

```ts s3.ts
import { s3 } from "bun";

// 生成一个 24 小时后过期的预签名 URL（默认）
const download = s3.presign("my-file.txt"); // GET, text/plain, 24 小时后过期

const upload = s3.presign("my-file", {
  expiresIn: 3600, // 1 小时
  method: "PUT",
  type: "application/json", // 没有扩展名用于推断，因此我们可以指定内容类型为 JSON
});

// 如果已有文件引用，可以调用 .presign()
// 但除非你已经拥有引用（以避免内存占用），否则应避免这样做。
const myFile = s3.file("my-file.txt");
const presignedFile = myFile.presign({
  expiresIn: 3600, // 1 小时
});
```

### 设置 ACL

要为预签名 URL 设置 ACL（访问控制列表），请传递 `acl` 选项：

```ts s3.ts
const url = s3file.presign({
  acl: "public-read",
  expiresIn: 3600,
});
```

你可以传递以下任意 ACL：

| ACL                           | 说明                                                         |
| ----------------------------- | ------------------------------------------------------------------- |
| `"public-read"`               | 对象可被公众读取。                               |
| `"private"`                   | 对象仅可由存储桶所有者读取。                    |
| `"public-read-write"`         | 对象可被公众读取和写入。                  |
| `"authenticated-read"`        | 对象可由存储桶所有者和经过身份验证的用户读取。 |
| `"aws-exec-read"`             | 对象可由发出请求的 AWS 账户读取。    |
| `"bucket-owner-read"`         | 对象可由存储桶所有者读取。                         |
| `"bucket-owner-full-control"` | 对象可由存储桶所有者读取和写入。            |
| `"log-delivery-write"`        | 对象可由用于日志交付的 AWS 服务写入。       |

### URL 过期时间

要为预签名 URL 设置过期时间，请传递 `expiresIn` 选项。

```ts s3.ts
const url = s3file.presign({
  // 秒
  expiresIn: 3600, // 1 小时

  // 访问控制列表
  acl: "public-read",

  // HTTP 方法
  method: "PUT",
});
```

### `method`

要为预签名 URL 设置 HTTP 方法，请传递 `method` 选项。

```ts s3.ts
const url = s3file.presign({
  method: "PUT",
  // method: "DELETE",
  // method: "GET",
  // method: "HEAD",
  // method: "POST",
  // method: "PUT",
});
```

### `new Response(S3File)`

要快速将用户重定向到 S3 文件的预签名 URL，可以将 `S3File` 实例作为响应体传递给 `Response` 对象。

这将自动将用户重定向到 S3 文件的预签名 URL，为你节省了将文件下载到服务器再发送回用户的内存、时间和带宽成本。

```ts s3.ts
const response = new Response(s3file);
console.log(response);
```

```txt
Response (0 KB) {
  ok: false,
  url: "",
  status: 302,
  statusText: "",
  headers: Headers {
    "location": "https://<account-id>.r2.cloudflarestorage.com/...",
  },
  redirected: true,
  bodyUsed: false
}
```

***

## 支持 S3 兼容服务

Bun 的 S3 实现可与任何 S3 兼容的存储服务配合使用。只需指定相应的端点：

### 使用 Bun 的 S3Client 与 AWS S3

AWS S3 是默认选项。你也可以为 AWS S3 传递 `region` 选项而非 `endpoint` 选项。

```ts s3.ts
import { S3Client } from "bun";

// AWS S3
const s3 = new S3Client({
  accessKeyId: "access-key",
  secretAccessKey: "secret-key",
  bucket: "my-bucket",
  // endpoint: "https://s3.us-east-1.amazonaws.com",
  // region: "us-east-1",
});
```

### 使用 Bun 的 S3Client 与 Google Cloud Storage

要将 Bun 的 S3 客户端与 [Google Cloud Storage](https://cloud.google.com/storage) 配合使用，请在 `S3Client` 构造函数中将 `endpoint` 设置为 `"https://storage.googleapis.com"`。

```ts s3.ts
import { S3Client } from "bun";

// Google Cloud Storage
const gcs = new S3Client({
  accessKeyId: "access-key",
  secretAccessKey: "secret-key",
  bucket: "my-bucket",
  endpoint: "https://storage.googleapis.com",
});
```

### 使用 Bun 的 S3Client 与 Cloudflare R2

要将 Bun 的 S3 客户端与 [Cloudflare R2](https://developers.cloudflare.com/r2/) 配合使用，请在 `S3Client` 构造函数中将 `endpoint` 设置为 R2 端点。R2 端点包含你的账户 ID。

```ts s3.ts
import { S3Client } from "bun";

// CloudFlare R2
const r2 = new S3Client({
  accessKeyId: "access-key",
  secretAccessKey: "secret-key",
  bucket: "my-bucket",
  endpoint: "https://<account-id>.r2.cloudflarestorage.com",
});
```

### 使用 Bun 的 S3Client 与 DigitalOcean Spaces

要将 Bun 的 S3 客户端与 [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/) 配合使用，请在 `S3Client` 构造函数中将 `endpoint` 设置为 DigitalOcean Spaces 端点。

```ts s3.ts
import { S3Client } from "bun";

const spaces = new S3Client({
  accessKeyId: "access-key",
  secretAccessKey: "secret-key",
  bucket: "my-bucket",
  // region: "nyc3",
  endpoint: "https://<region>.digitaloceanspaces.com",
});
```

### 使用 Bun 的 S3Client 与 MinIO

要将 Bun 的 S3 客户端与 [MinIO](https://min.io/) 配合使用，请在 `S3Client` 构造函数中将 `endpoint` 设置为 MinIO 运行的 URL。

```ts s3.ts
import { S3Client } from "bun";

const minio = new S3Client({
  accessKeyId: "access-key",
  secretAccessKey: "secret-key",
  bucket: "my-bucket",

  // 确保使用正确的端点 URL
  // 在生产环境中可能不是 localhost！
  endpoint: "http://localhost:9000",
});
```

### 使用 Bun 的 S3Client 与 Supabase

要将 Bun 的 S3 客户端与 [Supabase](https://supabase.com/) 配合使用，请在 `S3Client` 构造函数中将 `endpoint` 设置为 Supabase 端点。Supabase 端点包含你的账户 ID 和 `/storage/v1/s3` 路径。确保在 Supabase 仪表板的 `https://supabase.com/dashboard/project/<account-id>/settings/storage` 中启用“通过 S3 协议连接”，并设置同一部分中提供的区域。

```ts s3.ts
import { S3Client } from "bun";

const supabase = new S3Client({
  accessKeyId: "access-key",
  secretAccessKey: "secret-key",
  bucket: "my-bucket",
  region: "us-west-1",
  endpoint: "https://<account-id>.supabase.co/storage/v1/s3/storage",
});
```

### 使用 Bun 的 S3Client 与 S3 虚拟托管样式端点

使用 S3 虚拟托管样式端点时，需要将 `virtualHostedStyle` 选项设置为 `true`。



```ts s3.ts
import { S3Client } from "bun";

// 从区域和存储桶推断的 AWS S3 端点
const s3 = new S3Client({
  accessKeyId: "access-key",
  secretAccessKey: "secret-key",
  bucket: "my-bucket",
  virtualHostedStyle: true, // [!code ++]
  // endpoint: "https://my-bucket.s3.us-east-1.amazonaws.com",
  // region: "us-east-1",
});

// AWS S3
const s3WithEndpoint = new S3Client({
  accessKeyId: "access-key",
  secretAccessKey: "secret-key",
  endpoint: "https://<bucket-name>.s3.<region>.amazonaws.com",
  virtualHostedStyle: true, // [!code ++]
});

// Cloudflare R2
const r2WithEndpoint = new S3Client({
  accessKeyId: "access-key",
  secretAccessKey: "secret-key",
  endpoint: "https://<bucket-name>.<account-id>.r2.cloudflarestorage.com",
  virtualHostedStyle: true, // [!code ++]
});
```

***

## 凭证

凭证是使用 S3 最困难的部分之一，我们已尽力使其尽可能简单。默认情况下，Bun 会从以下环境变量中读取凭证。

| 选项名称       | 环境变量           |
| ----------------- | ---------------------- |
| `accessKeyId`     | `S3_ACCESS_KEY_ID`     |
| `secretAccessKey` | `S3_SECRET_ACCESS_KEY` |
| `region`          | `S3_REGION`            |
| `endpoint`        | `S3_ENDPOINT`          |
| `bucket`          | `S3_BUCKET`            |
| `sessionToken`    | `S3_SESSION_TOKEN`     |

如果未设置 `S3_*` 环境变量，Bun 还会检查每个上述选项的 `AWS_*` 环境变量。

| 选项名称       | 回退环境变量         |
| ----------------- | ----------------------------- |
| `accessKeyId`     | `AWS_ACCESS_KEY_ID`           |
| `secretAccessKey` | `AWS_SECRET_ACCESS_KEY`       |
| `region`          | `AWS_REGION`                  |
| `endpoint`        | `AWS_ENDPOINT`                |
| `bucket`          | `AWS_BUCKET`                  |
| `sessionToken`    | `AWS_SESSION_TOKEN`           |

这些环境变量从 [`.env` 文件](/runtime/environment-variables) 或进程环境（不是 `process.env`）中读取。

这些默认值会被你传递给 `s3.file(credentials)`、`new Bun.S3Client(credentials)` 或任何接受凭证的方法的选项覆盖。因此，例如，如果你对不同存储桶使用相同的凭证，可以在 `.env` 文件中设置一次凭证，然后将 `bucket: "my-bucket"` 传递给 `s3.file()` 函数，而无需再次指定所有凭证。

### `S3Client` 对象

当你不使用环境变量或使用多个存储桶时，可以创建一个 `S3Client` 对象来显式设置凭证。

```ts s3.ts
import { S3Client } from "bun";

const client = new S3Client({
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
  bucket: "my-bucket",
  // sessionToken: "..."
  endpoint: "https://s3.us-east-1.amazonaws.com",
  // endpoint: "https://<account-id>.r2.cloudflarestorage.com", // Cloudflare R2
  // endpoint: "http://localhost:9000", // MinIO
});

// 使用 Response 写入
await file.write(new Response("Hello World!"));

// 预签名 URL
const url = file.presign({
  expiresIn: 60 * 60 * 24, // 1 天
  acl: "public-read",
});

// 删除文件
await file.delete();
```

### `S3Client.prototype.write`

要上传或写入文件到 S3，请在 `S3Client` 实例上调用 `write`。

```ts s3.ts
const client = new Bun.S3Client({
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
  endpoint: "https://s3.us-east-1.amazonaws.com",
  bucket: "my-bucket",
});

await client.write("my-file.txt", "Hello World!");
await client.write("my-file.txt", new Response("Hello World!"));

// 等价于
// await client.file("my-file.txt").write("Hello World!");
```

### `S3Client.prototype.delete`

要从 S3 删除文件，请在 `S3Client` 实例上调用 `delete`。

```ts s3.ts
const client = new Bun.S3Client({
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
  bucket: "my-bucket",
});

await client.delete("my-file.txt");
// 等价于
// await client.file("my-file.txt").delete();
```

### `S3Client.prototype.exists`

要检查 S3 中是否存在文件，请在 `S3Client` 实例上调用 `exists`。

```ts s3.ts
const client = new Bun.S3Client({
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
  bucket: "my-bucket",
});

const exists = await client.exists("my-file.txt");
// 等价于
// const exists = await client.file("my-file.txt").exists();
```

## `S3File`

`S3File` 实例通过调用 `S3Client` 实例方法或 `s3.file()` 函数创建。与 `Bun.file()` 类似，`S3File` 实例是惰性的。它们不一定在创建时就指向实际存在的内容。这就是为什么所有不涉及网络请求的方法都是完全同步的。

```ts Type Reference
interface S3File extends Blob {
  slice(start: number, end?: number): S3File;
  exists(): Promise<boolean>;
  unlink(): Promise<void>;
  presign(options: S3Options): string;
  text(): Promise<string>;
  json(): Promise<any>;
  bytes(): Promise<Uint8Array>;
  arrayBuffer(): Promise<ArrayBuffer>;
  stream(options: S3Options): ReadableStream;
  write(
    data: string | Uint8Array | ArrayBuffer | Blob | ReadableStream | Response | Request,
    options?: BlobPropertyBag,
  ): Promise<number>;

  exists(options?: S3Options): Promise<boolean>;
  unlink(options?: S3Options): Promise<void>;
  delete(options?: S3Options): Promise<void>;
  presign(options?: S3Options): string;

  stat(options?: S3Options): Promise<S3Stat>;
  /**
   * 大小无法同步获取，因为它需要网络请求。
   *
   * @deprecated 请改用 `stat()`。
   */
  size: NaN;

  // ... 为简洁起见省略更多内容
}
```

与 `Bun.file()` 类似，`S3File` 继承自 [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)，因此 `Blob` 上可用的所有方法在 `S3File` 上也可用。用于从本地文件读取数据的相同 API 也适用于从 S3 读取数据。

| 方法                       | 输出           |
| ---------------------------- | ---------------- |
| `await s3File.text()`        | `string`         |
| `await s3File.bytes()`       | `Uint8Array`     |
| `await s3File.json()`        | `JSON`           |
| `await s3File.stream()`      | `ReadableStream` |
| `await s3File.arrayBuffer()` | `ArrayBuffer`    |

这意味着将 `S3File` 实例与 `fetch()`、`Response` 以及其他接受 `Blob` 实例的 Web API 一起使用即可正常工作。

### 使用 `slice` 进行部分读取

要读取文件的部分范围，可以使用 `slice` 方法。

```ts s3.ts
const partial = s3file.slice(0, 1024);

// 将部分范围读取为 Uint8Array
const bytes = await partial.bytes();

// 将部分范围读取为字符串
const text = await partial.text();
```

内部实现使用 HTTP `Range` 头仅请求你需要的字节。此 `slice` 方法与 [`Blob.prototype.slice`](https://developer.mozilla.org/en-US/docs/Web/API/Blob/slice) 相同。

### 从 S3 删除文件

要从 S3 删除文件，可以使用 `delete` 方法。

```ts s3.ts
await s3file.delete();
// await s3File.unlink();
```

`delete` 与 `unlink` 相同。

## 错误代码

当 Bun 的 S3 API 抛出错误时，它将具有一个 `code` 属性，匹配以下值之一：

* `ERR_S3_MISSING_CREDENTIALS`
* `ERR_S3_INVALID_METHOD`
* `ERR_S3_INVALID_PATH`
* `ERR_S3_INVALID_ENDPOINT`
* `ERR_S3_INVALID_SIGNATURE`
* `ERR_S3_INVALID_SESSION_TOKEN`

当 S3 对象存储服务返回错误（即不是 Bun 返回的错误）时，它将是一个 `S3Error` 实例（一个 `name` 为 `"S3Error"` 的 `Error` 实例）。

## `S3Client` 静态方法

`S3Client` 类提供了几种用于与 S3 交互的静态方法。

### `S3Client.write`（静态）

要直接将数据写入存储桶中的路径，可以使用 `S3Client.write` 静态方法。

```ts s3.ts
import { S3Client } from "bun";

const credentials = {
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
  bucket: "my-bucket",
  // endpoint: "https://s3.us-east-1.amazonaws.com",
  // endpoint: "https://<account-id>.r2.cloudflarestorage.com", // Cloudflare R2
};

// 写入字符串
await S3Client.write("my-file.txt", "Hello World");

// 带类型写入 JSON
await S3Client.write("data.json", JSON.stringify({ hello: "world" }), {
  ...credentials,
  type: "application/json",
});

// 从 fetch 写入
const res = await fetch("https://example.com/data");
await S3Client.write("data.bin", res, credentials);

// 带 ACL 写入
await S3Client.write("public.html", html, {
  ...credentials,
  acl: "public-read",
  type: "text/html",
});
```

这等价于调用 `new S3Client(credentials).write("my-file.txt", "Hello World")`。

### `S3Client.presign`（静态）

要为 S3 文件生成预签名 URL，可以使用 `S3Client.presign` 静态方法。

```ts s3.ts
import { S3Client } from "bun";

const credentials = {
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
  bucket: "my-bucket",
  // endpoint: "https://s3.us-east-1.amazonaws.com",
  // endpoint: "https://<account-id>.r2.cloudflarestorage.com", // Cloudflare R2
};

const url = S3Client.presign("my-file.txt", {
  ...credentials,
  expiresIn: 3600,
});
```

这等价于调用 `new S3Client(credentials).presign("my-file.txt", { expiresIn: 3600 })`。

### `S3Client.list`（静态）

要列出存储桶中的部分或全部（最多 1,000 个）对象，可以使用 `S3Client.list` 静态方法。

```ts s3.ts
import { S3Client } from "bun";

const credentials = {
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
  bucket: "my-bucket",
  // endpoint: "https://s3.us-east-1.amazonaws.com",
  // endpoint: "https://<account-id>.r2.cloudflarestorage.com", // Cloudflare R2
};

// 列出存储桶中的（最多）1000 个对象
const allObjects = await S3Client.list(null, credentials);

// 列出 `uploads/` 前缀下的（最多）500 个对象，并为每个对象获取所有者字段
const uploads = await S3Client.list({
  prefix: 'uploads/',
  maxKeys: 500,
  fetchOwner: true,
}, credentials);

// 检查是否有更多结果可用
if (uploads.isTruncated) {
  // 列出 `uploads/` 前缀下的下一批对象
  const moreUploads = await S3Client.list({
    prefix: 'uploads/',
    maxKeys: 500,
    startAfter: uploads.contents!.at(-1).key
    fetchOwner: true,
  }, credentials);
}
```

这等价于调用 `new S3Client(credentials).list()`。

### `S3Client.exists`（静态）

要检查 S3 文件是否存在，可以使用 `S3Client.exists` 静态方法。

```ts s3.ts
import { S3Client } from "bun";

const credentials = {
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
  bucket: "my-bucket",
  // endpoint: "https://s3.us-east-1.amazonaws.com",
  // endpoint: "https://<account-id>.r2.cloudflarestorage.com", // Cloudflare R2
};

const exists = await S3Client.exists("my-file.txt", credentials);
```

该方法在 `S3File` 实例上同样适用。

```ts s3.ts
import { s3 } from "bun";

const s3file = s3.file("my-file.txt", {
  // ...credentials,
});

const exists = await s3file.exists();
```

### `S3Client.size`（静态）

要快速检查 S3 文件的大小而不下载它，可以使用 `S3Client.size` 静态方法。

```ts s3.ts
import { S3Client } from "bun";

const credentials = {
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
  bucket: "my-bucket",
  // endpoint: "https://s3.us-east-1.amazonaws.com",
  // endpoint: "https://<account-id>.r2.cloudflarestorage.com", // Cloudflare R2
};

const bytes = await S3Client.size("my-file.txt", credentials);
```

这等价于调用 `new S3Client(credentials).size("my-file.txt")`。

### `S3Client.stat`（静态）

要获取 S3 文件的大小、etag 和其他元数据，可以使用 `S3Client.stat` 静态方法。

```ts s3.ts
import { S3Client } from "bun";

const credentials = {
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
  bucket: "my-bucket",
  // endpoint: "https://s3.us-east-1.amazonaws.com",
  // endpoint: "https://<account-id>.r2.cloudflarestorage.com", // Cloudflare R2
};

const stat = await S3Client.stat("my-file.txt", credentials);
```

```txt
{
  etag: "\"7a30b741503c0b461cc14157e2df4ad8\"",
  lastModified: 2025-01-07T00:19:10.000Z,
  size: 1024,
  type: "text/plain;charset=utf-8",
}
```

### `S3Client.delete`（静态）

要删除 S3 文件，可以使用 `S3Client.delete` 静态方法。

```ts s3.ts
import { S3Client } from "bun";

const credentials = {
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
  bucket: "my-bucket",
  // endpoint: "https://s3.us-east-1.amazonaws.com",
};

await S3Client.delete("my-file.txt", credentials);
// 等价于
// await new S3Client(credentials).delete("my-file.txt");

// S3Client.unlink 是 S3Client.delete 的别名
await S3Client.unlink("my-file.txt", credentials);
```

## `s3://` 协议

为了更轻松地对本地文件和 S3 文件使用相同的代码，`fetch` 和 `Bun.file()` 支持 `s3://` 协议。

```ts s3.ts
const response = await fetch("s3://my-bucket/my-file.txt");
const file = Bun.file("s3://my-bucket/my-file.txt");
```

你还可以将 `s3` 选项传递给 `fetch` 和 `Bun.file` 函数。

```ts s3.ts
const response = await fetch("s3://my-bucket/my-file.txt", {
  s3: {
    accessKeyId: "your-access-key",
    secretAccessKey: "your-secret-key",
    endpoint: "https://s3.us-east-1.amazonaws.com",
  },
  headers: {
    range: "bytes=0-1023",
  },
});
```

### UTF-8、UTF-16 和 BOM（字节顺序标记）

与 `Response` 和 `Blob` 类似，`S3File` 默认假设为 UTF-8 编码。

在 `S3File` 上调用 `text()` 或 `json()` 方法时：

* 当检测到 UTF-16 字节顺序标记（BOM）时，将被视为 UTF-16。JavaScriptCore 原生支持 UTF-16，因此会跳过 UTF-8 转码过程（并剥离 BOM）。这通常是好的，但也意味着如果你的 UTF-16 字符串中有无效的代理对字符，它们将被传递给 JavaScriptCore（与源代码相同）。
* 当检测到 UTF-8 BOM 时，在将字符串传递给 JavaScriptCore 之前会将其剥离，并且无效的 UTF-8 代码点将被替换为 Unicode 替换字符（`\uFFFD`）。
* 不支持 UTF-32。

---

> 要查找此文档中的导航和其他页面，请获取 llms.txt 文件：https://bun.com/docs/llms.txt