const http = require('http');
const pack = {
    'en': {
        'title': 'english'
    },
    'zh-CN': {
        'title': 'chinese'
    }
};

const server = http.createServer((req, res) => {
    let lan = 'en';
    let language = req.headers['accept-language'];
    if (language) {
        lan = language.split(',').map((item) => {
            let values = item.split(';');
            return {
                'name': values[0],
                'q': values[1] ? parseInt(values[1]) : 1
            };
        });
        lan = lan.sort((lang1, lang2) => lang2.q - lang1.q);
        lan = lan.shift().name;
        console.log(lan);
    }
    res.end(pack[lan] ? pack[lan].title : pack['en'].title);
});

server.listen(4000);
console.log("server started, listen to 4000");
