"power agility vitality cultivation qicontrol mental appearance".split(" ").forEach(c => {
  on(`change:${c}_base change:${c}_bonus change:${c}_dc_bonus`, function() {
    update_attr(`${c}`);
  });
});
"power agility vitality cultivation qicontrol mental appearance".split(" ").forEach(c => {
  on(`change:${c}`, function() {
    update_mortalattacks(`${c}`);
    update_cultivatorattacks(`${c}`);
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
        update_skills("charm deceit disguise persuade fine_arts forgery navigation history medicine intuition investigation perception survival".split(" "));
        break;
      case "appearance":
        update_skills("charm deceit disguise persuade intimidation performance".split(" "));
        break;
      default:
        !1;
    }
  });
});
"acrobatics athletics charm deceit discretion disguise fine_arts forgery grapple history intuition intimidation investigation medicine navigation perception performance persuade stealth survival".split(" ").forEach(c => {
  on(`change:${c}_flat`, function(d) {
    "sheetworker" !== d.sourceType && update_skills([`${c}`]);
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
    var d = c.sourceAttribute.substring(20, 40);
    getAttrs(["repeating_inventory_" + d + "_itemmodifiers"], function(a) {
      a["repeating_inventory_" + d + "_itemmodifiers"] && check_itemmodifiers(a["repeating_inventory_" + d + "_itemmodifiers"], c.previousValue);
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
  getSectionIDs("mortaldamagemod", function(d) {
    var a = {};
    "1" === c.newValue ? d && 0 !== d.length || (d = generateRowID(), a[`repeating_mortaldamagemod_${d}_global_damage_active_flag`] = "1") : _.each(d, function(b) {
      a[`repeating_mortaldamagemod_${b}_global_damage_active_flag`] = "0";
    });
    setAttrs(a);
  });
});
on("change:global_dc_bonus change:global_attribute_bonus", function(c) {
  "power agility vitality cultivation qicontrol mental".split(" ").forEach(d => {
    update_attr(`${d}`);
  });
});
on("change:dtype", function(c) {
  c.sourceType && "sheetworker" === c.sourceType || (update_mortalattacks("all"), update_cultivatorattacks("all"));
});
on("change:durability-base change:durability-limit change:durability-bonus", function() {
  update_durability();
});
on("change:evasion-base change:evasion-limit change:evasion-bonus", function() {
  update_evasion();
});
on("change:reduction-base change:reduction-armour change:reduction-bonus", function() {
  update_reduction();
});
on("remove:repeating_inventory", function(c) {
  var d = c.sourceAttribute.substring(20, 40);
  c.removedInfo && c.removedInfo["repeating_inventory_" + d + "_itemmodifiers"] && check_itemmodifiers(c.removedInfo["repeating_inventory_" + d + "_itemmodifiers"]);
  update_weight();
});
var check_itemmodifiers = function(c, d) {
  c = c.toLowerCase().split(",");
  d && (prevmods = d.toLowerCase().split(","), c = _.union(c, prevmods));
  _.each(c, function(a) {
    -1 < a.indexOf("power") && update_attr("power");
    -1 < a.indexOf("agility") && update_attr("agility");
    -1 < a.indexOf("vitality") && update_attr("vitality");
    -1 < a.indexOf("cultivation") && update_attr("cultivation");
    -1 < a.indexOf("qicontrol") && update_attr("qicontrol");
    -1 < a.indexOf("mental") && update_attr("mental");
    -1 < a.indexOf("skill checks") && update_all_skill_checks();
    -1 < a.indexOf("acrobatics") && update_skills(["acrobatics"]);
    -1 < a.indexOf("athletics") && update_skills(["athletics"]);
    -1 < a.indexOf("charm") && update_skills(["charm"]);
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
  var d = {}, a = [c + "_base", c + "_bonus", c + "_dc_bonus", "global_dc_bonus", "mortal-level", "global_attribute_bonus"];
  getSectionIDs("repeating_inventory", function(b) {
    _.each(b, function(g) {
      a.push("repeating_inventory_" + g + "_equipped");
      a.push("repeating_inventory_" + g + "_itemmodifiers");
    });
    getAttrs(a, function(g) {
      var f = g[c + "_base"] && !isNaN(parseInt(g[c + "_base"], 10)) ? parseInt(g[c + "_base"], 10) : 10, h = g[c + "_bonus"] && !isNaN(parseInt(g[c + "_bonus"], 10)) ? parseInt(g[c + "_bonus"], 10) : 0, k = g.global_attribute_bonus && !isNaN(parseInt(g.global_attribute_bonus, 10)) ? parseInt(g.global_attribute_bonus, 10) : 0, l = g.global_dc_bonus && !isNaN(parseInt(g.global_dc_bonus, 10)) ? parseInt(g.global_dc_bonus, 10) : 0, m = g[c + "_dc_bonus"] && !isNaN(parseInt(g[c + "_dc_bonus"], 10)) ? parseInt(g[c + "_dc_bonus"], 10) : 0, n = g["mortal-level"] && !isNaN(parseInt(g["mortal-level"], 10)) ? parseInt(g["mortal-level"], 10) : 0, p = 0, u = 0;
      _.each(b, function(q) {
        g["repeating_inventory_" + q + "_equipped"] && "1" !== g["repeating_inventory_" + q + "_equipped"] || !g["repeating_inventory_" + q + "_itemmodifiers"] || !g["repeating_inventory_" + q + "_itemmodifiers"].toLowerCase().indexOf(-1 < c) || (q = g["repeating_inventory_" + q + "_itemmodifiers"].toLowerCase().split(","), _.each(q, function(r) {
          -1 < r.indexOf(c) && (-1 < r.indexOf(":") ? p = (r = isNaN(parseInt(r.replace(/[^0-9]/g, ""), 10)) ? !1 : parseInt(r.replace(/[^0-9]/g, ""), 10)) && r > p ? r : p : u = -1 < r.indexOf("-") ? (r = isNaN(parseInt(r.replace(/[^0-9]/g, ""), 10)) ? !1 : parseInt(r.replace(/[^0-9]/g, ""), 10)) ? u - r : u : (r = isNaN(parseInt(r.replace(/[^0-9]/g, ""), 10)) ? !1 : parseInt(r.replace(/[^0-9]/g, ""), 10)) ? u + r : u);
        }));
      });
      d[c + "_flag"] = 0 != h || 0 != k || 0 < u || p > f ? 1 : 0;
      finalattr = (f > p ? f : p) + h + u + k;
      d[c + "_dc"] = Math.floor(finalattr * (3.5 + Math.floor(n / 7))) + l + m;
      d[c] = finalattr;
      setAttrs(d);
    });
  });
}, update_initiative = function() {
  var c = ["agility", "initiative_bonus"];
  getSectionIDs("repeating_inventory", function(d) {
    _.each(d, function(a) {
      c.push("repeating_inventory_" + a + "_equipped");
      c.push("repeating_inventory_" + a + "_itemmodifiers");
    });
    getAttrs(c, function(a) {
      var b = {}, g = parseInt(a.agility) || 0, f = parseInt(a.dexterity_mod, 10);
      a.initiative_bonus && !isNaN(parseInt(a.initiative_bonus, 10)) && (f += parseInt(a.initiative_bonus, 10));
      _.each(d, function(h) {
        a["repeating_inventory_" + h + "_equipped"] && "1" === a["repeating_inventory_" + h + "_equipped"] && a["repeating_inventory_" + h + "_itemmodifiers"] && -1 < a["repeating_inventory_" + h + "_itemmodifiers"].toLowerCase().indexOf("initiative") && (h = a["repeating_inventory_" + h + "_itemmodifiers"].toLowerCase().split(","), _.each(h, function(k) {
          -1 < k.indexOf("initiative") && (f = -1 < k.indexOf("-") ? (k = isNaN(parseInt(k.replace(/[^0-9]/g, ""), 10)) ? !1 : parseInt(k.replace(/[^0-9]/g, ""), 10)) ? f - k : f : (k = isNaN(parseInt(k.replace(/[^0-9]/g, ""), 10)) ? !1 : parseInt(k.replace(/[^0-9]/g, ""), 10)) ? f + k : f);
        }));
      });
      0 != f % 1 && (f = parseFloat(f.toPrecision(12)));
      b.initiative = g + (parseInt(a.final_init) ? `d6+${parseInt(a.final_init)}` : "d6");
      setAttrs(b, {silent:!0});
    });
  });
}, update_mortalattacks = function(c, d) {
  console.log("DOING MORTAL_UPDATE_ATTACKS: " + c);
  "-" === c.substring(0, 1) && 20 === c.length ? do_update_mortalattack([c], d) : -1 < "power agility vitality cultivation qicontrol mental all".split(" ").indexOf(c) && getSectionIDs("repeating_mortalattack", function(a) {
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
        _.each(a, function(h) {
          (g["repeating_attack_" + h + "_atkattr_base"] && -1 < g["repeating_attack_" + h + "_atkattr_base"].indexOf(c) || g["repeating_attack_" + h + "_dmgattr"] && -1 < g["repeating_attack_" + h + "_dmgattr"].indexOf(c) || g["repeating_attack_" + h + "_dmg2attr"] && -1 < g["repeating_attack_" + h + "_dmg2attr"].indexOf(c) || g["repeating_attack_" + h + "_dmg3attr"] && -1 < g["repeating_attack_" + h + "_dmg3attr"].indexOf(c) || g["repeating_attack_" + h + "_savedc"] && -1 < g["repeating_attack_" + h + "_savedc"].indexOf(c)) && f.push(h);
        });
        0 < f.length && do_update_mortalattack(f);
      });
    }
  });
}, do_update_mortalattack = function(c) {
  var d = "level dtype power agility vitality cultivation qicontrol mental global_damage_damage mortal_global_damage_mod_type".split(" ");
  _.each(c, function(a) {
    d.push("repeating_mortalattack_" + a + "_atkflag");
    d.push("repeating_mortalattack_" + a + "_atkname");
    d.push("repeating_mortalattack_" + a + "_atkattr_base");
    d.push("repeating_mortalattack_" + a + "_atkmod");
    d.push("repeating_mortalattack_" + a + "_dmgflag");
    d.push("repeating_mortalattack_" + a + "_dmgbase");
    d.push("repeating_mortalattack_" + a + "_dmgattr");
    d.push("repeating_mortalattack_" + a + "_dmgmod");
    d.push("repeating_mortalattack_" + a + "_dmgtype");
    d.push("repeating_mortalattack_" + a + "_dmg2flag");
    d.push("repeating_mortalattack_" + a + "_dmg2base");
    d.push("repeating_mortalattack_" + a + "_dmg2attr");
    d.push("repeating_mortalattack_" + a + "_dmg2mod");
    d.push("repeating_mortalattack_" + a + "_dmg2type");
    d.push("repeating_mortalattack_" + a + "_dmg3flag");
    d.push("repeating_mortalattack_" + a + "_dmg3base");
    d.push("repeating_mortalattack_" + a + "_dmg3attr");
    d.push("repeating_mortalattack_" + a + "_dmg3mod");
    d.push("repeating_mortalattack_" + a + "_dmg3type");
    d.push("repeating_mortalattack_" + a + "_saveflag");
    d.push("repeating_mortalattack_" + a + "_savedc");
    d.push("repeating_mortalattack_" + a + "_saveeffect");
    d.push("repeating_mortalattack_" + a + "_saveflat");
    d.push("repeating_mortalattack_" + a + "_atkrange");
    d.push("repeating_mortalattack_" + a + "_global_damage_mod_field");
  });
  getAttrs(d, function(a) {
    _.each(c, function(b) {
      var g = [], f = {}, h = "", k = "", l = "", m = "", n = "", p = "", u = p = "", q = "", r = "", v = "", t = "";
      a["repeating_mortalattack_" + b + "_atkattr_base"] && "0" !== a["repeating_mortalattack_" + b + "_atkattr_base"] ? (atkattr_base = parseInt(a[a["repeating_mortalattack_" + b + "_atkattr_base"].substring(2, a["repeating_mortalattack_" + b + "_atkattr_base"].length - 1)], 10), p = a["repeating_mortalattack_" + b + "_atkattr_base"].substring(2, a["repeating_mortalattack_" + b + "_atkattr_base"].length - 1).toUpperCase()) : atkattr_base = 0;
      a["repeating_mortalattack_" + b + "_dmgattr"] && "0" !== a["repeating_mortalattack_" + b + "_dmgattr"] ? (dmgattr = parseInt(a[a["repeating_mortalattack_" + b + "_dmgattr"].substring(2, a["repeating_mortalattack_" + b + "_dmgattr"].length - 1)], 10), u = a["repeating_mortalattack_" + b + "_dmgattr"].substring(2, a["repeating_mortalattack_" + b + "_dmgattr"].length - 1).toUpperCase()) : dmgattr = 0;
      a["repeating_mortalattack_" + b + "_dmg2attr"] && "0" !== a["repeating_mortalattack_" + b + "_dmg2attr"] ? (dmg2attr = parseInt(a[a["repeating_mortalattack_" + b + "_dmg2attr"].substring(2, a["repeating_mortalattack_" + b + "_dmg2attr"].length - 1)], 10), q = a["repeating_mortalattack_" + b + "_dmg2attr"].substring(2, a["repeating_mortalattack_" + b + "_dmg2attr"].length - 1).toUpperCase()) : dmg2attr = 0;
      a["repeating_mortalattack_" + b + "_dmg3attr"] && "0" !== a["repeating_mortalattack_" + b + "_dmg3attr"] ? (dmg3attr = parseInt(a[a["repeating_mortalattack_" + b + "_dmg3attr"].substring(2, a["repeating_mortalattack_" + b + "_dmg3attr"].length - 1)], 10), r = a["repeating_mortalattack_" + b + "_dmg3attr"].substring(2, a["repeating_mortalattack_" + b + "_dmg3attr"].length - 1).toUpperCase()) : dmg3attr = 0;
      var A = a["repeating_mortalattack_" + b + "_dmgbase"] && "" != a["repeating_mortalattack_" + b + "_dmgbase"] ? a["repeating_mortalattack_" + b + "_dmgbase"] : 0, B = a["repeating_mortalattack_" + b + "_dmg2base"] && "" != a["repeating_mortalattack_" + b + "_dmg2base"] ? a["repeating_mortalattack_" + b + "_dmg2base"] : 0, C = a["repeating_mortalattack_" + b + "_dmg3base"] && "" != a["repeating_mortalattack_" + b + "_dmg3base"] ? a["repeating_mortalattack_" + b + "_dmg3base"] : 0, x = a["repeating_mortalattack_" + b + "_dmgmod"] && !1 === isNaN(parseInt(a["repeating_mortalattack_" + b + "_dmgmod"], 10)) ? parseInt(a["repeating_mortalattack_" + b + "_dmgmod"], 10) : 0, y = a["repeating_mortalattack_" + b + "_dmg2mod"] && !1 === isNaN(parseInt(a["repeating_mortalattack_" + b + "_dmg2mod"], 10)) ? parseInt(a["repeating_mortalattack_" + b + "_dmg2mod"], 10) : 0, z = a["repeating_mortalattack_" + b + "_dmg3mod"] && !1 === isNaN(parseInt(a["repeating_mortalattack_" + b + "_dmg3mod"], 10)) ? parseInt(a["repeating_mortalattack_" + b + "_dmg3mod"], 10) : 0, E = a["repeating_mortalattack_" + b + "_dmgtype"] ? a["repeating_mortalattack_" + b + "_dmgtype"] + " " : "", F = a["repeating_mortalattack_" + b + "_dmg2type"] ? a["repeating_mortalattack_" + b + "_dmg2type"] + " " : "", G = a["repeating_mortalattack_" + b + "_dmg3type"] ? a["repeating_mortalattack_" + b + "_dmg3type"] + " " : "", H = a["repeating_mortalattack_" + b + "_atkmod"] && "" != a["repeating_mortalattack_" + b + "_atkmod"] ? parseInt(a["repeating_mortalattack_" + b + "_atkmod"], 10) : 0, w = "+" + `[[${a.global_damage_damage && "" !== a.global_damage_damage ? a.global_damage_damage : "0"}]]` + "[" + (a.mortal_global_damage_mod_type || "") + "]";
      if (a["repeating_mortalattack_" + b + "_atkflag"] && 0 != a["repeating_mortalattack_" + b + "_atkflag"]) {
        bonus_mod = atkattr_base + H, plus_minus = -1 < bonus_mod ? "+" : "", bonus = plus_minus + bonus_mod;
      } else if (a["repeating_mortalattack_" + b + "_saveflag"] && 0 != a["repeating_mortalattack_" + b + "_saveflag"]) {
        if (a["repeating_mortalattack_" + b + "_savedc"] && "(@{saveflat})" === a["repeating_mortalattack_" + b + "_savedc"]) {
          var D = !1 === isNaN(parseInt(a["repeating_mortalattack_" + b + "_saveflat"])) ? parseInt(a["repeating_mortalattack_" + b + "_saveflat"]) : "0";
        } else {
          D = a["repeating_mortalattack_" + b + "_savedc"].replace(/^[^{]*{/, "").replace(/_.*$/, ""), D = a[D] ? parseInt(a[D], 10) : 0;
        }
        bonus = "DC" + D;
      } else {
        bonus = "-";
      }
      a["repeating_mortalattack_" + b + "_dmgflag"] && 0 != a["repeating_mortalattack_" + b + "_dmgflag"] ? (0 === A && 0 === dmgattr + x && (m = 0), 0 != A && (m = A), 0 != A && 0 != dmgattr + x && (m = 0 < dmgattr + x ? m + "+" : m), 0 != dmgattr + x && (m += dmgattr + x), m = m + " " + E) : m = "";
      a["repeating_mortalattack_" + b + "_dmg2flag"] && 0 != a["repeating_mortalattack_" + b + "_dmg2flag"] ? (0 === B && 0 === dmg2attr + y && (n = 0), 0 != B && (n = B), 0 != B && 0 != dmg2attr + y && (n = 0 < dmg2attr + y ? n + "+" : n), 0 != dmg2attr + y && (n += dmg2attr + y), n = n + " " + F) : n = "";
      a["repeating_mortalattack_" + b + "_dmg3flag"] && 0 != a["repeating_mortalattack_" + b + "_dmg3flag"] ? (0 === C && 0 === dmg3attr + z && (v = 0), 0 != C && (v = C), 0 != C && 0 != dmg3attr + z && (n = 0 < dmg3attr + z ? v + "+" : v), 0 != dmg3attr + z && (v += dmg3attr + z), v = v + " " + G) : v = "";
      dmgspacer1 = a["repeating_mortalattack_" + b + "_dmgflag"] && 0 != a["repeating_mortalattack_" + b + "_dmgflag"] && a["repeating_mortalattack_" + b + "_dmg2flag"] && 0 != a["repeating_mortalattack_" + b + "_dmg2flag"] ? "+ " : "";
      dmgspacer2 = a["repeating_mortalattack_" + b + "_dmgflag"] && 0 != a["repeating_mortalattack_" + b + "_dmgflag"] && a["repeating_mortalattack_" + b + "_dmg3flag"] && 0 != a["repeating_mortalattack_" + b + "_dmg3flag"] ? "+ " : "";
      r2 = "{{r2=[[";
      a["repeating_mortalattack_" + b + "_atkflag"] && 0 != a["repeating_mortalattack_" + b + "_atkflag"] ? (0 != H && (h = H + "[MOD]" + h), 0 != atkattr_base && (h = atkattr_base + "[" + p + "]" + h)) : h = "";
      a["repeating_mortalattack_" + b + "_dmgflag"] && 0 != a["repeating_mortalattack_" + b + "_dmgflag"] ? (0 != x && (k = "+" + x + "[MOD]" + k), 0 != dmgattr && (k = "+" + dmgattr + "[" + u + "]" + k), k = A + k) : k = "0";
      a["repeating_mortalattack_" + b + "_dmg2flag"] && 0 != a["repeating_mortalattack_" + b + "_dmg2flag"] ? (0 != y && (l = "+" + y + "[MOD]" + l), 0 != dmg2attr && (l = "+" + dmg2attr + "[" + q + "]" + l), l = B + l) : l = "0";
      a["repeating_mortalattack_" + b + "_dmg3flag"] && 0 != a["repeating_mortalattack_" + b + "_dmg3flag"] ? (0 != z && (t = "+" + z + "[MOD]" + t), 0 != dmg3attr && (t = "+" + dmg3attr + "[" + r + "]" + t), t = C + t) : t = "0";
      "full" === a.dtype ? (pickbase = "full", p = "@{wtype}&{template:atkdmg} {{mod=@{atkbonus}}} {{rname=@{atkname}}} {{r1=[[" + h + "]]}} " + r2 + h + "]]}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + k + w + "]]}} {{dmg1type=" + E + "}} @{dmg2flag} {{dmg2=[[" + l + w + "]]}} {{dmg2type=" + F + "}} @{dmg3flag} {{dmg3=[[" + t + w + "]]}} {{dmg3type=" + G + "}} @{saveflag} {{desc=@{atk_desc}}} {{globalattack=@{global_attack_mod}}} {{globalaccattack=@{global_acc_attack}}} {{globaleffattack=@{global_eff_attack}}} {{globaldamagetype=@{mortal_global_damage_mod_type}}} @{charname_output}") : a["repeating_mortalattack_" + b + "_atkflag"] && 0 != a["repeating_mortalattack_" + b + "_atkflag"] ? (pickbase = "pick", p = "@{wtype}&{template:atk} {{mod=@{atkbonus}}} {{rname=[@{atkname}](~repeating_mortalattack_attack_dmg)}} {{r1=[[" + h + "]]}} " + r2 + h + "]]}} {{range=@{atkrange}}} {{desc=@{atk_desc}}} {{globalattack=@{global_attack_mod}}} {{globalaccattack=@{global_acc_attack}}} {{globaleffattack=@{global_eff_attack}}} @{charname_output}") : a["repeating_mortalattack_" + b + "_dmgflag"] && 0 != a["repeating_mortalattack_" + b + "_dmgflag"] ? (pickbase = "dmg", p = "@{wtype}&{template:dmg} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + k + w + "]]}} {{dmg1type=" + E + "}} @{dmg2flag} {{dmg2=[[" + l + w + "]]}} {{dmg2type=" + F + "}} @{dmg3flag} {{dmg3=[[" + t + w + "]]}} {{dmg3type=" + G + "}} @{saveflag} {{desc=@{atk_desc}}} {{globaldamagetype=@{mortal_global_damage_mod_type}}} @{charname_output}") : (pickbase = "empty", p = "@{wtype}&{template:dmg} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{saveflag} {{desc=@{atk_desc}}} @{charname_output}");
      f["repeating_mortalattack_" + b + "_rollbase_dmg"] = "@{wtype}&{template:dmg} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + k + w + "]]}} {{dmg1type=" + E + "}} @{dmg2flag} {{dmg2=[[" + l + w + "]]}} {{dmg2type=" + F + "}} @{dmg3flag} {{dmg3=[[" + t + w + "]]}} {{dmg3type=" + G + "}} @{saveflag} {{desc=@{atk_desc}}} {{globaldamagetype=@{mortal_global_damage_mod_type}}} @{charname_output}";
      f["repeating_mortalattack_" + b + "_atkbonus"] = bonus;
      f["repeating_mortalattack_" + b + "_atkdmgtype"] = m + dmgspacer1 + n + dmgspacer2 + v + " ";
      f["repeating_mortalattack_" + b + "_rollbase"] = p;
      setAttrs(f, {silent:!0}, function() {
        g.forEach(function(I) {
          I();
        });
      });
    });
  });
}, update_mortalglobaldamage = function(c) {
  getSectionIDs("mortaldamagemod", function(d) {
    if (d) {
      var a = {}, b = [];
      d.forEach(function(g) {
        a[g] = {};
        b.push(`repeating_mortaldamagemod_${g}_global_damage_active_flag`, `repeating_mortaldamagemod_${g}_global_damage_name`, `repeating_mortaldamagemod_${g}_global_damage_damage`, `repeating_mortaldamagemod_${g}_global_damage_type`);
      });
      getAttrs(b, function(g) {
        var f = /^repeating_mortaldamagemod_(.+)_global_damage_(active_flag|name|damage|type)$/;
        _.each(g, function(k, l) {
          (l = f.exec(l)) && (a[l[1]][l[2]] = k);
        });
        var h = {global_damage_damage:"", mortal_global_damage_mod_type:""};
        console.log("MORTAL GLOBALDAMAGE");
        _.each(a, function(k) {
          "0" != k.active_flag && (k.name && "" !== k.name && (h.global_damage_damage += k.damage + "[" + k.name + "]+"), k.type && "" !== k.type && (h.mortal_global_damage_mod_type += k.type + "/"));
        });
        h.global_damage_damage = h.global_damage_damage.replace(/\+(?=$)/, "");
        h.mortal_global_damage_mod_type = h.mortal_global_damage_mod_type.replace(/\/(?=$)/, "");
        setAttrs(h, {silent:!0}, function() {
          update_mortalattacks("all");
          "function" == typeof c && c();
        });
      });
    }
  });
}, update_mortalglobalattack = function(c) {
  getSectionIDs("mortaltohitmod", function(d) {
    if (d) {
      var a = {}, b = [];
      d.forEach(function(g) {
        a[g] = {};
        b.push(`repeating_mortaltohitmod_${g}_global_attack_active_flag`, `repeating_mortaltohitmod_${g}_global_attack_roll`, `repeating_mortaltohitmod_${g}_global_attack_name`, `repeating_mortaltohitmod_${g}_global_attack_appliesto`);
      });
      getAttrs(b, function(g) {
        var f = /^repeating_mortaltohitmod_(.+)_global_attack_(active_flag|roll|name|appliesto)$/;
        _.each(g, function(k, l) {
          (l = f.exec(l)) && (a[l[1]][l[2]] = k);
        });
        var h = {global_attack_mod:"", global_acc_attack:"", global_eff_attack:""};
        console.log("MORTAL GLOBALATTACK");
        _.each(a, function(k) {
          if ("0" != k.active_flag && k.roll && "" !== k.roll) {
            switch(k.appliesto) {
              case "acc":
                h.global_acc_attack += k.roll + "[" + k.name + "]+";
                break;
              case "eff":
                h.global_eff_attack += k.roll + "[" + k.name + "]+";
                break;
              case "both":
                h.global_attack_mod += k.roll + "[" + k.name + "]+";
            }
          }
        });
        "" !== h.global_attack_mod && (h.global_attack_mod = "[[" + h.global_attack_mod.replace(/\+(?=$)/, "") + "]]");
        "" !== h.global_acc_attack && (h.global_acc_attack = "[[" + h.global_acc_attack.replace(/\+(?=$)/, "") + "]]");
        "" !== h.global_eff_attack && (h.global_eff_attack = "[[" + h.global_eff_attack.replace(/\+(?=$)/, "") + "]]");
        setAttrs(h, {silent:!0}, function() {
          "function" == typeof c && c();
        });
      });
    }
  });
}, update_cultivatorattacks = function(c, d) {
  console.log("DOING CULTIVATOR_UPDATE_ATTACKS: " + c);
  "-" === c.substring(0, 1) && 20 === c.length ? do_update_cultivatorattack([c], d) : -1 < "power agility vitality cultivation qicontrol mental all".split(" ").indexOf(c) && getSectionIDs("repeating_cultivatorattack", function(a) {
    if ("all" === c) {
      do_update_cultivatorattack(a);
    } else {
      var b = [];
      _.each(a, function(g) {
        b.push("repeating_attack_" + g + "_atkattr_base");
        b.push("repeating_attack_" + g + "_dmgattr");
        b.push("repeating_attack_" + g + "_dmg2attr");
        b.push("repeating_attack_" + g + "_savedc");
      });
      getAttrs(b, function(g) {
        var f = [];
        _.each(a, function(h) {
          (g["repeating_attack_" + h + "_atkattr_base"] && -1 < g["repeating_attack_" + h + "_atkattr_base"].indexOf(c) || g["repeating_attack_" + h + "_dmgattr"] && -1 < g["repeating_attack_" + h + "_dmgattr"].indexOf(c) || g["repeating_attack_" + h + "_dmg2attr"] && -1 < g["repeating_attack_" + h + "_dmg2attr"].indexOf(c) || g["repeating_attack_" + h + "_savedc"] && -1 < g["repeating_attack_" + h + "_savedc"].indexOf(c)) && f.push(h);
        });
        0 < f.length && do_update_cultivatorattack(f);
      });
    }
  });
}, do_update_cultivatorattack = function(c) {
  var d = "level dtype power agility vitality cultivation qicontrol mental cultivator_global_damage_damage cultivator_global_damage_mod_type".split(" ");
  _.each(c, function(a) {
    d.push("repeating_cultivatorattack_" + a + "_atkflag");
    d.push("repeating_cultivatorattack_" + a + "_atkname");
    d.push("repeating_cultivatorattack_" + a + "_atkattr_base");
    d.push("repeating_cultivatorattack_" + a + "_atkmod");
    d.push("repeating_cultivatorattack_" + a + "_dmgflag");
    d.push("repeating_cultivatorattack_" + a + "_dmgbase");
    d.push("repeating_cultivatorattack_" + a + "_dmgattr");
    d.push("repeating_cultivatorattack_" + a + "_dmgmod");
    d.push("repeating_cultivatorattack_" + a + "_dmgtype");
    d.push("repeating_cultivatorattack_" + a + "_dmg2flag");
    d.push("repeating_cultivatorattack_" + a + "_dmg2base");
    d.push("repeating_cultivatorattack_" + a + "_dmg2attr");
    d.push("repeating_cultivatorattack_" + a + "_dmg2mod");
    d.push("repeating_cultivatorattack_" + a + "_dmg2type");
    d.push("repeating_cultivatorattack_" + a + "_dmg3flag");
    d.push("repeating_cultivatorattack_" + a + "_dmg3base");
    d.push("repeating_cultivatorattack_" + a + "_dmg3attr");
    d.push("repeating_cultivatorattack_" + a + "_dmg3mod");
    d.push("repeating_cultivatorattack_" + a + "_dmg3type");
    d.push("repeating_cultivatorattack_" + a + "_saveflag");
    d.push("repeating_cultivatorattack_" + a + "_savedc");
    d.push("repeating_cultivatorattack_" + a + "_saveeffect");
    d.push("repeating_cultivatorattack_" + a + "_saveflat");
    d.push("repeating_cultivatorattack_" + a + "_atkrange");
    d.push("repeating_cultivatorattack_" + a + "_cultivator_global_damage_mod_field");
  });
  getAttrs(d, function(a) {
    _.each(c, function(b) {
      var g = [], f = {}, h = "", k = "", l = "", m = "", n = "", p = "", u = p = "", q = "", r = "", v = "", t = "";
      a["repeating_cultivatorattack_" + b + "_atkattr_base"] && "0" !== a["repeating_cultivatorattack_" + b + "_atkattr_base"] ? (atkattr_base = parseInt(a[a["repeating_cultivatorattack_" + b + "_atkattr_base"].substring(2, a["repeating_cultivatorattack_" + b + "_atkattr_base"].length - 1)], 10), p = a["repeating_cultivatorattack_" + b + "_atkattr_base"].substring(2, a["repeating_cultivatorattack_" + b + "_atkattr_base"].length - 1).toUpperCase()) : atkattr_base = 0;
      a["repeating_cultivatorattack_" + b + "_dmgattr"] && "0" !== a["repeating_cultivatorattack_" + b + "_dmgattr"] ? (dmgattr = parseInt(a[a["repeating_cultivatorattack_" + b + "_dmgattr"].substring(2, a["repeating_cultivatorattack_" + b + "_dmgattr"].length - 1)], 10), u = a["repeating_cultivatorattack_" + b + "_dmgattr"].substring(2, a["repeating_cultivatorattack_" + b + "_dmgattr"].length - 1).toUpperCase()) : dmgattr = 0;
      a["repeating_cultivatorattack_" + b + "_dmg2attr"] && "0" !== a["repeating_cultivatorattack_" + b + "_dmg2attr"] ? (dmg2attr = parseInt(a[a["repeating_cultivatorattack_" + b + "_dmg2attr"].substring(2, a["repeating_cultivatorattack_" + b + "_dmg2attr"].length - 1)], 10), q = a["repeating_cultivatorattack_" + b + "_dmg2attr"].substring(2, a["repeating_cultivatorattack_" + b + "_dmg2attr"].length - 1).toUpperCase()) : dmg2attr = 0;
      a["repeating_cultivatorattack_" + b + "_dmg3attr"] && "0" !== a["repeating_cultivatorattack_" + b + "_dmg3attr"] ? (dmg3attr = parseInt(a[a["repeating_cultivatorattack_" + b + "_dmg3attr"].substring(2, a["repeating_cultivatorattack_" + b + "_dmg3attr"].length - 1)], 10), r = a["repeating_cultivatorattack_" + b + "_dmg3attr"].substring(2, a["repeating_cultivatorattack_" + b + "_dmg3attr"].length - 1).toUpperCase()) : dmg3attr = 0;
      var A = a["repeating_cultivatorattack_" + b + "_dmgbase"] && "" != a["repeating_cultivatorattack_" + b + "_dmgbase"] ? a["repeating_cultivatorattack_" + b + "_dmgbase"] : 0, B = a["repeating_cultivatorattack_" + b + "_dmg2base"] && "" != a["repeating_cultivatorattack_" + b + "_dmg2base"] ? a["repeating_cultivatorattack_" + b + "_dmg2base"] : 0, C = a["repeating_cultivatorattack_" + b + "_dmg3base"] && "" != a["repeating_cultivatorattack_" + b + "_dmg3base"] ? a["repeating_cultivatorattack_" + b + "_dmg3base"] : 0, x = a["repeating_cultivatorattack_" + b + "_dmgmod"] && !1 === isNaN(parseInt(a["repeating_cultivatorattack_" + b + "_dmgmod"], 10)) ? parseInt(a["repeating_cultivatorattack_" + b + "_dmgmod"], 10) : 0, y = a["repeating_cultivatorattack_" + b + "_dmg2mod"] && !1 === isNaN(parseInt(a["repeating_cultivatorattack_" + b + "_dmg2mod"], 10)) ? parseInt(a["repeating_cultivatorattack_" + b + "_dmg2mod"], 10) : 0, z = a["repeating_cultivatorattack_" + b + "_dmg3mod"] && !1 === isNaN(parseInt(a["repeating_cultivatorattack_" + b + "_dmg3mod"], 10)) ? parseInt(a["repeating_cultivatorattack_" + b + "_dmg3mod"], 10) : 0, E = a["repeating_cultivatorattack_" + b + "_dmgtype"] ? a["repeating_cultivatorattack_" + b + "_dmgtype"] + " " : "", F = a["repeating_cultivatorattack_" + b + "_dmg2type"] ? a["repeating_cultivatorattack_" + b + "_dmg2type"] + " " : "", G = a["repeating_cultivatorattack_" + b + "_dmg3type"] ? a["repeating_cultivatorattack_" + b + "_dmg3type"] + " " : "", H = a["repeating_cultivatorattack_" + b + "_atkmod"] && "" != a["repeating_cultivatorattack_" + b + "_atkmod"] ? parseInt(a["repeating_cultivatorattack_" + b + "_atkmod"], 10) : 0, w = "+" + `[[${a.cultivator_global_damage_damage && "" !== a.cultivator_global_damage_damage ? a.cultivator_global_damage_damage : "0"}]]` + "[" + (a.cultivator_global_damage_mod_type || "") + "]";
      if (a["repeating_cultivatorattack_" + b + "_atkflag"] && 0 != a["repeating_cultivatorattack_" + b + "_atkflag"]) {
        bonus_mod = atkattr_base + H, plus_minus = -1 < bonus_mod ? "+" : "", bonus = plus_minus + bonus_mod;
      } else if (a["repeating_cultivatorattack_" + b + "_saveflag"] && 0 != a["repeating_cultivatorattack_" + b + "_saveflag"]) {
        if (a["repeating_cultivatorattack_" + b + "_savedc"] && "(@{saveflat})" === a["repeating_cultivatorattack_" + b + "_savedc"]) {
          var D = !1 === isNaN(parseInt(a["repeating_cultivatorattack_" + b + "_saveflat"])) ? parseInt(a["repeating_cultivatorattack_" + b + "_saveflat"]) : "0";
        } else {
          D = a["repeating_cultivatorattack_" + b + "_savedc"].replace(/^[^{]*{/, "").replace(/_.*$/, ""), D = a[D] ? parseInt(a[D], 10) : 0;
        }
        bonus = "DC" + D;
      } else {
        bonus = "-";
      }
      a["repeating_cultivatorattack_" + b + "_dmgflag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmgflag"] ? (0 === A && 0 === dmgattr + x && (m = 0), 0 != A && (m = A), 0 != A && 0 != dmgattr + x && (m = 0 < dmgattr + x ? m + "+" : m), 0 != dmgattr + x && (m += dmgattr + x), m = m + " " + E) : m = "";
      a["repeating_cultivatorattack_" + b + "_dmg2flag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmg2flag"] ? (0 === B && 0 === dmg2attr + y && (n = 0), 0 != B && (n = B), 0 != B && 0 != dmg2attr + y && (n = 0 < dmg2attr + y ? n + "+" : n), 0 != dmg2attr + y && (n += dmg2attr + y), n = n + " " + F) : n = "";
      a["repeating_cultivatorattack_" + b + "_dmg3flag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmg3flag"] ? (0 === C && 0 === dmg3attr + z && (v = 0), 0 != C && (v = C), 0 != C && 0 != dmg3attr + z && (n = 0 < dmg3attr + z ? v + "+" : v), 0 != dmg3attr + z && (v += dmg3attr + z), v = v + " " + G) : v = "";
      dmgspacer1 = a["repeating_cultivatorattack_" + b + "_dmgflag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmgflag"] && a["repeating_cultivatorattack_" + b + "_dmg2flag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmg2flag"] ? "+ " : "";
      dmgspacer2 = a["repeating_cultivatorattack_" + b + "_dmgflag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmgflag"] && a["repeating_cultivatorattack_" + b + "_dmg3flag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmg3flag"] ? "+ " : "";
      r2 = "{{r2=[[";
      a["repeating_cultivatorattack_" + b + "_atkflag"] && 0 != a["repeating_cultivatorattack_" + b + "_atkflag"] ? (0 != H && (h = H + "[MOD]" + h), 0 != atkattr_base && (h = atkattr_base + "[" + p + "]" + h)) : h = "";
      a["repeating_cultivatorattack_" + b + "_dmgflag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmgflag"] ? (0 != x && (k = "+" + x + "[MOD]" + k), 0 != dmgattr && (k = "+" + dmgattr + "[" + u + "]" + k), k = A + k) : k = "0";
      a["repeating_cultivatorattack_" + b + "_dmg2flag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmg2flag"] ? (0 != y && (l = "+" + y + "[MOD]" + l), 0 != dmg2attr && (l = "+" + dmg2attr + "[" + q + "]" + l), l = B + l) : l = "0";
      a["repeating_cultivatorattack_" + b + "_dmg3flag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmg3flag"] ? (0 != z && (t = "+" + z + "[MOD]" + t), 0 != dmg3attr && (t = "+" + dmg3attr + "[" + r + "]" + t), t = C + t) : t = "0";
      "full" === a.dtype ? (pickbase = "full", p = "@{wtype}&{template:atkdmg} {{mod=@{atkbonus}}} {{rname=@{atkname}}} {{r1=[[" + h + "]]}} " + r2 + h + "]]}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + k + w + "]]}} {{dmg1type=" + E + "}} @{dmg2flag} {{dmg2=[[" + l + w + "]]}} {{dmg2type=" + F + "}} @{dmg3flag} {{dmg3=[[" + t + w + "]]}} {{dmg3type=" + G + "}} @{saveflag} {{desc=@{atk_desc}}} {{globalattack=@{cultivator_global_attack_mod}}} {{globalaccattack=@{cultivator_global_acc_attack}}} {{globaleffattack=@{cultivator_global_eff_attack}}} {{globaldamagetype=@{cultivator_global_damage_mod_type}}} @{charname_output}") : a["repeating_cultivatorattack_" + b + "_atkflag"] && 0 != a["repeating_cultivatorattack_" + b + "_atkflag"] ? (pickbase = "pick", p = "@{wtype}&{template:atk} {{mod=@{atkbonus}}} {{rname=[@{atkname}](~repeating_cultivatorattack_attack_dmg)}} {{r1=[[" + h + "]]}} " + r2 + h + "]]}} {{range=@{atkrange}}} {{desc=@{atk_desc}}} {{globalattack=@{cultivator_global_attack_mod}}} {{globalaccattack=@{cultivator_global_acc_attack}}} {{globaleffattack=@{cultivator_global_eff_attack}}} @{charname_output}") : a["repeating_cultivatorattack_" + b + "_dmgflag"] && 0 != a["repeating_cultivatorattack_" + b + "_dmgflag"] ? (pickbase = "dmg", p = "@{wtype}&{template:dmg} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + k + w + "]]}} {{dmg1type=" + E + "}} @{dmg2flag} {{dmg2=[[" + l + w + "]]}} {{dmg2type=" + F + "}} @{dmg3flag} {{dmg3=[[" + t + w + "]]}} {{dmg3type=" + G + "}} @{saveflag} {{desc=@{atk_desc}}} {{globaldamagetype=@{cultivator_global_damage_mod_type}}} @{charname_output}") : (pickbase = "empty", p = "@{wtype}&{template:dmg} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{saveflag} {{desc=@{atk_desc}}} @{charname_output}");
      f["repeating_cultivatorattack_" + b + "_rollbase_dmg"] = "@{wtype}&{template:dmg} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + k + w + "]]}} {{dmg1type=" + E + "}} @{dmg2flag} {{dmg2=[[" + l + w + "]]}} {{dmg2type=" + F + "}} @{dmg3flag} {{dmg3=[[" + t + w + "]]}} {{dmg3type=" + G + "}} @{saveflag} {{desc=@{atk_desc}}} {{globaldamagetype=@{cultivator_global_damage_mod_type}}} @{charname_output}";
      f["repeating_cultivatorattack_" + b + "_atkbonus"] = bonus;
      f["repeating_cultivatorattack_" + b + "_atkdmgtype"] = m + dmgspacer1 + n + dmgspacer2 + v + " ";
      f["repeating_cultivatorattack_" + b + "_rollbase"] = p;
      setAttrs(f, {silent:!0}, function() {
        g.forEach(function(I) {
          I();
        });
      });
    });
  });
}, update_cultivatorglobaldamage = function(c) {
  getSectionIDs("cultivatordamagemod", function(d) {
    if (d) {
      var a = {}, b = [];
      d.forEach(function(g) {
        a[g] = {};
        b.push(`repeating_cultivatordamagemod_${g}_cultivator_global_damage_active_flag`, `repeating_cultivatordamagemod_${g}_cultivator_global_damage_name`, `repeating_cultivatordamagemod_${g}_cultivator_global_damage_damage`, `repeating_cultivatordamagemod_${g}_cultivator_global_damage_type`);
      });
      getAttrs(b, function(g) {
        var f = /^repeating_cultivatordamagemod_(.+)_cultivator_global_damage_(active_flag|name|damage|type)$/;
        _.each(g, function(k, l) {
          (l = f.exec(l)) && (a[l[1]][l[2]] = k);
        });
        var h = {cultivator_global_damage_damage:"", cultivator_global_damage_mod_type:""};
        console.log("CULTIVATOR GLOBALDAMAGE");
        _.each(a, function(k) {
          "0" != k.active_flag && (k.name && "" !== k.name && (h.cultivator_global_damage_damage += k.damage + "[" + k.name + "]+"), k.type && "" !== k.type && (h.cultivator_global_damage_mod_type += k.type + "/"));
        });
        h.cultivator_global_damage_damage = h.cultivator_global_damage_damage.replace(/\+(?=$)/, "");
        h.cultivator_global_damage_mod_type = h.cultivator_global_damage_mod_type.replace(/\/(?=$)/, "");
        setAttrs(h, {silent:!0}, function() {
          update_cultivatorattacks("all");
          "function" == typeof c && c();
        });
      });
    }
  });
}, update_cultivatorglobalattack = function(c) {
  getSectionIDs("cultivatortohitmod", function(d) {
    if (d) {
      var a = {}, b = [];
      d.forEach(function(g) {
        a[g] = {};
        b.push(`repeating_cultivatortohitmod_${g}_cultivator_global_attack_active_flag`, `repeating_cultivatortohitmod_${g}_cultivator_global_attack_roll`, `repeating_cultivatortohitmod_${g}_cultivator_global_attack_name`, `repeating_cultivatortohitmod_${g}_cultivator_global_attack_appliesto`);
      });
      getAttrs(b, function(g) {
        var f = /^repeating_cultivatortohitmod_(.+)_cultivator_global_attack_(active_flag|roll|name|appliesto)$/;
        _.each(g, function(k, l) {
          (l = f.exec(l)) && (a[l[1]][l[2]] = k);
        });
        var h = {cultivator_global_attack_mod:"", cultivator_global_acc_attack:"", cultivator_global_eff_attack:""};
        console.log("CULTIVATOR GLOBALATTACK");
        _.each(a, function(k) {
          if ("0" != k.active_flag && k.roll && "" !== k.roll) {
            switch(k.appliesto) {
              case "acc":
                h.cultivator_global_acc_attack += k.roll + "[" + k.name + "]+";
                break;
              case "eff":
                h.cultivator_global_eff_attack += k.roll + "[" + k.name + "]+";
                break;
              case "both":
                h.cultivator_global_attack_mod += k.roll + "[" + k.name + "]+";
            }
          }
        });
        "" !== h.cultivator_global_attack_mod && (h.cultivator_global_attack_mod = "[[" + h.cultivator_global_attack_mod.replace(/\+(?=$)/, "") + "]]");
        "" !== h.cultivator_global_acc_attack && (h.cultivator_global_acc_attack = "[[" + h.cultivator_global_acc_attack.replace(/\+(?=$)/, "") + "]]");
        "" !== h.cultivator_global_eff_attack && (h.cultivator_global_eff_attack = "[[" + h.cultivator_global_eff_attack.replace(/\+(?=$)/, "") + "]]");
        setAttrs(h, {silent:!0}, function() {
          "function" == typeof c && c();
        });
      });
    }
  });
}, update_weight = function() {
  console.log("UPDATING WEIGHT");
  var c = {}, d = 0, a = 0, b = ["power", "carrying_capacity_mod", "inventory_slots_mod", "itemweightfixed", "itemslotsfixed"];
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
      var h = 0, k = 0;
      _.each(g, function(q) {
        if (1 == f["repeating_inventory_" + q + "_equipped"] || 1 == f["repeating_inventory_" + q + "_carried"]) {
          if (1 == f["repeating_inventory_" + q + "_itemcontainer"]) {
            if (1 == f["repeating_inventory_" + q + "_equipped"]) {
              k = parseInt(f["repeating_inventory_" + q + "_itemcontainer_slots"], 0);
              var r = "repeating_inventory_" + q + "_itemcontainer_slots_modifier";
              f[r] && (-1 < ["+", "-"].indexOf(f[r]) ? (q = f[r].substring(0, 1), r = f[r].substring(1), !1 === isNaN(parseInt(r, 0)) && ("+" == q ? h += parseInt(r, 0) : "-" == q && (h -= parseInt(r, 0)))) : !1 === isNaN(parseInt(f[r], 0)) && (h += parseInt(f[r], 0)));
            }
          } else {
            f["repeating_inventory_" + q + "_itemweight"] && !1 === isNaN(parseInt(f["repeating_inventory_" + q + "_itemweight"], 0)) && (1 == f["repeating_inventory_" + q + "_itemweightfixed"] ? d += parseFloat(f["repeating_inventory_" + q + "_itemweight"]) : (count = f["repeating_inventory_" + q + "_itemcount"] && !1 === isNaN(parseFloat(f["repeating_inventory_" + q + "_itemcount"])) ? parseFloat(f["repeating_inventory_" + q + "_itemcount"]) : 1, d += parseFloat(f["repeating_inventory_" + q + "_itemweight"]) * count)), f["repeating_inventory_" + q + "_itemsize"] && !1 === isNaN(parseInt(f["repeating_inventory_" + q + "_itemsize"], 0)) && (1 == f["repeating_inventory_" + q + "_itemslotsfixed"] ? a += parseFloat(f["repeating_inventory_" + q + "_itemsize"]) : (count = f["repeating_inventory_" + q + "_itemcount"] && !1 === isNaN(parseFloat(f["repeating_inventory_" + q + "_itemcount"])) ? parseFloat(f["repeating_inventory_" + q + "_itemcount"]) : 1, a += parseFloat(f["repeating_inventory_" + q + "_itemsize"]) * count));
          }
        }
      });
      d = Math.round(100 * d) / 100;
      a = Math.round(100 * a) / 100;
      c.weighttotal = d;
      c.slotstotal = a;
      var l = 18 + (parseInt(k));
      if (f.inventory_slots_mod) {
        var m = f.inventory_slots_mod.substring(0, 1), n = f.inventory_slots_mod.substring(1);
        -1 < ["*", "x", "+", "-"].indexOf(m) && !1 === isNaN(parseInt(n, 0)) && ("*" == m || "x" == m ? l *= parseInt(n, 0) : "+" == m ? l += parseInt(n, 0) : "-" == m && (l -= parseInt(n, 0)));
      }
      l += h;
      var p = parseInt(f.power), u = 30 * p;
      f.carrying_capacity_mod && (m = f.carrying_capacity_mod.substring(0, 1), n = parseInt(f.carrying_capacity_mod.substring(1), 10), -1 < ["*", "x", "+", "-", "/"].indexOf(m) && !isNaN(n) && ("*" == m || "x" == m ? u *= n : "+" == m ? u += n : "-" == m ? u -= n : "/" == m && (u /= n)));
      c.weightmaximum = u;
      c.slotsmaximum = l;
      c.encumberance = a > l ? "OVER CARRYING CAPACITY" : d > 30 * p ? "IMMOBILE" : d > 22 * p ? "HEAVILY ENCUMBERED" : d > 15 * p ? "ENCUMBERED" : " ";
      setAttrs(c, {silent:!0});
    });
  });
}, update_skills = function(c) {
  var d = "power agility vitality cultivation qicontrol mental appearance".split(" "), a = {}, b = [];
  _.each(c, function(g) {
    d.push(g + "_bonus");
    d.push(g + "_flat");
  });
  getSectionIDs("repeating_inventory", function(g) {
    _.each(g, function(f) {
      d.push("repeating_inventory_" + f + "_equipped");
      d.push("repeating_inventory_" + f + "_itemmodifiers");
    });
    getAttrs(d, function(f) {
      _.each(c, function(h) {
        console.log("UPDATING SKILL: " + h);
        var k = f[h + "_flat"] && !isNaN(parseInt(f[h + "_flat"], 10)) ? parseInt(f[h + "_flat"], 10) : 0, l = 0;
        _.each(g, function(n) {
          f["repeating_inventory_" + n + "_equipped"] && "1" === f["repeating_inventory_" + n + "_equipped"] && f["repeating_inventory_" + n + "_itemmodifiers"] && (-1 < f["repeating_inventory_" + n + "_itemmodifiers"].toLowerCase().replace(/ /g, "_").indexOf(h) || -1 < f["repeating_inventory_" + n + "_itemmodifiers"].toLowerCase().indexOf("skill checks")) && (n = f["repeating_inventory_" + n + "_itemmodifiers"].toLowerCase().split(","), _.each(n, function(p) {
            if (-1 < p.replace(/ /g, "_").indexOf(h) || -1 < p.indexOf("skill checks")) {
              -1 < p.indexOf("-") ? (p = isNaN(parseInt(p.replace(/[^0-9]/g, ""), 10)) ? !1 : parseInt(p.replace(/[^0-9]/g, ""), 10), l -= p ? l + p : l) : (p = isNaN(parseInt(p.replace(/[^0-9]/g, ""), 10)) ? !1 : parseInt(p.replace(/[^0-9]/g, ""), 10), l += p ? l + p : l);
            }
          }));
        });
        var m = 0;
        switch(h) {
          case "acrobatics":
          case "discretion":
          case "stealth":
            m = parseInt(f.agility, 10);
            break;
          case "athletics":
          case "grapple":
            m = parseInt(f.power, 10);
            break;
          case "charm":
          case "deceit":
          case "disguise":
          case "persuade":
            m = parseInt(f.mental, 10) + parseInt(f.appearance, 10);
            break;
          case "fine_arts":
          case "forgery":
          case "navigation":
            m = Math.floor(parseInt(f.agility, 10) / 2) + Math.floor(parseInt(f.mental, 10) / 2);
            break;
          case "history":
          case "medicine":
            m = Math.floor(parseInt(f.qicontrol, 10) / 2) + Math.floor(parseInt(f.mental, 10) / 2);
            break;
          case "intuition":
          case "investigation":
          case "perception":
            m = parseInt(f.mental, 10);
            break;
          case "intimidation":
            m = parseInt(f.power, 10) + parseInt(f.appearance, 10);
            break;
          case "performance":
            m = parseInt(f.agility, 10) + parseInt(f.appearance, 10);
            break;
          case "survival":
            m = Math.floor(parseInt(f.power, 10) / 2) + Math.floor(parseInt(f.mental, 10) / 2);
        }
        k += l;
        a[h] = 0 < k ? m + "d6+" + k : m + "d6";
        a[h + "_bonus"] = k;
        a[h + "_roll"] = m;
      });
      setAttrs(a, {silent:!0}, function() {
        b.forEach(function(h) {
          h();
        });
      });
    });
  });
}, update_all_ability_checks = function() {
  update_initiative();
  update_skills("acrobatics athletics charm deceit discretion disguise fine_arts forgery grapple history intuition intimidation investigation medicine navigation perception performance persuade stealth survival".split(" "));
}, update_durability = function() {
  console.log("UPDATING DURABILITY");
  getAttrs(["durability-base", "durability-limit", "durability-bonus", "vitality"], function(c) {
    var d = {}, a = parseInt(c["durability-base"]) || 0, b = parseInt(c.vitality);
    parseInt(c["durability-limit"]);
    c = parseInt(c["durability-bonus"]) || 0;
    e = 10 * Math.floor(b / 50);
    d["durability-full"] = a + c + e;
    setAttrs(d, {silent:!0});
  });
}, update_evasion = function() {
  console.log("UPDATING EVASION");
  getAttrs(["evasion-base", "evasion-limit", "evasion-bonus", "agility"], function(c) {
    var d = {}, a = parseInt(c.agility) || 0, b = parseInt(c["evasion-base"]) || 0, g = parseInt(c["evasion-limit"]) || 0;
    c = parseInt(c["evasion-bonus"]) || 0;
    d["evasion-full"] = a < g ? b + a + c : b + g + Math.floor((a - g) / 2) + c;
    setAttrs(d, {silent:!0});
  });
}, update_reduction = function() {
  console.log("UPDATING REDUCTION");
  getAttrs(["reduction-base", "reduction-armour", "reduction-bonus"], function(c) {
    var d = {}, a = parseInt(c["reduction-base"]) || 0, b = parseInt(c["reduction-armour"]) || 0;
    c = parseInt(c["reduction-bonus"]) || 0;
    d["reduction-full"] = a + b + c;
    setAttrs(d, {silent:!0});
  });
};
let toInt = function(c) {
  return c && !isNaN(c) ? parseInt(c) : 0;
}, clamp = function(c, d, a) {
  return Math.min(Math.max(c, d), a);
}, isDefined = function(c) {
  return null !== c && "undefined" !== typeof c;
};