on("attr_npc_acrobatics_base", "attr_npc_acrobatics_bonus", "attr_npc_athletics_base", "attr_npc_athletics_bonus", "attr_npc_charm_base", "attr_npc_charm_bonus", "attr_npc_deceit_base", "attr_npc_deceit_bonus", "attr_npc_disguise_base", "attr_npc_disguise_bonus", "attr_npc_fine_arts_base", "attr_npc_fine_arts_bonus", "attr_npc_forgery_base", "attr_npc_forgery_bonus", "attr_npc_history_base", "attr_npc_history_bonus", "attr_npc_intuition_base", "attr_npc_intuition_bonus", "attr_npc_intimidation_base", "attr_npc_intimidation_bonus", "attr_npc_investigation_base", "attr_npc_investigation_bonus", "attr_npc_medicine_base", "attr_npc_medicine_bonus", "attr_npc_navigation_base", "attr_npc_navigation_bonus", "attr_npc_perception_base", "attr_npc_perception_bonus", "attr_npc_performance_base", "attr_npc_performance_bonus", "attr_npc_persuade_base", "attr_npc_persuade_bonus", "attr_npc_sleight_of_hand_base", "attr_npc_sleight_of_hand_bonus", "attr_npc_stealth_base", "attr_npc_stealth_bonus", "attr_npc_survival_base", "attr_npc_survival_bonus", function(eventinfo) {
    update_npc_skills();
});

var update_npc_skills = function() {
    getAttrs(["attr_npc_acrobatics_base", "attr_npc_acrobatics_bonus", "attr_npc_athletics_base", "attr_npc_athletics_bonus", "attr_npc_charm_base", "attr_npc_charm_bonus", "attr_npc_deceit_base", "attr_npc_deceit_bonus", "attr_npc_disguise_base", "attr_npc_disguise_bonus", "attr_npc_fine_arts_base", "attr_npc_fine_arts_bonus", "attr_npc_forgery_base", "attr_npc_forgery_bonus", "attr_npc_history_base", "attr_npc_history_bonus", "attr_npc_intuition_base", "attr_npc_intuition_bonus", "attr_npc_intimidation_base", "attr_npc_intimidation_bonus", "attr_npc_investigation_base", "attr_npc_investigation_bonus", "attr_npc_medicine_base", "attr_npc_medicine_bonus", "attr_npc_navigation_base", "attr_npc_navigation_bonus", "attr_npc_perception_base", "attr_npc_perception_bonus", "attr_npc_performance_base", "attr_npc_performance_bonus", "attr_npc_persuade_base", "attr_npc_persuade_bonus", "attr_npc_sleight_of_hand_base", "attr_npc_sleight_of_hand_bonus", "attr_npc_stealth_base", "attr_npc_stealth_bonus", "attr_npc_survival_base"], "attr_npc_survival_bonus", function(v) {
        var update = {};        
        var acrobaticsBase = parseInt(v.attr_npc_acrobatics_base) || 0;
        var acrobaticsBonus = parseInt(v.attr_npc_acrobatics_bonus) || 0;
        update["npc_acrobatics"] = acrobaticsBase + acrobaticsBonus;

        var athleticsBase = parseInt(v.attr_npc_athletics_base) || 0;
        var athleticsBonus = parseInt(v.attr_npc_athletics_bonus) || 0;
        update["npc_athletics"] = athleticsBase + athleticsBonus;

        var charmBase = parseInt(v.attr_npc_charm_base) || 0;
        var charmBonus = parseInt(v.attr_npc_charm_bonus) || 0;
        update["npc_charm"] = charmBase + charmBonus;

        var deceitBase = parseInt(v.attr_npc_deceit_base) || 0;
        var deceitBonus = parseInt(v.attr_npc_deceit_bonus) || 0;
        update["npc_deceit"] = deceitBase + deceitBonus;

        var disguiseBase = parseInt(v.attr_npc_disguise_base) || 0;
        var disguiseBonus = parseInt(v.attr_npc_disguise_bonus) || 0;
        update["npc_disguise"] = disguiseBase + disguiseBonus;

        var fine_artsBase = parseInt(v.attr_npc_fine_arts_base) || 0;
        var fine_artsBonus = parseInt(v.attr_npc_fine_arts_bonus) || 0;
        update["npc_fine_arts"] = fine_artsBase + fine_artsBonus;

        var forgeryBase = parseInt(v.attr_npc_forgery_base) || 0;
        var forgeryBonus = parseInt(v.attr_npc_forgery_bonus) || 0;
        update["npc_forgery"] = forgeryBase + forgeryBonus;

        var historyBase = parseInt(v.attr_npc_history_base) || 0;
        var historyBonus = parseInt(v.attr_npc_history_bonus) || 0;
        update["npc_history"] = historyBase + historyBonus;

        var intuitionBase = parseInt(v.attr_npc_intuition_base) || 0;
        var intuitionBonus = parseInt(v.attr_npc_intuition_bonus) || 0;
        update["npc_intuition"] = intuitionBase + intuitionBonus;

        var intimidationBase = parseInt(v.attr_npc_intimidation_base) || 0;
        var intimidationBonus = parseInt(v.attr_npc_intimidation_bonus) || 0;
        update["npc_intimidation"] = intimidationBase + intimidationBonus;

        var investigationBase = parseInt(v.attr_npc_investigation_base) || 0;
        var investigationBonus = parseInt(v.attr_npc_investigation_bonus) || 0;
        update["npc_investigation"] = investigationBase + investigationBonus;

        var medicineBase = parseInt(v.attr_npc_medicine_base) || 0;
        var medicineBonus = parseInt(v.attr_npc_medicine_bonus) || 0;
        update["npc_medicine"] = medicineBase + medicineBonus;

        var navigationBase = parseInt(v.attr_npc_navigation_base) || 0;
        var navigationBonus = parseInt(v.attr_npc_navigation_bonus) || 0;
        update["npc_navigation"] = navigationBase + navigationBonus;

        var perceptionBase = parseInt(v.attr_npc_perception_base) || 0;
        var perceptionBonus = parseInt(v.attr_npc_perception_bonus) || 0;
        update["npc_perception"] = perceptionBase + perceptionBonus;

        var performanceBase = parseInt(v.attr_npc_performance_base) || 0;
        var performanceBonus = parseInt(v.attr_npc_performance_bonus) || 0;
        update["npc_performance"] = performanceBase + performanceBonus;

        var persuadeBase = parseInt(v.attr_npc_persuade_base) || 0;
        var persuadeBonus = parseInt(v.attr_npc_persuade_bonus) || 0;
        update["npc_persuade"] = persuadeBase + persuadeBonus;

        var sleight_of_handBase = parseInt(v.attr_npc_sleight_of_hand_base) || 0;
        var sleight_of_handBonus = parseInt(v.attr_npc_sleight_of_hand_bonus) || 0;
        update["npc_sleight_of_hand"] = sleight_of_handBase + sleight_of_handBonus;

        var stealthBase = parseInt(v.attr_npc_stealth_base) || 0;
        var stealthBonus = parseInt(v.attr_npc_stealth_bonus) || 0;
        update["npc_stealth"] = stealthBase + stealthBonus;

        var survivalBase = parseInt(v.attr_npc_survival_base) || 0;
        var survivalBonus = parseInt(v.attr_npc_survival_bonus) || 0;
        update["npc_survival"] = survivalBase + survivalBonus;

        setAttrs(update, {
            silent: true
        });
    });
};