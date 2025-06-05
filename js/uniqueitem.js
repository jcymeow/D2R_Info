/**
 * @author jcy
 * @mail 20970736@qq.com
 * @date 2025-5-22
 */

let UNIQUEITEMS = [];

function loaded() {
    loadLNG();

    //Enter to query
    document.getElementById('uniqueitemInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            filter();
        }
    });

    //Reset & query
    document.getElementById('resetBtn').addEventListener('click', function () {
        document.getElementById('uniqueitemInput').value = '';

        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.checked = false;
        });

        //filter();
    });

    //change to query
    document.getElementById('searchForm').querySelectorAll('input[name="type"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if(["rin", "amu", "cm"].includes(radio.value)){
                document.querySelectorAll('input[name="tier"]').forEach(tier => {tier.checked = false;});
            }
            filter();
        });
    });

    //change to query
    document.getElementById('searchForm').querySelectorAll('input[name="tier"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            filter();
        });
    });

    //language & init & query
    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', function () {
            const selectedLang = this.getAttribute('data-lang');
            if (selectedLang !== LNG) {
                saveLNG(selectedLang);

                document.querySelectorAll('.lang-btn').forEach(button => {
                    button.classList.toggle('active', button.getAttribute('data-lang') === LNG);
                });

                init();
                filter();
            }
        });
        button.classList.toggle('active', button.getAttribute('data-lang') === LNG);
    });

    init();
    //filter();
}

function init() {

    common();

    /** 暗金物品 */
    UNIQUEITEMS = clone(EXCEL_UNIQUEITEMS);
    UNIQUEITEMS = UNIQUEITEMS.filter(item => { return !UNIQUEITEMS_TO_DELETE.includes(item.index) && item.enabled !== 0});
    for (let uniqueitem of UNIQUEITEMS) {
        // 名称(显示/查询)
        const local = LOCAL_MAP[uniqueitem.index];
        uniqueitem.VIEWNAME = [local.enUS.toUpperCase(), local.zhCN, local.zhTW].join(" ");

        // 装备层级(Normal//Elite)
        const misc = MISC_MAP[uniqueitem.code];
        uniqueitem.TIER = null;
        if (misc.code === misc.normcode) uniqueitem.TIER = 0;
        if (misc.code === misc.ubercode) uniqueitem.TIER = 1;
        if (misc.code === misc.ultracode) uniqueitem.TIER = 2;
        // 装备类型(MISC/WEAPON/ARMOR)
        uniqueitem.CATEGORY = misc.CATEGORY;

        uniqueitem.CODES = [];
        for (let index = 1; index <= CONSTANTS.UNIQUEITEMS_PROPS_LENGTH; index++) {
            const CODE = {
                "CODE": uniqueitem[`prop${index}`],
                "PARAM": uniqueitem[`par${index}`],
                "MIN": uniqueitem[`min${index}`],
                "MAX": uniqueitem[`max${index}`]
            }
            if (CODE.CODE) uniqueitem.CODES.push(CODE);
        }

        uniqueitem.ITEMSTATCOSTS = [];
        for (const code of uniqueitem.CODES) {
            let property = PROPERTY_MAP[code.CODE];
            if (!property) continue;
            property = clone(property)
            for (const stat of property.STATS) {
                const itemstatcost = clone(ITEMSTATCOST_MAP[stat.STAT]);
                if (!itemstatcost) continue;
                itemstatcost.STAT = clone(stat);
                itemstatcost.CODE = clone(code);
                uniqueitem.ITEMSTATCOSTS.push(itemstatcost);
            }
        }

        let itemstatcosts = uniqueitem.ITEMSTATCOSTS.map(itemstatcost => itemstatcost.STAT.STAT)

        // STAT_GROUP => 全属性/全抗
        for (const item of STAT_GROUP) {
            const io = clone(item);
            const includesAll = io.in.every(input => itemstatcosts.includes(input));
            if (includesAll) {
                const subItemStatCost = uniqueitem.ITEMSTATCOSTS.filter(itemstatcost => io.in.includes(itemstatcost.Stat));
                const equals = subItemStatCost.every(itemstatcost => itemstatcost.CODE.MIN === subItemStatCost[0].CODE.MIN);
                if (equals) {
                    const first = subItemStatCost[0];
                    io.out.CODE = first.CODE;
                    io.out.STAT = first.STAT;
                    io.out.descpriority = first.descpriority;
                    uniqueitem.ITEMSTATCOSTS.removeAll(subItemStatCost);
                    uniqueitem.ITEMSTATCOSTS.push(io.out);
                }
            }
        }

        // RANGE_GROUP => 大小伤
        for (const item of RANGE_GROUP) {
            const io = clone(item);
            const includesAll = io.in.every(input => itemstatcosts.includes(input));
            if (includesAll) {
                let minObj = uniqueitem.ITEMSTATCOSTS.filter(itemstatcost => itemstatcost.Stat === io.in[0])[0];
                let maxObj = uniqueitem.ITEMSTATCOSTS.filter(itemstatcost => itemstatcost.Stat === io.in[1])[0];
                let lenObj = uniqueitem.ITEMSTATCOSTS.filter(itemstatcost => itemstatcost.Stat === io.in[2])[0];

                let newItemStatCost = io.out;
                newItemStatCost.MIN = minObj;
                newItemStatCost.MAX = maxObj;
                newItemStatCost.CODE = minObj.CODE;
                newItemStatCost.STAT = minObj.STAT;
                if (lenObj) newItemStatCost.LEN = lenObj;
                newItemStatCost.descpriority = minObj.descpriority;

                //物理伤害:小伤>=大伤,则不合并
                if (0xF008 === newItemStatCost[`*ID`] && minObj.CODE.MAX >= maxObj.CODE.MIN) continue;

                const subItemStatCost = uniqueitem.ITEMSTATCOSTS.filter(itemstatcost => io.in.includes(itemstatcost.Stat));
                uniqueitem.ITEMSTATCOSTS.removeAll(subItemStatCost);
                uniqueitem.ITEMSTATCOSTS.push(newItemStatCost);
            }
        }
        //属性词条排序
        uniqueitem.ITEMSTATCOSTS.sort((a, b) => {
            //1.itemstatcost.js descpriority DESC
            if (b.descpriority != a.descpriority) {
                return b.descpriority - a.descpriority;
            }
            //2.itemstatcost.js *ID DESC
            if (b[`*ID`] != a[`*ID`]) {
                return b[`*ID`] - a[`*ID`];
            }
            //3.skills.js *Id DESC
            if (SKILL_MAP[b.CODE.PARAM] && SKILL_MAP[a.CODE.PARAM]) {
                if (SKILL_MAP[b.CODE.PARAM][`*Id`] != SKILL_MAP[a.CODE.PARAM][`*Id`]) {
                    return SKILL_MAP[b.CODE.PARAM][`*Id`] - SKILL_MAP[a.CODE.PARAM][`*Id`]
                }
            }
            return -1;
        });

    }
    // 需求等级 ASC
    UNIQUEITEMS.sort((a, b) => a[`lvl req`] - b[`lvl req`]);
}

// 过滤符合条件的符文之语
function filter() {

    let sel = [];

    const formData = {
        keyword: document.getElementById('searchForm').querySelector('input[type="text"]').value,
        type: document.getElementById('searchForm').querySelector('input[name="type"]:checked')?.value || '',
        tier: document.getElementById('searchForm').querySelector('input[name="tier"]:checked')?.value || ''
    };

    for (const uniqueitem of UNIQUEITEMS) {
        
        if (formData.keyword !== '') {
            var value = formData.keyword.toUpperCase();
            if (!uniqueitem.VIEWNAME.includes(value)) {
                continue;
            }
        }
        
        if (formData.type !== '') {
            const codes = CODES[formData.type];
            if(!codes.includes(uniqueitem.code)) continue;
        }
        
        if (formData.tier !== ''){
            if(uniqueitem.TIER != formData.tier) continue;
        }
        
        sel.push(uniqueitem);
    }

    result(sel);
}

function result(array) {

    const result = document.getElementById('result');
    //clear
    result.innerHTML = '';

    //count
    const countDiv = document.createElement('div');
    countDiv.className = 'styled-box';
    countDiv.append([LOGIC.COUNT_PREFIX[LNG], array.length, LOGIC.COUNT_SUFFIX[LNG]].join(" "));
    result.appendChild(countDiv);

    //list
    for (const uniqueitem of array) {
        const id = uniqueitem[`*ID`];
        // container
        const container = document.createElement('div');
        container.className = 'styled-box';

        // container name 
        const nameDiv = document.createElement('div');
        nameDiv.className = 'name-box';
        nameDiv.append(id+". ");
        nameDiv.append(uniqueitem.VIEWNAME);

        // container image
        const imageDiv = document.createElement('div');
        imageDiv.className = 'image-box';
        imageDiv.innerHTML = `<img src="image/uniqueitem/${id}.jpg" onerror="this.src='image/NONE.png'" />`;

        // contianer x
        const xDiv = document.createElement('div');
        xDiv.className = 'x-box';

        //是否包含需求变化
        let ease = 1;
        const easeArray = uniqueitem.ITEMSTATCOSTS.filter(itemstatcost => itemstatcost.Stat === `item_req_percent`);
        if(easeArray && easeArray.length > 0){
            ease = ease + easeArray[0].CODE.MIN/100;
        }
        //是否无形
        let eth = 0;
        const ethArray = uniqueitem.ITEMSTATCOSTS.filter(itemstatcost => itemstatcost.Stat === `item_ethereal`);
        if(ethArray && ethArray.length > 0){
            eth = -10;
        }

        //底材属性
        switch (uniqueitem.CATEGORY) {
            case "MISC": {
                let contents = [];

                contents.push(LOCAL_MAP[uniqueitem.code][LNG]);
                contents.push(LOGIC.REQLVL[LNG] + uniqueitem[`lvl req`]);

                const div = document.createElement(`div`);
                div.className = `base-box`;
                div.innerHTML = contents.join(`<BR>`);
                xDiv.appendChild(div);
                break;
            }
            case "ARMOR": {
                let base = MISC_MAP[uniqueitem.code];
                const bases = [MISC_MAP[base.normcode], MISC_MAP[base.ubercode], MISC_MAP[base.ultracode]];

                for (let index = uniqueitem.TIER; index < 3; index++) {
                    let contents = [];

                    base = bases[index];
                    contents.push(LOCAL_MAP[base.code][LNG] + ` ` + ITEM_TIERS[index][LNG]);

                    //需求等级
                    let reqLvl = 0;
                    if (uniqueitem.TIER === index) {
                        // 原装需求等级
                        reqLvl = uniqueitem[`lvl req`];
                    } else {
                        // 升级需求等级 = max(原装需求等级 || 底材需求等级+修正)
                        reqLvl = Math.max(uniqueitem[`lvl req`], (base.levelreq || 0) + ITEM_TIERS[uniqueitem.TIER].offset[index]);
                    }
                    contents.push(LOGIC.REQLVL[LNG] + (reqLvl || `-`));
                    //需求力量:Math.floor(((基础需求+无形) < 0 ? 0 : (基础需求+无形)) * (1+(需求变化/100)))
                    let reqstr = Math.floor((((base.reqstr) || 0) + eth) < 0 ? 0 : (((base.reqstr) || 0) + eth) * ease)
                    contents.push(LOGIC.REQSTR[LNG] + (reqstr || "-"));
                    //耐久
                    contents.push(LOGIC.DURABILITY[LNG] + base.durability);

                    console.log(uniqueitem);
                    //盾牌:重击伤害
                    if(CODES.shie.includes(base.code) || CODES.ashd.includes(base.code)){
                        contents.push(LOGIC.SMITEDAM[LNG] + `${base.mindam}-${base.maxdam}`);
                    }
                    //鞋子:踢击伤害
                    if(CODES.boot.includes(base.code)){
                        contents.push(LOGIC.KICKDAM[LNG] + `${base.mindam}-${base.maxdam}`);
                    }

                    const div = document.createElement(`div`);
                    div.className = `base-box`;
                    div.innerHTML = contents.join(`<BR>`);
                    xDiv.appendChild(div);
                }
                break;
            }
            case "WEAPON": {
                let base = MISC_MAP[uniqueitem.code];
                const bases = [MISC_MAP[base.normcode], MISC_MAP[base.ubercode], MISC_MAP[base.ultracode]];

                for (let index = uniqueitem.TIER; index < 3; index++) {
                    let contents = [];

                    base = bases[index];
                    contents.push(LOCAL_MAP[base.code][LNG] + ` ` + ITEM_TIERS[index][LNG]);
                    //需求等级
                    let reqLvl = 0;
                    if (uniqueitem.TIER === index) {
                        // 原装需求等级 = max(原装需求等级 || 底材需求等级)
                        reqLvl = Math.max(uniqueitem[`lvl req`], (base.levelreq || 0));
                    } else {
                        // 升级需求等级 = max(原装需求等级 || 底材需求等级+修正)
                        reqLvl = Math.max(uniqueitem[`lvl req`], (base.levelreq || 0) + ITEM_TIERS[uniqueitem.TIER].offset[index]);
                    }
                    contents.push(LOGIC.REQLVL[LNG] + (reqLvl || `-`));
                    //需求力量:Math.floor(((基础需求+无形) < 0 ? 0 : (基础需求+无形)) * (1+(需求变化/100)))
                    let reqstr = Math.floor((((base.reqstr) || 0) + eth) < 0 ? 0 : (((base.reqstr) || 0) + eth) * ease)
                    contents.push(LOGIC.REQSTR[LNG] + (reqstr || "-"));
                    //需求敏捷:Math.floor(((基础需求+无形) < 0 ? 0 : (基础需求+无形)) * (1+(需求变化/100)))
                    let reqdex = Math.floor((((base.reqdex) || 0) + eth) < 0 ? 0 : (((base.reqdex) || 0) + eth) * ease)
                    contents.push(LOGIC.REQDEX[LNG] + (reqdex || "-"));
                    //耐久
                    contents.push(LOGIC.DURABILITY[LNG] + base.durability);
                    //攻速
                    contents.push(LOGIC.SPEED[LNG] + "[" + (base.speed || 0) + "]");

                    const div = document.createElement(`div`);
                    div.className = `base-box`;
                    div.innerHTML = contents.join(`<BR>`);
                    xDiv.appendChild(div);
                }
                break;
            }
        }

        // contianer prop
        const propDiv = local(uniqueitem);
        container.appendChild(nameDiv);
        container.appendChild(imageDiv);
        container.appendChild(xDiv);
        container.appendChild(propDiv);
        result.appendChild(container);

        //调整间距
        for (const div of xDiv.children) {
            div.style.width = ((xDiv.offsetWidth / xDiv.children.length) * 0.9) + 'px';
        }
    }

}

function local(uniqueitem) {
    let propDiv = document.createElement('div');
    propDiv.className = 'prop-box';

    for (const itemstatcost of uniqueitem.ITEMSTATCOSTS) {
        //无本地化不渲染
        let descstr = itemstatcost.descstrpos;
        if(itemstatcost.CODE && itemstatcost.CODE.MIN && itemstatcost.CODE.MIN < 0){
            descstr = itemstatcost.descstrneg;
        }
        let local = LOCAL_MAP[descstr];
        if(!local)continue;
        local = local[LNG];

        local = format(local, itemstatcost);

        propDiv.innerHTML += local + "<BR>";

    }
    return propDiv;
}