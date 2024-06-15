
const ancestryHPDie = {
    'None' : "1d8",
    'Angelic Echo' : "1d6",
    'Beastmen' : "1d10",
    'Demi-humans' : "1d8",
    'Demonic Beasts' : "1d12",
    'Divine Beasts' : "1d12",
    'Draconian' : "1d8",
    'Elemental Born' : "1d7",
    'Fallen' : "1d6",
    'Human' : "1d6",
    'Insectoid' : "1d7",
    'Living Golem' : "1d8",
    'Merfolk' : "1d8",
    'Mirotide' : "1d8",
    'Parasyte' : "1d6",
    'Sporlings' : "1d8",
    'Slime-kin' : "1d6",
    'Tiko' : "1d7",
    'Yokai' : "1d8",
    'Vampire' : "1d8",
    'Varkari' :"1d10"
}

var global_fields = ["global_attribute_mod", "global_dc_mod", "global_skill_mod", "global_attack_mod", "global_damage_mod"];

global_fields.forEach(field => {
    on(`change:${field}`, function() {
        ['power', 'agility', 'vitality', 'cultivation', 'qi_control', 'mental_strength'].forEach(attr => {
            update_attr(`${attr}`);
            update_mod(`${attr}`);
        });
        update_skills();
        update_moves();
        console.log("Updated for global modifiers change");
    });
});

['power', 'agility', 'vitality', 'cultivation', 'qi_control', 'mental_strength', 'appearance'].forEach(attr => {
    on(`change:${attr}_base change:${attr}_bonus`, function() {
        update_attr(`${attr}`);
    });
    on(`change:${attr} change:${attr}_dc_bonus`, function() {
        update_mod(`${attr}`);
    });
    console.log("Updating Attribute");
    console.log("Updating Attribute Modified Value");
});

on('change:tactical_advantage', function(eventInfo) {
    update_moves();
    console.log("Updating Advantage");
});

on('change:character_ancestry change:character_species', function(eventInfo) {
    getAttrs(["character_ancestry", "character_species", "hp_die"], function(v) {
        var update = {};

        let ancestry = v.character_ancestry;

        let baseHP = ancestryHPDie[ancestry] || "1d8";

        update["hp_die"] = baseHP;

        console.log("Updating Character Hit Die")
        
        setAttrs(update, {
            silent: true
        });
    });
});

on('change:character_ancestry', function() {
    getAttrs(['character_ancestry'], function(values) {
        const ancestry = values.character_ancestry.toLowerCase().replace(' ', '_').replace('-', '_');
        const updates = {
            ancestry_none: '0',
            ancestry_angelic_echo: '0',
            ancestry_beastmen: '0',
            ancestry_demi_humans: '0',
            ancestry_demonic_beasts: '0',
            ancestry_divine_beasts: '0',
            ancestry_draconian: '0',
            ancestry_elemental_born: '0',
            ancestry_fallen: '0',
            ancestry_human: '0',
            ancestry_insectoid: '0',
            ancestry_living_golem: '0',
            ancestry_merfolk: '0',
            ancestry_mirotide: '0',
            ancestry_parasyte: '0',
            ancestry_sporlings: '0',
            ancestry_slime_kin: '0',
            ancestry_tiko: '0',
            ancestry_yokai: '0',
            ancestry_vampire: '0',
            ancestry_varkari: '0'
        };
        if (ancestry) {
            updates[`ancestry_${ancestry}`] = '1';
            updates["character_species"] = "None";
        }
        setAttrs(updates);
    });
    console.log("Updating Ancestry");
});

on('change:character_path', function() {
    getAttrs(['character_path'], function(values) {
        const path = values.character_path.toLowerCase().replace(' ', '_');
        const updates = {
            path_none: '0',
            path_bioforged: '0',
            path_demonic_arts: '0',
            path_monk: '0',
            path_ronin: '0',
            path_samurai: '0',
            path_wanderer: '0'
        };
        if (path) {
            updates[`path_${path}`] = '1';
            updates["character_subpath"] = "None";
        }
        setAttrs(updates);
    });
    console.log("Updating Mortal Path");
});

on('change:character_level', function(eventInfo){
    ['power', 'agility', 'vitality', 'cultivation', 'qi_control', 'mental_strength', 'appearance'].forEach(attr => {
        update_mod(`${attr}`);
    });
});

on("change:acrobatics_bonus change:athletics_bonus change:charm_bonus change:deceit_bonus change:disguise_bonus change:fine_arts_bonus change:forgery_bonus change:grapple_bonus change:history_bonus change:intuition_bonus change:intimidation_bonus change:investigation_bonus change:medicine_bonus change:navigation_bonus change:perception_bonus change:performance_bonus change:persuade_bonus change:discretion_bonus change:stealth_bonus change:survival_bonus", function(eventinfo) {
    update_skills();
    console.log("Updating PC Skills");
});

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
    update_weight();
    console.log("Updating Everything");
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

on("change:durability-base change:durability-limit change:durability-bonus", function(eventinfo) {
    update_durability();
    console.log("Updating PC Durability");
});

on("change:evasion-base change:evasion-limit change:evasion-bonus", function(eventinfo) {
    update_evasion();
    console.log("Updating PC Evasion");
});

on("change:initiative_bonus", function(eventInfo){
    update_initiative();
});

on("change:npc_acrobatics_bonus change:npc_athletics_bonus change:npc_charm_bonus change:npc_deceit_bonus change:npc_disguise_bonus change:npc_fine_arts_bonus change:npc_forgery_bonus change:npc_grapple_bonus change:npc_history_bonus change:npc_intuition_bonus change:npc_intimidation_bonus change:npc_investigation_bonus change:npc_medicine_bonus change:npc_navigation_bonus change:npc_perception_bonus change:npc_performance_bonus change:npc_persuade_bonus change:npc_discretion_bonus change:npc_stealth_bonus change:npc_survival_bonus", function(eventinfo) {
    update_npc_skills();
    console.log("Updating NPC Skills");
});

on("change:reduction-base change:reduction-armour change:reduction-bonus", function(eventinfo) {
    update_reduction();
    console.log("Updating PC Damage Reduction");
});

on("change:repeating_inventory:itemcontainer change:repeating_inventory:equipped change:repeating_inventory:carried change:repeating_inventory:itemweight change:repeating_inventory:itemcount change:encumberance_setting change:size change:carrying_capacity_mod change:use_inventory_slots change:inventory_slots_mod change:repeating_inventory:itemweightfixed change:repeating_inventory:itemslotsfixed change:repeating_inventory:itemsize change:repeating_inventory:itemcontainer_slots change:repeating_inventory:itemcontainer_slots_modifier", function() {
    update_weight();
});

on("change:repeating_inventory:itemmodifiers change:repeating_inventory:equipped change:repeating_inventory:carried", function(eventinfo) {
    if (eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
        return;
    }
    var itemid = eventinfo.sourceAttribute.substring(20, 40);
    getAttrs(["repeating_inventory_" + itemid + "_itemmodifiers"], function(v) {
        if (v["repeating_inventory_" + itemid + "_itemmodifiers"]) {
            check_itemmodifiers(v["repeating_inventory_" + itemid + "_itemmodifiers"], eventinfo.previousValue);
        } else {
            check_itemmodifiers("", eventinfo.previousValue);
        };
    });
});

on("change:repeating_move:name change:repeating_move:attack_flag change:repeating_move:attack_type change:repeating_move:attack_range change:repeating_move:attack_tohit change:repeating_move:attack_bonus change:repeating_move:attack_damage change:repeating_move:attack_damage1attribute change:repeating_move:attack_damage1bonus change:repeating_move:attack_damagetype change:repeating_move:attack_damage2 change:repeating_move:attack_damage2attribute change:repeating_move:attack_damage2bonus change:repeating_move:attack_damagetype2 change:repeating_move:description", function(eventinfo) {
    update_moves();
    console.log("Updating PC Moves");
});

on("change:repeating_npcmove-l:name change:repeating_npcmove-l:attack_flag change:repeating_npcmove-l:attack_type change:repeating_npcmove-l:attack_range change:repeating_npcmove-l:attack_tohit change:repeating_npcmove-l:attack_bonus change:repeating_npcmove-l:attack_damage change:repeating_npcmove-l:attack_damage1attribute change:repeating_npcmove-l:attack_damage1bonus change:repeating_npcmove-l:attack_damagetype change:repeating_npcmove-l:attack_damage2 change:repeating_npcmove-l:attack_damage2attribute change:repeating_npcmove-l:attack_damage2bonus change:repeating_npcmove-l:attack_damagetype2 change:repeating_npcmove-l:description", function(eventinfo) {
    update_npc_legendary_moves();
    console.log("Updating NPC Legendary Moves");
});

on("change:repeating_npcmove:name change:repeating_npcmove:attack_flag change:repeating_npcmove:attack_type change:repeating_npcmove:attack_range change:repeating_npcmove:attack_tohit change:repeating_npcmove:attack_bonus change:repeating_npcmove:attack_damage change:repeating_npcmove:attack_damage1attribute change:repeating_npcmove:attack_damage1bonus change:repeating_npcmove:attack_damagetype change:repeating_npcmove:attack_damage2 change:repeating_npcmove:attack_damage2attribute change:repeating_npcmove:attack_damage2bonus change:repeating_npcmove:attack_damagetype2 change:repeating_npcmove:description", function(eventinfo) {
    update_npc_moves();
    console.log("Updating NPC Moves");
});

on("remove:repeating_inventory", function(eventinfo) {
    var itemid = eventinfo.sourceAttribute.substring(20, 40);

    if (eventinfo.removedInfo && eventinfo.removedInfo["repeating_inventory_" + itemid + "_itemmodifiers"]) {
        check_itemmodifiers(eventinfo.removedInfo["repeating_inventory_" + itemid + "_itemmodifiers"]);
    }

    update_weight();
    console.log("Updating Weight");
});

let clamp = function(value, min, max) {
    return Math.min(Math.max(value, min), max);
};

let isDefined = function(value) {
    return value !== null && typeof(value) !== 'undefined';
};

let toInt = function(value) {
    return (value && !isNaN(value)) ? parseInt(value) : 0;
};

var update_attr = function(attr) {
    var update = {};
    var attr_fields = [attr + "_base", "attr_global_attribute_mod"];
    getSectionIDs("repeating_inventory", function(idarray) {
        _.each(idarray, function(currentID, i) {
            attr_fields.push("repeating_inventory_" + currentID + "_equipped");
            attr_fields.push("repeating_inventory_" + currentID + "_itemmodifiers");
        });
        getAttrs(attr_fields.concat(global_fields), function(v) {
            var base = v[attr + "_base"] && !isNaN(parseInt(v[attr + "_base"], 0)) ? parseInt(v[attr + "_base"], 0) : 0;
            var item_base = 0;
            var item_bonus = 0;
            _.each(idarray, function(currentID) {
                if ((!v["repeating_inventory_" + currentID + "_equipped"] || v["repeating_inventory_" + currentID + "_equipped"] === "1") && v["repeating_inventory_" + currentID + "_itemmodifiers"] && v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().indexOf(attr > -1)) {
                    var mods = v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().split(",");
                    _.each(mods, function(mod) {
                        if (mod.indexOf(attr) > -1 && mod.indexOf("save") === -1) {
                            if (mod.indexOf(":") > -1) {
                                var new_base = !isNaN(parseInt(mod.replace(/[^0-9]/g, ""), 0)) ? parseInt(mod.replace(/[^0-9]/g, ""), 0) : false;
                                item_base = new_base && new_base > item_base ? new_base : item_base;
                            } else if (mod.indexOf("-") > -1) {
                                var new_mod = !isNaN(parseInt(mod.replace(/[^0-9]/g, ""), 0)) ? parseInt(mod.replace(/[^0-9]/g, ""), 0) : false;
                                item_bonus = new_mod ? item_bonus - new_mod : item_bonus;
                            } else {
                                var new_mod = !isNaN(parseInt(mod.replace(/[^0-9]/g, ""), 0)) ? parseInt(mod.replace(/[^0-9]/g, ""), 0) : false;
                                item_bonus = new_mod ? item_bonus + new_mod : item_bonus;
                            }
                        };
                    });
                }
            });

            var global_attribute_mod = parseInt(v.global_attribute_mod) || 0;
            base = base > item_base ? base : item_base;
            update[attr] = base + item_bonus + global_attribute_mod;
            setAttrs(update);
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

var update_initiative = function(){
    getAttrs(["agility","initiative_bonus"], function(v){
        var update = {};

        var agility = parseInt(v.agility) || 0;

        update["initiative"] = agility + (parseInt(v.initiative_bonus) ? `d6 + ${parseInt(v.initiative_bonus)}` : 'd6');

        setAttrs(update, {
            silent: true
        });
    });
};

var update_mod = function(attr) {
    getAttrs([attr, "character_level", "global_dc_mod", "global_attribute_mod", attr + "_dc_bonus"], function(v) {
        var finalattr = v[attr] && !isNaN(parseInt(v[attr])) ? parseInt(v[attr], 10) : 0;
        var level = !isNaN(parseInt(v.character_level)) ? parseInt(v.character_level, 10) : 0;
        var global_dc_mod = !isNaN(parseInt(v.global_dc_mod)) ? parseInt(v.global_dc_mod, 10) : 0;
        var attr_dc_bonus = !isNaN(parseInt(v[attr + "_dc_bonus"])) ? parseInt(v[attr + "_dc_bonus"], 10) : 0;
        var finaldc = Math.floor(finalattr * (3.5 + Math.floor(level / 7))) + global_dc_mod + attr_dc_bonus;
        var update = {};
        update[attr + "_mod"] = finalattr;
        update[attr + "_dc"] = finaldc;
        setAttrs(update);
    });
};

var update_moves = function() {
    getSectionIDs("repeating_move", function(idarray) {
        getAttrs(["tactical_advantage"], function(attrs) {
            var tacticalAdvantage = attrs.tactical_advantage || "none";
            var advantageBonus = 0;
            var minBonus = 0;

            switch (tacticalAdvantage) {
                case "ta":
                    advantageBonus = 0.20;
                    minBonus = 2;
                    break;
                case "ea":
                    advantageBonus = 0.40;
                    minBonus = 4;
                    break;
                case "aa":
                    advantageBonus = 2.00;
                    minBonus = 6;
                    break;
                default:
                    advantageBonus = 0;
                    minBonus = 0;
            }

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
                    "power", "agility", "vitality", "cultivation", "qi_control", "mental_strength", "dtype", "global_attack_mod", "global_damage_mod"
                ], function(v) {
                    var update = {};

                    var attackFlag = v[`repeating_move_${id}_attack_flag`] === "on" ? 1 : 0;
                    var atkFlag = (attackFlag === 1) ? "{{attack=1}}" : "";

                    var attackRange = v[`repeating_move_${id}_attack_range`];
                    var attackToHit = v[`repeating_move_${id}_attack_tohit`].replace("@{", "").replace("}", "");
                    var baseAttackBonus = (parseInt(v[`repeating_move_${id}_attack_bonus`]) || 0) + (parseInt(v.global_attack_mod) || 0);
                    var attackToHitValue = parseInt(v[attackToHit]) || 0;

                    var attackBonus = baseAttackBonus;
                    if (advantageBonus === 2.00) {
                        attackBonus = Math.max(attackToHitValue, minBonus);
                    } else if (advantageBonus > 0) {
                        attackBonus = Math.max(Math.floor(attackToHitValue * advantageBonus), minBonus);
                    }

                    var damage1 = v[`repeating_move_${id}_attack_damage`];
                    var damage1Attribute = v[`repeating_move_${id}_attack_damage1attribute`];
                    var damage1Bonus = (parseInt(v[`repeating_move_${id}_attack_damage1bonus`]) || 0) + (parseInt(v.global_damage_mod) || 0);
                    var damage1Type = v[`repeating_move_${id}_attack_damagetype`];

                    var damage2 = v[`repeating_move_${id}_attack_damage2`];
                    var damage2Attribute = v[`repeating_move_${id}_attack_damage2attribute`];
                    var damage2Bonus = (parseInt(v[`repeating_move_${id}_attack_damage2bonus`]) || 0) + (parseInt(v.global_damage_mod) || 0);
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

                    var toHitString = attackBonus !== 0 ? `${attackToHitValue} + ${attackBonus}` : `${attackToHitValue}`;

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
                        rollbase = `@{wtype}&{template:move} @{charname_output} {{range=${attackRange}}} {{rname=@{name}}} ${atkFlag} ${damage_flag} {{r1=[[@{${attackToHit}}+${attackBonus}]]}} `;
                        if (damage1) {
                            rollbase += `{{dmg1=[[@{attack_damage} + [[${damage1AttrValue}]] + [[${damage1Bonus}]] ]]}} {{dmg1type=${damage1Type}}} `;
                        }
                        if (damage2) {
                            rollbase += `{{dmg2=[[@{attack_damage2} + [[${damage2AttrValue}]] + [[${damage2Bonus}]] ]]}} {{dmg2type=${damage2Type}}} `;
                        }
                    } else if (attackFlag) {
                        rollbase = `@{wtype}&{template:atk} @{charname_output} ${atkFlag} ${damage_flag} {{range=${attackRange}}} {{rname=[@{name}](~repeating_move_dmg)}} {{type=[Attack](~repeating_move_dmg)}} {{r1=[[@{${attackToHit}}+${attackBonus}]]}} {{description=${description}}}`;
                    } else if (damage1 || damage2) {
                        rollbase = `@{wtype}&{template:dmg} @{charname_output} ${damage_flag} `;
                        if (damage1) {
                            rollbase += `{{dmg1=[[@{attack_damage} + ${damage1AttrValue} + ${damage1Bonus}]]}} {{dmg1type=${damage1Type}}} `;
                        }
                        if (damage2) {
                            rollbase += `{{dmg2=[[@{attack_damage2} + ${damage2AttrValue} + ${damage2Bonus}]]}} {{dmg2type=${damage2Type}}} `;
                        }
                    } else {
                        rollbase = `@{wtype}&{template:move} @{charname_output} {{rname=@{name}}} {{description=${description}}}`;
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
                    rollbase = `@{wtype}&{template:move} @{charname_output} {{range=${attackRange}}} {{rname=@{name}}} ${atkFlag} ${damage_flag} {{r1=[[@{${attackToHit}}+${attackBonus}]]}} `;
                    if (damage1) {
                        rollbase += `{{dmg1=[[@{attack_damage} + [[${damage1AttrValue}]] + [[${damage1Bonus}]] ]]}} {{dmg1type=${damage1Type}}} `;
                    }
                    if (damage2) {
                        rollbase += `{{dmg2=[[@{attack_damage2} + [[${damage2AttrValue}]] + [[${damage2Bonus}]] ]]}} {{dmg2type=${damage2Type}}} `;
                    }
                } else if (attackFlag) {
                    rollbase = `@{wtype}&{template:atk} @{charname_output} ${atkFlag} ${damage_flag} {{range=${attackRange}}} {{rname=[@{name}](~repeating_npcmove-l_npc_dmg)}} {{type=[Attack](~repeating_npcmove-l_npc_dmg)}} {{r1=[[@{${attackToHit}}+${attackBonus}]]}} {{description=${description}}}`;
                } else if (damage1 || damage2) {
                    rollbase = `@{wtype}&{template:dmg} @{charname_output} ${damage_flag} `;
                    if (damage1) {
                        rollbase += `{{dmg1=[[@{attack_damage} + ${damage1AttrValue} + ${damage1Bonus}]]}} {{dmg1type=${damage1Type}}} `;
                    }
                    if (damage2) {
                        rollbase += `{{dmg2=[[@{attack_damage2} + ${damage2AttrValue} + ${damage2Bonus}]]}} {{dmg2type=${damage2Type}}} `;
                    }
                } else {
                    rollbase = `@{wtype}&{template:move} @{charname_output} {{rname=@{name}}} {{description=${description}}}`;
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
                    rollbase = `@{wtype}&{template:move} @{charname_output} {{range=${attackRange}}} {{rname=@{name}}} ${atkFlag} ${damage_flag} {{r1=[[@{${attackToHit}}+${attackBonus}]]}} `;
                    if (damage1) {
                        rollbase += `{{dmg1=[[@{attack_damage} + [[${damage1AttrValue}]] + [[${damage1Bonus}]] ]]}} {{dmg1type=${damage1Type}}} `;
                    }
                    if (damage2) {
                        rollbase += `{{dmg2=[[@{attack_damage2} + [[${damage2AttrValue}]] + [[${damage2Bonus}]] ]]}} {{dmg2type=${damage2Type}}} `;
                    }
                } else if (attackFlag) {
                    rollbase = `@{wtype}&{template:atk} @{charname_output} ${atkFlag} ${damage_flag} {{range=${attackRange}}} {{rname=[@{name}](~repeating_npcmove_npc_dmg)}} {{type=[Attack](~repeating_npcmove_npc_dmg)}} {{r1=[[@{${attackToHit}}+${attackBonus}]]}} {{description=${description}}}`;
                } else if (damage1 || damage2) {
                    rollbase = `@{wtype}&{template:dmg} @{charname_output} ${damage_flag} `;
                    if (damage1) {
                        rollbase += `{{dmg1=[[@{attack_damage} + ${damage1AttrValue} + ${damage1Bonus}]]}} {{dmg1type=${damage1Type}}} `;
                    }
                    if (damage2) {
                        rollbase += `{{dmg2=[[@{attack_damage2} + ${damage2AttrValue} + ${damage2Bonus}]]}} {{dmg2type=${damage2Type}}} `;
                    }
                } else {
                    rollbase = `@{wtype}&{template:move} @{charname_output} {{rname=@{name}}} {{description=${description}}}`;
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

var update_npc_skills = function() {
    getAttrs(["npc_acrobatics_bonus", "npc_athletics_bonus", "npc_charm_bonus", "npc_deceit_bonus", "npc_disguise_bonus", "npc_fine_arts_bonus", "npc_forgery_bonus", "npc_grapple_bonus", "npc_history_bonus", "npc_intuition_bonus", "npc_intimidation_bonus", "npc_investigation_bonus", "npc_medicine_bonus", "npc_navigation_bonus", "npc_perception_bonus", "npc_performance_bonus", "npc_persuade_bonus", "npc_discretion_bonus", "npc_stealth_bonus", "npc_survival_bonus", "agility", "power", "mental_strength", "appearance", "qi_control"], function(v) {
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
        update["npc_grapple_roll"] = power;
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
        update["npc_grapple"] = update["npc_grapple_roll"] + (parseInt(v.npc_grapple_bonus) ? `d6 + ${parseInt(v.npc_grapple_bonus)}` : 'd6');
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

var update_skills = function() {
    getAttrs([
        "acrobatics_bonus", "athletics_bonus", "charm_bonus", "deceit_bonus", "disguise_bonus", 
        "fine_arts_bonus", "forgery_bonus", "grapple_bonus", "history_bonus", "intuition_bonus", 
        "intimidation_bonus", "investigation_bonus", "medicine_bonus", "navigation_bonus", 
        "perception_bonus", "performance_bonus", "persuade_bonus", "discretion_bonus", 
        "stealth_bonus", "survival_bonus", "acrobatics_item_bonus", "athletics_item_bonus", 
        "charm_item_bonus", "deceit_item_bonus", "disguise_item_bonus", "fine_arts_item_bonus", 
        "forgery_item_bonus", "grapple_item_bonus", "history_item_bonus", "intuition_item_bonus", 
        "intimidation_item_bonus", "investigation_item_bonus", "medicine_item_bonus", 
        "navigation_item_bonus", "perception_item_bonus", "performance_item_bonus", 
        "persuade_item_bonus", "discretion_item_bonus", "stealth_item_bonus", "survival_item_bonus", 
        "agility", "power", "mental_strength", "appearance", "qi_control", "global_skill_mod"
    ], function(v) {
        var update = {};

        // Calculate base values
        var agility = parseInt(v.agility) || 0;
        var power = parseInt(v.power) || 0;
        var mental_strength = parseInt(v.mental_strength) || 0;
        var appearance = parseInt(v.appearance) || 0;
        var qi_control = parseInt(v.qi_control) || 0;
        var global_skill_mod = parseInt(v.global_skill_mod) || 0;

        // Skill Item bonuses
        var acrobatics_item_bonus = parseInt(v.acrobatics_item_bonus) || 0;
        var athletics_item_bonus = parseInt(v.athletics_item_bonus) || 0;
        var charm_item_bonus = parseInt(v.charm_item_bonus) || 0;
        var deceit_item_bonus = parseInt(v.deceit_item_bonus) || 0;
        var disguise_item_bonus = parseInt(v.disguise_item_bonus) || 0;
        var fine_arts_item_bonus = parseInt(v.fine_arts_item_bonus) || 0;
        var forgery_item_bonus = parseInt(v.forgery_item_bonus) || 0;
        var grapple_item_bonus = parseInt(v.grapple_item_bonus) || 0;
        var history_item_bonus = parseInt(v.history_item_bonus) || 0;
        var intuition_item_bonus = parseInt(v.intuition_item_bonus) || 0;
        var intimidation_item_bonus = parseInt(v.intimidation_item_bonus) || 0;
        var investigation_item_bonus = parseInt(v.investigation_item_bonus) || 0;
        var medicine_item_bonus = parseInt(v.medicine_item_bonus) || 0;
        var navigation_item_bonus = parseInt(v.navigation_item_bonus) || 0;
        var perception_item_bonus = parseInt(v.perception_item_bonus) || 0;
        var performance_item_bonus = parseInt(v.performance_item_bonus) || 0;
        var persuade_item_bonus = parseInt(v.persuade_item_bonus) || 0;
        var discretion_item_bonus = parseInt(v.discretion_item_bonus) || 0;
        var stealth_item_bonus = parseInt(v.stealth_item_bonus) || 0;
        var survival_item_bonus = parseInt(v.survival_item_bonus) || 0;

        // Skill bonuses
        var acrobatics_bonus = (parseInt(v.acrobatics_bonus) || 0) + acrobatics_item_bonus;
        var athletics_bonus = (parseInt(v.athletics_bonus) || 0) + athletics_item_bonus;
        var charm_bonus = (parseInt(v.charm_bonus) || 0) + charm_item_bonus;
        var deceit_bonus = (parseInt(v.deceit_bonus) || 0) + deceit_item_bonus;
        var disguise_bonus = (parseInt(v.disguise_bonus) || 0) + disguise_item_bonus;
        var fine_arts_bonus = (parseInt(v.fine_arts_bonus) || 0) + fine_arts_item_bonus;
        var forgery_bonus = (parseInt(v.forgery_bonus) || 0) + forgery_item_bonus;
        var grapple_bonus = (parseInt(v.grapple_bonus) || 0) + grapple_item_bonus;
        var history_bonus = (parseInt(v.history_bonus) || 0) + history_item_bonus;
        var intuition_bonus = (parseInt(v.intuition_bonus) || 0) + intuition_item_bonus;
        var intimidation_bonus = (parseInt(v.intimidation_bonus) || 0) + intimidation_item_bonus;
        var investigation_bonus = (parseInt(v.investigation_bonus) || 0) + investigation_item_bonus;
        var medicine_bonus = (parseInt(v.medicine_bonus) || 0) + medicine_item_bonus;
        var navigation_bonus = (parseInt(v.navigation_bonus) || 0) + navigation_item_bonus;
        var perception_bonus = (parseInt(v.perception_bonus) || 0) + perception_item_bonus;
        var performance_bonus = (parseInt(v.performance_bonus) || 0) + performance_item_bonus;
        var persuade_bonus = (parseInt(v.persuade_bonus) || 0) + persuade_item_bonus;
        var discretion_bonus = (parseInt(v.discretion_bonus) || 0) + discretion_item_bonus;
        var stealth_bonus = (parseInt(v.stealth_bonus) || 0) + stealth_item_bonus;
        var survival_bonus = (parseInt(v.survival_bonus) || 0) + survival_item_bonus;

        // Skill Item bonuses
        var acrobatics_item_bonus = parseInt(v.acrobatics_item_bonus) || 0;
        var athletics_item_bonus = parseInt(v.athletics_item_bonus) || 0;
        var charm_item_bonus = parseInt(v.charm_item_bonus) || 0;
        var deceit_item_bonus = parseInt(v.deceit_item_bonus) || 0;
        var disguise_item_bonus = parseInt(v.disguise_item_bonus) || 0;
        var fine_arts_item_bonus = parseInt(v.fine_arts_item_bonus) || 0;
        var forgery_item_bonus = parseInt(v.forgery_item_bonus) || 0;
        var grapple_item_bonus = parseInt(v.grapple_item_bonus) || 0;
        var history_item_bonus = parseInt(v.history_item_bonus) || 0;
        var intuition_item_bonus = parseInt(v.intuition_item_bonus) || 0;
        var intimidation_item_bonus = parseInt(v.intimidation_item_bonus) || 0;
        var investigation_item_bonus = parseInt(v.investigation_item_bonus) || 0;
        var medicine_item_bonus = parseInt(v.medicine_item_bonus) || 0;
        var navigation_item_bonus = parseInt(v.navigation_item_bonus) || 0;
        var perception_item_bonus = parseInt(v.perception_item_bonus) || 0;
        var performance_item_bonus = parseInt(v.performance_item_bonus) || 0;
        var persuade_item_bonus = parseInt(v.persuade_item_bonus) || 0;
        var discretion_item_bonus = parseInt(v.discretion_item_bonus) || 0;
        var stealth_item_bonus = parseInt(v.stealth_item_bonus) || 0;
        var survival_item_bonus = parseInt(v.survival_item_bonus) || 0;

        // Calculate base rolls
        update["acrobatics_roll"] = agility;
        update["athletics_roll"] = power;
        update["charm_roll"] = Math.round(mental_strength + appearance);
        update["deceit_roll"] = Math.round(mental_strength + appearance);
        update["discretion_roll"] = agility;
        update["disguise_roll"] = Math.round(mental_strength + appearance);
        update["fine_arts_roll"] = Math.round(agility / 2 + mental_strength / 2);
        update["forgery_roll"] = Math.round(agility / 2 + mental_strength / 2);
        update["grapple_roll"] = power;
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
        update["acrobatics"] = update["acrobatics_roll"] + (acrobatics_bonus ? `d6 + ${acrobatics_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["athletics"] = update["athletics_roll"] + (athletics_bonus ? `d6 + ${athletics_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["charm"] = update["charm_roll"] + (charm_bonus ? `d6 + ${charm_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["deceit"] = update["deceit_roll"] + (deceit_bonus ? `d6 + ${deceit_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["disguise"] = update["disguise_roll"] + (disguise_bonus ? `d6 + ${disguise_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["fine_arts"] = update["fine_arts_roll"] + (fine_arts_bonus ? `d6 + ${fine_arts_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["forgery"] = update["forgery_roll"] + (forgery_bonus ? `d6 + ${forgery_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["grapple"] = update["grapple_roll"] + (grapple_bonus ? `d6 + ${grapple_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["history"] = update["history_roll"] + (history_bonus ? `d6 + ${history_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["intuition"] = update["intuition_roll"] + (intuition_bonus ? `d6 + ${intuition_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["intimidation"] = update["intimidation_roll"] + (intimidation_bonus ? `d6 + ${intimidation_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["investigation"] = update["investigation_roll"] + (investigation_bonus ? `d6 + ${investigation_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["medicine"] = update["medicine_roll"] + (medicine_bonus ? `d6 + ${medicine_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["navigation"] = update["navigation_roll"] + (navigation_bonus ? `d6 + ${navigation_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["perception"] = update["perception_roll"] + (perception_bonus ? `d6 + ${perception_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["performance"] = update["performance_roll"] + (performance_bonus ? `d6 + ${performance_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["persuade"] = update["persuade_roll"] + (persuade_bonus ? `d6 + ${persuade_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["discretion"] = update["discretion_roll"] + (discretion_bonus ? `d6 + ${discretion_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["stealth"] = update["stealth_roll"] + (stealth_bonus ? `d6 + ${stealth_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');
        update["survival"] = update["survival_roll"] + (survival_bonus ? `d6 + ${survival_bonus}` : 'd6') + (global_skill_mod ? ` + ${global_skill_mod}` : '');

        setAttrs(update, {
            silent: true
        });
    });
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
            weight_attrs.push("repeating_inventory_" + currentID + "_itemcontainer_slots");
            weight_attrs.push("repeating_inventory_" + currentID + "_itemcontainer_slots_modifier");
        });
        getAttrs(weight_attrs, function(v) {
            var slots_modifier = 0;
            var containerslots = 0;

            _.each(idarray, function(currentID, i) {
                if (v["repeating_inventory_" + currentID + "_equipped"] == 1 || v["repeating_inventory_" + currentID + "_carried"] == 1) {
                    if (v["repeating_inventory_" + currentID + "_itemcontainer"] == 1) {
                        // GET SLOTS MODIFIER IF EQUIPPED
                        if (v["repeating_inventory_" + currentID + "_equipped"] == 1) {
                            var slotsID = "repeating_inventory_" + currentID + "_itemcontainer_slots";
                            containerslots = parseInt(v[slotsID], 0);
                            var field_id = "repeating_inventory_" + currentID + "_itemcontainer_slots_modifier";
                            if (v[field_id]) {
                                if (["+", "-"].indexOf(v[field_id]) > -1) {
                                    var operator = v[field_id].substring(0, 1);
                                    var value = v[field_id].substring(1);
                                    if (isNaN(parseInt(value, 0)) === false) {
                                        if (operator == "+") {
                                            slots_modifier += parseInt(value, 0);
                                        } else if (operator == "-") {
                                            slots_modifier -= parseInt(value, 0);
                                        }
                                    }
                                } else {
                                    if (isNaN(parseInt(v[field_id], 0)) === false) {
                                        slots_modifier += parseInt(v[field_id], 0);
                                    }
                                }
                            }
                        }
                    } else {
                        // UPDATE WEIGHT
                        if (v["repeating_inventory_" + currentID + "_itemweight"] && isNaN(parseInt(v["repeating_inventory_" + currentID + "_itemweight"], 0)) === false) {
                            if (v["repeating_inventory_" + currentID + "_itemweightfixed"] == 1) {
                                wtotal += parseFloat(v["repeating_inventory_" + currentID + "_itemweight"]);
                            } else {
                                count = v["repeating_inventory_" + currentID + "_itemcount"] && isNaN(parseFloat(v["repeating_inventory_" + currentID + "_itemcount"])) === false ? parseFloat(v["repeating_inventory_" + currentID + "_itemcount"]) : 1;
                                wtotal = wtotal + (parseFloat(v["repeating_inventory_" + currentID + "_itemweight"]) * count);
                            }
                        }
                        // UPDATE SLOTS
                        if (v["repeating_inventory_" + currentID + "_itemsize"] && isNaN(parseInt(v["repeating_inventory_" + currentID + "_itemsize"], 0)) === false) {
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

            wtotal = Math.round(wtotal * 100) / 100;
            stotal = Math.round(stotal * 100) / 100;

            update["weighttotal"] = wtotal;
            update["slotstotal"] = stotal;

            var size_slots = 18;
            size_slots += parseInt(v.power) + parseInt(containerslots);

            if (v.inventory_slots_mod) {
                var operator = v.inventory_slots_mod.substring(0, 1);
                var value = v.inventory_slots_mod.substring(1);
                if (["*", "x", "+", "-"].indexOf(operator) > -1 && isNaN(parseInt(value, 0)) === false) {
                    if (operator == "*" || operator == "x") {
                        size_slots *= parseInt(value, 0);
                    } else if (operator == "+") {
                        size_slots += parseInt(value, 0);
                    } else if (operator == "-") {
                        size_slots -= parseInt(value, 0);
                    }
                }
            }

            size_slots += slots_modifier;
            
            var str_base = parseInt(v.power);
            var str = str_base;
            var weight_maximum = str * 30;
            var weight_mod = weight_maximum;

            if (v.carrying_capacity_mod) {
                var operator = v.carrying_capacity_mod.substring(0, 1);
                var value = parseInt(v.carrying_capacity_mod.substring(1), 10);
                if (["*", "x", "+", "-", "/"].indexOf(operator) > -1 && !isNaN(value)) {
                    if (operator == "*" || operator == "x") {
                        weight_mod *= value;
                    } else if (operator == "+") {
                        weight_mod += value;
                    } else if (operator == "-") {
                        weight_mod -= value;
                    } else if (operator == "/") {
                        weight_mod /= value;
                    }
                }
            }

            update["weightmaximum"] = weight_mod;
            update["slotsmaximum"] = size_slots;

            if (stotal > size_slots) {
                update["encumberance"] = "OVER CARRYING CAPACITY";
            } else if (wtotal > str * 30) {
                update["encumberance"] = "IMMOBILE";
            } else if (wtotal > str * 22) {
                update["encumberance"] = "HEAVILY ENCUMBERED";
            } else if (wtotal > str * 15) {
                update["encumberance"] = "ENCUMBERED";
            } else {
                update["encumberance"] = " ";
            }

            setAttrs(update, {
                silent: true
            });
        });
    });
};

var check_itemmodifiers = function(modifiers, previousValue) {
    var update = {};
    var mods = modifiers.toLowerCase().split(",");
    if (previousValue) {
        prevmods = previousValue.toLowerCase().split(",");
        mods = _.union(mods, prevmods);
    };
    _.each(mods, function(mod) {
        var item_bonus = parseInt(mod.match(/[\+\-]?\d+/)) || 0;
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
        if (mod.indexOf("acrobatics") > -1) {
            update["acrobatics_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("athletics") > -1) {
            update["athletics_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("charm") > -1) {
            update["charm_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("deceit") > -1) {
            update["deceit_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("disguise") > -1) {
            update["disguise_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("fine_arts") > -1) {
            update["fine_arts_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("forgery") > -1) {
            update["forgery_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("grapple") > -1) {
            update["grapple_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("history") > -1) {
            update["history_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("intuition") > -1) {
            update["intuition_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("intimidation") > -1) {
            update["intimidation_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("investigation") > -1) {
            update["investigation_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("medicine") > -1) {
            update["medicine_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("navigation") > -1) {
            update["navigation_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("perception") > -1) {
            update["perception_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("performance") > -1) {
            update["performance_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("persuade") > -1) {
            update["persuade_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("discretion") > -1) {
            update["discretion_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("stealth") > -1) {
            update["stealth_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
        if (mod.indexOf("survival") > -1) {
            update["survival_item_bonus"] = parseInt(item_bonus)
            update_skills();
        };
    });

    setAttrs(update, {
        silent: true
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
