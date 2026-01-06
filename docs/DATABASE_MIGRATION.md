你提到的 "datagroup" 应该是 JetBrains 的 **DataGrip** 或者是通用的数据库管理工具。

为了让导出的 SQL 文件能**最顺利地**在 DataGrip、DBeaver 或 Navicat 等图形化软件中直接运行（Import/Run Script），我们需要注意以下两点：

1. **改为 `INSERT` 语句**：默认的 `pg_dump` 使用 `COPY` 命令（Postgres 专用），这在图形界面软件中直接执行脚本时有时会报错或不兼容。改为生成标准的 `INSERT` 语句最通用。
2. **编码问题**：PowerShell 的默认重定向 `>` 可能会导致文件编码变成 UTF-16，导致导入软件乱码。我们需要强制指定为 UTF-8。

请使用下面的 PowerShell 命令：

### ✅ 推荐方案：生成标准 INSERT 语句（纯数据）

这个命令生成的文件，里面的内容是 `INSERT INTO table (...) VALUES (...)`，任何支持 SQL 的软件打开都能直接运行。

```powershell
# 1. 设置日期
$date = Get-Date -Format "yyyyMMdd"

# 2. 确保备份目录存在
New-Item -ItemType Directory -Force -Path ".\backups"

# 3. 核心命令 (请确保 shop-db 是你的容器名)
# 关键参数解释：
# --column-inserts : 生成标准的 INSERT 语句 (通用性最强)
# --data-only      : 只导出数据 (假设你数据库里表结构已经有了)
# Out-File         : 强制使用 UTF8 编码保存，防止乱码
docker exec -i shop-db pg_dump -U shop -d shop --data-only --column-inserts --no-owner --no-acl | Out-File -FilePath ".\backups\shop_inserts_$date.sql" -Encoding utf8

```

---

### 💡 进阶：如果你需要包含表结构（完整备份）

如果你想在一个**新的**空数据库里直接导入（连表结构一起创建），请去掉 `--data-only`，并加上 `--clean`（导入前先尝试删除旧表，避免冲突）：

```powershell
$date = Get-Date -Format "yyyyMMdd"

docker exec -i shop-db pg_dump -U shop -d shop --column-inserts --no-owner --no-acl --clean --if-exists | Out-File -FilePath ".\backups\shop_full_$date.sql" -Encoding utf8

```

### 如何在 DataGrip 中导入？

1. **打开 DataGrip**。
2. 连接到你的目标数据库。
3. **右键点击** 你的目标 Schema (通常是 `public`)。
4. 选择 **SQL Scripts** -> **Run SQL Script...**
5. 选择刚才生成的 `.sql` 文件。
6. 因为我们用了 `--column-inserts` 和 `UTF8`，它应该能完美执行，不会报 `COPY` 相关的错误。