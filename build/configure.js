/*
|--------------------------------------------------------------------------
| Configure hook
|--------------------------------------------------------------------------
|
| The configure hook is called when someone runs "node ace configure <package>"
| command. You are free to perform any operations inside this function to
| configure the package.
|
| To make things easier, you have access to the underlying "ConfigureCommand"
| instance and you can use codemods to modify the source files.
|
*/
import { stubsRoot } from './stubs/main.js';
export async function configure(command) {
    const codemods = await command.createCodemods();
    /**
     * Publish config file
     */
    await codemods.makeUsingStub(stubsRoot, 'stubs/config/bullmq.stub', {});
    /**
     * Register provider
     */
    await codemods.updateRcFile((rcFile) => {
        rcFile.addProvider('@recordset/adonis6-bullmq/bullmq_provider');
        rcFile.addCommand('@recordset/adonis6-bullmq/commands');
    });
}
