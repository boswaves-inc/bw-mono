import { dirname, join } from 'path';
import { Project, VariableDeclarationKind, ts } from 'ts-morph';
import { createAuxiliaryTypeStore, printNode, zodToTs } from 'zod-to-ts';
import { load } from '../src/routes';
import _ from 'lodash';
import { toPascalCase, } from 'string-transform';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __input = join(__dirname, '../src/routes');
const __output = join(__dirname, '../../sdk/src/schema.ts');

const run = async () => {
  const project = new Project();

  const store = createAuxiliaryTypeStore()
  const file = project.createSourceFile(__output, '', { overwrite: true, });

  file.insertText(0, '// AUTO-GENERATED - DO NOT EDIT');

  const modules = await load(__input)
  const topics = Object.keys(modules)

  for (const topic in modules) {
    const { module, key } = modules[topic]
    const { node } = zodToTs(module.schema, {
      auxiliaryTypeStore: store
    })

    file.addTypeAlias({
      isExported: true,
      name: toPascalCase(`${key}_args`),
      type: printNode(node),
    });
  }

  file.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [{
      name: 'TOPICS',
      initializer: `[\n${topics.map(t => `  '${t}',`).join('\n')}\n] as const`,
    }],
  });


  file.addTypeAlias({
    isExported: true,
    name: 'Topic',
    type: '(typeof TOPICS)[number]',
  });

  file.formatText({
    indentSize: 2,
    convertTabsToSpaces: true,
    semicolons: ts.SemicolonPreference.Insert
  });

  await file.save();
}

run()