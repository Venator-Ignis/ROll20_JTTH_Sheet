
/* ================================
JTTH HELPERS
Roll20-safe sheet workers only
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
var jtth_realm_base = function(realm) { return JTTH_REALM_DEFENSE_BASES[realm] || 0; };
var jtth_ap_major_realm_base = function(realm) { return JTTH_AP_MAJOR_REALM_BASES[realm] || 4; };
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
        var major_realm_base = JTTH_AP_MAJOR_REALM_BASES[attrs.major_realm || "Mortal"] || 4;
        var agility_scale = Math.floor(agility / 15);
        var agility_regen_bonus = Math.floor(agility / 150);
        setAttrs({ "ap-base": "4", "ap-major-realm-base": jtth_clean_number(major_realm_base), "ap-agility-scale": jtth_clean_number(agility_scale), "ap-agility-regen-bonus": jtth_clean_number(agility_regen_bonus), "ap-max": jtth_clean_number(major_realm_base * 2), "ap-regen": jtth_clean_number(major_realm_base + agility_regen_bonus) }, { silent: true });
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

var update_weight = function() {
    getSectionIDs("repeating_inventory", function(inventory_ids) {
        var fields = ["power", "carrying_capacity_mod", "inventory_slots_mod", "use_inventory_slots"];
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
                if (!equipped && !carried) { return; }

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

var update_defence_totals = function() { update_evasion(); update_durability(); update_reduction(); update_action_points(); };
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
    return "[[floor((((" + dice + ") * " + tech + ") + (((" + attr + ") + (" + local_flat + ") + " + flat + ") * " + tech + " * " + manual + ")) * " + pill + ") + " + intent_share + "]]";
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

var jtth_attack_display = function(row, attrs, mod_total) {
    var attr_name = jtth_attr_name_from_ref(row.atkattr_base);
    var attr_value = attr_name ? jtth_int(attrs[attr_name]) : 0;
    var local_mod = jtth_flat_number(row.atkmod);
    var total = attr_value + local_mod + mod_total;
    var parts = [];
    if (attr_name) { parts.push(attr_name.substring(0, 3).toUpperCase() + " " + attr_value); }
    if (local_mod) { parts.push(jtth_signed_text(local_mod)); }
    if (mod_total) { parts.push(jtth_signed_text(mod_total)); }
    return (total >= 0 ? "+" : "") + total + (parts.length ? " (" + parts.join(" ") + ")" : "");
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

var jtth_attack_roll = function(row, mod_total) {
    var attr = jtth_macro_text(row.atkattr_base, "0");
    var mod = jtth_number_text(row.atkmod, "0");
    return "[[(" + attr + ") + (" + mod + ") + " + mod_total + "]]";
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
                        var acc_roll = jtth_attack_roll(row, attack_mod_totals.both + attack_mod_totals.acc);
                        var eff_roll = jtth_attack_roll(row, attack_mod_totals.both + attack_mod_totals.eff);
                        var damage_bits = (row.dmgflag || "") + " " + (dmg2_on ? row.dmg2flag : "") + " " + (dmg3_on ? row.dmg3flag : "") + " " + (dmg4_on ? row.dmg4flag : "");
                        var save_bits = row.saveflag || "";
                        var desc = jtth_macro_text(row.atk_desc, "");
                        var common = "@{whispertoggle}&{template:" + (attrs.dtype === "full" ? "atkdmg" : "atk") + "} @{charname_output} {{rname=@{atkname}}} {{mod=@{atkattr_base}+@{atkmod}}} {{r1=" + acc_roll + "}} {{r2=" + eff_roll + "}} {{range=@{atkrange}}} " + (row.atkflag || "") + " ";
                        var damage = damage_bits + " {{dmg1=" + jtth_damage_expr(row, "dmg", intent_shares[0], mod_totals) + "}} {{dmg1type=@{dmgtype}}} {{dmg2=" + jtth_damage_expr(row, "dmg2", intent_shares[1], mod_totals) + "}} {{dmg2type=@{dmg2type}}} {{dmg3=" + jtth_damage_expr(row, "dmg3", intent_shares[2], mod_totals) + "}} {{dmg3type=@{dmg3type}}} {{dmg4=" + jtth_damage_expr(row, "dmg4", intent_shares[3], mod_totals) + "}} {{dmg4type=@{dmg4type}}} " + save_bits + " {{desc=" + desc + "}}";
                        updates[base + "rollbase"] = common + (attrs.dtype === "full" ? damage : " {{desc=" + desc + "}}");
                        updates[base + "rollbase_dmg"] = "@{whispertoggle}&{template:dmg} " + damage;
                    updates[base + "atkbonus"] = jtth_attack_display(row, attrs, attack_mod_totals.both);
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

var update_dependents = function() { update_skills(); update_initiative(); update_dcs(); update_defence_totals(); update_weight(); update_attacks(); update_beast_parts(); };
var update_all_calculations = function() { update_attributes(function() { update_dependents(); }); };

/* ================================
EVENT LISTENERS
================================ */

var jtth_attribute_events = ["change:power_base", "change:agility_base", "change:vitality_base", "change:cultivation_base", "change:qicontrol_base", "change:mental_base", "change:power_bonus", "change:agility_bonus", "change:vitality_bonus", "change:cultivation_bonus", "change:qicontrol_bonus", "change:mental_bonus", "change:global_attribute_bonus"];
on("sheet:opened", function() { update_all_calculations(); });
on(jtth_attribute_events.join(" "), function() { update_all_calculations(); });

var jtth_skill_events = ["change:appearance", "change:appearance_base", "change:global_skill_bonus", "change:repeating_inventory:equipped", "change:repeating_inventory:itemmodifiers", "remove:repeating_inventory"];
_.each(JTTH_SKILL_NAMES, function(skill_name) { jtth_skill_events.push("change:" + skill_name + "_flat"); });
on(jtth_skill_events.join(" "), function() { update_skills(); });

on("change:ctype change:major_realm change:mortal-level change:global_dc_bonus change:power_dc_bonus change:agility_dc_bonus change:vitality_dc_bonus change:cultivation_dc_bonus change:qicontrol_dc_bonus change:mental_dc_bonus change:qi_control_dc_bonus change:mental_strength_bonus", function() { update_dcs(); update_defence_totals(); });
on("change:initiative_bonus", function() { update_initiative(); });
on("change:repeating_evasionsource:evasion_value remove:repeating_evasionsource", function() { update_evasion(); });
on("change:repeating_durabilitysource:durability_value remove:repeating_durabilitysource", function() { update_durability(); });
on("change:repeating_reductionsource:reduction_value remove:repeating_reductionsource", function() { update_reduction(); });
on("change:hp_max change:repeating_beastparts:part_name change:repeating_beastparts:part_quality remove:repeating_beastparts", function() { update_beast_parts(); });
on("change:repeating_inventory:equipped change:repeating_inventory:itemmodifiers remove:repeating_inventory", function() { update_all_calculations(); });
on("change:power change:carrying_capacity_mod change:inventory_slots_mod change:use_inventory_slots change:repeating_inventory:itemcontainer change:repeating_inventory:equipped change:repeating_inventory:carried change:repeating_inventory:itemweight change:repeating_inventory:itemcount change:repeating_inventory:itemweightfixed change:repeating_inventory:itemslotsfixed change:repeating_inventory:itemsize change:repeating_inventory:itemcontainer_slots change:repeating_inventory:itemcontainer_slots_modifier remove:repeating_inventory", function() { update_weight(); });
on("change:dtype change:repeating_tohitmod:global_attack_active_flag change:repeating_tohitmod:global_attack_roll change:repeating_tohitmod:global_attack_appliesto remove:repeating_tohitmod change:repeating_damagemod:global_damage_active_flag change:repeating_damagemod:global_damage_source change:repeating_damagemod:global_damage_damage change:repeating_damagemod:global_damage_type remove:repeating_damagemod", function() { update_attacks(); });
on("change:repeating_attack:atkname change:repeating_attack:atkflag change:repeating_attack:atkattr_base change:repeating_attack:atkmod change:repeating_attack:atkrange change:repeating_attack:dmgflag change:repeating_attack:dmgbase change:repeating_attack:dmgtech change:repeating_attack:dmgattr change:repeating_attack:dmgmod change:repeating_attack:dmgtype change:repeating_attack:dmgintentflag change:repeating_attack:dmg2flag change:repeating_attack:dmg2base change:repeating_attack:dmg2tech change:repeating_attack:dmg2attr change:repeating_attack:dmg2mod change:repeating_attack:dmg2type change:repeating_attack:dmg2intentflag change:repeating_attack:dmg3flag change:repeating_attack:dmg3base change:repeating_attack:dmg3tech change:repeating_attack:dmg3attr change:repeating_attack:dmg3mod change:repeating_attack:dmg3type change:repeating_attack:dmg3intentflag change:repeating_attack:dmg4flag change:repeating_attack:dmg4base change:repeating_attack:dmg4tech change:repeating_attack:dmg4attr change:repeating_attack:dmg4mod change:repeating_attack:dmg4type change:repeating_attack:dmg4intentflag change:repeating_attack:saveflag change:repeating_attack:saveattr change:repeating_attack:saveeffect change:repeating_attack:savedc change:repeating_attack:atk_desc remove:repeating_attack", function() { update_attacks(); });