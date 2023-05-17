import enquireJs from 'enquire.js'

/**
 * @method 判断字符串是否是存数字
 * @param val 要判断的字符串
 *
 * @return bool
 */
export function isRealNum(val) {
    if (val === "" || val == null) {
        return false;
    }

    if (!isNaN(val)) {
        return true;
    } else {
        return false;
    }
}

/**
 * @method 根据长度生成随机的字符串
 * @param len 要生成的长度
 *
 * @return string 随机的字符串
 */
export function randomString(len) {
    len = len || 32;
    var $chars =
        "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = "";
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

export function isDef(v) {
    return v !== undefined && v !== null
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}

export function isRegExp(v) {
    return _toString.call(v) === '[object RegExp]'
}

export function enquireScreen(call) {
    const handler = {
        match: function() {
            call && call(true)
        },
        unmatch: function() {
            call && call(false)
        }
    }
    enquireJs.register('only screen and (max-width: 767.99px)', handler)
}

const _toString = Object.prototype.toString