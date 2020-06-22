#!/usr/bin/env node
const aws = require('aws-sdk');
const program = require('commander');

program
  .command('restore')
  .description('Creates new indices in the provided ES domain')
  .requiredOption(
    '-p, --packageDir [string]',
    'The serverless package directory'
  )
  .requiredOption("-e, --environment [string]", "The environment to deploy")
  .option(
    "-l, --limit [number]",
    "The number of items to limit the table scan to. Default is 300",
    300
  )
  .action((options) => restore(options));

program.parse(process.argv);

async function restore(options) {
  const environment = options.environment;
  const packageDir = options.packageDir;
  const configFileName = `${packageDir}/serverless.${environment}.yml`;
  const serverlessConfigFile = require('fs').readFileSync(configFileName, 'utf8');
  const config = require('js-yaml').safeLoad(serverlessConfigFile);
  const region = config.Region;

  aws.config.update( { region: region })
  const params = require('./device-indexing-table-params.json');
  const docClient = new aws.DynamoDB.DocumentClient( { region: region });
  const scanParams = {
    TableName: config.DeviceIndexingDynamoDbName,
    ExpressionAttributeNames: params.ReservedNameReplacements,
    ProjectionExpression: params.IndexedTableColumnsFilter
  };

  const client = new require('elasticsearch').Client({
    hosts: [ `https://${config.ElaticsearchEndpointRef}` ],
    connectionClass: require('http-aws-es')
  });

  let now = new Date();
  const index = `devices_${now.getMonth() + 1}_${now.getDate()}_${now.getFullYear()}`;
  while (true) {
    try {
      const data = await docClient.scan(scanParams).promise();
      await bulkIndex(client, index, data.Items);

      let lastEvaluatedKey = data.LastEvaluatedKey;
      if (!lastEvaluatedKey) {
        console.log('End of data reached.')

        await updateAliases(
          client, 
          index, 
          params.CurrentIndex, 
          config.ElasticsearchReadAlias,
          config.ElasticsearchWriteAlias)

        await runNpx('create_domain', environment, region, packageDir);
        await runNpx('deploy', environment, region, packageDir);

        break;
      }
    } catch (error) {
      throw (error);
    }
  }
}

async function bulkIndex(client, index, items) {
  try { 
    const bulkActions = [];
    items.forEach((item, i) => {
      bulkActions.push({
        index: {
          "_index": index,
          "_id": i + 1,
          "_type": "_doc",
        }
      });
      bulkActions.push(item);
    });

    let actions = "";
    bulkActions.forEach((action) => {
      actions += JSON.stringify(action) + '\n'
    });

    await client.bulk({
      index: index,
      type: '_doc',
      body: actions,
      refresh: true
    });

  } catch (error) {
      throw error;
  }
}

async function updateAliases(client, index, currentIndex, readAlias, writeAlias) {
  try { 
    const aliasActions ={ 'actions': [
      { 'remove': { 'index': currentIndex, 'alias': readAlias } },
      { 'remove': { 'index': currentIndex, 'alias': writeAlias } },
      { 'add': { 'index': index, 'alias': readAlias } },
      { 'add': { 'index': index, 'alias': writeAlias } }
    ]};
    const updateResp = await client.indices.updateAliases({ body: aliasActions });
    if (updateResp) {
      if(!updateResp.acknowledged) {
        throw('Aliases were not updated');
      }
    }
  } catch (error) {
      throw error;
  }
}

function runNpx(slsCommand, environment, region, packageDir) {
  let npxProcess;
  const promise = new Promise((resolve, reject) => {
    const {spawn} = require('child_process');
    const args = [
      'sls', `${slsCommand}`, 
      '-s', `${environment}`,
      '-r', `${region}`
    ];

    const options = {
      'cwd': `${packageDir}`
    }

    npxProcess = spawn('npx', args, options);

    npxProcess.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    npxProcess.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    npxProcess.on('close', (code) => {
      console.log(`npx process exited with code ${code}`);

      if (code !== 0) {
        process.exit(code);
      }

      resolve();
    });
  }); 

  return promise;
}
