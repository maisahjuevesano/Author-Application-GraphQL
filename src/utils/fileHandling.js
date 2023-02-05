//här samlar vi alla helper function tex kolla om en funktion gör det man vill göra

const fsPromises = require('fs/promises')
const { fileURLToPath } = require('url')
exports.fileExists = async(filePath) => !!(await fsPromises.stat(filePath).catch((e)=>false))
exports.readJsonFile = async (filePath) => JSON.parse(await fsPromises.readFile(filePath, {encoding: 'utf-8'}))



//detta genererar en error om den inte hittar en fil
//slår det en error då vet vi att filen inte finns.