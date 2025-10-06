-- 开发环境数据库初始化脚本
-- 这个脚本会在开发环境 PostgreSQL 容器首次启动时运行

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 设置时区
SET timezone = 'UTC';

-- 创建测试数据 (可选)
-- 这里可以添加一些开发环境用的测试数据

-- 示例：创建一些测试用户数据
-- 注意：实际的表结构由 Drizzle 管理，这里只是示例

-- 开发环境通常需要更宽松的权限设置
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;