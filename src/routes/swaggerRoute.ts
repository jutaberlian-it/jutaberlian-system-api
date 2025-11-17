import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const router = express.Router();

const swaggerDocument = YAML.load(
  path.resolve(__dirname, "../../swagger.yaml")
);

router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(swaggerDocument));

export default router;
