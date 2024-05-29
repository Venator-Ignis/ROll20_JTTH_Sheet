
on("change:agility change:power change:vitality change:cultivation change:mental_strength change:appearance change:qi_control", function(eventinfo) {
    update_npc_skills();
    update_npc_moves();
    update_npc_legendary_moves();
    update_skills();
    update_moves();
    update_initiative();
    update_evasion();
    update_durability();
    update_reduction();
    console.log("Updating Everything");
});

on("change:acrobatics_bonus change:athletics_bonus change:charm_bonus change:deceit_bonus change:disguise_bonus change:fine_arts_bonus change:forgery_bonus change:history_bonus change:intuition_bonus change:intimidation_bonus change:investigation_bonus change:medicine_bonus change:navigation_bonus change:perception_bonus change:performance_bonus change:persuade_bonus change:discretion_bonus change:stealth_bonus change:survival_bonus", function(eventinfo) {
    update_skills();
    console.log("Updating PC Skills");
});

on("change:repeating_nmove:name change:repeating_move:attack_flag change:repeating_move:attack_type change:repeating_move:attack_range change:repeating_move:attack_tohit change:repeating_move:attack_bonus change:repeating_move:attack_damage change:repeating_move:attack_damage1attribute change:repeating_move:attack_damage1bonus change:repeating_move:attack_damagetype change:repeating_move:attack_damage2 change:repeating_move:attack_damage2attribute change:repeating_move:attack_damage2bonus change:repeating_move:attack_damagetype2 change:repeating_move:description", function(eventinfo) {
    update_moves();
    console.log("Updating PC Moves");
});

on("change:npc_acrobatics_bonus change:npc_athletics_bonus change:npc_charm_bonus change:npc_deceit_bonus change:npc_disguise_bonus change:npc_fine_arts_bonus change:npc_forgery_bonus change:npc_history_bonus change:npc_intuition_bonus change:npc_intimidation_bonus change:npc_investigation_bonus change:npc_medicine_bonus change:npc_navigation_bonus change:npc_perception_bonus change:npc_performance_bonus change:npc_persuade_bonus change:npc_discretion_bonus change:npc_stealth_bonus change:npc_survival_bonus", function(eventinfo) {
    update_npc_skills();
    console.log("Updating NPC Skills");
});

on("change:repeating_npcmove:name change:repeating_npcmove:attack_flag change:repeating_npcmove:attack_type change:repeating_npcmove:attack_range change:repeating_npcmove:attack_tohit change:repeating_npcmove:attack_bonus change:repeating_npcmove:attack_damage change:repeating_npcmove:attack_damage1attribute change:repeating_npcmove:attack_damage1bonus change:repeating_npcmove:attack_damagetype change:repeating_npcmove:attack_damage2 change:repeating_npcmove:attack_damage2attribute change:repeating_npcmove:attack_damage2bonus change:repeating_npcmove:attack_damagetype2 change:repeating_npcmove:description", function(eventinfo) {
    update_npc_moves();
    console.log("Updating NPC Moves");
});

on("change:repeating_npcmove-l:name change:repeating_npcmove-l:attack_flag change:repeating_npcmove-l:attack_type change:repeating_npcmove-l:attack_range change:repeating_npcmove-l:attack_tohit change:repeating_npcmove-l:attack_bonus change:repeating_npcmove-l:attack_damage change:repeating_npcmove-l:attack_damage1attribute change:repeating_npcmove-l:attack_damage1bonus change:repeating_npcmove-l:attack_damagetype change:repeating_npcmove-l:attack_damage2 change:repeating_npcmove-l:attack_damage2attribute change:repeating_npcmove-l:attack_damage2bonus change:repeating_npcmove-l:attack_damagetype2 change:repeating_npcmove-l:description", function(eventinfo) {
    update_npc_legendary_moves();
    console.log("Updating NPC Legendary Moves");
});

on("change:evasion-base change:evasion-limit change:evasion-bonus", function(eventinfo) {
    update_evasion();
    console.log("Updating PC Evasion");
});

on("change:durability-base change:durability-limit change:durability-bonus", function(eventinfo) {
    update_durability();
    console.log("Updating PC Durability");
});

on("change:reduction-base change:reduction-armour change:reduction-bonus", function(eventinfo) {
    update_reduction();
    console.log("Updating PC Damage Reduction");
});

on("change:dtype", function(eventinfo) {
    if (eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
        return;
    }
    update_npc_moves();
    update_moves();
    update_npc_legendary_moves();
    console.log("Updating DType");
});

on("change:repeating_inventory:itemcontainer change:repeating_inventory:equipped change:repeating_inventory:carried change:repeating_inventory:itemweight change:repeating_inventory:itemcount change:encumberance_setting change:carrying_capacity_mod change:use_inventory_slots change:inventory_slots_mod change:repeating_inventory:itemweightfixed change:repeating_inventory:itemslotsfixed change:repeating_inventory:itemsize change:repeating_inventory:itemcontainer_slots_modifier", function() {
    update_weight();
    console.log("Updating Weight");
});

on("change:repeating_inventory:itemmodifiers change:repeating_inventory:equipped change:repeating_inventory:carried", function(eventinfo) {
    if (eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
        return;
    }
    var itemid = eventinfo.sourceAttribute.substring(20, 40);
    getAttrs(["repeating_inventory_" + itemid + "_itemmodifiers"], function(v) {
        if (v["repeating_inventory_" + itemid + "_itemmodifiers"]) {
            check_itemmodifiers(v["repeating_inventory_" + itemid + "_itemmodifiers"], eventinfo.previousValue);
        };
    });
    console.log("Updating Item Modifiers");
});

on("remove:repeating_inventory", function(eventinfo) {
    var itemid = eventinfo.sourceAttribute.substring(20, 40);

    if (eventinfo.removedInfo && eventinfo.removedInfo["repeating_inventory_" + itemid + "_itemmodifiers"]) {
        check_itemmodifiers(eventinfo.removedInfo["repeating_inventory_" + itemid + "_itemmodifiers"]);
    }

    update_weight();
    console.log("Updating Weight");
    console.log("Updating Item Modifiers");
});

var update_npc_skills = function() {
    getAttrs(["npc_acrobatics_bonus", "npc_athletics_bonus", "npc_charm_bonus", "npc_deceit_bonus", "npc_disguise_bonus", "npc_fine_arts_bonus", "npc_forgery_bonus", "npc_history_bonus", "npc_intuition_bonus", "npc_intimidation_bonus", "npc_investigation_bonus", "npc_medicine_bonus", "npc_navigation_bonus", "npc_perception_bonus", "npc_performance_bonus", "npc_persuade_bonus", "npc_discretion_bonus", "npc_stealth_bonus", "npc_survival_bonus", "agility", "power", "mental_strength", "appearance", "qi_control"], function(v) {
        var update = {};   

        // Calculate base values
        var agility = parseInt(v.agility) || 0;
        var power = parseInt(v.power) || 0;
        var mental_strength = parseInt(v.mental_strength) || 0;
        var appearance = parseInt(v.appearance) || 0;
        var qi_control = parseInt(v.qi_control) || 0;

        update["npc_acrobatics_roll"] = agility;
        update["npc_athletics_roll"] = power;
        update["npc_charm_roll"] = Math.round(mental_strength + appearance);
        update["npc_deceit_roll"] = Math.round(mental_strength + appearance);
        update["npc_discretion_roll"] = agility;
        update["npc_disguise_roll"] = Math.round(mental_strength + appearance);
        update["npc_fine_arts_roll"] = Math.round(agility / 2 + mental_strength / 2);
        update["npc_forgery_roll"] = Math.round(agility / 2 + mental_strength / 2);
        update["npc_history_roll"] = Math.round(qi_control / 2 + mental_strength / 2);
        update["npc_intuition_roll"] = mental_strength;
        update["npc_intimidation_roll"] = Math.round(power + appearance);
        update["npc_investigation_roll"] = mental_strength;
        update["npc_medicine_roll"] = Math.round(qi_control / 2 + mental_strength / 2);
        update["npc_navigation_roll"] = Math.round(agility / 2 + mental_strength / 2);
        update["npc_perception_roll"] = mental_strength;
        update["npc_performance_roll"] = Math.round(agility + appearance);
        update["npc_persuade_roll"] = Math.round(mental_strength + appearance);
        update["npc_stealth_roll"] = agility;
        update["npc_survival_roll"] = Math.round(power / 2 + mental_strength / 2);

        // Calculate full rolls
        update["npc_acrobatics"] = update["npc_acrobatics_roll"] + (parseInt(v.npc_acrobatics_bonus) ? `d6 + ${parseInt(v.npc_acrobatics_bonus)}` : 'd6');
        update["npc_athletics"] = update["npc_athletics_roll"] + (parseInt(v.npc_athletics_bonus) ? `d6 + ${parseInt(v.npc_athletics_bonus)}` : 'd6');
        update["npc_charm"] = update["npc_charm_roll"] + (parseInt(v.npc_charm_bonus) ? `d6 + ${parseInt(v.npc_charm_bonus)}` : 'd6');
        update["npc_deceit"] = update["npc_deceit_roll"] + (parseInt(v.npc_deceit_bonus) ? `d6 + ${parseInt(v.npc_deceit_bonus)}` : 'd6');
        update["npc_discretion"] = update["npc_discretion_roll"] + (parseInt(v.npc_discretion_bonus) ? `d6 + ${parseInt(v.npc_discretion_bonus)}` : 'd6');
        update["npc_disguise"] = update["npc_disguise_roll"] + (parseInt(v.npc_disguise_bonus) ? `d6 + ${parseInt(v.npc_disguise_bonus)}` : 'd6');
        update["npc_fine_arts"] = update["npc_fine_arts_roll"] + (parseInt(v.npc_fine_arts_bonus) ? `d6 + ${parseInt(v.npc_fine_arts_bonus)}` : 'd6');
        update["npc_forgery"] = update["npc_forgery_roll"] + (parseInt(v.npc_forgery_bonus) ? `d6 + ${parseInt(v.npc_forgery_bonus)}` : 'd6');
        update["npc_history"] = update["npc_history_roll"] + (parseInt(v.npc_history_bonus) ? `d6 + ${parseInt(v.npc_history_bonus)}` : 'd6');
        update["npc_intuition"] = update["npc_intuition_roll"] + (parseInt(v.npc_intuition_bonus) ? `d6 + ${parseInt(v.npc_intuition_bonus)}` : 'd6');
        update["npc_intimidation"] = update["npc_intimidation_roll"] + (parseInt(v.npc_intimidation_bonus) ? `d6 + ${parseInt(v.npc_intimidation_bonus)}` : 'd6');
        update["npc_investigation"] = update["npc_investigation_roll"] + (parseInt(v.npc_investigation_bonus) ? `d6 + ${parseInt(v.npc_investigation_bonus)}` : 'd6');
        update["npc_medicine"] = update["npc_medicine_roll"] + (parseInt(v.npc_medicine_bonus) ? `d6 + ${parseInt(v.npc_medicine_bonus)}` : 'd6');
        update["npc_navigation"] = update["npc_navigation_roll"] + (parseInt(v.npc_navigation_bonus) ? `d6 + ${parseInt(v.npc_navigation_bonus)}` : 'd6');
        update["npc_perception"] = update["npc_perception_roll"] + (parseInt(v.npc_perception_bonus) ? `d6 + ${parseInt(v.npc_perception_bonus)}` : 'd6');
        update["npc_performance"] = update["npc_performance_roll"] + (parseInt(v.npc_performance_bonus) ? `d6 + ${parseInt(v.npc_performance_bonus)}` : 'd6');
        update["npc_persuade"] = update["npc_persuade_roll"] + (parseInt(v.npc_persuade_bonus) ? `d6 + ${parseInt(v.npc_persuade_bonus)}` : 'd6');
        update["npc_stealth"] = update["npc_stealth_roll"] + (parseInt(v.npc_stealth_bonus) ? `d6 + ${parseInt(v.npc_stealth_bonus)}` : 'd6');
        update["npc_survival"] = update["npc_survival_roll"] + (parseInt(v.npc_survival_bonus) ? `d6 + ${parseInt(v.npc_survival_bonus)}` : 'd6');

        setAttrs(update, {
            silent: true
        });
    });
};

var update_skills = function() {
    getAttrs(["acrobatics_bonus", "athletics_bonus", "charm_bonus", "deceit_bonus", "disguise_bonus", "fine_arts_bonus", "forgery_bonus", "history_bonus", "intuition_bonus", "intimidation_bonus", "investigation_bonus", "medicine_bonus", "navigation_bonus", "perception_bonus", "performance_bonus", "persuade_bonus", "discretion_bonus", "stealth_bonus", "survival_bonus", "agility", "power", "mental_strength", "appearance", "qi_control"], function(v) {
        var update = {};

        // Calculate base values
        var agility = parseInt(v.agility) || 0;
        var power = parseInt(v.power) || 0;
        var mental_strength = parseInt(v.mental_strength) || 0;
        var appearance = parseInt(v.appearance) || 0;
        var qi_control = parseInt(v.qi_control) || 0;

        update["acrobatics_roll"] = agility;
        update["athletics_roll"] = power;
        update["charm_roll"] = Math.round(mental_strength + appearance);
        update["deceit_roll"] = Math.round(mental_strength + appearance);
        update["discretion_roll"] = agility;
        update["disguise_roll"] = Math.round(mental_strength + appearance);
        update["fine_arts_roll"] = Math.round(agility / 2 + mental_strength / 2);
        update["forgery_roll"] = Math.round(agility / 2 + mental_strength / 2);
        update["history_roll"] = Math.round(qi_control / 2 + mental_strength / 2);
        update["intuition_roll"] = mental_strength;
        update["intimidation_roll"] = Math.round(power + appearance);
        update["investigation_roll"] = mental_strength;
        update["medicine_roll"] = Math.round(qi_control / 2 + mental_strength / 2);
        update["navigation_roll"] = Math.round(agility / 2 + mental_strength / 2);
        update["perception_roll"] = mental_strength;
        update["performance_roll"] = Math.round(agility + appearance);
        update["persuade_roll"] = Math.round(mental_strength + appearance);
        update["stealth_roll"] = agility;
        update["survival_roll"] = Math.round(power / 2 + mental_strength / 2);

        // Calculate full rolls
        update["acrobatics"] = update["acrobatics_roll"] + (parseInt(v.acrobatics_bonus) ? `d6 + ${parseInt(v.acrobatics_bonus)}` : 'd6');
        update["athletics"] = update["athletics_roll"] + (parseInt(v.athletics_bonus) ? `d6 + ${parseInt(v.athletics_bonus)}` : 'd6');
        update["charm"] = update["charm_roll"] + (parseInt(v.charm_bonus) ? `d6 + ${parseInt(v.charm_bonus)}` : 'd6');
        update["deceit"] = update["deceit_roll"] + (parseInt(v.deceit_bonus) ? `d6 + ${parseInt(v.deceit_bonus)}` : 'd6');
        update["disguise"] = update["disguise_roll"] + (parseInt(v.disguise_bonus) ? `d6 + ${parseInt(v.disguise_bonus)}` : 'd6');
        update["fine_arts"] = update["fine_arts_roll"] + (parseInt(v.fine_arts_bonus) ? `d6 + ${parseInt(v.fine_arts_bonus)}` : 'd6');
        update["forgery"] = update["forgery_roll"] + (parseInt(v.forgery_bonus) ? `d6 + ${parseInt(v.forgery_bonus)}` : 'd6');
        update["history"] = update["history_roll"] + (parseInt(v.history_bonus) ? `d6 + ${parseInt(v.history_bonus)}` : 'd6');
        update["intuition"] = update["intuition_roll"] + (parseInt(v.intuition_bonus) ? `d6 + ${parseInt(v.intuition_bonus)}` : 'd6');
        update["intimidation"] = update["intimidation_roll"] + (parseInt(v.intimidation_bonus) ? `d6 + ${parseInt(v.intimidation_bonus)}` : 'd6');
        update["investigation"] = update["investigation_roll"] + (parseInt(v.investigation_bonus) ? `d6 + ${parseInt(v.investigation_bonus)}` : 'd6');
        update["medicine"] = update["medicine_roll"] + (parseInt(v.medicine_bonus) ? `d6 + ${parseInt(v.medicine_bonus)}` : 'd6');
        update["navigation"] = update["navigation_roll"] + (parseInt(v.navigation_bonus) ? `d6 + ${parseInt(v.navigation_bonus)}` : 'd6');
        update["perception"] = update["perception_roll"] + (parseInt(v.perception_bonus) ? `d6 + ${parseInt(v.perception_bonus)}` : 'd6');
        update["performance"] = update["performance_roll"] + (parseInt(v.performance_bonus) ? `d6 + ${parseInt(v.performance_bonus)}` : 'd6');
        update["persuade"] = update["persuade_roll"] + (parseInt(v.persuade_bonus) ? `d6 + ${parseInt(v.persuade_bonus)}` : 'd6');
        update["discretion"] = update["discretion_roll"] + (parseInt(v.discretion_bonus) ? `d6 + ${parseInt(v.discretion_bonus)}` : 'd6');
        update["stealth"] = update["stealth_roll"] + (parseInt(v.stealth_bonus) ? `d6 + ${parseInt(v.stealth_bonus)}` : 'd6');
        update["survival"] = update["survival_roll"] + (parseInt(v.survival_bonus) ? `d6 + ${parseInt(v.survival_bonus)}` : 'd6');

        setAttrs(update, {
            silent: true
        });
    });
};

var update_moves = function() {
    getSectionIDs("repeating_move", function(idarray) {
        _.each(idarray, function(id) {
            getAttrs([
                `repeating_move_${id}_name`,
                `repeating_move_${id}_attack_flag`,
                `repeating_move_${id}_attack_range`,
                `repeating_move_${id}_attack_tohit`,
                `repeating_move_${id}_attack_bonus`,
                `repeating_move_${id}_attack_damage`,
                `repeating_move_${id}_attack_damage1attribute`,
                `repeating_move_${id}_attack_damage1bonus`,
                `repeating_move_${id}_attack_damagetype`,
                `repeating_move_${id}_attack_damage2`,
                `repeating_move_${id}_attack_damage2attribute`,
                `repeating_move_${id}_attack_damage2bonus`,
                `repeating_move_${id}_attack_damagetype2`,
                `repeating_move_${id}_description`,
                "power", "agility", "vitality", "cultivation", "qi_control", "mental_strength", "dtype"
            ], function(v) {
                var update = {};

                var attackFlag = v[`repeating_move_${id}_attack_flag`] === "on" ? 1 : 0;
                var atkFlag = (attackFlag === 1) ? "{{attack=1}}" : "";

                var attackRange = v[`repeating_move_${id}_attack_range`];
                var attackToHit = v[`repeating_move_${id}_attack_tohit`].replace("@{", "").replace("}", "");
                var attackBonus = parseInt(v[`repeating_move_${id}_attack_bonus`]) || 0;

                var damage1 = v[`repeating_move_${id}_attack_damage`];
                var damage1Attribute = v[`repeating_move_${id}_attack_damage1attribute`];
                var damage1Bonus = parseInt(v[`repeating_move_${id}_attack_damage1bonus`]) || 0;
                var damage1Type = v[`repeating_move_${id}_attack_damagetype`];

                var damage2 = v[`repeating_move_${id}_attack_damage2`];
                var damage2Attribute = v[`repeating_move_${id}_attack_damage2attribute`];
                var damage2Bonus = parseInt(v[`repeating_move_${id}_attack_damage2bonus`]) || 0;
                var damage2Type = v[`repeating_move_${id}_attack_damagetype2`];

                var damage_flag = "";
                if (damage1 != "" || damage2 != "") {
                    damage_flag = damage_flag + "{{damage=1}} ";
                }
                if (damage1 != "") {
                    damage_flag = damage_flag + "{{dmg1flag=1}} ";
                }
                if (damage2 != "") {
                    damage_flag = damage_flag + "{{dmg2flag=1}} ";
                }

                var description = v[`repeating_move_${id}_description`];

                var toHitValue = parseInt(v[attackToHit.replace("@{", "").replace("}", "")]) || 0;
                var toHitString = attackBonus !== 0 ? `${toHitValue} + ${attackBonus}` : `${toHitValue}`;

                var damage1AttrValue = damage1Attribute !== "none" ? (parseInt(v[damage1Attribute.replace("@{", "").replace("}", "")]) || 0) : 0;
                var damage1String = `${damage1} + ${damage1AttrValue} + ${damage1Bonus}`;

                var damage2AttrValue = damage2Attribute !== "none" ? (parseInt(v[damage2Attribute.replace("@{", "").replace("}", "")]) || 0) : 0;
                var damage2String = `${damage2} + ${damage2AttrValue} + ${damage2Bonus}`;

                var details = `${toHitString}, Reach: ${attackRange}\n`;
                details += `Damage: (${damage1String}) ${damage1Type}`;
                if (damage2) {
                    details += ` + (${damage2String}) ${damage2Type}`;
                }
                details += `\nDescription: ${description}`;

                var rollbase = "";
                if (v.dtype === "full") {
                    rollbase = `@{wtype}&{template:move} {{range=${attackRange}}} {{rname=@{name}}} ${atkFlag} ${damage_flag} {{r1=[[@{${attackToHit}}+${attackBonus}]]}} `;
                    if (damage1) {
                        rollbase += `{{dmg1=[[@{attack_damage} + [[${damage1AttrValue}]] + [[${damage1Bonus}]] ]]}} {{dmg1type=${damage1Type}}} `;
                    }
                    if (damage2) {
                        rollbase += `{{dmg2=[[@{attack_damage2} + [[${damage2AttrValue}]] + [[${damage2Bonus}]] ]]}} {{dmg2type=${damage2Type}}} `;
                    }
                } else if (attackFlag) {
                    rollbase = `@{wtype}&{template:atk} ${atkFlag} ${damage_flag} {{range=${attackRange}}} {{rname=[@{name}](~repeating_move_dmg)}} {{type=[Attack](~repeating_move_dmg)}} {{r1=[[@{${attackToHit}}+${attackBonus}]]}} {{description=${description}}}`;
                } else if (damage1 || damage2) {
                    rollbase = `@{wtype}&{template:dmg} ${damage_flag} `;
                    if (damage1) {
                        rollbase += `{{dmg1=[[@{attack_damage} + ${damage1AttrValue} + ${damage1Bonus}]]}} {{dmg1type=${damage1Type}}} `;
                    }
                    if (damage2) {
                        rollbase += `{{dmg2=[[@{attack_damage2} + ${damage2AttrValue} + ${damage2Bonus}]]}} {{dmg2type=${damage2Type}}} `;
                    }
                } else {
                    rollbase = `@{wtype}&{template:move} {{rname=@{name}}} {{description=${description}}}`;
                }

                var full_damage = `@{wtype}&{template:dmg} ${damage_flag} `;
                if (damage1) {
                    full_damage += `{{dmg1=[[@{attack_damage} + ${damage1AttrValue} + ${damage1Bonus}]]}} {{dmg1type=${damage1Type}}} `;
                }
                if (damage2) {
                    full_damage += `{{dmg2=[[@{attack_damage2} + ${damage2AttrValue} + ${damage2Bonus}]]}} {{dmg2type=${damage2Type}}} `;
                }

                update[`repeating_move_${id}_attack_details`] = details;
                update[`repeating_move_${id}_attack_hitdamage`] = `Hit: ${toHitString}, (${attackRange}), Damage: (${damage1String}) ${damage1Type}`;
                if (damage2) {
                    update[`repeating_move_${id}_attack_hitdamage`] += ` + (${damage2String}) ${damage2Type}`;
                }
                update[`repeating_move_${id}_attack_description`] = description;
                update[`repeating_move_${id}_rollbase`] = rollbase;
                update[`repeating_move_${id}_damage_flag`] = damage_flag;
                update[`repeating_move_${id}_full_damage`] = full_damage;

                setAttrs(update, { silent: true });
            });
        });
    });
};

var update_npc_moves = function() {
    getSectionIDs("repeating_npcmove", function(idarray) {
        _.each(idarray, function(id) {
            getAttrs([
                `repeating_npcmove_${id}_name`,
                `repeating_npcmove_${id}_attack_flag`,
                `repeating_npcmove_${id}_attack_type`,
                `repeating_npcmove_${id}_attack_range`,
                `repeating_npcmove_${id}_attack_tohit`,
                `repeating_npcmove_${id}_attack_bonus`,
                `repeating_npcmove_${id}_attack_damage`,
                `repeating_npcmove_${id}_attack_damage1attribute`,
                `repeating_npcmove_${id}_attack_damage1bonus`,
                `repeating_npcmove_${id}_attack_damagetype`,
                `repeating_npcmove_${id}_attack_damage2`,
                `repeating_npcmove_${id}_attack_damage2attribute`,
                `repeating_npcmove_${id}_attack_damage2bonus`,
                `repeating_npcmove_${id}_attack_damagetype2`,
                `repeating_npcmove_${id}_description`,
                "power", "agility", "vitality", "cultivation", "qi_control", "mental_strength", "dtype"
            ], function(v) {
                var update = {};

                var attackFlag = v[`repeating_npcmove_${id}_attack_flag`] === "on" ? 1 : 0;
                var atkFlag = (attackFlag === 1) ? "{{attack=1}}" : "";

                var attackType = v[`repeating_npcmove_${id}_attack_type`];
                var attackRange = v[`repeating_npcmove_${id}_attack_range`];
                var attackToHit = v[`repeating_npcmove_${id}_attack_tohit`].replace("@{", "").replace("}", "");
                var attackBonus = parseInt(v[`repeating_npcmove_${id}_attack_bonus`]) || 0;

                var damage1 = v[`repeating_npcmove_${id}_attack_damage`];
                var damage1Attribute = v[`repeating_npcmove_${id}_attack_damage1attribute`];
                var damage1Bonus = parseInt(v[`repeating_npcmove_${id}_attack_damage1bonus`]) || 0;
                var damage1Type = v[`repeating_npcmove_${id}_attack_damagetype`];

                var damage2 = v[`repeating_npcmove_${id}_attack_damage2`];
                var damage2Attribute = v[`repeating_npcmove_${id}_attack_damage2attribute`];
                var damage2Bonus = parseInt(v[`repeating_npcmove_${id}_attack_damage2bonus`]) || 0;
                var damage2Type = v[`repeating_npcmove_${id}_attack_damagetype2`];

                var damage_flag = "";
                if (damage1 != "" || damage2 != "") {
                    damage_flag = damage_flag + "{{damage=1}} ";
                }
                if (damage1 != "") {
                    damage_flag = damage_flag + "{{dmg1flag=1}} ";
                }
                if (damage2 != "") {
                    damage_flag = damage_flag + "{{dmg2flag=1}} ";
                }

                var description = v[`repeating_npcmove_${id}_description`];

                var toHitValue = parseInt(v[attackToHit.replace("@{", "").replace("}", "")]) || 0;
                var toHitString = attackBonus !== 0 ? `${toHitValue} + ${attackBonus}` : `${toHitValue}`;

                var damage1AttrValue = damage1Attribute !== "none" ? (parseInt(v[damage1Attribute.replace("@{", "").replace("}", "")]) || 0) : 0;
                var damage1String = `${damage1} + ${damage1AttrValue} + ${damage1Bonus}`;
                var avgDamage1 = calculateAverageDamage(damage1) + damage1AttrValue + damage1Bonus;

                var damage2AttrValue = damage2Attribute !== "none" ? (parseInt(v[damage2Attribute.replace("@{", "").replace("}", "")]) || 0) : 0;
                var damage2String = `${damage2} + ${damage2AttrValue} + ${damage2Bonus}`;
                var avgDamage2 = calculateAverageDamage(damage2) + damage2AttrValue + damage2Bonus;

                var details = `${attackType} Weapon Attack: ${toHitString}, Reach: ${attackRange}\n`;
                details += `Damage: ${avgDamage1} (${damage1String}) ${damage1Type}`;
                if (damage2) {
                    details += ` + ${avgDamage2} (${damage2String}) ${damage2Type}`;
                }
                details += `\nDescription: ${description}`;

                var rollbase = "";
                if (v.dtype === "full") {
                    rollbase = `@{wtype}&{template:move} {{range=${attackRange}}} {{rname=@{name}}} ${atkFlag} ${damage_flag} {{r1=[[@{${attackToHit}}+${attackBonus}]]}} `;
                    if (damage1) {
                        rollbase += `{{dmg1=[[@{attack_damage} + [[${damage1AttrValue}]] + [[${damage1Bonus}]] ]]}} {{dmg1type=${damage1Type}}} `;
                    }
                    if (damage2) {
                        rollbase += `{{dmg2=[[@{attack_damage2} + [[${damage2AttrValue}]] + [[${damage2Bonus}]] ]]}} {{dmg2type=${damage2Type}}} `;
                    }
                } else if (attackFlag) {
                    rollbase = `@{wtype}&{template:atk} ${atkFlag} ${damage_flag} {{range=${attackRange}}} {{rname=[@{name}](~repeating_npcmove_npc_dmg)}} {{type=[Attack](~repeating_npcmove_npc_dmg)}} {{r1=[[@{${attackToHit}}+${attackBonus}]]}} {{description=${description}}}`;
                } else if (damage1 || damage2) {
                    rollbase = `@{wtype}&{template:dmg} ${damage_flag} `;
                    if (damage1) {
                        rollbase += `{{dmg1=[[@{attack_damage} + ${damage1AttrValue} + ${damage1Bonus}]]}} {{dmg1type=${damage1Type}}} `;
                    }
                    if (damage2) {
                        rollbase += `{{dmg2=[[@{attack_damage2} + ${damage2AttrValue} + ${damage2Bonus}]]}} {{dmg2type=${damage2Type}}} `;
                    }
                } else {
                    rollbase = `@{wtype}&{template:move} {{rname=@{name}}} {{description=${description}}}`;
                }

                var full_damage = `@{wtype}&{template:dmg} ${damage_flag} `;
                if (damage1) {
                    full_damage += `{{dmg1=[[@{attack_damage} + ${damage1AttrValue} + ${damage1Bonus}]]}} {{dmg1type=${damage1Type}}} `;
                }
                if (damage2) {
                    full_damage += `{{dmg2=[[@{attack_damage2} + ${damage2AttrValue} + ${damage2Bonus}]]}} {{dmg2type=${damage2Type}}} `;
                }

                update[`repeating_npcmove_${id}_attack_details`] = details;
                update[`repeating_npcmove_${id}_attack_tohitrange`] = `To Hit: ${toHitString}, Range: ${attackRange}`;
                update[`repeating_npcmove_${id}_attack_onhit`] = `Damage: ${avgDamage1} (${damage1String}) ${damage1Type}`;
                if (damage2) {
                    update[`repeating_npcmove_${id}_attack_onhit`] += ` + ${avgDamage2} (${damage2String}) ${damage2Type}`;
                }
                update[`repeating_npcmove_${id}_attack_description`] = description;
                update[`repeating_npcmove_${id}_rollbase`] = rollbase;
                update[`repeating_npcmove_${id}_damage_flag`] = damage_flag;
                update[`repeating_npcmove_${id}_full_damage`] = full_damage;

                setAttrs(update, { silent: true });
            });
        });
    });
};

var update_npc_legendary_moves = function() {
    getSectionIDs("repeating_npcmove-l", function(idarray) {
        _.each(idarray, function(id) {
            getAttrs([
                `repeating_npcmove-l_${id}_name`,
                `repeating_npcmove-l_${id}_attack_flag`,
                `repeating_npcmove-l_${id}_attack_type`,
                `repeating_npcmove-l_${id}_attack_range`,
                `repeating_npcmove-l_${id}_attack_tohit`,
                `repeating_npcmove-l_${id}_attack_bonus`,
                `repeating_npcmove-l_${id}_attack_damage`,
                `repeating_npcmove-l_${id}_attack_damage1attribute`,
                `repeating_npcmove-l_${id}_attack_damage1bonus`,
                `repeating_npcmove-l_${id}_attack_damagetype`,
                `repeating_npcmove-l_${id}_attack_damage2`,
                `repeating_npcmove-l_${id}_attack_damage2attribute`,
                `repeating_npcmove-l_${id}_attack_damage2bonus`,
                `repeating_npcmove-l_${id}_attack_damagetype2`,
                `repeating_npcmove-l_${id}_description`,
                "power", "agility", "vitality", "cultivation", "qi_control", "mental_strength", "dtype"
            ], function(v) {
                var update = {};

                var attackFlag = v[`repeating_npcmove-l_${id}_attack_flag`] === "on" ? 1 : 0;
                var atkFlag = (attackFlag === 1) ? "{{attack=1}}" : "";

                var attackType = v[`repeating_npcmove-l_${id}_attack_type`];
                var attackRange = v[`repeating_npcmove-l_${id}_attack_range`];
                var attackToHit = v[`repeating_npcmove-l_${id}_attack_tohit`].replace("@{", "").replace("}", "");
                var attackBonus = parseInt(v[`repeating_npcmove-l_${id}_attack_bonus`]) || 0;

                var damage1 = v[`repeating_npcmove-l_${id}_attack_damage`];
                var damage1Attribute = v[`repeating_npcmove-l_${id}_attack_damage1attribute`];
                var damage1Bonus = parseInt(v[`repeating_npcmove-l_${id}_attack_damage1bonus`]) || 0;
                var damage1Type = v[`repeating_npcmove-l_${id}_attack_damagetype`];

                var damage2 = v[`repeating_npcmove-l_${id}_attack_damage2`];
                var damage2Attribute = v[`repeating_npcmove-l_${id}_attack_damage2attribute`];
                var damage2Bonus = parseInt(v[`repeating_npcmove-l_${id}_attack_damage2bonus`]) || 0;
                var damage2Type = v[`repeating_npcmove-l_${id}_attack_damagetype2`];

                var damage_flag = "";
                if (damage1 != "" || damage2 != "") {
                    damage_flag = damage_flag + "{{damage=1}} ";
                }
                if (damage1 != "") {
                    damage_flag = damage_flag + "{{dmg1flag=1}} ";
                }
                if (damage2 != "") {
                    damage_flag = damage_flag + "{{dmg2flag=1}} ";
                }

                var description = v[`repeating_npcmove-l_${id}_description`];

                var toHitValue = parseInt(v[attackToHit.replace("@{", "").replace("}", "")]) || 0;
                var toHitString = attackBonus !== 0 ? `${toHitValue} + ${attackBonus}` : `${toHitValue}`;

                var damage1AttrValue = damage1Attribute !== "none" ? (parseInt(v[damage1Attribute.replace("@{", "").replace("}", "")]) || 0) : 0;
                var damage1String = `${damage1} + ${damage1AttrValue} + ${damage1Bonus}`;
                var avgDamage1 = calculateAverageDamage(damage1) + damage1AttrValue + damage1Bonus;

                var damage2AttrValue = damage2Attribute !== "none" ? (parseInt(v[damage2Attribute.replace("@{", "").replace("}", "")]) || 0) : 0;
                var damage2String = `${damage2} + ${damage2AttrValue} + ${damage2Bonus}`;
                var avgDamage2 = calculateAverageDamage(damage2) + damage2AttrValue + damage2Bonus;

                var details = `${attackType} Weapon Attack: ${toHitString}, Reach: ${attackRange}\n`;
                details += `Damage: ${avgDamage1} (${damage1String}) ${damage1Type}`;
                if (damage2) {
                    details += ` + ${avgDamage2} (${damage2String}) ${damage2Type}`;
                }
                details += `\nDescription: ${description}`;

                var rollbase = "";
                if (v.dtype === "full") {
                    rollbase = `@{wtype}&{template:move} {{range=${attackRange}}} {{rname=@{name}}} ${atkFlag} ${damage_flag} {{r1=[[@{${attackToHit}}+${attackBonus}]]}} `;
                    if (damage1) {
                        rollbase += `{{dmg1=[[@{attack_damage} + [[${damage1AttrValue}]] + [[${damage1Bonus}]] ]]}} {{dmg1type=${damage1Type}}} `;
                    }
                    if (damage2) {
                        rollbase += `{{dmg2=[[@{attack_damage2} + [[${damage2AttrValue}]] + [[${damage2Bonus}]] ]]}} {{dmg2type=${damage2Type}}} `;
                    }
                } else if (attackFlag) {
                    rollbase = `@{wtype}&{template:atk} ${atkFlag} ${damage_flag} {{range=${attackRange}}} {{rname=[@{name}](~repeating_npcmove-l_npc_dmg)}} {{type=[Attack](~repeating_npcmove-l_npc_dmg)}} {{r1=[[@{${attackToHit}}+${attackBonus}]]}} {{description=${description}}}`;
                } else if (damage1 || damage2) {
                    rollbase = `@{wtype}&{template:dmg} ${damage_flag} `;
                    if (damage1) {
                        rollbase += `{{dmg1=[[@{attack_damage} + ${damage1AttrValue} + ${damage1Bonus}]]}} {{dmg1type=${damage1Type}}} `;
                    }
                    if (damage2) {
                        rollbase += `{{dmg2=[[@{attack_damage2} + ${damage2AttrValue} + ${damage2Bonus}]]}} {{dmg2type=${damage2Type}}} `;
                    }
                } else {
                    rollbase = `@{wtype}&{template:move} {{rname=@{name}}} {{description=${description}}}`;
                }

                var full_damage = `@{wtype}&{template:dmg} ${damage_flag} `;
                if (damage1) {
                    full_damage += `{{dmg1=[[@{attack_damage} + ${damage1AttrValue} + ${damage1Bonus}]]}} {{dmg1type=${damage1Type}}} `;
                }
                if (damage2) {
                    full_damage += `{{dmg2=[[@{attack_damage2} + ${damage2AttrValue} + ${damage2Bonus}]]}} {{dmg2type=${damage2Type}}} `;
                }

                update[`repeating_npcmove-l_${id}_attack_details`] = details;
                update[`repeating_npcmove-l_${id}_attack_tohitrange`] = `To Hit: ${toHitString}, Range: ${attackRange}`;
                update[`repeating_npcmove-l_${id}_attack_onhit`] = `Damage: ${avgDamage1} (${damage1String}) ${damage1Type}`;
                if (damage2) {
                    update[`repeating_npcmove-l_${id}_attack_onhit`] += ` + ${avgDamage2} (${damage2String}) ${damage2Type}`;
                }
                update[`repeating_npcmove-l_${id}_attack_description`] = description;
                update[`repeating_npcmove-l_${id}_rollbase`] = rollbase;
                update[`repeating_npcmove-l_${id}_damage_flag`] = damage_flag;
                update[`repeating_npcmove-l_${id}_full_damage`] = full_damage;

                setAttrs(update, { silent: true });
            });
        });
    });
};

var update_initiative = function(){
    getAttrs(["agility","initiative_bonus"], function(v){
        var update = {};

        var agility = parseInt(v.agility) || 0;

        update["initiative"] = agility + (parseInt(v.agility) ? `d6 + ${parseInt(v.initiative_bonus)}` : 'd6');

        setAttrs(update, {
            silent: true
        });
    });
};

var update_evasion = function() {
    getAttrs(["evasion-base", "evasion-limit", "evasion-bonus", "agility"], function(v) {
        var update = {};

        var agility = parseInt(v.agility) || 0;
        var base = parseInt(v["evasion-base"]) || 0;
        var limit = parseInt(v["evasion-limit"]) || 0;
        var bonus = parseInt(v["evasion-bonus"]) || 0;

        if (agility < limit) {
            update["evasion-full"] = base + agility + bonus;
        } else {
            update["evasion-full"] = base + limit + Math.floor((agility - limit) / 2) + bonus;
        }

        setAttrs(update, {
            silent: true
        });
    });
};

var update_durability = function(){
    getAttrs(["durability-base", "durability-limit", "durability-bonus", "power", "vitality", "mental_strength", "qi_control"], function(v) {
        var update = {};

        var base = parseInt(v["durability-base"]) || 0;
        var limit = parseInt(v["durability-limit"]) || 0;
        var bonus = parseInt(v["durability-bonus"]) || 0;

        update["durability-full"] = base + bonus;

        setAttrs(update, {
            silent: true
        });
    });
};

var update_reduction = function(){
    getAttrs(["reduction-base", "reduction-armour", "reduction-bonus"], function(v) {
        var update = {};

        var base = parseInt(v["reduction-base"]) || 0;
        var armour = parseInt(v["reduction-armour"]) || 0;
        var bonus = parseInt(v["reduction-bonus"]) || 0;

        update["reduction-full"] = base + armour + bonus;

        setAttrs(update, {
            silent: true
        });
    });
};

var calculateAverageDamage = function(damageString) {
    var dicePattern = /(\d+)d(\d+)/;
    var match = damageString.match(dicePattern);
    if (match) {
        var numberOfDice = parseInt(match[1]);
        var sidesOfDice = parseInt(match[2]);
        return numberOfDice * ((sidesOfDice / 2) + 0.5);
    }
    return 0;
};

var update_weight = function() {
    var update = {};
    var wtotal = 0;
    var stotal = 0; // ITEM SLOTS
    var weight_attrs = ["encumberance_setting", "power", "carrying_capacity_mod", "inventory_slots_mod", "use_inventory_slots", "itemweightfixed", "itemslotsfixed"];
    getSectionIDs("repeating_inventory", function(idarray) {
        _.each(idarray, function(currentID, i) {
            weight_attrs.push("repeating_inventory_" + currentID + "_itemweight");
            weight_attrs.push("repeating_inventory_" + currentID + "_itemcount");
            weight_attrs.push("repeating_inventory_" + currentID + "_itemsize");
            weight_attrs.push("repeating_inventory_" + currentID + "_equipped");
            weight_attrs.push("repeating_inventory_" + currentID + "_carried");
            weight_attrs.push("repeating_inventory_" + currentID + "_itemcontainer");
            weight_attrs.push("repeating_inventory_" + currentID + "_itemweightfixed");
            weight_attrs.push("repeating_inventory_" + currentID + "_itemslotsfixed");
            weight_attrs.push("repeating_inventory_" + currentID + "_itemcontainer_slots_modifier");
        });
        getAttrs(weight_attrs, function(v) {
            currencyOther = isNaN(parseInt(v.currency_value, 10)) === false ? parseInt(v.currency_value, 10) : 0;
            var slots_modifier = 0;

            _.each(idarray, function(currentID, i) {
                if (v["repeating_inventory_" + currentID + "_equipped"] == 1 || v["repeating_inventory_" + currentID + "_carried"] == 1) {
                    if (v["repeating_inventory_" + currentID + "_itemcontainer"] == 1) {
                        // GET SLOTS MODIFIER IF EQUIPPED
                        if (v["repeating_inventory_" + currentID + "_equipped"] == 1) {
                            var field_id = "repeating_inventory_" + currentID + "_itemcontainer_slots_modifier";
                            if (v[field_id]) {
                                if (["+", "-"].indexOf(v[field_id]) > -1) {
                                    var operator = v[field_id].substring(0, 1);
                                    var value = v[field_id].substring(1);
                                    if (isNaN(parseInt(value, 10)) === false) {
                                        if (operator == "+") {
                                            slots_modifier += parseInt(value, 10);
                                        } else if (operator == "-") {
                                            slots_modifier -= parseInt(value, 10);
                                        }
                                    }
                                } else {
                                    if (isNaN(parseInt(v[field_id], 10)) === false) {
                                        slots_modifier += parseInt(v[field_id], 10);
                                    }
                                }
                            }
                        }
                    } else {
                        // UPDATE WEIGHT
                        if (v["repeating_inventory_" + currentID + "_itemweight"] && isNaN(parseInt(v["repeating_inventory_" + currentID + "_itemweight"], 10)) === false) {
                            if (v["repeating_inventory_" + currentID + "_itemweightfixed"] == 1) {
                                wtotal += parseFloat(v["repeating_inventory_" + currentID + "_itemweight"]);
                            } else {
                                count = v["repeating_inventory_" + currentID + "_itemcount"] && isNaN(parseFloat(v["repeating_inventory_" + currentID + "_itemcount"])) === false ? parseFloat(v["repeating_inventory_" + currentID + "_itemcount"]) : 1;
                                wtotal = wtotal + (parseFloat(v["repeating_inventory_" + currentID + "_itemweight"]) * count);
                            }
                        }
                        // UPDATE SLOTS
                        if (v["repeating_inventory_" + currentID + "_itemsize"] && isNaN(parseInt(v["repeating_inventory_" + currentID + "_itemsize"], 10)) === false) {
                            if (v["repeating_inventory_" + currentID + "_itemslotsfixed"] == 1) {
                                stotal += parseFloat(v["repeating_inventory_" + currentID + "_itemsize"]);
                            } else {
                                count = v["repeating_inventory_" + currentID + "_itemcount"] && isNaN(parseFloat(v["repeating_inventory_" + currentID + "_itemcount"])) === false ? parseFloat(v["repeating_inventory_" + currentID + "_itemcount"]) : 1;
                                stotal = stotal + (parseFloat(v["repeating_inventory_" + currentID + "_itemsize"]) * count);
                            }
                        }
                    }
                }
            });

            // CAP TOTALS AT 2 DECIMAL PLACES
            wtotal = Math.round(wtotal * 100) / 100;
            stotal = Math.round(stotal * 100) / 100;

            update["weighttotal"] = wtotal;
            update["slotstotal"] = stotal;

            if (v["use_inventory_slots"] == 1) {

                var size_slots = 18;
                size_slots += parseInt(v.power, 10);

                if (v.inventory_slots_mod) {
                    var operator = v.inventory_slots_mod.substring(0, 1);
                    var value = v.inventory_slots_mod.substring(1);
                    if (["*", "x", "+", "-"].indexOf(operator) > -1 && isNaN(parseInt(value, 10)) === false) {
                        if (operator == "*" || operator == "x") {
                            size_slots *= parseInt(value, 10);
                        } else if (operator == "+") {
                            size_slots += parseInt(value, 10);
                        } else if (operator == "-") {
                            size_slots -= parseInt(value, 10);
                        }
                    }
                }

                size_slots += slots_modifier;

                update["slotsmaximum"] = size_slots;
                if (stotal > size_slots) {
                    update["encumberance"] = "OVER CARRYING CAPACITY";
                } else {
                    update["encumberance"] = " ";
                }

            } else {

                var str_base = parseInt(v.power, 10);
                var size_multiplier = 1;
                var str = str_base * size_multiplier;
                if (v.carrying_capacity_mod) {
                    var operator = v.carrying_capacity_mod.substring(0, 1);
                    var value = v.carrying_capacity_mod.substring(1);
                    if (["*", "x", "+", "-"].indexOf(operator) > -1 && isNaN(parseInt(value, 10)) === false) {
                        if (operator == "*" || operator == "x") {
                            str *= parseInt(value, 10);
                        } else if (operator == "+") {
                            str += parseInt(value, 10);
                        } else if (operator == "-") {
                            str -= parseInt(value, 10);
                        }
                    }
                }

                update["weightmaximum"] = str * 15;
                if (!v.encumberance_setting || v.encumberance_setting === "off") {
                    if (wtotal > str * 15) {
                        update["encumberance"] = "OVER CARRYING CAPACITY";
                    } else {
                        update["encumberance"] = " ";
                    }
                } else if (v.encumberance_setting === "on") {
                    if (wtotal > str * 15) {
                        update["encumberance"] = "IMMOBILE";
                    } else if (wtotal > str * 10) {
                        update["encumberance"] = "HEAVILY ENCUMBERED";
                    } else if (wtotal > str * 5) {
                        update["encumberance"] = "ENCUMBERED";
                    } else {
                        update["encumberance"] = " ";
                    }
                } else {
                    update["encumberance"] = " ";
                }
            }

            setAttrs(update, {
                silent: true
            });
        });
    });
};

var check_itemmodifiers = function(modifiers, previousValue) {
    var mods = modifiers.toLowerCase().split(",");
    if (previousValue) {
        prevmods = previousValue.toLowerCase().split(",");
        mods = _.union(mods, prevmods);
    };
    _.each(mods, function(mod) {
        if (mod.indexOf("power") > -1) {
            update_attr("power");
        };
        if (mod.indexOf("agility") > -1) {
            update_attr("agility");
        };
        if (mod.indexOf("vitality") > -1) {
            update_attr("vitality");
        };
        if (mod.indexOf("cultivation") > -1) {
            update_attr("cultivation");
        };
        if (mod.indexOf("qi_control") > -1) {
            update_attr("qi_control");
        };
        if (mod.indexOf("mental_strength") > -1) {
            update_attr("mental_strength");
        };
    });
};

var update_attr = function(attr) {
    var update = {};
    var attr_fields = [attr, attr + "_bonus"];
    getSectionIDs("repeating_inventory", function(idarray) {
        _.each(idarray, function(currentID, i) {
            attr_fields.push("repeating_inventory_" + currentID + "_equipped");
            attr_fields.push("repeating_inventory_" + currentID + "_itemmodifiers");
        });
        getAttrs(attr_fields, function(v) {
            var base = v[attr] && !isNaN(parseInt(v[attr], 10)) ? parseInt(v[attr], 10) : 10;
            var bonus = v[attr + "_bonus"] && !isNaN(parseInt(v[attr + "_bonus"], 10)) ? parseInt(v[attr + "_bonus"], 10) : 0;
            var item_base = 0;
            var item_bonus = 0;
            _.each(idarray, function(currentID) {
                if ((!v["repeating_inventory_" + currentID + "_equipped"] || v["repeating_inventory_" + currentID + "_equipped"] === "1") && v["repeating_inventory_" + currentID + "_itemmodifiers"] && v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().indexOf(attr > -1)) {
                    var mods = v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().split(",");
                    _.each(mods, function(mod) {
                        if (mod.indexOf(attr) > -1 && mod.indexOf("save") === -1) {
                            if (mod.indexOf(":") > -1) {
                                var new_base = !isNaN(parseInt(mod.replace(/[^0-9]/g, ""), 10)) ? parseInt(mod.replace(/[^0-9]/g, ""), 10) : false;
                                item_base = new_base && new_base > item_base ? new_base : item_base;
                            } else if (mod.indexOf("-") > -1) {
                                var new_mod = !isNaN(parseInt(mod.replace(/[^0-9]/g, ""), 10)) ? parseInt(mod.replace(/[^0-9]/g, ""), 10) : false;
                                item_bonus = new_mod ? item_bonus - new_mod : item_bonus;
                            } else {
                                var new_mod = !isNaN(parseInt(mod.replace(/[^0-9]/g, ""), 10)) ? parseInt(mod.replace(/[^0-9]/g, ""), 10) : false;
                                item_bonus = new_mod ? item_bonus + new_mod : item_bonus;
                            }
                        };
                    });
                }
            });

            update[attr] = bonus != 0 || item_bonus > 0 || item_base > base ? 1 : 0;
            base = base > item_base ? base : item_base;
            update[attr] = base + bonus + item_bonus;
            setAttrs(update);
        });
    });
};
