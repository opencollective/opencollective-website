import fs from 'fs';
import svg_to_png from 'svg-to-png';
import crypto from 'crypto';
import Promise from 'bluebird';

var readFile = Promise.promisify(fs.readFile);

module.exports = {
    /**
     * Converts an svg string into a PNG data blob
     * (returns a promise)
     */
    svg2png: (svg) => {
        const md5 = crypto.createHash('md5').update(svg).digest("hex");
        const svgFilePath = `/tmp/${md5}.svg`;
        const outputDir = `/tmp`;
        const outputFile = `${outputDir}/${md5}.png`;
        fs.writeFileSync(svgFilePath, svg);
        
        return svg_to_png.convert(svgFilePath, outputDir)
                .then(() => readFile(outputFile));
    }
}