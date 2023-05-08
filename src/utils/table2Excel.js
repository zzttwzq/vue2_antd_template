/* eslint-disable */
let idTmr;
const getExplorer = () => {
        let explorer = window.navigator.userAgent;
        //ie
        if (explorer.indexOf("MSIE") >= 0) {
            return 'ie';
        }
        //firefox
        else if (explorer.indexOf("Firefox") >= 0) {
            return 'Firefox';
        }
        //Chrome
        else if (explorer.indexOf("Chrome") >= 0) {
            return 'Chrome';
        }
        //Opera
        else if (explorer.indexOf("Opera") >= 0) {
            return 'Opera';
        }
        //Safari
        else if (explorer.indexOf("Safari") >= 0) {
            return 'Safari';
        }
    }
    // 判断浏览器是否为IE
const exportToExcel = (data, name) => {

    // 判断是否为IE
    if (getExplorer() == 'ie') {
        tableToIE(data, name)
    } else {
        tableToNotIE(data, name)
    }
}

const Cleanup = () => {
    window.clearInterval(idTmr);
}

// ie浏览器下执行
const tableToIE = (data, name) => {
    let curTbl = data;
    let oXL = new ActiveXObject("Excel.Application");

    //创建AX对象excel
    let oWB = oXL.Workbooks.Add();
    //获取workbook对象
    let xlsheet = oWB.Worksheets(1);
    //激活当前sheet
    let sel = document.body.createTextRange();
    sel.moveToElementText(curTbl);
    //把表格中的内容移到TextRange中
    sel.select;
    //全选TextRange中内容
    sel.execCommand("Copy");
    //复制TextRange中内容
    xlsheet.Paste();
    //粘贴到活动的EXCEL中

    oXL.Visible = true;
    //设置excel可见属性

    try {
        let fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
    } catch (e) {
        print("Nested catch caught " + e);
    } finally {
        oWB.SaveAs(fname);

        oWB.Close(savechanges = false);
        //xls.visible = false;
        oXL.Quit();
        oXL = null;
        // 结束excel进程，退出完成
        window.setInterval("Cleanup();", 1);
        idTmr = window.setInterval("Cleanup();", 1);
    }
}

// 非ie浏览器下执行
const tableToNotIE = (function() {
    // 编码要用utf-8不然默认gbk会出现中文乱码
    const uri = 'data:application/vnd.ms-excel;base64,',
        template = `<!doctype html public "-//w3c//dtd xhtml 1.0 transitional//en" "http://www.w3.org/tr/xhtml1/dtd/xhtml1-transitional.dtd">
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        
        <head>
            <meta http-equiv=Content-Type content="text/html; charset=utf-8">
            <meta name=ProgId content=Excel.Sheet>
            <meta name=Generator content="Aspose.Cell ">
            <link rel=File-List href="antc6-ewmkd_files/filelist.xml">
            <link rel=Edit-Time-Data href="antc6-ewmkd_files/editdata.mso">
            <link rel=OLE-Object-Data href="antc6-ewmkd_files/oledata.mso">
            <!--[if gte mso 9]><xml>
             <o:DocumentProperties>
              <o:Author>Administrator</o:Author>
              <o:Created>2021-08-25T08:19:00Z</o:Created>
              <o:LastSaved>2021-12-06T08:49:09Z</o:LastSaved>
            </o:DocumentProperties>
            </xml><![endif]-->
            <style>
                .x78 {
                    font-size: 10pt;
                }
            </style>
            <!--[if gte mso 9]><xml>
             <x:ExcelWorkbook>
              <x:ExcelWorksheets>
               <x:ExcelWorksheet>
                <x:Name>Sheet1</x:Name>
            <x:WorksheetOptions>
             <x:StandardWidth>2304</x:StandardWidth>
             <x:Print>
              <x:ValidPrinterInfo/>
              <x:PaperSizeIndex>1</x:PaperSizeIndex>
              <x:HorizontalResolution>600</x:HorizontalResolution>
              <x:VerticalResolution>600</x:VerticalResolution>
             </x:Print>
             <x:Zoom>152</x:Zoom>
             <x:Selected/>
            </x:WorksheetOptions>
               </x:ExcelWorksheet>
              </x:ExcelWorksheets>
              <x:WindowHeight>18920</x:WindowHeight>
              <x:WindowWidth>14940</x:WindowWidth>
              <x:WindowTopX>240</x:WindowTopX>
              <x:WindowTopY>120</x:WindowTopY>
              <x:RefModeR1C1/>
              <x:TabRatio>600</x:TabRatio>
              <x:ActiveSheet>0</x:ActiveSheet>
             </x:ExcelWorkbook>
            </xml><![endif]-->
        </head>

        {table}
        
        </html>`;

    const base64 = function(s) {
        return window.btoa(unescape(encodeURIComponent(s)));
    }

    const format = (s, c) => {
        return s.replace(/{(\w+)}/g,
            (m, p) => {
                return c[p];
            })
    }

    return (table, name) => {
        const ctx = {
            worksheet: name,
            table
        }

        const url = uri + base64(format(template, ctx));

        // console.log('table', url);

        if (navigator.userAgent.indexOf("Firefox") > -1) {
            window.location.href = url
        } else {
            const aLink = document.createElement('a');
            aLink.href = url;
            aLink.download = name || '';
            let event;
            if (window.MouseEvent) {
                event = new MouseEvent('click');
            } else {
                event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            }
            aLink.dispatchEvent(event);
        }
    }
})()

// 导出函数
const table2excel = (column, data, excelName) => {
    const typeMap = {
        image: getImageHtml,
        text: getTextHtml
    }

    let thead = column.reduce((result, item) => {
        result += `<td>${item.title}</td>`
        return result
    }, '')

    thead = `<tr height=18 style='mso-height-source:userset;height:14pt' align=center id='r2'>${thead}</tr>`

    let index = 3;
    let tbody = data.reduce((result, row) => {
        const temp = column.reduce((tds, col) => {
            tds += typeMap[col.type || 'text'](row[col.key], col)
            return tds
        }, '')

        result += `<tr height=18 style='mso-height-source:userset;height:14pt' align=center id='r${index}'>${temp}</tr>`;
        index++;

        return result
    }, '');

    let first = Math.ceil((column.length - 1) / 2);
    let second = column.length - 1 - first;

    const table = `<body link=blue vlink=purple>
        <table border=0 cellpadding=0 cellspacing=0 width=1303 style='border-collapse: 
     collapse;table-layout:fixed;width:977pt'>
            <tr height=21 style='mso-height-source:userset;height:16pt;' id='r0'>
                <td colspan=${first} rowspan=2 height=28 style='height:28.8pt;background: #89D62D' align=left valign=top>
                    <img width=128 height=32 src="http://wodan-idc.oss-cn-hangzhou.aliyuncs.com/wefree/crm/img/BCbA1639028974000.png" name='图片 4' alt=画板备份 12@3x 2>
                </td>
                <td colspan=1 rowspan=2 height=28 style='height:28.8pt;background: #89D62D' align=center valign=center>
                    <span style="color:white;font-size: 18pt;font-family: fantasy;font-weight: bold;">候选名单</span>
                </td>
                <td colspan=${second} rowspan=2 height=28 style='height:28.8pt;background: #89D62D' align=right valign=center>
                    <span style="color:white;font-size: 10pt;font-family: fantasy;font-weight: bold;">一站式数字化社交营销网络&nbsp;&nbsp;</span>
                </td>
            </tr>
            <tr height=21 style='mso-height-source:userset;height:16pt' id='r1'>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>

            ${thead}
    
            ${tbody}
        </table>
    </body>`

    // 导出表格
    exportToExcel(table, excelName)

    function getTextHtml(val) {
        return `<td style="text-align: center" class='x78'>${val}</td>`
    }

    function getImageHtml(val, options) {
        options = Object.assign({ width: 40, height: 60 }, options)
        return `<td style="width: ${options.width}px; height: ${options.height}px; text-align: center; vertical-align: middle;"><img src="${val}" width=${options.width} height=${options.height}></td>`
    }
}

export default table2excel