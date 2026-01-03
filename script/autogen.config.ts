export default {
  // 1. Table 定义的源文件位置
  schemaPath: "./packages/contract/src/table.schema.ts",

  // 2. 模板根目录
  templateDir: "./script/templates",

  // 3. 每层输出位置（数组形式，支持同步到多个后端工程）
  outputs: {
    contract: ["./packages/contract/src/modules"],
    service: [
      "./apps/admin-api/src/services",
      "./apps/client-api/src/services"
    ],
    controller: [
      "./apps/admin-api/src/controllers",
      "./apps/client-api/src/controllers"
    ],
    frontendHook: ["./apps/admin-pc/src/hooks/api"]
  },

  /**
 * 是否在生成时自动更新 index.ts 或 router.ts（可选）
 */
  autoRegister: {
    contractIndex: "./packages/contract/src/modules/index.ts",
    controllerRouter: "./apps/api-main/src/app-router.ts"
  }
};