const fs =  require('fs')

/// 文字信息
let words = {
    fanti: '',
    usefull: '',
    usemax: '',
    wordsA: '',
    wordsB: '',
    wordsC: '',
    wordsD: '',
    wordsE: '',
    wordsF: '',
    wordsG: '',
    wordsH: '',
    wordsI: '',
}

Promise.all([
    readWord('./txt/繁体字.txt', 'fanti'),
    readWord('./txt/特殊字符.txt', 'spec'),
    readWord('./txt/经常使用.txt', 'usemax'),
    readWord('./txt/常用汉字.txt', 'usefull'),
    readWord('./txt/a-4E00-57C3.txt', 'wordsA'),
    readWord('./txt/b-57C4-6187.txt', 'wordsB'),
    readWord('./txt/c-6188-6B4B.txt', 'wordsC'),
    readWord('./txt/d-6B4C-750F.txt', 'wordsD'),
    readWord('./txt/e-7510-7ED3.txt', 'wordsE'),
    readWord('./txt/f-7ED4-8897.txt', 'wordsF'),
    readWord('./txt/g-8898-925B.txt', 'wordsG'),
    readWord('./txt/h-925C-9C1F.txt', 'wordsH'),
    readWord('./txt/i-9C20-9FA5.txt', 'wordsI'),
]).then(() => {
    let sortWords = ['']
    Object.keys(words).forEach((name) => {
        if(name.indexOf('words') > -1) {
            const ws = words[name]
            let count = 0
            while (count < ws.length) {
                const w = ws[count]
                if(!words.fanti.includes(w) && words.usefull.includes(w) && !words.usemax.includes(w)) {
                    const last = sortWords.length - 1
                    if(sortWords[last].length >= 100) {
                        sortWords.push(w)
                    } else {
                        sortWords[last] += w
                    }
                }
                count++;
            }
        }
        if(name.indexOf('spec') > -1) {
            fs.writeFile(`./ziti/${0}-spec.txt`, words['spec'], { flag: 'w+' }, err => {})
        }
        if(name.indexOf('usemax') > -1) {
            fs.writeFile(`./ziti/${0}-max.txt`, words['usemax'], { flag: 'w+' }, err => {})
        }
    })
    let prefix = 1
    sortWords.forEach((wl) => {
        const first = getUnicode(wl[0])
        const end = getUnicode(wl[wl.length - 1])
        fs.writeFile(`./ziti/${prefix}-${first}-${end}.txt`, wl, { flag: 'w+' }, err => {})
        prefix++
    })
})

/**
 * @description: 读取文字
 */
function readWord(path, name) {
    return new Promise((resolve) => {
        fs.readFile(path, 'utf8' , (err, data) => {
            if (!err) {
                words[name] = data
            }
            resolve('')
        })
    })
}

/**
 * @description: 获取unicode
 */
function getUnicode (charCode) {
    return charCode.charCodeAt(0).toString(16).toUpperCase()
}

// 文字去重
function duplication(str) {
    var newStr="";
    for(var i=0;i<str.length;i++){
        if(newStr.indexOf(str[i]) === -1){
            if(isChinese(str[i])) {
                newStr+=str[i];
            }
        }
    }
    return newStr;
}

function isChinese(temp){
    var re=/[^\u4E00-\u9FA5]/;
    return !re.test(temp);

}


