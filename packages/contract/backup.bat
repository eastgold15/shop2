@echo off
setlocal

:: === 源数据库（远程）===
set REMOTE_HOST=trolley.proxy.rlwy.net
set REMOTE_PORT=17023
set REMOTE_USER=postgres
set REMOTE_PASS=LKYkrgEfmvBLNcCvlPGuJfUiPNWMRZdw
set REMOTE_DB=railway


:: === 导出远程数据（仅数据，INSERT 格式）===
echo 正在导出远程数据库数据...
set PGPASSWORD=%REMOTE_PASS%
pg_dump -h %REMOTE_HOST% -p %REMOTE_PORT% -U %REMOTE_USER% -d %REMOTE_DB% ^
  --inserts ^
  --no-owner ^
  --no-privileges ^
  -f remote_full.sql




