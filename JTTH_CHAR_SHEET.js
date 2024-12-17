on("sheet:opened", function() {
  var c = "acrobatics_bonus acrobatics_roll agility agility_base agility_bonus agility_dc agility_flag appearance athletics_bonus athletics_roll cultivation cultivation_base cultivation_bonus cultivation_dc cultivation_flag cultivator_global_acc_attack cultivator_global_attack_mod cultivator_global_damage_damage cultivator_global_damage_mod_type cultivator_global_eff_attack deceit_bonus deceit_roll discretion_bonus discretion_roll disguise_bonus disguise_roll fine_arts_bonus fine_arts_roll forgery_bonus forgery_roll global_acc_attack global_attack_mod global_attribute_bonus global_damage_damage global_dc_bonus global_eff_attack global_skill_bonus grapple_bonus grapple_roll history_bonus history_roll initiative initiative_bonus intimidation_bonus intimidation_roll intuition_bonus intuition_roll investigation_bonus investigation_roll medicine_bonus medicine_roll mental mental_base mental_bonus mental_dc mental_flag mortal_global_damage_mod_type navigation_bonus navigation_roll perception_bonus perception_roll performance_bonus performance_roll persuade_bonus persuade_roll power power_base power_bonus power_dc power_flag qicontrol qicontrol_base qicontrol_bonus qicontrol_dc qicontrol_flag seduce_bonus seduce_roll stealth_bonus stealth_roll survival_bonus survival_roll vitality vitality_base vitality_bonus vitality_dc vitality_flag".split(" ");
  getAttrs(c, function(e) {
    var a = {};
    _.each(c, function(b) {
      e[b] && e[b] !== "" || (a[b] = 0);
    });
    Object.keys(a).length > 0 && setAttrs(a);
  });
});
on("sheet:opened", function() {
  var c = "cultivator_global_acc_attack cultivator_global_attack_mod cultivator_global_eff_attack global_acc_attack global_attack_mod global_eff_attack".split(" ");
  getAttrs(c, function(e) {
    var a = {};
    _.each(c, function(b) {
      e[b] && e[b] !== "" || (a[b] = "");
    });
    Object.keys(a).length > 0 && setAttrs(a);
  });
});
"power agility vitality cultivation qicontrol mental appearance".split(" ").forEach(c => {
  on(`change:${c}_base change:${c}_bonus change:${c}_dc_bonus`, function() {
    update_attr(`${c}`);
  });
});
"power agility vitality cultivation qicontrol mental appearance".split(" ").forEach(c => {
  on(`change:${c}`, function() {
    update_mortalattacks("all");
    update_cultivatorattacks("all");
    switch(`${c}`) {
      case "power":
        update_weight();
        update_skills(["athletics", "grapple", "intimidation", "survival"]);
        break;
      case "agility":
        update_initiative();
        update_evasion();
        update_skills("acrobatics discretion stealth fine_arts forgery navigation performance".split(" "));
        break;
      case "vitality":
        update_durability();
        break;
      case "qicontrol":
        update_skills(["history", "medicine"]);
        break;
      case "mental":
        update_skills("seduce deceit disguise persuade fine_arts forgery navigation history medicine intuition investigation perception survival".split(" "));
        break;
      case "appearance":
        update_skills("seduce deceit disguise persuade intimidation performance".split(" "));
    }
  });
});
"acrobatics athletics seduce deceit discretion disguise fine_arts forgery grapple history intuition intimidation investigation medicine navigation perception performance persuade stealth survival".split(" ").forEach(c => {
  on(`change:${c}_flat`, function(e) {
    "sheetworker" !== e.sourceType && update_skills([`${c}`]);
  });
});
on("change:initiative_bonus", function() {
  update_initiative();
});
on("change:mortal-level", function() {
  "power agility vitality cultivation qicontrol mental appearance".split(" ").forEach(c => {
    update_attr(`${c}`);
  });
});
on("change:repeating_inventory:itemmodifiers change:repeating_inventory:equipped change:repeating_inventory:carried", function(c) {
  if (!c.sourceType || "sheetworker" !== c.sourceType) {
    var e = c.sourceAttribute.substring(20, 40);
    getAttrs(["repeating_inventory_" + e + "_itemmodifiers"], function(a) {
      a["repeating_inventory_" + e + "_itemmodifiers"] && check_itemmodifiers(a["repeating_inventory_" + e + "_itemmodifiers"], c.previousValue);
    });
  }
});
on("change:repeating_inventory:itemcontainer change:repeating_inventory:equipped change:repeating_inventory:carried change:repeating_inventory:itemweight change:repeating_inventory:itemcount change:encumberance_setting change:size change:carrying_capacity_mod change:use_inventory_slots change:inventory_slots_mod change:repeating_inventory:itemweightfixed change:repeating_inventory:itemslotsfixed change:repeating_inventory:itemsize change:repeating_inventory:itemcontainer_slots change:repeating_inventory:itemcontainer_slots_modifier", 
function() {
  update_weight();
});
on("change:repeating_mortalattack:atkname change:repeating_mortalattack:atkflag change:repeating_mortalattack:atkattr_base change:repeating_mortalattack:atkmod change:repeating_mortalattack:dmgflag change:repeating_mortalattack:dmgbase change:repeating_mortalattack:dmgattr change:repeating_mortalattack:dmgmod change:repeating_mortalattack:dmgtype change:repeating_mortalattack:dmg2flag change:repeating_mortalattack:dmg2base change:repeating_mortalattack:dmg2attr change:repeating_mortalattack:dmg2mod change:repeating_mortalattack:dmg2type change:repeating_mortalattack:dmg3flag change:repeating_mortalattack:dmg3base change:repeating_mortalattack:dmg3attr change:repeating_mortalattack:dmg3mod change:repeating_mortalattack:dmg3type change:repeating_mortalattack:saveflag change:repeating_mortalattack:savedc change:repeating_mortalattack:saveflat change:repeating_mortalattack:saveattr change:repeating_mortalattack:atkrange", 
function(c) {
  "sheetworker" !== c.sourceType && (c = c.sourceAttribute.substring(23, 43), update_mortalattacks(c));
});
on("change:repeating_mortaldamagemod remove:repeating_mortaldamagemod", function() {
  update_mortalglobaldamage();
});
on("change:repeating_mortaltohitmod remove:repeating_mortaltohitmod", function() {
  update_mortalglobalattack();
});
on("change:repeating_cultivatorattack:atkname change:repeating_cultivatorattack:atkflag change:repeating_cultivatorattack:atkattr_base change:repeating_cultivatorattack:atkmod change:repeating_cultivatorattack:dmgflag change:repeating_cultivatorattack:dmgbase change:repeating_cultivatorattack:dmgattr change:repeating_cultivatorattack:dmgmod change:repeating_cultivatorattack:dmgtype change:repeating_cultivatorattack:dmg2flag change:repeating_cultivatorattack:dmg2base change:repeating_cultivatorattack:dmg2attr change:repeating_cultivatorattack:dmg2mod change:repeating_cultivatorattack:dmg2type change:repeating_cultivatorattack:dmg3flag change:repeating_cultivatorattack:dmg3base change:repeating_cultivatorattack:dmg3attr change:repeating_cultivatorattack:dmg3mod change:repeating_cultivatorattack:dmg3type change:repeating_cultivatorattack:saveflag change:repeating_cultivatorattack:savedc change:repeating_cultivatorattack:saveflat change:repeating_cultivatorattack:saveattr change:repeating_cultivatorattack:atkrange", 
function(c) {
  "sheetworker" !== c.sourceType && (c = c.sourceAttribute.substring(27, 47), update_cultivatorattacks(c));
});
on("change:repeating_cultivatordamagemod remove:repeating_cultivatordamagemod", function() {
  update_cultivatorglobaldamage();
});
on("change:repeating_cultivatortohitmod remove:repeating_cultivatortohitmod", function() {
  update_cultivatorglobalattack();
});
on("change:global_damage_mod_flag", function(c) {
  getSectionIDs("mortaldamagemod", function(e) {
    var a = {};
    "1" === c.newValue ? e && 0 !== e.length || (e = generateRowID(), a[`repeating_mortaldamagemod_${e}_global_damage_active_flag`] = "1") : _.each(e, function(b) {
      a[`repeating_mortaldamagemod_${b}_global_damage_active_flag`] = "0";
    });
    setAttrs(a);
  });
});
on("change:global_dc_bonus change:global_attribute_bonus", function(c) {
  "power agility vitality cultivation qicontrol mental".split(" ").forEach(e => {
    update_attr(`${e}`);
  });
});
on("change:dtype", function(c) {
  c.sourceType && "sheetworker" === c.sourceType || (update_mortalattacks("all"), update_cultivatorattacks("all"));
});
on("change:durability-base change:durability-limit change:durability-bonus", function() {
  update_durability();
});
on("change:evasion-base change:evasion-bonus", function() {
  update_evasion();
});
on("change:reduction-base change:reduction-armour change:reduction-bonus", function() {
  update_reduction();
});
on("remove:repeating_inventory", function(c) {
  var e = c.sourceAttribute.substring(20, 40);
  c.removedInfo && c.removedInfo["repeating_inventory_" + e + "_itemmodifiers"] && check_itemmodifiers(c.removedInfo["repeating_inventory_" + e + "_itemmodifiers"]);
  update_weight();
});
var check_itemmodifiers = function(c, e) {
  c = c.toLowerCase().split(",");
  e && (prevmods = e.toLowerCase().split(","), c = _.union(c, prevmods));
  _.each(c, function(a) {
    -1 < a.indexOf("power") && update_attr("power");
    -1 < a.indexOf("agility") && update_attr("agility");
    -1 < a.indexOf("vitality") && update_attr("vitality");
    -1 < a.indexOf("cultivation") && update_attr("cultivation");
    -1 < a.indexOf("qicontrol") && update_attr("qicontrol");
    -1 < a.indexOf("mental") && update_attr("mental");
    -1 < a.indexOf("appearance") && update_attr("appearance");
    -1 < a.indexOf("skill checks") && update_all_skill_checks();
    -1 < a.indexOf("acrobatics") && update_skills(["acrobatics"]);
    -1 < a.indexOf("athletics") && update_skills(["athletics"]);
    -1 < a.indexOf("seduce") && update_skills(["seduce"]);
    -1 < a.indexOf("deceit") && update_skills(["deceit"]);
    -1 < a.indexOf("discretion") && update_skills(["discretion"]);
    -1 < a.indexOf("disguise") && update_skills(["disguise"]);
    -1 < a.indexOf("fine_arts") && update_skills(["fine_arts"]);
    -1 < a.indexOf("forgery") && update_skills(["forgery"]);
    -1 < a.indexOf("grapple") && update_skills(["grapple"]);
    -1 < a.indexOf("history") && update_skills(["history"]);
    -1 < a.indexOf("intuition") && update_skills(["intuition"]);
    -1 < a.indexOf("intimidation") && update_skills(["intimidation"]);
    -1 < a.indexOf("investigation") && update_skills(["investigation"]);
    -1 < a.indexOf("medicine") && update_skills(["medicine"]);
    -1 < a.indexOf("navigation") && update_skills(["navigation"]);
    -1 < a.indexOf("perception") && update_skills(["perception"]);
    -1 < a.indexOf("performance") && update_skills(["performance"]);
    -1 < a.indexOf("persuade") && update_skills(["persuade"]);
    -1 < a.indexOf("stealth") && update_skills(["stealth"]);
    -1 < a.indexOf("survival") && update_skills(["survival"]);
  });
}, update_attr = function(c) {
  var e = {}, a = [c + "_base", c + "_bonus", c + "_dc_bonus", "global_dc_bonus", "mortal-level", "global_attribute_bonus"];
  getSectionIDs("repeating_inventory", function(b) {
    _.each(b, function(g) {
      a.push("repeating_inventory_" + g + "_equipped");
      a.push("repeating_inventory_" + g + "_itemmodifiers");
    });
    getAttrs(a, function(g) {
      var f = g[c + "_base"] && !isNaN(parseInt(g[c + "_base"], 0)) ? parseInt(g[c + "_base"], 0) : 0, d = g[c + "_bonus"] && !isNaN(parseInt(g[c + "_bonus"], 0)) ? parseInt(g[c + "_bonus"], 0) : 0, h = g.global_attribute_bonus && !isNaN(parseInt(g.global_attribute_bonus, 0)) ? parseInt(g.global_attribute_bonus, 0) : 0, k = g.global_dc_bonus && !isNaN(parseInt(g.global_dc_bonus, 0)) ? parseInt(g.global_dc_bonus, 0) : 0, l = g[c + "_dc_bonus"] && !isNaN(parseInt(g[c + "_dc_bonus"], 0)) ? parseInt(g[c + 
      "_dc_bonus"], 0) : 0, m = g["mortal-level"] && !isNaN(parseInt(g["mortal-level"], 0)) ? parseInt(g["mortal-level"], 0) : 0, n = 0, u = 0;
      _.each(b, function(p) {
        g["repeating_inventory_" + p + "_equipped"] && "1" !== g["repeating_inventory_" + p + "_equipped"] || !g["repeating_inventory_" + p + "_itemmodifiers"] || !g["repeating_inventory_" + p + "_itemmodifiers"].toLowerCase().indexOf(-1 < c) || (p = g["repeating_inventory_" + p + "_itemmodifiers"].toLowerCase().split(","), _.each(p, function(q) {
          -1 < q.indexOf(c) && (-1 < q.indexOf(":") ? n = (q = isNaN(parseInt(q.replace(/[^0-9]/g, ""), 0)) ? !1 : parseInt(q.replace(/[^0-9]/g, ""), 0)) && q > n ? q : n : u = -1 < q.indexOf("-") ? (q = isNaN(parseInt(q.replace(/[^0-9]/g, ""), 0)) ? !1 : parseInt(q.replace(/[^0-9]/g, ""), 0)) ? u - q : u : (q = isNaN(parseInt(q.replace(/[^0-9]/g, ""), 0)) ? !1 : parseInt(q.replace(/[^0-9]/g, ""), 0)) ? u + q : u);
        }));
      });
      e[c + "_flag"] = 0 != d || 0 != h || 0 < u || n > f ? 1 : 0;
      finalattr = (f > n ? f : n) + d + u + h;
      e[c + "_dc"] = Math.floor(finalattr * (3.5 + Math.floor(m / 7))) + k + l;
      e[c] = finalattr;
      setAttrs(e);
    });
  });
}, update_initiative = function() {
  var c = ["agility", "initiative_bonus"];
  getSectionIDs("repeating_inventory", function(e) {
    _.each(e, function(a) {
      c.push("repeating_inventory_" + a + "_equipped");
      c.push("repeating_inventory_" + a + "_itemmodifiers");
    });
    getAttrs(c, function(a) {
      var b = {}, g = parseInt(a.agility) || 0, f = parseInt(a.dexterity_mod, 0);
      a.initiative_bonus && !isNaN(parseInt(a.initiative_bonus, 0)) && (f += parseInt(a.initiative_bonus, 0));
      _.each(e, function(d) {
        a["repeating_inventory_" + d + "_equipped"] && "1" === a["repeating_inventory_" + d + "_equipped"] && a["repeating_inventory_" + d + "_itemmodifiers"] && -1 < a["repeating_inventory_" + d + "_itemmodifiers"].toLowerCase().indexOf("initiative") && (d = a["repeating_inventory_" + d + "_itemmodifiers"].toLowerCase().split(","), _.each(d, function(h) {
          -1 < h.indexOf("initiative") && (f = -1 < h.indexOf("-") ? (h = isNaN(parseInt(h.replace(/[^0-9]/g, ""), 0)) ? !1 : parseInt(h.replace(/[^0-9]/g, ""), 0)) ? f - h : f : (h = isNaN(parseInt(h.replace(/[^0-9]/g, ""), 0)) ? !1 : parseInt(h.replace(/[^0-9]/g, ""), 0)) ? f + h : f);
        }));
      });
      0 != f % 1 && (f = parseFloat(f.toPrecision(12)));
      b.initiative = g + (parseInt(a.final_init) ? `d6+${parseInt(a.final_init)}` : "d6");
      setAttrs(b, {silent:!0});
    });
  });
}, update_mortalattacks = function(c, e) {
  console.log("DOING MORTAL_UPDATE_ATTACKS: " + c);
  "-" === c.substring(0, 1) && 20 === c.length ? do_update_mortalattack([c], e) : -1 < "power agility vitality cultivation qicontrol mental all".split(" ").indexOf(c) && getSectionIDs("repeating_mortalattack", function(a) {
    if ("all" === c) {
      do_update_mortalattack(a);
    } else {
      var b = [];
      _.each(a, function(g) {
        b.push("repeating_attack_" + g + "_atkattr_base");
        b.push("repeating_attack_" + g + "_dmgattr");
        b.push("repeating_attack_" + g + "_dmg2attr");
        b.push("repeating_attack_" + g + "_dmg3attr");
        b.push("repeating_attack_" + g + "_savedc");
      });
      getAttrs(b, function(g) {
        var f = [];
        _.each(a, function(d) {
          (g["repeating_attack_" + d + "_atkattr_base"] && -1 < g["repeating_attack_" + d + "_atkattr_base"].indexOf(c) || g["repeating_attack_" + d + "_dmgattr"] && -1 < g["repeating_attack_" + d + "_dmgattr"].indexOf(c) || g["repeating_attack_" + d + "_dmg2attr"] && -1 < g["repeating_attack_" + d + "_dmg2attr"].indexOf(c) || g["repeating_attack_" + d + "_dmg3attr"] && -1 < g["repeating_attack_" + d + "_dmg3attr"].indexOf(c) || g["repeating_attack_" + d + "_savedc"] && -1 < g["repeating_attack_" + 
          d + "_savedc"].indexOf(c)) && f.push(d);
        });
        0 < f.length && do_update_mortalattack(f);
      });
    }
  });
}, do_update_mortalattack = function(c) {
  var e = "level dtype power agility vitality cultivation qicontrol mental global_damage_damage mortal_global_damage_mod_type global_damage_percent".split(" ");
  _.each(c, function(a) {
    e.push("repeating_mortalattack_" + a + "_atkflag");
    e.push("repeating_mortalattack_" + a + "_atkname");
    e.push("repeating_mortalattack_" + a + "_atkattr_base");
    e.push("repeating_mortalattack_" + a + "_atkmod");
    e.push("repeating_mortalattack_" + a + "_dmgflag");
    e.push("repeating_mortalattack_" + a + "_dmgbase");
    e.push("repeating_mortalattack_" + a + "_dmgattr");
    e.push("repeating_mortalattack_" + a + "_dmgmod");
    e.push("repeating_mortalattack_" + a + "_dmgtype");
    e.push("repeating_mortalattack_" + a + "_dmg2flag");
    e.push("repeating_mortalattack_" + a + "_dmg2base");
    e.push("repeating_mortalattack_" + a + "_dmg2attr");
    e.push("repeating_mortalattack_" + a + "_dmg2mod");
    e.push("repeating_mortalattack_" + a + "_dmg2type");
    e.push("repeating_mortalattack_" + a + "_dmg3flag");
    e.push("repeating_mortalattack_" + a + "_dmg3base");
    e.push("repeating_mortalattack_" + a + "_dmg3attr");
    e.push("repeating_mortalattack_" + a + "_dmg3mod");
    e.push("repeating_mortalattack_" + a + "_dmg3type");
    e.push("repeating_mortalattack_" + a + "_saveflag");
    e.push("repeating_mortalattack_" + a + "_savedc");
    e.push("repeating_mortalattack_" + a + "_saveeffect");
    e.push("repeating_mortalattack_" + a + "_saveflat");
    e.push("repeating_mortalattack_" + a + "_atkrange");
    e.push("repeating_mortalattack_" + a + "_global_damage_mod_field");
  });
  getAttrs(e, function(a) {
    _.each(c, function(b) {
      var g = [], f = {}, d = "", h = "", k = "", l = "", m = "", n = "", u = n = "", p = "", q = "", r = "", t = "";
      a.global_damage_percent = a.global_damage_percent || 1;
      a["repeating_mortalattack_" + b + "_atkattr_base"] && "0" !== a["repeating_mortalattack_" + b + "_atkattr_base"] ? (atkattr_base = parseInt(a[a["repeating_mortalattack_" + b + "_atkattr_base"].substring(2, a["repeating_mortalattack_" + b + "_atkattr_base"].length - 1)], 0), n = a["repeating_mortalattack_" + b + "_atkattr_base"].substring(2, a["repeating_mortalattack_" + b + "_atkattr_base"].length - 1).toUpperCase()) : atkattr_base = 0;
      a["repeating_mortalattack_" + b + "_dmgattr"] && "0" !== a["repeating_mortalattack_" + b + "_dmgattr"] ? (dmgattr = parseInt(a[a["repeating_mortalattack_" + b + "_dmgattr"].substring(2, a["repeating_mortalattack_" + b + "_dmgattr"].length - 1)], 0), u = a["repeating_mortalattack_" + b + "_dmgattr"].substring(2, a["repeating_mortalattack_" + b + "_dmgattr"].length - 1).toUpperCase()) : dmgattr = 0;
      dmgattr = Math.floor(dmgattr * a.global_damage_percent);
      a["repeating_mortalattack_" + b + "_dmg2attr"] && "0" !== a["repeating_mortalattack_" + b + "_dmg2attr"] ? (dmg2attr = parseInt(a[a["repeating_mortalattack_" + b + "_dmg2attr"].substring(2, a["repeating_mortalattack_" + b + "_dmg2attr"].length - 1)], 0), p = a["repeating_mortalattack_" + b + "_dmg2attr"].substring(2, a["repeating_mortalattack_" + b + "_dmg2attr"].length - 1).toUpperCase()) : dmg2attr = 0;
      dmg2attr = Math.floor(dmg2attr * a.global_damage_percent);
      a["repeating_mortalattack_" + b + "_dmg3attr"] && "0" !== a["repeating_mortalattack_" + b + "_dmg3attr"] ? (dmg3attr = parseInt(a[a["repeating_mortalattack_" + b + "_dmg3attr"].substring(2, a["repeating_mortalattack_" + b + "_dmg3attr"].length - 1)], 0), q = a["repeating_mortalattack_" + b + "_dmg3attr"].substring(2, a["repeating_mortalattack_" + b + "_dmg3attr"].length - 1).toUpperCase()) : dmg3attr = 0;
      dmg3attr = Math.floor(dmg3attr * a.global_damage_percent);
      var C = a["repeating_mortalattack_" + b + "_dmgbase"] && "" != a["repeating_mortalattack_" + b + "_dmgbase"] ? a["repeating_mortalattack_" + b + "_dmgbase"] : 0, D = a["repeating_mortalattack_" + b + "_dmg2base"] && "" != a["repeating_mortalattack_" + b + "_dmg2base"] ? a["repeating_mortalattack_" + b + "_dmg2base"] : 0, E = a["repeating_mortalattack_" + b + "_dmg3base"] && "" != a["repeating_mortalattack_" + b + "_dmg3base"] ? a["repeating_mortalattack_" + b + "_dmg3base"] : 0, x = a["repeating_mortalattack_" + 
      b + "_dmgmod"] && !1 === isNaN(parseInt(a["repeating_mortalattack_" + b + "_dmgmod"], 0)) ? parseInt(a["repeating_mortalattack_" + b + "_dmgmod"], 0) : 0, y = a["repeating_mortalattack_" + b + "_dmg2mod"] && !1 === isNaN(parseInt(a["repeating_mortalattack_" + b + "_dmg2mod"], 0)) ? parseInt(a["repeating_mortalattack_" + b + "_dmg2mod"], 0) : 0, z = a["repeating_mortalattack_" + b + "_dmg3mod"] && !1 === isNaN(parseInt(a["repeating_mortalattack_" + b + "_dmg3mod"], 0)) ? parseInt(a["repeating_mortalattack_" + 
      b + "_dmg3mod"], 0) : 0, F = a["repeating_mortalattack_" + b + "_dmgtype"] ? a["repeating_mortalattack_" + b + "_dmgtype"] + " " : "", G = a["repeating_mortalattack_" + b + "_dmg2type"] ? a["repeating_mortalattack_" + b + "_dmg2type"] + " " : "", H = a["repeating_mortalattack_" + b + "_dmg3type"] ? a["repeating_mortalattack_" + b + "_dmg3type"] + " " : "", A = a["repeating_mortalattack_" + b + "_atkmod"] && "" != a["repeating_mortalattack_" + b + "_atkmod"] ? parseInt(a["repeating_mortalattack_" + 
      b + "_atkmod"], 0) : 0, v = "+" + `[[ceil([[${a.global_damage_damage && "" !== a.global_damage_damage ? a.global_damage_damage : "0"}]] * ${parseFloat(a.global_damage_percent || 0)})]]` + "[" + (a.mortal_global_damage_mod_type || "") + "]", w = B => B && "0" !== B ? `[[ceil([[${B}]] * ${parseFloat(a.global_damage_percent || 0)})]]` : B;
      BB = C;
      CC = D;
      DD = E;
      C = w(C);
      D = w(D);
      E = w(E);
      a["repeating_mortalattack_" + b + "_atkflag"] && 0 != a["repeating_mortalattack_" + b + "_atkflag"] ? (bonus_mod = atkattr_base + A, plus_minus = -1 < bonus_mod ? "+" : "", bonus = plus_minus + bonus_mod) : a["repeating_mortalattack_" + b + "_saveflag"] && 0 != a["repeating_mortalattack_" + b + "_saveflag"] ? (a["repeating_mortalattack_" + b + "_savedc"] && "(@{saveflat})" === a["repeating_mortalattack_" + b + "_savedc"] ? w = !1 === isNaN(parseInt(a["repeating_mortalattack_" + b + "_saveflat"])) ? 
      parseInt(a["repeating_mortalattack_" + b + "_saveflat"]) : "0" : (w = a["repeating_mortalattack_" + b + "_savedc"].replace(/^[^{]*{/, "").replace(/_.*$/, ""), w = a[w] ? parseInt(a[w], 0) : 0), bonus = "DC" + w) : bonus = "-";
      a["repeating_mortalattack_" + b + "_dmgflag"] && 0 != a["repeating_mortalattack_" + b + "_dmgflag"] ? (0 === BB && 0 === dmgattr + x && (l = 0), 0 != BB && (l = BB), 0 != BB && 0 != dmgattr + x && (l = 0 < dmgattr + x ? l + "+" : l), 0 != dmgattr + x && (l += dmgattr + x), l = l + " " + F) : l = "";
      a["repeating_mortalattack_" + b + "_dmg2flag"] && 0 != a["repeating_mortalattack_" + b + "_dmg2flag"] ? (0 === CC && 0 === dmg2attr + y && (m = 0), 0 != CC && (m = CC), 0 != CC && 0 != dmg2attr + y && (m = 0 < dmg2attr + y ? m + "+" : m), 0 != dmg2attr + y && (m += dmg2attr + y), m = m + " " + G) : m = "";
      a["repeating_mortalattack_" + b + "_dmg3flag"] && 0 != a["repeating_mortalattack_" + b + "_dmg3flag"] ? (0 === DD && 0 === dmg3attr + z && (r = 0), 0 != DD && (r = DD), 0 != DD && 0 != dmg3attr + z && (r = 0 < dmg3attr + z ? r + "+" : r), 0 != dmg3attr + z && (r += dmg3attr + z), r = r + " " + H) : r = "";
      dmgspacer1 = a["repeating_mortalattack_" + b + "_dmgflag"] && 0 != a["repeating_mortalattack_" + b + "_dmgflag"] && a["repeating_mortalattack_" + b + "_dmg2flag"] && 0 != a["repeating_mortalattack_" + b + "_dmg2flag"] ? "+ " : "";
      dmgspacer2 = a["repeating_mortalattack_" + b + "_dmgflag"] && 0 != a["repeating_mortalattack_" + b + "_dmgflag"] && a["repeating_mortalattack_" + b + "_dmg3flag"] && 0 != a["repeating_mortalattack_" + b + "_dmg3flag"] ? "+ " : "";
      r2 = "{{r2=[[";
      a["repeating_mortalattack_" + b + "_atkflag"] && 0 != a["repeating_mortalattack_" + b + "_atkflag"] ? (0 != A && (d = "+" + A + "[MOD]" + d), 0 != atkattr_base && (d = atkattr_base + "[" + n + "]" + d)) : d = "";
      A = d !== "" ? Math.floor(parseFloat(d) * 0.75) : "";
      a["repeating_mortalattack_" + b + "_dmgflag"] && 0 != a["repeating_mortalattack_" + b + "_dmgflag"] ? (0 != x && (h = "+" + Math.floor(x * a.global_damage_percent) + "[MOD]" + h), 0 != dmgattr && (h = "+" + dmgattr + "[" + u + "]" + h), h = C + h) : h = "0";
      a["repeating_mortalattack_" + b + "_dmg2flag"] && 0 != a["repeating_mortalattack_" + b + "_dmg2flag"] ? (0 != y && (k = "+" + Math.floor(y * a.global_damage_percent) + "[MOD]" + k), 0 != dmg2attr && (k = "+" + dmg2attr + "[" + p + "]" + k), k = D + k) : k = "0";
      a["repeating_mortalattack_" + b + "_dmg3flag"] && 0 != a["repeating_mortalattack_" + b + "_dmg3flag"] ? (0 != z && (t = "+" + Math.floor(z * a.global_damage_percent) + "[MOD]" + t), 0 != dmg3attr && (t = "+" + dmg3attr + "[" + q + "]" + t), t = E + t) : t = "0";
      "full" === a.dtype ? (pickbase = "full", n = "@{whispertoggle}&{template:atkdmg} {{mod=@{atkbonus}}} {{rname=@{atkname}}} {{r1=[[" + d + "]]}} " + r2 + A + "]]}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + h + v + "]]}} {{dmg1type=" + F + "}} @{dmg2flag} {{dmg2=[[" + k + v + "]]}} {{dmg2type=" + G + "}} @{dmg3flag} {{dmg3=[[" + t + v + "]]}} {{dmg3type=" + H + "}} @{saveflag} {{desc=@{atk_desc}}} {{globalattack=@{global_attack_mod}}} {{globalaccattack=@{global_acc_attack}}} {{globaleffattack=@{global_eff_attack}}} {{globaldamagetype=@{mortal_global_damage_mod_type}}} @{charname_output}") : 
      a["repeating_mortalattack_" + b + "_atkflag"] && 0 != a["repeating_mortalattack_" + b + "_atkflag"] ? (pickbase = "pick", n = "@{whispertoggle}&{template:atk} {{mod=@{atkbonus}}} {{rname=[@{atkname}](~repeating_mortalattack_attack_dmg)}} {{r1=[[" + d + "]]}} " + r2 + A + "]]}} {{range=@{atkrange}}} {{desc=@{atk_desc}}} {{globalattack=@{global_attack_mod}}} {{globalaccattack=@{global_acc_attack}}} {{globaleffattack=@{global_eff_attack}}} @{charname_output}") : a["repeating_mortalattack_" + b + 
      "_dmgflag"] && 0 != a["repeating_mortalattack_" + b + "_dmgflag"] ? (pickbase = "dmg", n = "@{whispertoggle}&{template:dmg} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + h + v + "]]}} {{dmg1type=" + F + "}} @{dmg2flag} {{dmg2=[[" + k + v + "]]}} {{dmg2type=" + G + "}} @{dmg3flag} {{dmg3=[[" + t + v + "]]}} {{dmg3type=" + H + "}} @{saveflag} {{desc=@{atk_desc}}} {{globaldamagetype=@{mortal_global_damage_mod_type}}} @{charname_output}") : (pickbase = "empty", n = 
      "@{whispertoggle}&{template:dmg} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{saveflag} {{desc=@{atk_desc}}} @{charname_output}");
      f["repeating_mortalattack_" + b + "_rollbase_dmg"] = "@{whispertoggle}&{template:dmg} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + h + v + "]]}} {{dmg1type=" + F + "}} @{dmg2flag} {{dmg2=[[" + k + v + "]]}} {{dmg2type=" + G + "}} @{dmg3flag} {{dmg3=[[" + t + v + "]]}} {{dmg3type=" + H + "}} @{saveflag} {{desc=@{atk_desc}}} {{globaldamagetype=@{mortal_global_damage_mod_type}}} @{charname_output}";
      f["repeating_mortalattack_" + b + "_atkbonus"] = bonus;
      f["repeating_mortalattack_" + b + "_atkdmgtype"] = l + dmgspacer1 + m + dmgspacer2 + r + " ";
      f["repeating_mortalattack_" + b + "_rollbase"] = n;
      setAttrs(f, {silent:!0}, function() {
        g.forEach(function(B) {
          B();
        });
      });
    });
  });
}, update_mortalglobaldamage = function(c) {
  getSectionIDs("mortaldamagemod", function(e) {
    if (e) {
      var a = {}, b = [];
      e.forEach(function(g) {
        a[g] = {};
        b.push(`repeating_mortaldamagemod_${g}_global_damage_active_flag`, `repeating_mortaldamagemod_${g}_global_damage_name`, `repeating_mortaldamagemod_${g}_global_damage_damage`, `repeating_mortaldamagemod_${g}_global_damage_type`);
      });
      getAttrs(b, function(g) {
        var f = /^repeating_mortaldamagemod_(.+)_global_damage_(active_flag|name|damage|type)$/;
        _.each(g, function(h, k) {
          (k = f.exec(k)) && (a[k[1]][k[2]] = h);
        });
        var d = {global_damage_damage:"", global_damage_percent:0, mortal_global_damage_mod_type:""};
        console.log("MORTAL GLOBALDAMAGE");
        _.each(a, function(h) {
          if ("0" != h.active_flag && h.name && "" !== h.name) {
            if (h.damage.includes("%")) {
              var k = parseFloat(h.damage);
              isNaN(k) || (d.global_damage_percent += k);
            } else {
              d.global_damage_damage += h.damage + "[" + h.name + "]+";
            }
            h.type && "" !== h.type && (d.mortal_global_damage_mod_type += h.type + "/");
          }
        });
        d.global_damage_damage = d.global_damage_damage.replace(/\+(?=$)/, "");
        d.global_damage_percent = parseFloat(d.global_damage_percent) / 100 + 1 || 1;
        d.mortal_global_damage_mod_type = d.mortal_global_damage_mod_type.replace(/\/(?=$)/, "");
        setAttrs(d, {silent:!0}, function() {
          update_mortalattacks("all");
          "function" == typeof c && c();
        });
      });
    }
  });
}, update_mortalglobalattack = function(c) {
  getSectionIDs("mortaltohitmod", function(e) {
    if (e) {
      var a = {}, b = [];
      e.forEach(function(g) {
        a[g] = {};
        b.push(`repeating_mortaltohitmod_${g}_global_attack_active_flag`, `repeating_mortaltohitmod_${g}_global_attack_roll`, `repeating_mortaltohitmod_${g}_global_attack_name`, `repeating_mortaltohitmod_${g}_global_attack_appliesto`);
      });
      getAttrs(b, function(g) {
        var f = /^repeating_mortaltohitmod_(.+)_global_attack_(active_flag|roll|name|appliesto)$/;
        _.each(g, function(h, k) {
          (k = f.exec(k)) && (a[k[1]][k[2]] = h);
        });
        var d = {global_attack_mod:"", global_acc_attack:"", global_eff_attack:""};
        console.log("MORTAL GLOBALATTACK");
        _.each(a, function(h) {
          if ("0" != h.active_flag && h.roll && "0" != h.roll && "" !== h.roll) {
            switch(h.appliesto) {
              case "acc":
                d.global_acc_attack += h.roll + "[" + h.name + "]+";
                break;
              case "eff":
                d.global_eff_attack += h.roll + "[" + h.name + "]+";
                break;
              case "both":
                d.global_attack_mod += h.roll + "[" + h.name + "]+";
            }
          }
        });
        "" === d.global_attack_mod && (d.global_attack_mod = "");
        "" === d.global_acc_attack && (d.global_acc_attack = "");
        "" === d.global_eff_attack && (d.global_eff_attack = "");
        "" !== d.global_attack_mod && (d.global_attack_mod = "[[" + d.global_attack_mod.replace(/\+(?=$)/, "") + "]]");
        "" !== d.global_acc_attack && (d.global_acc_attack = "[[" + d.global_acc_attack.replace(/\+(?=$)/, "") + "]]");
        "" !== d.global_eff_attack && (d.global_eff_attack = "[[" + d.global_eff_attack.replace(/\+(?=$)/, "") + "]]");
        setAttrs(d, {silent:!0}, function() {
          "function" == typeof c && c();
        });
      });
    }
  });
}, update_cultivatorattacks = function(c, e) {
  console.log("DOING CULTIVATOR_UPDATE_ATTACKS: " + c);
  "-" === c.substring(0, 1) && 20 === c.length ? do_update_cultivatorattack([c], e) : -1 < "power agility vitality cultivation qicontrol mental all".split(" ").indexOf(c) && getSectionIDs("repeating_cultivatorattack", function(a) {
    if ("all" === c) {
      do_update_cultivatorattack(a);
    } else {
      var b = [];
      _.each(a, function(g) {
        b.push("repeating_attack_" + g + "_atkattr_base");
        b.push("repeating_attack_" + g + "_dmgattr");
        b.push("repeating_attack_" + g + "_dmg2attr");
        b.push("repeating_attack_" + g + "_dmg3attr");
        b.push("repeating_attack_" + g + "_savedc");
      });
      getAttrs(b, function(g) {
        var f = [];
        _.each(a, function(d) {
          (g["repeating_attack_" + d + "_atkattr_base"] && -1 < g["repeating_attack_" + d + "_atkattr_base"].indexOf(c) || g["repeating_attack_" + d + "_dmgattr"] && -1 < g["repeating_attack_" + d + "_dmgattr"].indexOf(c) || g["repeating_attack_" + d + "_dmg2attr"] && -1 < g["repeating_attack_" + d + "_dmg2attr"].indexOf(c) || g["repeating_attack_" + d + "_dmg3attr"] && -1 < g["repeating_attack_" + d + "_dmg3attr"].indexOf(c) || g["repeating_attack_" + d + "_savedc"] && -1 < g["repeating_attack_" + 
          d + "_savedc"].indexOf(c)) && f.push(d);
        });
        0 < f.length && do_update_cultivatorattack(f);
      });
    }
  });
}, do_update_cultivatorattack = function(c) {
  var e = "level dtype power agility vitality cultivation qicontrol mental cultivator_global_damage_damage cultivator_global_damage_mod_type cultivator_global_damage_percent".split(" ");
  _.each(c, function(a) {
    e.push("repeating_cultivatorattack_" + a + "_atkflag");
    e.push("repeating_cultivatorattack_" + a + "_atkname");
    e.push("repeating_cultivatorattack_" + a + "_atkattr_base");
    e.push("repeating_cultivatorattack_" + a + "_atkmod");
    e.push("repeating_cultivatorattack_" + a + "_dmgflag");
    e.push("repeating_cultivatorattack_" + a + "_dmgbase");
    e.push("repeating_cultivatorattack_" + a + "_dmgattr");
    e.push("repeating_cultivatorattack_" + a + "_dmgmod");
    e.push("repeating_cultivatorattack_" + a + "_dmgtype");
    e.push("repeating_cultivatorattack_" + a + "_dmg2flag");
    e.push("repeating_cultivatorattack_" + a + "_dmg2base");
    e.push("repeating_cultivatorattack_" + a + "_dmg2attr");
    e.push("repeating_cultivatorattack_" + a + "_dmg2mod");
    e.push("repeating_cultivatorattack_" + a + "_dmg2type");
    e.push("repeating_cultivatorattack_" + a + "_dmg3flag");
    e.push("repeating_cultivatorattack_" + a + "_dmg3base");
    e.push("repeating_cultivatorattack_" + a + "_dmg3attr");
    e.push("repeating_cultivatorattack_" + a + "_dmg3mod");
    e.push("repeating_cultivatorattack_" + a + "_dmg3type");
    e.push("repeating_cultivatorattack_" + a + "_saveflag");
    e.push("repeating_cultivatorattack_" + a + "_savedc");
    e.push("repeating_cultivatorattack_" + a + "_saveeffect");
    e.push("repeating_cultivatorattack_" + a + "_saveflat");
    e.push("repeating_cultivatorattack_" + a + "_atkrange");
    e.push("repeating_cultivatorattack_" + a + "_cultivator_global_damage_mod_field");
  });
  getAttrs(e, function(a) {
    _.each(c, function(b) {
      var g = [], f = {}, d = "", h = "", k = "", l = "", m = "", n = "", u = "", p = n = "", q = "", r = "", t = "";
      a["repeating_cultivatorattack_" + b + "_atkattr_base"] && "0" !== a["repeating_cultivatorattack_" + b + "_atkattr_base"] ? (atkattr_base = parseInt(a[a["repeating_cultivatorattack_" + b + "_atkattr_base"].substring(2, a["repeating_cultivatorattack_" + b + "_atkattr_base"].length - 1)], 0), n = a["repeating_cultivatorattack_" + b + "_atkattr_base"].substring(2, a["repeating_cultivatorattack_" + b + "_atkattr_base"].length - 1).toUpperCase()) : atkattr_base = 0;
      a["repeating_cultivatorattack_" + b + "_dmgattr"] && "0" !== a["repeating_cultivatorattack_" + b + "_dmgattr"] ? (dmgattr = parseInt(a[a["repeating_cultivatorattack_" + b + "_dmgattr"].substring(2, a["repeating_cultivatorattack_" + b + "_dmgattr"].length - 1)], 0), u = a["repeating_cultivatorattack_" + b + "_dmgattr"].substring(2, a["repeating_cultivatorattack_" + b + "_dmgattr"].length - 1).toUpperCase()) : dmgattr = 0;
      dmgattr = Math.floor(dmgattr * a.cultivator_global_damage_percent);
      a["repeating_cultivatorattack_" + b + "_dmg2attr"] && "0" !== a["repeating_cultivatorattack_" + b + "_dmg2attr"] ? (dmg2attr = parseInt(a[a["repeating_cultivatorattack_" + b + "_dmg2attr"].substring(2, a["repeating_cultivatorattack_" + b + "_dmg2attr"].length - 1)], 0), p = a["repeating_cultivatorattack_" + b + "_dmg2attr"].substring(2, a["repeating_cultivatorattack_" + b + "_dmg2attr"].length - 1).toUpperCase()) : dmg2attr = 0;
      dmg2attr = Math.floor(dmg2attr * a.cultivator_global_damage_percent);
      a["repeating_cultivatorattack_" + b + "_dmg3attr"] && "0" !== a["repeating_cultivatorattack_" + b + "_dmg3attr"] ? (dmg3attr = parseInt(a[a["repeating_cultivatorattack_" + b + "_dmg3attr"].substring(2, a["repeating_cultivatorattack_" + b + "_dmg3attr"].length - 1)], 0), q = a["repeating_cultivatorattack_" + b + "_dmg3attr"].substring(2, a["repeating_cultivatorattack_" + b + "_dmg3attr"].length - 1).toUpperCase()) : dmg3attr = 0;
      dmg3attr = Math.floor(dmg3attr * a.cultivator_global_damage_percent);
      var C = a["repeating_cultivatorattack_" + b + "_dmgbase"] && "" != a["repeating_cultivatorattack_" + b + "_dmgbase"] ? a["repeating_cultivatorattack_" + b + "_dmgbase"] : 0, D = a["repeating_cultivatorattack_" + b + "_dmg2base"] && "" != a["repeating_cultivatorattack_" + b + "_dmg2base"] ? a["repeating_cultivatorattack_" + b + "_dmg2base"] : 0, E = a["repeating_cultivatorattack_" + b + "_dmg3base"] && "" != a["repeating_cultivatorattack_" + b + "_dmg3base"] ? a["repeating_cultivatorattack_" + 
      b + "_dmg3base"] : 0, x = a["repeating_cultivatorattack_" + b + "_dmgmod"] && !1 === isNaN(parseInt(a["repeating_cultivatorattack_" + b + "_dmgmod"], 0)) ? parseInt(a["repeating_cultivatorattack_" + b + "_dmgmod"], 0) : 0, y = a["repeating_cultivatorattack_" + b + "_dmg2mod"] && !1 === isNaN(parseInt(a["repeating_cultivatorattack_" + b + "_dmg2mod"], 0)) ? parseInt(a["repeating_cultivatorattack_" + b + "_dmg2mod"], 0) : 0, z = a["repeating_cultivatorattack_" + b + "_dmg3mod"] && !1 === isNaN(parseInt(a["repeating_cultivatorattack_" + 
      b + "_dmg3mod"], 0)) ? parseInt(a["repeating_cultivatorattack_" + b + "_dmg3mod"], 0) : 0, F = a["repeating_cultivatorattack_" + b + "_dmgtype"] ? a["repeating_cultivatorattack_" + b + "_dmgtype"] + " " : "", G = a["repeating_cultivatorattack_" + b + "_dmg2type"] ? a["repeating_cultivatorattack_" + b + "_dmg2type"] + " " : "", H = a["repeating_cultivatorattack_" + b + "_dmg3type"] ? a["repeating_cultivatorattack_" + b + "_dmg3type"] + " " : "", A = a["repeating_cultivatorattack_" + b + "_atkmod"] && 
      "" != a["repeating_cultivatorattack_" + b + "_atkmod"] ? parseInt(a["repeating_cultivatorattack_" + b + "_atkmod"], 0) : 0, v = "+" + `[[ceil([[${a.cultivator_global_damage_damage && "" !== a.cultivator_global_damage_damage ? a.cultivator_global_damage_damage : "0"}]] * ${parseFloat(a.cultivator_global_damage_percent || 0)})]]` + "[" + (a.cultivator_global_damage_mod_type || "") + "]", w = B => B && "0" !== B ? `[[ceil([[${B}]] * ${parseFloat(a.cultivator_global_damage_percent || 0)})]]` : 
      B;
      BB = C;
      CC = D;
      DD = E;
      C = w(C);
      D = w(D);
      E = w(E);
      a["repeating_cultivatorattack_" + b + "_atkflag"] && 0 != a["repeating_cultivatorattack_" + b + "_atkflag"] ? (bonus_mod = atkattr_base + A, plus_minus = -1 < bonus_mod ? "+" : "", bonus = plus_minus + bonus_mod) : a["repeating_cultivatorattack_" + b + "_saveflag"] && 0 != a["repeating_cultivatorattack_" + b + "_saveflag"] ? (a["repeating_cultivatorattack_" + b + "_savedc"] && "(@{saveflat})" === a["repeating_cultivatorattack_" + b + "_savedc"] ? w = !1 === isNaN(parseInt(a["repeating_cultivatorattack_" + 
      b + "_saveflat"])) ? parseInt(a["repeating_cultivatorattack_" + b + "_saveflat"]) : "0" : (w = a["repeating_cultivatorattack_" + b + "_savedc"].replace(/^[^{]*{/, "").replace(/_.*$/, ""), w = a[w] ? parseInt(a[w], 0) : 0), bonus = "DC" + w) : bonus = "-";
      a["repeating_cultivatorattack_" + b + "_dmgflag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmgflag"] ? (0 === BB && 0 === dmgattr + x && (l = 0), 0 != BB && (l = BB), 0 != BB && 0 != dmgattr + x && (l = 0 < dmgattr + x ? l + "+" : l), 0 != dmgattr + x && (l += dmgattr + x), l = l + " " + F) : l = "";
      a["repeating_cultivatorattack_" + b + "_dmg2flag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmg2flag"] ? (0 === CC && 0 === dmg2attr + y && (m = 0), 0 != CC && (m = CC), 0 != CC && 0 != dmg2attr + y && (m = 0 < dmg2attr + y ? m + "+" : m), 0 != dmg2attr + y && (m += dmg2attr + y), m = m + " " + G) : m = "";
      a["repeating_cultivatorattack_" + b + "_dmg3flag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmg3flag"] ? (0 === DD && 0 === dmg3attr + z && (r = 0), 0 != DD && (r = DD), 0 != DD && 0 != dmg3attr + z && (r = 0 < dmg3attr + z ? r + "+" : r), 0 != dmg3attr + z && (r += dmg3attr + z), r = r + " " + H) : r = "";
      dmgspacer1 = a["repeating_cultivatorattack_" + b + "_dmgflag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmgflag"] && a["repeating_cultivatorattack_" + b + "_dmg2flag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmg2flag"] ? "+ " : "";
      dmgspacer2 = a["repeating_cultivatorattack_" + b + "_dmgflag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmgflag"] && a["repeating_cultivatorattack_" + b + "_dmg3flag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmg3flag"] ? "+ " : "";
      r2 = "{{r2=[[";
      a["repeating_cultivatorattack_" + b + "_atkflag"] && 0 != a["repeating_cultivatorattack_" + b + "_atkflag"] ? (0 != A && (d = "+" + A + "[MOD]" + d), 0 != atkattr_base && (d = atkattr_base + "[" + n + "]" + d)) : d = "";
      A = d !== "" ? Math.floor(parseFloat(d) * 0.75) : "";
      a["repeating_cultivatorattack_" + b + "_dmgflag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmgflag"] ? (0 != x && (h = "+" + Math.floor(x * a.cultivator_global_damage_percent) + "[MOD]" + h), 0 != dmgattr && (h = "+" + dmgattr + "[" + u + "]" + h), h = C + h) : h = "0";
      a["repeating_cultivatorattack_" + b + "_dmg2flag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmg2flag"] ? (0 != y && (k = "+" + Math.floor(y * a.cultivator_global_damage_percent) + "[MOD]" + k), 0 != dmg2attr && (k = "+" + dmg2attr + "[" + p + "]" + k), k = D + k) : k = "0";
      a["repeating_cultivatorattack_" + b + "_dmg3flag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmg3flag"] ? (0 != z && (t = "+" + Math.floor(z * a.cultivator_global_damage_percent) + "[MOD]" + t), 0 != dmg3attr && (t = "+" + dmg3attr + "[" + q + "]" + t), t = E + t) : t = "0";
      "full" === a.dtype ? (pickbase = "full", n = "@{whispertoggle}&{template:atkdmg} {{mod=@{atkbonus}}} {{rname=@{atkname}}} {{r1=[[" + d + "]]}} " + r2 + A + "]]}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + h + v + "]]}} {{dmg1type=" + F + "}} @{dmg2flag} {{dmg2=[[" + k + v + "]]}} {{dmg2type=" + G + "}} @{dmg3flag} {{dmg3=[[" + t + v + "]]}} {{dmg3type=" + H + "}} @{saveflag} {{desc=@{atk_desc}}} {{globalattack=@{cultivator_global_attack_mod}}} {{globalaccattack=@{global_acc_attack}}} {{globaleffattack=@{cultivator_global_eff_attack}}} {{globaldamagetype=@{cultivator_global_damage_mod_type}}} @{charname_output}") : 
      a["repeating_cultivatorattack_" + b + "_atkflag"] && 0 != a["repeating_cultivatorattack_" + b + "_atkflag"] ? (pickbase = "pick", n = "@{whispertoggle}&{template:atk} {{mod=@{atkbonus}}} {{rname=[@{atkname}](~repeating_cultivatorattack_attack_dmg)}} {{r1=[[" + d + "]]}} " + r2 + A + "]]}} {{range=@{atkrange}}} {{desc=@{atk_desc}}} {{globalattack=@{cultivator_global_attack_mod}}} {{globalaccattack=@{cultivator_global_acc_attack}}} {{globaleffattack=@{cultivator_global_eff_attack}}} @{charname_output}") : 
      a["repeating_cultivatorattack_" + b + "_dmgflag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmgflag"] ? (pickbase = "dmg", n = "@{whispertoggle}&{template:dmg} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + h + v + "]]}} {{dmg1type=" + F + "}} @{dmg2flag} {{dmg2=[[" + k + v + "]]}} {{dmg2type=" + G + "}} @{dmg3flag} {{dmg3=[[" + t + v + "]]}} {{dmg3type=" + H + "}} @{saveflag} {{desc=@{atk_desc}}} {{globaldamagetype=@{cultivator_global_damage_mod_type}}} @{charname_output}") : 
      (pickbase = "empty", n = "@{whispertoggle}&{template:dmg} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{saveflag} {{desc=@{atk_desc}}} @{charname_output}");
      f["repeating_cultivatorattack_" + b + "_rollbase_dmg"] = "@{whispertoggle}&{template:dmg} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + h + v + "]]}} {{dmg1type=" + F + "}} @{dmg2flag} {{dmg2=[[" + k + v + "]]}} {{dmg2type=" + G + "}} @{dmg3flag} {{dmg3=[[" + t + v + "]]}} {{dmg3type=" + H + "}} @{saveflag} {{desc=@{atk_desc}}} {{globaldamagetype=@{cultivator_global_damage_mod_type}}} @{charname_output}";
      f["repeating_cultivatorattack_" + b + "_atkbonus"] = bonus;
      f["repeating_cultivatorattack_" + b + "_atkdmgtype"] = l + dmgspacer1 + m + dmgspacer2 + r + " ";
      f["repeating_cultivatorattack_" + b + "_rollbase"] = n;
      setAttrs(f, {silent:!0}, function() {
        g.forEach(function(B) {
          B();
        });
      });
    });
  });
}, update_cultivatorglobaldamage = function(c) {
  getSectionIDs("cultivatordamagemod", function(e) {
    if (e) {
      var a = {}, b = [];
      e.forEach(function(g) {
        a[g] = {};
        b.push(`repeating_cultivatordamagemod_${g}_cultivator_global_damage_active_flag`, `repeating_cultivatordamagemod_${g}_cultivator_global_damage_name`, `repeating_cultivatordamagemod_${g}_cultivator_global_damage_damage`, `repeating_cultivatordamagemod_${g}_cultivator_global_damage_type`);
      });
      getAttrs(b, function(g) {
        var f = /^repeating_cultivatordamagemod_(.+)_cultivator_global_damage_(active_flag|name|damage|type)$/;
        _.each(g, function(h, k) {
          (k = f.exec(k)) && (a[k[1]][k[2]] = h);
        });
        var d = {cultivator_global_damage_damage:"", cultivator_global_damage_percent:0, cultivator_global_damage_mod_type:""};
        console.log("CULTIVATOR GLOBALDAMAGE");
        _.each(a, function(h) {
          if ("0" != h.active_flag && h.name && "" !== h.name) {
            if (h.damage.includes("%")) {
              var k = parseFloat(h.damage);
              isNaN(k) || (d.cultivator_global_damage_percent += k);
            } else {
              d.cultivator_global_damage_damage += h.damage + "[" + h.name + "]+";
            }
            h.type && "" !== h.type && (d.cultivator_global_damage_mod_type += h.type + "/");
          }
        });
        d.cultivator_global_damage_damage = d.cultivator_global_damage_damage.replace(/\+(?=$)/, "");
        d.cultivator_global_damage_percent = parseFloat(d.cultivator_global_damage_percent) / 100 + 1 || 1;
        d.cultivator_global_damage_mod_type = d.cultivator_global_damage_mod_type.replace(/\/(?=$)/, "");
        setAttrs(d, {silent:!0}, function() {
          update_cultivatorattacks("all");
          "function" == typeof c && c();
        });
      });
    }
  });
}, update_cultivatorglobalattack = function(c) {
  getSectionIDs("cultivatortohitmod", function(e) {
    if (e) {
      var a = {}, b = [];
      e.forEach(function(g) {
        a[g] = {};
        b.push(`repeating_cultivatortohitmod_${g}_cultivator_global_attack_active_flag`, `repeating_cultivatortohitmod_${g}_cultivator_global_attack_roll`, `repeating_cultivatortohitmod_${g}_cultivator_global_attack_name`, `repeating_cultivatortohitmod_${g}_cultivator_global_attack_appliesto`);
      });
      getAttrs(b, function(g) {
        var f = /^repeating_cultivatortohitmod_(.+)_cultivator_global_attack_(active_flag|roll|name|appliesto)$/;
        _.each(g, function(h, k) {
          (k = f.exec(k)) && (a[k[1]][k[2]] = h);
        });
        var d = {cultivator_global_attack_mod:"", cultivator_global_acc_attack:"", cultivator_global_eff_attack:""};
        console.log("CULTIVATOR GLOBALATTACK");
        _.each(a, function(h) {
          if ("0" != h.active_flag && h.roll && "0" != h.roll && "" !== h.roll) {
            switch(h.appliesto) {
              case "acc":
                d.cultivator_global_acc_attack += h.roll + "[" + h.name + "]+";
                break;
              case "eff":
                d.cultivator_global_eff_attack += h.roll + "[" + h.name + "]+";
                break;
              case "both":
                d.cultivator_global_attack_mod += h.roll + "[" + h.name + "]+";
            }
          }
        });
        "" === d.cultivator_global_attack_mod && (d.cultivator_global_attack_mod = "");
        "" === d.cultivator_global_acc_attack && (d.cultivator_global_acc_attack = "");
        "" === d.cultivator_global_eff_attack && (d.cultivator_global_eff_attack = "");
        "" !== d.cultivator_global_attack_mod && (d.cultivator_global_attack_mod = "[[" + d.cultivator_global_attack_mod.replace(/\+(?=$)/, "") + "]]");
        "" !== d.cultivator_global_acc_attack && (d.cultivator_global_acc_attack = "[[" + d.cultivator_global_acc_attack.replace(/\+(?=$)/, "") + "]]");
        "" !== d.cultivator_global_eff_attack && (d.cultivator_global_eff_attack = "[[" + d.cultivator_global_eff_attack.replace(/\+(?=$)/, "") + "]]");
        setAttrs(d, {silent:!0}, function() {
          "function" == typeof c && c();
        });
      });
    }
  });
}, update_weight = function() {
  console.log("UPDATING WEIGHT");
  var c = {}, e = 0, a = 0, b = ["power", "carrying_capacity_mod", "inventory_slots_mod", "itemweightfixed", "itemslotsfixed"];
  getSectionIDs("repeating_inventory", function(g) {
    _.each(g, function(f) {
      b.push("repeating_inventory_" + f + "_itemweight");
      b.push("repeating_inventory_" + f + "_itemcount");
      b.push("repeating_inventory_" + f + "_itemsize");
      b.push("repeating_inventory_" + f + "_equipped");
      b.push("repeating_inventory_" + f + "_carried");
      b.push("repeating_inventory_" + f + "_itemcontainer");
      b.push("repeating_inventory_" + f + "_itemweightfixed");
      b.push("repeating_inventory_" + f + "_itemslotsfixed");
      b.push("repeating_inventory_" + f + "_itemcontainer_slots");
      b.push("repeating_inventory_" + f + "_itemcontainer_slots_modifier");
    });
    getAttrs(b, function(f) {
      var d = 0, h = 0;
      _.each(g, function(p) {
        if (1 == f["repeating_inventory_" + p + "_equipped"] || 1 == f["repeating_inventory_" + p + "_carried"]) {
          if (1 == f["repeating_inventory_" + p + "_itemcontainer"]) {
            if (1 == f["repeating_inventory_" + p + "_equipped"]) {
              h += parseInt(f["repeating_inventory_" + p + "_itemcontainer_slots"], 0);
              var q = "repeating_inventory_" + p + "_itemcontainer_slots_modifier";
              f[q] && (-1 < ["+", "-"].indexOf(f[q]) ? (p = f[q].substring(0, 1), q = f[q].substring(1), !1 === isNaN(parseInt(q, 0)) && ("+" == p ? d += parseInt(q, 0) : "-" == p && (d -= parseInt(q, 0)))) : !1 === isNaN(parseInt(f[q], 0)) && (d += parseInt(f[q], 0)));
            }
          } else {
            f["repeating_inventory_" + p + "_itemweight"] && !1 === isNaN(parseInt(f["repeating_inventory_" + p + "_itemweight"], 0)) && (1 == f["repeating_inventory_" + p + "_itemweightfixed"] ? e += parseFloat(f["repeating_inventory_" + p + "_itemweight"]) : (count = f["repeating_inventory_" + p + "_itemcount"] && !1 === isNaN(parseFloat(f["repeating_inventory_" + p + "_itemcount"])) ? parseFloat(f["repeating_inventory_" + p + "_itemcount"]) : 1, e += parseFloat(f["repeating_inventory_" + p + "_itemweight"]) * 
            count)), f["repeating_inventory_" + p + "_itemsize"] && !1 === isNaN(parseInt(f["repeating_inventory_" + p + "_itemsize"], 0)) && (1 == f["repeating_inventory_" + p + "_itemslotsfixed"] ? a += parseFloat(f["repeating_inventory_" + p + "_itemsize"]) : (count = f["repeating_inventory_" + p + "_itemcount"] && !1 === isNaN(parseFloat(f["repeating_inventory_" + p + "_itemcount"])) ? parseFloat(f["repeating_inventory_" + p + "_itemcount"]) : 1, a += parseFloat(f["repeating_inventory_" + p + 
            "_itemsize"]) * count));
          }
        }
      });
      e = Math.round(100 * e) / 100;
      a = Math.round(100 * a) / 100;
      c.weighttotal = e;
      c.slotstotal = a;
      var k = 18 + parseInt(h);
      if (f.inventory_slots_mod) {
        var l = f.inventory_slots_mod.substring(0, 1), m = f.inventory_slots_mod.substring(1);
        -1 < ["*", "x", "+", "-"].indexOf(l) && !1 === isNaN(parseInt(m, 0)) && ("*" == l || "x" == l ? k *= parseInt(m, 0) : "+" == l ? k += parseInt(m, 0) : "-" == l && (k -= parseInt(m, 0)));
      }
      k += d;
      var n = parseInt(f.power), u = 30 * n;
      f.carrying_capacity_mod && (l = f.carrying_capacity_mod.substring(0, 1), m = parseInt(f.carrying_capacity_mod.substring(1), 0), -1 < ["*", "x", "+", "-", "/"].indexOf(l) && !isNaN(m) && ("*" == l || "x" == l ? u *= m : "+" == l ? u += m : "-" == l ? u -= m : "/" == l && (u /= m)));
      c.weightmaximum = u;
      c.slotsmaximum = k;
      c.encumberance = a > k ? "OVER CARRYING CAPACITY" : e > 30 * n ? "IMMOBILE" : e > 22 * n ? "HEAVILY ENCUMBERED" : e > 15 * n ? "ENCUMBERED" : " ";
      setAttrs(c, {silent:!0});
    });
  });
}, update_skills = function(c) {
  var e = "power agility vitality cultivation qicontrol mental appearance".split(" "), a = {}, b = [];
  _.each(c, function(g) {
    e.push(g + "_bonus");
    e.push(g + "_flat");
  });
  getSectionIDs("repeating_inventory", function(g) {
    _.each(g, function(f) {
      e.push("repeating_inventory_" + f + "_equipped");
      e.push("repeating_inventory_" + f + "_itemmodifiers");
    });
    getAttrs(e, function(f) {
      _.each(c, function(d) {
        console.log("UPDATING SKILL: " + d);
        var h = f[d + "_flat"] && !isNaN(parseInt(f[d + "_flat"], 0)) ? parseInt(f[d + "_flat"], 0) : 0, k = 0;
        _.each(g, function(m) {
          f["repeating_inventory_" + m + "_equipped"] && "1" === f["repeating_inventory_" + m + "_equipped"] && f["repeating_inventory_" + m + "_itemmodifiers"] && (-1 < f["repeating_inventory_" + m + "_itemmodifiers"].toLowerCase().replace(/ /g, "_").indexOf(d) || -1 < f["repeating_inventory_" + m + "_itemmodifiers"].toLowerCase().indexOf("skill checks")) && (m = f["repeating_inventory_" + m + "_itemmodifiers"].toLowerCase().split(","), _.each(m, function(n) {
            if (-1 < n.replace(/ /g, "_").indexOf(d) || -1 < n.indexOf("skill checks")) {
              -1 < n.indexOf("-") ? (n = isNaN(parseInt(n.replace(/[^0-9]/g, ""), 0)) ? !1 : parseInt(n.replace(/[^0-9]/g, ""), 0), k -= n ? k + n : k) : (n = isNaN(parseInt(n.replace(/[^0-9]/g, ""), 0)) ? !1 : parseInt(n.replace(/[^0-9]/g, ""), 0), k += n ? k + n : k);
            }
          }));
        });
        var l = 0;
        switch(d) {
          case "acrobatics":
          case "discretion":
          case "stealth":
            l = parseInt(f.agility, 0);
            break;
          case "athletics":
          case "grapple":
            l = parseInt(f.power, 0);
            break;
          case "seduce":
          case "deceit":
          case "disguise":
          case "persuade":
            l = parseInt(f.mental, 0) + parseInt(f.appearance, 0);
            break;
          case "fine_arts":
          case "forgery":
          case "navigation":
            l = Math.floor(parseInt(f.agility, 0) / 2) + Math.floor(parseInt(f.mental, 0) / 2);
            break;
          case "history":
          case "medicine":
            l = Math.floor(parseInt(f.qicontrol, 0) / 2) + Math.floor(parseInt(f.mental, 0) / 2);
            break;
          case "intuition":
          case "investigation":
          case "perception":
            l = parseInt(f.mental, 0);
            break;
          case "intimidation":
            l = parseInt(f.power, 0) + parseInt(f.appearance, 0);
            break;
          case "performance":
            l = parseInt(f.agility, 0) + parseInt(f.appearance, 0);
            break;
          case "survival":
            l = Math.floor(parseInt(f.power, 0) / 2) + Math.floor(parseInt(f.mental, 0) / 2);
        }
        h += k;
        a[d] = 0 < h ? l + "d6+" + h : l + "d6";
        a[d + "_bonus"] = h;
        a[d + "_roll"] = l;
      });
      setAttrs(a, {silent:!0}, function() {
        b.forEach(function(d) {
          d();
        });
      });
    });
  });
}, update_all_ability_checks = function() {
  update_initiative();
  update_skills("acrobatics athletics seduce deceit discretion disguise fine_arts forgery grapple history intuition intimidation investigation medicine navigation perception performance persuade stealth survival".split(" "));
}, update_durability = function() {
  console.log("UPDATING DURABILITY");
  getAttrs(["durability-base", "durability-limit", "durability-bonus", "vitality"], function(c) {
    var e = {}, a = parseInt(c["durability-base"]) || 0, b = parseInt(c.vitality) || 0, g = parseInt(c["durability-limit"]) || 0;
    c = parseInt(c["durability-bonus"]) || 0;
    b = 10 * Math.floor(b / 50) + c;
    e["durability-full"] = b < g ? a + b : a + g + Math.floor((b - g) / 2);
    setAttrs(e, {silent:!0});
  });
}, update_evasion = function() {
  console.log("UPDATING EVASION");
  getAttrs(["evasion-base", "evasion-bonus", "agility"], function(c) {
    var e = {}, a = parseInt(c.agility) || 0, b = parseInt(c["evasion-base"]) || 0;
    c = parseInt(c["evasion-bonus"]) || 0;
    e["evasion-full"] = b + Math.floor(a * 1.2) + c;
    setAttrs(e, {silent:!0});
  });
}, update_reduction = function() {
  console.log("UPDATING REDUCTION");
  getAttrs(["reduction-base", "reduction-armour", "reduction-bonus"], function(c) {
    var e = {}, a = parseInt(c["reduction-base"]) || 0, b = parseInt(c["reduction-armour"]) || 0;
    c = parseInt(c["reduction-bonus"]) || 0;
    e["reduction-full"] = a + b + c;
    setAttrs(e, {silent:!0});
  });
};
let toInt = function(c) {
  return c && !isNaN(c) ? parseInt(c) : 0;
}, clamp = function(c, e, a) {
  return Math.min(Math.max(c, e), a);
}, isDefined = function(c) {
  return null !== c && "undefined" !== typeof c;
};
