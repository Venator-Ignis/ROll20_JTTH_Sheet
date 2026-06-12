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

        var update_attributes = function(callback) {
            var fields = ["global_attribute_bonus"];
            _.each(JTTH_ATTRIBUTES, function(attr) {
                fields.push(attr + "_base");
                fields.push(attr + "_bonus");
            });
            getAttrs(fields, function(attrs) {
                var updates = {};
                var global_bonus = jtth_int(attrs.global_attribute_bonus);
                _.each(JTTH_ATTRIBUTES, function(attr) {
                    updates[attr] = jtth_int(attrs[attr + "_base"]) + jtth_int(attrs[attr + "_bonus"]) + global_bonus;
                });
                setAttrs(updates, { silent: true }, function() {
                    if (typeof callback === "function") { callback(); }
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

        var JTTH_REALM_DC_LEVELS = { "Mortal": 0, "Qi Gathering": 1, "Foundation": 7, "Core Formation": 14, "Martial Soul": 21, "God Ascendance": 28 };
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

        var update_action_points = function() {
            getAttrs(["major_realm", "agility", "agility_base", "agility_bonus", "global_attribute_bonus"], function(attrs) {
                var agility = jtth_stat_value("agility", attrs);
                var major_realm_base = JTTH_AP_MAJOR_REALM_BASES[attrs.major_realm || "Mortal"] || 4;
                var agility_scale = Math.floor(agility / 15);
                var agility_regen_bonus = Math.floor(agility / 150);
                setAttrs({ "ap-base": "4", "ap-major-realm-base": jtth_clean_number(major_realm_base), "ap-agility-scale": jtth_clean_number(agility_scale), "ap-agility-regen-bonus": jtth_clean_number(agility_regen_bonus), "ap-max": jtth_clean_number(major_realm_base * 2), "ap-regen": jtth_clean_number(major_realm_base + agility_regen_bonus) }, { silent: true });
            });
        };

        var update_defence_totals = function() { update_evasion(); update_durability(); update_reduction(); update_action_points(); };
        var update_dependents = function() { update_skills(); update_initiative(); update_dcs(); update_defence_totals(); };
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