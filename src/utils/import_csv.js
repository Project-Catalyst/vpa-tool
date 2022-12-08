import papa from 'papaparse'
import { useProgrammatic } from '@oruga-ui/oruga-next'
const { oruga } = useProgrammatic()


function errorHandling(err, file, inputElem, reason) {
  console.log("CSV: error importing");
  console.log("err:");
  console.log(err);
  console.log("inputElem:");
  console.log(inputElem);
  oruga.notification.open({
    message: `<p><b>Something went wrong when importing your file:</p></b><p>${reason}</p>`,
    variant: "danger",
    position: "top"
  });
}

export async function readFile(file) {
  return new Promise((resolve, reject) => {
    papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete (results, file) {
        resolve(results.data)
      },
      error: errorHandling
    })
  })
}