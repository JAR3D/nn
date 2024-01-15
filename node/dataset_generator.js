const draw = require('../common/draw.js');

const constants = {};

constants.DATA_DIR = '../data';
constants.RAW_DIR = `${constants.DATA_DIR}/raw`;
constants.DATASET_DIR = `${constants.DATA_DIR}/dataset`;
constants.JSON_DIR = `${constants.DATASET_DIR}/json`;
constants.IMG_DIR = `${constants.DATASET_DIR}/img`;
constants.SAMPLES = `${constants.DATASET_DIR}/samples.json`;

const fs = require('fs');

const fileNames = fs.readdirSync(constants.RAW_DIR);
const samples = [];

let id = 1;

fileNames.forEach(fileName => {
    const content = fs.readFileSync(`${constants.RAW_DIR}/${fileName}`, 'utf8');
    const { session, student, drawings } = JSON.parse(content);

    for (const label in drawings) {
        samples.push({
            id,
            student_id: session,
            student_name: student,
            label
        });

        const paths = drawings[label];
        fs.writeFileSync(`${constants.JSON_DIR}/${id}.json`, JSON.stringify(paths, null, 4), 'utf8');

        generateImageFile(constants.IMG_DIR + '/' + id + '.png', paths);

        id++;
    }
})

fs.writeFileSync(constants.SAMPLES, JSON.stringify(samples, null, 4), 'utf8');

function generateImageFile(outFile, paths) {
    draw.paths(ctx, paths);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outFile, buffer);
}