# 🧹 OpenClaw Skill Cleaner

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E18.0.0-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org)

**OpenClaw 技能自动清理器和优化器** - 自动化验证、清理、重置 OpenClaw 技能目录

---

## 📖 介绍

当你维护多个 OpenClaw 技能时，手动检查、清理、重置每个技能目录既耗时又容易遗漏。`openclaw-skill-cleaner` 帮你自动化这个流程！

### 功能特性

- ✅ **验证技能完整性** - 检查必需文件和目录结构
- 🧹 **清理非标准文件** - 移除测试文件、临时文件等非必需内容
- 🔄 **重置为标准结构** - 一键恢复到标准 OpenClaw 技能布局
- 📊 **详细报告** - 输出清理/验证结果和警告信息

---

## 🚀 快速开始

### 安装

```bash
# Global 安装
npm install -g openclaw-skill-cleaner

# 或使用 npx (无需安装)
npx openclaw-skill-cleaner
```

### 使用示例

```bash
# 验证当前目录的技能完整性（默认模式）
npx openclaw-skill-cleaner

# 清理当前技能目录中的非标准文件
npx openclaw-skill-cleaner --mode cleanup

# 指定目录进行验证
npx openclaw-skill-cleaner --path ./my-skill --mode validate

# 重置技能到标准结构（删除非必需文件）
npx openclaw-skill-cleaner --mode reset
```

### 命令行选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `--mode` | 操作模式：`validate` \| `cleanup` \| `reset` | `validate` |
| `--path` | 技能目录路径 | `./` |
| `--verbose` | 详细输出日志 | `false` |
| `--help` | 显示帮助信息 | - |

---

## 📋 标准技能结构

OpenClaw 技能的标准目录结构如下：

```
my-skill/
├── SKILL.md          # ⭐ 必需：技能主文档（Markdown）
├── references/       # ⚠️  可选：参考资料、链接收集
├── scripts/          # ⚠️  可选：自动化脚本
├── .gitignore        # ⚠️  可选：Git 忽略配置
├── package.json      # ⚠️  可选：依赖配置（如果技能是 NPM 包）
└── LICENSE           # ⚠️  可选：开源许可证
```

**`SKILL.md` 是唯一的必需文件！** 其他文件都是推荐的标准化配置。

---

## 🔧 高级用法

### 批量验证多个技能

```bash
# 脚本示例：遍历所有技能目录
for skill in ~/.openclaw/skills/*/; do
  echo "验证: $skill"
  npx openclaw-skill-cleaner --path "$skill" --mode validate
done
```

### 集成到 CI/CD

```yaml
# GitHub Actions 示例
- name: Validate Skill Structure
  run: npx openclaw-skill-cleaner --mode validate
```

### 自定义清理规则

如果需要自定义清理规则，可以创建配置：

```json
{
  "ignoredFiles": [".env", ".DS_Store"],
  "requiredFiles": ["SKILL.md", "README.md"],
  "allowedDirectories": ["references", "scripts", "assets"]
}
```

---

## 📝 开发

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/Cloud-Tech-User/openclaw-skill-cleaner.git
cd openclaw-skill-cleaner

# 安装依赖
npm install

# 编译
npm run build

# 开发模式
npm run dev
```

### 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📜 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 👥 作者

**OpenClaw Team**

- 📧 邮箱：zk33PsRfCCEaKgqUxi6@gmail.com
- 🔗 GitHub: [@Cloud-Tech-User](https://github.com/Cloud-Tech-User)
- 🌐 域名：830602.xyz

---

## 🙏 致谢

- OpenClaw 项目维护者们
- 所有贡献者

---

## 📞 支持

有问题？请打开 [GitHub Issues](https://github.com/Cloud-Tech-User/openclaw-skill-cleaner/issues)

---

**🎯 让 OpenClaw 技能维护更自动化！**
