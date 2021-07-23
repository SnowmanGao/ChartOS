function changeSetting(obj, type = 'bool') {
    //改变某项设置并储存

    let key = obj.name

    //储存设置到本地
    switch (type) {
        case 'bool':
            changeSettingKey(key,TFand01(obj.checked))
            break;

        case 'number':
            changeSettingKey(key,obj.value)
            break;

        default:
            alert('ERR:未知设置类型的元素\n' + type)
            break;
    }

    
}

function changeSettingKey(key,value) {

    if (key[0] == '_') {
        //HTML里的name前面加上'_'的为设置
        key = key.slice(1)
    }

    Setting[key] = value
    localStorage.setItem(key, value)

    //每次改变都储存又载入！
    loadSetting()
    if(key != 'useSum'){
        //排除useSum导致不必要的更新
        applySetting()
    }
}


function saveSetting() {
    //储存全部设置到本地
    for (i in Setting) {
        localStorage.setItem(i, Setting[i])
    }

}


function loadSetting() {
    //读取设置到本地

    for (var i = 0; i < localStorage.length; i++) {
        //获取本地存储的Key
        var key = localStorage.key(i);
        //不能用for...in...因为prototype也会被遍历到！

        //遍历每一个设置项
        Setting[key] = localStorage.getItem(key)

        //遍历每一个处理某项设置的元素
        document.getElementsByName('_' + key).forEach((item) => {
            switch (item.type) {
                case 'checkbox':
                    item.checked = TFand01(Setting[key])
                    break;
                case 'number':
                    item.value = Setting[key]
                    break;
                case 'select-one':
                    item.value = Setting[key]
                    break;
                default:
                    console.warn('ERR:未知设置类型的元素', item.type);
                    break;
            }
        })
    }

}

function applySetting(showTest = true) {

    if (TFand01(Setting.useAnimMove)) {
        myChart.options.animation.duration = undefined
        myChart.options.hover.animationDuration = undefined
        myChart.options.responsiveAnimationDuration = undefined
    } else {
        myChart.options.animation.duration = 0
        myChart.options.hover.animationDuration = 0
        myChart.options.responsiveAnimationDuration = 0
    }

    //showTest显示示例聚类
    if (showTest) {
        changeID(StuID)
    }

    animation()
}


function ajaxGet(url) {
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            //获取服务器响应
            document.querySelector("#show").innerHTML = xhr.responseText;
        }
    };
    //发送异步请求
    xhr.open("GET", url, true);
    //发送请求
    xhr.send();
}