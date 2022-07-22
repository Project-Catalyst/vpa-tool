import shuffle from '@/utils/shuffle'

const comparisions = {
  sameInt: (a, v) => parseInt(a) === parseInt(v),
  same: (a, v) => a === v,
  alreadyReviewed: (a, v, el) => (el.reviewed !== undefined) ? (a === v) : (!a),
  sameAvg: (a, v, el) => {
    v = Math.round((el.auditability_rating + el.feasibility_rating + el.impact_rating) / 3);
    return parseInt(a) === v;
  },
  random: (l) => shuffle(l),
  lowReviewed: (l) => l.filter((el) => el.reviews <= 8)
    .sort((a, b) => a.reviews - b.reviews),
  noReviewed: (l) => l.filter((el) => (el.reviews === 0) || (!el.reviews)),
  lengthLess: (a, v, el) => {
    v = el.auditability_note + el.feasibility_note + el.impact_note;
    return v ? v.length <= a : false;
  },
  lengthGreater: (a, v, el) => {
    v = el.auditability_note + el.feasibility_note + el.impact_note;
    return v ? v.length > a : false;
  },
  std: (l) => l
}

export default comparisions
