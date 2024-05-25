
on("change:agility change:power change:mental_strength change:appearance change:qi_control", function(eventinfo) {
    update_npc_skills();
    update_npc_moves();
    update_npc_legendary_moves();
});

on("change:npc_acrobatics_bonus change:npc_athletics_bonus change:npc_charm_bonus change:npc_deceit_bonus change:npc_disguise_bonus change:npc_fine_arts_bonus change:npc_forgery_bonus change:npc_history_bonus change:npc_intuition_bonus change:npc_intimidation_bonus change:npc_investigation_bonus change:npc_medicine_bonus change:npc_navigation_bonus change:npc_perception_bonus change:npc_performance_bonus change:npc_persuade_bonus change:npc_sleight_of_hand_bonus change:npc_stealth_bonus change:npc_survival_bonus change:agility change:power change:mental_strength change:appearance change:qi_control", function(eventinfo) {
    update_npc_skills();
    console.log("Updating Skills");
});

on("change:repeating_npcmove:name change:repeating_npcmove:attack_flag change:repeating_npcmove:attack_type change:repeating_npcmove:attack_range change:repeating_npcmove:attack_tohit change:repeating_npcmove:attack_bonus change:repeating_npcmove:attack_damage change:repeating_npcmove:attack_damage1attribute change:repeating_npcmove:attack_damage1bonus change:repeating_npcmove:attack_damagetype change:repeating_npcmove:attack_damage2 change:repeating_npcmove:attack_damage2attribute change:repeating_npcmove:attack_damage2bonus change:repeating_npcmove:attack_damagetype2 change:repeating_npcmove:description change:power change:agility change:vitality change:cultivation change:qi_control change:mental_strength", function(eventinfo) {
    update_npc_moves();
    console.log("Updating Moves");
});

on("change:repeating_npcmove-l:name change:repeating_npcmove-l:attack_flag change:repeating_npcmove-l:attack_type change:repeating_npcmove-l:attack_range change:repeating_npcmove-l:attack_tohit change:repeating_npcmove-l:attack_bonus change:repeating_npcmove-l:attack_damage change:repeating_npcmove-l:attack_damage1attribute change:repeating_npcmove-l:attack_damage1bonus change:repeating_npcmove-l:attack_damagetype change:repeating_npcmove-l:attack_damage2 change:repeating_npcmove-l:attack_damage2attribute change:repeating_npcmove-l:attack_damage2bonus change:repeating_npcmove-l:attack_damagetype2 change:repeating_npcmove-l:description change:power change:agility change:vitality change:cultivation change:qi_control change:mental_strength", function(eventinfo) {
    update_npc_legendary_moves();
    console.log("Updating Legendary Moves");
});

on("change:dtype", function(eventinfo) {
    if (eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
        return;
    }
    update_npc_moves();
    update_npc_legendary_moves();
    console.log("Updating DType");
});

var update_npc_skills = function() {
    getAttrs(["npc_acrobatics_bonus", "npc_athletics_bonus", "npc_charm_bonus", "npc_deceit_bonus", "npc_disguise_bonus", "npc_fine_arts_bonus", "npc_forgery_bonus", "npc_history_bonus", "npc_intuition_bonus", "npc_intimidation_bonus", "npc_investigation_bonus", "npc_medicine_bonus", "npc_navigation_bonus", "npc_perception_bonus", "npc_performance_bonus", "npc_persuade_bonus", "npc_sleight_of_hand_bonus", "npc_stealth_bonus", "npc_survival_bonus", "agility", "power", "mental_strength", "appearance", "qi_control"], function(v) {
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
        update["npc_sleight_of_hand_roll"] = agility;
        update["npc_stealth_roll"] = agility;
        update["npc_survival_roll"] = Math.round(power / 2 + mental_strength / 2);

        // Calculate full rolls
        update["npc_acrobatics"] = update["npc_acrobatics_roll"] + (parseInt(v.npc_acrobatics_bonus) ? `d6 + ${parseInt(v.npc_acrobatics_bonus)}` : 'd6');
        update["npc_athletics"] = update["npc_athletics_roll"] + (parseInt(v.npc_athletics_bonus) ? `d6 + ${parseInt(v.npc_athletics_bonus)}` : 'd6');
        update["npc_charm"] = update["npc_charm_roll"] + (parseInt(v.npc_charm_bonus) ? `d6 + ${parseInt(v.npc_charm_bonus)}` : 'd6');
        update["npc_deceit"] = update["npc_deceit_roll"] + (parseInt(v.npc_deceit_bonus) ? `d6 + ${parseInt(v.npc_deceit_bonus)}` : 'd6');
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
        update["npc_sleight_of_hand"] = update["npc_sleight_of_hand_roll"] + (parseInt(v.npc_sleight_of_hand_bonus) ? `d6 + ${parseInt(v.npc_sleight_of_hand_bonus)}` : 'd6');
        update["npc_stealth"] = update["npc_stealth_roll"] + (parseInt(v.npc_stealth_bonus) ? `d6 + ${parseInt(v.npc_stealth_bonus)}` : 'd6');
        update["npc_survival"] = update["npc_survival_roll"] + (parseInt(v.npc_survival_bonus) ? `d6 + ${parseInt(v.npc_survival_bonus)}` : 'd6');

        setAttrs(update, {
            silent: true
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
                `repeating_npcmove_${id}_show_desc`,
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
                    rollbase = `@{wtype}&{template:npcmove} {{rname=@{name}}} ${atkFlag} ${damage_flag} {{r1=[[@{${attackToHit}}+${attackBonus}]]}} {{r2=${attackRange}}} `;
                    if (damage1) {
                        rollbase += `{{dmg1=[[@{attack_damage} + ${damage1AttrValue} + ${damage1Bonus}]]}} {{dmg1type=${damage1Type}}} `;
                    }
                    if (damage2) {
                        rollbase += `{{dmg2=[[@{attack_damage2} + ${damage2AttrValue} + ${damage2Bonus}]]}} {{dmg2type=${damage2Type}}} `;
                    }
                } else {
                    rollbase = `@{wtype}&{template:npcatk} ${atkFlag} ${damage_flag} {{rname=@{name}}} {{type=[Attack]}} {{r1=[[@{${attackToHit}}+${attackBonus}]]}} {{r2=${attackRange}}} {{description=@{show_desc}}}`;
                }

                var dmgRollBase = `@{wtype}&{template:npcdmg} ${damage_flag} `;
                if (damage1) {
                    dmgRollBase += `{{dmg1=[[@{attack_damage} + ${damage1AttrValue} + ${damage1Bonus}]]}} {{dmg1type=${damage1Type}}} `;
                }
                if (damage2) {
                    dmgRollBase += `{{dmg2=[[@{attack_damage2} + ${damage2AttrValue} + ${damage2Bonus}]]}} {{dmg2type=${damage2Type}}} `;
                }

                update[`repeating_npcmove_${id}_attack_details`] = details;
                update[`repeating_npcmove_${id}_attack_tohitrange`] = `To Hit: ${toHitString}, Range: ${attackRange}`;
                update[`repeating_npcmove_${id}_attack_onhit`] = `Damage: ${avgDamage1} (${damage1String}) ${damage1Type}`;
                if (damage2) {
                    update[`repeating_npcmove_${id}_attack_onhit`] += ` + ${avgDamage2} (${damage2String}) ${damage2Type}`;
                }
                update[`repeating_npcmove_${id}_attack_description`] = description;
                update[`repeating_npcmove_${id}_rollbase`] = rollbase;
                update[`repeating_npcmove_${id}_roll_dmg`] = dmgRollBase;

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
                `repeating_npcmove_${id}_show_desc`,
                `repeating_npcmove-l_${id}_description`,
                "power", "agility", "vitality", "cultivation", "qi_control", "mental_strength"
            ], function(v) {
                var update = {};

                var name = v[`repeating_npcmove-l_${id}_name`];
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

                update[`repeating_npcmove-l_${id}_attack_details`] = details;
                update[`repeating_npcmove-l_${id}_attack_tohitrange`] = `To Hit: ${toHitString}, Range: ${attackRange}`;
                update[`repeating_npcmove-l_${id}_attack_onhit`] = `Damage: ${avgDamage1} (${damage1String}) ${damage1Type}`;
                if (damage2) {
                    update[`repeating_npcmove-l_${id}_attack_onhit`] += ` + ${avgDamage2} (${damage2String}) ${damage2Type}`;
                }
                update[`repeating_npcmove-l_${id}_attack_description`] = description;

                var rollbase = `@{wtype}&{template:npcmove} {{rname=${name}}} ${atkFlag} {{r1=[[${toHitString}]]}} {{dmg1=${damage1}}} {{dmg1type=${damage1Type}}}`;
                if (damage2) {
                    rollbase += ` {{dmg2=${damage2}}} {{dmg2type=${damage2Type}}}`;
                }
                rollbase += ` {{description=@{show_desc}}}`;

                update[`repeating_npcmove-l_${id}_rollbase`] = rollbase;

                setAttrs(update, { silent: true });
            });
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

