import { dirname, join } from 'path';
import { Project, SourceFile, VariableDeclarationKind, ts } from 'ts-morph';
import { createAuxiliaryTypeStore, printNode, zodToTs } from 'zod-to-ts';
import { toPascalCase, } from 'string-transform';
import { fileURLToPath } from 'url';
import { loadBlockMap, loadRouteMap } from '../src/utils';
import _ from 'lodash';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const write = async (output: string, tx: (file: SourceFile) => Promise<void>) => {
  const project = new Project();
  const file = project.createSourceFile(output, '', { overwrite: true, });

  file.insertText(0, '// AUTO-GENERATED - DO NOT EDIT');

  await tx(file)

  file.formatText({
    indentSize: 2,
    convertTabsToSpaces: true,
    semicolons: ts.SemicolonPreference.Insert
  });

  await file.save();
}

const gen_routes = async () => {
  const output = join(__dirname, '../../sdk/src/gen/routes.ts');
  const store = createAuxiliaryTypeStore()

  await write(output, async file => {
    const map = await loadRouteMap()
    const topics = Object.keys(map)

    file.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [{
        name: 'TOPICS',
        initializer: `[\n${topics.map(t => `  '${t}',`).join('\n')}\n] as const`,
      }],
    });

    for (const topic in map) {
      const { module, key } = map[topic]
      const { node } = zodToTs(module.schema, {
        auxiliaryTypeStore: store
      })


      file.addTypeAlias({
        isExported: true,
        name: toPascalCase(`${key}_args`),
        type: printNode(node),
      });
    }

    file.addTypeAlias({
      isExported: true,
      name: 'TopicArgsMap',
      type: `{\n${topics.map(t => `  '${t}': ${toPascalCase(`${map[t].key}_args`)},`).join('\n')}\n}`
    });

    file.addTypeAlias({
      isExported: true,
      name: 'Topic',
      type: '(typeof TOPICS)[number]',
    });

    file.addTypeAlias({
      isExported: true,
      name: 'TopicArgs<T extends Topic>',
      type: 'TopicArgsMap[T]',
    });

  })
}

const gen_blocks = async () => {
  const output = join(__dirname, '../../sdk/src/gen/blocks.ts');
  const store = createAuxiliaryTypeStore()

  await write(output, async file => {
    const map = await loadBlockMap()
    const types = Object.keys(map)

    file.addTypeAlias({
      isExported: true,
      name: 'Primitive',
      type: `string | number`
    });

    for (const type in map) {
      const module = map[type]

      if (module.schema) {
        const { node } = zodToTs(module.schema, {
          auxiliaryTypeStore: store
        })

        file.addTypeAlias({
          isExported: true,
          name: toPascalCase(`${type}-props`),
          type: printNode(node),
        });
      }
    }

    file.addTypeAlias({
      isExported: true,
      name: 'BlockPropsMap',
      type: `{\n${types.map(t => `  '${t}': ${toPascalCase(`${t}-props`)},`).join('\n')}\n}`
    });

    file.addTypeAlias({
      isExported: true,
      name: 'BlockType',
      type: 'keyof BlockPropsMap',
    });

    file.addTypeAlias({
      isExported: true,
      name: 'Block',
      type: `{\n[K in BlockType]: BlockPropsMap[K] & { type: K,\ncontent: (Block | Primitive)[] | Block | Primitive\n}\n}[BlockType]`,
    });
  });
}

const run = async () => {
  await gen_blocks()
  await gen_routes()
}

run()