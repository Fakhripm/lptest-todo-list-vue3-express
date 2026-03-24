import globals from "globals";
import pluginJs from "@eslint/js";

export default [
    { languageOptions: { globals: globals.node } }, // 告诉它你在跑 Node.js 环境
    pluginJs.configs.recommended,
    {
        rules: {
            "no-unused-vars": "warn", // 变量定义了没用只报警告，不报错
            "no-console": "off"       // 允许使用 console.log
        }
    }
];