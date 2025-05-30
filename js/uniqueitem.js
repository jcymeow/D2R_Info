/**
 * @author jcy
 * @mail 20970736@qq.com
 * @date 2025-5-22
 */

let LNG = '';
let uniqueitems = [];
let propertyMap = {};
let skillMap = {};
let skilldescMap = {}
let gemMap = {};

const LOCAL_MAP = {};
const MISC_MAP = {};
const CHAR_MAP = {};
const DESC_MAP = {};

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

        filter();
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

    //charstats.js remove Expansion
    EXCEL_CHARSTATS.splice(5, 1);

    //playerclass.js remove Expansion
    EXCEL_PLAYERCLASS.splice(5, 1);

    init();
    filter();
}

function init() {

    /** I18n **/
    COMPONENTS.forEach(item => {
        const ele = document.getElementById(item.id);
        if(ele){
            const radio = ele.querySelector(`input[type="radio"]`);
            ele[item.key] = item[LNG];
            if(radio)ele.prepend(radio);
        }
    });

    // init LOCAL_MAP [item-modifiers.js, item-names.js, item-runes.js, monsters.js, skills.js, d2r_ext.js]
    for (const item of [...STRINGS_ITEM_MODIFIERS, ...STRINGS_ITEM_NAMES, ...STRINGS_ITEM_RUNES, ...STRINGS_MONSTERS, ...STRINGS_SKILLS, ...STRINGS_EXT]) {
        LOCAL_MAP[item.Key] = item;
    }

    // init MISC_MAP
    for (const item of EXCEL_ARMOR) {
        MISC_MAP[item.code] = item;
        MISC_MAP[item.code].category = 'ARMOR';
    }
    for (const item of EXCEL_WEAPONS) {
        MISC_MAP[item.code] = item;
        MISC_MAP[item.code].category = 'WEAPON';
    }
    for (const item of EXCEL_MISC) {
        MISC_MAP[item.code] = item;
        MISC_MAP[item.code].category = 'MISC';
    }

    // init CHAR_MAP Key(0/ama/Amazon...) 
    for (let index = 0; index < EXCEL_CHARSTATS.length; index++) {
        const charstat = EXCEL_CHARSTATS[index];
        CHAR_MAP[charstat.class] = charstat;
        CHAR_MAP[EXCEL_PLAYERCLASS[index].Code] = charstat;
        CHAR_MAP[index] = charstat;
    }

    //技能(id/skill/小写连拼/skilldesc 4映射)
    for (const item of EXCEL_SKILLS) {
        skillMap[item.skill] = item;
        skillMap[item[`*Id`]] = item;
        skillMap[normalizeSkillName(item.skill)] = item;
        skillMap[item.skilldesc] = item;
    }

    //技能描述
    for (const item of EXCEL_SKILLDESC) {
        skilldescMap[item.skilldesc] = item;
    }
    
    // init DESC_MAP
    for (const item of [...EXCEL_ITEMSTATCOST, ...ITEMSTATCOST_EXT]) {
        let obj = clone(item);
        DESC_MAP[obj.Stat] = obj;
    }

    //属性
    for (const item of [...EXCEL_PROPERTIES, ...PROPERTIES_EXT]) {
        let obj = clone(item);
        obj.stats = [];
        let i = 1;
        while (obj[`stat${i}`]) {
            obj.stats.push({
                "stat": obj[`stat${i}`],
                "func": obj[`func${i}`],
                "set": obj[`set${i}`],
                "val": obj[`val${i}`]
            });
            i++;
        }
        propertyMap[obj.code] = obj;
    }

    //暗金道具
    uniqueitems = JSON.parse(JSON.stringify(EXCEL_UNIQUEITEMS));
    //剔除元素
    uniqueitems = uniqueitems.filter(item => { return !UNIQUEITEMS_TO_DELETE.includes(item.index) });

    for (let uniqueitem of uniqueitems) {
        //名称(显示/查询)
        const vName = LOCAL_MAP[uniqueitem.index];
        uniqueitem.viewName = [vName.enUS.toUpperCase(), vName.zhCN, vName.zhTW].join(" ");

        //tier
        const misc = MISC_MAP[uniqueitem.code];
        uniqueitem.tier = null;
        if (misc.code === misc.normcode) uniqueitem.tier = 0;
        if (misc.code === misc.ubercode) uniqueitem.tier = 1;
        if (misc.code === misc.ultracode) uniqueitem.tier = 2;
        uniqueitem.category = misc.category;

        //uniqueitems.js prop/par/min/max 1-12
        uniqueitem.params = [];
        let i = 1;
        while (uniqueitem[`prop${i}`]) {
            uniqueitem.params.push({
                "Code": uniqueitem[`prop${i}`],
                "Param": uniqueitem[`par${i}`],
                "Min": uniqueitem[`min${i}`],
                "Max": uniqueitem[`max${i}`]
            });
            i++;
        }

        uniqueitem.descs = [];
        for (const param of uniqueitem.params) {
            //properties.js 
            let property = propertyMap[param.Code];
            if (!property) continue;
            property = clone(property);
            for (const stat of property.stats) {
                //itemstatcost.js
                let desc = DESC_MAP[stat.stat];
                if (!desc) continue;
                desc = clone(desc);
                desc.stat = stat;
                desc.param = param;
                uniqueitem.descs.push(desc);
            }
        }

        /**
         * STAT_GROUP => 全属性/全抗
         **/
        for (const item of STAT_GROUP) {
            const io = clone(item);
            const includesAll = io.in.every(input => uniqueitem.descs.map(desc => desc.Stat).includes(input));
            if (includesAll) {
                const selDescs = uniqueitem.descs.filter(desc => io.in.includes(desc.Stat));
                const alignment = selDescs.every(desc => desc.param.Min === selDescs[0].param.Min);
                if (alignment) {
                    const first = selDescs[0];
                    io.out.param = first.param;
                    io.out.stat = first.stat;
                    io.out.descpriority = first.descpriority;
                    uniqueitem.descs.removeAll(selDescs);
                    uniqueitem.descs.push(io.out);
                }
            }
        }

        /**
         * RANGE_GROUP => 大小伤
         **/
        for (const item of RANGE_GROUP) {
            const io = clone(item);
            const includesAll = io.in.every(input => uniqueitem.descs.map(desc => desc.Stat).includes(input));
            if (includesAll) {
                let minObj = uniqueitem.descs.filter(desc => desc.Stat === io.in[0])[0];
                let maxObj = uniqueitem.descs.filter(desc => desc.Stat === io.in[1])[0];
                let lenObj = uniqueitem.descs.filter(desc => desc.Stat === io.in[2])[0];
                
                let newDesc = io.out;
                newDesc.min = minObj;
                newDesc.max = maxObj;
                if(lenObj)newDesc.len = lenObj;
                newDesc.descpriority = minObj.descpriority;
                
                const selDescs = uniqueitem.descs.filter(desc => io.in.includes(desc.Stat));
                // const first = selDescs[0];
                // io.out.param = first.param;
                // io.out.stat = first.stat;
                // io.out.descpriority = first.descpriority;
                uniqueitem.descs.removeAll(selDescs);
                uniqueitem.descs.push(newDesc);
            }
        }
        //属性词条排序
        uniqueitem.descs.sort((a, b) => {
            //1.itemstatcost.js descpriority DESC
            if (b.descpriority != a.descpriority) {
                return b.descpriority - a.descpriority;
            }
            return -1;
        });

    }
}

// 过滤符合条件的符文之语
function filter() {

    let sel = [];

    const formData = {
        keyword: document.getElementById('searchForm').querySelector('input[type="text"]').value,
        type: document.getElementById('searchForm').querySelector('input[name="type"]:checked')?.value || '',
        tier: document.getElementById('searchForm').querySelector('input[name="tier"]:checked')?.value || ''
    };

    for (const uniqueitem of uniqueitems) {
        
        if (formData.keyword !== '') {
            var value = formData.keyword.toUpperCase();
            if (!uniqueitem.viewName.includes(value)) {
                continue;
            }
        }
        
        if (formData.type !== '') {
            const codes = CODES[formData.type];
            if(!codes.includes(uniqueitem.code)) continue;
        }
        
        if (formData.tier !== ''){
            if(uniqueitem.tier != formData.tier) continue;
        }
        
        sel.push(uniqueitem);
    }

    result(sel);
}

function result(array) {

    const result = document.getElementById('result');
    //clear
    result.innerHTML = '';

    /** result div */
    const countDiv = document.createElement('div');
    countDiv.className = 'styled-box';
    countDiv.append([LOGIC.COUNT_PREFIX[LNG], array.length, LOGIC.COUNT_SUFFIX[LNG]].join(" "));
    result.appendChild(countDiv);

    //list
    for (const uniqueitem of array) {
        // container
        const container = document.createElement('div');
        container.className = 'styled-box';

        // container name 
        const nameDiv = document.createElement('div');
        nameDiv.className = 'name-box';
        nameDiv.append(uniqueitem.viewName);

        // contianer x
        const xDiv = document.createElement('div');
        xDiv.className = 'x-box';

        //是否包含需求变化
        let ease = 1;
        const easeArray = uniqueitem.descs.filter(desc => desc.Stat === `item_req_percent`);
        if(easeArray && easeArray.length > 0){
            ease = ease + easeArray[0].param.Min/100;
        }

        //底材属性
        switch (uniqueitem.category) {
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

                for (let index = uniqueitem.tier; index < 3; index++) {
                    let contents = [];

                    base = bases[index];
                    contents.push(LOCAL_MAP[base.code][LNG] + ` ` + ITEM_TIERS[index][LNG]);

                    //需求等级
                    let reqLvl = 0;
                    if (uniqueitem.tier === index) {
                        // 原装需求等级
                        reqLvl = uniqueitem[`lvl req`];
                    } else {
                        // 升级需求等级 = max(原装需求等级 || 底材需求等级+修正)
                        reqLvl = Math.max(uniqueitem[`lvl req`], (base.levelreq || 0) + ITEM_TIERS[uniqueitem.tier].offset[index]);
                    }
                    contents.push(LOGIC.REQLVL[LNG] + (reqLvl || `-`));
                    //需求力量
                    let reqstr = (base.reqstr || 0) * ease;
                    contents.push(LOGIC.REQSTR[LNG] + (reqstr || "-"));
                    //耐久
                    contents.push(LOGIC.DURABILITY[LNG] + base.durability);

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

                for (let index = uniqueitem.tier; index < 3; index++) {
                    let contents = [];

                    base = bases[index];
                    contents.push(LOCAL_MAP[base.code][LNG] + ` ` + ITEM_TIERS[index][LNG]);
                    //需求等级
                    let reqLvl = 0;
                    if (uniqueitem.tier === index) {
                        // 原装需求等级
                        reqLvl = uniqueitem[`lvl req`];
                    } else {
                        // 升级需求等级 = max(原装需求等级 || 底材需求等级+修正)
                        reqLvl = Math.max(uniqueitem[`lvl req`], (base.levelreq || 0) + ITEM_TIERS[uniqueitem.tier].offset[index]);
                    }
                    contents.push(LOGIC.REQLVL[LNG] + (reqLvl || `-`));
                    //需求力量
                    let reqstr = (base.reqstr || 0) * ease;
                    contents.push(LOGIC.REQSTR[LNG] + (reqstr || "-"));
                    //需求敏捷
                    let reqdex = (base.reqdex || 0) * ease;
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

    for (const desc of uniqueitem.descs) {
        //无本地化不渲染
        let descstr = desc.descstrpos;
        if(desc.param && desc.param.Min && desc.param.Min < 0){
            descstr = desc.descstrneg;
        }
        let local = LOCAL_MAP[descstr];
        if(!local)continue;
        local = local[LNG];

        switch (desc.descfunc) {
            case 5: {
                // #14 Dor "%+d%% 機率擊中使怪物逃跑"
                local = local.replace("%+d", desc.param.Min * 100 / 128);
                break;
            }
            case 11: {
                // "每秒修復 %d 耐久度"
                local = local.replace("%d", 100 / desc.param.Param);
                break;
            }
            case 12: {
                local = desc.param.Min > 1 ? [local, "+", desc.param.Min].join("") : local;
                break;
            }
            case 13: {
                const charstat = 
                local = LOCAL_MAP[EXCEL_CHARSTATS[desc.stat.val].StrAllSkills][LNG];
                local = local.replace("%+d", desc.param.Min < desc.param.Max ? ["+", "<span class='range-span'>", desc.param.Min, "-", desc.param.Max, "</span>"].join("") : ["+", desc.param.Min].join(""));
                break;
            }
            case 14: {
                const charIndex = parseInt(desc.param.Param / 3);
                const skillTabSerial = desc.param.Param % 3 + 1;
                const charstat = EXCEL_CHARSTATS[charIndex];
                const key = charstat[`StrSkillTab${skillTabSerial}`];
                const only = charstat["StrClassOnly"];
                local = LOCAL_MAP[key][LNG] + "<span class='only-span'>" + LOCAL_MAP[only][LNG] + "</span>";
                local = local.replace("%+d", desc.param.Min < desc.param.Max ? ["+", "<span class='range-span'>", desc.param.Min, "-", desc.param.Max, "</span>"].join("") : ["+", desc.param.Min].join(""));
                break;
            }
            case 15: {
                local = local.replace("%d", desc.param.Min)
                    .replace("%d", desc.param.Max)
                    .replace("%s", ["<span class='skill-span'>", LOCAL_MAP[skilldescMap[skillMap[`${desc.param.Param}`].skilldesc][`str name`]][LNG], "</span>"].join(""));
                break;
            }
            case 16: {
                local = local.replace("%d", desc.param.Min < desc.param.Max ? ["<span class='range-span'>", desc.param.Min, "-", desc.param.Max, "</span>"].join("") : desc.param.Min)
                    .replace("%s", ["<span class='skill-span'>", LOCAL_MAP[skilldescMap[skillMap[`${desc.param.Param}`].skilldesc][`str name`]][LNG], "</span>"].join(""));
                break;
            }
            case 17: {
                local = local.replace("%+d", "+" + (desc.param.Min / PERLEVEL));
                break;
            }
            case 19: {
                if (desc.param.Code.includes("/lvl")) {
                    if (desc.param.Param) {
                        local = local.replace("%+d", ["+", desc.param.Param / PERLEVEL].join(""))
                            .replace("%d", [desc.param.Param / PERLEVEL].join(""));
                    } else {
                        local = local.replace("%+d", desc.param.Min < desc.param.Max ? ["+", "<span class='range-span'>", desc.param.Min / PERLEVEL, "-", desc.param.Max / PERLEVEL, "</span>"].join("") : ["+", desc.param.Min / PERLEVEL].join(""))
                            .replace("%d", desc.param.Min < desc.param.Max ? ["<span class='range-span'>", desc.param.Min / PERLEVEL, "-", desc.param.Max / PERLEVEL, "</span>"].join("") : desc.param.Min / PERLEVEL);
                    }
                } else {
                    local = local.replace("%+d", desc.param.Min < desc.param.Max ? ["+", "<span class='range-span'>", desc.param.Min, "-", desc.param.Max, "</span>"].join("") : ["+", desc.param.Min].join(""))
                        .replace("%d", desc.param.Min < desc.param.Max ? ["<span class='range-span'>", desc.param.Min, "-", desc.param.Max, "</span>"].join("") : desc.param.Min);
                }
                break;
            }
            case 23: {//Faith reanimate
                local = local.replace("%0", desc.param.Min < desc.param.Max ? ["<span class='range-span'>", desc.param.Min, "-", desc.param.Max, "</span>"].join("") : desc.param.Min)
                    .replace("%1", LOCAL_MAP[EXCEL_MONSTATS[desc.param.Param].NameStr][LNG]);
                break;
            }
            case 24: {
                local = local.replace("%d", desc.param.Max)
                    .replace("%s", ["<span class='skill-span'>", LOCAL_MAP[skilldescMap[skillMap[`${desc.param.Param}`].skilldesc][`str name`]][LNG], "</span>"].join(""))
                    .replace("%d/%d", desc.param.Min);
                break;
            }
            case 27: {
                if(desc.param.Code === 'skill'){
                    const skill = skillMap[desc.param.Param];
                    const skilldesc = skilldescMap[skill.skilldesc];
                    const strName = skilldesc[`str name`];
    
                    const playstat = CHAR_MAP[skill.charclass];
                    const only = playstat.StrClassOnly;
    
                    local = local.replace("%+d", ["+", desc.param.Min].join(""))
                        .replace("%s", ["<span class='skill-span'>", LOCAL_MAP[strName][LNG], "</span>"].join(""))
                        .replace("%s", ["<span class='only-span'>", LOCAL_MAP[only][LNG], "</span>"].join(""));
                }
                if(desc.param.Code === 'skill-rand'){
                    //ormus
                    let skills = [];
                    for (let index = 61; index <= 65; index++) {
                        const skill = skillMap[index];
                        const skilldesc = skilldescMap[skill.skilldesc];
                        const strName = skilldesc[`str name`];
                        skills.push(LOCAL_MAP[strName][LNG]);
                    }

                    local = LOCAL_MAP[`ModStrF000`][LNG];
                    local = local.replace("%+d", ["+", desc.param.Param].join(""))
                        .replace("%s", skills.join("/"));
                }
                break;
            }
            case 28: {
                local = local.replace("%+d", desc.param.Min < desc.param.Max ? ["+", "<span class='range-span'>", desc.param.Min, "-", desc.param.Max, "</span>"].join("") : ["+", desc.param.Min].join(""))
                    .replace("%s", ["<span class='skill-span'>", LOCAL_MAP[skilldescMap[skillMap[`${desc.param.Param}`].skilldesc][`str name`]][LNG], "</span>"].join(""));
                break;
            }
            case 29: {
                local = local.replace("%d", desc.param.Min < desc.param.Max ? ["<span class='range-span'>", desc.param.Min, "-", desc.param.Max, "</span>"].join("") : desc.param.Min);
                break;
            }
            /** 自定义区 **/
            case 0xF1: {//所有属性/抗性
                local = local.replace("%+d", desc.param.Min < desc.param.Max ? ["+", "<span class='range-span'>", desc.param.Min, "-", desc.param.Max, "</span>"].join("") : ["+", desc.param.Min].join(""))
                break;
            }
            case 0xF2: {//毒伤
                let MIN = (desc.min.param.Min+desc.max.param.Min)/2;
                let MAX = (desc.min.param.Max+desc.max.param.Max)/2;
                let LEN = (desc.len.param.Min+desc.len.param.Max)/2;
                let SEC = LEN / FRAMES;

                local = local.replace(/%d.*?%d/, Math.round((MIN+MAX)/2*LEN/256))
                    .replace("%d", SEC);

                break;
            }
            case 0xF3: {//电/冰/火/魔伤
                let MINMIN = desc.min.param.Min;
                let MINMAX = desc.min.param.Max;
                let MAXMIN = desc.max.param.Min;
                let MAXMAX = desc.max.param.Max;
                if (desc.min.param.Code === desc.max.param.Code) {
                    local = local.replace(`%d`, MINMIN).replace(`%d`, MAXMAX);
                } else {
                    local = local.replace(`%d`, MINMIN === MINMAX ? MINMIN : ["(<span class='range-span'>", MINMIN, "-", MINMAX, "</span>)"].join(""))
                        .replace(`%d`, MAXMIN === MAXMAX ? MAXMIN : ["(<span class='range-span'>", MAXMIN, "-", MAXMAX, "</span>)"].join(""));
                }
                break;
            }
            default:
                console.log(`desc.descfunc = ${descfunc} 未定义渲染方式`);
                alert(`desc.descfunc = ${descfunc} 未定义渲染方式`);
                break;
        }

        local = local.replace("%%", "%").replace("+-", "-");//.replace("-+","-");
        if (local) {
            propDiv.innerHTML += local;
            if (desc.descstr2) {
                propDiv.innerHTML += LOCAL_MAP[desc.descstr2][LNG];
            }
            propDiv.innerHTML += '<BR>';
        }
    }
    return propDiv;
}