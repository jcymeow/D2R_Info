/**
 * @author jcy
 * @mail 20970736@qq.com
 * @date 2025-5-22
 */

//(计算等级成长时 /8)
const PERLEVEL = 8;

//每秒帧数(计算持续时间时 /25)
const FRAMES = 25;

//装备类型
const EQUIPMENT_TYPE = {
    WEAPON: "weapon",
    HELM: "helm",
    SHIELD: "shield",
};

const ITEM_TIERS = [
    {
        "zhCN": "(普通級)",
        "zhTW": "(普通級)",
        "enUS": "(Normal)",
        "offset": [0, 5, 12]
    },
    {
        "zhCN": "(扩展级)",
        "zhTW": "(擴展級)",
        "enUS": "(Exceptional)",
        "offset": [0, 0, 7]
    },
    {
        "zhCN": "(精华级)",
        "zhTW": "(精華級)",
        "enUS": "(Elite)",
        "offset": [0, 0, 0]
    }
];

const UNIQUE_ITEMSTATCOST = [
    "item_charged_skill",
    "item_nonclassskill",
    "item_singleskill",
    "item_skillongethit",
    "item_skillonhit"
];

const UNIQUEITEMS_TO_DELETE = [
    "Expansion",
    "Armor",
    "Elite Uniques",
    "Rings",
    "Class Specific",
    "Staff of Kings",
    "Gore Ripper",
    "Zakarum's Salvation",
    "Odium",
    "Larzuk's Champion",
    "Giantmaimer",
    "Nethercrow",
    "Warriv's Warder",
    "Merman's Speed",
    "Sigurd's Staunch",
    "Horadric Staff",
    "Hell Forge Hammer",
    "KhalimFlail",
    "SuperKhalimFlail"
];

const EQUIPMENT = {
    "weap": { "type": EQUIPMENT_TYPE.WEAPON, "name": { "zhCN": "武器", "zhTW": "武器", "enUS": "Weapon" }, "parent": null },
    "mele": { "type": EQUIPMENT_TYPE.WEAPON, "name": { "zhCN": "近战武器", "zhTW": "近戰武器", "enUS": "Melee Weapon" }, "parent": "weap" },
    "helm": { "type": EQUIPMENT_TYPE.HELM, "name": { "zhCN": "头盔", "zhTW": "頭盔", "enUS": "Helm" }, "parent": null },
    "tors": { "type": EQUIPMENT_TYPE.HELM, "name": { "zhCN": "护甲", "zhTW": "護甲", "enUS": "Armor" }, "parent": null },
    "shld": { "type": EQUIPMENT_TYPE.SHIELD, "name": { "zhCN": "盾牌", "zhTW": "盾牌", "enUS": "Shield" }, "parent": null },
    "pala": { "type": EQUIPMENT_TYPE.SHIELD, "name": { "zhCN": "圣骑专用盾", "zhTW": "聖騎盾", "enUS": "Paladin Shield" }, "parent": "shld" },
    "miss": { "type": EQUIPMENT_TYPE.WEAPON, "name": { "zhCN": "远程武器", "zhTW": "弓/弩/亚马逊弓", "enUS": "Missile Weapons" }, "parent": "weap" },
    "swor": { "type": EQUIPMENT_TYPE.WEAPON, "name": { "zhCN": "剑类", "zhTW": "刀劍", "enUS": "Swords" }, "parent": "mele" },
    "knif": { "type": EQUIPMENT_TYPE.WEAPON, "name": { "zhCN": "匕首", "zhTW": "匕首", "enUS": "Daggers" }, "parent": "mele" },
    "mace": { "type": EQUIPMENT_TYPE.WEAPON, "name": { "zhCN": "钉锤", "zhTW": "釘錘", "enUS": "Maces" }, "parent": "mele" },
    "hamm": { "type": EQUIPMENT_TYPE.WEAPON, "name": { "zhCN": "战锤", "zhTW": "重錘", "enUS": "Hammers" }, "parent": "mele" },
    "axe": { "type": EQUIPMENT_TYPE.WEAPON, "name": { "zhCN": "斧头", "zhTW": "斧", "enUS": "Axes" }, "parent": "mele" },
    "club": { "type": EQUIPMENT_TYPE.WEAPON, "name": { "zhCN": "短棒", "zhTW": "短棒", "enUS": "Clubs" }, "parent": "mele" },
    "pole": { "type": EQUIPMENT_TYPE.WEAPON, "name": { "zhCN": "长柄武器", "zhTW": "長柄武器", "enUS": "Polearms" }, "parent": "mele" },
    "spea": { "type": EQUIPMENT_TYPE.WEAPON, "name": { "zhCN": "标枪/亚马逊标枪", "zhTW": "長矛/亚马逊长矛", "enUS": "Spears / Amazon Javelins" }, "parent": "mele" },
    "h2h": { "type": EQUIPMENT_TYPE.WEAPON, "name": { "zhCN": "爪类/拳刃", "zhTW": "爪/拳刃", "enUS": "Claws / Katar" }, "parent": "mele" },
    "scep": { "type": EQUIPMENT_TYPE.WEAPON, "name": { "zhCN": "权杖", "zhTW": "權杖", "enUS": "Scepters" }, "parent": "mele" },
    "wand": { "type": EQUIPMENT_TYPE.WEAPON, "name": { "zhCN": "魔杖", "zhTW": "魔杖", "enUS": "Wands" }, "parent": "mele" },
    "staf": { "type": EQUIPMENT_TYPE.WEAPON, "name": { "zhCN": "法杖", "zhTW": "法杖", "enUS": "Staves" }, "parent": "mele" }
}

const CODES = {
    /** armor */
    "ashd": ["pa1", "pa2", "pa3", "pa4", "pa5", "pa6", "pa7", "pa8", "pa9", "paa", "pab", "pac", "pad", "pae", "paf"],
    "belt": ["lbl", "vbl", "mbl", "tbl", "hbl", "lbl", "zlb", "zvb", "zmb", "ztb", "zhb", "zlb", "ulc", "uvc", "umc", "utc", "uhc", "ulc"],
    "boot": ["lbt", "vbt", "mbt", "tbt", "hbt", "xlb", "xvb", "xmb", "xtb", "xhb", "ulb", "uvb", "umb", "utb", "uhb"],
    "circ": ["ci0", "ci1", "ci2", "ci3"],
    "glov": ["lgl", "vgl", "mgl", "tgl", "hgl", "xlg", "xvg", "xmg", "xtg", "xhg", "ulg", "uvg", "umg", "utg", "uhg"],
    "head": ["ne1", "ne2", "ne3", "ne4", "ne5", "ne6", "ne7", "ne8", "ne9", "nea", "neb", "nec", "ned", "nee", "nef"],
    "helm": ["cap", "skp", "hlm", "fhl", "ghm", "crn", "msk", "bhm", "xap", "xkp", "xlm", "xhl", "xhm", "xrn", "xsk", "xh9", "uap", "ukp", "ulm", "uhl", "uhm", "urn", "usk", "uh9"],
    "pelt": ["dr1", "dr2", "dr3", "dr4", "dr5", "dr6", "dr7", "dr8", "dr9", "dra", "drb", "drc", "drd", "dre", "drf"],
    "phlm": ["ba1", "ba2", "ba3", "ba4", "ba5", "ba6", "ba7", "ba8", "ba9", "baa", "bab", "bac", "bad", "bae", "baf"],
    "shie": ["buc", "sml", "lrg", "kit", "tow", "gts", "bsh", "spk", "xuc", "xml", "xrg", "xit", "xow", "xts", "xsh", "xpk", "uuc", "uml", "urg", "uit", "uow", "uts", "ush", "upk"],
    "tors": ["qui", "lea", "hla", "stu", "rng", "scl", "chn", "brs", "spl", "plt", "fld", "gth", "ful", "aar", "ltp", "xui", "xea", "xla", "xtu", "xng", "xcl", "xhn", "xrs", "xpl", "xlt", "xld", "xth", "xul", "xar", "xtp", "uui", "uea", "ula", "utu", "ung", "ucl", "uhn", "urs", "upl", "ult", "uld", "uth", "uul", "uar", "utp"],

    /** weapon */
    "abow": ["am1", "am2", "am6", "am7", "amb", "amc"],
    "ajav": ["am5", "ama", "amf"],
    "aspe": ["am3", "am4", "am8", "am9", "amd", "ame"],
    "axe": ["hax", "axe", "2ax", "mpi", "wax", "lax", "bax", "btx", "gax", "gix", "9ha", "9ax", "92a", "9mp", "9wa", "9la", "9ba", "9bt", "9ga", "9gi", "7ha", "7ax", "72a", "7mp", "7wa", "7la", "7ba", "7bt", "7ga", "7gi"],
    "bow": ["sbw", "hbw", "lbw", "cbw", "sbb", "lbb", "swb", "lwb", "8sb", "8hb", "8lb", "8cb", "8s8", "8l8", "8sw", "8lw", "6sb", "6hb", "6lb", "6cb", "6s7", "6l7", "6sw", "6lw"],
    "club": ["clb", "spc", "9cl", "9sp", "7cl", "7sp"],
    //h2h = h2h + h2h2
    "h2h": ["ktr", "9ar", "7ar", "wrb", "9wb", "7wb", "axf", "9xf", "7xf", "ces", "9cs", "7cs", "clw", "9lw", "7lw", "btl", "9tw", "7tw", "skr", "9qr", "7qr", "ktr", "9ar", "7ar", "wrb", "9wb", "7wb", "axf", "9xf", "7xf", "ces", "9cs", "7cs", "clw", "9lw", "7lw", "btl", "9tw", "7tw", "skr", "9qr", "7qr", "ktr", "9ar", "7ar", "wrb", "9wb", "7wb", "axf", "9xf", "7xf", "ces", "9cs", "7cs", "clw", "9lw", "7lw", "btl", "9tw", "7tw", "skr", "9qr", "7qr"],
    "hamm": ["whm", "mau", "gma", "9wh", "9m9", "9gm", "7wh", "7m7", "7gm"],
    "jave": ["jav", "pil", "ssp", "glv", "tsp", "9ja", "9pi", "9s9", "9gl", "9ts", "7ja", "7pi", "7s7", "7gl", "7ts"],
    "knif": ["dgr", "dir", "kri", "bld", "9dg", "9di", "9kr", "9bl", "7dg", "7di", "7kr", "7bl"],
    "mace": ["mac", "mst", "fla", "9ma", "9mt", "9fl", "7ma", "7mt", "7fl"],
    "orb": ["ob1", "ob2", "ob3", "ob4", "ob5", "ob6", "ob7", "ob8", "ob9", "oba", "obb", "obc", "obd", "obe", "obf"],
    "pole": ["bar", "vou", "scy", "pax", "hal", "wsc", "9b7", "9vo", "9s8", "9pa", "9h9", "9wc", "7o7", "7vo", "7s8", "7pa", "7h7", "7wc"],
    "scep": ["scp", "gsc", "wsp", "9sc", "9qs", "9ws", "7sc", "7qs", "7ws"],
    "spea": ["spr", "tri", "brn", "spt", "pik", "9sr", "9tr", "9br", "9st", "9p9", "7sr", "7tr", "7br", "7st", "7p7"],
    "staf": ["sst", "lst", "cst", "bst", "wst", "8ss", "8ls", "8cs", "8bs", "8ws", "6ss", "6ls", "6cs", "6bs", "6ws"],
    "swor": ["ssd", "scm", "sbr", "flc", "crs", "bsd", "lsd", "wsd", "2hs", "clm", "gis", "bsw", "flb", "gsd", "9ss", "9sm", "9sb", "9fc", "9cr", "9bs", "9ls", "9wd", "92h", "9cm", "9gs", "9b9", "9fb", "9gd", "7ss", "7sm", "7sb", "7fc", "7cr", "7bs", "7ls", "7wd", "72h", "7cm", "7gs", "7b7", "7fb", "7gd"],
    //thro = taxe + tkni
    "thro": ["tkf", "tax", "bkf", "bal", "9tk", "9ta", "9bk", "9b8", "7tk", "7ta", "7bk", "7b8"],
    "wand": ["wnd", "ywn", "bwn", "gwn", "9wn", "9yw", "9bw", "9gw", "7wn", "7yw", "7bw", "7gw"],
    "xbow": ["lxb", "mxb", "hxb", "rxb", "8lx", "8mx", "8hx", "8rx", "6lx", "6mx", "6hx", "6rx"],

    //misc
    "rin": ["rin"],
    "amu": ["amu"],
    "cm": ["cm1", "cm2", "cm3"],

};

//properties.js 补档
const PROPERTIES_EXT = [
    {
        "code": "dmg-min",
        "*Enabled": 1,
        "func1": 5,
        "stat1": "mindamage",
        "set1": "",
        "val1": "",
        "func2": "",
        "stat2": "",
        "set2": "",
        "val2": "",
        "func3": "",
        "stat3": "",
        "set3": "",
        "val3": "",
        "func4": "",
        "stat4": "",
        "set4": "",
        "val4": "",
        "func5": "",
        "stat5": "",
        "set5": "",
        "val5": "",
        "func6": "",
        "stat6": "",
        "set6": "",
        "val6": "",
        "func7": "",
        "stat7": "",
        "set7": "",
        "val7": "",
        "*Tooltip": "+# to Minimum Damage",
        "*Parameter": "",
        "*Min": "Min #",
        "*Max": "Max #",
        "*Notes": "",
        "*eol": 0
    },
    {
        "code": "dmg-max",
        "*Enabled": 1,
        "func1": 6,
        "stat1": "maxdamage",
        "set1": "",
        "val1": "",
        "func2": "",
        "stat2": "",
        "set2": "",
        "val2": "",
        "func3": "",
        "stat3": "",
        "set3": "",
        "val3": "",
        "func4": "",
        "stat4": "",
        "set4": "",
        "val4": "",
        "func5": "",
        "stat5": "",
        "set5": "",
        "val5": "",
        "func6": "",
        "stat6": "",
        "set6": "",
        "val6": "",
        "func7": "",
        "stat7": "",
        "set7": "",
        "val7": "",
        "*Tooltip": "+# to Maximum Damage",
        "*Parameter": "",
        "*Min": "Min #",
        "*Max": "Max #",
        "*Notes": "",
        "*eol": 0
    },
    {
        "code": "dmg%",
        "*Enabled": 1,
        "func1": 7,
        "stat1": "enhanceddamage",
        "set1": "",
        "val1": "",
        "func2": "",
        "stat2": "",
        "set2": "",
        "val2": "",
        "func3": "",
        "stat3": "",
        "set3": "",
        "val3": "",
        "func4": "",
        "stat4": "",
        "set4": "",
        "val4": "",
        "func5": "",
        "stat5": "",
        "set5": "",
        "val5": "",
        "func6": "",
        "stat6": "",
        "set6": "",
        "val6": "",
        "func7": "",
        "stat7": "",
        "set7": "",
        "val7": "",
        "*Tooltip": "+#% Enhanced Damage",
        "*Parameter": "",
        "*Min": "Min %",
        "*Max": "Max %",
        "*Notes": "",
        "*eol": 0
    },
    {
        "code": "indestruct",
        "*Enabled": 1,
        "func1": 20,
        "stat1": "item_indesctructible",
        "set1": "",
        "val1": "",
        "func2": "",
        "stat2": "",
        "set2": "",
        "val2": "",
        "func3": "",
        "stat3": "",
        "set3": "",
        "val3": "",
        "func4": "",
        "stat4": "",
        "set4": "",
        "val4": "",
        "func5": "",
        "stat5": "",
        "set5": "",
        "val5": "",
        "func6": "",
        "stat6": "",
        "set6": "",
        "val6": "",
        "func7": "",
        "stat7": "",
        "set7": "",
        "val7": "",
        "*Tooltip": "Indestructible",
        "*Parameter": "",
        "*Min": 1,
        "*Max": 1,
        "*Notes": "",
        "*eol": 0
    },
    {
        //TODO: 仅"饥荒"符文组 具有该属性 且未在展示中看到对应翻译
        "code": "ethereal",
        "*Enabled": 1,
        "func1": 23,
        "stat1": "",
        "set1": "",
        "val1": "",
        "func2": "",
        "stat2": "",
        "set2": "",
        "val2": "",
        "func3": "",
        "stat3": "",
        "set3": "",
        "val3": "",
        "func4": "",
        "stat4": "",
        "set4": "",
        "val4": "",
        "func5": "",
        "stat5": "",
        "set5": "",
        "val5": "",
        "func6": "",
        "stat6": "",
        "set6": "",
        "val6": "",
        "func7": "",
        "stat7": "",
        "set7": "",
        "val7": "",
        "*Tooltip": "Ethereal",
        "*Parameter": "",
        "*Min": 1,
        "*Max": 1,
        "*Notes": "",
        "*eol": 0
    },
    {
        "code": "randclassskill",
        "*Enabled": 1,
        "func1": 36,
        "stat1": "item_randclassskill",
        "set1": "",
        "val1": 3,
        "func2": "",
        "stat2": "",
        "set2": "",
        "val2": "",
        "func3": "",
        "stat3": "",
        "set3": "",
        "val3": "",
        "func4": "",
        "stat4": "",
        "set4": "",
        "val4": "",
        "func5": "",
        "stat5": "",
        "set5": "",
        "val5": "",
        "func6": "",
        "stat6": "",
        "set6": "",
        "val6": "",
        "func7": "",
        "stat7": "",
        "set7": "",
        "val7": "",
        "*Tooltip": "+# to [Class] Skill Levels",
        "*Parameter": "",
        "*Min": "Min Class ID",
        "*Max": "Max Class ID",
        "*Notes": "val1 = # of Skill levels",
        "*eol": 0
    },
];

//itemstatcost.js 补档
const ITEMSTATCOST_EXT = [
    {
        "Stat": "item_replenish_durability",
        "*ID": 252,
        "Send Other": "",
        "Signed": 1,
        "Send Bits": 5,
        "Send Param Bits": "",
        "UpdateAnimRate": "",
        "Saved": "",
        "CSvSigned": "",
        "CSvBits": "",
        "CSvParam": "",
        "fCallback": "",
        "fMin": "",
        "MinAccr": "",
        "Encode": "",
        "Add": 106,
        "Multiply": 256,
        "ValShift": "",
        "1.09-Save Bits": 5,
        "1.09-Save Add": 0,
        "Save Bits": 6,
        "Save Add": 0,
        "Save Param Bits": "",
        "keepzero": "",
        "op": "",
        "op param": "",
        "op base": "",
        "op stat1": "",
        "op stat2": "",
        "op stat3": "",
        "direct": "",
        "maxstat": "",
        "damagerelated": "",
        "itemevent1": "",
        "itemeventfunc1": "",
        "itemevent2": "",
        "itemeventfunc2": "",
        "descpriority": 1,
        "descfunc": 11,
        "descval": "",
        "descstrpos": "ModStre9u",
        "descstrneg": "ModStre9u",
        "descstr2": "",
        "dgrp": "",
        "dgrpfunc": "",
        "dgrpval": "",
        "dgrpstrpos": "",
        "dgrpstrneg": "",
        "dgrpstr2": "",
        "stuff": "",
        "advdisplay": "",
        "*eol": 0
    },
    {
        "Stat": "enhanceddamage",
        "*ID": 10000,
        "Send Other": 1,
        "Signed": "",
        "Send Bits": 11,
        "Send Param Bits": "",
        "UpdateAnimRate": "",
        "Saved": 1,
        "CSvSigned": 0,
        "CSvBits": 10,
        "CSvParam": "",
        "fCallback": "",
        "fMin": 1,
        "MinAccr": 1,
        "Encode": "",
        "Add": 125,
        "Multiply": 55,
        "ValShift": "",
        "1.09-Save Bits": 7,
        "1.09-Save Add": 32,
        "Save Bits": 8,
        "Save Add": 32,
        "Save Param Bits": "",
        "keepzero": "",
        "op": "",
        "op param": "",
        "op base": "",
        "op stat1": "",
        "op stat2": "",
        "op stat3": "",
        "direct": "",
        "maxstat": "",
        "damagerelated": "",
        "itemevent1": "",
        "itemeventfunc1": "",
        "itemevent2": "",
        "itemeventfunc2": "",
        "descpriority": 128,//TODO:夹逼定理待确定 (127, 145)  
        "descfunc": 19,
        "descval": "",
        "descstrpos": "strModEnhancedDamage",
        "descstrneg": "strModEnhancedDamage",
        "descstr2": "",
        "dgrp": 1,
        "dgrpfunc": 19,
        "dgrpval": "",
        "dgrpstrpos": "",
        "dgrpstrneg": "",
        "dgrpstr2": "",
        "stuff": 6,
        "advdisplay": "",
        "*eol": 0
    },
    {
        "Stat": "item_randclassskill",
        "*ID": 10083,
        "Send Other": "",
        "Signed": 1,
        "Send Bits": 4,
        "Send Param Bits": 3,
        "UpdateAnimRate": "",
        "Saved": "",
        "CSvSigned": "",
        "CSvBits": "",
        "CSvParam": "",
        "fCallback": 1,
        "fMin": "",
        "MinAccr": "",
        "Encode": "",
        "Add": 49523,
        "Multiply": 1560,
        "ValShift": "",
        "1.09-Save Bits": 3,
        "1.09-Save Add": 0,
        "Save Bits": 3,
        "Save Add": 0,
        "Save Param Bits": 3,
        "keepzero": "",
        "op": "",
        "op param": "",
        "op base": "",
        "op stat1": "",
        "op stat2": "",
        "op stat3": "",
        "direct": "",
        "maxstat": "",
        "damagerelated": "",
        "itemevent1": "",
        "itemeventfunc1": "",
        "itemevent2": "",
        "itemeventfunc2": "",
        "descpriority": 150,
        "descfunc": 13,
        "descval": "",
        "descstrpos": "ModStrF001",
        "descstrneg": "ModStrF001",
        "descstr2": "",
        "dgrp": "",
        "dgrpfunc": "",
        "dgrpval": "",
        "dgrpstrpos": "",
        "dgrpstrneg": "",
        "dgrpstr2": "",
        "stuff": "",
        "advdisplay": "",
        "*eol": 0
    },
];

// item-modifiers.js 补档
const ITEM_MODIFIERS_EXT = [
    {
        "id": 0xF000,
        "Key": "ModStrF000",
        "enUS": "%+d random Sorceress skill<span class='only-span'>(Sorceress Only)</span> excludes(<span class='skill-span'>%s</span>)",
        "zhTW": "%+d隨機魔法使技能<span class='only-span'>(限魔法使使用)</span> 不含(<span class='skill-span'>%s</span>)",
        "zhCN": "%+d随机巫师技能<span class='only-span'>(仅限巫师)</span> 不含(<span class='skill-span'>%s</span>)"
    },
    {
        "id": 0xF001,
        "Key": "ModStrF001",
        "enUS": "%+d to Random Class Skill Levels",
        "zhTW": "%+d 隨機角色技能",
        "zhCN": "%+d 随机角色技能"
    }
];

// 
const STAT_GROUP = [
    //all-res
    {
        in: ["fireresist", "lightresist", "coldresist", "poisonresist"],
        out: { "Stat": "allresist", "*ID": "6A637901", "descstrpos": "strModAllResistances", "descstrneg": "strModAllResistances", "descfunc": 0xF1 }
    },
    //all-attr
    {
        in: ["strength", "energy", "dexterity", "vitality"],
        out: { "Stat": "allattrib", "*ID": "6A637900", "descstrpos": "Moditem2allattrib", "descstrneg": "Moditem2allattrib", "descfunc": 0xF1 }
    },
];

const RANGE_GROUP = [
    // poison-dmg 92
    {
        in: ["poisonmindam", "poisonmaxdam", "poisonlength"],
        out: { "Stat": "poisondamage", "*ID": "6A637914", "descstrpos": "strModPoisonDamageRange", "descstrneg": "strModPoisonDamageRange", "descfunc": 0xF2 }
    },
    // light-dmg 99
    {
        in: ["lightmindam", "lightmaxdam"],
        out: { "Stat": "lightdamage", "*ID": "6A637912", "descstrpos": "strModLightningDamageRange", "descstrneg": "strModLightningDamageRange", "descfunc": 0xF3 }
    },
    // cold-dmg 96
    {
        in: ["coldmindam", "coldmaxdam"],
        out: { "Stat": "colddamage", "*ID": "6A637913", "descstrpos": "strModColdDamageRange", "descstrneg": "strModColdDamageRange", "descfunc": 0xF3 }
    },
    // fire-dmg 102
    {
        in: ["firemindam", "firemaxdam"],
        out: { "Stat": "firedamage", "*ID": "6A637911", "descstrpos": "strModFireDamageRange", "descstrneg": "strModFireDamageRange", "descfunc": 0xF3 }
    },
    // magic-dmg 104
    {
        in: ["magicmindam", "magicmaxdam"],
        out: { "Stat": "magicdamage", "*ID": "6A637910", "descstrpos": "strModMagicDamageRange", "descstrneg": "strModMagicDamageRange", "descfunc": 0xF3 }
    },
];

const COMPONENTS = [
    {
        "id": "title",
        "key": "innerHTML",
        "zhCN": "暗黑破坏神 II：重制版 资料頁 2.8",
        "zhTW": "暗黑破壞神 II：獄火重生 資料页 2.8",
        "enUS": "Diablo II: Resurrected Info Browser 2.8"
    },
    {
        "id": "runewords",
        "key": "innerHTML",
        "zhCN": "符文之语",
        "zhTW": "符文之語",
        "enUS": "Runewords"
    },
    {
        "id": "uniqueitems",
        "key": "innerHTML",
        "zhCN": "暗金物品",
        "zhTW": "暗金物品",
        "enUS": "UniqueItems"
    },
    {
        "id": "runewordInput",
        "key": "placeholder",
        "zhCN": "请输入符文之语名称",
        "zhTW": "請輸入符文之語名稱",
        "enUS": "Please enter runeword name"
    },
    {
        "id": "uniqueitemInput",
        "key": "placeholder",
        "zhCN": "请输入道具名称",
        "zhTW": "請輸入道具名稱",
        "enUS": "Please enter uniqueitem name"
    },
    {
        "id": "resetBtn",
        "key": "innerHTML",
        "zhCN": "重置条件",
        "zhTW": "重置條件",
        "enUS": "Reset Conditions"
    },
    {
        "id": "equipmentSlot",
        "key": "innerHTML",
        "zhCN": "装备部位",
        "zhTW": "裝備部位",
        "enUS": "Equipment Slot"
    },
    {
        "id": "weapon",
        "key": "innerHTML",
        "zhCN": "武器",
        "zhTW": "武器",
        "enUS": "Weapone"
    },
    {
        "id": "armor",
        "key": "innerHTML",
        "zhCN": "防具",
        "zhTW": "防具",
        "enUS": "ARMOR"
    },
    {
        "id": "misc",
        "key": "innerHTML",
        "zhCN": "其他",
        "zhTW": "其他",
        "enUS": "MISC"
    },
    {
        "id": "socketCount",
        "key": "innerHTML",
        "zhCN": "凹槽数量",
        "zhTW": "凹槽數量",
        "enUS": "Socket Count"
    },
    {
        "id": "tier",
        "key": "innerHTML",
        "zhCN": "装备阶级",
        "zhTW": "裝備階級",
        "enUS": "Tier"
    },
    {
        "id": "helm",
        "key": "innerText",
        "zhCN": "头盔",
        "zhTW": "頭盔",
        "enUS": "Helmet"
    },
    {
        "id": "phlm",
        "key": "innerText",
        "zhCN": "野蛮人头盔",
        "zhTW": "野蠻人頭盔",
        "enUS": "Barbarian Helm"
    },
    {
        "id": "pelt",
        "key": "innerText",
        "zhCN": "德鲁伊皮帽",
        "zhTW": "德魯伊皮帽",
        "enUS": "Druid Pelt"
    },
    {
        "id": "tors",
        "key": "innerText",
        "zhCN": "盔甲",
        "zhTW": "盔甲",
        "enUS": "Armor"
    },
    {
        "id": "shld",
        "key": "innerText",
        "zhCN": "盾牌",
        "zhTW": "盾牌",
        "enUS": "Shield"
    },
    {
        "id": "shie",
        "key": "innerText",
        "zhCN": "盾牌",
        "zhTW": "盾牌",
        "enUS": "Shield"
    },
    {
        "id": "pala",
        "key": "innerText",
        "zhCN": "圣骑盾",
        "zhTW": "聖騎盾",
        "enUS": "Paladin Shield"
    },
    {
        "id": "ashd",
        "key": "innerText",
        "zhCN": "圣骑盾",
        "zhTW": "聖騎盾",
        "enUS": "Paladin Shield"
    },
    {
        "id": "head",
        "key": "innerText",
        "zhCN": "死灵颅骨",
        "zhTW": "死靈顱骨",
        "enUS": "Voodoo Head"
    },
    {
        "id": "belt",
        "key": "innerText",
        "zhCN": "腰带",
        "zhTW": "腰帶",
        "enUS": "Belt"
    },
    {
        "id": "boot",
        "key": "innerText",
        "zhCN": "鞋子",
        "zhTW": "鞋子",
        "enUS": "Boots"
    },
    {
        "id": "circ",
        "key": "innerText",
        "zhCN": "头饰",
        "zhTW": "頭飾",
        "enUS": "Circlet"
    },
    {
        "id": "glov",
        "key": "innerText",
        "zhCN": "手套",
        "zhTW": "手套",
        "enUS": "Gloves"
    },
    {
        "id": "weap",
        "key": "innerText",
        "zhCN": "武器",
        "zhTW": "武器",
        "enUS": "Weapon"
    },
    {
        "id": "mele",
        "key": "innerText",
        "zhCN": "近战武器",
        "zhTW": "近戰武器",
        "enUS": "Melee Weapon"
    },
    {
        "id": "knif",
        "key": "innerText",
        "zhCN": "匕首",
        "zhTW": "匕首",
        "enUS": "Dagger"
    },
    {
        "id": "swor",
        "key": "innerText",
        "zhCN": "刀剑",
        "zhTW": "刀劍",
        "enUS": "Sword"
    },
    {
        "id": "axe",
        "key": "innerText",
        "zhCN": "斧",
        "zhTW": "斧",
        "enUS": "Axe"
    },
    {
        "id": "club",
        "key": "innerText",
        "zhCN": "短棒",
        "zhTW": "短棒",
        "enUS": "Short Club"
    },
    {
        "id": "mace",
        "key": "innerText",
        "zhCN": "钉锤",
        "zhTW": "釘錘",
        "enUS": "Spiked Mace"
    },
    {
        "id": "hamm",
        "key": "innerText",
        "zhCN": "重锤",
        "zhTW": "重錘",
        "enUS": "War Hammer"
    },
    {
        "id": "pole",
        "key": "innerText",
        "zhCN": "长柄武器",
        "zhTW": "長柄武器",
        "enUS": "Polearm"
    },
    {
        "id": "spea",
        "key": "innerText",
        "zhCN": "长矛",
        "zhTW": "長矛",
        "enUS": "Spear"
    },
    {
        "id": "scep",
        "key": "innerText",
        "zhCN": "权杖",
        "zhTW": "權杖",
        "enUS": "Scepter"
    },
    {
        "id": "wand",
        "key": "innerText",
        "zhCN": "短杖",
        "zhTW": "短杖",
        "enUS": "Short Staff"
    },
    {
        "id": "staf",
        "key": "innerText",
        "zhCN": "法杖",
        "zhTW": "法杖",
        "enUS": "Staff"
    },
    {
        "id": "h2h",
        "key": "innerText",
        "zhCN": "爪/拳刃",
        "zhTW": "爪/拳刃",
        "enUS": "Claw/Blade"
    },
    {
        "id": "miss",
        "key": "innerText",
        "zhCN": "弓/弩",
        "zhTW": "弓/弩",
        "enUS": "Bow/Crossbow"
    },
    {
        "id": "bow",
        "key": "innerText",
        "zhCN": "弓",
        "zhTW": "弓",
        "enUS": "Bow"
    },
    {
        "id": "xbow",
        "key": "innerText",
        "zhCN": "弩",
        "zhTW": "弩",
        "enUS": "Crossbow"
    },
    {
        "id": "jave",
        "key": "innerText",
        "zhCN": "标枪",
        "zhTW": "標槍",
        "enUS": "Javelin"
    },
    {
        "id": "thro",
        "key": "innerText",
        "zhCN": "投掷武器",
        "zhTW": "投擲武器",
        "enUS": "Throwing Weapons"
    },
    {
        "id": "orb",
        "key": "innerText",
        "zhCN": "巫师法球",
        "zhTW": "魔法使法球",
        "enUS": "Sorceress Orb"
    },
    {
        "id": "abow",
        "key": "innerText",
        "zhCN": "亚马逊弓",
        "zhTW": "亞馬遜弓",
        "enUS": "Amazon Bow"
    },
    {
        "id": "ajav",
        "key": "innerText",
        "zhCN": "亚马逊标枪",
        "zhTW": "亞馬遜標槍",
        "enUS": "Amazon Javelin"
    },
    {
        "id": "aspe",
        "key": "innerText",
        "zhCN": "亚马逊长矛",
        "zhTW": "亞馬遜長矛",
        "enUS": "Amazon Spear"
    },
    {
        "id": "rin",
        "key": "innerText",
        "zhCN": "戒指",
        "zhTW": "戒指",
        "enUS": "Ring"
    },
    {
        "id": "amu",
        "key": "innerText",
        "zhCN": "项链",
        "zhTW": "項鏈",
        "enUS": "Amulet"
    },
    {
        "id": "cm",
        "key": "innerText",
        "zhCN": "咒符",
        "zhTW": "咒符",
        "enUS": "Charms"
    },
    {
        "id": "norm",
        "key": "innerText",
        "zhCN": "普通级",
        "zhTW": "普通級",
        "enUS": "Normal"
    },
    {
        "id": "uber",
        "key": "innerText",
        "zhCN": "扩展级",
        "zhTW": "擴展級",
        "enUS": "Exceptional"
    },
    {
        "id": "ultra",
        "key": "innerText",
        "zhCN": "精華級",
        "zhTW": "精華級",
        "enUS": "Elite"
    },
    {
        "id": "S2",
        "key": "innerText",
        "zhCN": "2孔",
        "zhTW": "2孔",
        "enUS": "2 Sockets"
    },
    {
        "id": "S3",
        "key": "innerText",
        "zhCN": "3孔",
        "zhTW": "3孔",
        "enUS": "3 Sockets"
    },
    {
        "id": "S4",
        "key": "innerText",
        "zhCN": "4孔",
        "zhTW": "4孔",
        "enUS": "4 Sockets"
    },
    {
        "id": "S5",
        "key": "innerText",
        "zhCN": "5孔",
        "zhTW": "5孔",
        "enUS": "5 Sockets"
    },
    {
        "id": "S6",
        "key": "innerText",
        "zhCN": "6孔",
        "zhTW": "6孔",
        "enUS": "6 Sockets"
    }
];

const LOGIC = {
    "COUNT_PREFIX": {
        "zhCN": "当前展示",
        "zhTW": "當前展示",
        "enUS": "Showing"
    },
    "COUNT_SUFFIX": {
        "zhCN": "条数据",
        "zhTW": "條數據",
        "enUS": "results"
    },
    "SOCKETS": {
        "zhCN": "凹槽",
        "zhTW": "凹槽",
        "enUS": "Sockets"
    },
    "REQUIRED_LEVEL": {
        "zhCN": "最低需求等级: ",
        "zhTW": "最低需求等級: ",
        "enUS": "required level: "
    },
    "WEAPON": {
        "zhCN": "武器",
        "zhTW": "武器",
        "enUS": "Weapon"
    },
    "HELM": {
        "zhCN": "护甲",
        "zhTW": "護甲",
        "enUS": "Armor"
    },
    "SHIELD": {
        "zhCN": "盾牌",
        "zhTW": "盾牌",
        "enUS": "Shield"
    },
    "SECONDS": {
        "zhCN": "秒",
        "zhTW": "秒",
        "enUS": "sec."
    },
    "REQLVL": {
        "zhCN": "需要等级:",
        "zhTW": "需要等級:",
        "enUS": "RequiredLevel:"
    },
    "REQSTR": {
        "zhCN": "需要力量:",
        "zhTW": "需要力量:",
        "enUS": "RequiredStrength:"
    },
    "REQDEX": {
        "zhCN": "需要敏捷:",
        "zhTW": "需要敏捷:",
        "enUS": "RequiredDexterity:"
    },
    "DURABILITY": {
        "zhCN": "耐久度:",
        "zhTW": "耐久度:",
        "enUS": "Durability:"
    },
    "SPEED": {
        "zhCN": "基础武器速度:",
        "zhTW": "基礎武器速度:",
        "enUS": "WeaponSpeedModifier:"
    },
};

function saveLNG(value) {
    LNG = value;
    saveData("LNG", value);
}

function loadLNG() {
    LNG = loadData("LNG") || LNG;
}