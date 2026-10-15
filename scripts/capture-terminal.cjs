// Capture real shell execution through ttyd; no saved output is painted into images.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawn} = require('node:child_process');
const {chromium} = require('playwright');

async function capture(steps, options = {}) {
  const cwd = options.cwd || process.cwd();
  const output = path.resolve(options.output || 'screenshots/terminal');
  fs.mkdirSync(output, {recursive:true});
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'session21-terminal-'));
  const status = path.join(temp, 'status');
  const rc = path.join(temp, 'bashrc');
  fs.writeFileSync(rc, `set -o pipefail\nPS1='\\h:\\W \\$ '\nHISTFILE='${temp}/history'\nPROMPT_COMMAND='printf "%s\\n" "$?" > "${status}"; history -a'\n`);
  const port = options.port || 7682;
  const server = spawn(process.env.TTYD_PATH || 'ttyd', ['-i','127.0.0.1','-p',String(port),'-W','-O','-t','fontSize=14','-t','scrollback=30000','-t','theme={"background":"#222631","foreground":"#e4e5e9"}', '/bin/bash','--noprofile','--rcfile',rc,'-i'], {cwd, env:{...process.env,BASH_SILENCE_DEPRECATION_WARNING:'1'},stdio:'ignore'});
  server.on('error', error=>{console.error(error);});
  let browser, context;
  const records=[];
  try {
    for(let i=0;i<100;i++){try{const r=await fetch(`http://127.0.0.1:${port}`);if(r.ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
    browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome'});
    context=await browser.newContext({viewport:{width:1400,height:900},recordVideo:{dir:temp,size:{width:1400,height:900}}});
    const page=await context.newPage();
    await page.goto(`http://127.0.0.1:${port}`);
    await page.waitForFunction(()=>window.term?.buffer?.active && /\$\s*$/.test(window.term.buffer.active.getLine(window.term.buffer.active.baseY+window.term.buffer.active.cursorY)?.translateToString()||''));
    async function execute(command, timeout){
      const before=fs.existsSync(status)?fs.statSync(status).mtimeMs:0;
      await page.locator('textarea.xterm-helper-textarea').focus();
      await page.keyboard.insertText(command);
      await page.keyboard.press('Enter');
      const deadline=Date.now()+(timeout||180000);
      while(Date.now()<deadline){
        if(fs.existsSync(status)&&fs.statSync(status).mtimeMs>before){const value=fs.readFileSync(status,'utf8');if(/^\d+\n$/.test(value)){await page.waitForTimeout(300);return Number(value.trim());}}
        await new Promise(r=>setTimeout(r,150));
      }
      throw Error('Command timed out: '+command);
    }
    for(const step of steps){
      await execute('clear');
      const started=new Date().toISOString();
      const code=await execute(step.command,step.timeout);
      const text=await page.evaluate(()=>{const b=window.term.buffer.active;return Array.from({length:b.length},(_,i)=>b.getLine(i)?.translateToString(true)||'').join('\n');});
      fs.writeFileSync(path.join(output,step.name+'.txt'),text+'\n');
      if(step.log)fs.writeFileSync(path.resolve(step.log),text+'\n');
      await page.screenshot({path:path.join(output,step.name+'.png')});
      records.push({name:step.name,command:step.command,started,finished:new Date().toISOString(),exitCode:code,expected:step.expected||0});
      fs.writeFileSync(path.join(output,(options.name||'session')+'-commands.json'),JSON.stringify(records,null,2)+'\n');
      console.log(step.name+': exit '+code);
      if(code!==(step.expected||0))throw Error('Unexpected exit status for '+step.name+': '+code);
      await page.waitForTimeout(step.pause||1800);
    }
    const video=page.video();
    await context.close();context=null;
    await video.saveAs(path.join(output,(options.name||'session')+'.webm'));
    return records;
  } finally {
    if(context)await context.close();
    if(browser)await browser.close();
    server.kill('SIGTERM');
  }
}
module.exports={capture};
if(require.main===module){const config=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const mode=process.argv[3];capture(mode?config[mode]:config.steps,mode?{name:mode}:config.options).catch(error=>{console.error(error);process.exit(1)});}
