['power', 'agility', 'vitality', 'cultivation', 'qicontrol', 'mental', 'appearance'].forEach(attr => {
    on(`change:${attr}_base change:${attr}_bonus`, function(){
        update_attr(`${attr}`);
    });
});

['power', 'agility', 'vitality', 'cultivation', 'qicontrol', 'mental', 'appearance'].forEach(attr => {
    on(`change:${attr}`, function() {
        switch (`${attr}`) {
            case "power":
                update_weight()
                update_skills(["athletics", "grapple", "intimidation","survival"]);
                break;
            case "agility":
                update_initiative();
                update_skills([,"acrobatics","discretion","stealth","fine_arts","forgery","navigation","performance"]);
                break;
            case "vitality":
                update_skills(["", ""]);
            case "cultivation":
                update_skills(["", ""]);
                break;
            case "qicontrol":
                update_skills(["history","medicine"]);
                break;
            case "mental":
                update_skills(["charm","deceit","disguise","persuade","fine_arts","forgery","navigation","history","medicine","intuition","investigation","perception","survival"]);
                break;
            case "appearance":
                update_skills(["charm","deceit","disguise","persuade","intimidation","performance"]);
                break;
            default:
                false;
        }
    });
});

on("change:initiative_bonus", function(eventInfo){
    update_initiative();
});

on('change:mortal-level', function(eventInfo){
    ['power', 'agility', 'vitality', 'cultivation', 'qicontrol', 'mental', 'appearance'].forEach(attr => {
        update_attr(`${attr}`);
    });
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
});

on("remove:repeating_inventory", function(eventinfo) {
    var itemid = eventinfo.sourceAttribute.substring(20, 40);
    if (eventinfo.removedInfo && eventinfo.removedInfo["repeating_inventory_" + itemid + "_itemmodifiers"]) {
        check_itemmodifiers(eventinfo.removedInfo["repeating_inventory_" + itemid + "_itemmodifiers"]);
    }
    update_weight();
});

var update_attr = function(attr) {
    var update = {};
    var attr_fields = [attr + "_base", attr + "_bonus", attr + "_dc_bonus", "global_dc_mod", "mortal-level"];
    getSectionIDs("repeating_inventory", function(idarray) {
        _.each(idarray, function(currentID, i) {
            attr_fields.push("repeating_inventory_" + currentID + "_equipped");
            attr_fields.push("repeating_inventory_" + currentID + "_itemmodifiers");
        });
        getAttrs(attr_fields, function(v) {
            var base = v[attr + "_base"] && !isNaN(parseInt(v[attr + "_base"], 10)) ? parseInt(v[attr + "_base"], 10) : 10;
            var bonus = v[attr + "_bonus"] && !isNaN(parseInt(v[attr + "_bonus"], 10)) ? parseInt(v[attr + "_bonus"], 10) : 0;
            var global_dc_mod = v["global_dc_bonus"] && !isNaN(parseInt(v["global_dc_bonus"], 10)) ? parseInt(v["global_dc_bonus"], 10) : 0;
            var attr_dc_bonus = v[attr + "_dc_bonus"] && !isNaN(parseInt(v[attr + "_dc_bonus"], 10)) ? parseInt(v[attr + "_dc_bonus"], 10) : 0;
            var level = v["mortal-level"] && !isNaN(parseInt(v["mortal-level"], 10)) ? parseInt(v["mortal-level"], 10) : 0;
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
            finalattr = base + bonus + item_bonus;

            var finaldc = Math.floor(finalattr * (3.5 + Math.floor(level / 7))) + global_dc_mod + attr_dc_bonus;
            update[attr + "_dc"] = finaldc;
            update[attr] = finalattr
            setAttrs(update);
        });
    });
};

var update_initiative = function() {
    var attrs_to_get = ["agility", "initiative_bonus"];
    getSectionIDs("repeating_inventory", function(idarray) {
        _.each(idarray, function(currentID, i) {
            attrs_to_get.push("repeating_inventory_" + currentID + "_equipped");
            attrs_to_get.push("repeating_inventory_" + currentID + "_itemmodifiers");
        });
        getAttrs(attrs_to_get, function(v) {
            var update = {};
            var agility = parseInt(v.agility) || 0;
            var final_init = parseInt(v["dexterity_mod"], 10);
            if (v["initiative_bonus"] && !isNaN(parseInt(v["initiative_bonus"], 10))) {
                final_init = final_init + parseInt(v["initiative_bonus"], 10);
            }
            _.each(idarray, function(currentID) {
                if (v["repeating_inventory_" + currentID + "_equipped"] && v["repeating_inventory_" + currentID + "_equipped"] === "1" && v["repeating_inventory_" + currentID + "_itemmodifiers"] && v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().indexOf("initiative") > -1) {
                    var mods = v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().split(",");
                    _.each(mods, function(mod) {
                        if (mod.indexOf("initiative") > -1) {
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
            update["initiative"] = agility + (parseInt(v.final_init) ? `d6 + ${parseInt(v.final_init)}` : 'd6');
            setAttrs(update, {
                silent: true
            });
        });
    });
};

var update_weight = function() {
    var update = {};
    var wtotal = 0;
    var stotal = 0;
    var weight_attrs = ["power", "carrying_capacity_mod", "inventory_slots_mod", "itemweightfixed", "itemslotsfixed"];
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

var update_skills = function(skills_array) {
    var attrs_to_get = ["power", "agility", "vitality", "cultivation", "qicontrol", "mental", "appearance"];
    var update = {};
    var callbacks = [];

    _.each(skills_array, function(s) {
        attrs_to_get.push(s + "_bonus");
    });

    getSectionIDs("repeating_inventory", function(idarray) {
        _.each(idarray, function(currentID, i) {
            attrs_to_get.push("repeating_inventory_" + currentID + "_equipped");
            attrs_to_get.push("repeating_inventory_" + currentID + "_itemmodifiers");
        });

        getAttrs(attrs_to_get, function(v) {
            _.each(skills_array, function(s) {
                console.log("UPDATING SKILL: " + s);
                var skill_bonus = 0;
                if (v[s + "_bonus"]) {
                    var bonus = v[s + "_bonus"];
                    console.log(bonus)
                    skill_bonus = parseInt(v[bonus], 10);
                    console.log(skill_bonus)
                }

                var item_bonus = 0;
                _.each(idarray, function(currentID) {
                    if (v["repeating_inventory_" + currentID + "_equipped"] && v["repeating_inventory_" + currentID + "_equipped"] === "1" && v["repeating_inventory_" + currentID + "_itemmodifiers"] && (v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().replace(/ /g, "_").indexOf(s) > -1 || v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().indexOf("skill checks") > -1)) {
                        var mods = v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().split(",");
                        _.each(mods, function(mod) {
                            if (mod.replace(/ /g, "_").indexOf(s) > -1 || mod.indexOf("skill checks") > -1) {
                                var new_mod = parseInt(mod.replace(/[^0-9]/g, ""), 10);
                                if (mod.indexOf("-") > -1) {
                                    item_bonus -= new_mod;
                                } else {
                                    item_bonus += new_mod;
                                }
                            };
                        });
                    };
                });

                var roll = 0;
                switch(s) {
                    case "acrobatics":
                    case "discretion":
                    case "stealth":
                        roll = parseInt(v.agility, 10);
                        break;
                    case "athletics":
                    case "grapple":
                        roll = parseInt(v.power, 10);
                        break;
                    case "charm":
                    case "deceit":
                    case "disguise":
                    case "persuade":
                        roll = parseInt(v.mental, 10) + parseInt(v.appearance, 10);
                        break;
                    case "fine_arts":
                    case "forgery":
                    case "navigation":
                        roll = Math.floor(parseInt(v.agility, 10) / 2) + Math.floor(parseInt(v.mental, 10) / 2);
                        break;
                    case "history":
                    case "medicine":
                        roll = Math.floor(parseInt(v.qicontrol, 10) / 2) + Math.floor(parseInt(v.mental, 10) / 2);
                        break;
                    case "intuition":
                    case "investigation":
                    case "perception":
                        roll = parseInt(v.mental, 10);
                        break;
                    case "intimidation":
                        roll = parseInt(v.power, 10) + parseInt(v.appearance, 10);
                        break;
                    case "performance":
                        roll = parseInt(v.agility, 10) + parseInt(v.appearance, 10);
                        break;
                    case "survival":
                        roll = Math.floor(parseInt(v.power, 10) / 2) + Math.floor(parseInt(v.mental, 10) / 2);
                        break;
                }

                var total = skill_bonus + item_bonus;
                update[s + "_bonus"] = total;
                update[s + "_roll"] = roll;
                if (total > 0) {
                    update[s] = roll + "d6 + " + total;
                } else {
                    update[s] = roll + "d6";
                }
            });

            setAttrs(update, {
                silent: true
            }, function() {
                callbacks.forEach(function(callback) {
                    callback();
                });
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
        if (mod.indexOf("qicontrol") > -1) {
            update_attr("qicontrol");
        };
        if (mod.indexOf("mental") > -1) {
            update_attr("mental");
        };
        if (mod.indexOf("skill checks") > -1) {
            update_all_skill_checks();
        };
        if (mod.indexOf("acrobatics") > -1) {
            update_skills(["acrobatics"]);
        };
        if (mod.indexOf("athletics") > -1) {
            update_skills(["athletics"]);
        };
        if (mod.indexOf("charm") > -1) {
            update_skills(["charm"]);
        };
        if (mod.indexOf("deceit") > -1) {
            update_skills(["deceit"]);
        };
        if (mod.indexOf("discretion") > -1) {
            update_skills(["discretion"]);
        };
        if (mod.indexOf("disguise") > -1) {
            update_skills(["disguise"]);
        };
        if (mod.indexOf("fine_arts") > -1) {
            update_skills(["fine_arts"]);
        };
        if (mod.indexOf("forgery") > -1) {
            update_skills(["forgery"]);
        };
        if (mod.indexOf("grapple") > -1) {
            update_skills(["grapple"]);
        };
        if (mod.indexOf("history") > -1) {
            update_skills(["history"]);
        };
        if (mod.indexOf("intuition") > -1) {
            update_skills(["intuition"]);
        };
        if (mod.indexOf("intimidation") > -1) {
            update_skills(["intimidation"]);
        };
        if (mod.indexOf("investigation") > -1) {
            update_skills(["investigation"]);
        };
        if (mod.indexOf("medicine") > -1) {
            update_skills(["medicine"]);
        };
        if (mod.indexOf("navigation") > -1) {
            update_skills(["navigation"]);
        };
        if (mod.indexOf("perception") > -1) {
            update_skills(["perception"]);
        };
        if (mod.indexOf("performance") > -1) {
            update_skills(["performance"]);
        };
        if (mod.indexOf("persuade") > -1) {
            update_skills(["persuade"]);
        };
        if (mod.indexOf("stealth") > -1) {
            update_skills(["stealth"]);
        };
        if (mod.indexOf("survival") > -1) {
            update_skills(["survival"]);
        };
    });
};

var update_all_ability_checks = function() {
    update_initiative();
    update_skills(["acrobatics","athletics","charm","deceit","discretion","disguise","fine_arts","forgery","grapple","history","intuition","intimidation","investigation","medicine","navigation","perception","performance","persuade","stealth","survival"]);
};