
var pronounSets = { /* more: https://en.wikipedia.org/wiki/Third-person_pronoun#Generic_he */
   'a': ['she', 'her', 'her', 'hers', 'herself'],
   'b': ['he', 'him', 'his', 'his', 'himself'],
   'c': ['ey', 'em', 'eir', 'eirs', 'eirself'],
   'd': ['per', 'per', 'pers', 'pers', 'perself'],
   'e': ['sie', 'sir', 'hir', 'hirs', 'hirself'],
   'f': ['they', 'them', 'their', 'theirs', 'themselves'],
   'g': ['ve', 'ver', 'vis', 'vers', 'verself'],
   'h': ['zie', 'zim', 'zir', 'zirs', 'zirself']
};


var nounSubs = {};

function addNoun(from, into) {

    var froms = from.split(",");
    var fromSingular = froms[0];
    var fromPlural = froms[1] || (fromSingular + 's');

    var intos = into.split(",");
    var intoSingular = intos[0];
    var intoPlural = intos[1] || (intoSingular + 's');

    nounSubs[fromSingular] = intoSingular;
    nounSubs[fromPlural] = intoPlural;
}

addNoun('witch,witches', 'witzard');
addNoun('wizard', 'witzard');
addNoun('sister', 'sibling');
addNoun('brother', 'sibling');
addNoun('wife,wives', 'spouse');
addNoun('husband', 'spouse');
addNoun('daughter', 'child');
addNoun('son', 'child');
addNoun('mum', 'parent');
addNoun('mom', 'parent');
addNoun('mother', 'parent');
addNoun('mommy,mommies', 'parent');
addNoun('mummy,mummies', 'parent');
addNoun('dad', 'parent');
addNoun('daddy,daddies', 'parent');
addNoun('father', 'parent');
addNoun('girl', 'child');
addNoun('boy', 'child');
addNoun('girlfriend', 'friend');
addNoun('boyfriend', 'friend');

var substitutions = null;
var subsRegex = null;
var target = null;

function rebuildSubsRegex(pronounSetId) {
    if (target != pronounSetId) {
        console.log('Gender Blinder is regenerating its pronoun detector.');
        target = pronounSetId;
        var pronounSubs = {
            'she': pronounSets[target][0],
            'her': pronounSets[target][1] + "/" + pronounSets[target][2],
            'hers': pronounSets[target][3],
            'herself': pronounSets[target][4],
            'he': pronounSets[target][0],
            'him': pronounSets[target][1],
            'his': pronounSets[target][2] + "/" + pronounSets[target][3],
            'himself': pronounSets[target][4]
        };
        substitutions = Object.assign(pronounSubs, nounSubs);
        subsRegex = new RegExp('\\b(' + Object.keys(substitutions).join('|') + ')\\b', 'ig');
    }
}

var honourifics = ['Mr','Mrs','Ms','Miss'];

var honourificRegex = new RegExp('\\b(' + honourifics.join('|') + ')\\b', 'g');
var manSuffixRegex = new RegExp('(..)?(man|men|mens)\\b', 'ig');
var whitespaceRegex = new RegExp('\\s');
var upperCaseRegex = new RegExp('^[A-Z]{2}');
var lowerCaseRegex = new RegExp('^[a-z]{2}');

function personify(caseTest, part2) {
    var part2Lower = part2.toLowerCase();
    if (upperCaseRegex.test(caseTest)) {
        return part2Lower == 'man' ? 'PERSON' : part2Lower == 'men' ? 'PEOPLE' : 'PEOPLES';
    } else if (lowerCaseRegex.test(caseTest)) {
        return part2Lower == 'man' ? 'person' : part2Lower == 'men' ? 'people' : 'peoples';
    }
    return part2Lower == 'man' ? 'Person' : part2Lower == 'men' ? 'People' : 'Peoples';
}

function manSuffixReplacer(match, group1, group2) {
    if (group1 === undefined) {
        return personify(group2, group2);
    }
    if (whitespaceRegex.test(group1)) {
        return group1 + personify(group2, group2);
    }
    if (group1.toLowerCase() == 'wo') {
        return personify(group1, group2);
    }
    if (match.toLowerCase() == "human") {
        return match;
    }
    return group1 + personify(group1, group2);
}

function mark(string) {
    return '_' + string + '_';
}

function markingManSuffixReplacer(match, group1, group2) {
    if (group1 === undefined) {
        return personify(group2, group2);
    }
    if (whitespaceRegex.test(group1)) {
        return group1 + mark(personify(group2, group2));
    }
    if (group1.toLowerCase() == 'wo') {
        return mark(personify(group1, group2));
    }
    if (match.toLowerCase() == "human") {
        return match;
    }
    return group1 + mark(personify(group1, group2));
}

function subsReplacer(match) {
  var substitution = substitutions[match.toLowerCase()];
  var first = substitution.charAt(0);
  var rest = substitution.slice(1);
  if (match.charAt(0) == match.charAt(0).toUpperCase()) {
    first = first.toUpperCase();
  }
  if (match.charAt(1) == match.charAt(1).toUpperCase()) {
    rest = rest.toUpperCase();
  }
  substitution = first + rest;
  return substitution;
}

function marking(f) {
    return function () {
        return mark(f.apply(undefined, arguments));
    }
}

var treeWalker = document.createTreeWalker (
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
);

chrome.storage.local.get(["enabled", "mark", "pronouns"], function(items){
    if (items.enabled) {
        rebuildSubsRegex(items.pronouns || "f");
        if (items.mark) {
            while (treeWalker.nextNode()) {
                treeWalker.currentNode.nodeValue =
                    treeWalker.currentNode.nodeValue
                    .replace(manSuffixRegex, markingManSuffixReplacer)
                    .replace(subsRegex, marking(subsReplacer))
                    .replace(honourificRegex, mark("Mx"));
            }
        }
        else {
            while (treeWalker.nextNode()) {
                treeWalker.currentNode.nodeValue =
                    treeWalker.currentNode.nodeValue
                    .replace(manSuffixRegex, manSuffixReplacer)
                    .replace(subsRegex, subsReplacer)
                    .replace(honourificRegex, "Mx");
            }
        }
        console.log('Gender Blinder completed.');
    }
});
