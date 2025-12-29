import * as path from "node:path";
import { Pipeline } from "./core/pipeline";
import { ContractTask } from "./tasks/contract.task";
import { ServiceTask } from "./tasks/service.task";
import { ControllerTask } from "./tasks/controller.task";

const SCHEMA_PATH = path.resolve(__dirname, "../src/table.schema.ts");
// 输出到 src/modules
const OUT_DIR = path.resolve(__dirname, "../src/modules");

const pipeline = new Pipeline([
  ContractTask,
  ServiceTask,
  ControllerTask
]);

pipeline.run(SCHEMA_PATH, OUT_DIR).catch(console.error);