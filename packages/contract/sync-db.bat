@echo off
setlocal

:: === 源数据库（远程）===
set REMOTE_HOST=trolley.proxy.rlwy.net
set REMOTE_PORT=17023
set REMOTE_USER=postgres
set REMOTE_PASS=LKYkrgEfmvBLNcCvlPGuJfUiPNWMRZdw
set REMOTE_DB=railway

:: === 目标数据库（本地）===
set LOCAL_HOST=139.196.30.42
set LOCAL_PORT=5432
set LOCAL_USER=user_yDBAhF
set LOCAL_PASS=password_FXwrTE
set LOCAL_DB=gina

:: === 导出远程数据（仅数据，INSERT 格式）===
echo 正在导出远程数据库数据...
set PGPASSWORD=%REMOTE_PASS%
pg_dump -h %REMOTE_HOST% -p %REMOTE_PORT% -U %REMOTE_USER% -d %REMOTE_DB% ^
  --data-only ^
  --inserts ^
  --no-owner ^
  --no-privileges ^
  -f remote_data.sql

if %errorlevel% neq 0 (
    echo 导出失败！
    pause
    exit /b 1
)

:: === 自动添加 ON CONFLICT DO NOTHING ===
echo 正在处理 SQL 文件以支持冲突跳过...
powershell -Command "(Get-Content remote_data.sql -Raw) -replace '\);', ') ON CONFLICT DO NOTHING;' | Set-Content remote_data_fixed.sql"

if %errorlevel% neq 0 (
    echo 处理 SQL 文件失败！
    pause
    exit /b 1
)

:: === 导入到本地数据库 ===
echo 正在导入数据到本地数据库...
set PGPASSWORD=%LOCAL_PASS%
psql -h %LOCAL_HOST% -p %LOCAL_PORT% -U %LOCAL_USER% -d %LOCAL_DB% -f remote_data_fixed.sql

if %errorlevel% neq 0 (
    echo 导入失败！
    pause
    exit /b 1
)

echo.
echo ✅ 同步完成！所有新数据已安全导入本地。
pause