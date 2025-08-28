'use strict';
const http = require('node:http');
const pug = require('pug');
//req リクエスト　res レスポンス
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info(
      `[${now}] Requested by ${req.socket.remoteAddress}`
    );
    
    res.writeHead(200, {
      'content-type': 'text/html; charset=utf-8'
    });

    let firstItem = '焼肉';
    let secondItem = '湯豆腐';
    switch(req.method) {
      case'GET':
        if(req.url === '/'){
          res.write('<!DOCTYPE html><html lang="ja"><body>' +
            '<h1>アンケートフォーム</h1>' +
            '<a href="/enquetes">アンケート一覧</a>' +
            '</body></html>');
        } else if (req.url === '/enquetes') {
          res.write('<!DOCTYPE html><html lang="ja"><body>' +
            '<h1>アンケート一覧</h1><ul>' +
            '<li><a href="/enquetes/yaki-tofu">焼き肉・湯豆腐</a></li>' +
            '<li><a href="/enquetes/rice-bread">ごはん・パン</a></li>' +
            '<li><a href="/enquetes/sushi-pizza">寿司・ピザ</a></li>' +
            '</ul></body></html>');
        } else {
          if(req.url === '/enquetes/yaki-tofu'){
            firstItem = '焼肉';
            secondItem = '湯豆腐';
          } else if(req.url === '/enquetes/rice-bread'){
            firstItem = 'ごはん';
            secondItem = 'パン';
          } else if(req.url === '/enquetes/sushi-pizza'){
            firstItem = '寿司';
            secondItem = 'ピザ';
          }

          res.write(pug.renderFile('./form.pug', {
            path: req.url,
            firstItem,
            secondItem
          }));
        } 
        
        res.end();
        break;
      case'POST':
        let rowData = '';
        req
          .on('data', chunk=> { //req.on data データを受け取ったら　chunkに小刻みにして
            rowData += chunk
          })
          .on('end', () => {  //すべて受け取り終わったら
            const decoded = decodeURIComponent(rowData);//日本語に変更
            console.info(`[${now}] 投稿: ${decoded}`);
            const answer = new URLSearchParams(rowData);
            res.write(`<h1>${answer.get('name')}さんは${answer.get('favorite')}に投稿されました</h1>`);
            res.end();
          })
        break;
        case 'DELETE':
          res.write(`DELETE ${req.url}\n`);
          res.end();
          break;
        default:
          break;
    }
  })
  .on('error', e => {
    console.error(`[${new Date()}] Server Error`, e);
  })
  .on('clientError', e => {
    console.error(`[${new Date()}] Client Error`, e);
  })
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Listening on ${port}`);
})