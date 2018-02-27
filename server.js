'use strict';

const Hapi = require('hapi');
const path = require('path');

// please note this is a hapi with version v17!
const server = new Hapi.Server({ 
    port: 9000, 
    host: 'localhost' });

var name = 'Yihang'
var content = '这是你上你输入的内容……'

const route = {
        method: 'GET',
        path: '/',
        options: {
          handler: (request, h) => {
            //return h.response('您好！一航！').type('text/html').code(200);
            return h.response(`
            
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8" />
                    <title>剪贴板应用</title>
                </head>
                
                <body>   
                    <li><a target="_blank" href="http://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000">JavaScript教程</a></li>
                    <li><a target="_blank" href="http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000">Python教程</a></li>
                    <li><a target="_blank" href="https://github.com/SilhDing/hapijs-webapp">应用源码</a></li>   
                    <li><a target="_blank" href="https://github.com/hapijs/hapi/issues/3658">Hapi v17 文档参考</a></li>                 
                    <h1>Welcome, ${name}!</h1>
                    <textarea name="content" placeholder="请输入新内容" style="min-height: 250px;min-width: 350px;max-height: 250px; max-width: 350px;">${content}</textarea>
                    <p><button name="save">点击保存</button></p>
                </body>
                </html>
                `)
        },
        }
};    

server.route([
    route
]);

async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};
start();