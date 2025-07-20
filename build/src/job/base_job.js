export class BaseJob {
    static get jobName() {
        return this.name;
    }
    async handle(_context) {
        throw new Error('handle() must be implemented in subclass');
    }
    async failed(_job, _error) {
        // Optionally override in subclass
    }
}
