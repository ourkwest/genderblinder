
var pronounSets = { /* more: https://en.wikipedia.org/wiki/Third-person_pronoun#Generic_he */
   'a': ['she', 'her', 'her', 'hers', 'herself'],
   'b': ['he', 'him', 'his', 'his', 'himself'],
   'c': ['ey', 'em', 'eir', 'eirs', 'eirself'],
   'd': ['per', 'per', 'pers', 'pers', 'perself'],
   'e': ['sie', 'sir', 'hir', 'hirs', 'hirself'],
   'f': ['they', 'them', 'their', 'theirs', 'theirself'],
   'g': ['ve', 'ver', 'vis', 'vers', 'verself'],
   'h': ['zie', 'zim', 'zir', 'zirs', 'zirself']
};

var target = 'f';

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

var nounSubs = {
    'witch': 'witzard',
    'wizard': 'witzard',
    'sister': 'sibling',
    'brother': 'sibling',
    'wife': 'spouse',
    'husband': 'spouse',
    'daughter': 'child',
    'son': 'child',
    'mum': 'parent',
    'mom': 'parent',
    'mother': 'parent',
    'mummy': 'parent',
    'dad': 'parent',
    'daddy': 'parent',
    'father': 'parent',
    'girl': 'child',
    'boy': 'child',
    'girlfriend': 'friend',
    'boyfriend': 'friend',
    'mr': 'mx',
    'mrs': 'mx',
    'ms': 'mx',
    'miss': 'mx'
};

var substitutions = Object.assign(pronounSubs, nounSubs);

var subsRegex = new RegExp('\\b(' + Object.keys(substitutions).join('|') + ')\\b', 'ig');
var manSuffixRegex = new RegExp('(..)(man|men)\\b', 'ig');
var whitespaceRegex = new RegExp('\s', 'g');
var capitalisedRegex = new RegExp('[A-Z]{1}[a-z]{1}');
var upperCaseRegex = new RegExp('[A-Z]{2}');
var lowerCaseRegex = new RegExp('[a-z]{2}');

function personify(caseTest, part2) {
    if (capitalisedRegex.test(caseTest)) {
        return part2 == 'men' ? 'People' : 'Person';
    } else if (upperCaseRegex.test(caseTest)) {
        return part2 == 'men' ? 'PEOPLE' : 'PERSON';
    } else if (lowerCaseRegex.test(caseTest)) {
        return part2 == 'men' ? 'people' : 'person';
    }
}

function manSuffixReplacer(match, group1, group2) {
    if (whitespaceRegex.test(group1) || match.toLowerCase() == "human") {
        return match;
    }
    if (group1.toLowerCase() == 'wo') {
        return personify(group1, group2);
    }
    return group1 + personify(group1, group2);
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

var treeWalker = document.createTreeWalker (
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
);

chrome.storage.local.get("enabled", function(items){
    if (items.enabled) {
        while (treeWalker.nextNode()) {
            treeWalker.currentNode.nodeValue =
                treeWalker.currentNode.nodeValue
                .replace(manSuffixRegex, manSuffixReplacer)
                .replace(subsRegex, subsReplacer);
        }
        console.log('Gender Blinder completed.');
    }
    else {
        console.log('Gender Blinder is disabled.');
    }
});