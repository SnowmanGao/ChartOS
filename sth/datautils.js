DATALENGTH = DATABASE.length

class DATA {
    constructor() {

    }

    static id2name(id) {
        if (id > DATALENGTH + 1 || id < 1) {
            //id溢出
            return `[ID:${id}] None`
        }
        return `[ID:${id}] ${DATABASE[id - 1].姓名}`
    }

    static get(selector) {
        switch (selector[0]) {
            case '@':
                //单科分布(list)
                let sub = selector.slice(1)
                return DATABASE.map(item => (item[sub]));

            case '#':
                //聚类距离(list)
                //$stuID
                let id = selector.slice(1) - 1
                let vec6s = getVec6s()
                let data_ = Array(DATALENGTH)

                for (let i = 0; i < data_.length; i++) {
                    data_[i] = vec6dist(vec6s[id], vec6s[i])
                }

                /**
                 * 核心算法：
                 * 将距离映射为相似度
                 */
                let diff = Setting.diffIndex
                let max = -1,
                    maxIndex = -1
                const min = 0 //min为常量

                if (TFand01(Setting.useSimilarity) && Setting.distType != 'co') {

                    for (i = 0; i < 74; i++) {
                        // 30是为了尽量防止数据溢出而挑出来的参数
                        data_[i] = (30 / data_[i]) ** diff

                        if (max < data_[i]) {
                            if (data_[i] == Infinity) {
                                //让除以零（自己和自己的相似度）得到的infinity归零
                                data_[i] = 0
                                //切勿忘记continue，否则max会被更新为0可能会错过最大值
                                continue;
                            }
                            //更新max
                            max = data_[i]
                            maxIndex = i
                        }
                    }

                } else {
                    //仅求求最大值
                    data_ = data_.map((x) => (x ** diff))
                    data_[id] = 0

                    max = Math.max(...data_)
                    maxIndex = data_.indexOf(max)
                }

                if (TFand01(Setting.useNormal)) {
                    //归一化
                    data_ = data_.map((x) => (
                        x / (max - min)
                    ))
                }

                return [data_, maxIndex + 1, max];


            default:
                switch (selector) {
                    case 'vec6':
                        //聚类向量(list)
                        return getVec6s();

                    case 'null':
                        //空数据(list)
                        return Array(DATALENGTH).fill(0)

                    case 'mold':
                        //模长分布(list)
                        return getVec6s().map(item => (Math.hypot(...item)))

                    case 'sum':
                        //总分分布(list)
                        return getVec6s().map(item => (listSum(item)))

                    case 'random':
                        //随机数据(list)
                        return Array(DATALENGTH).fill(0).map((i) => (Math.random()))

                    default:
                        alert('ERR:选择器错误\n' + selector)
                        break;
                }
                break;
        }
    }


}



function TFand01(value) {
    //坑逼！localStorage的true变成了字符串'true'必须转换

    switch (value) {
        case true:
            return 1;
        case false:
            return 0;
        case '1':
            return true;
        case '0':
            return false;
        default:
            console.error('ERR:TFto01\n' + value)
            break;
    }
}


function listSum(list) {
    //累加数组中的元素
    let s = 0;
    for (var i = 0; i < list.length; i++) {
        s += list[i];
    }
    return s;
}


function getVec6s() {
    //从数据库中生成6维向量数组
    return DATABASE.map(i => (
        [i['语文'], i['数学'], i['英语'], i['物理'], i["化学"], i["生物"]]
    ))
}


function vec6dist(v1, v2) {
    //6维向量的距离算法
    let dis = -1,
        temp = -1;

    switch (Setting.distType) {
        case 'eu':
            let tempv = [0, 0, 0, 0, 0, 0]
            dis = 0

            for (let i = 0; i < 6; i++) {
                tempv[i] = v1[i] - v2[i]
            }
            for (let i = 0; i < 6; i++) {
                dis += tempv[i] * tempv[i]
            }
            return Math.sqrt(dis)

        case 'co':
            let tempDo = 0,
                tempUp = 0;
            dis = 0;
            for (let i = 0; i < 6; i++) {
                tempUp += v1[i] * v2[i]
            }
            tempDo = Math.hypot(...v1) * Math.hypot(...v2)
            dis = tempUp / tempDo
            return dis > 1 ? 1 : dis

        case 'ma':
            dis = 0

            for (let i = 0; i < 6; i++) {
                dis += Math.abs(v1[i] - v2[i])
            }
            return dis

        case 'ch':
            // let idx = -1
            temp = -1
            dis = -1;

            for (let i = 0; i < 6; i++) {
                temp = Math.abs(v1[i] - v2[i])
                if (dis < temp) {
                    dis = temp
                    // idx = i
                }
            }
            // console.log(idx);
            return dis

        case 'wx':
            return Math.hypot(...v2) - Math.hypot(...v1)

        default:
            return 0;
    }

}