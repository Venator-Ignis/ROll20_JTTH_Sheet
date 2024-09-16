['power', 'agility', 'vitality', 'cultivation', 'qicontrol', 'mental'].forEach(attr => {
    on(`change:${attr}_base change:${attr}_bonus`, function(){
        update_attr(`${attr}`);
    });
});

['power', 'agility', 'vitality', 'cultivation', 'qicontrol', 'mental'].forEach(attr => {
    on(`change:${attr}`, function() {
        (attr === "power") ? update_weight(): false;
        (attr === "agility") ? update_initiative(): false;
    });
});

var update_attr = function(attr) {
    var update = {};
    var attr_fields = [attr + "_base", attr + "_bonus"];
    getSectionIDs("repeating_inventory", function(idarray) {
        _.each(idarray, function(currentID, i) {
            attr_fields.push("repeating_inventory_" + currentID + "_equipped");
            attr_fields.push("repeating_inventory_" + currentID + "_itemmodifiers");
        });
        getAttrs(attr_fields, function(v) {
            var base = v[attr + "_base"] && !isNaN(parseInt(v[attr + "_base"], 10)) ? parseInt(v[attr + "_base"], 10) : 10;
            var bonus = v[attr + "_bonus"] && !isNaN(parseInt(v[attr + "_bonus"], 10)) ? parseInt(v[attr + "_bonus"], 10) : 0;
            var item_base = 0;
            var item_bonus = 0;
            _.each(idarray, function(currentID) {
                if ((!v["repeating_inventory_" + currentID + "_equipped"] || v["repeating_inventory_" + currentID + "_equipped"] === "1") && v["repeating_inventory_" + currentID + "_itemmodifiers"] && v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().indexOf(attr > -1)) {
                    var mods = v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().split(",");
                    _.each(mods, function(mod) {
                        if (mod.indexOf(attr) > -1) {
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

            update[attr + "_flag"] = bonus != 0 || item_bonus > 0 || item_base > base ? 1 : 0;
            base = base > item_base ? base : item_base;
            update[attr] = base + bonus + item_bonus;
            setAttrs(update);
        });
    });
};

var update_initiative = function() {
    var attrs_to_get = ["agility", "initmod"];
    getSectionIDs("repeating_inventory", function(idarray) {
        _.each(idarray, function(currentID, i) {
            attrs_to_get.push("repeating_inventory_" + currentID + "_equipped");
            attrs_to_get.push("repeating_inventory_" + currentID + "_itemmodifiers");
        });
        getAttrs(attrs_to_get, function(v) {
            var update = {};
            var final_init = parseInt(v["agility"], 10);
            if (v["initmod"] && !isNaN(parseInt(v["initmod"], 10))) {
                final_init = final_init + parseInt(v["initmod"], 10);
            }
            _.each(idarray, function(currentID) {
                if (v["repeating_inventory_" + currentID + "_equipped"] && v["repeating_inventory_" + currentID + "_equipped"] === "1" && v["repeating_inventory_" + currentID + "_itemmodifiers"] && v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().indexOf("ability checks") > -1) {
                    var mods = v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().split(",");
                    _.each(mods, function(mod) {
                        if (mod.indexOf("ability checks") > -1) {
                            if (mod.indexOf("-") > -1) {
                                var new_mod = !isNaN(parseInt(mod.replace(/[^0-9]/g, ""), 10)) ? parseInt(mod.replace(/[^0-9]/g, ""), 10) : false;
                                final_init = new_mod ? final_init - new_mod : final_init;
                            } else {
                                var new_mod = !isNaN(parseInt(mod.replace(/[^0-9]/g, ""), 10)) ? parseInt(mod.replace(/[^0-9]/g, ""), 10) : false;
                                final_init = new_mod ? final_init + new_mod : final_init;
                            }
                        }
                    });
                }
            });
            if (final_init % 1 != 0) {
                final_init = parseFloat(final_init.toPrecision(12));
            }
            update["initiative"] = final_init;
            setAttrs(update, {
                silent: true
            });
        });
    });
};