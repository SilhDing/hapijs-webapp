'use strict';

const Hapi = require('hapi');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('./config');
var name = 'Yihang';
var content_default = '这是你上次输入的内容……';

// please note this is a hapi with version v17!
// config server
const server = new Hapi.Server({ 
    port: 9000, 
    host: 'localhost' });

//config mysql
var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

var Content = sequelize.define('content', {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    content: Sequelize.STRING(5000)
}, {
        timestamps: false
    });
    
// html contents
var html_con = function (name, content_toShow) {
    var str_html = `
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>剪贴板应用</title>
        </head>
        
        <script type="text/javascript">
	
            var info_alert;
    
            var save = function () {
                info_alert = document.getElementById('content').value;
                alert('您已经保存新的内容：  \\n\\n\\"' + info_alert + '\\"' );
            }
        </script>
    
        <body>
 
            <li><a target="_blank" href="http://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000">JavaScript教程</a></li>
            <li><a target="_blank" href="http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000">Python教程</a></li>
            <li><a target="_blank" href="https://github.com/SilhDing/hapijs-webapp">应用源码</a></li>   
            <li><a target="_blank" href="https://github.com/hapijs/hapi/issues/3658">Hapi v17 文档参考</a></li>                 
            <h1>Welcome, ${name}!</h1>
            <form name="form1" method="post" action="http://localhost:9000/">
	            <p> <textarea type="text" name="textfield" id="content" placeholder="请输入新内容" style="min-height: 250px;min-width: 350px;max-height: 250px; max-width: 350px;">${content_toShow}</textarea></p>
                <p> <input type="submit" name="button1" value="保存" onclick="void save();"/></p>
            </form>
        </body>
        </html>
        `;
    return str_html;
}    
    
var mainPage = async function(request,h) {
    var contents = await Content.findAll({
        where: {
            id: '1'
        }
    });
    console.log(`find ${contents.length} contents:`);
    for (let p of contents) {
        console.log(JSON.stringify(p));
        var result = JSON.parse(JSON.stringify(p)).content;
        return html_con(name,result);
    }
};

var update_fun = async function (new_content) {
    var contents = await Content.findAll({
        where: {
            id: '1'
        }
    });
    for (let p of contents) {
        p.content = new_content;
        p.version ++;
        //console.log(',,,',p)
        await p.save();
        return html_con(name,new_content);
    }
}

// define route
const route = {
        method: 'GET',
        path: '/',
        options: {
          handler: (request, h) => {
            return mainPage();
        },
        }
};    

const routePost = {
    method: 'POST',
    path: '/',
    options: {
        handler: (request, h) => {
            //console.log(typeof(request.payload))
            //from_user = JSON.parse(request.payload)
            console.log(request.payload.textfield)
            return update_fun(request.payload.textfield);
        }
    }

}

server.route([
    route,
    routePost
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