/* ================================
JTTH HELPERS
================================ */

var jtth_int = function(value) {
    var number = parseInt(value, 10);
    return isNaN(number) ? 0 : number;
};

var jtth_float = function(value) {
    var number = parseFloat(value);
    return isNaN(number) ? 0 : number;
};

var jtth_clean_number = function(value) {
    var rounded = Math.round(value);
    return "" + rounded;
};

var jtth_normalise_text = function(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

var jtth_normalise_key = function(value) {
    return jtth_normalise_text(value).replace(/\s+/g, "_");
};

var jtth_signed_number = function(text) {
    var match = String(text || "").match(/[+-]?\s*\d+/);
    if (!match) { return 0; }
    return jtth_int(match[0].replace(/\s+/g, ""));
};

var jtth_repeating_sum = function(section, value_attr, callback) {
    getSectionIDs(section, function(ids) {
        var fields = [];
        _.each(ids, function(id) { fields.push(section + "_" + id + "_" + value_attr); });
        getAttrs(fields, function(attrs) {
            var total = 0;
            _.each(ids, function(id) { total += jtth_float(attrs[section + "_" + id + "_" + value_attr]); });
            callback(total);
        });
    });
};

var JTTH_HP_REALM_BONUSES = {
    "Qi Gathering": { "Early": 1, "Mid": 2, "Late": 3, "Peak": 4 },
    "Foundation": { "Early": 7, "Mid": 9, "Late": 11, "Peak": 13 },
    "Core Formation": { "Early": 22, "Mid": 28, "Late": 34, "Peak": 40 },
    "Martial Soul": { "Early": 85, "Mid": 115, "Late": 145, "Peak": 175 },
    "God Ascendance": { "Early": 400, "Mid": 550, "Late": 700, "Peak": 850 }
};

var JTTH_HP_REALM_ORDER = [
    { major: "Qi Gathering", minor: "Early" },
    { major: "Qi Gathering", minor: "Mid" },
    { major: "Qi Gathering", minor: "Late" },
    { major: "Qi Gathering", minor: "Peak" },
    { major: "Foundation", minor: "Early" },
    { major: "Foundation", minor: "Mid" },
    { major: "Foundation", minor: "Late" },
    { major: "Foundation", minor: "Peak" },
    { major: "Core Formation", minor: "Early" },
    { major: "Core Formation", minor: "Mid" },
    { major: "Core Formation", minor: "Late" },
    { major: "Core Formation", minor: "Peak" },
    { major: "Martial Soul", minor: "Early" },
    { major: "Martial Soul", minor: "Mid" },
    { major: "Martial Soul", minor: "Late" },
    { major: "Martial Soul", minor: "Peak" },
    { major: "God Ascendance", minor: "Early" },
    { major: "God Ascendance", minor: "Mid" },
    { major: "God Ascendance", minor: "Late" },
    { major: "God Ascendance", minor: "Peak" }
];

var jtth_hp_realm_bonus = function(major, minor) {
    return JTTH_HP_REALM_BONUSES[major] && JTTH_HP_REALM_BONUSES[major][minor] ? JTTH_HP_REALM_BONUSES[major][minor] : 0;
};

var jtth_hp_realm_label = function(major, minor) {
    if (!major || major === "Mortal") { return "Mortal"; }
    return (minor && minor !== "-" ? minor + " " : "") + major;
};

var jtth_hp_next_realm = function(major, minor) {
    var current_index = -1;
    _.each(JTTH_HP_REALM_ORDER, function(realm, index) {
        if (realm.major === major && realm.minor === minor) { current_index = index; }
    });
    return current_index >= 0 && current_index + 1 < JTTH_HP_REALM_ORDER.length ? JTTH_HP_REALM_ORDER[current_index + 1] : null;
};

var jtth_hp_percent_value = function(value) {
    var amount = jtth_float(value);
    if (Math.abs(amount) > 1) { amount = amount / 100; }
    return amount;
};

var jtth_hp_dice_parts = function(value) {
    var text = String(value || "").replace(/\s+/g, "");
    var match = text.match(/(\d*)d(\d+)/i);
    var matches = text.match(/[+-]\d+(?:\.\d+)?/g);
    var flat = 0;
    _.each(matches || [], function(part) { flat += jtth_float(part); });
    if (!match) { return { count: 0, sides: 0, flat: jtth_float(text) }; }
    return { count: match[1] ? jtth_int(match[1]) : 1, sides: jtth_int(match[2]), flat: flat };
};

var jtth_hp_dice_flat = function(value) {
    return jtth_hp_dice_parts(value).flat;
};

var jtth_hp_signed_flat = function(value) {
    if (!value) { return ""; }
    return value > 0 ? "+" + jtth_clean_number(value) : jtth_clean_number(value);
};

var jtth_hp_roll_expr = function(hp_die, multiplier, include_flat) {
    var dice = jtth_hp_dice_parts(hp_die);
    var count = dice.count * Math.max(0, multiplier);
    var expr = count && dice.sides ? jtth_clean_number(count) + "d" + jtth_clean_number(dice.sides) : "0";
    if (include_flat) { expr += jtth_hp_signed_flat(dice.flat); }
    return expr;
};

var jtth_hp_average = function(hp_die, multiplier, include_flat) {
    var dice = jtth_hp_dice_parts(hp_die);
    var total = dice.count * Math.max(0, multiplier) * ((dice.sides + 1) / 2);
    if (include_flat) { total += dice.flat; }
    return Math.floor(total);
};

/* ================================
ATTRIBUTE TOTALS
================================ */

var JTTH_ATTRIBUTES = ["power", "agility", "vitality", "cultivation", "qicontrol", "mental"];

var jtth_stat_value = function(attr_name, attrs) {
    var total = jtth_int(attrs[attr_name]);
    var base = jtth_int(attrs[attr_name + "_base"]);
    var bonus = jtth_int(attrs[attr_name + "_bonus"]);
    var global_bonus = jtth_int(attrs.global_attribute_bonus);
    if (total !== 0) { return total; }
    return base + bonus + global_bonus;
};

var jtth_modifier_value = function(modifier_text) {
    var match = String(modifier_text || "").match(/[+-]?\s*\d+/);
    if (!match) { return 0; }
    return jtth_int(match[0].replace(/\s+/g, ""));
};

var jtth_inventory_attribute_mods = function(attr_name, inventory_ids, attrs) {
    var result = { flat: 0, floor: 0 };
    var attr_key = jtth_normalise_key(attr_name);
    _.each(inventory_ids, function(id) {
        var equipped = attrs["repeating_inventory_" + id + "_equipped"];
        var modifiers = attrs["repeating_inventory_" + id + "_itemmodifiers"];
        if (equipped !== "1" || !modifiers) { return; }
        _.each(modifiers.split(","), function(modifier) {
            var text = String(modifier || "");
            var key = jtth_normalise_key(text);
            if (key.indexOf(attr_key) === -1) { return; }
            if (text.indexOf(":") !== -1) {
                result.floor = Math.max(result.floor, Math.abs(jtth_modifier_value(text)));
            } else {
                result.flat += jtth_modifier_value(text);
            }
        });
    });
    return result;
};

var update_attributes = function(callback) {
    getSectionIDs("repeating_inventory", function(inventory_ids) {
        var fields = ["global_attribute_bonus"];
        _.each(JTTH_ATTRIBUTES, function(attr) {
            fields.push(attr + "_base");
            fields.push(attr + "_bonus");
        });
        _.each(inventory_ids, function(id) {
            fields.push("repeating_inventory_" + id + "_equipped");
            fields.push("repeating_inventory_" + id + "_itemmodifiers");
        });
        getAttrs(fields, function(attrs) {
            var updates = {};
            var global_bonus = jtth_int(attrs.global_attribute_bonus);
            _.each(JTTH_ATTRIBUTES, function(attr) {
                var base = jtth_int(attrs[attr + "_base"]);
                var item_mods = jtth_inventory_attribute_mods(attr, inventory_ids, attrs);
                updates[attr + "_flag"] = (jtth_int(attrs[attr + "_bonus"]) !== 0 || global_bonus !== 0 || item_mods.flat !== 0 || item_mods.floor > base) ? "1" : "0";
                updates[attr] = Math.max(base, item_mods.floor) + jtth_int(attrs[attr + "_bonus"]) + item_mods.flat + global_bonus;
            });
            setAttrs(updates, { silent: true }, function() {
                if (typeof callback === "function") { callback(); }
            });
        });
    });
};

/* ================================
SKILLS
================================ */

var JTTH_SKILLS = {
    acrobatics: { label: "Acrobatics", dice: [{ attr: "agility", scale: 1 }] },
    athletics: { label: "Athletics", dice: [{ attr: "power", scale: 1 }] },
    deceit: { label: "Deceit", dice: [{ attr: "mental", scale: 1 }, { attr: "appearance", scale: 1 }] },
    discretion: { label: "Discretion", dice: [{ attr: "agility", scale: 1 }] },
    disguise: { label: "Disguise", dice: [{ attr: "mental", scale: 1 }, { attr: "appearance", scale: 1 }] },
    fine_arts: { label: "Fine Arts", dice: [{ attr: "agility", scale: 0.5 }, { attr: "mental", scale: 0.5 }] },
    forgery: { label: "Forgery", dice: [{ attr: "agility", scale: 0.5 }, { attr: "mental", scale: 0.5 }] },
    grapple: { label: "Grapple", dice: [{ attr: "power", scale: 1 }] },
    history: { label: "History", dice: [{ attr: "qicontrol", scale: 0.5 }, { attr: "mental", scale: 0.5 }] },
    intuition: { label: "Intuition", dice: [{ attr: "mental", scale: 1 }] },
    intimidation: { label: "Intimidation", dice: [{ attr: "power", scale: 1 }, { attr: "appearance", scale: 1 }] },
    investigation: { label: "Investigation", dice: [{ attr: "mental", scale: 1 }] },
    medicine: { label: "Medicine", dice: [{ attr: "qicontrol", scale: 0.5 }, { attr: "mental", scale: 0.5 }] },
    navigation: { label: "Navigation", dice: [{ attr: "agility", scale: 0.5 }, { attr: "mental", scale: 0.5 }] },
    perception: { label: "Perception", dice: [{ attr: "mental", scale: 1 }] },
    performance: { label: "Performance", dice: [{ attr: "agility", scale: 1 }, { attr: "appearance", scale: 1 }] },
    persuade: { label: "Persuade", dice: [{ attr: "mental", scale: 1 }, { attr: "appearance", scale: 1 }] },
    seduce: { label: "Seduce", dice: [{ attr: "mental", scale: 1 }, { attr: "appearance", scale: 1 }] },
    stealth: { label: "Stealth", dice: [{ attr: "agility", scale: 1 }] },
    survival: { label: "Survival", dice: [{ attr: "power", scale: 0.5 }, { attr: "mental", scale: 0.5 }] }
};
var JTTH_SKILL_NAMES = ["acrobatics","athletics","deceit","discretion","disguise","fine_arts","forgery","grapple","history","intuition","intimidation","investigation","medicine","navigation","perception","performance","persuade","seduce","stealth","survival"];
var JTTH_SKILL_ATTRIBUTES = ["power", "agility", "vitality", "cultivation", "qicontrol", "mental", "appearance"];

var jtth_skill_value = function(attr_name, attrs) {
    var total = jtth_int(attrs[attr_name]);
    var base = jtth_int(attrs[attr_name + "_base"]);
    var bonus = jtth_int(attrs[attr_name + "_bonus"]);
    var global_bonus = jtth_int(attrs.global_attribute_bonus);
    if (total !== 0) { return total; }
    if (typeof attrs[attr_name + "_base"] !== "undefined") { return base + bonus + global_bonus; }
    return 0;
};

var jtth_format_skill = function(dice, bonus) {
    if (bonus > 0) { return dice + "d6+" + bonus; }
    if (bonus < 0) { return dice + "d6" + bonus; }
    return dice + "d6";
};

var jtth_modifier_applies_to_skill = function(modifier_text, skill_name) {
    var modifier_key = jtth_normalise_key(modifier_text);
    var skill_key = jtth_normalise_key(skill_name);
    var skill_label_key = jtth_normalise_key(JTTH_SKILLS[skill_name].label);
    return modifier_key.indexOf(skill_key) !== -1 || modifier_key.indexOf(skill_label_key) !== -1 || modifier_key.indexOf("skill_checks") !== -1 || modifier_key.indexOf("skills") !== -1;
};

var jtth_skill_dice = function(skill_name, attrs) {
    var total = 0;
    _.each(JTTH_SKILLS[skill_name].dice, function(part) { total += Math.floor(jtth_skill_value(part.attr, attrs) * part.scale); });
    return total;
};

var jtth_inventory_skill_bonus = function(skill_name, inventory_ids, attrs) {
    var total = 0;
    _.each(inventory_ids, function(id) {
        var equipped = attrs["repeating_inventory_" + id + "_equipped"];
        var modifiers = attrs["repeating_inventory_" + id + "_itemmodifiers"];
        if (equipped !== "1" || !modifiers) { return; }
        _.each(modifiers.split(","), function(modifier) {
            if (jtth_modifier_applies_to_skill(modifier, skill_name)) { total += jtth_signed_number(modifier); }
        });
    });
    return total;
};

var update_skills = function() {
    getSectionIDs("repeating_inventory", function(inventory_ids) {
        var fields = ["global_attribute_bonus"];
        _.each(JTTH_SKILL_ATTRIBUTES, function(attr) { fields.push(attr); fields.push(attr + "_base"); fields.push(attr + "_bonus"); });
        _.each(JTTH_SKILL_NAMES, function(skill_name) { fields.push(skill_name + "_flat"); });
        _.each(inventory_ids, function(id) { fields.push("repeating_inventory_" + id + "_equipped"); fields.push("repeating_inventory_" + id + "_itemmodifiers"); });
        getAttrs(fields, function(attrs) {
            var updates = {};
            _.each(JTTH_SKILL_NAMES, function(skill_name) {
                var dice = jtth_skill_dice(skill_name, attrs);
                var total_bonus = jtth_int(attrs[skill_name + "_flat"]) + jtth_inventory_skill_bonus(skill_name, inventory_ids, attrs);
                updates[skill_name + "_roll"] = dice;
                updates[skill_name + "_bonus"] = total_bonus;
                updates[skill_name] = jtth_format_skill(dice, total_bonus);
            });
            setAttrs(updates, { silent: true });
        });
    });
};

/* ================================
INITIATIVE AND DC VALUES
================================ */

var JTTH_REALM_DC_LEVELS = { "Mortal": 0, "Qi Gathering": 1, "Foundation": 2, "Core Formation": 3, "Martial Soul": 4, "God Ascendance": 5};
var jtth_dc_level = function(attrs) {
    var ctype = attrs.ctype || "m";
    var realm = attrs.major_realm || "Mortal";
    if (ctype === "m") { return jtth_int(attrs["mortal-level"]); }
    return JTTH_REALM_DC_LEVELS[realm] || 0;
};

var update_initiative = function() {
    getAttrs(["agility", "agility_base", "agility_bonus", "global_attribute_bonus"], function(attrs) {
        setAttrs({ "initiative": jtth_clean_number(jtth_stat_value("agility", attrs)) }, { silent: true });
    });
};

var update_dcs = function() {
    var fields = ["ctype", "major_realm", "mortal-level", "global_attribute_bonus", "global_dc_bonus", "qi_control_dc_bonus", "mental_strength_bonus"];
    _.each(JTTH_ATTRIBUTES, function(attr) { fields.push(attr); fields.push(attr + "_base"); fields.push(attr + "_bonus"); fields.push(attr + "_dc_bonus"); });
    getAttrs(fields, function(attrs) {
        var updates = {};
        var level = jtth_dc_level(attrs);
        var scale = 3.2;
        var global_dc_bonus = jtth_int(attrs.global_dc_bonus);
        _.each(JTTH_ATTRIBUTES, function(attr) {
            var dc_bonus = jtth_int(attrs[attr + "_dc_bonus"]);
            if (attr === "qicontrol" && dc_bonus === 0) { dc_bonus = jtth_int(attrs.qi_control_dc_bonus); }
            if (attr === "mental" && dc_bonus === 0) { dc_bonus = jtth_int(attrs.mental_strength_bonus); }
            updates[attr + "_dc"] = jtth_clean_number((jtth_stat_value(attr, attrs) * scale) + dc_bonus + global_dc_bonus);
        });
        updates.dc_level = jtth_clean_number(level);
        setAttrs(updates, { silent: true });
    });
};

/* ================================
DEFENCE AND ACTION POINT VALUES
================================ */

var JTTH_REALM_DEFENSE_BASES = { "Mortal": 0, "Qi Gathering": 10, "Foundation": 15, "Core Formation": 30, "Martial Soul": 60, "God Ascendance": 120 };
var JTTH_DURABILITY_SOFT_CAPS = { "Qi Gathering": 30, "Foundation": 45, "Core Formation": 90, "Martial Soul": 180, "God Ascendance": 360 };
var JTTH_AP_MAJOR_REALM_BASES = { "Mortal": 4, "Qi Gathering": 4, "Foundation": 6, "Core Formation": 8, "Martial Soul": 10, "God Ascendance": 12 };
var JTTH_QI_REALM_BASES = {
    "Qi Gathering": { "Early": 10, "Mid": 20, "Late": 30, "Peak": 50 },
    "Foundation": { "Early": 150, "Mid": 200, "Late": 300, "Peak": 425 },
    "Core Formation": { "Early": 2000, "Mid": 3500, "Late": 6500, "Peak": 10000 },
    "Martial Soul": { "Early": 90000, "Mid": 180000, "Late": 250000, "Peak": 400000 }
};
var JTTH_QI_DAO_MULTIPLIERS = { elemental: 1.3, generalist: 1.15, martial: 1, body_refiner: 0.75 };
var jtth_realm_base = function(realm) { return JTTH_REALM_DEFENSE_BASES[realm] || 0; };
var jtth_ap_major_realm_base = function(realm) { return JTTH_AP_MAJOR_REALM_BASES[realm] || 4; };
var jtth_qi_realm_base = function(major, minor) {
    var realm = JTTH_QI_REALM_BASES[major] || {};
    return realm[minor] || 0;
};
var jtth_qi_percent_bonus = function(value) {
    var text = String(value || "").trim();
    if (!text) { return 0; }
    var number = parseFloat(text.replace(/%/g, ""));
    if (isNaN(number)) { return 0; }
    if (text.indexOf("%") !== -1 || Math.abs(number) > 1) { return number / 100; }
    return number;
};
var jtth_qi_regen_amount = function(value, max_qi) {
    var text = String(value || "").trim();
    if (!text) { return 0; }
    var number = parseFloat(text.replace(/%/g, ""));
    if (isNaN(number)) { return 0; }
    return text.indexOf("%") !== -1 ? max_qi * (number / 100) : number;
};
var jtth_durability_soft_cap = function(bonus_total, realm) {
    var cap = JTTH_DURABILITY_SOFT_CAPS[realm];
    if (!cap || bonus_total <= cap) { return bonus_total; }
    return cap + ((bonus_total - cap) / 2);
};

var update_evasion = function() {
    jtth_repeating_sum("repeating_evasionsource", "evasion_value", function(evasion_bonus) {
        getAttrs(["major_realm", "agility", "agility_base", "agility_bonus", "global_attribute_bonus"], function(attrs) {
            var realm_base = jtth_realm_base(attrs.major_realm || "Mortal");
            var agility_bonus = jtth_stat_value("agility", attrs) * 1.2;
            setAttrs({ "evasion-realm-base": jtth_clean_number(realm_base), "evasion-agility-value": jtth_clean_number(agility_bonus), "evasion-bonus-total": jtth_clean_number(evasion_bonus), "evasion-full": jtth_clean_number(realm_base + agility_bonus + evasion_bonus) }, { silent: true });
        });
    });
};

var update_durability = function() {
    jtth_repeating_sum("repeating_durabilitysource", "durability_value", function(durability_bonus) {
        getAttrs(["major_realm", "vitality", "vitality_base", "vitality_bonus", "global_attribute_bonus"], function(attrs) {
            var realm = attrs.major_realm || "Mortal";
            var realm_base = jtth_realm_base(realm);
            var vitality_bonus = Math.floor(jtth_stat_value("vitality", attrs) / 50) * 10;
            var uncapped_bonus_total = durability_bonus + vitality_bonus;
            var capped_bonus = jtth_durability_soft_cap(uncapped_bonus_total, realm);
            setAttrs({ "durability-realm-base": jtth_clean_number(realm_base), "durability-vitality-bonus": jtth_clean_number(vitality_bonus), "durability-user-bonus-total": jtth_clean_number(durability_bonus), "durability-bonus-total": jtth_clean_number(uncapped_bonus_total), "durability-capped-bonus": jtth_clean_number(capped_bonus), "durability-softcap": jtth_clean_number(JTTH_DURABILITY_SOFT_CAPS[realm] || 0), "durability-full": jtth_clean_number(realm_base + capped_bonus) }, { silent: true });
        });
    });
};

var update_reduction = function() {
    jtth_repeating_sum("repeating_reductionsource", "reduction_value", function(reduction_bonus) { setAttrs({ "reduction-full": jtth_clean_number(reduction_bonus) }, { silent: true }); });
};

var JTTH_BEAST_PART_RATIOS = {
    average: { break: 0.4, sever: 0.2 },
    high: { break: 0.6, sever: 0.3 },
    peak: { break: 0.8, sever: 0.4 }
};

var update_beast_parts = function() {
    getSectionIDs("repeating_beastparts", function(part_ids) {
        var fields = ["hp_max"];
        _.each(part_ids, function(id) { fields.push("repeating_beastparts_" + id + "_part_quality"); });
        getAttrs(fields, function(attrs) {
            var hp_max = jtth_float(attrs.hp_max);
            var updates = {};
            _.each(part_ids, function(id) {
                var prefix = "repeating_beastparts_" + id + "_";
                var quality = jtth_normalise_key(attrs[prefix + "part_quality"] || "average");
                var ratios = JTTH_BEAST_PART_RATIOS[quality] || JTTH_BEAST_PART_RATIOS.average;
                updates[prefix + "part_break"] = jtth_clean_number(hp_max * ratios.break);
                updates[prefix + "part_sever"] = jtth_clean_number(hp_max * ratios.sever);
            });
            setAttrs(updates, { silent: true });
        });
    });
};

var update_action_points = function() {
    getAttrs(["major_realm", "agility", "agility_base", "agility_bonus", "global_attribute_bonus"], function(attrs) {
        var agility = jtth_stat_value("agility", attrs);
        var major_realm = attrs.major_realm || "Mortal";
        var major_realm_base = JTTH_AP_MAJOR_REALM_BASES[major_realm] || 4;
        var agility_scale = Math.floor(agility / 15);
        var agility_ap_bonus = major_realm === "Mortal" ? 0 : Math.min(agility_scale, major_realm_base);
        var max_ap = major_realm_base + agility_ap_bonus;
        setAttrs({ "ap-base": "4", "ap-major-realm-base": jtth_clean_number(major_realm_base), "ap-agility-scale": jtth_clean_number(agility_ap_bonus), "ap-agility-regen-bonus": "0", "ap-max": jtth_clean_number(max_ap), "ap-regen": jtth_clean_number(major_realm_base) }, { silent: true });
    });
};

var update_qi_reserves = function() {
    getSectionIDs("repeating_qimodifier", function(mod_ids) {
        var fields = ["major_realm", "minor_realm", "qi_dao_group", "qi_regen_value"];
        _.each(mod_ids, function(id) {
            var prefix = "repeating_qimodifier_" + id + "_";
            fields.push(prefix + "qi_modifier_active");
            fields.push(prefix + "qi_modifier_type");
            fields.push(prefix + "qi_modifier_value");
        });
        getAttrs(fields, function(attrs) {
            var realm_base = jtth_qi_realm_base(attrs.major_realm || "Mortal", attrs.minor_realm || "-");
            var dao_multiplier = JTTH_QI_DAO_MULTIPLIERS[attrs.qi_dao_group || "martial"] || 1;
            var dao_base = realm_base * dao_multiplier;
            var percent_total = 1;
            var flat_total = 0;
            _.each(mod_ids, function(id) {
                var prefix = "repeating_qimodifier_" + id + "_";
                if (attrs[prefix + "qi_modifier_active"] === "0") { return; }
                var value = attrs[prefix + "qi_modifier_value"];
                if ((attrs[prefix + "qi_modifier_type"] || "flat") === "percent") {
                    percent_total += jtth_qi_percent_bonus(value);
                } else {
                    flat_total += jtth_float(value);
                }
            });
            var percent_multiplier = percent_total === 0 ? 1 : percent_total;
            var max_qi = Math.max(0, Math.floor((dao_base * percent_multiplier) + flat_total));
            setAttrs({
                "qi-realm-base": jtth_clean_number(realm_base),
                "qi-dao-base": jtth_clean_number(dao_base),
                "qi-percent-total": jtth_clean_number(percent_total * 100) + "%",
                "qi-flat-total": jtth_clean_number(flat_total),
                "qi-max": jtth_clean_number(max_qi),
                "qi-deprivation": jtth_clean_number(max_qi * 0.05),
                "qi-regen-calculated": jtth_clean_number(jtth_qi_regen_amount(attrs.qi_regen_value, max_qi))
            }, { silent: true });
        });
    });
};

var apply_qi_regen = function() {
    getAttrs(["qi_current", "qi-max", "qi_regen_value"], function(attrs) {
        var max_qi = jtth_float(attrs["qi-max"]);
        var current_qi = jtth_float(attrs.qi_current);
        var regen = jtth_qi_regen_amount(attrs.qi_regen_value, max_qi);
        var next_qi = Math.min(max_qi, current_qi + regen);
        setAttrs({ qi_current: jtth_clean_number(next_qi) }, { silent: true });
    });
};

/* ================================
INVENTORY WEIGHT AND SLOTS
================================ */

var jtth_round_weight = function(value) {
    return Math.round(value * 100) / 100;
};

var jtth_apply_inventory_modifier = function(base, modifier) {
    var text = String(modifier || "").trim().toLowerCase();
    if (!text) { return base; }
    var operator = text.charAt(0);
    var raw_value = text.substring(1);
    var amount = jtth_float(raw_value);
    if (isNaN(amount)) { amount = 0; }
    if (operator === "*" || operator === "x") { return base * amount; }
    if (operator === "/") { return amount ? base / amount : base; }
    if (operator === "+") { return base + amount; }
    if (operator === "-") { return base - amount; }
    amount = jtth_float(text);
    return amount ? base + amount : base;
};

var update_health = function(callback) {
    getSectionIDs("repeating_hpmod", function(hpmod_ids) {
        var fields = [
            "hp_auto_flag", "hp_die", "hp_rolled", "hp_bloodline_bonus", "major_realm", "minor_realm",
            "vitality", "vitality_base", "vitality_bonus", "global_attribute_bonus"
        ];
        _.each(hpmod_ids, function(id) {
            fields.push("repeating_hpmod_" + id + "_hp_mod_active");
            fields.push("repeating_hpmod_" + id + "_hp_mod_value");
            fields.push("repeating_hpmod_" + id + "_hp_mod_type");
        });
        getAttrs(fields, function(attrs) {
            var major = attrs.major_realm || "";
            var minor = attrs.minor_realm || "";
            var realm_bonus = jtth_hp_realm_bonus(major, minor);
            var next_realm = jtth_hp_next_realm(major, minor);
            var next_realm_bonus = next_realm ? jtth_hp_realm_bonus(next_realm.major, next_realm.minor) : realm_bonus;
            var next_gain_bonus = Math.max(0, next_realm_bonus - realm_bonus);
            var current_roll_expr = jtth_hp_roll_expr(attrs.hp_die, realm_bonus, false);
            var next_roll_expr = jtth_hp_roll_expr(attrs.hp_die, next_gain_bonus, false);
            var vitality = jtth_stat_value("vitality", attrs);
            var bloodline_total = jtth_float(attrs.hp_bloodline_bonus) * realm_bonus;
            var vitality_total = vitality * realm_bonus;
            var flat_total = 0;
            var vitality_percent = Math.floor(vitality / 50) * 0.05;
            var mod_percent_total = 0;

            _.each(hpmod_ids, function(id) {
                var prefix = "repeating_hpmod_" + id + "_";
                if (attrs[prefix + "hp_mod_active"] === "0") { return; }
                var value = jtth_float(attrs[prefix + "hp_mod_value"]);
                if ((attrs[prefix + "hp_mod_type"] || "flat") === "percent") {
                    mod_percent_total += jtth_hp_percent_value(value);
                } else {
                    flat_total += value;
                }
            });

            var dice_flat = jtth_hp_dice_flat(attrs.hp_die);
            var base_total = jtth_float(attrs.hp_rolled) + dice_flat + bloodline_total + vitality_total + flat_total;
            var percent_total = vitality_percent + mod_percent_total;
            var auto_total = Math.floor(base_total * (1 + percent_total));
            var current_label = jtth_hp_realm_label(major, minor);
            var next_label = next_realm ? jtth_hp_realm_label(next_realm.major, next_realm.minor) : "Maximum Realm";
            var updates = {
                hp_dice_flat: jtth_clean_number(dice_flat),
                hp_realm_bonus: jtth_clean_number(realm_bonus),
                hp_bloodline_total: jtth_clean_number(bloodline_total),
                hp_vitality_total: jtth_clean_number(vitality_total),
                hp_vitality_percent: jtth_clean_number(vitality_percent * 100) + "%",
                hp_mod_flat_total: jtth_clean_number(flat_total),
                hp_mod_percent_total: jtth_clean_number(mod_percent_total * 100) + "%",
                hp_auto_total: jtth_clean_number(auto_total),
                hp_roll_current_macro: "&{template:simple} @{charname_output} {{rname=Current Realm HP}} {{r1=[[" + current_roll_expr + "]]}}",
                hp_roll_next_macro: "&{template:features} @{charname_output} {{name=Realm Health Gain}} {{source=" + current_label + " to " + next_label + "}} {{description=Current Realm: " + current_label + " &#10; Current Health: @{hp_rolled} &#10; Next Realm: " + next_label + " &#10; Gained Health: [[" + next_roll_expr + "]] &#10; Total New Rolled Health: [[@{hp_rolled}+" + next_roll_expr + "]]}}"
            };
            if (attrs.hp_auto_flag === "1") {
                updates.hp_max = jtth_clean_number(auto_total);
            }
            setAttrs(updates, { silent: true }, function() {
                update_beast_parts();
                if (callback) { callback(); }
            });
        });
    });
};

var set_hp_average = function() {
    getAttrs(["hp_die", "major_realm", "minor_realm"], function(attrs) {
        var average = jtth_hp_average(attrs.hp_die, jtth_hp_realm_bonus(attrs.major_realm || "", attrs.minor_realm || ""), false);
        setAttrs({ hp_rolled: jtth_clean_number(average) }, { silent: true }, function() { update_health(); });
    });
};

var update_weight = function() {
    getSectionIDs("repeating_inventory", function(inventory_ids) {
        var fields = ["power", "carrying_capacity_mod", "inventory_slots_mod", "use_inventory_slots", "inventory_equipped_weight_only"];
        _.each(inventory_ids, function(id) {
            fields.push("repeating_inventory_" + id + "_itemweight");
            fields.push("repeating_inventory_" + id + "_itemcount");
            fields.push("repeating_inventory_" + id + "_itemsize");
            fields.push("repeating_inventory_" + id + "_equipped");
            fields.push("repeating_inventory_" + id + "_carried");
            fields.push("repeating_inventory_" + id + "_itemcontainer");
            fields.push("repeating_inventory_" + id + "_itemweightfixed");
            fields.push("repeating_inventory_" + id + "_itemslotsfixed");
            fields.push("repeating_inventory_" + id + "_itemcontainer_slots");
            fields.push("repeating_inventory_" + id + "_itemcontainer_slots_modifier");
        });
        getAttrs(fields, function(attrs) {
            var weight_total = 0;
            var slots_total = 0;
            var container_slots = 0;
            var container_slot_mods = 0;

            _.each(inventory_ids, function(id) {
                var prefix = "repeating_inventory_" + id + "_";
                var equipped = attrs[prefix + "equipped"] === "1";
                var carried = attrs[prefix + "carried"] === "1";
                if (attrs.inventory_equipped_weight_only === "1") {
                    if (!equipped) { return; }
                } else if (!equipped && !carried) {
                    return;
                }

                if (attrs[prefix + "itemcontainer"] === "1") {
                    if (equipped) {
                        container_slots += jtth_float(attrs[prefix + "itemcontainer_slots"]);
                        container_slot_mods = jtth_apply_inventory_modifier(container_slot_mods, attrs[prefix + "itemcontainer_slots_modifier"]);
                    }
                    return;
                }

                var count = jtth_float(attrs[prefix + "itemcount"]) || 1;
                var weight = jtth_float(attrs[prefix + "itemweight"]);
                var slots = jtth_float(attrs[prefix + "itemsize"]);
                weight_total += attrs[prefix + "itemweightfixed"] === "1" ? weight : weight * count;
                slots_total += attrs[prefix + "itemslotsfixed"] === "1" ? slots : slots * count;
            });

            var power = jtth_float(attrs.power);
            var weight_maximum = jtth_apply_inventory_modifier(30 * power, attrs.carrying_capacity_mod);
            var slots_maximum = jtth_apply_inventory_modifier(18 + container_slots + container_slot_mods, attrs.inventory_slots_mod);
            var encumberance = " ";
            if (slots_total > slots_maximum) {
                encumberance = "OVER CARRYING CAPACITY";
            } else if (weight_total > weight_maximum) {
                encumberance = "IMMOBILE";
            } else if (weight_total > weight_maximum * 0.7333333333) {
                encumberance = "HEAVILY ENCUMBERED";
            } else if (weight_total > weight_maximum * 0.5) {
                encumberance = "ENCUMBERED";
            }

            setAttrs({
                weighttotal: "" + jtth_round_weight(weight_total),
                slotstotal: "" + jtth_round_weight(slots_total),
                weightmaximum: "" + jtth_round_weight(weight_maximum),
                slotsmaximum: "" + jtth_round_weight(slots_maximum),
                encumberance: encumberance
            }, { silent: true });
        });
    });
};

var update_defence_totals = function() { update_evasion(); update_durability(); update_reduction(); update_action_points(); update_qi_reserves(); };
/* ================================
ATTACKS AND DAMAGE
================================ */

var jtth_macro_text = function(value, fallback) {
    var text = String(value || "").trim();
    return text ? text : fallback;
};

var jtth_number_text = function(value, fallback) {
    var text = String(value || "").trim();
    return text ? text : fallback;
};

var jtth_flat_number = function(value) {
    var text = String(value || "").replace(/%/g, "");
    var number = parseFloat(text);
    return isNaN(number) ? 0 : number;
};

var jtth_tech_multiplier = function(value) {
    var text = String(value || "").trim();
    if (!text) { return 1; }
    var number = parseFloat(text.replace(/%/g, ""));
    if (isNaN(number)) { return 1; }
    if (text.indexOf("%") !== -1 || Math.abs(number) > 10) { return number / 100; }
    return number;
};

var jtth_bonus_percent = function(value) {
    var text = String(value || "").trim();
    if (!text) { return 0; }
    var number = parseFloat(text.replace(/%/g, ""));
    if (isNaN(number)) { return 0; }
    if (text.indexOf("%") !== -1) {
        if (Math.abs(number) > 100) { return (number / 100) - 1; }
        return number / 100;
    }
    if (Math.abs(number) > 10) { return number / 100; }
    if (Math.abs(number) > 1) { return number - 1; }
    return number;
};

var jtth_multiplier = function(value) {
    var text = String(value || "").trim();
    if (!text) { return 1; }
    var number = parseFloat(text.replace(/%/g, ""));
    if (isNaN(number)) { return 1; }
    if (text.indexOf("%") !== -1) {
        if (Math.abs(number) > 100) { return number / 100; }
        return 1 + (number / 100);
    }
    if (Math.abs(number) > 10) { return number / 100; }
    return number;
};

var jtth_damage_mod_totals = function(ids, attrs) {
    var totals = { flat: 0, intent: 0, manual_bonus: 0, pill_bonus: 0 };
    _.each(ids, function(id) {
        if (attrs["repeating_damagemod_" + id + "_global_damage_active_flag"] !== "1") { return; }
        var source = attrs["repeating_damagemod_" + id + "_global_damage_source"] || "intent";
        var type = attrs["repeating_damagemod_" + id + "_global_damage_type"] || "flat";
        var value = attrs["repeating_damagemod_" + id + "_global_damage_damage"];
        if (source === "intent") {
            totals.intent += jtth_flat_number(value);
        } else if (type === "percent" && source === "manual") {
            totals.manual_bonus += jtth_bonus_percent(value);
        } else if (type === "percent") {
            totals.pill_bonus += jtth_bonus_percent(value);
        } else {
            totals.flat += jtth_flat_number(value);
        }
    });
    return totals;
};

var jtth_attack_mod_totals = function(ids, attrs) {
    var totals = { both: 0, acc: 0, eff: 0 };
    _.each(ids, function(id) {
        if (attrs["repeating_tohitmod_" + id + "_global_attack_active_flag"] !== "1") { return; }
        var applies = attrs["repeating_tohitmod_" + id + "_global_attack_appliesto"] || "both";
        var value = jtth_flat_number(attrs["repeating_tohitmod_" + id + "_global_attack_roll"]);
        if (applies === "acc") {
            totals.acc += value;
        } else if (applies === "eff") {
            totals.eff += value;
        } else {
            totals.both += value;
        }
    });
    return totals;
};

var jtth_intent_shares = function(intent_total, flags) {
    var checked = [];
    _.each(flags, function(flag, index) { if (flag) { checked.push(index); } });
    var shares = [0, 0, 0, 0];
    if (!checked.length || !intent_total) { return shares; }
    var base = Math.floor(intent_total / checked.length);
    var remainder = intent_total - (base * checked.length);
    _.each(checked, function(index, order) { shares[index] = base + (order < remainder ? 1 : 0); });
    return shares;
};

var jtth_damage_expr = function(row, prefix, intent_share, mod_totals) {
    var dice = jtth_macro_text(row[prefix + "base"], "0");
    var attr = jtth_macro_text(row[prefix + "attr"], "0");
    var local_flat = jtth_number_text(row[prefix + "mod"], "0");
    var tech = jtth_tech_multiplier(row[prefix + "tech"]);
    var manual = 1 + mod_totals.manual_bonus;
    var pill = 1 + mod_totals.pill_bonus;
    var flat = mod_totals.flat;
    var is_zero_term = function(value) {
        var text = String(value || "").replace(/\s+/g, "").toLowerCase();
        if (!text || text === "0" || text === "+0" || text === "-0") { return true; }
        if (/^[+-]?0+d\d+$/.test(text)) { return true; }
        return text.indexOf("@{") === -1 && text.indexOf("[[") === -1 && text.indexOf("d") === -1 && jtth_flat_number(text) === 0;
    };
    var add_term = function(terms, value) {
        var text = String(value || "").trim();
        if (is_zero_term(text)) { return; }
        if (text.charAt(0) === "-") {
            terms.push({ sign: "-", value: text.substring(1) });
        } else {
            terms.push({ sign: "+", value: text.charAt(0) === "+" ? text.substring(1) : text });
        }
    };
    var join_terms = function(terms) {
        var output = "";
        _.each(terms, function(term) {
            if (!output) {
                output = term.sign === "-" ? "-" + term.value : term.value;
            } else {
                output += term.sign === "-" ? " - " + term.value : " + " + term.value;
            }
        });
        return output || "0";
    };
    var stat_terms = [];
    var core_terms = [];
    add_term(stat_terms, attr);
    add_term(stat_terms, local_flat);
    add_term(stat_terms, flat);
    if (!is_zero_term(dice)) { core_terms.push("((" + dice + ") * " + tech + ")"); }
    if (stat_terms.length) { core_terms.push("((" + join_terms(stat_terms) + ") * " + tech + " * " + manual + ")"); }
    var core = core_terms.length ? core_terms.join(" + ") : "0";
    if (pill !== 1) { core = "((" + core + ") * " + pill + ")"; }
    if (intent_share) { core += intent_share < 0 ? " - " + Math.abs(intent_share) : " + " + intent_share; }
    return "[[floor(" + core + ")]]";
};

var jtth_static_damage_value = function(value) {
    var text = String(value || "").replace(/\s+/g, "").toLowerCase();
    if (!text || text === "0") { return 0; }
    var dice_match = text.match(/^([+-]?\d*)d(\d+)$/);
    if (dice_match) {
        var count = dice_match[1] === "" || dice_match[1] === "+" ? 1 : (dice_match[1] === "-" ? -1 : jtth_int(dice_match[1]));
        return count * jtth_int(dice_match[2]) / 2;
    }
    return jtth_flat_number(text);
};

var jtth_attr_name_from_ref = function(ref) {
    var match = String(ref || "").match(/@\{([^}]+)\}/);
    return match ? match[1] : "";
};

var jtth_signed_text = function(value) {
    var number = jtth_flat_number(value);
    if (!number) { return ""; }
    return (number > 0 ? "+" : "") + number;
};

var jtth_signed_zero_text = function(value) {
    var number = jtth_flat_number(value);
    return (number > 0 ? "+" : "") + number;
};

var jtth_attack_stat_value = function(value, multiplier) {
    return Math.floor(jtth_int(value) * multiplier);
};

var jtth_attack_display = function(row, attrs, acc_mod_total, eff_mod_total) {
    var attr_name = jtth_attr_name_from_ref(row.atkattr_base);
    var attr_value = attr_name ? jtth_int(attrs[attr_name]) : 0;
    var acc_attr_value = jtth_attack_stat_value(attr_value, 1);
    var eff_attr_value = jtth_attack_stat_value(attr_value, 0.75);
    var local_mod = jtth_flat_number(row.atkmod);
    var acc_total = acc_attr_value + local_mod + acc_mod_total;
    var eff_total = eff_attr_value + local_mod + eff_mod_total;
    var parts = [];
    if (attr_name) { parts.push(attr_name.substring(0, 3).toUpperCase() + " " + acc_attr_value + "/" + eff_attr_value); }
    if (local_mod) { parts.push(jtth_signed_text(local_mod)); }
    if (acc_mod_total || eff_mod_total) { parts.push(jtth_signed_zero_text(acc_mod_total) + "/" + jtth_signed_zero_text(eff_mod_total)); }
    return "ACC " + (acc_total >= 0 ? "+" : "") + acc_total + " / PEN " + (eff_total >= 0 ? "+" : "") + eff_total + (parts.length ? " (" + parts.join(" ") + ")" : "");
};

var jtth_damage_display = function(row, prefix, type, attrs, mod_totals, intent_share) {
    var attr_name = jtth_attr_name_from_ref(row[prefix + "attr"]);
    var attr_value = attr_name ? jtth_int(attrs[attr_name]) : 0;
    var dice_value = jtth_static_damage_value(row[prefix + "base"]);
    var local_flat = jtth_flat_number(row[prefix + "mod"]);
    var tech = jtth_tech_multiplier(row[prefix + "tech"]);
    var manual = 1 + mod_totals.manual_bonus;
    var pill = 1 + mod_totals.pill_bonus;
    var total = Math.floor((((dice_value * tech) + ((attr_value + local_flat + mod_totals.flat) * tech * manual)) * pill) + intent_share);
    return total + (type ? " " + type : "");
};

var jtth_attack_roll = function(row, mod_total, stat_multiplier) {
    var attr = jtth_macro_text(row.atkattr_base, "0");
    var mod = jtth_number_text(row.atkmod, "0");
    var multiplier = jtth_float(stat_multiplier);
    if (!multiplier) { multiplier = 1; }
    var attr_expr = multiplier === 1 ? "(" + attr + ")" : "floor((" + attr + ") * " + multiplier + ")";
    return "[[" + attr_expr + " + (" + mod + ") + " + mod_total + "]]";
};

var apply_default_attack_stat = function(callback) {
    getSectionIDs("repeating_attack", function(attack_ids) {
        var fields = ["default_attack_stat"];
        _.each(attack_ids, function(id) {
            fields.push("repeating_attack_" + id + "_atk_default_applied");
            fields.push("repeating_attack_" + id + "_atkattr_base");
        });
        getAttrs(fields, function(attrs) {
            var default_stat = attrs.default_attack_stat || "@{power}";
            var updates = {};
            _.each(attack_ids, function(id) {
                var base = "repeating_attack_" + id + "_";
                if (attrs[base + "atk_default_applied"] === "1") { return; }
                if (attrs[base + "atkattr_base"] && attrs[base + "atkattr_base"] !== "@{power}") {
                    updates[base + "atk_default_applied"] = "1";
                    return;
                }
                updates[base + "atkattr_base"] = default_stat;
                updates[base + "atk_default_applied"] = "1";
            });
            if (_.size(updates)) {
                setAttrs(updates, { silent: true }, function() {
                    if (callback) { callback(); }
                });
            } else if (callback) {
                callback();
            }
        });
    });
};

var add_default_attack = function() {
    getAttrs(["default_attack_stat"], function(attrs) {
        var id = generateRowID();
        var base = "repeating_attack_" + id + "_";
        var default_stat = attrs.default_attack_stat || "@{power}";
        var updates = {};
        updates[base + "row_anchor"] = "1";
        updates[base + "options-flag"] = "on";
        updates[base + "atkflag"] = "{{attack=1}}";
        updates[base + "atkattr_base"] = default_stat;
        updates[base + "atk_default_applied"] = "1";
        updates[base + "dmgflag"] = "{{damage=1}} {{dmgflag=1}}";
        updates[base + "dmgattr"] = default_stat;
        updates[base + "dmg2attr"] = default_stat;
        updates[base + "dmg3attr"] = default_stat;
        updates[base + "dmg4attr"] = default_stat;
        updates[base + "dmg3_visible"] = "0";
        updates[base + "dmg4_visible"] = "0";
        setAttrs(updates, { silent: true }, function() { update_attacks(); });
    });
};

var mark_existing_attack_defaults = function() {
    getSectionIDs("repeating_attack", function(attack_ids) {
        var fields = [];
        _.each(attack_ids, function(id) {
            fields.push("repeating_attack_" + id + "_atk_default_applied");
        });
        getAttrs(fields, function(attrs) {
            var updates = {};
            _.each(attack_ids, function(id) {
                var field = "repeating_attack_" + id + "_atk_default_applied";
                if (attrs[field] !== "1") { updates[field] = "1"; }
            });
            if (_.size(updates)) { setAttrs(updates, { silent: true }); }
        });
    });
};

var update_attacks = function() {
    getSectionIDs("repeating_attack", function(attack_ids) {
        getSectionIDs("repeating_damagemod", function(mod_ids) {
            getSectionIDs("repeating_tohitmod", function(attack_mod_ids) {
            var fields = ["dtype", "charname_output", "whispertoggle"];
            _.each(JTTH_ATTRIBUTES, function(attr) { fields.push(attr); });
                _.each(mod_ids, function(id) {
                    fields.push("repeating_damagemod_" + id + "_global_damage_active_flag");
                    fields.push("repeating_damagemod_" + id + "_global_damage_source");
                    fields.push("repeating_damagemod_" + id + "_global_damage_damage");
                    fields.push("repeating_damagemod_" + id + "_global_damage_type");
                });
                _.each(attack_mod_ids, function(id) {
                    fields.push("repeating_tohitmod_" + id + "_global_attack_active_flag");
                    fields.push("repeating_tohitmod_" + id + "_global_attack_roll");
                    fields.push("repeating_tohitmod_" + id + "_global_attack_appliesto");
                });
                _.each(attack_ids, function(id) {
                    var base = "repeating_attack_" + id + "_";
                    _.each(["atkname","atkflag","atkattr_base","atkmod","atkrange","dmgflag","dmgbase","dmgtech","dmgattr","dmgmod","dmgtype","dmgintentflag","dmg2flag","dmg2base","dmg2tech","dmg2attr","dmg2mod","dmg2type","dmg2intentflag","dmg3flag","dmg3base","dmg3tech","dmg3attr","dmg3mod","dmg3type","dmg3intentflag","dmg4flag","dmg4base","dmg4tech","dmg4attr","dmg4mod","dmg4type","dmg4intentflag","saveflag","saveattr","saveeffect","savedc","atk_desc"], function(attr) {
                        fields.push(base + attr);
                    });
                });
                getAttrs(fields, function(attrs) {
                    var updates = {};
                    var mod_totals = jtth_damage_mod_totals(mod_ids, attrs);
                    var attack_mod_totals = jtth_attack_mod_totals(attack_mod_ids, attrs);
                    _.each(attack_ids, function(id) {
                        var base = "repeating_attack_" + id + "_";
                        var row = {};
                        _.each(fields, function(field) {
                            if (field.indexOf(base) === 0) { row[field.replace(base, "")] = attrs[field]; }
                        });
                        var dmg2_on = !!row.dmg2flag;
                        var dmg3_on = dmg2_on && !!row.dmg3flag;
                        var dmg4_on = dmg3_on && !!row.dmg4flag;
                    var intent_shares = jtth_intent_shares(mod_totals.intent, [row.dmgflag && row.dmgintentflag === "1", dmg2_on && row.dmg2intentflag === "1", dmg3_on && row.dmg3intentflag === "1", dmg4_on && row.dmg4intentflag === "1"]);
                        var acc_mod_total = attack_mod_totals.both + attack_mod_totals.acc;
                        var eff_mod_total = attack_mod_totals.both + attack_mod_totals.eff;
                        var acc_roll = jtth_attack_roll(row, acc_mod_total, 1);
                        var eff_roll = jtth_attack_roll(row, eff_mod_total, 0.75);
                        var damage_bits = (row.dmgflag || "") + " " + (dmg2_on ? row.dmg2flag : "") + " " + (dmg3_on ? row.dmg3flag : "") + " " + (dmg4_on ? row.dmg4flag : "");
                        var save_bits = row.saveflag || "";
                        var desc = jtth_macro_text(row.atk_desc, "");
                        var common = "@{whispertoggle}&{template:" + (attrs.dtype === "full" ? "atkdmg" : "atk") + "} @{charname_output} {{rname=@{atkname}}} {{mod=@{atkattr_base}+@{atkmod}}} {{r1=" + acc_roll + "}} {{r2=" + eff_roll + "}} {{range=@{atkrange}}} " + (row.atkflag || "") + " ";
                        var damage = damage_bits + " {{dmg1=" + jtth_damage_expr(row, "dmg", intent_shares[0], mod_totals) + "}} {{dmg1type=@{dmgtype}}} {{dmg2=" + jtth_damage_expr(row, "dmg2", intent_shares[1], mod_totals) + "}} {{dmg2type=@{dmg2type}}} {{dmg3=" + jtth_damage_expr(row, "dmg3", intent_shares[2], mod_totals) + "}} {{dmg3type=@{dmg3type}}} {{dmg4=" + jtth_damage_expr(row, "dmg4", intent_shares[3], mod_totals) + "}} {{dmg4type=@{dmg4type}}} " + save_bits + " {{desc=" + desc + "}}";
                        updates[base + "rollbase"] = common + (attrs.dtype === "full" ? damage : " {{desc=" + desc + "}}");
                        updates[base + "rollbase_dmg"] = "@{whispertoggle}&{template:dmg} " + damage;
                    updates[base + "atkbonus"] = jtth_attack_display(row, attrs, acc_mod_total, eff_mod_total);
                    var typed_damage = [];
                    var fallback_damage = [];
                    var add_damage_display = function(prefix, type, share) {
                        var display = jtth_damage_display(row, prefix, type, attrs, mod_totals, share);
                        if (type) { typed_damage.push(display); } else { fallback_damage.push(display); }
                    };
                    if (row.dmgflag) { add_damage_display("dmg", row.dmgtype, intent_shares[0]); }
                    if (dmg2_on) { add_damage_display("dmg2", row.dmg2type, intent_shares[1]); }
                    if (dmg3_on) { add_damage_display("dmg3", row.dmg3type, intent_shares[2]); }
                    if (dmg4_on) { add_damage_display("dmg4", row.dmg4type, intent_shares[3]); }
                    updates[base + "atkdmgtype"] = (typed_damage.length ? typed_damage : fallback_damage).join(" / ");
                        updates[base + "dmg3_visible"] = dmg2_on ? "1" : "0";
                        updates[base + "dmg4_visible"] = dmg3_on ? "1" : "0";
                    });
                    setAttrs(updates, { silent: true });
                });
            });
        });
    });
};

var jtth_avatar_attr_label = function(ref) {
    var name = jtth_attr_name_from_ref(ref);
    var labels = {
        avatar_power: "PWR",
        avatar_agility: "AGI",
        avatar_vitality: "VIT",
        avatar_cultivation: "CUL",
        avatar_qi_control: "QIC",
        avatar_mental: "MTL"
    };
    return labels[name] || "";
};

var jtth_avatar_attack_display = function(row) {
    var attr = jtth_macro_text(row.atkattr_base, "0");
    var mod = jtth_number_text(row.atkmod, "0");
    var label = jtth_avatar_attr_label(row.atkattr_base);
    return "ACC [[" + attr + " + " + mod + "]] / PEN [[floor((" + attr + ") * 0.75) + " + mod + "]]" + (label ? " (" + label + ")" : "");
};

var jtth_avatar_damage_display = function(row, prefix, type) {
    var dice = row[prefix + "base"] || "0";
    var attr_label = jtth_avatar_attr_label(row[prefix + "attr"]);
    var flat = jtth_signed_text(row[prefix + "mod"]);
    var parts = [];
    if (dice && dice !== "0") { parts.push(dice); }
    if (attr_label) { parts.push(attr_label); }
    if (flat) { parts.push(flat); }
    return (parts.length ? parts.join(" + ") : "0") + (type ? " " + type : "");
};

var jtth_avatar_row_id_from_event = function(eventInfo) {
    var source = (eventInfo && eventInfo.sourceAttribute) || "";
    var match = source.match(/repeating_talismanavatar_([^_]+)_/);
    return match ? match[1] : "";
};

var add_avatar_attack = function(eventInfo) {
    var id = generateRowID();
    var base = "repeating_talismanavatarattack_" + id + "_";
    var owner = jtth_avatar_row_id_from_event(eventInfo);
    var updates = {};
    updates[base + "row_anchor"] = "1";
    updates[base + "avatar_attack_owner"] = owner;
    updates[base + "options-flag"] = "on";
    updates[base + "atkflag"] = "{{attack=1}}";
    updates[base + "atkattr_base"] = "@{avatar_power}";
    updates[base + "dmgflag"] = "{{damage=1}} {{dmgflag=1}}";
    updates[base + "dmgattr"] = "@{avatar_power}";
    updates[base + "dmg2attr"] = "@{avatar_power}";
    updates[base + "dmg3attr"] = "@{avatar_power}";
    updates[base + "dmg4attr"] = "@{avatar_power}";
    updates[base + "dmg3_visible"] = "0";
    updates[base + "dmg4_visible"] = "0";
    setAttrs(updates, { silent: true }, function() { update_avatar_attacks(); });
};

var update_avatar_attacks = function() {
    getSectionIDs("repeating_talismanavatarattack", function(attack_ids) {
        var fields = ["dtype", "charname_output", "whispertoggle"];
        _.each(attack_ids, function(id) {
            var base = "repeating_talismanavatarattack_" + id + "_";
            _.each(["avatar_attack_owner","atkname","atkflag","atkattr_base","atkmod","atkrange","dmgflag","dmgbase","dmgtech","dmgattr","dmgmod","dmgtype","dmgintentflag","dmg2flag","dmg2base","dmg2tech","dmg2attr","dmg2mod","dmg2type","dmg2intentflag","dmg3flag","dmg3base","dmg3tech","dmg3attr","dmg3mod","dmg3type","dmg3intentflag","dmg4flag","dmg4base","dmg4tech","dmg4attr","dmg4mod","dmg4type","dmg4intentflag","saveflag","saveattr","saveeffect","savedc","atk_desc"], function(attr) {
                fields.push(base + attr);
            });
        });
        getAttrs(fields, function(attrs) {
            var updates = {};
            var mod_totals = { flat: 0, intent: 0, manual_bonus: 0, pill_bonus: 0 };
            _.each(attack_ids, function(id) {
                var base = "repeating_talismanavatarattack_" + id + "_";
                var row = {};
                _.each(fields, function(field) {
                    if (field.indexOf(base) === 0) { row[field.replace(base, "")] = attrs[field]; }
                });
                var dmg2_on = !!row.dmg2flag;
                var dmg3_on = dmg2_on && !!row.dmg3flag;
                var dmg4_on = dmg3_on && !!row.dmg4flag;
                var acc_roll = jtth_attack_roll(row, 0, 1);
                var eff_roll = jtth_attack_roll(row, 0, 0.75);
                var damage_bits = (row.dmgflag || "") + " " + (dmg2_on ? row.dmg2flag : "") + " " + (dmg3_on ? row.dmg3flag : "") + " " + (dmg4_on ? row.dmg4flag : "");
                var save_bits = row.saveflag || "";
                var desc = jtth_macro_text(row.atk_desc, "");
                var common = "@{whispertoggle}&{template:" + (attrs.dtype === "full" ? "atkdmg" : "atk") + "} @{charname_output} {{rname=@{avatar_name}: @{atkname}}} {{mod=@{atkattr_base}+@{atkmod}}} {{r1=" + acc_roll + "}} {{r2=" + eff_roll + "}} {{range=@{atkrange}}} " + (row.atkflag || "") + " ";
                var damage = damage_bits + " {{dmg1=" + jtth_damage_expr(row, "dmg", 0, mod_totals) + "}} {{dmg1type=@{dmgtype}}} {{dmg2=" + jtth_damage_expr(row, "dmg2", 0, mod_totals) + "}} {{dmg2type=@{dmg2type}}} {{dmg3=" + jtth_damage_expr(row, "dmg3", 0, mod_totals) + "}} {{dmg3type=@{dmg3type}}} {{dmg4=" + jtth_damage_expr(row, "dmg4", 0, mod_totals) + "}} {{dmg4type=@{dmg4type}}} " + save_bits + " {{desc=" + desc + "}}";
                updates[base + "rollbase"] = common + (attrs.dtype === "full" ? damage : " {{desc=" + desc + "}}");
                updates[base + "rollbase_dmg"] = "@{whispertoggle}&{template:dmg} " + damage;
                updates[base + "atkbonus"] = jtth_avatar_attack_display(row);
                var typed_damage = [];
                var fallback_damage = [];
                var add_damage_display = function(prefix, type) {
                    var display = jtth_avatar_damage_display(row, prefix, type);
                    if (type) { typed_damage.push(display); } else { fallback_damage.push(display); }
                };
                if (row.dmgflag) { add_damage_display("dmg", row.dmgtype); }
                if (dmg2_on) { add_damage_display("dmg2", row.dmg2type); }
                if (dmg3_on) { add_damage_display("dmg3", row.dmg3type); }
                if (dmg4_on) { add_damage_display("dmg4", row.dmg4type); }
                updates[base + "atkdmgtype"] = (typed_damage.length ? typed_damage : fallback_damage).join(" / ");
                updates[base + "dmg3_visible"] = dmg2_on ? "1" : "0";
                updates[base + "dmg4_visible"] = dmg3_on ? "1" : "0";
            });
            setAttrs(updates, { silent: true });
        });
    });
};

var update_dependents = function() { update_skills(); update_initiative(); update_dcs(); update_defence_totals(); update_health(); update_weight(); update_attacks(); update_avatar_attacks(); update_beast_parts(); };
var update_all_calculations = function() { update_attributes(function() { update_dependents(); }); };

/* ================================
PROFESSION NOTES
================================ */

var JTTH_PROFESSION_RANKS = [
    { rank: "Initiate", stars: [{ star: 1, min: 1, max: 3 }, { star: 2, min: 4, max: 6 }, { star: 3, min: 7, max: 9 }] },
    { rank: "Novice", stars: [{ star: 1, min: 10, max: 19 }, { star: 2, min: 20, max: 28 }, { star: 3, min: 29, max: 35 }, { star: 4, min: 36, max: 48 }] },
    { rank: "Adept", stars: [{ star: 1, min: 49, max: 64 }, { star: 2, min: 65, max: 81 }, { star: 3, min: 82, max: 99 }, { star: 4, min: 100, max: 119 }, { star: 5, min: 120, max: 141 }, { star: 6, min: 142, max: 185 }] },
    { rank: "Master", stars: [{ star: 1, min: 186, max: 215 }, { star: 2, min: 216, max: 254 }, { star: 3, min: 255, max: 294 }, { star: 4, min: 295, max: 344 }, { star: 5, min: 345, max: 399 }, { star: 6, min: 400, max: 461 }, { star: 7, min: 462, max: 529 }, { star: 8, min: 530, max: 591 }] }
];

var jtth_profession_rank_label = function(skill_level) {
    var level = jtth_int(skill_level);
    var rank_match = null;
    if (level <= 0) { return "0 Stars"; }
    _.each(JTTH_PROFESSION_RANKS, function(rank) {
        _.each(rank.stars, function(star) {
            if (!rank_match && level >= star.min && level <= star.max) {
                rank_match = rank.rank + " " + star.star + " Star" + (star.star === 1 ? "" : "s");
            }
        });
    });
    return rank_match || "Unranked";
};

var update_profession = function(profession) {
    getSectionIDs("repeating_" + profession + "bonus", function(bonus_ids) {
        var fields = ["profession_" + profession + "_skill"];
        _.each(bonus_ids, function(id) {
            fields.push("repeating_" + profession + "bonus_" + id + "_bonus_value");
        });
        getAttrs(fields, function(attrs) {
            var skill_level = jtth_int(attrs["profession_" + profession + "_skill"]);
            var bonus_total = 0;
            _.each(bonus_ids, function(id) {
                bonus_total += jtth_int(attrs["repeating_" + profession + "bonus_" + id + "_bonus_value"]);
            });
            var updates = {};
            updates["profession_" + profession + "_rank"] = jtth_profession_rank_label(skill_level);
            updates["profession_" + profession + "_bonus_total"] = jtth_clean_number(bonus_total);
            setAttrs(updates, { silent: true });
        });
    });
};

var update_professions = function() {
    _.each(["alchemy", "array", "carving", "cooking", "doctor", "forging", "fulu", "weaving"], function(profession) {
        update_profession(profession);
    });
};

var reset_profession_stars = function(profession) {
    var updates = {};
    updates["profession_" + profession + "_official_stars"] = "1";
    setAttrs(updates);
};

/* ================================
EVENT LISTENERS
================================ */

var jtth_attribute_events = ["change:power_base", "change:agility_base", "change:vitality_base", "change:cultivation_base", "change:qicontrol_base", "change:mental_base", "change:power_bonus", "change:agility_bonus", "change:vitality_bonus", "change:cultivation_bonus", "change:qicontrol_bonus", "change:mental_bonus", "change:global_attribute_bonus"];
on("sheet:opened", function() { mark_existing_attack_defaults(); update_all_calculations(); update_professions(); });
on(jtth_attribute_events.join(" "), function() { update_all_calculations(); });

var jtth_skill_events = ["change:appearance", "change:appearance_base", "change:global_skill_bonus", "change:repeating_inventory:equipped", "change:repeating_inventory:itemmodifiers", "remove:repeating_inventory"];
_.each(JTTH_SKILL_NAMES, function(skill_name) { jtth_skill_events.push("change:" + skill_name + "_flat"); });
on(jtth_skill_events.join(" "), function() { update_skills(); });

on("change:ctype change:major_realm change:minor_realm change:mortal-level change:qi_dao_group change:qi_regen_value change:global_dc_bonus change:power_dc_bonus change:agility_dc_bonus change:vitality_dc_bonus change:cultivation_dc_bonus change:qicontrol_dc_bonus change:mental_dc_bonus change:qi_control_dc_bonus change:mental_strength_bonus", function() { update_dcs(); update_defence_totals(); });
on("change:initiative_bonus", function() { update_initiative(); });
on("change:repeating_evasionsource:evasion_value remove:repeating_evasionsource", function() { update_evasion(); });
on("change:repeating_durabilitysource:durability_value remove:repeating_durabilitysource", function() { update_durability(); });
on("change:repeating_reductionsource:reduction_value remove:repeating_reductionsource", function() { update_reduction(); });
on("change:repeating_qimodifier:qi_modifier_active change:repeating_qimodifier:qi_modifier_type change:repeating_qimodifier:qi_modifier_value remove:repeating_qimodifier", function() { update_qi_reserves(); });
on("clicked:qi_regen", function() { apply_qi_regen(); });
on("change:hp_max change:repeating_beastparts:part_name change:repeating_beastparts:part_quality remove:repeating_beastparts", function() { update_beast_parts(); });
on("change:hp_auto_flag change:hp_die change:hp_rolled change:hp_bloodline_bonus change:major_realm change:minor_realm change:vitality change:vitality_base change:vitality_bonus change:global_attribute_bonus change:repeating_hpmod:hp_mod_active change:repeating_hpmod:hp_mod_value change:repeating_hpmod:hp_mod_type remove:repeating_hpmod", function() { update_health(); });
on("clicked:hp_average", function() { set_hp_average(); });
on("change:repeating_inventory:equipped change:repeating_inventory:itemmodifiers remove:repeating_inventory", function() { update_all_calculations(); });
on("change:power change:carrying_capacity_mod change:inventory_slots_mod change:use_inventory_slots change:inventory_equipped_weight_only change:repeating_inventory:itemcontainer change:repeating_inventory:equipped change:repeating_inventory:carried change:repeating_inventory:itemweight change:repeating_inventory:itemcount change:repeating_inventory:itemweightfixed change:repeating_inventory:itemslotsfixed change:repeating_inventory:itemsize change:repeating_inventory:itemcontainer_slots change:repeating_inventory:itemcontainer_slots_modifier remove:repeating_inventory", function() { update_weight(); });
on("change:dtype change:repeating_tohitmod:global_attack_active_flag change:repeating_tohitmod:global_attack_roll change:repeating_tohitmod:global_attack_appliesto remove:repeating_tohitmod change:repeating_damagemod:global_damage_active_flag change:repeating_damagemod:global_damage_source change:repeating_damagemod:global_damage_damage change:repeating_damagemod:global_damage_type remove:repeating_damagemod", function() { update_attacks(); });
on("clicked:add_attack", function() { add_default_attack(); });
on("change:repeating_attack:row_anchor change:repeating_attack:atkname change:repeating_attack:atkflag change:repeating_attack:atkattr_base change:repeating_attack:atkmod change:repeating_attack:atkrange change:repeating_attack:dmgflag change:repeating_attack:dmgbase change:repeating_attack:dmgtech change:repeating_attack:dmgattr change:repeating_attack:dmgmod change:repeating_attack:dmgtype change:repeating_attack:dmgintentflag change:repeating_attack:dmg2flag change:repeating_attack:dmg2base change:repeating_attack:dmg2tech change:repeating_attack:dmg2attr change:repeating_attack:dmg2mod change:repeating_attack:dmg2type change:repeating_attack:dmg2intentflag change:repeating_attack:dmg3flag change:repeating_attack:dmg3base change:repeating_attack:dmg3tech change:repeating_attack:dmg3attr change:repeating_attack:dmg3mod change:repeating_attack:dmg3type change:repeating_attack:dmg3intentflag change:repeating_attack:dmg4flag change:repeating_attack:dmg4base change:repeating_attack:dmg4tech change:repeating_attack:dmg4attr change:repeating_attack:dmg4mod change:repeating_attack:dmg4type change:repeating_attack:dmg4intentflag change:repeating_attack:saveflag change:repeating_attack:saveattr change:repeating_attack:saveeffect change:repeating_attack:savedc change:repeating_attack:atk_desc remove:repeating_attack", function() { apply_default_attack_stat(update_attacks); });
on("clicked:repeating_talismanavatar:add_avatar_attack", function(eventInfo) { add_avatar_attack(eventInfo); });
on("change:dtype change:repeating_talismanavatarattack:row_anchor change:repeating_talismanavatarattack:atkname change:repeating_talismanavatarattack:atkflag change:repeating_talismanavatarattack:atkattr_base change:repeating_talismanavatarattack:atkmod change:repeating_talismanavatarattack:atkrange change:repeating_talismanavatarattack:dmgflag change:repeating_talismanavatarattack:dmgbase change:repeating_talismanavatarattack:dmgtech change:repeating_talismanavatarattack:dmgattr change:repeating_talismanavatarattack:dmgmod change:repeating_talismanavatarattack:dmgtype change:repeating_talismanavatarattack:dmgintentflag change:repeating_talismanavatarattack:dmg2flag change:repeating_talismanavatarattack:dmg2base change:repeating_talismanavatarattack:dmg2tech change:repeating_talismanavatarattack:dmg2attr change:repeating_talismanavatarattack:dmg2mod change:repeating_talismanavatarattack:dmg2type change:repeating_talismanavatarattack:dmg2intentflag change:repeating_talismanavatarattack:dmg3flag change:repeating_talismanavatarattack:dmg3base change:repeating_talismanavatarattack:dmg3tech change:repeating_talismanavatarattack:dmg3attr change:repeating_talismanavatarattack:dmg3mod change:repeating_talismanavatarattack:dmg3type change:repeating_talismanavatarattack:dmg3intentflag change:repeating_talismanavatarattack:dmg4flag change:repeating_talismanavatarattack:dmg4base change:repeating_talismanavatarattack:dmg4tech change:repeating_talismanavatarattack:dmg4attr change:repeating_talismanavatarattack:dmg4mod change:repeating_talismanavatarattack:dmg4type change:repeating_talismanavatarattack:dmg4intentflag change:repeating_talismanavatarattack:saveflag change:repeating_talismanavatarattack:saveattr change:repeating_talismanavatarattack:saveeffect change:repeating_talismanavatarattack:savedc change:repeating_talismanavatarattack:atk_desc remove:repeating_talismanavatarattack", function() { update_avatar_attacks(); });
on("change:profession_alchemy_skill change:repeating_alchemybonus:bonus_value remove:repeating_alchemybonus", function() { update_profession("alchemy"); });
on("change:profession_array_skill change:repeating_arraybonus:bonus_value remove:repeating_arraybonus", function() { update_profession("array"); });
on("change:profession_carving_skill change:repeating_carvingbonus:bonus_value remove:repeating_carvingbonus", function() { update_profession("carving"); });
on("change:profession_cooking_skill change:repeating_cookingbonus:bonus_value remove:repeating_cookingbonus", function() { update_profession("cooking"); });
on("change:profession_doctor_skill change:repeating_doctorbonus:bonus_value remove:repeating_doctorbonus", function() { update_profession("doctor"); });
on("change:profession_forging_skill change:repeating_forgingbonus:bonus_value remove:repeating_forgingbonus", function() { update_profession("forging"); });
on("change:profession_fulu_skill change:repeating_fulubonus:bonus_value remove:repeating_fulubonus", function() { update_profession("fulu"); });
on("change:profession_weaving_skill change:repeating_weavingbonus:bonus_value remove:repeating_weavingbonus", function() { update_profession("weaving"); });
on("change:profession_alchemy_official_rank", function() { reset_profession_stars("alchemy"); });
on("change:profession_array_official_rank", function() { reset_profession_stars("array"); });
on("change:profession_carving_official_rank", function() { reset_profession_stars("carving"); });
on("change:profession_cooking_official_rank", function() { reset_profession_stars("cooking"); });
on("change:profession_doctor_official_rank", function() { reset_profession_stars("doctor"); });
on("change:profession_forging_official_rank", function() { reset_profession_stars("forging"); });
on("change:profession_fulu_official_rank", function() { reset_profession_stars("fulu"); });
on("change:profession_weaving_official_rank", function() { reset_profession_stars("weaving"); });
