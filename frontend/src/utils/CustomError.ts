export class CustomError extends Error {
    private statusCode: number;
    private messageObj: object;

    constructor(
        code: number,
        message: string | object,
        name: string = "Custom Error"
    ) {
        if (typeof message === "object") {
            super(JSON.stringify(message));
            this.messageObj = message;
        } else {
            super(message);
            this.messageObj = {};
        }

        this.statusCode = code;
        this.name = name;
    }

    public getStatusCode(): number {
        return this.statusCode;
    }

    public getMessage(): string | object {
        return Object.keys(this.messageObj).length > 0
            ? this.messageObj
            : this.message;
    }

    public getName(): string {
        return this.name;
    }

    public getStack(): string {
        return this.stack as string;
    }
}
