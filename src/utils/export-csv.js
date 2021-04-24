import { parse } from 'json2csv'
import FileSaver from 'file-saver'
import slugify from 'slugify';

import criteria from '../assets/data/criteria.json'
import exportFields from '../assets/data/export-fields.json'

function generateFields() {
  let criteriaKeys = criteria.map((c) => {
    return {
      label: c.key,
      value: (row, field) => {
        if (c.type === 'boolean') {
          return (row[field.label]) ? '1' : ''
        } else {
          return row[field.label]
        }
      }
    }
  })
  let fields = exportFields.concat(criteriaKeys)
  return fields
}

function generateCsv(data) {
  if (data.length) {
    return parse(
      data,
      {
        fields: generateFields()
      }
    );
  }
  return ''
}

function downloadCsv(data, filename) {
  filename = filename + '-vCA-export.csv'
  let csv = generateCsv(data);
  var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
  FileSaver.saveAs(blob, slugify(filename));
}

export default downloadCsv
