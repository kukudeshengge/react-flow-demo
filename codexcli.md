# Codex CLI 使用指南

> Codex CLI 是 OpenAI 的终端编码助手，可以在本地项目中阅读代码、修改文件、运行命令、执行测试和审查代码变更。
>
> 官方文档：
> - [Codex CLI 快速开始](https://developers.openai.com/codex/cli/)
> - [CLI 命令参考](https://developers.openai.com/codex/cli/reference/)

## 一、安装与登录

### 安装

macOS / Linux 可以使用官方安装脚本：

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

也可以使用 npm 或 Homebrew 安装，具体方式以官方文档为准。

检查是否安装成功：

```bash
codex --version
codex --help
```

### 登录

在项目目录中运行：

```bash
codex login
```

根据提示选择 ChatGPT 登录、API Key 或其他可用认证方式。退出登录：

```bash
codex logout
```

## 二、基本使用

先进入项目根目录，再启动交互式界面：

```bash
cd /path/to/your/project
codex
```

启动后直接用自然语言描述任务，例如：

```text
请先分析这个项目的目录结构，然后告诉我如何启动开发环境。
```

```text
修复登录页面在移动端的布局问题，并运行相关测试。
```

也可以在启动命令后直接附带任务：

```bash
codex "分析当前项目的技术栈，并给出启动和构建命令"
```

指定工作目录：

```bash
codex --cd /path/to/project "检查项目中的 TypeScript 类型错误"
```

## 三、推荐的提问方式

一个清晰的任务通常包含以下信息：

1. 目标：想实现或修复什么。
2. 范围：允许修改哪些文件或模块。
3. 约束：不要改变哪些行为、接口或依赖。
4. 验证：需要运行哪些测试、Lint 或构建命令。

示例：

```text
请在 src/components 目录中增加一个分页组件。
要求：使用现有的 UI 风格，不新增依赖，支持上一页/下一页和当前页显示。
完成后运行项目已有的测试和 lint，并说明修改了哪些文件。
```

建议让 Codex 先分析再修改；涉及较大改动时，可以先要求它给出计划，确认后再执行。

## 四、常用交互式斜杠命令

斜杠命令需要在 `codex` 交互界面中输入：

| 命令 | 作用 |
| --- | --- |
| `/help` | 查看帮助和可用快捷操作 |
| `/init` | 在项目中创建 `AGENTS.md`，用于保存项目协作说明 |
| `/status` | 查看当前会话配置、模型和工作目录 |
| `/model` | 选择模型及推理强度 |
| `/permissions` | 设置 Codex 可以执行的操作和权限 |
| `/review` | 审查当前代码变更并查找问题 |
| `/compact` | 压缩较长的会话上下文，释放上下文空间 |
| `/clear` | 清空当前会话内容 |
| `/exit` 或 `Ctrl+C` | 退出当前会话 |

不同版本的斜杠命令可能略有差异，输入 `/help` 可以查看本机实际支持的命令。

## 五、常用 CLI 子命令

### 1. 交互式模式

```bash
codex
codex "解释这个函数的作用"
```

### 2. 非交互式执行：`codex exec`

适合脚本、自动化任务和 CI。命令完成后直接退出：

```bash
codex exec "运行测试并总结失败原因"
```

从标准输入读取任务：

```bash
echo "检查项目中未使用的依赖" | codex exec -
```

输出 JSONL，便于脚本处理：

```bash
codex exec --json "检查当前 Git diff 中的潜在问题"
```

继续最近一次非交互式会话：

```bash
codex exec resume --last "继续处理剩余问题"
```

### 3. 继续会话：`codex resume`

继续最近一次交互式会话：

```bash
codex resume --last
```

继续指定会话：

```bash
codex resume SESSION_ID
```

如果需要从其他工作目录中查找最近会话，可以使用：

```bash
codex resume --last --all
```

### 4. 创建会话分支：`codex fork`

在保留原会话的基础上创建一个新会话：

```bash
codex fork --last
```

### 5. 审查代码：`codex review`

审查当前未提交的修改：

```bash
codex review
```

审查某个提交：

```bash
codex review --commit COMMIT_SHA
```

审查当前分支相对于基准分支的差异：

```bash
codex review --base main
```

### 6. 诊断环境：`codex doctor`

当遇到登录、配置、Git 或运行环境问题时使用：

```bash
codex doctor
```

### 7. 更新 CLI：`codex update`

```bash
codex update
```

### 8. 管理 MCP：`codex mcp`

查看已配置的 MCP 服务：

```bash
codex mcp list
```

其他 MCP 操作可以查看：

```bash
codex mcp --help
```

### 9. 生成 Shell 补全：`codex completion`

例如生成 Zsh 补全脚本：

```bash
codex completion zsh
```

## 六、常用全局参数

| 参数 | 说明 | 示例 |
| --- | --- | --- |
| `--cd`, `-C` | 指定工作目录 | `codex -C ./frontend` |
| `--model`, `-m` | 指定模型 | `codex -m MODEL_NAME` |
| `--sandbox`, `-s` | 设置沙箱级别 | `codex -s read-only` |
| `--ask-for-approval` | 设置何时需要批准 | `codex --ask-for-approval on-request` |
| `--search` | 启用实时网页搜索 | `codex --search "查找官方文档并解释"` |
| `--config`, `-c` | 临时覆盖配置 | `codex -c key=value` |
| `--help` | 查看帮助 | `codex exec --help` |
| `--version` | 查看版本 | `codex --version` |

常见沙箱级别：

- `read-only`：只能读取文件，适合分析和审查。
- `workspace-write`：可以修改当前工作区，适合日常开发。
- `danger-full-access`：权限较高，应谨慎使用。

## 七、常见工作流

### 分析项目

```bash
codex "阅读项目结构，说明启动方式、主要模块和可能的风险，不要修改文件"
```

### 开发功能

```bash
codex "实现用户列表分页功能，先给出计划，确认后修改代码并运行测试"
```

### 修复问题

```bash
codex "定位登录失败问题，先复现并分析原因，再进行最小修改，最后运行相关测试"
```

### 检查提交前改动

```bash
git diff
codex review
```

### CI 中执行检查

```bash
codex exec --json "检查当前代码是否存在明显的回归或测试缺失，并输出结论"
```

## 八、安全与使用建议

- 在正确的项目目录中启动 Codex，避免误操作其他目录。
- 修改代码前先查看 `git status`，重要修改前建议提交或建立备份。
- 涉及删除文件、安装依赖、数据库操作、发布部署等动作时，先确认命令和影响范围。
- 日常开发优先使用 `workspace-write`；分析代码时使用 `read-only`。
- 不要随意使用 `--yolo` 或 `--dangerously-bypass-approvals-and-sandbox`，这会跳过批准和沙箱限制。
- 可以在项目根目录维护 `AGENTS.md`，写入项目启动命令、编码规范、测试要求和禁止修改的内容。
- 对 Codex 生成的代码运行测试，并通过 `git diff` 检查实际变更。

## 九、遇到问题时

先查看本机帮助：

```bash
codex --help
codex exec --help
codex review --help
codex mcp --help
```

再运行诊断命令：

```bash
codex doctor
```

如果命令、参数或行为与本文不同，以当前版本的 `--help` 输出和 [官方 CLI 命令参考](https://developers.openai.com/codex/cli/reference/) 为准。

