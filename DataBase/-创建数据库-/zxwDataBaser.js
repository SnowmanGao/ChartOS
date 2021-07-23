var useIDrank = true

var subject = ['语文', '数学', '英语', '物理', '化学', '生物']
var IDrank = ["张俊怡", "马孟阳", "李博文", "刚好", "郭智卓", "许春阳", "寇凌霞", "杜博帆", "徐佳颖", "冷跃康", "郝绪", "苏雨晨", "宋家乐", "秦怡冉", "杨家玮", "高文轩", "王玺玥", "王圣琦", "张煜哲", "陈定可", "马可松", "陈梦雅", "周华阳", "鲍佳莉", "黄林", "徐慧琳", "易与同", "曹贤哲", "徐文博", "杨政武", "刘瑞月", "彭新宇", "曾博翰", "赵新宇", "贺柏睿", "冯致诚", "陈馨怡", "赵媛媛", "贾忆雯", "周嘉豪", "付佳鑫", "吴先科", "赵茜茜", "吴越", "朱奕旸", "吴俊伟", "李峪姗", "秦李扬", "田家圆", "周子颖", "李琪", "汪琳越", "吴明哲", "孙钰岚", "刘智博", "李雪婷", "赵祖宇", "汪庆怡", "王禹轩", "庄子弈", "柳晨晓", "唐欣悦", "孙梦奇", "肖梦圆", "柳德鑫", "齐志伟", "李东阳", "唐福临", "李君耀", "张喆翔", "张慈恩", "李星浩", "金晟旭", "梁宝壬"]


function exe() {
    let temp = {}
    let ans = new Array(74)

    temp = JSON.parse(document.getElementById('text').value).result.studentScoreDetailDTO

    if (useIDrank) {
        //按给定姓名顺序排序
        for (let idx in IDrank) {

            temp.forEach(i => {

                if (i.userName == IDrank[idx]) {
                    ans[idx] = {
                        '姓名': i.userName
                    }
                    for (let j in subject) {
                        ans[idx][subject[j]] = parseInt(i.scoreInfos[j].score)
                    }
                }
            });

        }
    } else {
        //按排名顺序排序
        for (let idx in temp) {
            ans[idx] = {
                '姓名': temp[idx].userName
            }
            for (let j in subject) {
                ans[idx][subject[j]] = parseInt(temp[idx].scoreInfos[j].score)
            }
        }
    }

    document.getElementById('text').value = JSON.stringify(ans)

}

function ranker() {
    useIDrank = !useIDrank
}