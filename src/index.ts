import { readFile, readdir, rm, writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { join, parse } from 'path';

/**
 * OpenClaw Skill Cleaner & Optimizer
 * 
 * 自动化清理、验证、和优化 OpenClaw 技能目录
 * 
 * @example
 * ```bash
 * # 清理过时文件
 * npx openclaw-skill-cleaner --mode cleanup
 * 
 * # 验证技能完整性
 * npx openclaw-skill-cleaner --mode validate
 * 
 * # 恢复默认配置
 * npx openclaw-skill-cleaner --mode reset
 * ```
 */

// === 配置 ===
const SKILL_FILES = [
  'SKILL.md',
  'references/',
  'scripts/',
];

const IGNORE_FILES = [
  '.gitignore',
  'package.json',
  'node_modules/',
];

// === 命令处理 ===
type Command = 'cleanup' | 'validate' | 'reset';

interface Options {
  mode: Command;
  skillPath?: string;
  verbose?: boolean;
}

// === 主逻辑 ===
async function main() {
  const options: Options = parseArgs();
  
  const skillPath = options.skillPath || './';
  console.log(`🔍 扫描技能目录：${skillPath}`);
  
  switch (options.mode) {
    case 'cleanup':
      await cleanupSkill(skillPath);
      break;
    case 'validate':
      await validateSkill(skillPath);
      break;
    case 'reset':
      await resetSkill(skillPath);
      break;
    default:
      console.error('❌ 未知模式');
      process.exit(1);
  }
  
  console.log('✅ 完成');
}

// === 清理 ===
async function cleanupSkill(path: string) {
  console.log('🗑️  开始清理...\n');
  
  const files = await readdir(path);
  
  for (const file of files) {
    const fullPath = join(path, file);
    
    if (IGNORE_FILES.includes(file)) {
      continue;
    }
    
    if (file === 'SKILL.md') {
      console.log(`✔️  保留：${file}`);
    } else if (file.endsWith('/')) {
      // 目录：检查是否是标准目录
      if (['references', 'scripts'].includes(file.slice(0, -1))) {
        console.log(`✔️  保留目录：${file}`);
      } else {
        console.log(`🗑️  清理目录：${file}`);
        // await rm(fullPath, { recursive: true }, (err) => {
        //   if (err) console.error(`❌ 清理失败：${file}`, err);
        // });
      }
    } else {
      console.log(`🗑️  清理文件：${file}`);
      // await rm(fullPath);
    }
  }
  
  console.log('\n✅ 清理完成\n');
  console.log('保留的文件:');
  SKILL_FILES.forEach(f => console.log(`  - ${f}`));
}

// === 验证 ===
async function validateSkill(path: string) {
  console.log('📋 开始验证...\n');
  
  let errors: string[] = [];
  let warnings: string[] = [];
  
  // 检查必需文件
  for (const required of SKILL_FILES) {
    const fullPath = join(path, required);
    const exists = existsSync(fullPath);
    
    if (required.endsWith('/')) {
      console.log(`📁 检查目录：${required}`);
      if (exists) {
        console.log(`  ✅ ${required} 存在`);
      } else {
        console.log(`  ⚠️  ${required} 可选，不存在`);
        warnings.push(`${required} 不存在`);
      }
    } else {
      console.log(`📄 检查文件：${required}`);
      if (exists) {
        console.log(`  ✅ ${required} 存在`);
      } else {
        console.log(`  ❌ ${required} 缺失`);
        errors.push(`${required} 缺失`);
      }
    }
  }
  
  // 检查额外文件
  const files = await readdir(path);
  for (const file of files) {
    if (!SKILL_FILES.includes(file) && !IGNORE_FILES.includes(file)) {
      console.log(`  ⚠️  非标准文件：${file}`);
      warnings.push(`非标准文件：${file}`);
    }
  }
  
  console.log('\n📊 验证结果:');
  console.log(`  错误：${errors.length}`);
  console.log(`  警告：${warnings.length}`);
  
  if (errors.length > 0) {
    console.log('\n❌ 错误详情:');
    errors.forEach(e => console.log(`  - ${e}`));
    process.exit(1);
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  警告详情:');
    warnings.forEach(w => console.log(`  - ${w}`));
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ 验证通过\n');
  }
}

// === 重置 ===
async function resetSkill(path: string) {
  console.log('🔄 开始重置...\n');
  
  const files = await readdir(path);
  
  for (const file of files) {
    if (!SKILL_FILES.includes(file) && !IGNORE_FILES.includes(file)) {
      console.log(`🗑️  删除：${file}`);
      await rm(join(path, file));
    }
  }
  
  console.log('\n✅ 重置完成\n');
}

// === 参数解析 ===
function parseArgs(): Options {
  const args = process.argv.slice(2);
  const options: Options = { mode: 'validate' };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--mode' && args[i + 1]) {
      const mode = args[++i];
      if (['cleanup', 'validate', 'reset'].includes(mode)) {
        options.mode = mode as Command;
      }
    }
    
    if (arg === '--path' || arg === '--skill-dir' && args[i + 1]) {
      options.skillPath = args[++i];
    }
    
    if (arg === '--verbose') {
      options.verbose = true;
    }
    
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }
  
  return options;
}

function printHelp() {
  console.log(`
Usage: openclaw-skill-cleaner [options]

Options:
  --mode <mode>       操作模式 (validate|cleanup|reset) [default: validate]
  --path <path>       技能目录 [default: ./]
  --verbose           详细输出
  --help, -h          显示帮助信息

Modes:
  validate  验证技能完整性
  cleanup   清理非标准文件
  reset     重置为标准结构

Examples:
  npx openclaw-skill-cleaner
  npx openclaw-skill-cleaner --mode cleanup
  npx openclaw-skill-cleaner --path ./my-skill --mode validate
`);
}

main().catch(err => {
  console.error('❌ 错误:', err);
  process.exit(1);
});
