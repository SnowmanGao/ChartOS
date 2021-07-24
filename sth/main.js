/* Function Info 
 * Author:      SnowmanGao 
 * CreateTime:  2021/7/23下午2:17:30 
 * LastEditor:  SnowmanGao 
 * ModifyTime:  2021/7/23下午2:17:30 
 * Description: 
 */

//当前数据集（缓存）
var Datas;
//#标题
var Title;
//当前选中学生的id
var StuID = 1;
//全局动画时钟
var AnimClock;
//设置
var Setting = {}
//图表
var ctx;
var myChart;


function reset() {
    localStorage.clear()
    Setting = {
        //距离算法
        distType: 'eu',
        //将距离映射为相似度
        useSimilarity: 1,
        //图表生成动画
        useAnim: 1,
        //图表生成动画刷新周期
        animInterval: 50,
        //图表缓冲动画
        useAnimMove: 1,
        //显示总分而非模长
        useSum: 0,
        //聚类区分度(次数)
        diffIndex: 3,
        //相似度归一化
        useNormal: 0,
    }
    saveSetting()
    loadSetting()
    let ele = document.getElementById('reset')
    ele.style = 'transform: rotateY(190deg);'
    setTimeout(() => {
        ele.style = 'transform: rotateY(0deg);'
    }, 200);

    changeID(1)
}



function init() {
    //初始化
    document.getElementsByTagName('canvas')[0].style = 'filter:blur(0px);'
    document.getElementsByClassName('optCtr')[0].style = 'filter: opacity(1);'
    document.getElementById('title').innerHTML += ` (${DATANAME})`
    showOpts(null, 1)

    //首次进入
    if (localStorage.length == 0) {
        reset()
    }

    //载入设置
    loadSetting()
    console.log('设置项：', Setting);

    //图表插件
    // Chart.register({

    // });

    //生成图表
    Datas = DATA.get('random');
    ctx = document.getElementById("myChart").getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({
                length: Datas.length
            }, (item, index) => index + 1),

            datasets: [{
                label: '随机',
                data: Datas,
                backgroundColor: [
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1
            },]
        },
    });

    applySetting(false)
}




function clearGraph() {
    //清空图表
    Datas = DATA.get('null')
    animation()
}


function showOpts(optID = -1, opacity = 0.4) {
    //清空二级菜单，opacity可顺便设置一级菜单透明度
    if (optID == null || optID == -1) {
        for (let i = 1; i <= 4; i++) {
            document.getElementById('opt2-' + i).style = 'display:none'
        }
        document.getElementById('opt1').style = `filter:opacity(${opacity});`
        return;
    }

    document.getElementById('opt1').style = `filter:opacity(${opacity});`

    for (let i = 1; i <= 4; i++) {
        if (document.getElementById('opt2-' + i).style[0] == 'display') {
            //跳过display:none并改选项卡的淡出
            continue;
        }
        document.getElementById('opt2-' + i).style = 'filter:opacity(0)'
        setTimeout(() => {
            // i 居然还存在
            document.getElementById('opt2-' + i).style = 'display:none'
        }, 200);
    }

    setTimeout(() => {
        document.getElementById('opt2-' + optID).style = 'filter:opacity(0)'
        setTimeout(() => {
            document.getElementById('opt2-' + optID).style = 'filter:opacity(1)'
        }, 100);
    }, 200);

}


function changeType(value) {
    //一级菜单
    showOpts(value)
    switch (value) {
        case 1:
            document.getElementById('title').innerHTML = '# 单科分布>'
            changeSubject('?')
            break;
        case 2:
            isMold = true
            document.getElementById('title').innerHTML = '# 模长分布'
            displayMold()
            break;
        case 3:
            document.getElementById('title').innerHTML = '# 聚类距离>'
            document.getElementsByName('stuID')[0].focus()
            changeID()
            break;
        case 4:
            document.getElementsByClassName("orange")[0].innerHTML = '调校'
            document.getElementById('title').innerHTML = '# 设置>'
            break;
        default:
            showOpts(null, 1)
            document.getElementById('opt1').style = 'filter:opacity(1);'
            break;
    }
}


function changeSubject(subName) {

    //二级菜单-切换科目
    let ele = document.getElementById("title")
    ele.innerText = ele.innerText.replace(/(?<=>)(.*)/, subName)

    Datas = DATA.get('@' + subName)

    myChart.data.datasets[0]['label'] = subName
    myChart.data.datasets[0].backgroundColor = ["rgba(153, 102, 255, 0.2)"]
    myChart.data.datasets[0].borderColor = ["rgba(153, 102, 255, 1)"]

    animation()

}

function displayMold() {

    //显示模长分布
    let isUseSum = document.getElementsByName('_useSum')[0].checked
    changeSettingKey('useSum', TFand01(isUseSum))

    if (isUseSum) {
        Datas = DATA.get('sum')
    } else {
        Datas = DATA.get('mold')
    }

    document.getElementById("title").innerHTML = '模长分布'
    myChart.data.datasets[0]['label'] = '模长'
    myChart.data.datasets[0].backgroundColor = ["rgba(54, 162, 235, 0.2)"]
    myChart.data.datasets[0].borderColor = ["rgba(54, 162, 235, 1)"]

    animation()

}

function changeID() {

    //更新切换学生ID
    StuID = parseInt(document.getElementsByName('stuID')[0].value)
    let name = DATABASE[StuID - 1]['姓名']
    let title = document.getElementById("title")
    let [a, maxID, max] = DATA.get('#' + StuID)
    Datas = a

    //修改导航表题和滑动条提示
    if (TFand01(Setting.useSimilarity)) {
        document.getElementById('title').innerHTML = '# 聚类相似度>'
    }
    title.innerText = title.innerText.replace(/(?<=>)(.*)/, name)
    document.getElementById('optID').innerHTML = `目标向量：[ID:${StuID}] ${name}`

    //设置图标样式
    myChart.data.datasets[0]['label'] = name + ' ~ X'
    myChart.data.datasets[0].backgroundColor = ["rgba(54, 162, 235, 0.2)"]
    myChart.data.datasets[0].borderColor = ["rgba(54, 162, 235, 1)"]

    //找到最大的

    document.getElementById('maxSimi').innerHTML = `
    MAX = ${DATA.id2name(maxID)} <li> ${max} </li>
    `

    //更新图表
    animation()

}


function changeDistType() {
    //切换距离算法
    let stuID = parseInt(document.getElementsByName('stuID')[0].value)
    let type = document.getElementById('distTypeC').value

    Setting.distType = type
    changeSettingKey('distType', type)

    Datas = DATA.get('#' + stuID)[0]
    changeID()
}


function animation() {
    //动画和刷新
    clearInterval(AnimClock)
    myChart.data.datasets[0].data = []
    i = 0
    if (TFand01(Setting.useAnim)) {
        AnimClock = setInterval(() => {
            if (i > Datas.length) {
                clearInterval(AnimClock)
            }
            myChart.data.datasets[0].data.push(Datas[i]);
            myChart.update()
            i++;
        }, Setting.animInterval)
    } else {
        myChart.data.datasets[0].data = Datas
    }

    myChart.update()
}