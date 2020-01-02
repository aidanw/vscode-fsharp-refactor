import { inlineLet } from "../extension-commands";
import {
    createSelection,
    runComparisonTest,
} from "./utils";

suite("Extension 'inlineLet' Command Tests", () => {

    // add comparison tests to array
    /* tslint:disable:object-literal-sort-keys */
    [{
        description: "should inline let binding from declaration (example 2)",
        content: `let inlineTest arg1 =
        let inlineMe = 1 + arg1
        inlineMe * 2 / (3 - inlineMe)`,
        expectedContent: `let inlineTest arg1 =
        (1 + arg1) * 2 / (3 - (1 + arg1))`,
        // select inlineMe binding on line 1
        selection: createSelection(1, 12, 1, 12),
        action: inlineLet,
    },
    {
        description: "should inline let binding from usage (still example 2)",
        content: `let inlineTest arg1 =
        let inlineMe = 1 + arg1
        inlineMe * 2 / (3 - inlineMe)`,
        expectedContent: `let inlineTest arg1 =
        (1 + arg1) * 2 / (3 - (1 + arg1))`,
        // select last inlineMe on line 2
        selection: createSelection(2, 30, 2, 30),
        action: inlineLet,
    },
    {
        description: "should inline let binding from usage with binding at beginning of context (example 3)",
        content: `let inlineTest arg1 =
        let inlineMe = 1 + arg1
        let dontInline = 12345
        inlineMe * 2 / (3 - inlineMe) + dontInline`,
        expectedContent: `let inlineTest arg1 =
        let dontInline = 12345
        (1 + arg1) * 2 / (3 - (1 + arg1)) + dontInline`,
        // select inlineMe binding on line 3
        selection: createSelection(3, 30, 3, 30),
        action: inlineLet,
    },
    {
        description: "should inline let binding from declaration leaving similar binding name (example 8)",
        content: `let inlineTestSimilarName arg1 =
        let inlineMe = 1 + arg1
        let inlineMeWithSimilarName = inlineMe * 2 / (3 - inlineMe)
        inlineMeWithSimilarName`,
        expectedContent: `let inlineTestSimilarName arg1 =
        let inlineMeWithSimilarName = (1 + arg1) * 2 / (3 - (1 + arg1))
        inlineMeWithSimilarName`,
        // select inlineMe binding on line 1
        selection: createSelection(1, 12, 1, 12),
        action: inlineLet,
    },
    {
        description: "should inline let binding from usage at end of context leaving similar binding name (example 9)",
        content: `let inlineTestSimilarName2 arg1 =
        let inlineMe = 1 + arg1
        let inlineMeWithSimilarName = inlineMe * 2 / (3 - inlineMe)
        inlineMeWithSimilarName`,
        expectedContent: `let inlineTestSimilarName2 arg1 =
        let inlineMeWithSimilarName = (1 + arg1) * 2 / (3 - (1 + arg1))
        inlineMeWithSimilarName`,
        // select inlineMe binding on line 2
        selection: createSelection(2, 59, 2, 67),
        action: inlineLet,
    },
    {
        description: "should inline let binding from usage with empty line below (example 10)",
        content:
`test "Y" {
    let expectedEvents = []

    equal [] expectedEvents ""
}`,
        expectedContent:
`test "Y" {

    equal [] ([]) ""
}`,
        // select expectedEvents binding on line 2
        selection: createSelection(1, 10, 1, 10),
        action: inlineLet,
    }]
    .forEach(runComparisonTest);

});
