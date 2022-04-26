const http = require('http')
const fs = require('fs')
const url = require('url')
const qs = require('qs')

let server = http.createServer(function (req, res) {
    let q = url.parse(req.url, true);
    // lay pathname url để xử lý theo request
    let pathUrl = q.pathname;
    // lấy method request
    let method = req.method;
    switch (pathUrl) {
        case '/':
            showListUser(req,res);
            break;
        case '/create':
            if (method === 'GET') {
                showTemplate('create', req, res);
            } else {
                createUser(req, res)
            }
           break;
    }

    function createUser(req, res) {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            // parse dữ liệu sử dụng mô-dun qs
            let dataJson = qs.parse(data);
            let arr;
            fs.readFile('./data/data.txt','utf8', function(err, str) {
                arr = str.split(",")
                arr.push(dataJson.name);
                let newData = arr.join(',');
                fs.writeFile('./data/data.txt', newData, err => {
                    if (err) {
                        console.error(err)
                        return;
                    }
                    res.writeHead(301, {
                        'Location': 'http://localhost:8080/'
                    });
                    return res.end()
                })
            });
        })
        req.on('error', () => {
            console.log('error')
        })
    }

    function showListUser(req, res) {
        let dataFile = [];
        let html = '';
        fs.readFile('./data/data.txt','utf8', function (err, str) {
            dataFile = str.split(",")
            dataFile.forEach((value, index) => {
                html += '<tr>';
                html += `<td>${index + 1}</td>`
                html += `<td>${value}</td>`
                html += `<td><button class="btn btn-danger">Delete</button></td>`
                html += '</tr>';
            });
            fs.readFile('./templates/index.html','utf8', function(err, data) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                data = data.replace('{list-user}', html)
                res.write(data)
                return res.end()
            });
        });
    }

    function showTemplate(templateName, req,res) {
        fs.readFile(`./templates/${templateName}.html`,'utf8', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data)
            return res.end()
        });
    }
});

server.listen('8080', function (){
    console.log('Serve running port 8080')
})
