<!-- RTTI\docs\performance_testing.md -->

## Artillery spike test (60 s @ 20 RPS)

rgs: {},
      argv: [ 'results.json' ],
      context: DinoCommand {
        argv: [ 'results.json' ],
        config: Config {
          options: {
            root: 'C:\\Users\\earls\\DEV\\real-time-threat-intelligence\\RTTI\\node_modules\\artillery\\bin\\run'
          },
          arch: 'x64',
          bin: 'artillery',
          binAliases: undefined,
          binPath: undefined,
          cacheDir: 'C:\\Users\\earls\\AppData\\Local\\artillery',
          channel: 'stable',
          configDir: 'C:\\Users\\earls\\AppData\\Local\\artillery',
          dataDir: 'C:\\Users\\earls\\AppData\\Local\\artillery',
          dirname: 'artillery',
          flexibleTaxonomy: false,
          home: 'C:\\Users\x1Barls',
          isSingleCommandCLI: false,
          name: 'artillery',
          npmRegistry: undefined,
          nsisCustomization: undefined,
          pjson: {
            name: 'artillery',
            version: '2.0.22',
            description: 'Cloud-scale load testing. https://www.artillery.io',
            main: './lib',
            engines: [Object],
            files: [Array],
            oclif: [Object],
            scripts: [Object],
            tap: [Object],
            'lint-staged': [Object],
            keywords: [Array],
            author: 'Hassy Veldstra <h@veldstra.org>',
            contributors: [Array],
            license: 'MPL-2.0',
            preferGlobal: true,
            man: './man/artillery.1',
            bin: [Object],
            repository: [Object],
            bugs: [Object],
            dependencies: [Object],
            devDependencies: [Object]
          },
          platform: 'win32',
          plugins: Map(3) {
            'artillery' => [Plugin],
            '@oclif/plugin-help' => [Plugin],
            '@oclif/plugin-not-found' => [Plugin]
          },
          root: 'C:\\Users\\earls\\DEV\\real-time-threat-intelligence\\RTTI\\node_modules\\artillery',
          shell: 'C:\\Program Files\\Git\\usr\\bin\\bash.exe',
          theme: undefined,
          topicSeparator: ':',
          updateConfig: { s3: [Object], node: {} },
          userAgent: 'artillery/2.0.22 win32-x64 node-v23.9.0',
          userPJSON: undefined,
          valid: true,
          version: '2.0.22',
          warned: false,
          windows: true,
          _base: '@oclif/core@4.2.10',
          _commandIDs: [
            'dino',        'quick',
            'report',      'run',
            'run-aci',     'run:aci',
            'run-fargate', 'run:fargate',
            'run:ecs',     'run-ecs',
            'run-lambda',  'run:lambda',
            'help'
          ],
          _commands: Map(13) {
            'dino' => [Object],
            'quick' => [Object],
            'report' => [Object],
            'run' => [Object],
            'run-aci' => [Object],
            'run:aci' => [Object],
            'run-fargate' => [Object],
            'run:fargate' => [Object],
            'run:ecs' => [Object],
            'run-ecs' => [Object],
            'run-lambda' => [Object],
            'run:lambda' => [Object],
            'help' => [Object]
          },
          _topics: Map(10) {
            'aws' => [Object],
            'pro' => [Object],
            'dino' => [Object],
            'quick' => [Object],
            'report' => [Object],
            'run' => [Object],
            'run-aci' => [Object],
            'run-fargate' => [Object],
            'run-lambda' => [Object],
            'help' => [Object]
          },
          commandPermutations: Permutations(13) [Map] {
            'dino' => [Set],
            'quick' => [Set],
            'report' => [Set],
            'run' => [Set],
            'run-aci' => [Set],
            'run:aci' => [Set],
            'run-fargate' => [Set],
            'run:fargate' => [Set],
            'run:ecs' => [Set],
            'run-ecs' => [Set],
            'run-lambda' => [Set],
            'run:lambda' => [Set],
            'help' => [Set],
            validPermutations: [Map]
          },
          pluginLoader: PluginLoader {
            options: [Object],
            errors: [],
            plugins: [Map],
            pluginsProvided: false
          },
          rootPlugin: Plugin {
            options: [Object],
            _base: '@oclif/core@4.2.10',
            _debug: [Function (anonymous)],
            alias: 'artillery',
            alreadyLoaded: false,
            children: [],
            commandIDs: [Array],
            commands: [Array],
            commandsDir: 'C:\\Users\\earls\\DEV\\real-time-threat-intelligence\\RTTI\\node_modules\\artillery\\lib\\cmds',
            hasManifest: false,
            hooks: [Object],
            isRoot: true,
            manifest: [Object],
            moduleType: 'commonjs',
            name: 'artillery',
            parent: undefined,
            pjson: [Object],
            root: 'C:\\Users\\earls\\DEV\\real-time-threat-intelligence\\RTTI\\node_modules\\artillery',
            tag: undefined,
            type: 'core',
            valid: true,
            version: '2.0.22',
            commandCache: undefined,
            commandDiscoveryOpts: [Object],
            flexibleTaxonomy: false
          },
          topicPermutations: Permutations(2) [Map] {
            'aws' => [Set],
            'pro' => [Set],
            validPermutations: [Map]
          }
        },
        debug: [Function (anonymous)],
        id: 'dino'
      },
      flags: {
        message: {
          parse: [AsyncFunction: parse],
          char: 'm',
          description: 'Tell dinosaur what to say',
          input: [],
          multiple: false,
          type: 'option',
          name: 'message'
        },
        rainbow: {
          parse: [AsyncFunction: parse],
          char: 'r',
          description: 'Add some color',
          allowNo: false,
          type: 'boolean',
          name: 'rainbow'
        },
        quiet: {
          parse: [AsyncFunction: parse],
          char: 'q',
          description: 'Quiet mode',
          allowNo: false,
          type: 'boolean',
          name: 'quiet'
        }
      },
      strict: true
    },
    output: {
      args: {},
      argv: [ 'results.json' ],
      flags: {},
      metadata: {
        flags: {
          rainbow: { setFromDefault: true },
          quiet: { setFromDefault: true }
        }
      },
      nonExistentFlags: [],
      raw: [ { arg: undefined, input: 'results.json', type: 'arg' } ]
    }
  },
  showHelp: true,
  args: [ 'results.json' 

### Bottlenecks
* p99 spikes on `/api/reports/threat` (PDF generation) – cache header/footer.
* Sequential scan on `threat_data.risk_score` until index added.

### Optimisations applied
* `CREATE INDEX idx_risk_score ON threat_data(risk_score);`
* Enabled `compression()` middleware in Express.
