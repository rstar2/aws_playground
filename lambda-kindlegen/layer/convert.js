const { spawnSync, execSync } = require('child_process');

const inFilePath = '/home/rumen/ProjectsLearn/javascript/aws/lambda-kindlegen/layer/Teri_Pratchet_-_Poslednijat_geroj_-_Legenda_ot_Sveta_na_Diska-1293-b.epub';

// convert using KindleGen
// const child_process = spawnSync(
//     '/opt/KindleGen/kindlegen',
//     [
//         inFilePath,
//     ],
//     { stdio: 'inherit' }
// );

const child_process = execSync(
    `/home/rumen/ProjectsLearn/javascript/aws/lambda-kindlegen/layer/layer-kindlegen/qemu-i386-static /home/rumen/ProjectsLearn/javascript/aws/lambda-kindlegen/layer/layer-kindlegen/kindlegen ${inFilePath}`);

console.log('kindlegen result:', child_process );
