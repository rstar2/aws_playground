const path = require('path');

const key = 'Nijl_Gejmyn_Teri_Pratchet_-_Dobri_polichbi_-_Pravite_i_akuratni_predskazanija_na_Agnes_Nytyr_veshtitsa-1348-b.epub';
const inFilePath = `/tmp/${key}`;

const outFilePath = path.join(path.dirname(inFilePath),
    path.basename(inFilePath, path.extname(inFilePath)) + '.mobi');

console.error('inFilePath:', inFilePath);
console.error('outFilePath:', outFilePath);
