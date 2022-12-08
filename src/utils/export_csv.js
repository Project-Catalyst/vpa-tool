import FileSaver from 'file-saver';
import slugify from 'slugify';
import papa from 'papaparse';
import supabase from '../api/supabase.js';

function errorHandling(err, file, inputElem, reason) {
  console.log("CSV: error exporting");
  console.log("reason:");
  console.log(reason);
  console.log("err:");
  console.log(err);
  console.log("inputElem:");
  console.log(inputElem);
}

function onComplete(results) {
  console.log("onComplete parsing CSV results:");
  console.log(results);
}

function downloadCsv(data, filename) {
  let date = new Date().toLocaleString().replace(', ', '_').replaceAll('/', '-').replaceAll(':', '-')
  filename = filename + '_' + supabase.getCurrentFund().title + '-vPA-Tool-export_' + date + '.csv'
  let csv = papa.unparse(data, {
    complete: onComplete,
    error: errorHandling,
    dynamicTyping: true,
    header: true,
    skipEmptyLines: true
  })
  var blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
  FileSaver.saveAs(blob, slugify(filename));
}

export default downloadCsv