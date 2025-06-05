/**
 * @author jcy
 * @mail 20970736@qq.com
 * @date 2025-5-22
 */

const CONSTANTS = {
    PROPERTIES_STATS_LENGTH: 7,
    GEMS_CODES_LENGTH: 3,
    UNIQUEITEMS_PROPS_LENGTH: 12,
    RUNEWORDS_ITYPE_LENGTH: 6,
    RUNEWORDS_RUNES_LENGTH: 6,
    RUNEWORDS_PROPERTIES_LENGTH: 7,
    PERLEVEL: 8,// (计算等级成长时 /8)
    FRAMES: 25,// 每秒帧数(计算持续时间时 /25)
}

//装备类型
const EQUIPMENT_TYPE = {
    WEAPON: "weapon",
    HELM: "helm",
    SHIELD: "shield"
};

const EQUIPMENT = {
    "weap": { "TYPE": EQUIPMENT_TYPE.WEAPON, "NAME": { "zhCN": "武器", "zhTW": "武器", "enUS": "Weapon" }, "PARENT": null },
    "mele": { "TYPE": EQUIPMENT_TYPE.WEAPON, "NAME": { "zhCN": "近战武器", "zhTW": "近戰武器", "enUS": "Melee Weapon" }, "PARENT": "weap" },
    "helm": { "TYPE": EQUIPMENT_TYPE.HELM, "NAME": { "zhCN": "头盔", "zhTW": "頭盔", "enUS": "Helm" }, "PARENT": null },
    "tors": { "TYPE": EQUIPMENT_TYPE.HELM, "NAME": { "zhCN": "护甲", "zhTW": "護甲", "enUS": "Armor" }, "PARENT": null },
    "shld": { "TYPE": EQUIPMENT_TYPE.SHIELD, "NAME": { "zhCN": "盾牌", "zhTW": "盾牌", "enUS": "Shield" }, "PARENT": null },
    "pala": { "TYPE": EQUIPMENT_TYPE.SHIELD, "NAME": { "zhCN": "圣骑专用盾", "zhTW": "聖騎盾", "enUS": "Paladin Shield" }, "PARENT": "shld" },
    "miss": { "TYPE": EQUIPMENT_TYPE.WEAPON, "NAME": { "zhCN": "远程武器", "zhTW": "弓/弩/亚马逊弓", "enUS": "Missile Weapons" }, "PARENT": "weap" },
    "swor": { "TYPE": EQUIPMENT_TYPE.WEAPON, "NAME": { "zhCN": "剑类", "zhTW": "刀劍", "enUS": "Swords" }, "PARENT": "mele" },
    "knif": { "TYPE": EQUIPMENT_TYPE.WEAPON, "NAME": { "zhCN": "匕首", "zhTW": "匕首", "enUS": "Daggers" }, "PARENT": "mele" },
    "mace": { "TYPE": EQUIPMENT_TYPE.WEAPON, "NAME": { "zhCN": "钉锤", "zhTW": "釘錘", "enUS": "Maces" }, "PARENT": "mele" },
    "hamm": { "TYPE": EQUIPMENT_TYPE.WEAPON, "NAME": { "zhCN": "战锤", "zhTW": "重錘", "enUS": "Hammers" }, "PARENT": "mele" },
    "axe": { "TYPE": EQUIPMENT_TYPE.WEAPON, "NAME": { "zhCN": "斧头", "zhTW": "斧", "enUS": "Axes" }, "PARENT": "mele" },
    "club": { "TYPE": EQUIPMENT_TYPE.WEAPON, "NAME": { "zhCN": "短棒", "zhTW": "短棒", "enUS": "Clubs" }, "PARENT": "mele" },
    "pole": { "TYPE": EQUIPMENT_TYPE.WEAPON, "NAME": { "zhCN": "长柄武器", "zhTW": "長柄武器", "enUS": "Polearms" }, "PARENT": "mele" },
    "spea": { "TYPE": EQUIPMENT_TYPE.WEAPON, "NAME": { "zhCN": "标枪/亚马逊标枪", "zhTW": "長矛/亚马逊长矛", "enUS": "Spears/Amazon Javelins" }, "PARENT": "mele" },
    "h2h": { "TYPE": EQUIPMENT_TYPE.WEAPON, "NAME": { "zhCN": "爪类/拳刃", "zhTW": "爪/拳刃", "enUS": "Claws/Katar" }, "PARENT": "mele" },
    "scep": { "TYPE": EQUIPMENT_TYPE.WEAPON, "NAME": { "zhCN": "权杖", "zhTW": "權杖", "enUS": "Scepters" }, "PARENT": "mele" },
    "wand": { "TYPE": EQUIPMENT_TYPE.WEAPON, "NAME": { "zhCN": "魔杖", "zhTW": "魔杖", "enUS": "Wands" }, "PARENT": "mele" },
    "staf": { "TYPE": EQUIPMENT_TYPE.WEAPON, "NAME": { "zhCN": "法杖", "zhTW": "法杖", "enUS": "Staves" }, "PARENT": "mele" }
}

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
    "Amulet of the Viper",
    "Armor",
    "Class Specific",
    "Constricting Ring",
    "Darkfear",
    "Elite Uniques",
    "Expansion",
    "Giantmaimer",
    "Gore Ripper",
    "Hell Forge Hammer",
    "Horadric Staff",
    "KhalimFlail",
    "Larzuk's Champion",
    "Merman's Speed",
    "Nethercrow",
    "Odium",
    "Rings",
    "Sigurd's Staunch",
    "Staff of Kings",
    "SuperKhalimFlail",
    "Warriv's Warder",
    "Zakarum's Salvation",
];

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
    "jew": ["jew"],

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
        "code": "ethereal",
        "*Enabled": 1,
        "func1": 23,
        "stat1": "item_ethereal",
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
        "Stat": "state",
        "*ID": 98,
        "Send Other": 1,
        "Signed": "",
        "Send Bits": 1,
        "Send Param Bits": 8,
        "UpdateAnimRate": "",
        "Saved": "",
        "CSvSigned": "",
        "CSvBits": "",
        "CSvParam": "",
        "fCallback": 1,
        "fMin": "",
        "MinAccr": "",
        "Encode": "",
        "Add": 415,
        "Multiply": 64,
        "ValShift": "",
        "1.09-Save Bits": 6,
        "1.09-Save Add": 20,
        "Save Bits": 1,
        "Save Add": "",
        "Save Param Bits": 8,
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
        "descpriority": "",
        "descfunc": 0xF0,
        "descval": "",
        "descstrpos": "ModStrF002",
        "descstrneg": "ModStrF002",
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
    {
        "Stat": "item_ethereal",
        "*ID": 10084,
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
        "descpriority": 0,
        "descfunc": 0xF0,
        "descval": "",
        "descstrpos": "strethereal",
        "descstrneg": "strethereal",
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
    },
    {
        "id": 0xF002,
        "Key": "ModStrF002",
        "enUS": "Character Displays Aura Effect",
        "zhTW": "角色显示光环效果",
        "zhCN": "角色顯示光環效果"
    }

];

// 
const STAT_GROUP = [
    //all-res
    {
        in: ["fireresist", "lightresist", "coldresist", "poisonresist"],
        out: { "Stat": "allresist", "*ID": 0xF001, "descstrpos": "strModAllResistances", "descstrneg": "strModAllResistances", "descfunc": 0xF1 }
    },
    //all-attr
    {
        in: ["strength", "energy", "dexterity", "vitality"],
        out: { "Stat": "allattrib", "*ID": 0xF002, "descstrpos": "Moditem2allattrib", "descstrneg": "Moditem2allattrib", "descfunc": 0xF1 }
    },
];

const RANGE_GROUP = [
    {
        in: ["poisonmindam", "poisonmaxdam", "poisonlength"],
        out: { "Stat": "poisondamage", "*ID": 0xF003, "descstrpos": "strModPoisonDamageRange", "descstrneg": "strModPoisonDamageRange", "descfunc": 0xF2 }
    },
    {
        in: ["lightmindam", "lightmaxdam"],
        out: { "Stat": "lightdamage", "*ID": 0xF004, "descstrpos": "strModLightningDamageRange", "descstrneg": "strModLightningDamageRange", "descfunc": 0xF3 }
    },
    {
        in: ["coldmindam", "coldmaxdam", "coldlength"],
        out: { "Stat": "colddamage", "*ID": 0xF005, "descstrpos": "strModColdDamageRange", "descstrneg": "strModColdDamageRange", "descfunc": 0xF3 }
    },
    {
        in: ["firemindam", "firemaxdam"],
        out: { "Stat": "firedamage", "*ID": 0xF006, "descstrpos": "strModFireDamageRange", "descstrneg": "strModFireDamageRange", "descfunc": 0xF3 }
    },
    {
        in: ["magicmindam", "magicmaxdam"],
        out: { "Stat": "magicdamage", "*ID": 0xF007, "descstrpos": "strModMagicDamageRange", "descstrneg": "strModMagicDamageRange", "descfunc": 0xF3 }
    },
    {
        in: ["mindamage", "maxdamage"],
        out: { "Stat": "physicaldamage", "*ID": 0xF008, "descstrpos": "strModMinDamageRange", "descstrneg": "strModMinDamageRange", "descfunc": 0xF3 }
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
        "id": "sets",
        "key": "innerHTML",
        "zhCN": "套装装备",
        "zhTW": "套裝裝備",
        "enUS": "Set Item"
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
        "zhCN": "法珠",
        "zhTW": "法珠",
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
        "enUS": "Charm"
    },
    {
        "id": "jew",
        "key": "innerText",
        "zhCN": "珠宝",
        "zhTW": "珠寶",
        "enUS": "Jewel"
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
    },
    {
        "id": "setclass",
        "key": "innerText",
        "zhCN": "职业套装",
        "zhTW": "職業套裝",
        "enUS": "Class Sets"
    },
    {
        "id": "set2",
        "key": "innerText",
        "zhCN": "两件套",
        "zhTW": "兩件套",
        "enUS": "Two-piece Sets"
    },
    {
        "id": "set3",
        "key": "innerText",
        "zhCN": "三件套",
        "zhTW": "三件套",
        "enUS": "Three-piece Sets"
    },
    {
        "id": "set4",
        "key": "innerText",
        "zhCN": "四件套",
        "zhTW": "四件套",
        "enUS": "Four-piece Sets"
    },
    {
        "id": "set5",
        "key": "innerText",
        "zhCN": "五件套",
        "zhTW": "五件套",
        "enUS": "Five-piece Sets"
    },
    {
        "id": "set6",
        "key": "innerText",
        "zhCN": "六件套",
        "zhTW": "六件套",
        "enUS": "Six-piece Sets"
    },
    {
        "id": "Civerb's Vestments",
        "key": "innerText",
        "zhCN": "希弗伯的法衣",
        "zhTW": "克維雷布的法衣",
        "enUS": "Civerb's Vestments"
    },
    {
        "id": "Hsarus' Defense",
        "key": "innerText",
        "zhCN": "萨鲁斯的防御",
        "zhTW": "海沙魯的鐵禦",
        "enUS": "Hsarus' Defense"
    },
    {
        "id": "Cleglaw's Brace",
        "key": "innerText",
        "zhCN": "克雷格劳的支柱",
        "zhTW": "克雷德勞的防備",
        "enUS": "Cleglaw's Brace"
    },
    {
        "id": "Iratha's Finery",
        "key": "innerText",
        "zhCN": "艾蕾萨的华服",
        "zhTW": "依雷撒的華服",
        "enUS": "Iratha's Finery"
    },
    {
        "id": "Isenhart's Armory",
        "key": "innerText",
        "zhCN": "依森哈特的武器库",
        "zhTW": "依森哈特的軍械",
        "enUS": "Isenhart's Armory"
    },
    {
        "id": "Vidala's Rig",
        "key": "innerText",
        "zhCN": "维达拉的配装",
        "zhTW": "維達拉的配備",
        "enUS": "Vidala's Rig"
    },
    {
        "id": "Milabrega's Regalia",
        "key": "innerText",
        "zhCN": "米拉伯佳的王权",
        "zhTW": "米拉伯佳戰裝",
        "enUS": "Milabrega's Regalia"
    },
    {
        "id": "Cathan's Traps",
        "key": "innerText",
        "zhCN": "卡珊的计谋",
        "zhTW": "卡珊的衣著",
        "enUS": "Cathan's Traps"
    },
    {
        "id": "Tancred's Battlegear",
        "key": "innerText",
        "zhCN": "坦克雷的圣战装",
        "zhTW": "坦克雷的戰裝",
        "enUS": "Tancred's Battlegear"
    },
    {
        "id": "Sigon's Complete Steel",
        "key": "innerText",
        "zhCN": "西刚的全身甲胄",
        "zhTW": "西剛的全套鋼甲",
        "enUS": "Sigon's Complete Steel"
    },
    {
        "id": "Infernal Tools",
        "key": "innerText",
        "zhCN": "地狱工具",
        "zhTW": "煉獄器具",
        "enUS": "Infernal Tools"
    },
    {
        "id": "Berserker's Garb",
        "key": "innerText",
        "zhCN": "狂战士的兵械",
        "zhTW": "狂戰士的武裝",
        "enUS": "Berserker's Garb"
    },
    {
        "id": "Death's Disguise",
        "key": "innerText",
        "zhCN": "死神的伪装",
        "zhTW": "死亡的偽裝",
        "enUS": "Death's Disguise"
    },
    {
        "id": "Angelical Raiment",
        "key": "innerText",
        "zhCN": "天使的装束",
        "zhTW": "天使的衣裝",
        "enUS": "Angelical Raiment"
    },
    {
        "id": "Arctic Gear",
        "key": "innerText",
        "zhCN": "北极装备",
        "zhTW": "北極裝備",
        "enUS": "Arctic Gear"
    },
    {
        "id": "Arcanna's Tricks",
        "key": "innerText",
        "zhCN": "阿卡娜的诡计",
        "zhTW": "阿卡娜的詭計",
        "enUS": "Arcanna's Tricks"
    },
    {
        "id": "Natalya's Odium",
        "key": "innerText",
        "zhCN": "娜塔亚的杀意",
        "zhTW": "娜塔亞的非難",
        "enUS": "Natalya's Odium"
    },
    {
        "id": "Aldur's Watchtower",
        "key": "innerText",
        "zhCN": "艾尔多的警戒塔",
        "zhTW": "艾爾多的守衛",
        "enUS": "Aldur's Watchtower"
    },
    {
        "id": "Immortal King",
        "key": "innerText",
        "zhCN": "不朽之王",
        "zhTW": "不朽之王",
        "enUS": "Immortal King"
    },
    {
        "id": "Tal Rasha's Wrappings",
        "key": "innerText",
        "zhCN": "塔·拉夏的裹尸布",
        "zhTW": "塔拉夏的外袍",
        "enUS": "Tal Rasha's Wrappings"
    },
    {
        "id": "Griswold's Legacy",
        "key": "innerText",
        "zhCN": "格里斯沃尔德的遗产",
        "zhTW": "格里斯瓦德的傳奇",
        "enUS": "Griswold's Legacy"
    },
    {
        "id": "Trang-Oul's Avatar",
        "key": "innerText",
        "zhCN": "塔格奥的化身",
        "zhTW": "塔格奧的化身",
        "enUS": "Trang-Oul's Avatar"
    },
    {
        "id": "M'avina's Battle Hymn",
        "key": "innerText",
        "zhCN": "艾维娜的战斗诗歌",
        "zhTW": "馬維娜之戰鬥詩歌",
        "enUS": "M'avina's Battle Hymn"
    },
    {
        "id": "The Disciple",
        "key": "innerText",
        "zhCN": "门徒",
        "zhTW": "門徒",
        "enUS": "The Disciple"
    },
    {
        "id": "Heaven's Brethren",
        "key": "innerText",
        "zhCN": "天堂同袍",
        "zhTW": "天堂的同胞",
        "enUS": "Heaven's Brethren"
    },
    {
        "id": "Orphan's Call",
        "key": "innerText",
        "zhCN": "孤儿的号令",
        "zhTW": "孤兒的呼喚",
        "enUS": "Orphan's Call"
    },
    {
        "id": "Hwanin's Majesty",
        "key": "innerText",
        "zhCN": "桓因的威严",
        "zhTW": "桓因的威嚴",
        "enUS": "Hwanin's Majesty"
    },
    {
        "id": "Sazabi's Grand Tribute",
        "key": "innerText",
        "zhCN": "圣·沙略的伟大颂词",
        "zhTW": "沙薩比的崇高禮讚",
        "enUS": "Sazabi's Grand Tribute"
    },
    {
        "id": "Bul-Kathos' Children",
        "key": "innerText",
        "zhCN": "布尔凯索的子嗣",
        "zhTW": "布爾凱索的子嗣",
        "enUS": "Bul-Kathos' Children"
    },
    {
        "id": "Cow King's Leathers",
        "key": "innerText",
        "zhCN": "牛魔王之革",
        "zhTW": "牛王皮甲",
        "enUS": "Cow King's Leathers"
    },
    {
        "id": "Naj's Ancient Set",
        "key": "innerText",
        "zhCN": "诺吉的古代遗物",
        "zhTW": "娜吉的上古遺物",
        "enUS": "Naj's Ancient Set"
    },
    {
        "id": "McAuley's Folly",
        "key": "innerText",
        "zhCN": "山德的愚行",
        "zhTW": "山德的愚行",
        "enUS": "McAuley's Folly"
    },
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
    "SMITEDAM": {
        "zhCN": "重击伤害:",
        "zhTW": "重擊傷害:",
        "enUS": "Smite Damage:"
    },
    "KICKDAM": {
        "zhCN": "踢击伤害:",
        "zhTW": "踢擊傷害:",
        "enUS": "Kick Damage:"
    },
};

let LNG = '';
const CHAR_MAP = {};
const GEM_MAP = {};
const ITEMSTATCOST_MAP = {};
const LOCAL_MAP = {};
const MISC_MAP = {};
const PROPERTY_MAP = {};
const SKILL_MAP = {};
const SKILLDESC_MAP = {};

function saveLNG(value) {
    LNG = value;
    saveData("LNG", value);
}

function loadLNG() {
    LNG = loadData("LNG") || LNG;
    if(!LNG)saveLNG('zhTW');
}

function common() {
    
    // CHAR_MAP <0/Amazon/ama, object>
    if(-1 !== EXCEL_CHARSTATS.findIndex(item => item.class === 'Expansion')){
        EXCEL_CHARSTATS.splice(EXCEL_CHARSTATS.findIndex(item => item.class === 'Expansion'), 1);
    }
    if(-1 !== EXCEL_PLAYERCLASS.findIndex(item => item["Player Class"] === 'Expansion')){
        EXCEL_PLAYERCLASS.splice(EXCEL_PLAYERCLASS.findIndex(item => item["Player Class"] === 'Expansion'), 1);
    }
    for (let index = 0; index < EXCEL_CHARSTATS.length; index++) {
        const charstat = EXCEL_CHARSTATS[index];
        if('Expansion' === charstat.class)continue;
        CHAR_MAP[index] = charstat;
        CHAR_MAP[charstat.class] = charstat;
        CHAR_MAP[EXCEL_PLAYERCLASS[index].Code] = charstat;
    }

    // GEM_MAP
    for (const item of EXCEL_GEMS) {
        GEM_MAP[item.code] = item;

        //rune
        if (/^r\d{2}$/.test(item.code)) {
            //IMAGE
            item.IMAGE = `<img src="image/` + item.code + `.png" />`;
            //WEAPON/HELM/SHIELD
            for (const KEY in EQUIPMENT_TYPE) {
                const key = EQUIPMENT_TYPE[KEY];
                item[KEY] = [];
                const gem = GEM_MAP[item.code];
                for (let index = 1; index <= CONSTANTS.GEMS_CODES_LENGTH; index++) {
                    const CODE = {
                        "CODE": gem[`${key}Mod${index}Code`],
                        "PARAM": gem[`${key}Mod${index}Param`],
                        "MIN": gem[`${key}Mod${index}Min`],
                        "MAX": gem[`${key}Mod${index}Max`]
                    };
                    if (CODE.CODE) item[KEY].push(CODE);
                }
            }
        }
    }

    // LOCAL_MAP
    for (const item of [...STRINGS_ITEM_MODIFIERS,
        ...STRINGS_ITEM_NAMES,
        ...STRINGS_ITEM_RUNES,
        ...STRINGS_MONSTERS,
        ...STRINGS_SKILLS,
        ...ITEM_MODIFIERS_EXT]) {
        LOCAL_MAP[item.Key] = item;
    }

    // MISC_MAP
    for (const item of EXCEL_ARMOR) {
        item.CATEGORY = 'ARMOR';
        MISC_MAP[item.code] = item;
    }
    for (const item of EXCEL_WEAPONS) {
        item.CATEGORY = 'WEAPON';
        MISC_MAP[item.code] = item;
    }
    for (const item of EXCEL_MISC) {
        item.CATEGORY = 'MISC';
        MISC_MAP[item.code] = item;
    }

    for (const item of EXCEL_SKILLDESC) {
        SKILLDESC_MAP[item.skilldesc] = item;
    }

    // SKILL_MAP <id/skill/小写连拼/skilldesc object>
    for (const item of EXCEL_SKILLS) {
        item.DESC = SKILLDESC_MAP[item.skilldesc];
        SKILL_MAP[item.skill] = item;
        SKILL_MAP[item[`*Id`]] = item;
        SKILL_MAP[normalizeSkillName(item.skill)] = item;
        SKILL_MAP[item.skilldesc] = item;
    }

    // ITEMSTATCOST_MAP
    for (const item of [...EXCEL_ITEMSTATCOST, ...ITEMSTATCOST_EXT]) {
        ITEMSTATCOST_MAP[item.Stat] = item;
    }

    // PROPERTY_MAP
    for (let item of [...EXCEL_PROPERTIES, ...PROPERTIES_EXT]) {
        item.STATS = [];
        for (let index = 1; index <= CONSTANTS.PROPERTIES_STATS_LENGTH; index++) {
            const STAT = {
                "STAT": item[`stat${index}`],
                "FUNC": item[`func${index}`],
                "SET": item[`set${index}`],
                "VAL": item[`val${index}`]
            };
            if (STAT.STAT) item.STATS.push(STAT);
            delete item[`stat${index}`];
            delete item[`func${index}`];
            delete item[`set${index}`];
            delete item[`val${index}`];
        }
        PROPERTY_MAP[item.code] = item;
    }

}


function format(local, itemstatcost) {
    // itemstatcost = { "CODE": { CODE, PARAM, MIN, MAX }, "STAT": { STAT, FUNC, SET, VAL } };
    const PARAM = itemstatcost.CODE.PARAM;
    const CODE = itemstatcost.CODE.CODE;
    const MIN = itemstatcost.CODE.MIN;
    const MAX = itemstatcost.CODE.MAX
    const STAT = itemstatcost.STAT.STAT;
    const FUNC = itemstatcost.STAT.FUNC;
    const SET = itemstatcost.STAT.SET;
    const VAL = itemstatcost.STAT.VAL;

    switch (itemstatcost.descfunc) {
        case 5: {
            // #14 Dor "%+d%% 機率擊中使怪物逃跑"
            local = local.replace("%+d", MIN * 100 / 128);
            break;
        }
        case 11: {
            local = local.replace(`%d`, 1)
                .replace(`%d`, 100 / PARAM)
                .replace(`%1`, 100 / PARAM)
                .replace(`%0`, 1);
            break;
        }
        case 12: {
            if (MIN > 1) local = `${local}+${MIN}`;
            break;
        }
        case 13: {
            if (CODE === `randclassskill`) {
                local = local.replace(`%+d`, `+${VAL}`);
            } else {
                local = LOCAL_MAP[EXCEL_CHARSTATS[VAL].StrAllSkills][LNG];
                local = local.replace("%+d", MIN < MAX ? `+<span class='range-span'>${MIN}-${MAX}</span>` : `+${MIN}`);
            }
            break;
        }
        case 14: {
            // [Class Skill Tab ID] = (Amazon = 0-2, Sorceress = 3-5, Necromancer = 6-8, Paladin = 9-11, Barbarian = 12-14, Druid = 15-17,  Assassin = 18-20)
            const charIndex = parseInt(PARAM / 3);
            const skillTabSerial = PARAM % 3 + 1;
            const charstat = EXCEL_CHARSTATS[charIndex];
            const key = charstat[`StrSkillTab${skillTabSerial}`];
            const only = charstat["StrClassOnly"];
            local = `${LOCAL_MAP[key][LNG]}<span class='only-span'>${LOCAL_MAP[only][LNG]}</span>`;
            local = local.replace("%+d", MIN < MAX ? `+<span class='range-span'>${MIN}-${MAX}</span>` : `+${MIN}`);
            break;
        }
        case 15: {
            local = local.replace("%d", MIN)
                .replace("%d", MAX)
                .replace("%s", `<span class='skill-span'>${LOCAL_MAP[SKILL_MAP[PARAM].DESC[`str name`]][LNG]}</span>`);
            break;
        }
        case 16: {
            local = local.replace("%d", MIN < MAX ? `<span class='range-span'>${MIN}-${MAX}</span>` : MIN)
                .replace("%s", `<span class='skill-span'>${LOCAL_MAP[SKILL_MAP[PARAM].DESC[`str name`]][LNG]}</span>`);
            break;
        }
        case 17: {
            local = local.replace("%+d", `+${MIN / CONSTANTS.PERLEVEL}`);
            break;
        }
        case 19: {
            if (/att.*?\/lvl/.test(CODE)){
                if (PARAM) {
                    local = local.replace("%+d", `+${PARAM / 2}`)
                        .replace("%d", `+${PARAM / 2}`);
                } else {
                    local = local.replace("%+d", MIN < MAX ? `+<span class='range-span'>${MIN / 2}-${MAX / 2}</span>` : `+${MIN / 2}`)
                        .replace("%d", MIN < MAX ? `<span class='range-span'>${MIN / 2}-${MAX / 2}</span>` : `+${MIN / 2}`);
                }
            } else if (CODE.includes("/lvl")) {
                if (PARAM) {
                    local = local.replace("%+d", `+${PARAM / CONSTANTS.PERLEVEL}`)
                        .replace("%d", `+${PARAM / CONSTANTS.PERLEVEL}`);
                } else {
                    local = local.replace("%+d", MIN < MAX ? `+<span class='range-span'>${MIN / CONSTANTS.PERLEVEL}-${MAX / CONSTANTS.PERLEVEL}</span>` : `+${MIN / CONSTANTS.PERLEVEL}`)
                        .replace("%d", MIN < MAX ? `<span class='range-span'>${MIN / CONSTANTS.PERLEVEL}-${MAX / CONSTANTS.PERLEVEL}</span>` : `+${MIN / CONSTANTS.PERLEVEL}`);
                }
            } else {
                local = local.replace("%+d", MIN < MAX ? `+<span class='range-span'>${MIN}-${MAX}</span>` : `+${MIN}`)
                    .replace("%d", MIN < MAX ? `<span class='range-span'>${MIN}-${MAX}</span>` : `${MIN}`);
            }
            break;
        }
        case 23: {//Faith reanimate
            local = local.replace("%0", MIN < MAX ? `<span class='range-span'>${MIN}-${MAX}</span>` : MIN)
                .replace("%1", LOCAL_MAP[EXCEL_MONSTATS[PARAM].NameStr][LNG]);
            break;
        }
        case 24: {
            const SKILLNAME = LOCAL_MAP[SKILL_MAP[PARAM].DESC[`str name`]][LNG];
            local = local.replace("%d", MAX)
                .replace("%s", `<span class='skill-span'>${SKILLNAME}</span>`)
                .replace("%d/%d", MIN);
            break;
        }
        case 27: {
            if (CODE === 'skill') {
                const SKILL = SKILL_MAP[PARAM];
                const SKILLNAME = LOCAL_MAP[SKILL.DESC[`str name`]][LNG];
                const ONLY = LOCAL_MAP[CHAR_MAP[SKILL.charclass].StrClassOnly][LNG];

                local = local.replace("%+d", MIN < MAX ? `+<span class='range-span'>${MIN}-${MAX}</span>`:`+${MIN}`)
                    .replace("%s", `<span class='skill-span'>${SKILLNAME}</span>`)
                    .replace("%s", `<span class='only-span'>${ONLY}</span>`);
            }
            if (CODE === 'skill-rand') {
                //ormus
                const SKILLS = [];
                for (let index = 61; index <= 65; index++) {
                    SKILLS.push(LOCAL_MAP[SKILL_MAP[index].DESC[`str name`]][LNG]);
                }

                local = LOCAL_MAP[`ModStrF000`][LNG];
                local = local.replace("%+d", `+${PARAM}`)
                    .replace("%s", SKILLS.join("/"));
            }
            break;
        }
        case 28: {
            const SKILLNAME = LOCAL_MAP[SKILL_MAP[PARAM].DESC[`str name`]][LNG];
            local = local.replace("%+d", MIN < MAX ? `+<span class='range-span'>${MIN}-${MAX}</span>` : `+${MIN}`)
                .replace("%s", `<span class='skill-span'>${SKILLNAME}</span>`);
            break;
        }
        case 29: {
            local = local.replace("%d", MIN < MAX ? `<span class='range-span'>${MIN}-${MAX}</span>` : MIN);
            break;
        }
        /** 自定义区 **/
        case 0xF0: {
            // 无参数 [ethereal, state]
            break;
        }
        case 0xF1: {//所有属性/抗性
            local = local.replace(`%+d`, MIN < MAX ? `+<span class='range-span'>${MIN}-${MAX}</span>` : `+${MIN}`);
            break;
        }
        case 0xF2: {//毒伤
            // itemstatcost = { "CODE": { CODE, PARAM, MIN, MAX }, "STAT": { STAT, FUNC, SET, VAL } };
            const MINMIN = itemstatcost.MIN.CODE.MIN;
            const MINMAX = itemstatcost.MIN.CODE.MAX;
            const MINCODE = itemstatcost.MIN.CODE.CODE;

            const MAXMIN = itemstatcost.MAX.CODE.MIN;
            const MAXMAX = itemstatcost.MAX.CODE.MAX;
            const MAXCODE = itemstatcost.MAX.CODE.CODE;

            const LENPARAM = itemstatcost.LEN.CODE.PARAM;
            const LENMIN = itemstatcost.LEN.CODE.MIN; 
            const LENMAX = itemstatcost.LEN.CODE.MAX;

            let MIN = (MINMIN + MINMAX) / 2;
            let MAX = (MAXMIN + MAXMAX) / 2;
            let LEN = ((LENPARAM || LENMIN) + (LENPARAM || LENMAX)) / 2;
            let SEC = LEN / CONSTANTS.FRAMES;

            if (MIN === MAX) {
                local = local.replace(/%d.*?%d/, Math.round((MIN + MAX) / 2 * LEN / 256)).replace("%d", SEC);
            } else {
                local = local.replace(`%d`, Math.round(MIN * LEN / 256)).replace(`%d`, Math.round(MAX * LEN / 256)).replace("%d", SEC);
            }
            break;
        }
        case 0xF3: {//电/冰/火/魔/物伤
            const MINMIN = itemstatcost.MIN.CODE.MIN;
            const MINMAX = itemstatcost.MIN.CODE.MAX;
            const MINCODE = itemstatcost.MIN.CODE.CODE;

            const MAXMIN = itemstatcost.MAX.CODE.MIN;
            const MAXMAX = itemstatcost.MAX.CODE.MAX;
            const MAXCODE = itemstatcost.MAX.CODE.CODE;

            if (MINCODE === MAXCODE) {
                if (MINMIN === MAXMAX) {
                    local = local.replace(/%d.*?%d/, MINMIN);
                } else {
                    local = local.replace(`%d`, MINMIN).replace(`%d`, MAXMAX);
                }
            } else {
                local = local.replace(`%d`, MINMIN === MINMAX ? MINMIN : `<span class='range-span'>${MINMIN}-${MINMAX}</span>`)
                    .replace(`%d`, MAXMIN === MAXMAX ? MAXMIN : `<span class='range-span'>${MAXMIN}-${MAXMAX}</span>`);
            }
            break;
        }
        case 0xFF: {//依赖descline渲染

            const skill = SKILL_MAP[PARAM];
            const skilldesc = skill.DESC;
            const key = skilldesc[`item proc text`];
            let count = skilldesc[`item proc descline count`];

            const templet = LOCAL_MAP[key][LNG];
            const array = templet.split(`\n`);

            for (let index = 0; index < array.length; index++) {
                let line = array[index];
                if (index === array.length - 1) {
                    line = line.replace(`%s`, [skill.auralencalc / CONSTANTS.FRAMES, LOGIC.SECONDS[LNG]].join(` `));
                } else {
                    const descline = skilldesc[`descline${index}`];
                    if (descline) {
                        desctexta = skilldesc[`desctexta${index}`];
                        desccalca = skilldesc[`desccalca${index}`];
                        line = line.replace(`%s`, LOCAL_MAP[desctexta][LNG]
                            .replace(`%+d`, `+` + skill[desccalca.replace(`par`, `Param`)])
                            .replace(`%d`, skill[desccalca.replace(`par`, `Param`)])
                            .replace(`%s`, skill[desccalca.replace(`par`, `Param`)])
                            .replace(`%%`, `%`));
                    }
                }
                array[index] = line;
            }
            local = array.reverse().join(`<BR>`);
            break;
        }
        default:
            console.log(`desc.descfunc = ${descfunc} 未定义渲染方式`);
            alert(`desc.descfunc = ${descfunc} 未定义渲染方式`);
            break;

    }

    local = local.replace("%%", "%").replace("+-", "-");
    if(itemstatcost.descstr2){
        local = local + LOCAL_MAP[itemstatcost.descstr2][LNG];
    }

    return local;
}