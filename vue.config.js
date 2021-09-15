csvHeaders = JSON.parse(`{
  "id": {
    "type": "integer",
    "label": "id"
  },
  "title": {
    "type": "string",
    "label": "Idea Title"
  },
  "url": {
    "type": "string",
    "label": "Idea URL"
  },
  "assessor": {
    "type": "string",
    "label": "Assessor"
  },
  "triplet_id": {
    "type": "string",
    "label": "triplet_id"
  },
  "proposal_id": {
    "type": "integer",
    "label": "proposal_id"
  },
  "impact_note": {
    "type": "string",
    "label": "Impact / Alignment Note"
  },
  "impact_rating": {
    "type": "integer",
    "label": "Impact / Alignment Rating"
  },
  "feasibility_note": {
    "type": "string",
    "label": "Feasibility Note"
  },
  "feasibility_rating": {
    "type": "integer",
    "label": "Feasibility Rating"
  },
  "auditability_note": {
    "type": "string",
    "label": "Auditability Note"
  },
  "auditability_rating": {
    "type": "integer",
    "label": "Auditability Rating"
  },
  "proposer_mark": {
    "type": "boolean",
    "label": "Proposer Mark"
  },
  "proposer_rationale": {
    "type": "string",
    "label": "Proposer Not Valid rationale"
  },
  "excellent": {
    "type": "boolean",
    "label": "Excellent"
  },
  "good": {
    "type": "boolean",
    "label": "Good"
  },
  "not_valid": {
    "type": "boolean",
    "label": "Not Valid"
  }
}`);

const transformData = function(value, col) {
  if (csvHeaders[col]) {
    if (csvHeaders[col].type === 'integer') {
      return parseInt(value)
    }
    if (csvHeaders[col].type === 'boolean') {
      return (value.trim() !== '')
    }
    if (csvHeaders[col].type === 'string') {
      return value
    }
  } else {
    return value
  }
};
const transformHeader = function(header) {
  const newHeaders = {}
  Object.keys(csvHeaders).forEach((h) => {
    newHeaders[csvHeaders[h].label] = h
  })
  if (newHeaders[header]) {
    return newHeaders[header]
  }
  return header
};

module.exports = {
  publicPath: (process.env.NODE_ENV === 'production') ? '/vca-tool/' : '',
  chainWebpack: config => {
    config
      .module
      .rule("csv")
      .test(/\.csv$/)
      .use("csv-loader")
      .loader("csv-loader")
      .options({
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
        transform: transformData,
        transformHeader: transformHeader,
      })
      .end();
  }
}
