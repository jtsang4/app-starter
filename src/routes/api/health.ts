import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/env";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const startTime = Date.now();

        try {
          // 基本服务健康检查
          const responseTime = Date.now() - startTime;
          const uptime = process.uptime();
          const memoryUsage = process.memoryUsage();

          return new Response(
            JSON.stringify({
              status: "healthy",
              timestamp: new Date().toISOString(),
              uptime: Math.floor(uptime),
              responseTime: `${responseTime}ms`,
              version: "1.0.0", // 可以从 package.json 读取，但暂时硬编码
              environment: env.NODE_ENV,
              services: {
                server: "running",
                memory: {
                  used: Math.floor(memoryUsage.heapUsed / 1024 / 1024),
                  total: Math.floor(memoryUsage.heapTotal / 1024 / 1024),
                  external: Math.floor(memoryUsage.external / 1024 / 1024),
                  unit: "MB",
                },
              },
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
                Expires: "0",
              },
            },
          );
        } catch (error) {
          // 服务器错误
          return new Response(
            JSON.stringify({
              status: "unhealthy",
              timestamp: new Date().toISOString(),
              error: "Server error occurred",
              uptime: process.uptime(),
            }),
            {
              status: 503,
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
              },
            },
          );
        }
      },
    },
  },
});
