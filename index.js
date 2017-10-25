/**
 * @author giscafer<giscafer@outlook.com>
 * https://github.com/1ziton/ng1-cli
 */
'use strict'

/**
 * Module dependencies.
 */
const path = require('path');
const fs = require('fs');
const program = require('commander');
const pkg = require('./package.json');
let REPO_PATH = path.join(process.cwd(), './src/pages/');
const TEMP_PATH = path.join(__dirname, './templates/');

program
    .version(pkg.version)
    .option('-v, --version', 'output version number')
    .option('-g, --controller', 'create controller file ', controller)
    .on('--help', () => {
        console.log('  Examples:');
        console.log();
        console.log('    $ repo');
        console.log('    $ repo -n');
        console.log('    $ repo -c');
        console.log();
    });
program.parse(process.argv);
if (process.argv.slice(2)[0] === 'g') {
    controller()
}
// if (!process.argv.slice(2)[0]) {
//     common();
// }

function controller() {
    let arg = process.argv.slice(3)[0];
    if (!arg) {
        return console.log('请填写文件名称!');
    }
    let pathDir = path.join(REPO_PATH, arg + '/');
    mkdir(pathDir);
    createFile('temp.ctrl.js', arg);
    createFile('temp.html', arg);
    return;
}

function mkdir(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    } else {
        console.log('目录已经存在!' + path);
        process.exit(-1);
    }
}

// function deleteFolder(path) {
//     let files = [];
//     if (fs.existsSync(path)) {
//         files = fs.readdirSync(path);
//         files.forEach((file, index) => {
//             let curPath = path + "/" + file;
//             if (fs.statSync(curPath).isDirectory()) {
//                 deleteFolder(curPath);
//             } else {
//                 fs.unlinkSync(curPath);
//             }
//         });
//         fs.rmdirSync(path);
//     }
// };

function createFile(tempName, fileName) {
    let pathDir = path.join(REPO_PATH, fileName + '/');
    tempName = tempName.trim();
    let tempFilePath = path.join(TEMP_PATH, tempName);
    let repoFilePath = path.join(pathDir, tempName.replace('temp', fileName));
    let ctrlName = "";
    if (fileName && fileName.indexOf('-') !== -1) {
        let arr = fileName.split('-');
        let result = [];
        for (let a of arr) {
            if (a && a.trim()) {
                a = a.trim();
                a = a.substring(0, 1).toUpperCase() + a.substring(1);
                result.push(a);
            }
        }
        ctrlName = result.join("") + 'Ctrl';
    }
    fs.readFile(tempFilePath, (err, data) => {
        if (err) {
            console.error(err);
            process.exit(-1);
        }
        let contents = data.toString('utf-8');
        if (tempName === 'temp.ctrl.js') {
            contents=contents.replace('TemplateCtrl', ctrlName);
        }
        
        fs.writeFile(repoFilePath, contents, null, (err) => {
            if(err) {
                console.log(err);
                process.exit(-1);
            }
            console.log('create ' + repoFilePath + ' success!')
        });
    });

}
