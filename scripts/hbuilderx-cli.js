#!/usr/bin/env node
/**
 * HBuilderX CLI Manager
 * 用法: cd scripts && node hbuilderx-cli.js
 */
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const boxen = require('boxen');
const ora = require('ora');
const { select, input } = require('@inquirer/prompts');

// ============ Config ============
const SCRIPTS_DIR = __dirname;
const ROOT_DIR = path.resolve(SCRIPTS_DIR, '..');
const CONFIG_FILE = path.join(SCRIPTS_DIR, '.hbuilderx-cli-config.json');

const COMMON_HBX_PATHS = [
  'D:\\HBuilderX',
  'C:\\Program Files\\HBuilderX',
  'C:\\Program Files (x86)\\HBuilderX',
  path.join(process.env.LOCALAPPDATA || '', 'Programs', 'HBuilderX'),
  path.join(process.env.ProgramFiles || '', 'HBuilderX'),
  path.join(process.env['ProgramFiles(x86)'] || '', 'HBuilderX'),
];

function findHBuilderX() {
  for (const dir of COMMON_HBX_PATHS) {
    if (fs.existsSync(path.join(dir, 'cli.exe'))) return dir;
  }
  return '';
}

function getManifestWxAppId() {
  try {
    const m = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'manifest.json'), 'utf8'));
    return m?.['mp-weixin']?.sdkConfigs?.oauth?.weixin?.appid || '';
  } catch { return ''; }
}

function getManifestAlipayAppId() {
  try {
    const m = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'manifest.json'), 'utf8'));
    return m?.['mp-alipay']?.appid || '';
  } catch { return ''; }
}

function loadConfig() {
  const wxAppId = getManifestWxAppId();
  const aliAppId = getManifestAlipayAppId();
  let cfg;
  try {
    cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch {
    cfg = {
      project: 'tasi_h5',
      hbxDir: '',
    };
  }
  if (!cfg.hbxDir || !fs.existsSync(path.join(cfg.hbxDir, 'cli.exe'))) {
    const found = findHBuilderX();
    if (found) { cfg.hbxDir = found; saveConfig(cfg); }
  }
  cfg.appid = wxAppId || cfg.appid || '';
  cfg.alipayAppid = aliAppId || cfg.alipayAppid || '';
  return cfg;
}

function saveConfig(cfg) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2));
}

function cliCmd(args) {
  if (config.hbxDir) return `${path.join(config.hbxDir, 'cli.exe')} ${args}`;
  return `cli ${args}`;
}

let config = loadConfig();

// ============ Display ============
function ts() {
  const d = new Date();
  return chalk.dim(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`);
}

function header() {
  console.clear();
  const info =
    chalk.dim('项目') + '   ' + chalk.bold(config.project) + '\n' +
    chalk.dim('微信') + '   ' + (config.appid ? config.appid : chalk.red('未设置')) + '\n' +
    chalk.dim('支付宝') + ' ' + (config.alipayAppid || chalk.dim('未设置')) + '\n' +
    chalk.dim('工具') + ' ' + (config.hbxDir ? chalk.cyan(path.basename(config.hbxDir)) : chalk.red('未找到'));
  console.log(boxen(chalk.bold.yellow(' HBuilderX CLI 管理工具 ') + '\n\n' + info,
    { padding: 1, borderStyle: 'round', borderColor: 'cyan' }
  ));
}

function runCmd(cmd) {
  return new Promise(resolve => {
    const sp = ora({ text: '正在执行...', color: 'cyan' }).start();
    const isWin = process.platform === 'win32';
    const proc = spawn(isWin ? 'cmd.exe' : 'sh',
      isWin ? ['/c', cmd] : ['-c', cmd],
      { stdio: 'inherit', windowsHide: true, cwd: ROOT_DIR });
    sp.stop();
    console.log(`  ${ts()} ${chalk.cyan('$')} ${chalk.dim(cmd)}\n`);
    proc.on('close', code => {
      const msg = code === 0 ? chalk.green('✔ 完成') : chalk.red('✖ 失败 (exit: ' + code + ')');
      console.log(`\n${boxen(` ${ts()} ${msg}`, { padding: { left: 1, right: 1 }, borderStyle: 'single', borderColor: code === 0 ? 'green' : 'red' })}`);
      resolve(code);
    });
    proc.on('error', err => {
      sp.stop();
      console.log(`  ${ts()} ${chalk.red('✖ ' + err.message)}`);
      resolve(-1);
    });
  });
}

async function exec(label, cmd) {
  header();
  console.log(`  ${chalk.bold.cyan('▶')} ${label}\n`);
  const code = cmd ? await runCmd(cmd) : 0;
  if (code === 0) {
    await input({ message: '按 Enter 键返回菜单', default: '' });
  }
  return code;
}

// ============ Commands ============
async function pubWeb() {
  await exec('发布 H5', cliCmd(`publish web --project ${config.project}`));
}

async function runWeb() {
  await exec('运行 Web', cliCmd(`launch web --project ${config.project} --browser Chrome`));
}

async function runWx() {
  await exec('运行微信', cliCmd(`launch mp-weixin --project ${config.project}`));
}

async function runAli() {
  await exec('运行支付宝', cliCmd(`launch mp-alipay --project ${config.project}`));
}

async function listProjects() {
  await exec('项目列表', cliCmd('project list'));
}

async function basicSettings() {
  header();
  console.log(`  ${chalk.bold.cyan('▶')} 基本设置\n`);

  config.hbxDir = await input({ message: 'HBuilderX 安装目录:', default: config.hbxDir || 'D:\\HBuilderX' });
  config.project = await input({ message: '项目名称:', default: config.project });

  saveConfig(config);
  config.appid = getManifestWxAppId() || config.appid;
  config.alipayAppid = getManifestAlipayAppId() || config.alipayAppid;
  const sp = ora({ text: '保存中...', color: 'green' }).start();
  await new Promise(r => setTimeout(r, 600));
  sp.succeed('已保存');
}

// ============ Main Loop ============
async function main() {
  while (true) {
    header();

    const action = await select({
      message: chalk.bold('选择操作:'),
      choices: [
        { name: '🌐 运行 Web', value: '3' },
        { name: '💬 运行微信', value: '4' },
        { name: '📎 运行支付宝', value: '5' },
        { name: '📦 发布 H5', value: '1' },
        { name: '📋 项目列表', value: '6' },
        { name: '⚙  基本设置', value: 's' },
        { name: '✕ 退出', value: '0' },
      ],
      loop: false,
      pageSize: 10,
    });

    switch (action) {
      case '1': await pubWeb(); break;
      case '3': await runWeb(); break;
      case '4': await runWx(); break;
      case '5': await runAli(); break;
      case '6': await listProjects(); break;
      case 's': await basicSettings(); break;
      case '0':
        console.clear();
        console.log(boxen(chalk.cyan('再见!'), { padding: 1, borderStyle: 'double', borderColor: 'cyan' }));
        process.exit(0);
    }
  }
}

main().catch(err => {
  console.error(chalk.red('错误:'), err.message);
  process.exit(1);
});
