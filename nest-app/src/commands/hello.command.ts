// service.ts - a nestjs provider using console decorators
import { Console, Command, createSpinner } from 'nestjs-console';

@Console()
export class HelloCommand {
  @Command({
    command: 'hello <name>',
    description: 'Demo for NestJS Command',
  })
  async hello(name: string): Promise<void> {
    const spin = createSpinner();
    try {
      // See Ora npm package for details about spinner
      spin.start(`Start choosing action for ${name}`);

      // simulate a long task of 1 seconds
      const result = await new Promise((done) =>
        setTimeout(() => done(`Hello ${name}`), 1000),
      );

      spin.succeed('Choosing done');

      // send the response to the  cli
      // you could also use process.stdout.write()
      console.log(JSON.stringify(result));
    } catch (error) {
      spin.fail('Choosing fail');
    }
  }
}
