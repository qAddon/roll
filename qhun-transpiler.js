var Transpiler = require("@wartoshika/qhun-transpiler");

new Transpiler.Api("wow", {
    entrypoint: "./src/initialization.ts",
    watch: true,
    configuration: {
        printFileHeader: true,
        targetConfig: {
            interface: 11302,
            visibleName: "|cff255475q|rRoll",
            savedVariablesPerCharacter: ["qRollPerCharacter"]
        },
        project: {
            name: "QRoll"
        }
    }
}).transpile().subscribe(pipeline => {

    pipeline.persistAllFiles()
        .prettyPrintResult()
        .applyPostProjectTranspile();

});
