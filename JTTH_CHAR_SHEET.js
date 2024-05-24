
on("change:npc_acrobatics_bonus change:npc_athletics_bonus change:npc_charm_bonus change:npc_deceit_bonus change:npc_disguise_bonus change:npc_fine_arts_bonus change:npc_forgery_bonus change:npc_history_bonus change:npc_intuition_bonus change:npc_intimidation_bonus change:npc_investigation_bonus change:npc_medicine_bonus change:npc_navigation_bonus change:npc_perception_bonus change:npc_performance_bonus change:npc_persuade_bonus change:npc_sleight_of_hand_bonus change:npc_stealth_bonus change:npc_survival_bonus change:agility change:power change:mental_strength change:appearance change:qi_control", function(eventinfo) {
    update_npc_skills()
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
