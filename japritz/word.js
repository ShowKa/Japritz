// 詞
const conjunction = "接続詞";
const verb = "動詞";
const auxiliaryVerb = "助動詞";
const noun = "名詞";
const prefix = "接頭詞";
const adverb = "副詞";
const adjective = "形容詞";
const determiner = "連体詞";
const continuous = "連用形";
// 自立語
const intransitive = [conjunction, verb, noun, adverb, prefix, adjective, determiner];

// 句読点
const comma = ",";
const period = ".";
const punctuation = [comma, period];

// 括弧開
const parenthesisStart = ["[", "(", "（", "「"];

// 名詞か否か
function isNoun(chunk) {
    // 名詞だけでなく接頭詞も名詞とみなす。
    if ($.inArray(chunk.pos, [noun, prefix]) >= 0) {
        return true;
    }
    return false;
}

// 数詞であるか否か
function isNumber(chunk) {
    if (chunk.pos == noun && chunk.pos_detail_1 == "数") {
        return true;
    }
    return false;
}

// 句読点か否か
function isPunctuation(chunk) {
    if ($.inArray(chunk.surface_form, punctuation) >= 0) {
        return true;
    }
    return false;
}

// 自立語であるか否か
function isIntransitive(chunk) {
    // 自立語である。
    if ($.inArray(chunk.pos, intransitive) >= 0) {

        if (chunk.pos_detail_1 == "自立") {
            return true;
        }

        // 名詞や動詞でも非自立の場合は、自立語とはみなさない
        if (chunk.pos_detail_1 == "非自立") {
            return false;
        }

        // 句読点の場合も自立語ではない（句読点も名詞として定義されている）
        if (isPunctuation(chunk)) {
            return false;
        }

        // 動詞でも、連用形の場合は自立語とはみなさない。
        if (chunk.pos == verb && chunk.conjugated_form == continuous) {
            return false;
        }

        return true;
    }
    return false;
}
