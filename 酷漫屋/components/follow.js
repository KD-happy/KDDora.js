module.exports = {
    type: 'list',
    async fetch() {
        var follows = $storage('follows');
        if (follows == null) {
            $storage.put('follows', []);
        } else {
            follows.map(m => {

            })
        }
    }
}
// {
//     iamge: 'xxx',
//     title: 'xxx',
//     j: 'xxx'
// }