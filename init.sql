-- 初始化数据库脚本
-- 这个脚本会在 PostgreSQL 容器首次启动时运行
-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 创建用户表 (如果不存在)
-- 注意：实际的表结构由 Drizzle 管理，这里只是示例
-- 设置时区
SET
  timezone = 'UTC';

-- 创建默认用户 (可选)
-- DO $$
-- BEGIN
--   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'appstarter_user') THEN
--     CREATE ROLE appstarter_user LOGIN PASSWORD 'secure_password';
--   END IF;
-- END
-- $$;