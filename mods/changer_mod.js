/* Function Info 
 * Author:      SnowmanGao 
 * CreateTime:  2021/7/24下午11:40:18 
 * LastEditor:  SnowmanGao 
 * ModifyTime:  2021/7/24下午11:40:18 
 * Description: 
*/ 


function changer_mod() {

    let html = `
    <hr>
    <li>
        语文<input class="cgr_mod" type="number" onchange="cgr_change(0)">
        数学<input class="cgr_mod" type="number" onchange="cgr_change(1)">
        英语<input class="cgr_mod" type="number" onchange="cgr_change(2)">
    </li>
    <li>
        物理<input class="cgr_mod" type="number" onchange="cgr_change(3)">
        化学<input class="cgr_mod" type="number" onchange="cgr_change(4)">
        生物<input class="cgr_mod" type="number" onchange="cgr_change(5)">
    </li> 
    `
    document.getElementById('opt2-3').innerHTML += html

    changeID = changeID.after(function () {
        let arr = document.getElementsByClassName('cgr_mod')
        for (let i = 0; i < 6; i++) {
            arr[i].value = DATABASE[StuID - 1][subjectMap(i)]
        }
    })

}

function cgr_change(id) {

    let value = parseInt(document.getElementsByClassName('cgr_mod')[id].value)
    //坑逼input[number]的value是字符串，要转换！
    DATABASE[StuID - 1][subjectMap(id)] = value
    changeID(StuID)

}

changer_mod()