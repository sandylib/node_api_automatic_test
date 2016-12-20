var readline = require('readline');
var setting = require('./setting');
var Tabcorp = require('./src/tabcorp');
var tbEvent = require('./src/event')();

var tc = new Tabcorp(setting.testData); //pass the sample input list;
tc._winList = [2, 3, 1];               //Convenient test
var arr = [];

// add listen event
tbEvent.listen('win', function (data) {
    console.log(data);
});
tbEvent.listen('place', function (data) {
    console.log(data);
});
tbEvent.one('result', function (result) {
    console.log(result);
});

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
rl.prompt();
rl.on('line', function (line) {
    arr.push(line);
    rl.prompt();
});
setTimeout(function () {
    rl.pause();    
    tbEvent.trigger('result','Result:' + tc._winList.join(':'));
    tbEvent.trigger('win',tc.generateWin());
    tbEvent.trigger('place',tc.generatePlace().join('\n'));   
}, setting.timeout);