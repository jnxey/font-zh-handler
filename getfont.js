const Font = require('fonteditor-core').Font
const fs = require('fs')

const mode = 'Light' // Heavy, Regular, Light, Medium
const fsize = 300 // 700, 400, 300, 500

const source = fs.readFileSync(`./source/SourceHanSansCN-${mode}.ttf`)

fs.readdir('./ziti', function(err, files) {
    let cssFile = []
    files = files.sort((a, b) => {
        a = Number(a.slice(0, -14))
        b = Number(b.slice(0, -14))
        return a < b ? -1 : 1
    })
    for (let i=0; i<files.length; i++) {
        const name = files[i]
        const tffname = mode + name.replace('.txt', '.ttf')
        fs.readFile(`./ziti/${name}`, 'utf8' , (err, data) => {
            if (!err) {
                let asciis = []
                let strlist = data.split('')
                strlist.forEach((str) => {
                    asciis.push(getAssic(str))
                })
                const font = Font.create(source, {
                    type: 'ttf', // support ttf, woff, woff2, eot, otf, svg
                    subset: asciis, // only read `a`, `b` glyf
                    hinting: false, // save font hinting
                    compound2simple: true, // transform ttf compound glyf to simple
                    inflate: null, // inflate function for woff
                    combinePath: false, // for svg path
                });
                const buffer = font.write({
                    type: 'ttf', // support ttf, woff, woff2, eot, svg
                    hinting: true, // save font hinting
                    deflate: null, // deflate function for woff
                    support: {head: {}, hhea: {}} // for user to overwrite head.xMin, head.xMax, head.yMin, head.yMax, hhea etc.
                });
                fs.writeFileSync(`./font/${mode.toLowerCase()}/${tffname}`, buffer, { flag: 'a+' })

                let unicoderange = ''
                if(name.indexOf('spec') > -1) {
                    unicoderange = `unicode-range: U+30-39,U+2D,U+3D,U+FF01,U+21,U+40,U+23,U+FFE5,U+25,U+2026,U+26,U+2A,U+28-29,U+FF08-FF09,U+7E,U+3A,U+22,U+201C,U+201D,U+7B,U+7D,U+5B,U+5D,U+3010,U+3011,U+7C,U+3F,U+FF1F,U+2F,U+3C,U+3E,U+300A,U+300B,U+2C,U+FF0C,U+2E,U+3002,U+3001,U+FF1B,U+3B,U+27,U+2B,U+61,U+62,U+63,U+64,U+65,U+66,U+67,U+68,U+69,U+6A,U+6B,U+6C,U+6D,U+6E,U+6F,U+70,U+71,U+72,U+73,U+74,U+75,U+76,U+77,U+78,U+79,U+7A,U+41-4F,U+50-5A;`
                } else if(name.indexOf('max') > -1) {
                    unicoderange = ''
                } else {
                    unicoderange = 'unicode-range: ' + getUnicodeRange(data) + ';'
                }

                cssFile[i] = '@font-face {\n' +
                    `  font-family: \"SourceNRZH\";src: url(\"./${tffname}\") format(\"truetype\");font-weight: ${fsize};font-style: normal;font-display: block;${unicoderange}\n` +
                    '}\n'
                if(cssFile.filter((v) => v).length === files.length) {
                    saveCss(cssFile.join(''))
                }
            }
        })

    }
})

function saveCss(content) {
    if(content) {
        fs.writeFile(`./font/${mode.toLowerCase()}/font.css`, content, { encoding: 'utf8', flag: 'w+' }, err => {})
    } else {
        console.log('无css')
    }
}

function getUnicodeRange(str) {
    let result = []
    let count = 0
    while (count < str.length) {
        result.push('U+' + getUnicode(str[count]))
        count++
    }
    return result.join(',')
}

/**
 * @description: 获取Assic code
 */
function getAssic (charCode) {
    return charCode.charCodeAt(0)
}

/**
 * @description: 获取unicode
 */
function getUnicode (charCode) {
    return charCode.charCodeAt(0).toString(16).toUpperCase()
}



