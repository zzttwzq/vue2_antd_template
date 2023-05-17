import { isRealNum } from '@/utils/util'

import { message } from "ant-design-vue";
import { request } from '@/utils/request'
console.log('res', request);

import XLSX from "xlsx";
import table2excel from '@/utils/table2Excel'


//########### 导入表格
//文件流转BinaryString
function fixdata(data) {
    var o = "",
        l = 0,
        w = 10240;
    for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(
            null,
            new Uint8Array(data.slice(l * w, l * w + w))
        );
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
}

function formatDate(numb, format) {
    const time = new Date((numb - 1) * 24 * 3600000 + 1)
    time.setYear(time.getFullYear() - 70)
    const year = time.getFullYear() + ''
    const month = time.getMonth() + 1 + ''
    const date = time.getDate() - 1 + ''
    if (format && format.length === 1) {
        return year + format + month + format + date
    }
    return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
}

function readXlsxFile(file, output) {
    var wb; //读取完成的数据
    var rABS = false; //是否将文件读取为二进制字符串

    var f = file;
    var reader = new FileReader();
    reader.onload = function (e) {
        var data = e.target.result;
        if (rABS) {
            wb = XLSX.read(btoa(fixdata(data)), {
                //手动转化
                type: "base64",
            });
        } else {
            wb = XLSX.read(data, {
                type: "binary",
                codepage: 936
            });
        }
        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        //wb.Sheets[Sheet名]获取第一个Sheet的数据

        if (wb.SheetNames.length == 0) {
            message.error("excel表各种没有工作表！");
            return;
        }

        console.log('>>> wb.SheetNames', wb.SheetNames);

        if (wb.SheetNames.indexOf("Sheet1") == -1) {
            message.error("请将要导入数据的表命名为 Sheet1");
            return;
        }

        let name = "Sheet1";
        let data1 = wb.Sheets[name];
        console.log(wb);
        console.log(data1);

        let rowInfo = data1["!ref"];
        rowInfo = rowInfo.split(":");

        let charectors = [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
        ];

        let c1 = "";
        let c2 = "";
        let length = 0;
        let cList = [];
        charectors.map((it) => {
            if (rowInfo[0].indexOf(it) > -1) {
                c1 = it;
            }

            if (c1 != "" && c2 == "") {
                cList.push(it);
            }

            if (rowInfo[1].indexOf(it) > -1) {
                c2 = it;
            }
        });
        length = Number(rowInfo[1].split(c2)[1]);

        // console.log(c1);
        // console.log(c2);
        // console.log(cList);
        // console.log(length);

        output(cList, length, data1);
    };
    if (rABS) {
        reader.readAsArrayBuffer(f);
    } else {
        reader.readAsBinaryString(f);
    }
}

/**
 * @method 导入外部文件
 * @param file 导入的文件
 * @param stage 1导入报名阶段  2导入甲方确认名单阶段
 * @param eventId 项目id
 * @param announceId 通告id  非必填
 *
 * @return list options需要的数组
 */
export function importXLSX(
    file,
    success
) {
    readXlsxFile(file, async (cList, length, data) => {

        await postData(cList, length, data);

        success();
    });
}

async function postData(cList, length, data) {

    let start = 1;
    let ext = {};
    let list = [];
    let titleArr = [];

    let titleMap = {
        '交易创建时间': 'trade_time',
        '交易号': 'trad_no',
        '类型': 'trad_type',
        '交易类型': 'type',
        '商家订单号': 'business_order_no',
        '付款时间': 'pay_time',
        '交易来源地': 'source',
        '交易对方': 'source_name',
        '商品名称': 'product_name',
        '金额（元）': 'price',
        '收/支': 'way',
        '交易状态': 'status',
        '服务费（元）': 'tips',
        '退款（元）': 'refund',
        '成功退款（元）': 'success_refund',
        '备注': 'remark',
        '资金状态': 'price_status',
        '最近修改时间': 'last_modify_time',

    }

    for (let index = start; index < length; index++) {
        let item = {};
        let i = 0;
        cList.map((it) => {
            let k = it + "" + (index + 1);
            let d = data[k];

            // console.log('>>> k', k);
            // console.log('>>> d', d);

            if (d) {
                if (d.w) {
                    d = d.w;
                } else {
                    d = d.v;
                }

                /// 账号信息
                if (index == 1) {
                    ext.account = d.split('账号:[')[1];
                    ext.account = ext.account.split(']')[0];
                }
                else if (index == 2) {

                    ext.startTime = d.split('起始日期:[')[1].split(']    终止日期:[')[0];
                    ext.endTime = d.split('起始日期:[')[1].split(']    终止日期:[')[1].split(']')[0];
                }
                /// 分割线
                else if (index == 3) {
                    console.log('key1===', d);
                }
                /// 标题
                else if (index == 4) {
                    d = d.replace(/\s*/g, "");
                    var string = `key${i}=== '${d}'`;
                    console.log(string);
                    titleArr.push(d);
                }
                else {
                    if (typeof (d) == 'string') {
                        d = d.replace(/\s*/g, "");
                    }

                    d = d + '';

                    if (titleArr.length > 0) {
                        if (index <= 2740) {
                            if (
                                titleMap[titleArr[i]] == 'price' ||
                                titleMap[titleArr[i]] == 'refund' ||
                                titleMap[titleArr[i]] == 'tips') {
                                d = Number(d);
                            }

                            if (titleMap[titleArr[i]] == 'pay_time' ||
                                titleMap[titleArr[i]] == 'trade_time' ||
                                titleMap[titleArr[i]] == 'last_modify_time') {
                                let d = formatDate(d, '/')
                                console.log('>>> d', d) // 2016-9-5
                            }

                            item[titleArr[i]] = d;
                            item[titleMap[titleArr[i]]] = d;
                            item.index = index;
                        }
                    }
                }
            }
            i++;
        });

        console.log('>>> item', item);
        console.log('>>>>>>>>>>>>>>>>>>>>>>');

        if (item != {}) {
            list.push(item);
        }
        item = {};

        ext.list = list;
    }

    for (let index = 0; index < ext.list.length; index++) {
        const element = ext.list[index];
        console.log(element);
        let data = await request('/blog/finance_data_add', "POST", element);
        console.log('data', data);
    }

    return ext;
}


function exportWithHeader(tableData, settlementMap, cardMap, keyList, finalExportColumns, fileName) {

    let columns = [];
    //总计数据
    let sumData = {
        "kolId": "价格总计",
    };

    for (let key in finalExportColumns) {
        columns.push({
            title: finalExportColumns[key],
            key: key,
            type: 'text'
        })

        sumData[key] = "";
    }
    let first = true;

    tableData.map((it) => {

        it.applyStatus = settlementMap[Number(it.applyStatus)];
        it.cardType = cardMap[Number(it.cardType)];
        it.sourceName = '';

        if (it.gatherDtoList) {
            it.gatherDtoList.map(it3 => {
                if (keyList.indexOf(it3.fieldName) > -1) {

                    if (first) {
                        columns.push({
                            title: it3.fieldName,
                            key: it3.fieldName,
                            type: 'text'
                        })
                    }

                    /// 放入单个数据内容 0文本 1 数字 2 单选 3 多选 4 单图 5 多图
                    let value = "";
                    if (it3.wordFormat == 0) {
                        value = it3.fieldValue;
                    } else if (it3.wordFormat == 1) {
                        if (it3.fieldType) {
                            value += "达人报价：" + Number(it3.fieldValue);
                        } else {
                            value += Number(it3.fieldValue);
                        }
                        if (it3.businessPrice) {
                            value += "\r\n商务报价：" + Number(it3.fieldValue) + " +" + it3.premium + " " + it3.profitRate + "%";
                        }
                    } else if (it3.wordFormat == 2 || it3.wordFormat == 3) {
                        if (typeof (it3.fieldValue) == 'string') {
                            it3.fieldValue = it3.fieldValue.split(',');
                        }

                        let options = [];
                        if (it3.setOption) {
                            options = JSON.parse(it3.setOption);
                        }

                        it3.fieldValue.map(it5 => {
                            let d = Number(it5);
                            options.map(it6 => {
                                if (it6.value == d) {
                                    value += it6.label + ',';
                                }
                            });
                        });
                        value = value.substr(0, value.length - 1);
                    } else if (it3.wordFormat == 4 || it3.wordFormat == 5) {
                        value = it3.fieldValue;
                    }

                    it[it3.fieldName] = value;

                    /// 总计数据
                    if (!sumData[it3.fieldName]) {
                        sumData[it3.fieldName] = {
                            fieldValue: 0,
                            businessPrice: 0,
                            premium: 0,
                            wordFormat: it3.wordFormat,
                            profitRate: 0,
                            fieldType: it3.fieldType,
                        };
                    }

                    if (isRealNum(it3.fieldValue)) {
                        // 0文本 1 数字 2 单选 3 多选 4 单图 5 多图
                        if (it3.wordFormat == 0) {
                            sumData[it3.fieldName].fieldValue = it3.fieldValue;
                        } else if (it3.wordFormat == 1) {
                            sumData[it3.fieldName].fieldValue = Number(sumData[it3.fieldName].fieldValue) + Number(it3.fieldValue);
                        } else if (it3.wordFormat == 2 || it3.wordFormat == 3) {
                            if (typeof (it3.fieldValue) == 'string') {
                                sumData[it3.fieldName].fieldValue = it3.fieldValue.split(',');
                            } else {
                                sumData[it3.fieldName].fieldValue = it3.fieldValue;
                            }
                            let options = [];
                            if (it3.setOption) {
                                options = JSON.parse(it3.setOption);
                            }

                            let string = '';
                            sumData[it3.fieldName].fieldValue.map(it5 => {
                                let d = Number(it5);
                                options.map(it6 => {
                                    if (it6.value == d) {
                                        string += it6.label;
                                    }
                                });
                            });
                            string = string.substr(0, string.length - 1);
                            sumData[it3.fieldName].fieldValue = string;
                        } else if (it3.wordFormat == 4 || it3.wordFormat == 5) {
                            sumData[it3.fieldName].fieldValue = it3.fieldValue;
                        }
                    }
                    if (isRealNum(it3.businessPrice)) {
                        sumData[it3.fieldName].businessPrice += Number(it3.businessPrice);
                    }
                    if (isRealNum(it3.premium)) {
                        sumData[it3.fieldName].premium += Number(it3.premium);
                    }
                    if (isRealNum(it3.profitRate)) {
                        sumData[it3.fieldName].profitRate = Number(it3.profitRate);
                    }
                }
            });
        }

        first = false;
    });

    console.log('tableData', tableData);
    console.log('columns', columns);
    // tableData.unshift(sumData);

    table2excel(columns, tableData, fileName);
}

/**
 * @method 获取列表数据
 * @param url 列表链接
 * @param urlName 文件名
 * @param eventId 项目ID
 * @param source 来源 0 全部 1 内部 2外部
 *
 * @return list 列表数据
 */
async function getTableData(page, urlName, eventId, source) {
    let params = {
        pageNum: page,
        pageSize: 100,
        eventId: Number(eventId),
    };

    if (source > -1) {
        params.source = source;
    }

    let data = [];
    let d1 = [];

    if (urlName == "post_namelist_prae_page") {
        params.pageType = 1;
        // d1 = await post_namelist_prae_page(params);
    } else if (urlName == "post_namelist_business_page") {
        params.pageType = 2;
        // d1 = await post_namelist_business_page(params);
    } else if (urlName == "post_namelist_talent_page") {
        params.pageType = 3;
        // d1 = await post_namelist_talent_page(params);
    } else if (urlName == "post_namelist_admin_page") {
        params.pageType = 4;
        // d1 = await post_namelist_admin_page(params);
    }

    d1 = d1.data;
    if (d1) {
        data = data.concat(d1);
    }

    // console.log('page: ' + page);
    // console.log('d1: ' + JSON.stringify(d1));
    // console.log('data: ' + data);

    if (d1 && d1.length > 0) {
        page++;

        // console.log('page: ' + page);

        let d2 = await getTableData(page, urlName, eventId, source);
        if (d2) {
            data = data.concat(d2);
        }
    }

    return data;
}

/**
 * @method 导出数据成xlsx文件
 * @param urlName 文件名
 * @param eventId 项目ID
 * @param source 来源 0 全部 1 内部 2外部
 * @param exportColumns object {'applyTime':'报名时间', ...}
 *
 */
export async function exportXLSX(urlName, eventId, source, exportColumns) {

    let sourceMap = {
        0: "全部",
        1: "外部",
        2: "内部",
    };

    let roleMap = {
        post_namelist_prae_page: "PR/AE",
        post_namelist_business_page: "商务",
        post_namelist_admin_page: "超级管理员",
    };

    // 0其他，1小红书，2抖音， 3淘宝逛逛
    let cardMap = {
        0: "其他",
        1: "小红书",
        2: "抖音",
        3: "淘宝逛逛",
    };

    let columns = [];
    if (urlName == "post_namelist_prae_page") {
        columns = {
            kolId: "达人ID",
            kolNickname: "达人昵称",
            applyTime: "报名时间",
            sourceName: "来源",
            cardType: "卡片类型",
            cardUrl: "主页",
            kolCardId: "名片ID",
            kolCardNickname: "名片昵称",
            wechat: "微信号",
            telephone: "电话号码",
            cardFansNum: "粉丝数",
            cardLikeNum: "获赞数",
            applyStatus: "状态",
        };
    } else if (urlName == "post_namelist_business_page") {
        columns = {
            kolId: "达人ID",
            kolNickname: "达人昵称",
            applyTime: "报名时间",
            sourceName: "来源",
            cardType: "卡片类型",
            cardUrl: "主页",
            kolCardId: "名片ID",
            kolCardNickname: "名片昵称",
            wechat: "微信号",
            telephone: "电话号码",
            cardFansNum: "粉丝数",
            cardLikeNum: "获赞数",
            applyStatus: "状态",
        };
    } else if (urlName == "post_namelist_admin_page") {
        columns = {
            kolId: "达人ID",
            kolNickname: "达人昵称",
            applyTime: "报名时间",
            sourceName: "来源",
            cardType: "卡片类型",
            cardUrl: "主页",
            kolCardId: "名片ID",
            kolCardNickname: "名片昵称",
            wechat: "微信号",
            telephone: "电话号码",
            cardFansNum: "粉丝数",
            cardLikeNum: "获赞数",
            price: "执行价格",
            executeType: "执行方式",
            applyStatus: "状态",
        };
    } else if (urlName == "post_namelist_talent_page") {
        columns = {
            kolId: "达人ID",
            kolNickname: "达人昵称",
            applyTime: "报名时间",
            sourceName: "来源",
            cardType: "卡片类型",
            cardUrl: "主页",
            kolCardId: "名片ID",
            kolCardNickname: "名片昵称",
            wechat: "微信号",
            telephone: "电话号码",
            cardFansNum: "粉丝数",
            cardLikeNum: "获赞数",
            price: "执行价格",
            executeType: "执行方式",
            applyStatus: "状态",
        };
    }

    let finalExportColumns = {};

    // 获取最终需要生成的表格字段
    let keyList = [];
    for (let key in exportColumns) {
        keyList.push(key);
    }
    for (let key in columns) {
        if (keyList.indexOf(key) > -1) {
            finalExportColumns[key] = columns[key];
        }
    }

    // console.log('>>>>>>columns', columns);
    // console.log('>>>>>>exportColumns', exportColumns);
    // console.log('>>>>>>finalExportColumns', finalExportColumns);

    let fileName = `${roleMap[urlName]}_${sourceMap[source]}`;
    // console.log(fileName);
    let tableData = await getTableData(1, urlName, eventId, source);
    if (tableData.length == 0) {
        message.error("没有要导出的数据！");
        return;
    }

    // console.log('>>>>>>1', tableData);
    // exportOld(tableData, settlementMap, cardMap, keyList, finalExportColumns, fileName);

    exportWithHeader(tableData, cardMap, keyList, finalExportColumns, fileName)
}