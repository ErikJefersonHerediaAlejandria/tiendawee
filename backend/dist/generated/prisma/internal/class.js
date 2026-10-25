"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = __importStar(require("@prisma/client/runtime/client"));
const config = {
    "previewFeatures": [],
    "clientVersion": "7.10.1",
    "engineVersion": "d1b3f377ca835d73fd50954a5e22128b9ebdd6b8",
    "activeProvider": "postgresql",
    "inlineSchema": "generator client {\n  provider = \"prisma-client\"\n  output   = \"../generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel Product {\n  id          Int      @id @default(autoincrement())\n  name        String   @db.VarChar(150)\n  description String?  @db.Text\n  price       Decimal  @db.Decimal(10, 2)\n  stock       Int      @default(0)\n  isActive    Boolean  @default(true)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  @@index([name])\n  @@index([isActive])\n  @@map(\"products\")\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    },
    "parameterizationSchema": {
        "strings": [],
        "graph": ""
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"Product\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"stock\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"products\",\"schema\":null}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"Product.findUnique\",\"Product.findUniqueOrThrow\",\"orderBy\",\"cursor\",\"Product.findFirst\",\"Product.findFirstOrThrow\",\"Product.findMany\",\"data\",\"Product.createOne\",\"Product.createMany\",\"Product.createManyAndReturn\",\"Product.updateOne\",\"Product.updateMany\",\"Product.updateManyAndReturn\",\"create\",\"update\",\"Product.upsertOne\",\"Product.deleteOne\",\"Product.deleteMany\",\"having\",\"_count\",\"_avg\",\"_sum\",\"_min\",\"_max\",\"Product.groupBy\",\"Product.aggregate\",\"AND\",\"OR\",\"NOT\",\"id\",\"name\",\"description\",\"price\",\"stock\",\"isActive\",\"createdAt\",\"updatedAt\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"contains\",\"startsWith\",\"endsWith\",\"set\",\"increment\",\"decrement\",\"multiply\",\"divide\"]"),
    graph: "QQsQCxwAAC8AMB0AAAQAEB4AAC8AMB8CAAAAASABADEAISEBADIAISIQADMAISMCADAAISQgADQAISVAADUAISZAADUAIQEAAAABACABAAAAAQAgCxwAAC8AMB0AAAQAEB4AAC8AMB8CADAAISABADEAISEBADIAISIQADMAISMCADAAISQgADQAISVAADUAISZAADUAIQEhAAA2ACADAAAABAAgAwAABQAwBAAAAQAgAwAAAAQAIAMAAAUAMAQAAAEAIAMAAAAEACADAAAFADAEAAABACAIHwIAAAABIAEAAAABIQEAAAABIhAAAAABIwIAAAABJCAAAAABJUAAAAABJkAAAAABAQgAAAkAIAgfAgAAAAEgAQAAAAEhAQAAAAEiEAAAAAEjAgAAAAEkIAAAAAElQAAAAAEmQAAAAAEBCAAACwAwAQgAAAsAMAgfAgA_ACEgAQA8ACEhAQA9ACEiEAA-ACEjAgA_ACEkIABAACElQABBACEmQABBACECAAAAAQAgCAAADgAgCB8CAD8AISABADwAISEBAD0AISIQAD4AISMCAD8AISQgAEAAISVAAEEAISZAAEEAIQIAAAAEACAIAAAQACACAAAABAAgCAAAEAAgAwAAAAEAIA8AAAkAIBAAAA4AIAEAAAABACABAAAABAAgBhUAADcAIBYAADgAIBcAADsAIBgAADoAIBkAADkAICEAADYAIAscAAAaADAdAAAXABAeAAAaADAfAgAbACEgAQAcACEhAQAdACEiEAAeACEjAgAbACEkIAAfACElQAAgACEmQAAgACEDAAAABAAgAwAAFgAwFAAAFwAgAwAAAAQAIAMAAAUAMAQAAAEAIAscAAAaADAdAAAXABAeAAAaADAfAgAbACEgAQAcACEhAQAdACEiEAAeACEjAgAbACEkIAAfACElQAAgACEmQAAgACENFQAAIgAgFgAALgAgFwAAIgAgGAAAIgAgGQAAIgAgJwIAAAABKAIAAAAEKQIAAAAEKgIAAAABKwIAAAABLAIAAAABLQIAAAABLgIALQAhDhUAACIAIBgAACwAIBkAACwAICcBAAAAASgBAAAABCkBAAAABCoBAAAAASsBAAAAASwBAAAAAS0BAAAAAS4BACsAIS8BAAAAATABAAAAATEBAAAAAQ4VAAApACAYAAAqACAZAAAqACAnAQAAAAEoAQAAAAUpAQAAAAUqAQAAAAErAQAAAAEsAQAAAAEtAQAAAAEuAQAoACEvAQAAAAEwAQAAAAExAQAAAAENFQAAIgAgFgAAJwAgFwAAJwAgGAAAJwAgGQAAJwAgJxAAAAABKBAAAAAEKRAAAAAEKhAAAAABKxAAAAABLBAAAAABLRAAAAABLhAAJgAhBRUAACIAIBgAACUAIBkAACUAICcgAAAAAS4gACQAIQsVAAAiACAYAAAjACAZAAAjACAnQAAAAAEoQAAAAAQpQAAAAAQqQAAAAAErQAAAAAEsQAAAAAEtQAAAAAEuQAAhACELFQAAIgAgGAAAIwAgGQAAIwAgJ0AAAAABKEAAAAAEKUAAAAAEKkAAAAABK0AAAAABLEAAAAABLUAAAAABLkAAIQAhCCcCAAAAASgCAAAABCkCAAAABCoCAAAAASsCAAAAASwCAAAAAS0CAAAAAS4CACIAIQgnQAAAAAEoQAAAAAQpQAAAAAQqQAAAAAErQAAAAAEsQAAAAAEtQAAAAAEuQAAjACEFFQAAIgAgGAAAJQAgGQAAJQAgJyAAAAABLiAAJAAhAicgAAAAAS4gACUAIQ0VAAAiACAWAAAnACAXAAAnACAYAAAnACAZAAAnACAnEAAAAAEoEAAAAAQpEAAAAAQqEAAAAAErEAAAAAEsEAAAAAEtEAAAAAEuEAAmACEIJxAAAAABKBAAAAAEKRAAAAAEKhAAAAABKxAAAAABLBAAAAABLRAAAAABLhAAJwAhDhUAACkAIBgAACoAIBkAACoAICcBAAAAASgBAAAABSkBAAAABSoBAAAAASsBAAAAASwBAAAAAS0BAAAAAS4BACgAIS8BAAAAATABAAAAATEBAAAAAQgnAgAAAAEoAgAAAAUpAgAAAAUqAgAAAAErAgAAAAEsAgAAAAEtAgAAAAEuAgApACELJwEAAAABKAEAAAAFKQEAAAAFKgEAAAABKwEAAAABLAEAAAABLQEAAAABLgEAKgAhLwEAAAABMAEAAAABMQEAAAABDhUAACIAIBgAACwAIBkAACwAICcBAAAAASgBAAAABCkBAAAABCoBAAAAASsBAAAAASwBAAAAAS0BAAAAAS4BACsAIS8BAAAAATABAAAAATEBAAAAAQsnAQAAAAEoAQAAAAQpAQAAAAQqAQAAAAErAQAAAAEsAQAAAAEtAQAAAAEuAQAsACEvAQAAAAEwAQAAAAExAQAAAAENFQAAIgAgFgAALgAgFwAAIgAgGAAAIgAgGQAAIgAgJwIAAAABKAIAAAAEKQIAAAAEKgIAAAABKwIAAAABLAIAAAABLQIAAAABLgIALQAhCCcIAAAAASgIAAAABCkIAAAABCoIAAAAASsIAAAAASwIAAAAAS0IAAAAAS4IAC4AIQscAAAvADAdAAAEABAeAAAvADAfAgAwACEgAQAxACEhAQAyACEiEAAzACEjAgAwACEkIAA0ACElQAA1ACEmQAA1ACEIJwIAAAABKAIAAAAEKQIAAAAEKgIAAAABKwIAAAABLAIAAAABLQIAAAABLgIAIgAhCycBAAAAASgBAAAABCkBAAAABCoBAAAAASsBAAAAASwBAAAAAS0BAAAAAS4BACwAIS8BAAAAATABAAAAATEBAAAAAQsnAQAAAAEoAQAAAAUpAQAAAAUqAQAAAAErAQAAAAEsAQAAAAEtAQAAAAEuAQAqACEvAQAAAAEwAQAAAAExAQAAAAEIJxAAAAABKBAAAAAEKRAAAAAEKhAAAAABKxAAAAABLBAAAAABLRAAAAABLhAAJwAhAicgAAAAAS4gACUAIQgnQAAAAAEoQAAAAAQpQAAAAAQqQAAAAAErQAAAAAEsQAAAAAEtQAAAAAEuQAAjACEAAAAAAAABMgEAAAABATIBAAAAAQUyEAAAAAEzEAAAAAE0EAAAAAE1EAAAAAE2EAAAAAEFMgIAAAABMwIAAAABNAIAAAABNQIAAAABNgIAAAABATIgAAAAAQEyQAAAAAEAAAAABRUABhYABxcACBgACRkACgAAAAAABRUABhYABxcACBgACRkACgECAQIDAQUGAQYHAQcIAQkKAQoMAgsNAwwPAQ0RAg4SBBETARIUARMVAhoYBRsZCw"
};
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await import('node:buffer');
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js"),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js");
        return await decodeBase64AsWasm(wasm);
    },
    importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map