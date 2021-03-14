/* defination section */
const ipc = require("electron").ipcRenderer;
const {dialog} = require('electron').remote;

let card = null;
let canvas = null;
let language = "cn";
let nameColor = 0;
let crop = null;
/* 是否灵摆 */
let isPendulum = false;

let imageFilePath = '';
let imageSrcUrl = '';
// 图片原始大小
let imageOriginWidth = 0, imageOriginHeight = 0;
// 坐标
let cropX = 0, cropY = 0, cropW = 0, cropH = 0;

const originData = {
    lang: 'cn',
    langEx: 'cn2',
    name: '浮幽櫻',
    _id: '62015408',
    color: 'black',
    type: 'monster',
    type2: 'xg',
    type3: '',
    type4: '',
    attack: '0',
    defend: '1800',
    level: 3,
    desc: '這個卡名的效果1回合只能使用1次。①：對方場上的怪獸數量比自己場上的怪獸多的場合，把這張卡從手卡丟棄才能發動。選自己的額外卡組1張卡給雙方確認。那之後，把對方的額外卡組確認，有選的卡的同名卡的場合，那些對方的同名卡全部除外。這個效果在對方回合也能發動。',
    race: '不死族',
    raceIndex: 5,
    attribute: 'dark',
    copyright: 'ⓒスタジオ·ダイス /集英社·テレビ東京·KONAMI',
    cardbag: 'SD38-JP001',
    lb_num: '',
    lb_desc: '',
    link: [false, false, false, false, false, false, false, false],
    imageB64: '',
    flash: 0
};

let data = {...originData};

/* event section */

function onLanguageChange() {
    language = $('#selLanguage')[0].value;

    switch (language) {
        case "cn":
            data.lang = "cn";
            data.langEx = "cn";
            card.data.lang = "cn";
            card.changeConfig(configs.cnSimplify);
            break;
        case "cn2":
            data.lang = "cn";
            data.langEx = "cn2";
            card.data.lang = "cn";
            card.changeConfig(configs.cn);
            break;
        case "jp":
            data.lang = "jp";
            data.langEx = "jp";
            card.data.lang = "jp";
            card.changeConfig(configs.jp);
            break;
        case "jp2":
            data.lang = "jp";
            data.langEx = "jp2";
            card.data.lang = "jp";
            card.changeConfig(configs.jpNotation);
            break;
        case "en":
            data.lang = "en";
            data.langEx = "jp";
            card.data.lang = "en";
            card.changeConfig(configs.en);
            break;
    }

    renderRace();
}

function onInputCardName() {
    let name = $('#txtCardName')[0].value;
    if (language === 'cn2') {
        name = Card.complex(name);
    }
    data.name = name;
    card.data.name = name;
}

function onInputCardPassword() {
    const id = $('#txtCardPassword')[0].value;
    data._id = id;
    card.data._id = id;
}

function onInputCardBag() {
    const bag = $('#txtCardBag')[0].value;
    data.cardbag = bag;
    card.data.cardbag = bag;
}

function onInputCardCopyright() {
    const cr = $('#txtCardCopyright')[0].value;
    data.copyright = cr;
    card.data.copyright = cr;
}

let monsterType = 'xg';
let monsterType3 = '';

function onCardTypeClicked(idx) {
    if (data.type === 'monster') {
        monsterType = data.type2;
        monsterType3 = data.type3;
    }
    for (let i = 0; i < 3; i++) {
        $('#btnType' + i).attr('class', i === idx ? 'btn btn-primary' : 'btn btn-dark');
    }
    $('#divMonster')[0].style.display = 'none';
    $('#divSpell')[0].style.display = 'none';
    $('#divTrap')[0].style.display = 'none';
    switch (idx) {
        case 0:
            data.type = 'monster';
            card.data.type = 'monster';
            $('#divMonster')[0].style.display = '';
            data.type2 = monsterType;
            data.type3 = monsterType3;
            break;
        case 1:
            data.type = 'spell';
            card.data.type = 'spell';
            data.type3 = '';
            card.data.type3 = '';
            $('#divSpell')[0].style.display = '';
            onMagicTypeClicked(0);
            break;
        case 2:
            data.type = 'trap';
            card.data.type = 'trap';
            data.type3 = '';
            card.data.type3 = '';
            $('#divTrap')[0].style.display = '';
            onTrapTypeClicked(0);
            break;
    }
}

function onMagicTypeClicked(idx) {
    for (let i = 0; i < 6; i++) {
        $('#btnSpell' + i).attr('class', i === idx ? 'btn btn-primary' : 'btn btn-dark');
    }
    switch (idx) {
        case 0:
            data.type2 = 'tc';
            card.data.type2 = 'tc';
            break;
        case 1:
            data.type2 = 'yx';
            card.data.type2 = 'yx';
            break;
        case 2:
            data.type2 = 'zb';
            card.data.type2 = 'zb';
            break;
        case 3:
            data.type2 = 'sg';
            card.data.type2 = 'sg';
            break;
        case 4:
            data.type2 = 'cd';
            card.data.type2 = 'cd';
            break;
        case 5:
            data.type2 = 'ys';
            card.data.type2 = 'ys';
            break;
    }
}

function onTrapTypeClicked(idx) {
    for (let i = 0; i < 3; i++) {
        $('#btnTrap' + i).attr('class', i === idx ? 'btn btn-primary' : 'btn btn-dark');
    }
    switch (idx) {
        case 0:
            data.type2 = 'tc';
            card.data.type2 = 'tc';
            break;
        case 1:
            data.type2 = 'yx';
            card.data.type2 = 'yx';
            break;
        case 2:
            data.type2 = 'fj';
            card.data.type2 = 'fj';
            break;
    }
}

function onNameColorClicked(idx) {
    nameColor = idx;
    for (let i = 0; i < 5; i++) {
        $('#btnColor' + i).attr('class', i === idx ? 'btn btn-primary' : 'btn btn-dark');
    }
    switch (nameColor) {
        case 0:
            data.color = 'black';
            card.data.color = 'black';
            break;
        case 1:
            data.color = 'white';
            card.data.color = 'white';
            break;
        case 2:
            data.color = 'gold';
            card.data.color = 'gold';
            break;
        case 3:
            data.color = 'red';
            card.data.color = 'red';
            break;
        case 4:
            const c = $('#txtNameColor').val();
            data.color = c;
            card.data.color = c;
            break;
    }
}

function onMonsterType2Changed() {
    const t2 = $('#selMonsterType2')[0].value;
    if (t2 === 'lj' || t2 === 'tk') {
        if (card.data.type3 === 'lb') {
            isPendulum = false;
            data.type3 = '';
            card.data.type3 = '';
            $('#selMonsterType3').val('');
            $('#selMonsterType3').selectpicker('refresh');
            $('#divPendulum')[0].style.display = 'none';
            $('#divPendulumEffect')[0].style.display = 'none';
        }
    }
    data.type2 = t2;
    card.data.type2 = t2;
    if (t2 === 'lj') {
        $('#divLink')[0].style.display = '';
    } else {
        $('#divLink')[0].style.display = 'none';
    }
}

function onMonsterType3Changed() {
    const t3 = $('#selMonsterType3')[0].value;
    if (t3 === 'lb') {
        const t2 = card.data.type2;
        if (t2 === 'lj' || t2 === 'tk') {
            $('#selMonsterType3').val('');
            $('#selMonsterType3').selectpicker('refresh');
            $('#divPendulum')[0].style.display = 'none';
            $('#divPendulumEffect')[0].style.display = 'none';
            return;
        }
        isPendulum = true;
        $('#divPendulum')[0].style.display = '';
        $('#divPendulumEffect')[0].style.display = '';
    } else {
        isPendulum = false;
        $('#divPendulum')[0].style.display = 'none';
        $('#divPendulumEffect')[0].style.display = 'none';
    }
    data.type3 = t3;
    card.data.type3 = t3;
}

function onMonsterType4Changed() {
    const t4 = $('#selMonsterType4')[0].value;
    data.type4 = t4;
    card.data.type4 = t4;
}

function onMonsterAttributeClicked(idx) {
    for (let i = 0; i < 7; i++) {
        $('#btnAttr' + i).attr('class', idx === i ? 'btn btn-primary' : 'btn btn-dark');
    }
    switch (idx) {
        case 0:
            data.attribute = 'light';
            card.data.attribute = 'light';
            break;
        case 1:
            data.attribute = 'dark';
            card.data.attribute = 'dark';
            break;
        case 2:
            data.attribute = 'wind';
            card.data.attribute = 'wind';
            break;
        case 3:
            data.attribute = 'water';
            card.data.attribute = 'water';
            break;
        case 4:
            data.attribute = 'fire';
            card.data.attribute = 'fire';
            break;
        case 5:
            data.attribute = 'earth';
            card.data.attribute = 'earth';
            break;
        case 6:
            data.attribute = 'divine';
            card.data.attribute = 'divine';
            break;
    }
}

function onMonsterLevelClicked(idx) {
    for (let i = 0; i < 13; i++) {
        $('#btnLv' + i).attr('class', idx === i ? 'btn btn-primary' : 'btn btn-dark');
    }
    data.level = idx;
    card.data.level = idx;
}

function onInputCardAtk() {
    const atk = $('#txtCardAtk')[0].value;
    data.attack = atk;
    card.data.attack = atk;
}

function onInputCardDef() {
    const def = $('#txtCardDef')[0].value;
    data.defend = def;
    card.data.defend = def;
}

function onInputEffect() {
    let eff = $('#txtEffect').val();
    if (language === 'cn2') {
        off = Card.complex(off);
    }
    data.desc = eff;
    card.data.desc = eff;
}

function onInputCardPScale() {
    const scale = $('#txtCardPScale')[0].value;
    data.lb_num = scale;
    card.data.lb_num = scale;
}

function onInputPEffect() {
    let peff = $('#txtPEffect').val();
    if (language === 'cn2') {
        peff = Card.complex(peff);
    }
    data.lb_desc = peff;
    card.data.lb_desc = peff;
}

function onLinkArrowClicked(idx) {
    let arr = card.data.link;
    const btn = $('#btnLink' + idx);
    arr[idx] = !arr[idx];
    btn.attr('class', arr[idx] ? 'btn btn-primary prop-link-btn' : 'btn btn-dark prop-link-btn');
    data.link = arr;
    card.data.link = arr;
}

function renderRace() {
    let rStr = card.config.translate.raceList[data.raceIndex];
    const rAdd = $('#txtCardRace').val().trim();
    if (rAdd !== '') {
        rStr = rAdd;
    }
    data.race = rStr;
}

function onMonsterRaceChanged() {
    const rIdx = parseInt($('#selMonsterRace')[0].value);
    let rStr = card.config.translate.raceList[rIdx];
    const rAdd = $('#txtCardRace').val().trim();
    if (rAdd !== '') {
        rStr = rAdd;
    }
    data.race = rStr;
    data.raceIndex = rIdx;
    card.data.race = rStr;
    card.data.raceIndex = rIdx;
}

function onInputCardRace() {
    onMonsterRaceChanged();
}

function onRandomCodeGen() {
    const code = ("0000000" + 100000000 * Math.random()).match(/(\d{8})(\.|$)/)[1];
    $('#txtCardPassword').val(code);
    onInputCardPassword();
}

/* popup image section */

function popSelImg() {
    $("#popSelectImageRoot")[0].style.display = "block";
    $("#popSelectImage")[0].style.display = "block";
}

function closeSelImg() {
    if (crop != null) {
        crop.destroy();
        crop = null;
    }
    $("#popSelectImageRoot")[0].style.display = "none";
    $("#popSelectImage")[0].style.display = "none";
}

function cropImageAndReturn() {
    if (crop != null) {
        crop.destroy();
        crop = null;
    }

    if (imageFilePath === '') {
        closeSelImg();
        return;
    }
    const uiHeight = imageOriginHeight * 500 / imageOriginWidth;
    const realX = imageOriginWidth * cropX / 500;
    const realY = imageOriginHeight * cropY / uiHeight;
    const realWidth = imageOriginWidth * cropW / 500;
    const realHeight = imageOriginHeight * cropH / uiHeight;
    ipc.send('cropCard', {source: imageFilePath, x: realX, y: realY, width: realWidth, height: realHeight});
    closeSelImg();
}

function selectCardImage() {
    popSelImg();
}

function doSelectImageFile() {
    if (crop != null) {
        crop.destroy();
        crop = null;
    }
    $('#fileImage').click();
}

function onLoadCardImage() {
    const img = $('#imgCard')[0];
    if (card && img) {
        card.feed(img);
    }
}

function cleanImage() {
    const img = $('#imgCard')[0];
    img.src = './card/mold/flash.jpg';
}

function updateImageFile() {
    const f = $("#fileImage")[0].files[0];
    imageFilePath = f.path;
    imageSrcUrl = window.URL.createObjectURL(f);
    const img = new Image();
    img.src = imageSrcUrl;
    $("#fileImage").val('');

    img.onload = () => {
        let imgH = img.height;
        let imgW = img.width;
        if (imgH > imgW) {

            imageFilePath = '';
            alert('请选择高度不大于宽度的图片。');
            return;
        }

        imageOriginWidth = imgW;
        imageOriginHeight = imgH;

        $('#imgSelCard').attr('src', imageSrcUrl);
        const realH = imgH * 500 / imgW;
        $('#popSelectImage')[0].style.height = (realH + 130) + 'px';
        if (crop == null) {
            crop = Jcrop.attach('imgSelCard');
            const rect = Jcrop.Rect.create(0, 0, 200, isPendulum ? 149 : 200);
            cropX = 0;
            cropY = 0;
            cropW = 200;
            cropH = isPendulum ? 149 : 200;
            const options = {aspectRatio: rect.aspect};
            crop.newWidget(rect, options);
            crop.listen('crop.update', (widget, e) => {
                let pos = widget.pos;
                cropX = pos.x;
                cropY = pos.y;
                cropW = pos.w;
                cropH = pos.h;
            })
        }
    };
}

function getImageType(str) {
    const reg = /\.(png|jpg|gif|jpeg|webp)$/;
    return str.match(reg)[1];
}

/* 卡片操作 */
function newCard() {
    data = {...originData};
    loadCardInfo();
}

function nameColorToIndex(n) {
    switch (n) {
        case "black":
            return 0;
        case "white":
            return 1;
        case "gold":
            return 2;
        case "red":
            return 3;
        default:
            return 4;
    }
}

function cardTypeToIndex(t) {
    switch (t) {
        case "monster":
            return 0;
        case "spell":
            return 1;
        case "trap":
            return 2;
    }
}

function monsterAttributeToIndex(a) {
    switch (a) {
        case "light":
            return 0;
        case "dark":
            return 1;
        case "wind":
            return 2;
        case "water":
            return 3;
        case "fire":
            return 4;
        case "earth":
            return 5;
        case "divine":
            return 6;
    }
}

/* 这个变量用于对卡图进行一次性渲染，防止死循环 */
let loadCardInfoCompleted = false;

function loadCardInfo() {
    loadCardInfoCompleted = false;
    canvas = $("#card")[0];
    card = new Card({
        data, canvas, size: [1626, 2370], moldPath: './card/mold', cardbagSwitch: true, passwordSwitch: true, loaded: () => {
            // 渲染完成后才可以渲染卡图
            if (!loadCardInfoCompleted) {
                if (data.imageB64 !== '') {
                    loadCardInfoCompleted = true;
                    const img = $('#imgCard')[0];
                    img.src = data.imageB64;
                }
            }
        }
    });
    card.render();

    // UI
    $('#selLanguage').val(data.langEx);
    $('#selLanguage').selectpicker('refresh');
    onLanguageChange();
    $('#txtCardName').val(data.name);
    const colorIdx = nameColorToIndex(data.color);
    $('#txtNameColor').val(colorIdx === 4 ? data.color : '');
    onNameColorClicked(colorIdx);
    $('#txtCardPassword').val(data._id);
    onCardTypeClicked(cardTypeToIndex(data.type));

    $('#selMonsterType2').val(data.type2);
    $('#selMonsterType2').selectpicker('refresh');
    onMonsterType2Changed();
    $('#selMonsterType3').val(data.type3);
    $('#selMonsterType3').selectpicker('refresh');
    onMonsterType3Changed();
    $('#selMonsterType4').val(data.type4);
    $('#selMonsterType4').selectpicker('refresh');

    onMonsterAttributeClicked(monsterAttributeToIndex(data.attribute));
    onMonsterLevelClicked(parseInt(data.level));

    $('#selMonsterRace').val(data.raceIndex);
    $('#selMonsterRace').selectpicker('refresh');
    const raceIdx = $('#selMonsterRace')[0].selectedIndex;
    $('#txtCardRace').val(raceIdx === -1 ? data.race : '');

    $('#txtCardAtk').val(data.attack);
    $('#txtCardDef').val(data.defend);
    $('#txtEffect').val(data.desc);

    $('#txtCardPScale').val(data.lb_num);
    $('#txtPEffect').val(data.lb_desc);
    for (let i = 0; i < 8; i++) {
        $('#btnLink' + i).attr('class', data.link[i] ? 'btn btn-primary prop-link-btn' : 'btn btn-dark prop-link-btn');
    }
    $('#txtCardBag').val(data.cardbag);
    $('#txtCardCopyright').val(data.copyright);
}

function openCard() {
    dialog.showOpenDialog({
        title: "选择要打开的卡片",
        buttonLabel: "打开",
        filters: [{name: '游戏王卡片', extensions: ['card']}]
    }).then((result) => {
        if (!result.canceled) {
            ipc.send('openCard', {filename: result.filePaths[0]});
        }
    });

}

ipc.on('openCard-reply', (event, args) => {
    data = {...args.data};
    loadCardInfo();
})

function saveCard() {
    dialog.showSaveDialog({
        title: "选择要保存的路径",
        buttonLabel: "保存",
        filters: [{name: '游戏王卡片', extensions: ['card']}]
    }).then((result) => {
        if (!result.canceled) {
            ipc.send('saveCard', {filename: result.filePath, data: data});
        }
    });
}

function exportCardImage() {
    card.save();
}

function showAbout() {
    $('#popAboutRoot')[0].style.display = "block";
    $('#popAbout')[0].style.display = "block";
}

function closeAbout() {
    $("#popAboutRoot")[0].style.display = "none";
    $("#popAbout")[0].style.display = "none";
}

function openLink(link) {
    ipc.send('openURL', {url: link});
}

/* ipc section */

ipc.on('cropCard-reply', (event, args) => {
    const filename = args.filename;
    const buffer = args.imgData;
    const img = $('#imgCard')[0];
    const imgB64 = 'data: image/' + getImageType(filename) + ';base64,' + buffer;
    img.src = imgB64;
    data.imageB64 = imgB64;
});

/* 全局禁用按键 */
$(document).on("keydown", function (event) {
    const key = event.keyCode;
    if (key === 116) {
        //禁用 F5 刷新
        return false;
    } else if ((event.ctrlKey || event.metaKey) && key === 82) {
        //禁用 ctrl/cmd + R刷新
        return false;
    }
});