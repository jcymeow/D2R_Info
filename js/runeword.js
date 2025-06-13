/**
 * @author jcy
 * @mail 20970736@qq.com
 * @date 2025-5-22
 */

let RUNEWORDS = [];

function loaded() {
    common()
    loadLNG();
    init();
    filter();

    //Enter to query
    document.getElementById(`runewordInput`).addEventListener(`keypress`, function (e) {
        if (e.key === `Enter`) {
            e.preventDefault();
            filter();
        }
    });

    //Reset & query
    document.getElementById(`resetBtn`).addEventListener(`click`, function () {
        document.getElementById(`runewordInput`).value = ``;
        const radioButtons = document.querySelectorAll(`input[type="radio"]`);
        radioButtons.forEach(radio => {
            radio.checked = false;
        });
        filter();
    });

    //change to query
    document.getElementById(`searchForm`).querySelectorAll(`input[type="radio"]`).forEach(radio => {
        radio.addEventListener(`change`, (e) => {
            filter();
        });
    });

    //language & init & query
    document.querySelectorAll(`.lang-btn`).forEach(button => {
        button.addEventListener(`click`, function () {
            const selectedLang = this.getAttribute(`data-lang`);
            if (selectedLang !== LNG) {
                saveLNG(selectedLang);
                document.querySelectorAll(`.lang-btn`).forEach(button => {
                    button.classList.toggle(`active`, button.getAttribute(`data-lang`) === LNG);
                });
            }
            init();
            filter();
        });
        button.classList.toggle(`active`, button.getAttribute(`data-lang`) === LNG);
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

    //符文之语
    RUNEWORDS = clone(EXCEL_RUNES);
    //过滤未发布
    RUNEWORDS = RUNEWORDS.filter(runeword => runeword.complete === 1);
    for (let runeword of RUNEWORDS) {
        //名称(显示/查询)
        const local = LOCAL_MAP[runeword.Name];
        runeword.VIEWNAME = `${local.enUS.toUpperCase()} ${local.zhCN} ${local.zhTW}`;

        //可选装备类型
        runeword.ITYPES = [];
        runeword.VTYPES = [];
        for (let index = 1; index <= CONSTANTS.RUNEWORDS_ITYPE_LENGTH; index++) {
            const itype = runeword[`itype${index}`];
            if(itype){
                const equipment = EQUIPMENT[itype];
                const key = equipment.TYPE.toUpperCase();
                runeword.ITYPES.push(itype);
                runeword.VTYPES.push(equipment.NAME[LNG]);
                runeword[key] = true;
            }
            delete runeword[`itype${index}`];
        }
        
        //符文列表
        runeword.LEVELREQ = 0;
        runeword.RUNES = [];
        for (let index = 1; index <= CONSTANTS.RUNEWORDS_RUNES_LENGTH; index++) {
            const rune = runeword[`Rune${index}`];
            if(rune){
                runeword.RUNES.push(rune);
                runeword.LEVELREQ = Math.max(runeword.LEVELREQ, MISC_MAP[rune].levelreq);
            }
            delete runeword[`Rune${index}`];
        }
        runeword.SOCKETS = runeword.RUNES.length;

        //属性列表
        runeword.CODES = [];
        for (let index = 1; index <= CONSTANTS.RUNEWORDS_PROPERTIES_LENGTH; index++) {
            const code = {
                "CODE": runeword[`T1Code${index}`],
                "PARAM": runeword[`T1Param${index}`],
                "MIN": runeword[`T1Min${index}`],
                "MAX": runeword[`T1Max${index}`]
            };
            if(code.CODE) runeword.CODES.push(code);
            delete runeword[`T1Code${index}`];
            delete runeword[`T1Param${index}`];
            delete runeword[`T1Min${index}`];
            delete runeword[`T1Max${index}`];
        }

        // runeword[KEY](itemstatcost)分类拼接
        for (const KEY in EQUIPMENT_TYPE) {
            if (!runeword[KEY]) continue;

            runeword[KEY] = [];
            // +Runeword.ITEMSTATCOSTS
            for (const code of runeword.CODES) {
                const property = clone(PROPERTY_MAP[code.CODE]);
                for (const stat of property.STATS) {
                    const itemstatcost = clone(ITEMSTATCOST_MAP[stat.STAT]);
                    itemstatcost.STAT = clone(stat);
                    itemstatcost.CODE = clone(code);
                    runeword[KEY].push(itemstatcost);
                }
            }

            // +Runeword.RUNES.ITEMSTATCOSTS
            for (const rune of runeword.RUNES) {
                for (const code of GEM_MAP[rune][KEY]) {
                    const property = clone(PROPERTY_MAP[code.CODE]);
                    for (const stat of property.STATS) {
                        const itemstatcost = clone(ITEMSTATCOST_MAP[stat.STAT]);
                        itemstatcost.STAT = clone(stat);
                        itemstatcost.CODE = clone(code);
                        runeword[KEY].push(itemstatcost);
                    }
                }
            }
        }

        // runeword[KEY](itemstatcost)分类合并
        for (const KEY in EQUIPMENT_TYPE) {
            if (!runeword[KEY]) continue;
            let arr = runeword[KEY];
            for (let i = 0; i < arr.length; i++) {
                const base = arr[i];
                if (UNIQUE_ITEMSTATCOST.includes(base.STAT.STAT)) continue;
                for (let j = arr.length - 1; j > i; j--) {
                    const current = arr[j];
                    if (current.STAT.STAT === base.STAT.STAT) {
                        base.CODE.MIN += current.CODE.MIN;
                        base.CODE.MAX += current.CODE.MAX;
                        if(current.CODE.CODE === `dmg-pois` && current.CODE.CODE === `dmg-pois`){
                            base.CODE.PARAM = (base.CODE.PARAM + current.CODE.PARAM)/2
                        }
                        // 删除高索引项
                        arr.splice(j, 1);
                    }
                }
            }
        }

        // desc分组合并
        for (const KEY in EQUIPMENT_TYPE) {
            if (!runeword[KEY]) continue;

            let itemstatcosts = runeword[KEY].map(itemstatcost => itemstatcost.STAT.STAT);

            // STAT_GROUP => 全属性/全抗
            for (const item of STAT_GROUP) {
                const io = clone(item);
                const includesAll = io.in.every(input => itemstatcosts.includes(input));
                if (includesAll) {
                    const subItemStatCost = runeword[KEY].filter(itemstatcost => io.in.includes(itemstatcost.Stat));
                    const equals = subItemStatCost.every(itemstatcost => itemstatcost.CODE.MIN === subItemStatCost[0].CODE.MIN);
                    if (equals) {
                        const first = subItemStatCost[0];
                        io.out.CODE = first.CODE;
                        io.out.STAT = first.STAT;
                        io.out.descpriority = first.descpriority;
                        runeword[KEY].removeAll(subItemStatCost);
                        runeword[KEY].push(io.out);
                    }
                }
            }

            // RANGE_GROUP => 大小伤
            for (const item of RANGE_GROUP) {
                const io = clone(item);
                const includesAll = io.in.every(input => itemstatcosts.includes(input));
                if (includesAll) {
                    let minObj = runeword[KEY].filter(itemstatcost => itemstatcost.Stat === io.in[0])[0];
                    let maxObj = runeword[KEY].filter(itemstatcost => itemstatcost.Stat === io.in[1])[0];
                    let lenObj = runeword[KEY].filter(itemstatcost => itemstatcost.Stat === io.in[2])[0];
                    
                    let newItemStatCost = io.out;
                    newItemStatCost.MIN = minObj;
                    newItemStatCost.MAX = maxObj;
                    newItemStatCost.CODE = minObj.CODE;
                    newItemStatCost.STAT = minObj.STAT;
                    if(lenObj)newItemStatCost.LEN = lenObj;
                    newItemStatCost.descpriority = minObj.descpriority;

                    //物理伤害:小伤>=大伤,则不合并
                    if(0xF008 === newItemStatCost[`*ID`] && minObj.CODE.MAX >= maxObj.CODE.MIN) continue;

                    const subItemStatCost = runeword[KEY].filter(itemstatcost => io.in.includes(itemstatcost.Stat));
                    runeword[KEY].removeAll(subItemStatCost);
                    runeword[KEY].push(newItemStatCost);
                }
            }

            //属性词条排序
            runeword[KEY].sort((a, b) => {
                //1.itemstatcost.js descpriority DESC
                if (b.descpriority != a.descpriority) {
                    return b.descpriority - a.descpriority;
                }
                //2.itemstatcost.js *ID DESC
                if(b[`*ID`] != a[`*ID`]){
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
        
    }
    
    //符文之语列表排序 需求等级 ASC
    RUNEWORDS.sort((a, b) => a.LEVELREQ - b.LEVELREQ);
}

// 过滤符合条件的符文之语
function filter() {

    let sel = [];

    const formData = {
        keyword: document.getElementById(`searchForm`).querySelector(`input[type="text"]`).value,
        type: document.getElementById(`searchForm`).querySelector(`input[name="type"]:checked`)?.value || ``,
        sockets: document.getElementById(`searchForm`).querySelector(`input[name="sockets"]:checked`)?.value || 0,
        rune : document.getElementById(`searchForm`).querySelector(`input[name="rune"]:checked`)?.value || ``
    };

    for (const rune of RUNEWORDS) {
        
        if (formData.keyword !== ``) {
            var value = formData.keyword.toUpperCase();
            if (!rune.VIEWNAME.includes(value)) {
                continue;
            }
        }

        if (formData.sockets != 0) {
            if (rune.SOCKETS != formData.sockets) {
                continue;
            }
        }

        if (formData.type !== ``) {
            let tree = [];
            let t = formData.type;
            while (t !== null) {
                tree.push(t);
                t = EQUIPMENT[t].PARENT;
            }

            const allow = rune.ITYPES.some(tt => tree.includes(tt));
            if (!allow) continue;
        }

        if (formData.rune !== ``) {
            if(!rune.RUNES.includes(formData.rune)){
                continue;
            }
        }

        sel.push(rune);
    }

    result(sel);
}

function result(array) {

    const result = document.getElementById(`result`);
    //clear
    result.innerHTML = ``;

    //count
    const countDiv = document.createElement(`div`);
    countDiv.className = `styled-box`;
    countDiv.append([LOGIC.COUNT_PREFIX[LNG], array.length, LOGIC.COUNT_SUFFIX[LNG]].join(` `));
    result.appendChild(countDiv);

    //list
    for (const runeword of array) {
        const id = runeword.Name.replace("Runeword", "") + ". ";
        //container
        const runewordDiv = document.createElement(`div`);
        runewordDiv.className = `styled-box`;

        //name
        const nameDiv = document.createElement(`div`);
        nameDiv.className = `name-box`;
        nameDiv.append(id);
        nameDiv.append(runeword.VIEWNAME);

        //image
        const imageDiv = document.createElement(`div`);
        imageDiv.className = `image-box`;
        for (const r of runeword.RUNES) {
            const rune = GEM_MAP[r];
            imageDiv.innerHTML += rune.IMAGE;
        }

        //require
        const requireDiv = document.createElement(`div`);
        requireDiv.className = `require-box`;
        requireDiv.innerHTML += `<div>` + [runeword.SOCKETS, LOGIC.SOCKETS[LNG], runeword.VTYPES.join(`/`)].join(` `) + `</div>`;
        requireDiv.innerHTML += `<div>${LOGIC.REQUIRED_LEVEL[LNG]}` + runeword.LEVELREQ + `</div>`;

        //properties
        const descDiv = document.createElement(`div`);
        descDiv.className = `x-box`;
        for (const KEY in EQUIPMENT_TYPE) {
            if (runeword[KEY]) {
                const div = local(KEY, runeword);
                descDiv.appendChild(div);
            }
        }

        runewordDiv.appendChild(nameDiv);
        runewordDiv.appendChild(imageDiv);
        runewordDiv.appendChild(requireDiv);
        runewordDiv.appendChild(descDiv);
        result.appendChild(runewordDiv);

        for (const div of descDiv.children) {
            div.style.width = ((descDiv.offsetWidth / descDiv.children.length) * 0.9) + `px`;
        }
    }
}

function local(equipType, runeword) {
    let propDiv = document.createElement(`div`);
    propDiv.className = `prop-box`;
    propDiv.innerHTML = [`<div class="form-row">`, LOGIC[equipType][LNG], `</div>`].join(``);

    for (const itemstatcost of runeword[equipType]) {
        //0值项不渲染
        if ( (itemstatcost.CODE ? itemstatcost.CODE.MIN : itemstatcost.MIN.CODE.MIN) === 0 ) continue;

        //无本地化不渲染
        let descstr = itemstatcost.descstrpos;
        if(itemstatcost.CODE && itemstatcost.CODE.MIN && itemstatcost.CODE.MIN < 0){
            descstr = itemstatcost.descstrneg;
        }
        let local = LOCAL_MAP[descstr];
        if(!local)continue;
        local = local[LNG];

        // 依赖descline渲染
        if (itemstatcost.CODE
            && itemstatcost.CODE.PARAM
            && SKILL_MAP[itemstatcost.CODE.PARAM]
            && SKILL_MAP[itemstatcost.CODE.PARAM].DESC
            && SKILL_MAP[itemstatcost.CODE.PARAM].DESC[`item proc descline count`]
            && SKILL_MAP[itemstatcost.CODE.PARAM].DESC[`item proc descline count`] > 0) {
            itemstatcost.descfunc = 0xFF;
        }

        local = format(local, itemstatcost);

        propDiv.innerHTML += local + "<BR>";

    }
    return propDiv;
}