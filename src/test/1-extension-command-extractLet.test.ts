import { extractLet } from "../extension-commands";
import {
    createSelection,
    runComparisonTest,
} from "./utils";

suite("Extension 'extractLet' Command Tests", () => {

    // add comparison tests to array
    /* tslint:disable:object-literal-sort-keys */
    [{
        description: "should extract let binding (example 1)",
        content: `let test arg1 =
        let added = 1 + arg1
        let multi = added * 10 * arg1
        multi / 2`,
        expectedContent: `let test arg1 =
        let added = 1 + arg1
        let extracted = 10 * arg1
        let multi = added * extracted
        multi / 2`,
        // select '10 * arg1'
        selection: createSelection(2, 28, 2, 37),
        action: extractLet,
    },
    {
        description: "should extract unary function to let binding (example 4)",
        content: `let extractLet chars =
        let noSpaces = chars |> Array.filter ((<>) ' ')
        noSpaces`,
        expectedContent: `let extractLet chars =
        let extracted = ((<>) ' ')
        let noSpaces = chars |> Array.filter extracted
        noSpaces`,
        // select i((<>) ' ') on line 1
        selection: createSelection(1, 45, 1, 55),
        action: extractLet,
    },
    {
        description: "should extract parameterised function to let binding (example 5)",
        content: `let extractLambda o =
        let res = (o |> Array.fold (fun acc n -> (n |> Array.toList) @ acc ) []).Head
        res`,
        expectedContent: `let extractLambda o =
        let extracted acc n = (n |> Array.toList) @ acc
        let res = (o |> Array.fold extracted []).Head
        res`,
        // select (fun acc n -> (n |> Array.toList) @ acc ) on line 1
        selection: createSelection(1, 35, 1, 76),
        action: extractLet,
    },
    {
        description: "should extract let binding when selection contains a lambda and other expressions (issue 6)",
        content:
`let getter() = [1;2]
let extractLambda =
    let res = getter() |> List.map (fun a -> a * 2) |> List.sum
    res`,
        expectedContent:
`let getter() = [1;2]
let extractLambda =
    let extracted = getter() |> List.map (fun a -> a * 2)
    let res = extracted |> List.sum
    res`,
        // select getter() |> List.map (fun a -> a * 2) on line 2
        selection: createSelection(2, 14, 2, 51),
        action: extractLet,
    }]
    .forEach(runComparisonTest);

});
