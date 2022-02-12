const axios = require("axios");
const cheerio = require("cheerio");

if (typeof $dora == 'undefined') {
  console.error('This project runs only in Dora.js.')
  console.error('Please visit https://dorajs.com/ for more information.')
  process.exit(-1)
}

console.info('Congratulation, your addon runs successfully!')

module.exports = {
  all_url: 'http://www.kmwu6.com',
  get_info: async (url) => {
    var res = await axios.get(url);
    var $ = cheerio.load(res.data);
    return {
      id: /\/(\d+)/g.exec(url)[1],
      title: $('.info > h1').text(),
      img: $('.cover img').eq(0).attr('src'),
      url: 'http://www.kmwu6.com' + $('.bottom .btn-2').eq(0).attr('href')
    }
  },
  set_url: async (url) => {
    var follows = $storage.get('follows');
    var id = /m\/(\d+)\//.exec(url)[1];
    var new_follows = follows.map(m => {
      if (id == m.id) {
        return {
          id: m.id,
          title: m.title,
          img: m.img,
          url: url
        }
      } else {
        return m;
      }
    })
    $storage.put('follows', new_follows);
  }
}