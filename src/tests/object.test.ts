import Ajv from "ajv";

import { FromSchema } from "../index";
import { DoesBothExtend } from "../utils";
import { Schema } from "../schema";

import * as instances from "./instances";
import { expectInstances } from "./helpers";

var ajv = new Ajv();

describe("object schema", () => {
  it("without properties", () => {
    const petSchema = { type: "object" } as const;

    type Pet = FromSchema<typeof petSchema>;

    let assertPet: DoesBothExtend<Pet, object>;
    assertPet = true;

    let petInstance: Pet;
    petInstance = {};
    expect(ajv.validate(petInstance, petSchema)).toBe(true);

    expectInstances
      .list(["object1", "object2", "object3", "object4", "object5"])
      .toBeValidAgainst(petSchema);
    expectInstances
      .allExcept(["object1", "object2", "object3", "object4", "object5"])
      .toBeInvalidAgainst(petSchema);
  });

  it("without required", () => {
    const catSchema: Schema = {
      type: "object",
      properties: { age: { type: "number" }, name: { type: "string" } },
    } as const;

    type Cat = FromSchema<typeof catSchema>;

    let assertCat: DoesBothExtend<Cat, { age?: number; name?: string }>;
    assertCat = true;

    let catInstance: Cat;
    catInstance = {};
    expect(ajv.validate(catInstance, catSchema)).toBe(true);

    catInstance = instances.object1;
    expect(ajv.validate(catInstance, catSchema)).toBe(true);

    catInstance = instances.object2;
    expect(ajv.validate(catInstance, catSchema)).toBe(true);

    expectInstances
      .allExcept(["object1", "object2", "object3", "object4", "object5"])
      .toBeInvalidAgainst(catSchema);
  });

  it("with required", () => {
    const dogSchema = {
      type: "object",
      properties: {
        age: { type: "number" },
        name: { type: "string" },
        hobbies: {
          type: "array",
          items: { type: "string" },
        },
        other: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
            },
            required: ["title"],
          },
        },
      },
      required: ["name", "age", "hobbies"],
    } as const;

    type Dog = FromSchema<typeof dogSchema>;

    let assertDog: DoesBothExtend<
      Dog,
      {
        name: string;
        age: number;
        hobbies: string[];
        other?: {
          title: string;
          description?: string;
        }[];
      }
    >;
    assertDog = true;

    let dogInstance: Dog;
    dogInstance = instances.object3;
    expect(ajv.validate(dogSchema, dogInstance)).toBe(true);

    dogInstance = instances.object4;
    expect(ajv.validate(dogSchema, dogInstance)).toBe(true);

    dogInstance = instances.object5;
    expect(ajv.validate(dogSchema, dogInstance)).toBe(true);

    expectInstances
      .allExcept(["object3", "object4", "object5"])
      .toBeInvalidAgainst(dogSchema);
  });
});