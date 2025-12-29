import * as path from "node:path";
import { Pipeline } from "./core/pipeline";
import { ContractTask } from "./tasks/contract.task";
import { ServiceTask } from "./tasks/service.task";
import { ControllerTask } from "./tasks/controller.task";

const SCHEMA_PATH = path.resolve(__dirname, "../packages/contract/src/table.schema.ts");

// 🔥 核心配置：分别指定各模块生成位置
const CONTRACT_DIR = path.resolve(__dirname, "../packages/contract/src/modules");
const BACKEND_MODULE_DIR = path.resolve(__dirname, "../apps/b2badmin/server/modules");

const pipeline = new Pipeline([
  ContractTask,
  ServiceTask,
  ControllerTask
]);

// 运行！Contract 生成到 packages/contract，Service/Controller 生成到 apps/b2badmin
pipeline.run(SCHEMA_PATH, {
  contractDir: CONTRACT_DIR,
  serviceDir: BACKEND_MODULE_DIR,
  controllerDir: BACKEND_MODULE_DIR
}).catch(console.error);

