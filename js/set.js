/**
 * @author jcy
 * @mail 20970736@qq.com
 * @date 2025-5-22
 */

// let SETS = [];
// let SETITEMS = [];
const SET_MAP = {};

function loaded() {
    loadLNG();
    common();
    init();
    result();
    
    //change to query
    document.getElementById('searchForm').querySelectorAll('input[name="sets"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            result();
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
                
            }
            loadLNG();
            init();
            result();
        });
        button.classList.toggle('active', button.getAttribute('data-lang') === LNG);
    });

}

function init() {

    // 组件本地化
    COMPONENTS.forEach(item => {
        const ele = document.getElementById(item.id);
        if (ele) {
            const radio = ele.querySelector(`input[type="radio"]`);
            ele[item.key] = item[LNG];
            if (radio) ele.prepend(radio);
        }
    });

    // SET_MAP
    for (const set of EXCEL_SETS){

        initSet(set);
        //套装组件
        set.ITEMS = EXCEL_SETITEMS.filter(item => item.set === set.index);
        for (const item of set.ITEMS) {
            initSetItem(item);
        }
        SET_MAP[set.index] = set;
    }
}

function initSet(set){
    set.ITEMSTATCOSTS = [];
    const CODES = [];
    // 套装部分奖励
    for (let index = 2; index <= 5; index++) {
        const CODEA = {
            "CODE": set[`PCode${index}a`],
            "PARAM": set[`PParam${index}a`],
            "MIN": set[`PMin${index}a`],
            "MAX": set[`PMax${index}a`],
            "SET": index
        };
        if (CODEA.CODE) CODES.push(CODEA);
        const CODEB = {
            "CODE": set[`PCode${index}b`],
            "PARAM": set[`PParam${index}b`],
            "MIN": set[`PMin${index}b`],
            "MAX": set[`PMax${index}b`],
            "SET": index
        };
        if (CODEB.CODE) CODES.push(CODEB);
    }
    // 套装完整奖励
    for (let index = 1; index <= 8; index++) {
        const CODE = {
            "CODE": set[`FCode${index}`],
            "PARAM": set[`FParam${index}`],
            "MIN": set[`FMin${index}`],
            "MAX": set[`FMax${index}`],
            "SET": 0
        };
        if (CODE.CODE) CODES.push(CODE);
    }

    //itemstatcost
    for (const code of CODES) {
        let property = PROPERTY_MAP[code.CODE];
        if (!property) continue;
        property = clone(property)
        for (const stat of property.STATS) {
            const itemstatcost = clone(ITEMSTATCOST_MAP[stat.STAT]);
            if (!itemstatcost) continue;
            itemstatcost.STAT = clone(stat);
            itemstatcost.CODE = clone(code);
            set.ITEMSTATCOSTS.push(itemstatcost);
        }
    }

    let itemstatcosts = set.ITEMSTATCOSTS.map(itemstatcost => itemstatcost.STAT.STAT)

    // STAT_GROUP => 全属性/全抗
    for (const item of STAT_GROUP) {
        const io = clone(item);
        const includesAll = io.in.every(input => itemstatcosts.includes(input));
        if (includesAll) {
            const subItemStatCost = set.ITEMSTATCOSTS.filter(itemstatcost => io.in.includes(itemstatcost.Stat));
            const equals = subItemStatCost.every(itemstatcost => itemstatcost.CODE.MIN === subItemStatCost[0].CODE.MIN);
            if (equals) {
                const first = subItemStatCost[0];
                io.out.CODE = first.CODE;
                io.out.STAT = first.STAT;
                io.out.descpriority = first.descpriority;
                set.ITEMSTATCOSTS.replace(subItemStatCost, io.out);
            }
        }
    }

    // RANGE_GROUP => 大小伤
    for (const item of RANGE_GROUP) {
        const io = clone(item);
        const includesAll = io.in.every(input => itemstatcosts.includes(input));
        if (includesAll) {
            let minObj = set.ITEMSTATCOSTS.filter(itemstatcost => itemstatcost.Stat === io.in[0])[0];
            let maxObj = set.ITEMSTATCOSTS.filter(itemstatcost => itemstatcost.Stat === io.in[1])[0];
            let lenObj = set.ITEMSTATCOSTS.filter(itemstatcost => itemstatcost.Stat === io.in[2])[0];

            let newItemStatCost = io.out;
            newItemStatCost.MIN = minObj;
            newItemStatCost.MAX = maxObj;
            newItemStatCost.CODE = minObj.CODE;
            newItemStatCost.STAT = minObj.STAT;
            if (lenObj) newItemStatCost.LEN = lenObj;
            newItemStatCost.descpriority = minObj.descpriority;

            //物理伤害:小伤>=大伤,则不合并
            if (0xF008 === newItemStatCost[`*ID`] && minObj.CODE.MAX >= maxObj.CODE.MIN) continue;

            const subItemStatCost = set.ITEMSTATCOSTS.filter(itemstatcost => io.in.includes(itemstatcost.Stat));
            set.ITEMSTATCOSTS.replace(subItemStatCost, newItemStatCost);
        }
    }
}

function initSetItem(setitem){

    // 装备层级(Normal//Elite)
    const misc = MISC_MAP[setitem.item];
    setitem.TIER = null;
    if (misc.code === misc.normcode) setitem.TIER = 0;
    if (misc.code === misc.ubercode) setitem.TIER = 1;
    if (misc.code === misc.ultracode) setitem.TIER = 2;
    // 装备类型(MISC/WEAPON/ARMOR)
    setitem.CATEGORY = misc.CATEGORY;

    /** 套装物品基础词条:START **/ 
    {
        setitem.BASE_ITEMSTATCOSTS = [];

        let BASE_CODES = [];
        // 套装单件属性
        for (let index = 1; index <= 9; index++) {
            const CODE = {
                "CODE": setitem[`prop${index}`],
                "PARAM": setitem[`par${index}`],
                "MIN": setitem[`min${index}`],
                "MAX": setitem[`max${index}`],
            };
            if (CODE.CODE) BASE_CODES.push(CODE);
        }
        for (const code of BASE_CODES) {
            let property = PROPERTY_MAP[code.CODE];
            if (!property) continue;
            property = clone(property)
            for (const stat of property.STATS) {
                const itemstatcost = clone(ITEMSTATCOST_MAP[stat.STAT]);
                if (!itemstatcost) continue;
                itemstatcost.STAT = clone(stat);
                itemstatcost.CODE = clone(code);
                setitem.BASE_ITEMSTATCOSTS.push(itemstatcost);
            }
        }

        let itemstatcosts = setitem.BASE_ITEMSTATCOSTS.map(itemstatcost => itemstatcost.STAT.STAT)

        // STAT_GROUP => 全属性/全抗
        for (const item of STAT_GROUP) {
            const io = clone(item);
            const includesAll = io.in.every(input => itemstatcosts.includes(input));
            if (includesAll) {
                const subItemStatCost = setitem.BASE_ITEMSTATCOSTS.filter(itemstatcost => io.in.includes(itemstatcost.Stat));
                const equals = subItemStatCost.every(itemstatcost => itemstatcost.CODE.MIN === subItemStatCost[0].CODE.MIN);
                if (equals) {
                    const first = subItemStatCost[0];
                    io.out.CODE = first.CODE;
                    io.out.STAT = first.STAT;
                    io.out.descpriority = first.descpriority;
                    setitem.BASE_ITEMSTATCOSTS.replace(subItemStatCost, io.out);
                }
            }
        }

        // RANGE_GROUP => 大小伤
        for (const item of RANGE_GROUP) {
            const io = clone(item);
            const includesAll = io.in.every(input => itemstatcosts.includes(input));
            if (includesAll) {
                let minObj = setitem.BASE_ITEMSTATCOSTS.filter(itemstatcost => itemstatcost.Stat === io.in[0])[0];
                let maxObj = setitem.BASE_ITEMSTATCOSTS.filter(itemstatcost => itemstatcost.Stat === io.in[1])[0];
                let lenObj = setitem.BASE_ITEMSTATCOSTS.filter(itemstatcost => itemstatcost.Stat === io.in[2])[0];

                let newItemStatCost = io.out;
                newItemStatCost.MIN = minObj;
                newItemStatCost.MAX = maxObj;
                newItemStatCost.CODE = minObj.CODE;
                newItemStatCost.STAT = minObj.STAT;
                if (lenObj) newItemStatCost.LEN = lenObj;
                newItemStatCost.descpriority = minObj.descpriority;

                //物理伤害:小伤>=大伤,则不合并
                if (0xF008 === newItemStatCost[`*ID`] && minObj.CODE.MAX >= maxObj.CODE.MIN) continue;

                const subItemStatCost = setitem.BASE_ITEMSTATCOSTS.filter(itemstatcost => io.in.includes(itemstatcost.Stat));
                setitem.BASE_ITEMSTATCOSTS.replace(subItemStatCost, newItemStatCost);
            }
        }
    }
    /** 套装物品基础词条:END **/ 

    /** 套装物品奖励词条:START **/ 
    {
        setitem.BONUS_ITEMSTATCOSTS = [];
        let BONUS_CODES = [];
        // 套装单件奖励属性
        for (let index = 1; index <= 5; index++) {
            const CODEA = {
                "CODE": setitem[`aprop${index}a`],
                "PARAM": setitem[`apar${index}a`],
                "MIN": setitem[`amin${index}a`],
                "MAX": setitem[`amax${index}a`],
                "SET": index + 1
            };
            if (CODEA.CODE) BONUS_CODES.push(CODEA);
            const CODEB = {
                "CODE": setitem[`aprop${index}b`],
                "PARAM": setitem[`apar${index}b`],
                "MIN": setitem[`amin${index}b`],
                "MAX": setitem[`amax${index}b`],
                "SET": index + 1
            };
            if (CODEB.CODE) BONUS_CODES.push(CODEB);
        }

        
        for (const code of BONUS_CODES) {
            let property = PROPERTY_MAP[code.CODE];
            if (!property) continue;
            property = clone(property)
            for (const stat of property.STATS) {
                const itemstatcost = clone(ITEMSTATCOST_MAP[stat.STAT]);
                if (!itemstatcost) continue;
                itemstatcost.STAT = clone(stat);
                itemstatcost.CODE = clone(code);
                setitem.BONUS_ITEMSTATCOSTS.push(itemstatcost);
            }
        }
        
        let itemstatcosts = setitem.BONUS_ITEMSTATCOSTS.map(itemstatcost => itemstatcost.STAT.STAT)

        // STAT_GROUP => 全属性/全抗
        for (const item of STAT_GROUP) {
            const io = clone(item);
            const includesAll = io.in.every(input => itemstatcosts.includes(input));
            if (includesAll) {
                const subItemStatCost = setitem.BONUS_ITEMSTATCOSTS.filter(itemstatcost => io.in.includes(itemstatcost.Stat));
                const equals = subItemStatCost.every(itemstatcost => itemstatcost.CODE.MIN === subItemStatCost[0].CODE.MIN);
                if (equals) {
                    const first = subItemStatCost[0];
                    io.out.CODE = first.CODE;
                    io.out.STAT = first.STAT;
                    io.out.descpriority = first.descpriority;
                    setitem.BONUS_ITEMSTATCOSTS.replace(subItemStatCost, io.out);
                }
            }
        }

        // RANGE_GROUP => 大小伤
        for (const item of RANGE_GROUP) {
            const io = clone(item);
            const includesAll = io.in.every(input => itemstatcosts.includes(input));
            if (includesAll) {
                let minObj = setitem.BONUS_ITEMSTATCOSTS.filter(itemstatcost => itemstatcost.Stat === io.in[0])[0];
                let maxObj = setitem.BONUS_ITEMSTATCOSTS.filter(itemstatcost => itemstatcost.Stat === io.in[1])[0];
                let lenObj = setitem.BONUS_ITEMSTATCOSTS.filter(itemstatcost => itemstatcost.Stat === io.in[2])[0];

                let newItemStatCost = io.out;
                newItemStatCost.MIN = minObj;
                newItemStatCost.MAX = maxObj;
                newItemStatCost.CODE = minObj.CODE;
                newItemStatCost.STAT = minObj.STAT;
                if (lenObj) newItemStatCost.LEN = lenObj;
                newItemStatCost.descpriority = minObj.descpriority;

                //物理伤害:小伤>=大伤,则不合并
                if (0xF008 === newItemStatCost[`*ID`] && minObj.CODE.MAX >= maxObj.CODE.MIN) continue;

                const subItemStatCost = setitem.BONUS_ITEMSTATCOSTS.filter(itemstatcost => io.in.includes(itemstatcost.Stat));
                setitem.BONUS_ITEMSTATCOSTS.replace(subItemStatCost, newItemStatCost);
            }
        }
    }
    /** 套装物品奖励词条:END **/ 
    
    //合并词条
    setitem.ITEMSTATCOSTS = [...setitem.BASE_ITEMSTATCOSTS, ...setitem.BONUS_ITEMSTATCOSTS];
}

function result() {

    const result = document.getElementById('result');
    //clear
    result.innerHTML = '';

    const sel = document.getElementById('searchForm').querySelector('input[type="radio"]:checked')?.value;
    if(!sel) return null;

    const set = SET_MAP[sel];

    // set
    const setDiv = document.createElement("div");
    setDiv.className = 'styled-box';

    // set name 
    const nameDiv = document.createElement('div');
    nameDiv.className = 'name-box';
    nameDiv.append([LOCAL_MAP[set.index].enUS, LOCAL_MAP[set.index].zhCN, LOCAL_MAP[set.index].zhTW].join(" "));
    setDiv.appendChild(nameDiv);

    // set prop
    setDiv.appendChild(localSet(set));
    result.appendChild(setDiv);

    //list
    for (const item of set.ITEMS) {
        const id = item[`*ID`];
        // container
        const container = document.createElement('div');
        container.className = 'styled-box';

        // container name 
        const nameDiv = document.createElement('div');
        nameDiv.className = 'name-box';
        nameDiv.append([id+".", LOCAL_MAP[item.index].enUS, LOCAL_MAP[item.index].zhCN, LOCAL_MAP[item.index].zhTW].join(" "));

        // contianer image
        const imageDiv = document.createElement('div');
        imageDiv.className = 'image-box';
        imageDiv.innerHTML = `<img src="image/setitem/${id}.jpg" onerror="this.src='image/NONE.png'" />`;

        // contianer x
        const xDiv = document.createElement('div');
        xDiv.className = 'x-box';
        //是否包含需求变化
        let ease = 1;
        const easeArray = item.ITEMSTATCOSTS.filter(itemstatcost => itemstatcost.Stat === `item_req_percent`);
        if(easeArray && easeArray.length > 0){
            ease = ease + easeArray[0].CODE.MIN/100;
        }
        switch (item.CATEGORY) {
            case "ARMOR": {
                let base = MISC_MAP[item.item];
                const bases = [MISC_MAP[base.normcode], MISC_MAP[base.ubercode], MISC_MAP[base.ultracode]];

                for (let index = item.TIER; index < 3; index++) {
                    let contents = [];

                    base = bases[index];
                    contents.push(LOCAL_MAP[base.code][LNG] + ` ` + ITEM_TIERS[index][LNG]);

                    //需求等级
                    let reqLvl = 0;
                    if (item.TIER === index) {
                        // 原装需求等级
                        reqLvl = item[`lvl req`];
                    } else {
                        // 升级需求等级 = max(原装需求等级 || 底材需求等级+修正)
                        reqLvl = Math.max(item[`lvl req`], (base.levelreq || 0) + ITEM_TIERS[item.TIER].offset[index]);
                    }
                    contents.push(LOGIC.REQLVL[LNG] + (reqLvl || `-`));
                    //需求力量:
                    let reqstr = Math.floor((base.reqstr || 0)  * ease);
                    contents.push(LOGIC.REQSTR[LNG] + (reqstr || "-"));
                    //耐久
                    contents.push(LOGIC.DURABILITY[LNG] + base.durability);

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
                let base = MISC_MAP[item.item];
                const bases = [MISC_MAP[base.normcode], MISC_MAP[base.ubercode], MISC_MAP[base.ultracode]];

                for (let index = item.TIER; index < 3; index++) {
                    let contents = [];

                    base = bases[index];
                    contents.push(LOCAL_MAP[base.code][LNG] + ` ` + ITEM_TIERS[index][LNG]);
                    //需求等级
                    let reqLvl = 0;
                    if (item.TIER === index) {
                        // 原装需求等级 = max(原装需求等级 || 底材需求等级)
                        reqLvl = Math.max(item[`lvl req`], (base.levelreq || 0));
                    } else {
                        // 升级需求等级 = max(原装需求等级 || 底材需求等级+修正)
                        reqLvl = Math.max(item[`lvl req`], (base.levelreq || 0) + ITEM_TIERS[item.TIER].offset[index]);
                    }
                    contents.push(LOGIC.REQLVL[LNG] + (reqLvl || `-`));
                    //需求力量:
                    let reqstr = Math.floor((base.reqstr || 0)  * ease);
                    contents.push(LOGIC.REQSTR[LNG] + (reqstr || "-"));
                    //需求敏捷:
                    let reqdex = Math.floor((base.reqdex || 0)  * ease);
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

        // contianer props
        const propDiv = localSetitem(item);

        container.appendChild(nameDiv);
        container.appendChild(imageDiv);
        container.appendChild(xDiv);
        container.appendChild(propDiv);
        result.appendChild(container);

        //调整间距
        for (const div of xDiv.children) {
            div.style.width = ((xDiv.offsetWidth / 3) * 0.9) + 'px';
        }
    }
}

function localSet(set){
    let propDiv = document.createElement('div');
    propDiv.className = 'prop-box';

    for (const itemstatcost of set.ITEMSTATCOSTS) {
        //无本地化不渲染
        let descstr = itemstatcost.descstrpos;
        if(itemstatcost.CODE && itemstatcost.CODE.MIN && itemstatcost.CODE.MIN < 0){
            descstr = itemstatcost.descstrneg;
        }
        let local = LOCAL_MAP[descstr];
        if(!local)continue;
        local = local[LNG];

        local = format(local, itemstatcost);
        if(itemstatcost.CODE.SET) local += `(${itemstatcost.CODE.SET})`;
        local = `<span class="set-box">${local}</span>`
        propDiv.innerHTML += local + "<BR>";

    }
    return propDiv;
}

function localSetitem(setitem) {
    let propDiv = document.createElement('div');
    propDiv.className = 'prop-box';

    for (const itemstatcost of setitem.ITEMSTATCOSTS) {
        //无本地化不渲染
        let descstr = itemstatcost.descstrpos;
        if(itemstatcost.CODE && itemstatcost.CODE.MIN && itemstatcost.CODE.MIN < 0){
            descstr = itemstatcost.descstrneg;
        }
        let local = LOCAL_MAP[descstr];
        if(!local)continue;
        local = local[LNG];

        local = format(local, itemstatcost);

        if(itemstatcost.CODE.SET) local += `(${itemstatcost.CODE.SET})`
        if(itemstatcost.CODE.SET || 0 === itemstatcost.CODE.SET) local = `<span class="setitem-box">${local}</span>`
        propDiv.innerHTML += local + "<BR>";

    }
    return propDiv;
}