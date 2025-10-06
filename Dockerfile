# 使用 Node.js 20 LTS 作为基础镜像
FROM node:24-alpine AS base

# 安装依赖阶段
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml (如果存在)
COPY package.json pnpm-lock.yaml* ./

# 安装 pnpm 并安装依赖
RUN npm install -g pnpm && \
  pnpm install --frozen-lockfile

# 构建阶段
FROM base AS builder
WORKDIR /app

# 从 deps 阶段复制 node_modules
COPY --from=deps /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 设置环境变量
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000



# 构建应用
RUN npm install -g pnpm
RUN pnpm build && pnpm build:scripts

# 运行阶段
FROM base AS runner
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# 创建非 root 用户
RUN addgroup --system --gid 1001 nitro
RUN adduser --system --uid 1001 nitro

# 复制构建产物 (Nitro 输出到 .output 目录)
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle
COPY --from=deps /app/node_modules ./node_modules

# 复制运行所需文件
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# 切换到非 root 用户
USER nitro

# 暴露端口
EXPOSE 3000

# 设置入口点：先迁移/可选 seed，再启动服务
ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))" || exit 1