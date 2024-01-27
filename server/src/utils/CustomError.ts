export default class CustomError extends Error {
    private statusCode: number;

    constructor(code: number, message: string, name: string = 'Custom Error') {
        super(message);
        this.statusCode = code;
        this.message = message;
        this.name = name;
    }

    public getStatusCode(): number {
        return this.statusCode;
    }

    public getMessage(): string {
        return this.message;
    }

    public getName(): string {
        return this.name;
    }

    public getStack(): string {
        return this.stack as string;
    }
}
